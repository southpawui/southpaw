import * as z from "zod/mini";

export const FRAMEWORKS = ["next-app", "next-pages", "vite", "react-router", "other"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

/** `southpaw.json`: everything `add` needs, worked out once by `init`. */
export const configSchema = z.object({
  $schema: z.optional(z.string()),
  /** Registry base URL; items live at `<registry>/r/<name>.json`. */
  registry: z.string(),
  framework: z.enum(FRAMEWORKS),
  /** TypeScript only in v1. */
  tsx: z.literal(true),
  /** The global stylesheet that imports Tailwind and the Southpaw tokens. */
  css: z.string(),
  aliases: z.object({
    /** Import alias for the components folder, e.g. "@/components". Null when the project has no alias. */
    components: z.nullable(z.string()),
  }),
  paths: z.object({
    /** The components folder, relative to the project root, e.g. "components" or "src/components". */
    components: z.string(),
  }),
});

export type SouthpawConfig = z.infer<typeof configSchema>;
