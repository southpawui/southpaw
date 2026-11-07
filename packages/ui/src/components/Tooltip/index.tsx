import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../../lib/cn";

const Provider = BaseTooltip.Provider;

const Root = BaseTooltip.Root;

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseTooltip.Trigger>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Trigger ref={ref} data-slot="tooltip-trigger" className={cn(className)} {...props} />
));
Trigger.displayName = "Tooltip.Trigger";

const Portal = BaseTooltip.Portal;

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
        "z-50 rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white shadow-md",
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
      className={cn("fill-neutral-900", className)}
      {...props}
    />
  ),
);
Arrow.displayName = "Tooltip.Arrow";

export const Tooltip = {
  Provider,
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
};
