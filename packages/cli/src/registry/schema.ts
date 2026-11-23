import * as z from "zod/mini";

/**
 * The parts of a shadcn-format registry item this CLI uses. Unknown fields are
 * allowed, so the registry can keep serving the full shadcn format.
 */
export const registryFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  target: z.optional(z.string()),
  content: z.string(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  title: z.optional(z.string()),
  description: z.optional(z.string()),
  dependencies: z.optional(z.array(z.string())),
  registryDependencies: z.optional(z.array(z.string())),
  files: z.array(registryFileSchema),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryFile = z.infer<typeof registryFileSchema>;
