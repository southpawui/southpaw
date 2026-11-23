import { cn } from "./cn";

/* ============================================================
 * Shared link styling and behaviour (GEO-967)
 *
 * Used by Link and by anything else that renders a link: ErrorSummary,
 * SkipLink, NavigationMenu, Menu.LinkItem, Toolbar.Link and, later, Button
 * `href` and Card.Link. One place for the colours, underline, focus ring,
 * new-tab behaviour and wording.
 * ============================================================ */

export type LinkVariant = "default" | "muted" | "inherit" | "inverse";
export type LinkUnderline = "always" | "hover" | "none";
export type LinkSize = "sm" | "md" | "lg";

export interface LinkClassOptions {
  /** Colour. `default` is the link blue; `inherit` takes the surrounding text colour. */
  variant?: LinkVariant;
  /**
   * `always` (default). `hover` and `none` only apply to standalone links:
   * inline links keep their underline, because colour alone can't mark a
   * link inside text (WCAG 1.4.1).
   */
  underline?: LinkUnderline;
  /** A link on its own line or in a list, not inside a sentence. */
  standalone?: boolean;
  /** Standalone links only; inline links take the size of the text around them. */
  size?: LinkSize;
  /** Show visited links in the visited colour (default links only). Default `true`. */
  visited?: boolean;
}

// Literal class names throughout: Tailwind can't see class names built at runtime.

// GOV.UK's underline: thin at rest, thicker on hover, skip-ink off while hovered.
const underlineClasses =
  "underline decoration-[length:max(1px,0.0625rem)] underline-offset-[0.1578em] hover:decoration-[length:max(3px,0.1875rem,0.12em)] hover:[text-decoration-skip-ink:none]";
const underlineOnHoverClasses =
  "no-underline decoration-[length:max(3px,0.1875rem,0.12em)] underline-offset-[0.1578em] hover:underline hover:[text-decoration-skip-ink:none]";

const variantClasses: Record<LinkVariant, string> = {
  default: "text-link hover:text-link-hover active:text-fg-default",
  muted: "text-fg-muted hover:text-fg-default active:text-fg-default",
  inherit: "text-inherit",
  // On a solid brand or dark surface; pairs with fg-on-brand
  inverse: "text-fg-on-brand",
};

const sizeClasses: Record<LinkSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

/** The shared focus ring, for link-like parts that set their own radius (navigation rows). */
export const focusRingClasses = "outline-none focus-visible:sp-focus-ring";
/** The shared focus ring for links: wraps with the text and has a small radius. */
export const linkFocusClasses = `${focusRingClasses} rounded-sm`;

export function linkClasses({
  variant = "default",
  underline = "always",
  standalone = false,
  size,
  visited = true,
}: LinkClassOptions = {}) {
  // Inline links are always underlined (WCAG 1.4.1)
  const decoration = standalone ? underline : "always";
  return cn(
    "cursor-pointer box-decoration-clone",
    linkFocusClasses,
    // A 2px gap above and below the text, inside the focus ring (George, option (a)).
    // The ring is a box-shadow, so outline-offset can't move it: padding does.
    // Vertical padding on an inline box doesn't change the line box, so nothing
    // moves. The sides stay tight: a word space is only ~4px, and a side gap
    // pushed the ring over the neighbouring letters. Standalone links are boxes
    // (rows, SkipLink) and keep the ring on their edge, like every control.
    !standalone && "py-0.5",
    "transition-[color,text-decoration-color,text-decoration-thickness] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
    decoration === "always" && underlineClasses,
    decoration === "hover" && underlineOnHoverClasses,
    decoration === "none" && "no-underline",
    variantClasses[variant],
    // Visited colour only on default links; hover still wins (listed after)
    variant === "default" && visited && "visited:text-link-visited visited:hover:text-link-hover",
    // The current page: still a link, but reads as "you are here"
    "aria-[current=page]:font-semibold",
    variant === "default" && "aria-[current=page]:text-fg-default",
    standalone && "inline-flex min-h-6 items-center gap-1.5 font-medium",
    standalone && size && sizeClasses[size],
  );
}

/* ============================================================
 * Behaviour
 * ============================================================ */

export interface LinkLabels {
  /** Hidden text after a link that opens in a new tab. */
  newTab: string;
  /** Hidden text after a download link. */
  download: string;
}

export const defaultLinkLabels: LinkLabels = {
  newTab: "(opens in new tab)",
  download: "(download)",
};

export interface LinkBehaviour {
  /** `target="_blank"`: show the icon and the hidden "(opens in new tab)". */
  newTab: boolean;
  /** Has `download`: show the icon and the hidden "(download)". */
  download: boolean;
  /** `rel`, with `noopener noreferrer` merged in for new tabs. */
  rel: string | undefined;
  /** The URL to print after the link, or `undefined` (hash, mailto, tel, none). */
  printUrl: string | undefined;
}

/** Merge `noopener noreferrer` into a consumer's `rel` without dropping theirs. */
export function mergeRel(rel: string | undefined, newTab: boolean) {
  if (!newTab) return rel;
  const parts = new Set((rel ?? "").split(/\s+/).filter(Boolean));
  parts.add("noopener");
  parts.add("noreferrer");
  return [...parts].join(" ");
}

/**
 * GOV.UK prints the URL after absolute and root-relative links. Not for
 * same-page hashes, `mailto:`/`tel:` or relative paths.
 */
export function printableUrl(href: string | undefined) {
  if (!href) return undefined;
  if (/^https?:\/\//i.test(href) || /^\/(?!\/)/.test(href)) return href;
  return undefined;
}

export function getLinkBehaviour({
  href,
  target,
  rel,
  download,
  printUrl = true,
}: {
  href?: string;
  target?: string;
  rel?: string;
  download?: unknown;
  printUrl?: boolean;
}): LinkBehaviour {
  const newTab = target === "_blank";
  return {
    newTab,
    download: download != null && download !== false,
    rel: mergeRel(rel, newTab),
    printUrl: printUrl ? printableUrl(href) : undefined,
  };
}
