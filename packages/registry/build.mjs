/* global console, process */
/**
 * Southpaw registry build.
 *
 * The single source for the docs demos and the shadcn CLI, following
 * shadcn's apps/v4 pattern. It reads the component source in packages/ui,
 * the token CSS in packages/tokens and the demos in packages/registry/examples,
 * and writes:
 *
 *   apps/docs/public/r/<name>.json      shadcn registry items (files inlined)
 *   apps/docs/public/r/registry.json    the registry manifest
 *   apps/docs/registry/__index__.ts     server metadata: name → files, deps
 *   apps/docs/registry/__components__.tsx  client map: example name → lazy component
 *
 * Installed files mirror packages/ui's layout under components/southpaw/, so the
 * relative imports inside the source (../../lib/cn, ../Button/Button) work
 * unchanged after `shadcn add`.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const uiSrc = path.join(root, "packages/ui/src");
const tokensSrc = path.join(root, "packages/tokens/src");
const examplesDir = path.join(here, "examples");
const docsDir = path.join(root, "apps/docs");
// REGISTRY_OUT_DIR redirects all output (tests build into a temp folder, so they
// never race a docs build writing the same files).
const outBase = process.env.REGISTRY_OUT_DIR ? path.resolve(process.env.REGISTRY_OUT_DIR) : null;
const outPublic = outBase ? path.join(outBase, "r") : path.join(docsDir, "public/r");
const outIndex = outBase ? path.join(outBase, "registry") : path.join(docsDir, "registry");

// TODO(domain): set SOUTHPAW_REGISTRY_URL (or NEXT_PUBLIC_SITE_URL) once the docs have a domain.
const SITE_URL = (
  process.env.SOUTHPAW_REGISTRY_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");
/** Registry namespace. Dependencies are `@southpaw/<name>`, so they don't depend on the base URL. */
const NAMESPACE = "@southpaw";
const TARGET_ROOT = "components/southpaw";
const SCHEMA_ITEM = "https://ui.shadcn.com/schema/registry-item.json";
const SCHEMA_REGISTRY = "https://ui.shadcn.com/schema/registry.json";
const IGNORED_PACKAGES = new Set(["react", "react-dom"]);

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
const itemRef = (name) => `${NAMESPACE}/${name}`;

/** Version ranges for npm dependencies, taken from the packages that own the source. */
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const versionRanges = Object.assign(
  {},
  ...[path.join(root, "packages/ui/package.json"), path.join(here, "package.json")].flatMap((p) => {
    const pkg = readJson(p);
    return [pkg.devDependencies ?? {}, pkg.peerDependencies ?? {}, pkg.dependencies ?? {}];
  }),
);
/** `name@range` when the range is known and isn't a workspace link; otherwise the bare name. */
const versioned = (name) => {
  const range = versionRanges[name];
  return range && !range.startsWith("workspace:") ? `${name}@${range}` : name;
};
const versionedDeps = (deps) => [...deps].sort().map(versioned);
const rel = (abs) => path.relative(root, abs).split(path.sep).join("/");
const isSource = (f) =>
  /\.(tsx?)$/.test(f) && !/\.(test|stories)\.tsx?$/.test(f) && !f.endsWith(".d.ts");

/** A file entry without its inlined source, for indexes. */
const withoutContent = ({ path: p, type, target }) => ({ path: p, type, target });

const IMPORT_RE =
  /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

function importsOf(code) {
  const out = [];
  for (const m of code.matchAll(IMPORT_RE)) out.push(m[1] ?? m[2]);
  return out;
}

function packageName(spec) {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** Read a file and classify its imports relative to packages/ui/src. */
async function analyse(absFile) {
  const content = await readFile(absFile, "utf8");
  const deps = new Set();
  const components = new Set();
  const libs = new Set();
  for (const spec of importsOf(content)) {
    if (spec.startsWith(".")) {
      const target = path.resolve(path.dirname(absFile), spec);
      const fromUi = path.relative(uiSrc, target).split(path.sep);
      if (fromUi[0] === "components" && fromUi[1]) components.add(fromUi[1]);
      else if (fromUi[0] === "lib") libs.add(fromUi.slice(1).join("/"));
    } else if (!IGNORED_PACKAGES.has(packageName(spec))) {
      deps.add(packageName(spec));
    }
  }
  return { content, deps, components, libs };
}

function libItemName(libPath) {
  return `lib-${libPath.replace(/\.(tsx?)$/, "").replace(/\//g, "-")}`;
}

function resolveLibFile(libPath) {
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    const abs = path.join(uiSrc, "lib", libPath + ext);
    if (existsSync(abs) && statSync(abs).isFile()) return abs;
  }
  return null;
}

const items = new Map(); // name → registry item

async function addTokensItem() {
  const files = (await readdir(tokensSrc)).filter((f) => f.endsWith(".css")).sort();
  items.set("southpaw-tokens", {
    name: "southpaw-tokens",
    type: "registry:file",
    title: "Southpaw tokens",
    description:
      "The --sp-* design tokens (themes, density, motion, focus ring). Import components/southpaw/tokens/index.css after tailwindcss.",
    dependencies: [],
    registryDependencies: [],
    files: await Promise.all(
      files.map(async (f) => ({
        path: rel(path.join(tokensSrc, f)),
        type: "registry:file",
        target: `${TARGET_ROOT}/tokens/${f}`,
        content: await readFile(path.join(tokensSrc, f), "utf8"),
      })),
    ),
  });
}

