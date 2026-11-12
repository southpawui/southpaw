import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface DrawerRootProps extends React.ComponentProps<typeof BaseDrawer.Root> {
  /** Which edge the drawer slides from */
  direction?: "left" | "right" | "top" | "bottom";
}

function mapSwipeDirection(dir: string): "left" | "right" | "up" | "down" {
  const map: Record<string, "left" | "right" | "up" | "down"> = {
    left: "left",
    right: "right",
    top: "up",
    bottom: "down",
  };
  return map[dir] ?? "right";
}

const Root = ({ direction = "right", ...props }: DrawerRootProps) => (
  <BaseDrawer.Root swipeDirection={mapSwipeDirection(direction)} {...props} />
);
Root.displayName = "Drawer.Root";

/* ============================================================
 * Trigger (unstyled)
 * ============================================================ */

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDrawer.Trigger>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Trigger ref={ref} data-slot="drawer-trigger" className={cn(className)} {...props} />
));
Trigger.displayName = "Drawer.Trigger";

/* ============================================================
 * Portal
 * ============================================================ */

const Portal = BaseDrawer.Portal;

/* ============================================================
 * Backdrop
 * ============================================================ */

const Backdrop = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDrawer.Backdrop>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Backdrop
      ref={ref}
      data-slot="drawer-backdrop"
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
Backdrop.displayName = "Drawer.Backdrop";

/* ============================================================
 * Popup
 * ============================================================ */

export interface DrawerPopupProps extends React.ComponentProps<typeof BaseDrawer.Popup> {
  /** Drawer width (left/right) or height (top/bottom) */
  size?: "sm" | "md" | "lg" | "full";
}

const Popup = React.forwardRef<HTMLDivElement, DrawerPopupProps>(
  ({ className, size = "md", ...props }, ref) => (
    <BaseDrawer.Popup
      ref={ref}
      data-slot="drawer-popup"
      data-size={size}
      className={cn(
        "bg-surface-overlay fixed flex flex-col shadow-lg",
        "transition-transform duration-[var(--sp-duration-drawer)] ease-[var(--sp-easing-drawer)]",
        // Right — full height, responsive width
        "data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0",
        "data-[swipe-direction=right]:data-[ending-style]:translate-x-full data-[swipe-direction=right]:data-[starting-style]:translate-x-full",
        // Left — full height, responsive width
        "data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0",
        "data-[swipe-direction=left]:data-[ending-style]:-translate-x-full data-[swipe-direction=left]:data-[starting-style]:-translate-x-full",
        // Top — full width, height
        "data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0",
        "data-[swipe-direction=up]:data-[ending-style]:-translate-y-full data-[swipe-direction=up]:data-[starting-style]:-translate-y-full",
        // Bottom — full width, height
        "data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0",
        "data-[swipe-direction=down]:data-[ending-style]:translate-y-full data-[swipe-direction=down]:data-[starting-style]:translate-y-full",
        // Size — width for left/right only, height for top/bottom only
        // Top/bottom get full width from inset-x-0; left/right get full height from inset-y-0
        size === "sm" &&
          "data-[swipe-direction=left]:w-full data-[swipe-direction=right]:w-full data-[swipe-direction=left]:sm:w-72 data-[swipe-direction=right]:sm:w-72",
        size === "md" &&
          "data-[swipe-direction=left]:w-full data-[swipe-direction=right]:w-full data-[swipe-direction=left]:sm:w-80 data-[swipe-direction=right]:sm:w-80 data-[swipe-direction=left]:md:w-96 data-[swipe-direction=right]:md:w-96",
        size === "lg" &&
          "data-[swipe-direction=left]:w-full data-[swipe-direction=right]:w-full data-[swipe-direction=left]:sm:w-96 data-[swipe-direction=right]:sm:w-96 data-[swipe-direction=left]:md:w-[32rem] data-[swipe-direction=right]:md:w-[32rem]",
        size === "full" && "w-full",
        size === "sm" && "data-[swipe-direction=down]:h-[30vh] data-[swipe-direction=up]:h-[30vh]",
        size === "md" && "data-[swipe-direction=down]:h-[50vh] data-[swipe-direction=up]:h-[50vh]",
        size === "lg" && "data-[swipe-direction=down]:h-[75vh] data-[swipe-direction=up]:h-[75vh]",
        size === "full" && "data-[swipe-direction=down]:h-full data-[swipe-direction=up]:h-full",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Drawer.Popup";

/* ============================================================
 * Handle (drag affordance for bottom/top sheets)
 * ============================================================ */

const Handle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-handle"
      className={cn("flex shrink-0 items-center justify-center py-3", "sm:hidden", className)}
      {...props}
    >
      <div className="bg-fg-muted/40 h-1 w-10 rounded-full" />
    </div>
  ),
);
Handle.displayName = "Drawer.Handle";

/* ============================================================
 * Header
 * ============================================================ */

const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-header"
      className={cn("flex items-start justify-between gap-4 p-6 pb-0", className)}
      {...props}
    />
  ),
);
Header.displayName = "Drawer.Header";

/* ============================================================
 * Body (scrollable content)
 * ============================================================ */

const Body = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-body"
      className={cn("flex-1 overflow-y-auto p-6", className)}
      {...props}
    />
  ),
);
Body.displayName = "Drawer.Body";

/* ============================================================
 * Footer
 * ============================================================ */

const Footer = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-footer"
      className={cn(
        "border-border-default flex items-center justify-end gap-3 border-t p-6",
        className,
      )}
      {...props}
    />
  ),
);
Footer.displayName = "Drawer.Footer";

/* ============================================================
 * Title
 * ============================================================ */

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BaseDrawer.Title>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Title
      ref={ref}
      data-slot="drawer-title"
      className={cn("text-fg-default text-lg font-semibold", className)}
      {...props}
    />
  ),
);
Title.displayName = "Drawer.Title";

/* ============================================================
 * Description
 * ============================================================ */

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseDrawer.Description>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Description
    ref={ref}
    data-slot="drawer-description"
    className={cn("text-fg-muted mt-1 text-sm", className)}
    {...props}
  />
));
Description.displayName = "Drawer.Description";

/* ============================================================
 * Close (unstyled)
 * ============================================================ */

const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseDrawer.Close>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Close ref={ref} data-slot="drawer-close" className={cn(className)} {...props} />
  ),
);
Close.displayName = "Drawer.Close";

/* ============================================================
 * CloseButton (styled X)
 * ============================================================ */

const CloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDrawer.Close>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Close
    ref={ref}
    data-slot="drawer-close-button"
    className={cn(
      "text-fg-muted hover:text-fg-default cursor-pointer rounded-sm p-1",
      "hidden sm:block",
      "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
      "focus-visible:sp-focus-ring",
      className,
    )}
    aria-label="Close"
    {...props}
  >
    <X weight="bold" className="h-4 w-4" />
  </BaseDrawer.Close>
));
CloseButton.displayName = "Drawer.CloseButton";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Drawer = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Handle,
  Header,
  Body,
  Footer,
  Title,
  Description,
  Close,
  CloseButton,
};
