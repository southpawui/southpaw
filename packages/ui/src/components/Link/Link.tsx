import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { ArrowSquareOutIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import {
  defaultLinkLabels,
  getLinkBehaviour,
  linkClasses,
  type LinkLabels,
  type LinkSize,
  type LinkUnderline,
  type LinkVariant,
} from "../../lib/link";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// library doesn't need Node types.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * Link (GEO-967)
 *
 * A styled, accessible text link: one `<a>`, built with useRender so a
 * router link can stand in. GOV.UK's underline (thicker on hover), a
 * visited colour, a new-tab icon with hidden "(opens in new tab)" text,
 * download links, `aria-current`, and the URL printed after the link.
 *
 * Links aren't disabled: if a link isn't available, show plain text and
 * say why (GOV.UK).
 * ============================================================ */

export interface LinkProps extends React.ComponentPropsWithRef<"a"> {
  /** Colour. `default` is the link blue; `inherit` takes the surrounding text colour. */
  variant?: LinkVariant;
  /**
   * `always` (default). `hover` and `none` only apply to `standalone` links:
   * inside text, colour alone can't mark a link (WCAG 1.4.1).
   */
  underline?: LinkUnderline;
  /** A link on its own (a list of links, "Back", "View all"), not inside a sentence. */
  standalone?: boolean;
  /** Standalone links only. Inline links take the size of the text around them. */
  size?: LinkSize;
  /** Show visited links in the visited colour (default variant). Default `true`. */
  visited?: boolean;
  /** An icon for a standalone link. Mark directional icons `rtl:-scale-x-100`. */
  icon?: React.ReactNode;
  /** Where the icon goes. Default `end`. */
  iconPosition?: "start" | "end";
  /** Show the new-tab icon when `target="_blank"`. The hidden text always stays. Default `true`. */
  externalIcon?: boolean;
  /** Print the URL after absolute and root-relative links. Default `true`. */
  printUrl?: boolean;
  /** Translations for the hidden text. */
  labels?: Partial<LinkLabels>;
  /** Replace the anchor, e.g. with a router link: `render={<NextLink href="/" />}`. */
  render?: useRender.RenderProp;
}

const suffixIcon = "size-[1em] shrink-0 align-[-0.125em]";

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      variant = "default",
      underline = "always",
      standalone = false,
      size,
      visited = true,
      icon,
      iconPosition = "end",
      externalIcon = true,
      printUrl = true,
      labels: labelsProp,
      render,
      className,
      children,
      href,
      target,
      rel,
      download,
      ...props
    },
    ref,
  ) => {
    const labels = { ...defaultLinkLabels, ...labelsProp };
    const behaviour = getLinkBehaviour({ href, target, rel, download, printUrl });

    // Dev warnings, once per mount (like Accordion and Collapsible), not on every render
    const p = props as Record<string, unknown>;
    const ariaDisabled = p["aria-disabled"];
    const triesDisabled =
      "disabled" in p ||
      (ariaDisabled !== undefined && ariaDisabled !== false && ariaDisabled !== "false");
    const ignoredUnderline = !standalone && underline !== "always";
    const warned = React.useRef({ disabled: false, underline: false });
    React.useEffect(() => {
      if (!isDev) return;
      if (triesDisabled && !warned.current.disabled) {
        warned.current.disabled = true;
        console.warn(
          "[Southpaw] Link: links can't be disabled. Show plain text instead, and say why the link isn't available.",
        );
      }
      if (ignoredUnderline && !warned.current.underline) {
        warned.current.underline = true;
        console.warn(
          `[Southpaw] Link: underline="${underline}" only applies to standalone links. Inline links keep their underline (WCAG 1.4.1).`,
        );
      }
    }, [triesDisabled, ignoredUnderline, underline]);

    // New-tab and download markers: an icon plus hidden text for screen readers
    const suffix =
      behaviour.newTab || behaviour.download ? (
        <>
          {behaviour.newTab && (
            <span data-slot="link-external">
              {externalIcon && (
                <ArrowSquareOutIcon
                  aria-hidden="true"
                  className={cn(suffixIcon, "ms-[0.25em] inline rtl:-scale-x-100")}
                />
              )}
              <VisuallyHidden>{labels.newTab}</VisuallyHidden>
            </span>
          )}
          {behaviour.download && (
            <span data-slot="link-download">
              <DownloadSimpleIcon
                aria-hidden="true"
                className={cn(suffixIcon, "ms-[0.25em] inline")}
              />
              <VisuallyHidden>{labels.download}</VisuallyHidden>
            </span>
          )}
        </>
      ) : null;

    const content = (
      <>
        {standalone && icon && iconPosition === "start" && icon}
        {withSuffix(children, suffix)}
        {standalone && icon && iconPosition === "end" && icon}
        {behaviour.printUrl && (
          // Paper can't follow a link, so print the address (GOV.UK). Not shown on screen.
          <span data-slot="link-print-url" aria-hidden="true" className="hidden print:inline">
            {` (${behaviour.printUrl})`}
          </span>
        )}
      </>
    );

    return useRender({
      defaultTagName: "a",
      render,
      ref,
      props: {
        // A component built on Link (ErrorSummary, SkipLink…) can keep its own slot
        "data-slot": "link",
        ...props,
        href,
        target,
        rel: behaviour.rel,
        download,
        "data-variant": variant,
        "data-standalone": standalone ? "" : undefined,
        "data-new-tab": behaviour.newTab ? "" : undefined,
        className: cn(linkClasses({ variant, underline, standalone, size, visited }), className),
        children: content,
      },
    });
  },
);
Link.displayName = "Link";

/**
 * Keep the new-tab or download icon on the same line as the last word, so it
 * never wraps onto a line of its own. Plain-text children: the last word and
 * the icon share a no-wrap span. Other children: a word joiner (hidden from
 * screen readers, so it stays out of the accessible name).
 */
function withSuffix(children: React.ReactNode, suffix: React.ReactNode) {
  if (!suffix) return children;
  if (typeof children === "string") {
    const match = /^([\s\S]*?)(\S+)(\s*)$/.exec(children);
    if (match) {
      return (
        <>
          {match[1]}
          <span className="whitespace-nowrap">
            {match[2]}
            {suffix}
          </span>
        </>
      );
    }
  }
  return (
    <>
      {children}
      <span aria-hidden="true">{"\u2060"}</span>
      {suffix}
    </>
  );
}
