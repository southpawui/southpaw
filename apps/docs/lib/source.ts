import { llms, loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import { codeThemes } from "./code-themes";
import { z } from "zod";
import { docsRoute, STATUSES } from "./shared";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      /** Component lifecycle status. Required on component pages, shown as a badge. */
      status: z.enum(STATUSES).optional(),
    }),
    postprocess: { includeProcessedMarkdown: true },
    mdxOptions: applyMdxPreset({ rehypeCodeOptions: { themes: codeThemes } }),
  },
  meta: { schema: metaSchema },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
});

export const docsLlms = llms(source, {
  renderPage: async (page) => {
    // Imported lazily: it pulls in the TypeScript generator, which only the Markdown routes need.
    const { expandBlocksForLLMs } = await import("./llms-markdown");
    const body = await expandBlocksForLLMs(await page.data.getText("processed"));
    return `# ${page.data.title} (${page.url})\n\n${page.data.description ?? ""}\n\n${body}`;
  },
  // /docs/<slug>.md is rewritten to the /llms.mdx route in next.config.mjs.
  renderUrl: (item) => item.url,
});
