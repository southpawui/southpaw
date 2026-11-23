import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CliError } from "../errors.js";

export interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageManager?: string;
}

export function readPackageJson(cwd: string): PackageJson {
  const file = path.join(cwd, "package.json");
  if (!existsSync(file)) {
    throw new CliError(
      "No package.json here.",
      "Run southpawui from your project's root, or pass --cwd <path>.",
    );
  }
  try {
    return JSON.parse(readFileSync(file, "utf8")) as PackageJson;
  } catch {
    throw new CliError("package.json isn't valid JSON.");
  }
}

/** All declared packages, dependencies and devDependencies together. */
export function allDeps(pkg: PackageJson): Record<string, string> {
  return { ...pkg.devDependencies, ...pkg.dependencies };
}

/** The first major version number in a range like "^19.2.0" or "19", or null. */
export function majorOf(range: string | undefined): number | null {
  const m = range?.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

/** Southpaw needs React 19. */
export function assertReact19(pkg: PackageJson) {
  const range = allDeps(pkg).react;
  if (!range)
    throw new CliError(
      "React isn't a dependency of this project.",
      "Southpaw components need React 19.",
    );
  const major = majorOf(range);
  if (major !== null && major < 19 && !/^(latest|next|canary|\*)/.test(range)) {
    throw new CliError(`This project uses React ${range}. Southpaw needs React 19.`);
  }
}
