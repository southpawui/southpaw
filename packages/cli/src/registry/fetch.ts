import { NAMESPACE } from "../constants.js";
import { CliError } from "../errors.js";
import { registryItemSchema, type RegistryItem } from "./schema.js";

export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

const ITEM_NAME = /^[a-z0-9][a-z0-9-]*$/;

/** Normalises a registry base URL: http(s) only, no trailing slash. */
export function normaliseRegistry(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new CliError(`"${url}" isn't a valid registry URL.`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new CliError(`The registry must be an http(s) URL, not "${parsed.protocol}".`);
  }
  return parsed.toString().replace(/\/$/, "");
}

/**
 * Turns what the user typed (or a registryDependency) into the item's URL.
 * Accepts `dialog`, `@southpaw/dialog`, or a full `http(s)://…/x.json` URL.
 */
export function itemUrl(spec: string, registry: string): string {
  if (/^https?:\/\//i.test(spec)) {
    // Full URLs (typed, or from registry content) must stay on the registry's own origin.
    let url: URL;
    try {
      url = new URL(spec);
    } catch {
      throw new CliError(`"${spec}" isn't a valid URL.`);
    }
    if (url.origin !== new URL(registry).origin) {
      throw new CliError(
        `"${spec}" isn't on the Southpaw registry (${registry}).`,
        "southpawui only installs @southpaw items.",
      );
    }
    return url.toString();
  }
  const name = spec.startsWith(`${NAMESPACE}/`) ? spec.slice(NAMESPACE.length + 1) : spec;
  if (spec.startsWith("@") && !spec.startsWith(`${NAMESPACE}/`)) {
    throw new CliError(
      `"${spec}" is from another registry. southpawui only installs ${NAMESPACE} items.`,
    );
  }
  if (!ITEM_NAME.test(name)) {
    throw new CliError(
      `"${spec}" isn't a valid component name.`,
      "Names are lowercase, with dashes: e.g. `dialog`, `radio-group`.",
    );
  }
  return `${registry}/r/${name}.json`;
}

/** Fetches and validates one registry item. */
export async function fetchItem(
  url: string,
  { fetcher = fetch, timeoutMs = 15_000 }: { fetcher?: Fetcher; timeoutMs?: number } = {},
): Promise<RegistryItem> {
  let res: Response;
  try {
    res = await fetcher(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new CliError(
      `Couldn't reach the registry at ${url} (${reason}).`,
      "Check your connection, or the registry URL in southpaw.json.",
    );
  }
  if (res.status === 404) {
    throw new CliError(`No component at ${url}.`, "Check the name. The docs list every component.");
  }
  if (!res.ok) {
    throw new CliError(`The registry answered ${res.status} ${res.statusText} for ${url}.`);
  }
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new CliError(`${url} didn't return valid JSON.`);
  }
  const parsed = registryItemSchema.safeParse(json);
  if (!parsed.success) {
    throw new CliError(
      `${url} isn't a valid registry item: ${parsed.error.issues[0]?.message ?? "unknown error"}.`,
    );
  }
  return parsed.data;
}
