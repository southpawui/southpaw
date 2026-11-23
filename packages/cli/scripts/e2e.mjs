/* global console, process */
/**
 * End-to-end test for southpawui: real apps, real installs, real builds.
 *
 * 1. Builds the registry and serves apps/docs/public on a random local port.
 * 2. In the OS temp folder (outside this repo) it creates fresh apps:
 *    a) Next.js, npm, default @/ alias: init, add, build; re-runs; conflicts.
 *    b) Vite + React + Tailwind v4, pnpm, no path alias: init, add, build.
 *    c) Next.js with src/ and a ~/ alias: init, add an example, build.
 * 3. Prints a pass/fail line per check and exits 1 if anything failed.
 *
 * Needs the network (create-next-app, create-vite, npm/pnpm installs).
 * Run: pnpm --filter southpawui e2e   (builds the CLI first)
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const cli = path.join(here, "../dist/index.js");
const work = mkdtempSync(path.join(tmpdir(), "southpawui-e2e-"));
const only = process.argv.slice(2);

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `\n      ${detail}` : ""}`);
}

/** Runs a command; never through a shell. CI=1 keeps southpawui non-interactive. */
function run(cmd, args, cwd, { allowFail = false, quiet = true } = {}) {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, CI: "1" },
    stdio: quiet ? "pipe" : "inherit",
  });
  if (r.status !== 0 && !allowFail) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed (${r.status}) in ${cwd}\n${(r.stdout ?? "").slice(-2000)}\n${(r.stderr ?? "").slice(-2000)}`,
    );
  }
  return r;
}
const southpawui = (args, cwd, opts) =>
  run(process.execPath, [cli, ...args], cwd, { allowFail: true, ...opts });
const read = (dir, rel) => readFileSync(path.join(dir, rel), "utf8");

/**
 * The registry server runs in its own process: the commands below use
 * spawnSync, which would block a server living in this one.
 */
function serveRegistry() {
  const child = spawn(process.execPath, [path.join(here, "serve-registry.mjs")], {
    stdio: ["ignore", "pipe", "inherit"],
  });
  return new Promise((resolve, reject) => {
    child.stdout.once("data", (chunk) =>
      resolve({ url: String(chunk).trim(), close: () => child.kill() }),
    );
    child.once("exit", (code) => reject(new Error(`registry server exited (${code})`)));
  });
}

const PAGE = (importFrom) => `"use client";

import { Button } from "${importFrom}/southpaw/components/Button/Button";
import { Dialog } from "${importFrom}/southpaw/components/Dialog/Dialog";

