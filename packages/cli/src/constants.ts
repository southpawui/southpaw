/**
 * Where components come from when nothing else says otherwise.
 *
 * TODO(domain): the docs have no public domain yet. Replace this with the real
 * registry URL once it exists. Until then, override with `--registry` or
 * SOUTHPAW_REGISTRY_URL.
 */
export const DEFAULT_REGISTRY = "http://localhost:3001";

/** Registry namespace used in `registryDependencies`. */
export const NAMESPACE = "@southpaw";

/** The project config file this CLI writes. */
export const CONFIG_FILE = "southpaw.json";

/** The alias the registry uses in example/block imports; rewritten to the user's alias. */
export const REGISTRY_COMPONENTS_ALIAS = "@/components";

/** Items every project needs: the tokens and the className helper. */
export const BASE_ITEMS = ["southpaw-tokens", "lib-cn"] as const;

/** Where the tokens' entry file lands, relative to the components folder. */
export const TOKENS_ENTRY = "southpaw/tokens/index.css";
