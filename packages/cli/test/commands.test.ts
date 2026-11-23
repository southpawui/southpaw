import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { add } from "../src/commands/add.js";
import { init } from "../src/commands/init.js";
import {
  baseItems,
  fakeRegistry,
  item,
  makeProject,
  nextApp,
  REGISTRY,
  testContext,
} from "./helpers.js";

const dialog = item("dialog", {
  dependencies: ["@base-ui/react@^1.9.0"],
  registryDependencies: ["@southpaw/lib-cn", "@southpaw/southpaw-tokens"],
  files: [
    {
      path: "packages/ui/src/components/Dialog/Dialog.tsx",
      type: "registry:ui",
      target: "components/southpaw/components/Dialog/Dialog.tsx",
      content: 'import { cn } from "../../lib/cn";\nexport const Dialog = {};\n',
    },
  ],
});
const demo = item("dialog-demo", {
  type: "registry:example",
  registryDependencies: ["@southpaw/dialog"],
  files: [
    {
      path: "packages/registry/examples/dialog-demo.tsx",
      type: "registry:example",
      target: "components/southpaw/examples/dialog-demo.tsx",
      content: 'import { Dialog } from "@/components/southpaw/components/Dialog/Dialog";\n',
    },
  ],
});
const registry = () => fakeRegistry([...baseItems(), dialog, demo]);
const read = (cwd: string, rel: string) => readFileSync(path.join(cwd, rel), "utf8");
const json = (cwd: string, rel: string) => JSON.parse(read(cwd, rel)) as Record<string, unknown>;

