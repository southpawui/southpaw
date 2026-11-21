import path from "node:path";
import { createGenerator, type Generator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { codeThemes } from "@/lib/code-themes";

const docsRoot = process.cwd();
const componentsDir = path.join(docsRoot, "../../packages/ui/src/components");

const base = createGenerator({ tsconfigPath: path.join(docsRoot, "tsconfig.typegen.json") });

const SOURCE_TAG = "southpaw-source";
/** Props declared by React's DOM typings (every HTML attribute) are listed once in prose, not per row. */
const isReactDomProp = (file: string) => /[\\/]@types[\\/]react[\\/]/.test(file);

/**
 * fumadocs-typescript lists every inherited HTML attribute. Keep the props that
 * Southpaw or Base UI declare; their JSDoc becomes the description column.
 */
export const apiGenerator: Generator = {
  ...base,
  async generateTypeTable(props, options) {
    const docs = await base.generateTypeTable(props, {
      ...options,
      basePath: options?.basePath ?? componentsDir,
      typeSimplifier: {
        // Show short types in full ("boolean", '"sm" | "md" | "lg" | "full"'); only long
        // ones collapse to "union" / "function", with the full type a click away.
        override: ({ checker, type, location }) => {
          const full = checker
            .typeToString(type, location)
            .split(" | ")
            .filter((t) => t !== "undefined")
            .join(" | ");
          return full.length > 0 && full.length <= 48 ? full : undefined;
        },
      },
      transform(entry, _type, symbol) {
        // typescript/sync hands back declaration handles; `path` is the declaring file.
        const decl = (
          symbol as unknown as { declarations?: { path?: string; fileOwner?: string }[] }
        ).declarations?.[0];
        entry.tags.push({ name: SOURCE_TAG, text: String(decl?.path ?? decl?.fileOwner ?? "") });
      },
    });
    return docs.map((doc) => ({
      ...doc,
      entries: doc.entries
        .filter((e) => !isReactDomProp(e.tags.find((t) => t.name === SOURCE_TAG)?.text ?? ""))
        .map((e) => ({ ...e, tags: e.tags.filter((t) => t.name !== SOURCE_TAG) })),
    }));
  },
};

/**
 * API reference generated from the TypeScript source (BRIEF §8.8).
 *
 * `path` is relative to packages/ui/src/components. Pass `name` for an exported
 * type, or `name` plus `type` for an expression evaluated in that file's scope, e.g.
 * `name="DialogRootProps" type="React.ComponentProps<typeof Dialog.Root>"`.
 * `name` keeps each table's element ids unique on the page.
 */
export function APITable(props: { path: string; name: string; type?: string }) {
  return <AutoTypeTable generator={apiGenerator} shiki={{ themes: codeThemes }} {...props} />;
}
