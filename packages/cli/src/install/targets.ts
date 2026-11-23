import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import type { SouthpawConfig } from "../config/schema.js";
import { CliError } from "../errors.js";
import type { RegistryFile } from "../registry/schema.js";

/**
 * Maps a registry file's target to a path in the user's project.
 *
 * Registry targets are written for a root-level `components/` folder
 * (`components/southpaw/components/Dialog/Dialog.tsx`); the leading
 * `components/` becomes the project's components folder (e.g.
 * `src/components`). The mirrored layout keeps the components' relative
 * imports working unchanged.
 *
 * Only `components/southpaw/…` targets are accepted: a registry item can't
 * write config files (`.npmrc`, `package.json`) or anything outside the
 * project, so a compromised registry can't hijack the install that follows.
 */
export function resolveTarget(file: RegistryFile, config: SouthpawConfig, cwd: string): string {
  const target = (file.target ?? "").replace(/\\/g, "/");
  if (!target) throw new CliError(`Registry file ${file.path} has no target path.`);
  if (target.startsWith("/") || /^[a-zA-Z]:/.test(target) || target.split("/").includes("..")) {
    throw new CliError(`Refusing to write unsafe path "${target}" from the registry.`);
  }
  if (!target.startsWith("components/southpaw/")) {
    throw new CliError(
      `Refusing to write "${target}": registry files must go under components/southpaw/.`,
    );
  }
  const rel = path.posix.join(config.paths.components, target.slice("components/".length));
  const abs = path.resolve(cwd, rel);
  const inside = path.relative(cwd, abs);
  if (inside.startsWith("..") || path.isAbsolute(inside)) {
    throw new CliError(`Refusing to write "${target}": it resolves outside the project.`);
  }
  return abs;
}

/**
 * Follows symlinks: the deepest part of `abs` that already exists must really
 * live inside the project. Stops a symlinked folder (e.g. a cloned repo's
 * `components/southpaw -> /somewhere/else`) from redirecting writes.
 */
export function assertRealPathInside(abs: string, cwd: string) {
  const root = realpathSync(cwd);
  let probe = abs;
  while (!existsSync(probe)) {
    const parent = path.dirname(probe);
    if (parent === probe) break;
    probe = parent;
  }
  const real = realpathSync(probe);
  const rel = path.relative(root, real);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new CliError(
      `Refusing to write ${path.relative(cwd, abs)}: ${path.relative(cwd, probe) || "."} is a link to ${real}, outside the project.`,
    );
  }
}
