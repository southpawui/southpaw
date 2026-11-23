import { x } from "tinyexec";
import type { Agent } from "package-manager-detector";
import { CliError } from "../errors.js";
import { addCommand } from "../project/package-manager.js";
import { allDeps, type PackageJson } from "../project/package-json.js";

/** npm package spec: optional scope, name, optional @version-range (no spaces, no shell characters). */
const SPEC = /^(@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*(@[\w.^~<>=*|+-]+)?$/i;

/** "@scope/name@^1.2" → "@scope/name". */
export function packageNameOf(spec: string): string {
  const at = spec.indexOf("@", spec.startsWith("@") ? 1 : 0);
  return at === -1 ? spec : spec.slice(0, at);
}

/** The specs the project doesn't already declare, validated and de-duplicated. */
export function missingDependencies(specs: string[], pkg: PackageJson): string[] {
  const have = allDeps(pkg);
  const out = new Map<string, string>();
  for (const spec of specs) {
    if (!SPEC.test(spec))
      throw new CliError(`The registry asked for an invalid package "${spec}".`);
    const name = packageNameOf(spec);
    if (!Object.hasOwn(have, name) && !out.has(name)) out.set(name, spec);
  }
  return [...out.values()];
}

export type Runner = (
  command: string,
  args: string[],
  cwd: string,
) => Promise<{ exitCode: number | undefined }>;

export const defaultRunner: Runner = async (command, args, cwd) => {
  const result = await x(command, args, {
    nodeOptions: { cwd, stdio: "inherit" },
    throwOnError: false,
  });
  return { exitCode: result.exitCode };
};

/** Installs packages with the project's package manager. No shell is involved. */
export async function installDependencies(
  packages: string[],
  { cwd, agent, runner = defaultRunner }: { cwd: string; agent: Agent; runner?: Runner },
) {
  if (packages.length === 0) return null;
  const { command, args } = addCommand(agent, packages);
  const { exitCode } = await runner(command, args, cwd);
  if (exitCode !== 0) {
    throw new CliError(
      `\`${command} ${args.join(" ")}\` failed (exit ${exitCode}).`,
      "Install those packages yourself, then carry on.",
    );
  }
  return { command, args };
}
