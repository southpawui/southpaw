import path from "node:path";
import { REGISTRY_COMPONENTS_ALIAS } from "../constants.js";

const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"']+)\2/g;

/**
 * Rewrites the registry's `@/components/...` imports to the project's alias
 * (e.g. `~/components/...`), or to a relative path when the project has no
 * alias. Relative imports are left alone: Southpaw's own files only use those.
 */
export function rewriteImports(
  code: string,
  {
    alias,
    componentsDirAbs,
    fileAbs,
  }: { alias: string | null; componentsDirAbs: string; fileAbs: string },
): string {
  return code.replace(SPECIFIER, (whole, lead: string, quote: string, spec: string) => {
    if (spec !== REGISTRY_COMPONENTS_ALIAS && !spec.startsWith(`${REGISTRY_COMPONENTS_ALIAS}/`))
      return whole;
    const rest = spec.slice(REGISTRY_COMPONENTS_ALIAS.length);
    let next: string;
    if (alias) {
      next = `${alias}${rest}`;
    } else {
      next = path
        .relative(path.dirname(fileAbs), path.join(componentsDirAbs, rest))
        .split(path.sep)
        .join("/");
      if (!next.startsWith(".")) next = `./${next}`;
    }
    return `${lead}${quote}${next}${quote}`;
  });
}
