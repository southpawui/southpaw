import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { CONFIG_FILE } from "../constants.js";
import { CliError } from "../errors.js";
import { configSchema, type SouthpawConfig } from "./schema.js";

export function configPath(cwd: string) {
  return path.join(cwd, CONFIG_FILE);
}

export function hasConfig(cwd: string) {
  return existsSync(configPath(cwd));
}

/** Reads and validates southpaw.json. Returns null when there isn't one. */
export async function readConfig(cwd: string): Promise<SouthpawConfig | null> {
  const file = configPath(cwd);
  if (!existsSync(file)) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(file, "utf8"));
  } catch {
    throw new CliError(
      `${CONFIG_FILE} isn't valid JSON.`,
      `Fix or delete it, then run \`southpawui init\`.`,
    );
  }
  const parsed = configSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new CliError(
      `${CONFIG_FILE} is invalid:\n${issues}`,
      "Run `southpawui init --force` to rewrite it.",
    );
  }
  return parsed.data;
}

export async function writeConfig(cwd: string, config: SouthpawConfig) {
  await writeFile(configPath(cwd), `${JSON.stringify(config, null, 2)}\n`);
}
