import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSlider.Root>>(
  ({ className, ...props }, ref) => (
    <BaseSlider.Root
      ref={ref}
      data-slot="slider"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  ),
);
Root.displayName = "Slider.Root";

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<typeof BaseSlider.Label>>(
  ({ className, ...props }, ref) => (
    <BaseSlider.Label
      ref={ref}
      data-slot="slider-label"
      className={cn("text-sm font-medium text-neutral-700", className)}
      {...props}
    />
  ),
);
Label.displayName = "Slider.Label";

const Value = React.forwardRef<HTMLOutputElement, React.ComponentProps<typeof BaseSlider.Value>>(
  ({ className, ...props }, ref) => (
    <BaseSlider.Value
      ref={ref}
      data-slot="slider-value"
      className={cn("text-sm tabular-nums text-neutral-500", className)}
      {...props}
    />
  ),
);
Value.displayName = "Slider.Value";

const Control = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSlider.Control>>(
  ({ className, ...props }, ref) => (
    <BaseSlider.Control
      ref={ref}
      data-slot="slider-control"
      className={cn("flex w-full items-center py-2", className)}
      {...props}
    />
  ),
);
Control.displayName = "Slider.Control";

const Track = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseSlider.Track>>(
  ({ className, ...props }, ref) => (
    <BaseSlider.Track
      ref={ref}
      data-slot="slider-track"
      className={cn("relative h-2 w-full rounded-full bg-neutral-200", className)}
      {...props}
    />
  ),
);
Track.displayName = "Slider.Track";

const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseSlider.Indicator>
>(({ className, ...props }, ref) => (
  <BaseSlider.Indicator
    ref={ref}
    data-slot="slider-indicator"
    className={cn("rounded-full bg-neutral-900", className)}
    {...props}
  />
));
Indicator.displayName = "Slider.Indicator";

const Thumb = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSlider.Thumb>>(
  ({ className, ...props }, ref) => (
    <BaseSlider.Thumb
      ref={ref}
      data-slot="slider-thumb"
      className={cn(
        "block h-5 w-5 rounded-full border-2 border-neutral-900 bg-white shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
  ),
);
Thumb.displayName = "Slider.Thumb";

export const Slider = {
  Root,
  Label,
  Value,
  Control,
  Track,
  Indicator,
  Thumb,
};
