import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMeter.Root>>(
  ({ className, ...props }, ref) => (
    <BaseMeter.Root
      ref={ref}
      data-slot="meter-root"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  ),
);
Root.displayName = "MeterRoot";

/* ----- Track ----- */
const Track = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMeter.Track>>(
  ({ className, ...props }, ref) => (
    <BaseMeter.Track
      ref={ref}
      data-slot="meter-track"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-neutral-200", className)}
      {...props}
    />
  ),
);
Track.displayName = "MeterTrack";

/* ----- Indicator ----- */
const Indicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMeter.Indicator>
>(({ className, ...props }, ref) => (
  <BaseMeter.Indicator
    ref={ref}
    data-slot="meter-indicator"
    className={cn("h-full rounded-full bg-neutral-900 transition-all duration-500", className)}
    {...props}
  />
));
Indicator.displayName = "MeterIndicator";

/* ----- Label ----- */
const Label = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseMeter.Label>>(
  ({ className, ...props }, ref) => (
    <BaseMeter.Label
      ref={ref}
      data-slot="meter-label"
      className={cn("text-sm font-medium text-neutral-900", className)}
      {...props}
    />
  ),
);
Label.displayName = "MeterLabel";

/* ----- Value ----- */
const Value = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseMeter.Value>>(
  ({ className, ...props }, ref) => (
    <BaseMeter.Value
      ref={ref}
      data-slot="meter-value"
      className={cn("text-sm text-neutral-500", className)}
      {...props}
    />
  ),
);
Value.displayName = "MeterValue";

export const Meter = {
  Root,
  Track,
  Indicator,
  Label,
  Value,
};