describe("init", () => {
  it("writes southpaw.json, the tokens and cn, the CSS import, and installs dependencies", async () => {
    const cwd = makeProject(nextApp());
    const { ctx, rec } = testContext(registry().fetcher);
    expect(await init({ cwd, registry: REGISTRY }, ctx)).toBe(0);
    expect(json(cwd, "southpaw.json")).toEqual({
      registry: REGISTRY,
      framework: "next-app",
      tsx: true,
      css: "app/globals.css",
      aliases: { components: "@/components" },
      paths: { components: "components" },
    });
    expect(existsSync(path.join(cwd, "components/southpaw/tokens/index.css"))).toBe(true);
    expect(existsSync(path.join(cwd, "components/southpaw/lib/cn.ts"))).toBe(true);
    expect(read(cwd, "app/globals.css")).toContain(
      '@import "tailwindcss";\n@import "../components/southpaw/tokens/index.css";',
    );
    expect(rec.runs).toEqual([
      { command: "npm", args: ["i", "clsx@^2", "tailwind-merge@^3"], cwd },
    ]);
  });

  it("is safe to re-run", async () => {
    const cwd = makeProject(nextApp());
    const reg = registry();
    await init({ cwd, registry: REGISTRY }, testContext(reg.fetcher).ctx);
    const before = read(cwd, "app/globals.css");
    writeFileSync(
      path.join(cwd, "package.json"),
      JSON.stringify({
        dependencies: { next: "16", react: "19", clsx: "^2", "tailwind-merge": "^3" },
      }),
    );
    const { ctx, rec } = testContext(reg.fetcher);
    expect(await init({ cwd }, ctx)).toBe(0);
    expect(read(cwd, "app/globals.css")).toBe(before);
    expect(rec.runs).toEqual([]);
  });

  it("keeps an existing southpaw.json's settings unless --force", async () => {
    const mine = {
      registry: "http://mine.test",
      framework: "next-app",
      tsx: true,
      css: "app/globals.css",
      aliases: { components: "@/ui" },
      paths: { components: "ui" },
    };
    const cwd = makeProject(nextApp({ "southpaw.json": JSON.stringify(mine) }));
    const reg = registry();
    // The env var points the fetches at the test registry; the saved registry value is kept.
    await init({ cwd }, testContext(reg.fetcher, { env: { SOUTHPAW_REGISTRY_URL: REGISTRY } }).ctx);
    expect(json(cwd, "southpaw.json")).toMatchObject({
      registry: "http://mine.test",
      aliases: { components: "@/ui" },
      paths: { components: "ui" },
    });
    expect(existsSync(path.join(cwd, "ui/southpaw/tokens/index.css"))).toBe(true);
    await init({ cwd, registry: REGISTRY, force: true }, testContext(reg.fetcher).ctx);
    expect(json(cwd, "southpaw.json")).toMatchObject({
      registry: REGISTRY,
      aliases: { components: "@/components" },
      paths: { components: "components" },
    });
  });

  it("stops without Tailwind v4, for JavaScript projects and for React 18", async () => {
    const { ctx } = testContext(registry().fetcher);
    await expect(
      init(
        { cwd: makeProject(nextApp({ "app/globals.css": "@tailwind base;" })), registry: REGISTRY },
        ctx,
      ),
    ).rejects.toThrow(/Tailwind CSS v4/);
    const js: Record<string, string> = nextApp({ "jsconfig.json": "{}" });
    delete js["tsconfig.json"];
    await expect(init({ cwd: makeProject(js), registry: REGISTRY }, ctx)).rejects.toThrow(
      /JavaScript project/,
    );
    const react18 = nextApp({
      "package.json": JSON.stringify({ dependencies: { next: "15", react: "^18.3.1" } }),
    });
    await expect(init({ cwd: makeProject(react18), registry: REGISTRY }, ctx)).rejects.toThrow(
      /needs React 19/,
    );
  });

  it("honours --css and src/ with a ~ alias", async () => {
    const cwd = makeProject({
      "package.json": JSON.stringify({ dependencies: { next: "16", react: "19" } }),
      "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "~/*": ["./src/*"] } } }),
      "src/app/globals.css": '@import "tailwindcss";\n',
      "src/styles/theme.css": '@import "tailwindcss";\n',
    });
    await init(
      { cwd, registry: REGISTRY, css: "src/styles/theme.css" },
      testContext(registry().fetcher).ctx,
    );
    expect(json(cwd, "southpaw.json")).toMatchObject({
      css: "src/styles/theme.css",
      aliases: { components: "~/components" },
      paths: { components: "src/components" },
    });
    expect(read(cwd, "src/styles/theme.css")).toContain(
      '@import "../components/southpaw/tokens/index.css";',
    );
  });
});

describe("add", () => {
  const ready = async () => {
    const cwd = makeProject(nextApp());
    const reg = registry();
    await init({ cwd, registry: REGISTRY }, testContext(reg.fetcher).ctx);
    return { cwd, reg };
  };
  const dialogFile = "components/southpaw/components/Dialog/Dialog.tsx";

  it("installs a component with its dependencies; example imports keep the project's alias", async () => {
    const { cwd, reg } = await ready();
    const { ctx, rec } = testContext(reg.fetcher);
    expect(await add(["dialog-demo"], { cwd }, ctx)).toBe(0);
    expect(read(cwd, dialogFile)).toContain('from "../../lib/cn"');
    expect(read(cwd, "components/southpaw/examples/dialog-demo.tsx")).toContain(
      'from "@/components/southpaw/components/Dialog/Dialog"',
    );
    expect(rec.runs.map((r) => r.args)).toEqual([["i", "@base-ui/react@^1.9.0"]]);
  });

  it("rewrites example imports to a ~ alias", async () => {
    const cwd = makeProject({
      "package.json": JSON.stringify({ dependencies: { next: "16", react: "19" } }),
      "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "~/*": ["./src/*"] } } }),
      "src/app/globals.css": '@import "tailwindcss";\n',
    });
    const reg = registry();
    await init({ cwd, registry: REGISTRY }, testContext(reg.fetcher).ctx);
    expect(await add(["dialog-demo"], { cwd }, testContext(reg.fetcher).ctx)).toBe(0);
    expect(read(cwd, "src/components/southpaw/examples/dialog-demo.tsx")).toContain(
      'from "~/components/southpaw/components/Dialog/Dialog"',
    );
  });

  it("accepts @southpaw/ names and a --registry override", async () => {
    const { cwd } = await ready();
    const other = registry();
    expect(
      await add(
        ["@southpaw/dialog"],
        { cwd, registry: "http://other.test" },
        testContext(other.fetcher).ctx,
      ),
    ).toBe(0);
    expect(other.requested[0]).toBe("http://other.test/r/dialog.json");
  });

  it("exits 1 on unresolved conflicts when non-interactive, and leaves the file alone", async () => {
    const { cwd, reg } = await ready();
    await add(["dialog"], { cwd }, testContext(reg.fetcher).ctx);
    const file = path.join(cwd, dialogFile);
    writeFileSync(file, "// my edits\n");
    const { ctx, rec } = testContext(reg.fetcher);
    expect(await add(["dialog"], { cwd }, ctx)).toBe(1);
    expect(readFileSync(file, "utf8")).toBe("// my edits\n");
    expect(rec.messages.some((m) => m.level === "error" && /--overwrite/.test(m.message))).toBe(
      true,
    );
    expect(await add(["dialog"], { cwd, yes: true }, testContext(reg.fetcher).ctx)).toBe(0);
    expect(readFileSync(file, "utf8")).toBe("// my edits\n");
    expect(await add(["dialog"], { cwd, overwrite: true }, testContext(reg.fetcher).ctx)).toBe(0);
    expect(readFileSync(file, "utf8")).toContain("export const Dialog");
  });

  it("asks before overwriting when interactive", async () => {
    const { cwd, reg } = await ready();
    await add(["dialog"], { cwd }, testContext(reg.fetcher).ctx);
    writeFileSync(path.join(cwd, dialogFile), "// mine\n");
    const { ctx, rec } = testContext(reg.fetcher, { interactive: true, answers: ["overwrite"] });
    expect(await add(["dialog"], { cwd }, ctx)).toBe(0);
    expect(rec.conflicts).toEqual([dialogFile]);
    expect(read(cwd, dialogFile)).toContain("export const Dialog");
  });

  it("--dry-run writes and installs nothing", async () => {
    const { cwd, reg } = await ready();
    const { ctx, rec } = testContext(reg.fetcher);
    expect(await add(["dialog"], { cwd, dryRun: true }, ctx)).toBe(0);
    expect(existsSync(path.join(cwd, dialogFile))).toBe(false);
    expect(rec.runs).toEqual([]);
  });

  it("needs southpaw.json (non-interactive) and at least one name", async () => {
    const cwd = makeProject(nextApp());
    const { ctx } = testContext(registry().fetcher);
    await expect(add(["dialog"], { cwd }, ctx)).rejects.toThrow(/No southpaw.json/);
    await expect(add([], { cwd }, ctx)).rejects.toThrow(/at least one/);
  });

  it("offers to run init when interactive", async () => {
    const cwd = makeProject(nextApp());
    const { ctx } = testContext(registry().fetcher, {
      interactive: true,
      confirm: true,
      env: { SOUTHPAW_REGISTRY_URL: REGISTRY },
    });
    expect(await add(["dialog"], { cwd }, ctx)).toBe(0);
    expect(existsSync(path.join(cwd, "southpaw.json"))).toBe(true);
    expect(existsSync(path.join(cwd, dialogFile))).toBe(true);
  });
});

describe("review fixes (signoff 2026-11-23)", () => {
  it("add --dry-run without southpaw.json never runs init, even interactively", async () => {
    const cwd = makeProject(nextApp());
    const { ctx, rec } = testContext(registry().fetcher, {
      interactive: true,
      confirm: true,
      env: { SOUTHPAW_REGISTRY_URL: REGISTRY },
    });
    await expect(add(["dialog"], { cwd, dryRun: true }, ctx)).rejects.toThrow(/No southpaw.json/);
    expect(existsSync(path.join(cwd, "southpaw.json"))).toBe(false);
    expect(read(cwd, "app/globals.css")).not.toContain("southpaw");
    expect(rec.runs).toEqual([]);
  });

  it("add writes nothing when package.json is missing", async () => {
    const cwd = makeProject(nextApp());
    await init({ cwd, registry: REGISTRY }, testContext(registry().fetcher).ctx);
    writeFileSync(path.join(cwd, "package.json"), "");
    const { rmSync } = await import("node:fs");
    rmSync(path.join(cwd, "package.json"));
    await expect(add(["dialog"], { cwd }, testContext(registry().fetcher).ctx)).rejects.toThrow(
      /No package.json/,
    );
    expect(existsSync(path.join(cwd, "components/southpaw/components/Dialog/Dialog.tsx"))).toBe(
      false,
    );
  });

  it("refuses a registry item that targets a root config file", async () => {
    const cwd = makeProject(nextApp());
    const evil = item("evil", {
      files: [
        {
          path: "x",
          type: "registry:file",
          target: ".npmrc",
          content: "registry=http://evil.test\n",
        },
      ],
    });
    const reg = fakeRegistry([...baseItems(), evil]);
    await init({ cwd, registry: REGISTRY }, testContext(reg.fetcher).ctx);
    await expect(add(["evil"], { cwd }, testContext(reg.fetcher).ctx)).rejects.toThrow(
      /components\/southpaw/,
    );
    expect(existsSync(path.join(cwd, ".npmrc"))).toBe(false);
  });
});
