import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../../lib/cn";

const Provider = BaseTooltip.Provider;
const Root = BaseTooltip.Root;
const Portal = BaseTooltip.Portal;

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseTooltip.Trigger>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Trigger ref={ref} data-slot="tooltip-trigger" className={cn(className)} {...props} />
));
Trigger.displayName = "Tooltip.Trigger";

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseTooltip.Positioner>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Positioner
    ref={ref}
    data-slot="tooltip-positioner"
    className={cn(className)}
    {...props}
  />
));
Positioner.displayName = "Tooltip.Positioner";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTooltip.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseTooltip.Popup
      ref={ref}
      data-slot="tooltip-popup"
      className={cn(
        "bg-accent text-fg-on-brand z-50 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs shadow-md",
        "transition-opacity duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Tooltip.Popup";

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTooltip.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseTooltip.Arrow
      ref={ref}
      data-slot="tooltip-arrow"
      className={cn("fill-accent", className)}
      {...props}
    />
  ),
);
Arrow.displayName = "Tooltip.Arrow";

export const Tooltip = { Provider, Root, Trigger, Portal, Positioner, Popup, Arrow };
