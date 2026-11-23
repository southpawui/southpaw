import { existsSync, mkdirSync, readFileSync, symlinkSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { SouthpawConfig } from "../src/config/schema.js";
import { ensureTokensImport, tokensImportPath } from "../src/install/css-import.js";
import {
  installDependencies,
  missingDependencies,
  packageNameOf,
} from "../src/install/dependencies.js";
import { rewriteImports } from "../src/install/rewrite-imports.js";
import { assertRealPathInside, resolveTarget } from "../src/install/targets.js";
import { writeFiles } from "../src/install/write-files.js";
import { makeProject } from "./helpers.js";

const config = (
  components = "components",
  alias: string | null = "@/components",
): SouthpawConfig => ({
  registry: "http://x",
  framework: "next-app",
  tsx: true,
  css: "app/globals.css",
  aliases: { components: alias },
  paths: { components },
});
const file = (target: string) => ({ path: "p", type: "registry:ui", target, content: "" });

describe("resolveTarget", () => {
  it("maps components/ to the project's components folder, mirroring the layout", () => {
    expect(
      resolveTarget(
        file("components/southpaw/components/Dialog/Dialog.tsx"),
        config("src/components"),
        "/proj",
      ),
    ).toBe(path.resolve("/proj/src/components/southpaw/components/Dialog/Dialog.tsx"));
  });
  it("refuses targets outside components/southpaw (config files, root files)", () => {
    for (const t of ["lib/x.ts", "~/lib/x.ts", ".npmrc", "package.json", "components/other/x.ts"]) {
      expect(() => resolveTarget(file(t), config(), "/proj"), t).toThrow(/components\/southpaw/);
    }
  });
  it("refuses absolute paths, traversal and missing targets", () => {
    for (const t of [
      "/etc/passwd",
      "../x.ts",
      "components/../../x.ts",
      "C:/x.ts",
      "a\\..\\..\\x",
    ]) {
      expect(() => resolveTarget(file(t), config(), "/proj")).toThrow(
        /unsafe|outside|components\/southpaw/,
      );
    }
    expect(() => resolveTarget({ path: "p", type: "t", content: "" }, config(), "/proj")).toThrow(
      /no target/,
    );
  });
});

describe("rewriteImports", () => {
  const code = [
    'import { Dialog } from "@/components/southpaw/components/Dialog/Dialog";',
    "import { cn } from '../../lib/cn';",
    'export { Button } from "@/components/southpaw/components/Button/Button";',
    'const L = () => import("@/components/southpaw/x");',
    'import "@/componentsX/nope";',
  ].join("\n");
  it("swaps the registry alias for the project's alias", () => {
    const out = rewriteImports(code, {
      alias: "~/components",
      componentsDirAbs: "/p/src/components",
      fileAbs: "/p/src/app/page.tsx",
    });
    expect(out).toContain('from "~/components/southpaw/components/Dialog/Dialog"');
    expect(out).toContain('from "~/components/southpaw/components/Button/Button"');
    expect(out).toContain("from '../../lib/cn'");
    expect(out).toContain('import("~/components/southpaw/x")');
    expect(out).toContain('import "@/componentsX/nope"');
  });
  it("uses relative paths when the project has no alias", () => {
    const out = rewriteImports(code, {
      alias: null,
      componentsDirAbs: "/p/src/components",
      fileAbs: "/p/src/components/southpaw/examples/demo.tsx",
    });
    expect(out).toContain('from "../components/Dialog/Dialog"');
  });
  it("leaves code without registry aliases untouched", () => {
    const plain = 'import * as React from "react";\nimport { x } from "./x";\n';
    expect(
      rewriteImports(plain, { alias: "@/components", componentsDirAbs: "/p", fileAbs: "/p/a.tsx" }),
    ).toBe(plain);
  });
});

describe("writeFiles", () => {
  const setup = () => {
    const cwd = makeProject({ "a.ts": "old", "same.ts": "same" });
    const files = [
      { abs: path.join(cwd, "a.ts"), content: "new" },
      { abs: path.join(cwd, "same.ts"), content: "same" },
      { abs: path.join(cwd, "dir/b.ts"), content: "b" },
    ];
    return { cwd, files };
  };
  const base = {
    overwrite: false,
    yes: false,
    dryRun: false,
    interactive: false,
    ask: async () => "keep" as const,
  };

  it("creates new files, skips identical ones and never overwrites without being told", async () => {
    const { cwd, files } = setup();
    const r = await writeFiles(files, { ...base, cwd });
    expect(r).toMatchObject({
      created: ["dir/b.ts"],
      unchanged: ["same.ts"],
      unresolved: ["a.ts"],
      updated: [],
    });
    expect(readFileSync(path.join(cwd, "a.ts"), "utf8")).toBe("old");
  });
  it("--overwrite replaces, --yes keeps", async () => {
    let s = setup();
    expect((await writeFiles(s.files, { ...base, cwd: s.cwd, overwrite: true })).updated).toEqual([
      "a.ts",
    ]);
    expect(readFileSync(path.join(s.cwd, "a.ts"), "utf8")).toBe("new");
    s = setup();
    expect((await writeFiles(s.files, { ...base, cwd: s.cwd, yes: true })).kept).toEqual(["a.ts"]);
  });
  it("asks interactively, honouring 'all' answers", async () => {
    const cwd = makeProject({ "a.ts": "1", "b.ts": "1", "c.ts": "1" });
    const answers = ["overwrite-all" as const];
    const asked: string[] = [];
    const r = await writeFiles(
      ["a", "b", "c"].map((n) => ({ abs: path.join(cwd, `${n}.ts`), content: "2" })),
      {
        ...base,
        cwd,
        interactive: true,
        ask: async (rel) => (asked.push(rel), answers.shift() ?? "keep"),
      },
    );
    expect(asked).toEqual(["a.ts"]);
    expect(r.updated).toEqual(["a.ts", "b.ts", "c.ts"]);
  });
  it("dry run writes nothing", async () => {
    const { cwd, files } = setup();
    const r = await writeFiles(files, { ...base, cwd, overwrite: true, dryRun: true });
    expect(r.created).toEqual(["dir/b.ts"]);
    expect(existsSync(path.join(cwd, "dir/b.ts"))).toBe(false);
  });
});

describe("ensureTokensImport", () => {
  it("adds the import after tailwindcss with the right relative path", async () => {
    const cwd = makeProject({ "app/globals.css": '@import "tailwindcss";\nbody{}\n' });
    const css = path.join(cwd, "app/globals.css");
    const tokens = path.join(cwd, "components/southpaw/tokens/index.css");
    expect(tokensImportPath(css, tokens)).toBe("../components/southpaw/tokens/index.css");
    expect(await ensureTokensImport(css, tokens)).toBe("added");
    expect(readFileSync(css, "utf8")).toBe(
      '@import "tailwindcss";\n@import "../components/southpaw/tokens/index.css";\nbody{}\n',
    );
    expect(await ensureTokensImport(css, tokens)).toBe("unchanged");
  });
  it("uses ./ when the tokens sit below the stylesheet, and fixes a stale path", async () => {
    const cwd = makeProject({
      "src/index.css": "@import 'tailwindcss';\n@import \"./wrong/southpaw/tokens/index.css\";\n",
    });
    const css = path.join(cwd, "src/index.css");
    expect(
      await ensureTokensImport(css, path.join(cwd, "src/components/southpaw/tokens/index.css")),
    ).toBe("updated");
    expect(readFileSync(css, "utf8")).toBe(
      "@import 'tailwindcss';\n@import \"./components/southpaw/tokens/index.css\";\n",
    );
  });
  it("prepends when there's no tailwind import line to anchor on", async () => {
    const cwd = makeProject({ "a.css": "body{}\n" });
    await ensureTokensImport(
      path.join(cwd, "a.css"),
      path.join(cwd, "t/southpaw/tokens/index.css"),
    );
    expect(
      readFileSync(path.join(cwd, "a.css"), "utf8").startsWith(
        '@import "./t/southpaw/tokens/index.css";\n',
      ),
    ).toBe(true);
  });
});

describe("dependencies", () => {
  it("parses names from specs", () => {
    expect(packageNameOf("@base-ui/react@^1.9.0")).toBe("@base-ui/react");
    expect(packageNameOf("clsx@^2")).toBe("clsx");
    expect(packageNameOf("clsx")).toBe("clsx");
  });
  it("skips declared packages, de-duplicates and rejects unsafe specs", () => {
    expect(
      missingDependencies(["clsx@^2", "clsx@^2", "react@^19", "@base-ui/react@^1.9.0"], {
        dependencies: { react: "19" },
      }),
    ).toEqual(["clsx@^2", "@base-ui/react@^1.9.0"]);
    for (const bad of ["clsx; touch pwned", "$(whoami)", "a b", "--registry=evil", "x && y"]) {
      expect(() => missingDependencies([bad], {})).toThrow(/invalid package/);
    }
  });
  it("installs with the detected package manager, as argv", async () => {
    const runs: { command: string; args: string[] }[] = [];
    const runner = async (command: string, args: string[]) => (
      runs.push({ command, args }),
      { exitCode: 0 }
    );
    for (const agent of ["npm", "pnpm", "yarn", "bun"] as const)
      await installDependencies(["clsx@^2"], { cwd: "/p", agent, runner });
    expect(runs.map((r) => `${r.command} ${r.args.join(" ")}`)).toEqual([
      "npm i clsx@^2",
      "pnpm add clsx@^2",
      "yarn add clsx@^2",
      "bun add clsx@^2",
    ]);
    expect(await installDependencies([], { cwd: "/p", agent: "npm", runner })).toBeNull();
  });
  it("reports a failed install", async () => {
    await expect(
      installDependencies(["x"], {
        cwd: "/p",
        agent: "npm",
        runner: async () => ({ exitCode: 1 }),
      }),
    ).rejects.toThrow(/failed \(exit 1\)/);
  });
});

describe("review fixes (signoff 2026-11-23)", () => {
  it("refuses to write through a symlink that leaves the project", () => {
    const cwd = makeProject({ "package.json": "{}" });
    const outside = makeProject({});
    mkdirSync(path.join(cwd, "components"), { recursive: true });
    symlinkSync(outside, path.join(cwd, "components/southpaw"), "dir");
    expect(() =>
      assertRealPathInside(path.join(cwd, "components/southpaw/lib/cn.ts"), cwd),
    ).toThrow(/outside the project/);
    // An ordinary new path inside the project is fine.
    expect(() => assertRealPathInside(path.join(cwd, "components/other/x.ts"), cwd)).not.toThrow();
  });

  it("treats CRLF and LF as the same file (no false conflict)", async () => {
    const cwd = makeProject({ "a.ts": "a\r\nb\r\n" });
    const r = await writeFiles([{ abs: path.join(cwd, "a.ts"), content: "a\nb\n" }], {
      cwd,
      overwrite: false,
      yes: false,
      dryRun: false,
      interactive: false,
      ask: async () => "keep",
    });
    expect(r.unchanged).toEqual(["a.ts"]);
    expect(r.unresolved).toEqual([]);
  });

  it("anchors the tokens import on an indented tailwind import", async () => {
    const cwd = makeProject({ "app/globals.css": '/* x */\n  @import "tailwindcss";\nbody{}\n' });
    const css = path.join(cwd, "app/globals.css");
    await ensureTokensImport(css, path.join(cwd, "components/southpaw/tokens/index.css"));
    expect(readFileSync(css, "utf8")).toBe(
      '/* x */\n  @import "tailwindcss";\n@import "../components/southpaw/tokens/index.css";\nbody{}\n',
    );
  });

  it("doesn't mistake built-in object keys for declared packages", () => {
    expect(missingDependencies(["constructor@1", "toString"], {})).toEqual([
      "constructor@1",
      "toString",
    ]);
  });
});
