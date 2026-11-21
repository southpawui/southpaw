export interface RegistryFile {
  /** Repo-relative source path. */
  path: string;
  type: string;
  /** Where `shadcn add` writes the file in the consumer's project. */
  target: string;
}

export interface RegistryEntry {
  name: string;
  type: "registry:ui" | "registry:lib" | "registry:file" | "registry:example";
  title?: string;
  description?: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

export type RegistryIndex = Record<string, RegistryEntry>;
