import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Context, Ui } from "../src/context.js";
import type { ConflictAnswer } from "../src/install/write-files.js";
import type { RegistryItem } from "../src/registry/schema.js";

export const REGISTRY = "http://registry.test";

/** A throwaway project in the OS temp dir. */
export function makeProject(files: Record<string, string>): string {
  const dir = mkdtempSync(path.join(tmpdir(), "southpawui-test-"));
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(dir, rel);
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
  return dir;
}

export const nextApp = (extra: Record<string, string> = {}) => ({
  "package.json": JSON.stringify({
    dependencies: { next: "16.0.0", react: "19.2.0", "react-dom": "19.2.0" },
  }),
  "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "@/*": ["./*"] } } }),
  "app/globals.css": '@import "tailwindcss";\n\nbody { margin: 0; }\n',
  "app/page.tsx": "export default function Page() { return null; }\n",
  ...extra,
});

/** A fake registry: serves items by name, records every URL requested. */
export function fakeRegistry(items: RegistryItem[]) {
  const byName = new Map(items.map((i) => [i.name, i]));
  const requested: string[] = [];
  const fetcher = async (url: string) => {
    requested.push(url);
    const name = url.match(/\/r\/([^/]+)\.json$/)?.[1];
    const item = name ? byName.get(name) : undefined;
    return item
      ? new Response(JSON.stringify(item), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      : new Response("not found", { status: 404, statusText: "Not Found" });
  };
  return { fetcher, requested };
}

export const item = (name: string, overrides: Partial<RegistryItem> = {}): RegistryItem => ({
  name,
  type: "registry:ui",
  dependencies: [],
  registryDependencies: [],
  files: [],
  ...overrides,
});

/** The base items init installs, with realistic targets. */
export const baseItems = () => [
  item("southpaw-tokens", {
    type: "registry:file",
    files: [
      {
        path: "packages/tokens/src/index.css",
        type: "registry:file",
        target: "components/southpaw/tokens/index.css",
        content: "@import './theme.css';\n",
      },
      {
        path: "packages/tokens/src/theme.css",
        type: "registry:file",
        target: "components/southpaw/tokens/theme.css",
        content: ":root{}\n",
      },
    ],
  }),
  item("lib-cn", {
    type: "registry:lib",
    dependencies: ["clsx@^2", "tailwind-merge@^3"],
    files: [
      {
        path: "packages/ui/src/lib/cn.ts",
        type: "registry:lib",
        target: "components/southpaw/lib/cn.ts",
        content: "export const cn = () => '';\n",
      },
    ],
  }),
];

export interface Recorder {
  messages: { level: string; message: string }[];
  runs: { command: string; args: string[]; cwd: string }[];
  conflicts: string[];
}

/** A context with no terminal: records output, runs nothing. */
export function testContext(
  fetcher: Context["fetcher"],
  {
    interactive = false,
    answers = [] as ConflictAnswer[],
    confirm = true,
    env = {} as Record<string, string>,
  } = {},
): { ctx: Context; rec: Recorder } {
  const rec: Recorder = { messages: [], runs: [], conflicts: [] };
  const log = (level: string) => (message: string) => rec.messages.push({ level, message });
  const ui: Ui = {
    info: log("info"),
    success: log("success"),
    warn: log("warn"),
    error: log("error"),
    confirm: async () => confirm,
    select: async (_m, options) => options[0]!.value,
    conflict: async (rel) => {
      rec.conflicts.push(rel);
      return answers.shift() ?? "keep";
    },
  };
  return {
    rec,
    ctx: {
      env,
      interactive,
      fetcher,
      ui,
      runner: async (command, args, cwd) => {
        rec.runs.push({ command, args, cwd });
        // Like a real package manager: record the installed packages in package.json.
        const file = path.join(cwd, "package.json");
        const pkg = JSON.parse(readFileSync(file, "utf8")) as {
          dependencies?: Record<string, string>;
        };
        for (const spec of args.filter((a) => !["i", "add", "install"].includes(a))) {
          const at = spec.indexOf("@", spec.startsWith("@") ? 1 : 0);
          pkg.dependencies = {
            ...pkg.dependencies,
            [at === -1 ? spec : spec.slice(0, at)]: at === -1 ? "*" : spec.slice(at + 1),
          };
        }
        writeFileSync(file, JSON.stringify(pkg));
        return { exitCode: 0 };
      },
    },
  };
}
