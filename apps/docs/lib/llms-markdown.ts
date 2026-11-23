import "server-only";
import { typeTableToMarkdown } from "fumadocs-typescript";
import { apiGenerator } from "@/components/docs/api-table";
import { getRegistryItem, registryItemUrl } from "./registry";

/** Attribute text may contain ">" inside quoted values (e.g. a type expression). */
/** Reads `key="value"` string props from a self-closing JSX tag's attribute text. */
function props(attrs: string): Record<string, string> {
  return Object.fromEntries([...attrs.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
}

async function replaceAsync(text: string, re: RegExp, fn: (attrs: string) => Promise<string>) {
  const parts = await Promise.all([...text.matchAll(re)].map((m) => fn(m[1] ?? "")));
  let i = 0;
  return text.replace(re, () => parts[i++]!);
}

/**
 * The page Markdown (llms.txt, /docs/<slug>.md, Copy page) keeps MDX blocks as
 * JSX. Blocks whose content lives elsewhere are expanded so an LLM gets the
 * substance: previews become their source, install tabs their commands, API
 * tables Markdown tables. Blocks with literal data props read fine as they are.
 */
export async function expandBlocksForLLMs(markdown: string): Promise<string> {
  let md = await replaceAsync(
    markdown,
    /<ComponentPreview\s((?:[^>"]|"[^"]*")*?)\/>/g,
    async (attrs) => {
      const { name, title } = props(attrs);
      const item = name ? await getRegistryItem(name) : undefined;
      const code = item?.files[0]?.content.trimEnd();
      return code ? `Example${title ? `: ${title}` : ""}\n\n\`\`\`tsx\n${code}\n\`\`\`` : "";
    },
  );
  md = await replaceAsync(md, /<InstallTabs\s((?:[^>"]|"[^"]*")*?)\/>/g, async (attrs) => {
    const { name } = props(attrs);
    return name ? `\`\`\`bash\nnpx shadcn@latest add ${registryItemUrl(name)}\n\`\`\`` : "";
  });
  md = await replaceAsync(md, /<APITable\s((?:[^>"]|"[^"]*")*?)\/>/g, async (attrs) => {
    const { path, name, type } = props(attrs);
    const docs = await apiGenerator.generateTypeTable({ path, name, type });
    return docs.map((d) => typeTableToMarkdown(d)).join("\n\n");
  });
  return md;
}
