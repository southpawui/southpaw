import { fetchItem, itemUrl, type Fetcher } from "./fetch.js";
import type { RegistryItem } from "./schema.js";

/**
 * Fetches the requested items and, recursively, their registryDependencies.
 * Returns each item once, dependencies before the items that need them.
 * Cycles are tolerated: an item already being resolved isn't fetched again.
 */
export async function resolveItems(
  specs: string[],
  registry: string,
  options: { fetcher?: Fetcher } = {},
): Promise<RegistryItem[]> {
  const ordered: RegistryItem[] = [];
  const done = new Set<string>();
  const inProgress = new Set<string>();
  const cache = new Map<string, Promise<RegistryItem>>();

  const load = (url: string) => {
    let p = cache.get(url);
    if (!p) {
      p = fetchItem(url, options);
      cache.set(url, p);
    }
    return p;
  };

  async function visit(spec: string) {
    const url = itemUrl(spec, registry);
    if (done.has(url) || inProgress.has(url)) return;
    inProgress.add(url);
    const item = await load(url);
    for (const dep of item.registryDependencies ?? []) await visit(dep);
    inProgress.delete(url);
    done.add(url);
    ordered.push(item);
  }

  for (const spec of specs) await visit(spec);
  return ordered;
}
