import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";

/* ============================================================
 * Root (pass-through)
 * ============================================================ */

/** Groups the parts of one dialog and owns its open state. Renders no element. */
const Root = BaseDialog.Root;

/* ============================================================
 * Trigger (pass-through with data-slot)
 * ============================================================ */

/** The control that opens the dialog. Use `render` to make a Southpaw Button the trigger. */
const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Trigger>
>(({ className, ...props }, ref) => (
  <BaseDialog.Trigger
    ref={ref}
    data-slot="dialog-trigger"
    className={mergeClassName(cn(""), className)}
    {...props}
  />
));
Trigger.displayName = "Dialog.Trigger";

/* ============================================================
 * Portal (pass-through)
 * ============================================================ */

/** Moves the backdrop and popup to the end of `<body>`, outside any clipping or stacking context. */
const Portal = BaseDialog.Portal;

/* ============================================================
 * Backdrop
 * ============================================================ */

/** The dimmed layer behind the popup. Clicking it closes the dialog unless `disablePointerDismissal` is set on Root. */
const Backdrop = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDialog.Backdrop>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Backdrop
      ref={ref}
      data-slot="dialog-backdrop"
      className={mergeClassName(
        cn(
          "fixed inset-0 bg-black/50",
          "transition-opacity duration-[var(--sp-duration-entrance)] ease-[var(--sp-easing-default)]",
          "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        ),
        className,
      )}
      {...props}
    />
  ),
);
Backdrop.displayName = "Dialog.Backdrop";

/* ============================================================
 * Popup
 * ============================================================ */

/** Props for `Dialog.Popup`: Base UI popup props plus `size`. */
export interface DialogPopupProps extends React.ComponentProps<typeof BaseDialog.Popup> {
  /**
   * Maximum width: sm 384px, md 448px, lg 512px. `full` fills the viewport with no radius.
   * On narrow screens every size except `full` keeps a 1rem margin.
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "full";
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-none h-screen w-screen rounded-none",
};

/** The dialog panel (`role="dialog"`). Traps focus while open and returns it to the trigger on close. */
const Popup = React.forwardRef<HTMLDivElement, DialogPopupProps>(
  ({ className, size = "md", ...props }, ref) => (
    <BaseDialog.Popup
      ref={ref}
      data-slot="dialog-popup"
      data-size={size}
      className={mergeClassName(
        cn(
          // Position
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          // Phones: a 1rem inset each side so it doesn't touch the screen edges (except full).
          // On width, not max-width: a `max-w-[calc(100vw-2rem)]` was merged away by
          // tailwind-merge in favour of the size's `max-w-*`, so phones got edge-to-edge
          // popups (GEO-970). Width keeps the inset; the size's max-width still caps it.
          size === "full" ? "w-full" : "w-[calc(100%-2rem)]",
          // Size
          size !== "full" && sizeClasses[size],
          size === "full" && sizeClasses.full,
          // Surface
          size !== "full" && "bg-surface-overlay rounded-[var(--radius-lg)] shadow-lg",
          size === "full" && "bg-surface-overlay",
          // Layout
          "flex flex-col",
          // Animation
          "transition-[opacity,transform] duration-[var(--sp-duration-entrance)] ease-[var(--sp-easing-default)]",
          "data-[ending-style]:scale-[var(--sp-scale-enter)] data-[ending-style]:opacity-0",
          "data-[starting-style]:scale-[var(--sp-scale-enter)] data-[starting-style]:opacity-0",
        ),
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Dialog.Popup";

/* ============================================================
 * Header
 * ============================================================ */

/** Top row holding the title, description and close button. */
const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-header"
      className={mergeClassName(cn("flex items-start justify-between gap-4 p-6 pb-0"), className)}
      {...props}
    />
  ),
);
Header.displayName = "Dialog.Header";

/* ============================================================
 * Body (scrollable content area)
 * ============================================================ */

/** The main content. Scrolls on its own when it overflows, so the header and footer stay visible. */
const Body = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-body"
      className={mergeClassName(cn("flex-1 overflow-y-auto p-6"), className)}
      {...props}
    />
  ),
);
Body.displayName = "Dialog.Body";

/* ============================================================
 * Footer
 * ============================================================ */

/** Action buttons. Full-width and stacked on mobile (primary on top), in a right-aligned row from `sm` up. */
const Footer = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-footer"
      className={mergeClassName(
        cn(
          "flex flex-col-reverse gap-2 p-6 pt-0",
          "[&>[data-slot=button]]:w-full [&>[data-slot=dialog-close]>[data-slot=button]]:w-full",
          "sm:flex-row sm:items-center sm:justify-end sm:gap-3",
          "sm:[&>[data-slot=button]]:w-auto sm:[&>[data-slot=dialog-close]>[data-slot=button]]:w-auto",
        ),
        className,
      )}
      {...props}
    />
  ),
);
Footer.displayName = "Dialog.Footer";

/* ============================================================
 * Title
 * ============================================================ */

/** The dialog heading. Names the dialog through `aria-labelledby`. Every dialog needs one. */
const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BaseDialog.Title>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Title
      ref={ref}
      data-slot="dialog-title"
      className={mergeClassName(cn("text-fg-default text-lg font-semibold"), className)}
      {...props}
    />
  ),
);
Title.displayName = "Dialog.Title";

/* ============================================================
 * Description
 * ============================================================ */

/** Supporting text under the title. Describes the dialog through `aria-describedby`. */
const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    data-slot="dialog-description"
    className={mergeClassName(cn("text-fg-muted mt-1 text-sm"), className)}
    {...props}
  />
));
Description.displayName = "Dialog.Description";

/* ============================================================
 * Close (unstyled — for wrapping buttons)
 * ============================================================ */

/** Unstyled close behaviour. Wrap an action with `render`, e.g. `<Dialog.Close render={<Button />}>Cancel</Dialog.Close>`. */
const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseDialog.Close>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Close
      ref={ref}
      data-slot="dialog-close"
      className={mergeClassName(cn(""), className)}
      {...props}
    />
  ),
);
Close.displayName = "Dialog.Close";

/* ============================================================
 * CloseButton (styled X in top-right corner)
 * ============================================================ */

/** The styled × button for the header, with the accessible name "Close". */
const CloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    data-slot="dialog-close-button"
    className={mergeClassName(
      cn(
        "text-fg-muted hover:text-fg-default cursor-pointer rounded-sm p-1",
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "focus-visible:sp-focus-ring",
      ),
      className,
    )}
    aria-label="Close"
    {...props}
  >
    <X weight="bold" className="h-4 w-4" />
  </BaseDialog.Close>
));
CloseButton.displayName = "Dialog.CloseButton";

/* ============================================================
 * Compound export
 * ============================================================ */

/** A modal window over the page, built on the Base UI Dialog. */
export const Dialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Header,
  Body,
  Footer,
  Title,
  Description,
  Close,
  CloseButton,
};
