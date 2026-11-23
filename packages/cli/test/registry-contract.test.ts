import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";
import type { SouthpawConfig } from "../src/config/schema.js";
import { NAMESPACE } from "../src/constants.js";
import { packageNameOf } from "../src/install/dependencies.js";
import { resolveTarget } from "../src/install/targets.js";
import { registryItemSchema, type RegistryItem } from "../src/registry/schema.js";

/**
 * Contract between packages/registry/build.mjs and this CLI: everything the
 * registry emits must be installable by southpawui.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
// Build into a temp folder: never touch (or race) the docs app's copy.
const outBase = mkdtempSync(path.join(tmpdir(), "southpaw-registry-"));
const outDir = path.join(outBase, "r");
let items: RegistryItem[] = [];

beforeAll(() => {
  execFileSync(process.execPath, [path.join(root, "packages/registry/build.mjs")], {
    stdio: "pipe",
    env: { ...process.env, REGISTRY_OUT_DIR: outBase },
  });
  items = readdirSync(outDir)
    .filter((f) => f.endsWith(".json") && f !== "registry.json")
    .map((f) => {
      const parsed = registryItemSchema.safeParse(
        JSON.parse(readFileSync(path.join(outDir, f), "utf8")),
      );
      if (!parsed.success) throw new Error(`${f}: ${parsed.error.issues[0]?.message}`);
      expect(parsed.data.name, f).toBe(f.replace(/\.json$/, ""));
      return parsed.data;
    });
}, 60_000);

const config: SouthpawConfig = {
  registry: "http://x",
  framework: "next-app",
  tsx: true,
  css: "app/globals.css",
  aliases: { components: "@/components" },
  paths: { components: "src/components" },
};

describe("registry contract", () => {
  it("emits the components, libs, tokens and examples", () => {
    const names = items.map((i) => i.name);
    expect(names).toEqual(
      expect.arrayContaining(["dialog", "button", "lib-cn", "southpaw-tokens", "dialog-demo"]),
    );
    expect(items.length).toBeGreaterThan(50);
  });

  it("references dependencies as @southpaw/<name>, and every one exists", () => {
    const names = new Set(items.map((i) => i.name));
    for (const i of items) {
      for (const dep of i.registryDependencies ?? []) {
        expect(dep, `${i.name} → ${dep}`).toMatch(new RegExp(`^${NAMESPACE}/[a-z0-9-]+$`));
        expect(names.has(dep.slice(NAMESPACE.length + 1)), `${i.name} → ${dep}`).toBe(true);
      }
    }
  });

  it("gives every npm dependency a version range", () => {
    for (const i of items) {
      for (const spec of i.dependencies ?? [])
        expect(spec, `${i.name}: ${spec}`).not.toBe(packageNameOf(spec));
    }
  });

  it("only targets safe paths inside the components folder", () => {
    for (const i of items) {
      for (const f of i.files) {
        expect(f.target, `${i.name}: ${f.path}`).toMatch(/^components\/southpaw\//);
        const abs = resolveTarget(f, config, "/proj");
        expect(abs.startsWith(path.resolve("/proj/src/components/southpaw/")), abs).toBe(true);
      }
    }
  });

  it("ships file contents inline", () => {
    for (const i of items)
      for (const f of i.files) expect(f.content.length, `${i.name}: ${f.path}`).toBeGreaterThan(0);
  });
});
