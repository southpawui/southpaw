import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root (pass-through)
 * ============================================================ */

const Root = BaseAlertDialog.Root;

/* ============================================================
 * Trigger
 * ============================================================ */

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAlertDialog.Trigger>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Trigger
    ref={ref}
    data-slot="alert-dialog-trigger"
    className={cn(className)}
    {...props}
  />
));
Trigger.displayName = "AlertDialog.Trigger";

/* ============================================================
 * Portal (pass-through)
 * ============================================================ */

const Portal = BaseAlertDialog.Portal;

/* ============================================================
 * Backdrop
 * ============================================================ */

const Backdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAlertDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Backdrop
    ref={ref}
    data-slot="alert-dialog-backdrop"
    className={cn(
      "fixed inset-0 bg-black/50",
      "transition-opacity duration-[var(--sp-duration-entrance)] ease-[var(--sp-easing-default)]",
      "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
      className,
    )}
    {...props}
  />
));
Backdrop.displayName = "AlertDialog.Backdrop";

/* ============================================================
 * Popup
 * ============================================================ */

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAlertDialog.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseAlertDialog.Popup
      ref={ref}
      data-slot="alert-dialog-popup"
      className={cn(
        // Position
        "fixed left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2",
        // Width: mobile-safe, then sm max-width
        "max-w-[calc(100vw-2rem)] sm:max-w-sm",
        // Surface
        "bg-surface-overlay rounded-[var(--radius-lg)] shadow-lg",
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
Popup.displayName = "AlertDialog.Popup";

/* ============================================================
 * Header
 * ============================================================ */

const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-3 p-6 pb-0", className)}
      {...props}
    />
  ),
);
Header.displayName = "AlertDialog.Header";

/* ============================================================
 * Icon (themed container for leading icon)
 * ============================================================ */

export interface AlertDialogIconProps extends React.ComponentPropsWithRef<"span"> {
  /** Background colour intent */
  color?: "danger" | "warning" | "info" | "success" | "default";
  /** Container shape */
  shape?: "circle" | "square" | "rounded";
  /** Container size */
  size?: "sm" | "md" | "lg";
}

const iconColorClasses: Record<string, string> = {
  danger: "bg-danger/10 text-danger",
  warning: "bg-[oklch(0.92_0.04_85)] text-[oklch(0.5_0.15_85)]",
  info: "bg-brand/10 text-brand",
  success: "bg-success-subtle text-success",
  default: "bg-surface-alternate text-fg-muted",
};

const iconShapeClasses: Record<string, string> = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-lg",
};

const iconSizeClasses: Record<string, string> = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-lg",
  lg: "h-12 w-12 text-xl",
};

const Icon = React.forwardRef<HTMLSpanElement, AlertDialogIconProps>(
  ({ className, color = "danger", shape = "circle", size = "md", ...props }, ref) => (
    <span
      ref={ref}
      data-slot="alert-dialog-icon"
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        iconColorClasses[color],
        iconShapeClasses[shape],
        iconSizeClasses[size],
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  ),
);
Icon.displayName = "AlertDialog.Icon";

/* ============================================================
 * Footer
 * ============================================================ */

const Footer = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 p-6 pt-0",
        "[&>[data-slot=alert-dialog-close]>[data-slot=button]]:w-full [&>[data-slot=button]]:w-full",
        "sm:flex-row sm:items-center sm:justify-end sm:gap-3",
        "sm:[&>[data-slot=alert-dialog-close]>[data-slot=button]]:w-auto sm:[&>[data-slot=button]]:w-auto",
        className,
      )}
      {...props}
    />
  ),
);
Footer.displayName = "AlertDialog.Footer";

/* ============================================================
 * Title
 * ============================================================ */

const Title = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseAlertDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn("text-fg-default text-lg font-semibold", className)}
    {...props}
  />
));
Title.displayName = "AlertDialog.Title";

/* ============================================================
 * Description
 * ============================================================ */

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseAlertDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn("text-fg-muted mt-2 text-sm", className)}
    {...props}
  />
));
Description.displayName = "AlertDialog.Description";

/* ============================================================
 * Close
 * ============================================================ */

const Close = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    data-slot="alert-dialog-close"
    className={cn(className)}
    {...props}
  />
));
Close.displayName = "AlertDialog.Close";

/* ============================================================
 * Compound export
 * ============================================================ */

export const AlertDialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Header,
  Icon,
  Footer,
  Title,
  Description,
  Close,
};
