import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Index, SITE_URL } from "@/registry/__index__";
import type { RegistryEntry } from "@/registry/types";

interface RegistryItemJson extends RegistryEntry {
  files: (RegistryEntry["files"][number] & { content: string })[];
}

const publicDir = path.join(process.cwd(), "public/r");

export { SITE_URL };

export function getRegistryEntry(name: string): RegistryEntry | undefined {
  return Index[name];
}

/** The built registry item, with file contents as installed (import paths rewritten for demos). */
export async function getRegistryItem(name: string): Promise<RegistryItemJson | undefined> {
  if (!Index[name]) return undefined;
  return JSON.parse(
    await readFile(path.join(publicDir, `${name}.json`), "utf8"),
  ) as RegistryItemJson;
}

export function registryItemUrl(name: string) {
  return `${SITE_URL}/r/${name}.json`;
}

/** Registry dependencies (`@southpaw/<name>`) → the item names this registry serves. */
export function localDependencyNames(entry: RegistryEntry): string[] {
  return entry.registryDependencies
    .filter((d) => d.startsWith("@southpaw/"))
    .map((d) => d.slice("@southpaw/".length));
}