export default function Page() {
  return (
    <main className="isolate p-10">
      <Dialog.Root>
        <Dialog.Trigger render={<Button variant="solid" />}>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Header>
              <Dialog.Title>Hello</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
`;

async function scenarioNext(registry) {
  console.log("\n— a) Next.js, npm, @/ alias");
  run(
    "npx",
    [
      "-y",
      "create-next-app@latest",
      "next-npm",
      "--ts",
      "--tailwind",
      "--eslint",
      "--app",
      "--no-src-dir",
      "--import-alias",
      "@/*",
      "--use-npm",
      "--yes",
    ],
    work,
  );
  const app = path.join(work, "next-npm");

  let r = southpawui(["init", "--registry", registry], app);
  check("a: init exits 0", r.status === 0, r.stdout.slice(-600));
  const config = JSON.parse(read(app, "southpaw.json"));
  check(
    "a: southpaw.json detected next-app, app/globals.css, @/components",
    config.framework === "next-app" &&
      config.css === "app/globals.css" &&
      config.aliases.components === "@/components" &&
      config.paths.components === "components",
    JSON.stringify(config),
  );
  check(
    "a: tokens import added with the right relative path",
    read(app, "app/globals.css").includes(
      '@import "tailwindcss";\n@import "../components/southpaw/tokens/index.css";',
    ),
  );
  const deps = () => JSON.parse(read(app, "package.json")).dependencies ?? {};
  check(
    "a: init installed clsx and tailwind-merge with npm",
    Boolean(deps().clsx && deps()["tailwind-merge"]),
    JSON.stringify(deps()),
  );

  r = southpawui(["add", "dialog", "button"], app);
  check("a: add dialog button exits 0", r.status === 0, r.stdout.slice(-600));
  check(
    "a: component files in the mirrored layout",
    [
      "components/southpaw/components/Dialog/Dialog.tsx",
      "components/southpaw/components/Button/Button.tsx",
      "components/southpaw/components/Spinner/Spinner.tsx",
      "components/southpaw/components/ButtonGroup/context.ts",
      "components/southpaw/lib/cn.ts",
    ].every((f) => existsSync(path.join(app, f))),
  );
  check(
    "a: npm dependencies installed with versions",
    Boolean(deps()["@base-ui/react"] && deps()["@phosphor-icons/react"]),
    JSON.stringify(deps()),
  );

  writeFileSync(path.join(app, "app/page.tsx"), PAGE("@/components"));
  r = run("npx", ["next", "build"], app, { allowFail: true });
  check("a: next build succeeds", r.status === 0, (r.stdout + r.stderr).slice(-1200));

  const cssBefore = read(app, "app/globals.css");
  r = southpawui(["init"], app);
  check(
    "a: init re-run exits 0 and leaves the CSS alone",
    r.status === 0 && read(app, "app/globals.css") === cssBefore,
  );
  r = southpawui(["add", "dialog"], app);
  check(
    "a: add re-run exits 0 (files already up to date)",
    r.status === 0 && /up to date/.test(r.stdout),
    r.stdout.slice(-400),
  );

  const dialog = path.join(app, "components/southpaw/components/Dialog/Dialog.tsx");
  const original = readFileSync(dialog, "utf8");
  writeFileSync(dialog, "// my local edits\n");
  r = southpawui(["add", "dialog"], app);
  check(
    "a: conflicting file, non-interactive: exits 1 and keeps the edit",
    r.status === 1 && readFileSync(dialog, "utf8") === "// my local edits\n",
    `exit ${r.status}`,
  );
  r = southpawui(["add", "dialog", "--yes"], app);
  check(
    "a: --yes keeps the edit and exits 0",
    r.status === 0 && readFileSync(dialog, "utf8") === "// my local edits\n",
  );
  r = southpawui(["add", "dialog", "--overwrite"], app);
  check(
    "a: --overwrite restores the registry version",
    r.status === 0 && readFileSync(dialog, "utf8") === original,
  );

  r = southpawui(["add", "nope-not-real"], app);
  check(
    "a: unknown component fails with a clear message",
    r.status === 1 && /No component at/.test(r.stdout + r.stderr),
  );

  r = southpawui(["ad", "dialog"], app);
  check(
    "a: a mistyped command exits 1 with 'Unknown command'",
    r.status === 1 && /Unknown command: ad/.test(r.stdout + r.stderr),
    `exit ${r.status}`,
  );
}

async function scenarioVite(registry) {
  console.log("\n— b) Vite + React + Tailwind v4, pnpm, no alias");
  run(
    "pnpm",
    ["create", "vite@latest", "vite-pnpm", "--template", "react-ts", "--no-interactive"],
    work,
  );
  const app = path.join(work, "vite-pnpm");
  writeFileSync(path.join(app, "pnpm-workspace.yaml"), "packages: []\n");
  run("pnpm", ["install"], app);
  run("pnpm", ["add", "-D", "tailwindcss@^4", "@tailwindcss/vite@^4"], app);
  // The Vite template may quote with ' or "; match either.
  const viteConfig = read(app, "vite.config.ts")
    .replace(
      /(import react from ["']@vitejs\/plugin-react["'];?)/,
      '$1\nimport tailwindcss from "@tailwindcss/vite";',
    )
    .replace(/plugins:\s*\[react\(\)\]/, "plugins: [react(), tailwindcss()]");
  writeFileSync(path.join(app, "vite.config.ts"), viteConfig);
  writeFileSync(path.join(app, "src/index.css"), '@import "tailwindcss";\n');
  check(
    "b: vite.config.ts wired for Tailwind (import and plugin)",
    /import tailwindcss from "@tailwindcss\/vite"/.test(read(app, "vite.config.ts")) &&
      read(app, "vite.config.ts").includes("tailwindcss()"),
    read(app, "vite.config.ts"),
  );

  let r = southpawui(["init", "--registry", registry], app);
  check("b: init exits 0", r.status === 0, r.stdout.slice(-600));
  const config = JSON.parse(read(app, "southpaw.json"));
  check(
    "b: detected vite, src/index.css, no alias, src/components",
    config.framework === "vite" &&
      config.css === "src/index.css" &&
      config.aliases.components === null &&
      config.paths.components === "src/components",
    JSON.stringify(config),
  );
  check(
    "b: tokens import is ./components/…",
    read(app, "src/index.css").includes('@import "./components/southpaw/tokens/index.css";'),
  );
  check(
    "b: dependencies installed with pnpm",
    existsSync(path.join(app, "pnpm-lock.yaml")) &&
      Boolean(JSON.parse(read(app, "package.json")).dependencies?.clsx),
  );

  r = southpawui(["add", "dialog", "button"], app);
  check("b: add exits 0", r.status === 0, r.stdout.slice(-600));
  writeFileSync(
    path.join(app, "src/App.tsx"),
    PAGE("./components")
      .replace('"use client";\n\n', "")
      .replace("export default function Page", "export default function App"),
  );
  r = run("pnpm", ["build"], app, { allowFail: true });
  check("b: tsc -b && vite build succeeds", r.status === 0, (r.stdout + r.stderr).slice(-1500));
}

async function scenarioSrcTilde(registry) {
  console.log("\n— c) Next.js, src/ and ~/ alias");
  run(
    "npx",
    [
      "-y",
      "create-next-app@latest",
      "next-src",
      "--ts",
      "--tailwind",
      "--no-eslint",
      "--app",
      "--src-dir",
      "--import-alias",
      "~/*",
      "--use-npm",
      "--yes",
    ],
    work,
  );
  const app = path.join(work, "next-src");
  let r = southpawui(["init", "--registry", registry], app);
  check("c: init exits 0", r.status === 0, r.stdout.slice(-600));
  const config = JSON.parse(read(app, "southpaw.json"));
  check(
    "c: detected src/app/globals.css, ~/components, src/components",
    config.css === "src/app/globals.css" &&
      config.aliases.components === "~/components" &&
      config.paths.components === "src/components",
    JSON.stringify(config),
  );
  // dialog-demo imports Dialog, Button, Field and Input through the alias, so the consumer's
  // typecheck covers the components that had type errors before GEO-970 Part A.
  r = southpawui(["add", "dialog-demo"], app);
  check("c: add dialog-demo exits 0", r.status === 0, r.stdout.slice(-600));
  const demo = read(app, "src/components/southpaw/examples/dialog-demo.tsx");
  check(
    "c: example imports rewritten to ~/components",
    demo.includes('"~/components/southpaw/components/Dialog/Dialog"') &&
      !demo.includes("@/components"),
  );
  writeFileSync(
    path.join(app, "src/app/page.tsx"),
    '"use client";\n\nimport DialogDemo from "~/components/southpaw/examples/dialog-demo";\n\nexport default function Page() {\n  return <main className="isolate p-10"><DialogDemo /></main>;\n}\n',
  );
  r = run("npx", ["next", "build"], app, { allowFail: true });
  check("c: next build succeeds", r.status === 0, (r.stdout + r.stderr).slice(-1200));
}

async function main() {
  if (!existsSync(cli))
    throw new Error(`Build the CLI first (pnpm --filter southpawui build). Missing ${cli}`);
  run(process.execPath, [path.join(repo, "packages/registry/build.mjs")], repo);
  const server = await serveRegistry();
  const registry = server.url;
  console.log(`Registry: ${registry}\nWork dir: ${work}`);
  const scenarios = { next: scenarioNext, vite: scenarioVite, src: scenarioSrcTilde };
  try {
    for (const [name, fn] of Object.entries(scenarios)) {
      if (only.length && !only.includes(name)) continue;
      try {
        await fn(registry);
      } catch (err) {
        check(`${name}: scenario crashed`, false, String(err).slice(0, 2000));
      }
    }
  } finally {
    server.close();
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} e2e checks passed. Apps left in ${work}`,
  );
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
