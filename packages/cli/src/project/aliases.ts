import { existsSync } from "node:fs";
import path from "node:path";
import { getTsconfig, parseTsconfig, type TsConfigJsonResolved } from "get-tsconfig";
import { CliError } from "../errors.js";

export interface ProjectAliases {
  /** e.g. "@/components", or null when the project has no path alias. */
  components: string | null;
  /** The components folder relative to the project root, e.g. "components" or "src/components". */
  componentsDir: string;
}

/** Aliases we recognise, most common first. */
const PREFERRED = ["@/*", "~/*", "#/*", "$/*"];

function readProjectTsconfig(cwd: string): { file: string; config: TsConfigJsonResolved } {
  const own = path.join(cwd, "tsconfig.json");
  if (!existsSync(own)) {
    if (existsSync(path.join(cwd, "jsconfig.json"))) {
      throw new CliError(
        "This looks like a JavaScript project (jsconfig.json, no tsconfig.json).",
        "southpawui v1 installs TypeScript components only. Add TypeScript to the project, or copy components manually from the docs.",
      );
    }
    throw new CliError("No tsconfig.json found.", "southpawui v1 needs a TypeScript project.");
  }
  // getTsconfig follows `extends`; search from the project itself so a parent folder's config isn't used.
  const result = getTsconfig(cwd, "tsconfig.json");
  if (!result || path.dirname(result.path) !== cwd)
    return { file: own, config: parseTsconfig(own) };
  return { file: result.path, config: result.config };
}

/** Vite's template keeps compilerOptions in tsconfig.app.json, referenced from tsconfig.json. */
function withReferences(cwd: string, main: { file: string; config: TsConfigJsonResolved }) {
  const out = [main];
  for (const ref of main.config.references ?? []) {
    let refPath = path.resolve(cwd, ref.path);
    if (!refPath.endsWith(".json")) refPath = path.join(refPath, "tsconfig.json");
    if (existsSync(refPath)) out.push({ file: refPath, config: parseTsconfig(refPath) });
  }
  return out;
}

/** Works out the components alias and folder from tsconfig `paths`. */
export function detectAliases(cwd: string): ProjectAliases {
  const configs = withReferences(cwd, readProjectTsconfig(cwd));
  for (const { file, config } of configs) {
    const paths = config.compilerOptions?.paths;
    if (!paths) continue;
    const key =
      PREFERRED.find((k) => paths[k]?.length) ??
      Object.keys(paths).find((k) => k.endsWith("/*") && paths[k]?.[0]?.endsWith("/*"));
    const target = key ? paths[key]?.[0] : undefined;
    if (!key || !target) continue;
    const base = path.resolve(path.dirname(file), config.compilerOptions?.baseUrl ?? ".");
    const targetDir = path.resolve(base, target.replace(/\/\*$/, ""));
    const rel = path.relative(cwd, path.join(targetDir, "components")).split(path.sep).join("/");
    if (rel.startsWith("..")) continue;
    return { components: `${key.replace(/\/\*$/, "")}/components`, componentsDir: rel };
  }
  // No alias: components still work (they import each other relatively).
  return {
    components: null,
    componentsDir: existsSync(path.join(cwd, "src")) ? "src/components" : "components",
  };
}
