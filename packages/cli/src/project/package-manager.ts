import { detect } from "package-manager-detector/detect";
import { resolveCommand } from "package-manager-detector/commands";
import type { Agent } from "package-manager-detector";

/** Searches upward from the project, so a workspace root's lockfile (pnpm, yarn) is found. */
export async function detectAgent(cwd: string): Promise<Agent> {
  const result = await detect({ cwd });
  return result?.agent ?? "npm";
}

/** The install command for the detected package manager, as argv (never a shell string). */
export function addCommand(agent: Agent, packages: string[]): { command: string; args: string[] } {
  const resolved = resolveCommand(agent, "add", packages);
  if (!resolved) return { command: "npm", args: ["install", ...packages] };
  return resolved;
}