async function addLibItem(libPath) {
  const name = libItemName(libPath);
  if (items.has(name)) return name;
  const abs = resolveLibFile(libPath);
  if (!abs) throw new Error(`Cannot resolve lib import "${libPath}"`);
  items.set(name, { name }); // placeholder: stops import cycles recursing
  const { content, deps, components, libs } = await analyse(abs);
  const libDeps = [];
  for (const l of libs)
    libDeps.push(await addLibItem(path.posix.join(path.posix.dirname(libPath), l)));
  const subPath = path.relative(path.join(uiSrc, "lib"), abs).split(path.sep).join("/");
  items.set(name, {
    name,
    type: "registry:lib",
    dependencies: versionedDeps(deps),
    registryDependencies: [...libDeps, ...[...components].map(kebab)].map(itemRef).sort(),
    files: [
      { path: rel(abs), type: "registry:lib", target: `${TARGET_ROOT}/lib/${subPath}`, content },
    ],
  });
  return name;
}

async function addComponentItem(dir) {
  const name = kebab(dir);
  const absDir = path.join(uiSrc, "components", dir);
  const sources = (await readdir(absDir)).filter(isSource).sort();
  const deps = new Set();
  const regDeps = new Set([itemRef("southpaw-tokens")]);
  const files = [];
  for (const f of sources) {
    const abs = path.join(absDir, f);
    const a = await analyse(abs);
    a.deps.forEach((d) => deps.add(d));
    for (const c of a.components) if (c !== dir) regDeps.add(itemRef(kebab(c)));
    for (const l of a.libs) regDeps.add(itemRef(await addLibItem(l)));
    files.push({
      path: rel(abs),
      type: "registry:ui",
      target: `${TARGET_ROOT}/components/${dir}/${f}`,
      content: a.content,
    });
  }
  items.set(name, {
    name,
    type: "registry:ui",
    title: dir,
    dependencies: versionedDeps(deps),
    registryDependencies: [...regDeps].sort(),
    files,
  });
}

/** Demos import `@southpawui/ui/<Name>`; once installed that file lives under components/southpaw. */
function rewriteExample(code) {
  return code.replace(
    /(["'])@southpawui\/ui\/([A-Za-z]+)\1/g,
    (_m, q, c) => `${q}@/${TARGET_ROOT}/components/${c}/${c}${q}`,
  );
}

const examples = [];

async function addExamples() {
  const files = (await readdir(examplesDir)).filter((f) => f.endsWith(".tsx")).sort();
  for (const f of files) {
    const abs = path.join(examplesDir, f);
    const name = f.replace(/\.tsx$/, "");
    const { content, deps } = await analyse(abs);
    const uiDeps = importsOf(content)
      .map((s) => s.match(/^@southpawui\/ui\/([A-Za-z]+)/)?.[1])
      .filter(Boolean)
      .map(kebab);
    deps.delete("@southpawui/ui");
    examples.push(name);
    items.set(name, {
      name,
      type: "registry:example",
      dependencies: versionedDeps(deps),
      registryDependencies: [...new Set(uiDeps)].map(itemRef).sort(),
      files: [
        {
          path: rel(abs),
          type: "registry:example",
          target: `${TARGET_ROOT}/examples/${f}`,
          content: rewriteExample(content),
        },
      ],
    });
  }
}

async function main() {
  await addTokensItem();
  const dirs = (await readdir(path.join(uiSrc, "components"), { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  for (const d of dirs) await addComponentItem(d);
  await addExamples();

  await mkdir(outPublic, { recursive: true });
  await mkdir(outIndex, { recursive: true });

  const sorted = [...items.values()].sort((a, b) => a.name.localeCompare(b.name));
  for (const item of sorted) {
    await writeFile(
      path.join(outPublic, `${item.name}.json`),
      JSON.stringify({ $schema: SCHEMA_ITEM, ...item }, null, 2) + "\n",
    );
  }
  await writeFile(
    path.join(outPublic, "registry.json"),
    JSON.stringify(
      {
        $schema: SCHEMA_REGISTRY,
        name: "southpaw",
        homepage: SITE_URL,
        items: sorted.map(({ files, ...rest }) => ({
          ...rest,
          files: files.map(withoutContent),
        })),
      },
      null,
      2,
    ) + "\n",
  );

  const banner = "// This file is generated by packages/registry/build.mjs. Do not edit it.\n";
  const index = Object.fromEntries(
    sorted.map(({ files, ...rest }) => [rest.name, { ...rest, files: files.map(withoutContent) }]),
  );
  await writeFile(
    path.join(outIndex, "__index__.ts"),
    `${banner}import "server-only";\n\nimport type { RegistryIndex } from "./types";\n\nexport const SITE_URL = ${JSON.stringify(SITE_URL)};\n\nexport const Index: RegistryIndex = ${JSON.stringify(index, null, 2)};\n`,
  );
  await writeFile(
    path.join(outIndex, "__components__.tsx"),
    `${banner}"use client";\n\nimport * as React from "react";\n\nexport const Components: Record<string, React.LazyExoticComponent<React.ComponentType>> = {\n${examples
      .map(
        (n) =>
          `  ${JSON.stringify(n)}: React.lazy(() => import("@southpawui/registry/examples/${n}")),`,
      )
      .join("\n")}\n};\n`,
  );

  console.log(`Registry: ${sorted.length} items (${examples.length} examples) → ${rel(outPublic)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
