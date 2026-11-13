import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root (pass-through)
 * ============================================================ */

const Root = BasePopover.Root;

/* ============================================================
 * Trigger (unstyled — consumer wraps with Button)
 * ============================================================ */

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BasePopover.Trigger>
>(({ className, ...props }, ref) => (
  <BasePopover.Trigger ref={ref} data-slot="popover-trigger" className={cn(className)} {...props} />
));
Trigger.displayName = "Popover.Trigger";

/* ============================================================
 * Portal (pass-through)
 * ============================================================ */

const Portal = BasePopover.Portal;

/* ============================================================
 * Positioner
 * ============================================================ */

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BasePopover.Positioner>
>(({ className, ...props }, ref) => (
  <BasePopover.Positioner
    ref={ref}
    data-slot="popover-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "Popover.Positioner";

/* ============================================================
 * Popup
 * ============================================================ */

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BasePopover.Popup>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Popup
      ref={ref}
      data-slot="popover-popup"
      className={cn(
        "bg-surface-overlay border-border-default w-72 rounded-[var(--radius-DEFAULT)] border p-4 shadow-lg outline-none",
        // Animation — scale from transform origin (set by Base UI positioner)
        "origin-[var(--transform-origin)]",
        "transition-[transform,scale,opacity] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Popover.Popup";

/* ============================================================
 * Arrow
 * ============================================================ */

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BasePopover.Arrow>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Arrow
      ref={ref}
      data-slot="popover-arrow"
      className={cn(
        "data-[side=bottom]:top-[-5px] data-[side=left]:right-[-5px] data-[side=right]:left-[-5px] data-[side=top]:bottom-[-5px]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "bg-surface-overlay border-border-default h-2.5 w-2.5 rotate-45 border",
          // Hide the edges that overlap the popup — use parent data-side
          "[[data-side=bottom]>&]:border-b-0 [[data-side=bottom]>&]:border-r-0",
          "[[data-side=top]>&]:border-l-0 [[data-side=top]>&]:border-t-0",
          "[[data-side=left]>&]:border-b-0 [[data-side=left]>&]:border-l-0",
          "[[data-side=right]>&]:border-r-0 [[data-side=right]>&]:border-t-0",
        )}
      />
    </BasePopover.Arrow>
  ),
);
Arrow.displayName = "Popover.Arrow";

/* ============================================================
 * Title
 * ============================================================ */

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BasePopover.Title>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Title
      ref={ref}
      data-slot="popover-title"
      className={cn("text-fg-default text-base font-semibold", className)}
      {...props}
    />
  ),
);
Title.displayName = "Popover.Title";

/* ============================================================
 * Description
 * ============================================================ */

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BasePopover.Description>
>(({ className, ...props }, ref) => (
  <BasePopover.Description
    ref={ref}
    data-slot="popover-description"
    className={cn("text-fg-muted mt-1 text-sm", className)}
    {...props}
  />
));
Description.displayName = "Popover.Description";

/* ============================================================
 * Close (unstyled)
 * ============================================================ */

const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BasePopover.Close>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Close ref={ref} data-slot="popover-close" className={cn(className)} {...props} />
  ),
);
Close.displayName = "Popover.Close";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Popover = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Title,
  Description,
  Close,
};
