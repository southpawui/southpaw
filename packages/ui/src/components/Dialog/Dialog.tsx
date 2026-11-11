import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root (pass-through)
 * ============================================================ */

const Root = BaseDialog.Root;

/* ============================================================
 * Trigger (pass-through with data-slot)
 * ============================================================ */

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Trigger>
>(({ className, ...props }, ref) => (
  <BaseDialog.Trigger ref={ref} data-slot="dialog-trigger" className={cn(className)} {...props} />
));
Trigger.displayName = "Dialog.Trigger";

/* ============================================================
 * Portal (pass-through)
 * ============================================================ */

const Portal = BaseDialog.Portal;

/* ============================================================
 * Backdrop
 * ============================================================ */

const Backdrop = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDialog.Backdrop>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Backdrop
      ref={ref}
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 bg-black/50",
        "transition-opacity duration-[var(--sp-duration-entrance)] ease-[var(--sp-easing-default)]",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
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

export interface DialogPopupProps extends React.ComponentProps<typeof BaseDialog.Popup> {
  /** Dialog width */
  size?: "sm" | "md" | "lg" | "full";
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-none h-screen w-screen rounded-none",
};

const Popup = React.forwardRef<HTMLDivElement, DialogPopupProps>(
  ({ className, size = "md", ...props }, ref) => (
    <BaseDialog.Popup
      ref={ref}
      data-slot="dialog-popup"
      data-size={size}
      className={cn(
        // Position
        "fixed left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2",
        // Mobile: slight inset so it doesn't touch edges (except full)
        size !== "full" && "max-w-[calc(100vw-2rem)]",
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

const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-header"
      className={cn("flex items-start justify-between gap-4 p-6 pb-0", className)}
      {...props}
    />
  ),
);
Header.displayName = "Dialog.Header";

/* ============================================================
 * Body (scrollable content area)
 * ============================================================ */

const Body = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-body"
      className={cn("flex-1 overflow-y-auto p-6", className)}
      {...props}
    />
  ),
);
Body.displayName = "Dialog.Body";

/* ============================================================
 * Footer
 * ============================================================ */

const Footer = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 p-6 pt-0",
        "[&>[data-slot=button]]:w-full [&>[data-slot=dialog-close]>[data-slot=button]]:w-full",
        "sm:flex-row sm:items-center sm:justify-end sm:gap-3",
        "sm:[&>[data-slot=button]]:w-auto sm:[&>[data-slot=dialog-close]>[data-slot=button]]:w-auto",
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

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BaseDialog.Title>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("text-fg-default text-lg font-semibold", className)}
      {...props}
    />
  ),
);
Title.displayName = "Dialog.Title";

/* ============================================================
 * Description
 * ============================================================ */

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-fg-muted mt-1 text-sm", className)}
    {...props}
  />
));
Description.displayName = "Dialog.Description";

/* ============================================================
 * Close (unstyled — for wrapping buttons)
 * ============================================================ */

const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseDialog.Close>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Close ref={ref} data-slot="dialog-close" className={cn(className)} {...props} />
  ),
);
Close.displayName = "Dialog.Close";

/* ============================================================
 * CloseButton (styled X in top-right corner)
 * ============================================================ */

const CloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    data-slot="dialog-close-button"
    className={cn(
      "text-fg-muted hover:text-fg-default cursor-pointer rounded-sm p-1",
      "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
      "focus-visible:sp-focus-ring",
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
