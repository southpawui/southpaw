import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseProgress.Root>>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Root
      ref={ref}
      data-slot="progress"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  ),
);
Root.displayName = "Progress.Root";

const Track = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseProgress.Track>>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Track
      ref={ref}
      data-slot="progress-track"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-neutral-200", className)}
      {...props}
    />
  ),
);
Track.displayName = "Progress.Track";

const Indicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseProgress.Indicator>
>(({ className, ...props }, ref) => (
  <BaseProgress.Indicator
    ref={ref}
    data-slot="progress-indicator"
    className={cn(
      "h-full rounded-full bg-neutral-900 transition-[width] duration-300 ease-in-out",
      className,
    )}
    {...props}
  />
));
Indicator.displayName = "Progress.Indicator";

const Label = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseProgress.Label>>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Label
      ref={ref}
      data-slot="progress-label"
      className={cn("text-sm font-medium text-neutral-700", className)}
      {...props}
    />
  ),
);
Label.displayName = "Progress.Label";

const Value = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseProgress.Value>>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Value
      ref={ref}
      data-slot="progress-value"
      className={cn("text-sm tabular-nums text-neutral-500", className)}
      {...props}
    />
  ),
);
Value.displayName = "Progress.Value";

export const Progress = {
  Root,
  Track,
  Indicator,
  Label,
  Value,
};
