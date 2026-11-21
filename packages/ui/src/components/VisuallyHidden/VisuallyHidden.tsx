import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../../lib/cn";

/* ============================================================
 * VisuallyHidden (GEO-968)
 *
 * Text that screen readers announce but that isn't shown on screen, e.g.
 * the " name" in a "Change name" link. A thin layer over Tailwind's
 * `sr-only` that adds what GOV.UK's `govuk-visually-hidden` has and
 * `sr-only` lacks:
 *
 * - `margin: 0` instead of `-1px` (a negative margin can scramble the
 *   VoiceOver reading order and push the box past the edge in RTL);
 * - non-breaking-space pseudo-elements, so hidden text never runs into
 *   the words around it ("Changename");
 * - `user-select: none`, so copying the visible text doesn't pick it up.
 *
 * The literal `sr-only` class stays, so `.sr-only` selectors still match.
 * For a one-off inside a component, plain `sr-only` is fine.
 * ============================================================ */

export interface VisuallyHiddenProps extends React.ComponentPropsWithRef<"span"> {
  /**
   * Hidden until it, or something inside it, has focus (GOV.UK's
   * `govuk-visually-hidden-focusable`). Styling when shown is up to you.
   */
  focusable?: boolean;
  /** Render as another element, e.g. `<div />` or `<h2 />`. Default `span`. */
  render?: useRender.RenderProp;
}

// Hidden: sr-only + GOV.UK's fixes. Literal class names (Tailwind can't see built ones).
// String.raw keeps one backslash in both the source Tailwind scans and the runtime
// class, so `content: '\00a0'` (a non-breaking space) actually matches.
const hiddenClasses = String.raw`sr-only m-0 select-none before:content-['\00a0'] after:content-['\00a0']`;

// Focusable: the same, but only while neither it nor a child has focus or is pressed.
// When shown, no spacer pseudo-elements and no forced margin.
const focusableClasses = cn(
  "not-focus-within:not-active:sr-only not-focus-within:not-active:m-0 not-focus-within:not-active:select-none",
  String.raw`not-focus-within:not-active:before:content-['\00a0'] not-focus-within:not-active:after:content-['\00a0']`,
);

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ focusable = false, render, className, ...props }, ref) =>
    useRender({
      defaultTagName: "span",
      render,
      ref,
      props: {
        ...props,
        "data-slot": "visually-hidden",
        "data-focusable": focusable ? "" : undefined,
        // Layout classes in `className` (relative, flex…) override sr-only: don't add them.
        className: cn(focusable ? focusableClasses : hiddenClasses, className),
      },
    }),
);
VisuallyHidden.displayName = "VisuallyHidden";
