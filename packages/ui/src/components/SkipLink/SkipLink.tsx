import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { Link } from "../Link/Link";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// library doesn't need Node types.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * SkipLink (GEO-952)
 *
 * "Skip to main content": the first focusable thing on the page, hidden
 * until it gets focus, so keyboard and screen-reader users can jump past
 * repeated navigation (WCAG 2.4.1, technique G1).
 *
 * Follows govuk-frontend's skip link: on click it moves focus to the
 * target, adding tabindex="-1" only if the target has none and hiding the
 * target's outline, and undoes both on blur. The link stays a real anchor,
 * so the URL hash and native scrolling still happen.
 *
 * Place it first in <body> (or straight after a cookie banner), never
 * inside <nav> or <header>.
 * ============================================================ */

export interface SkipLinkProps extends React.ComponentPropsWithRef<"a"> {
  /** The target, as a same-page hash. Default `#main-content`. */
  href?: string;
  /**
   * Let the browser update the URL hash (default). Set `false` for hash
   * routers (React Router `HashRouter`), where `#main-content` would be read
   * as a route: the click is cancelled and the target is scrolled to and
   * focused by hand.
   */
  updateHash?: boolean;
  /** Replace the link element, e.g. with a router's link. */
  render?: useRender.RenderProp;
}

// Positioning and the chip look. Colour, underline and focus come from Link.
const skipLinkClasses = cn(
  // Off-screen until focused; never display:none, which would drop it from the tab order.
  // The slide clears the top inset too, and the hidden link never catches taps.
  "fixed z-[9999] opacity-0 pointer-events-none",
  "-translate-y-[calc(100%+max(0.75rem,env(safe-area-inset-top))+1rem)]",
  "focus:translate-y-0 focus:opacity-100 focus:pointer-events-auto",
  "top-[max(0.75rem,env(safe-area-inset-top))] start-[max(0.75rem,env(safe-area-inset-left))]",
  "rtl:start-[max(0.75rem,env(safe-area-inset-right))]",
  // Slide in; the duration token is 0ms under prefers-reduced-motion
  "transition-[translate,opacity] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
  "inline-flex h-[var(--sp-control-height)] items-center rounded-md px-4",
  "border-border-default bg-surface-base text-fg-default border text-sm font-semibold shadow-lg",
  // :focus as well as Link's :focus-visible, so it always shows when it has focus
  "focus:sp-focus-ring",
  "print:hidden",
);

const SkipLinkRoot = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  (
    {
      href = "#main-content",
      updateHash = true,
      render,
      className,
      children = "Skip to main content",
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <Link
        {...props}
        ref={ref}
        href={href}
        render={render}
        // A standalone chip in the text colour: underline on hover, no visited
        // colour, and no printed URL (it's hidden in print anyway)
        variant="inherit"
        standalone
        underline="hover"
        visited={false}
        printUrl={false}
        data-slot="skip-link"
        className={mergeClassName(skipLinkClasses, className)}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          // The resolved href (honours <base> and an href set on a `render` element)
          const target = findTarget(event.currentTarget.href || href);
          if (target === undefined) return; // another page: let the browser navigate
          // Hash routers: never let the hash change, even with no target
          if (!updateHash) event.preventDefault();
          if (target === null) {
            if (isDev) {
              console.warn(
                `[Southpaw] SkipLink: no element matches "${href}". Give your main content that id, or use <SkipLink.Target />.`,
              );
            }
            return;
          }
          if (!updateHash) target.scrollIntoView?.();
          focusTarget(target);
        }}
      >
        {children}
      </Link>
    );
  },
);
SkipLinkRoot.displayName = "SkipLink";

/* ============================================================
 * Target
 * ============================================================ */

export interface SkipLinkTargetProps extends React.ComponentPropsWithRef<"div"> {
  /** Must match the link's `href`. Default `main-content`. */
  id?: string;
  /**
   * Space kept above the target when it scrolls into view, so a sticky
   * header doesn't cover it (e.g. `"4rem"`).
   */
  scrollMargin?: string | number;
  /** Render as another element, e.g. `<main />`. */
  render?: useRender.RenderProp;
}

/**
 * Where the skip link lands, for pages whose main content has no id. Put it
 * at the start of the main content, or render the main element through it.
 */
const Target = React.forwardRef<HTMLDivElement, SkipLinkTargetProps>(
  ({ id = "main-content", scrollMargin, render, className, style, ...props }, ref) =>
    useRender({
      defaultTagName: "div",
      render,
      ref,
      props: {
        tabIndex: -1,
        ...props,
        id,
        "data-slot": "skip-link-target",
        className: mergeClassName(cn("outline-none"), className),
        style: scrollMargin != null ? { scrollMarginTop: scrollMargin, ...style } : style,
      },
    }),
);
Target.displayName = "SkipLink.Target";

/* ============================================================
 * Behaviour
 * ============================================================ */

/**
 * The element a same-page hash points at. `undefined` for a link to another
 * page or origin (GOV.UK leaves those alone); `null` when nothing matches.
 */
function findTarget(href: string): HTMLElement | null | undefined {
  if (typeof window === "undefined") return undefined;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return undefined;
  }
  const here = window.location;
  if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search) {
    return undefined;
  }
  let id = url.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // A malformed escape ("#100%"): match the raw id
  }
  if (!id) return null;
  return document.getElementById(id);
}

/**
 * Focus the target (GOV.UK): a temporary tabindex="-1" when it has none, and
 * no outline while it has focus (the link already showed where focus went;
 * w3c/wcag#1001). Both are undone on blur.
 */
function focusTarget(target: HTMLElement) {
  // Activated again while the target still has focus: nothing to set up
  if (target.hasAttribute("data-skip-link-focused")) {
    target.focus();
    return;
  }
  const addedTabindex = !target.hasAttribute("tabindex");
  if (addedTabindex) target.setAttribute("tabindex", "-1");
  const previousOutline = target.style.outlineStyle;
  target.style.outlineStyle = "none";
  target.setAttribute("data-skip-link-focused", "");
  const restore = () => {
    if (addedTabindex) target.removeAttribute("tabindex");
    target.style.outlineStyle = previousOutline;
    target.removeAttribute("data-skip-link-focused");
  };
  target.addEventListener("blur", restore, { once: true });
  target.focus();
  // It couldn't take focus (hidden, inert, in a closed <details>): undo at once
  if (document.activeElement !== target) {
    target.removeEventListener("blur", restore);
    restore();
  }
}

export const SkipLink = Object.assign(SkipLinkRoot, { Target });
