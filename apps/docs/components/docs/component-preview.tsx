import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { codeThemes } from "@/lib/code-themes";
import { getRegistryItem } from "@/lib/registry";
import { PreviewTabs } from "./preview-tabs";
import { RegistryDemo } from "./registry-demo";

/**
 * A live registry example with Preview / Code tabs (shadcn apps/v4 pattern).
 * `name` is an example in packages/registry/examples; the code shown is the
 * file as `shadcn add` installs it.
 */
export async function ComponentPreview({
  name,
  title,
  align,
}: {
  name: string;
  /** Accessible label for the tabs, e.g. "Basic dialog". */
  title: string;
  align?: "center" | "start" | "end";
}) {
  const item = await getRegistryItem(name);
  const code = item?.files[0]?.content;
  if (!item || !code) {
    throw new Error(`ComponentPreview: "${name}" is not in the registry. Run pnpm registry.`);
  }
  return (
    <PreviewTabs
      label={title}
      align={align}
      preview={<RegistryDemo name={name} />}
      code={
        <ServerCodeBlock
          themes={codeThemes}
          code={code.trimEnd()}
          lang="tsx"
          codeblock={{ title: `${name}.tsx` }}
        />
      }
    />
  );
}

/** A registry file's source on its own (shadcn component-source). */
export async function ComponentSource({ name, file = 0 }: { name: string; file?: number }) {
  const item = await getRegistryItem(name);
  const f = item?.files[file];
  if (!f) throw new Error(`ComponentSource: "${name}" has no file ${file}.`);
  return (
    <ServerCodeBlock
      themes={codeThemes}
      code={f.content.trimEnd()}
      lang={f.target.split(".").pop() ?? "tsx"}
      codeblock={{ title: f.target }}
    />
  );
}
