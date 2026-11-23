import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import type { Framework } from "../config/schema.js";
import { CliError } from "../errors.js";
import { CSS_CANDIDATES } from "./framework.js";

/** Tailwind v4's entry point. v3 used `@tailwind base;` directives instead. */
const TAILWIND_V4_IMPORT = /@import\s+(?:url\()?["']tailwindcss["']/;

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  ".turbo",
  ".vercel",
  "coverage",
]);

export function importsTailwind(file: string) {
  return TAILWIND_V4_IMPORT.test(readFileSync(file, "utf8"));
}

function findCssFiles(dir: string, root: string, depth: number, out: string[]) {
  if (depth < 0) return;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith(".")) continue;
    const abs = path.join(dir, entry);
    const st = statSync(abs);
    if (st.isDirectory()) findCssFiles(abs, root, depth - 1, out);
    else if (entry.endsWith(".css")) out.push(path.relative(root, abs).split(path.sep).join("/"));
  }
}

/**
 * Global stylesheets that import Tailwind v4: the framework's usual file first,
 * then any other CSS file that imports `tailwindcss`.
 */
export function findTailwindStylesheets(cwd: string, framework: Framework): string[] {
  const found = new Set<string>();
  for (const c of CSS_CANDIDATES[framework]) {
    const abs = path.join(cwd, c);
    if (existsSync(abs) && importsTailwind(abs)) found.add(c);
  }
  const all: string[] = [];
  findCssFiles(cwd, cwd, 4, all);
  for (const f of all.sort()) if (importsTailwind(path.join(cwd, f))) found.add(f);
  return [...found];
}

/** Validates a stylesheet the user pointed at with --css. */
export function assertTailwindStylesheet(cwd: string, file: string) {
  const abs = path.resolve(cwd, file);
  if (!existsSync(abs)) throw new CliError(`${file} doesn't exist.`);
  if (!importsTailwind(abs)) throw tailwindMissing(file);
}

export function tailwindMissing(file?: string) {
  return new CliError(
    file
      ? `${file} doesn't import Tailwind CSS v4.`
      : "Couldn't find a stylesheet that imports Tailwind CSS v4.",
    'Southpaw needs Tailwind v4. Install it (https://tailwindcss.com/docs/installation), make sure your global CSS has `@import "tailwindcss";`, then run init again.',
  );
}
