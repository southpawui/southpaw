import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const TOKENS_IMPORT = /^[ \t]*@import\s+["'][^"']*southpaw\/tokens\/index\.css["'];?[^\n]*\n?/m;
const TAILWIND_IMPORT = /^[ \t]*@import\s+(?:url\()?["']tailwindcss["'][^\n]*\n?/m;

/** The import path from the stylesheet to the tokens entry, always relative and posix. */
export function tokensImportPath(cssAbs: string, tokensAbs: string): string {
  let rel = path.relative(path.dirname(cssAbs), tokensAbs).split(path.sep).join("/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

/**
 * Makes sure the global stylesheet imports the Southpaw tokens, right after
 * `@import "tailwindcss";`. Fixes an existing tokens import with a stale path.
 * Returns "added" | "updated" | "unchanged".
 */
export async function ensureTokensImport(
  cssAbs: string,
  tokensAbs: string,
  { dryRun = false } = {},
) {
  const css = await readFile(cssAbs, "utf8");
  const line = `@import "${tokensImportPath(cssAbs, tokensAbs)}";\n`;
  const existing = css.match(TOKENS_IMPORT)?.[0];
  if (existing) {
    if (existing.trimEnd() === line.trimEnd()) return "unchanged" as const;
    if (!dryRun) await writeFile(cssAbs, css.replace(TOKENS_IMPORT, line));
    return "updated" as const;
  }
  const tw = css.match(TAILWIND_IMPORT);
  const next =
    tw && tw.index !== undefined
      ? `${css.slice(0, tw.index + tw[0].length)}${tw[0].endsWith("\n") ? "" : "\n"}${line}${css.slice(tw.index + tw[0].length)}`
      : `${line}${css}`;
  if (!dryRun) await writeFile(cssAbs, next);
  return "added" as const;
}
