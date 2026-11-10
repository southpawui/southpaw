import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface ProgressRootProps extends React.ComponentProps<typeof BaseProgress.Root> {
  /** Colour intent */
  color?: "default" | "brand" | "success" | "danger" | "warning";
}

const Root = React.forwardRef<HTMLDivElement, ProgressRootProps>(
  ({ className, color = "default", ...props }, ref) => (
    <BaseProgress.Root
      ref={ref}
      data-slot="progress"
      data-color={color}
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  ),
);
Root.displayName = "Progress.Root";

/* ============================================================
 * Track
 * ============================================================ */

export interface ProgressTrackProps extends React.ComponentProps<typeof BaseProgress.Track> {
  /** Track height */
  size?: "sm" | "md" | "lg";
}

const trackSizes: Record<string, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const Track = React.forwardRef<HTMLDivElement, ProgressTrackProps>(
  ({ className, size = "md", ...props }, ref) => (
    <BaseProgress.Track
      ref={ref}
      data-slot="progress-track"
      className={cn(
        "bg-surface-sunken relative w-full overflow-hidden rounded-full",
        trackSizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Track.displayName = "Progress.Track";

/* ============================================================
 * Indicator
 * ============================================================ */

const Indicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseProgress.Indicator>
>(({ className, ...props }, ref) => (
  <BaseProgress.Indicator
    ref={ref}
    data-slot="progress-indicator"
    className={cn(
      "h-full rounded-full",
      "transition-[width] duration-[var(--sp-duration-slow)] ease-[var(--sp-easing-default)]",
      // Colour from parent Root's data-color
      "[[data-color=default]_&]:bg-accent",
      "[[data-color=brand]_&]:bg-brand",
      "[[data-color=success]_&]:bg-success",
      "[[data-color=danger]_&]:bg-danger",
      "[[data-color=warning]_&]:bg-[oklch(0.7_0.15_85)]",
      // Indeterminate animation
      "[[data-indeterminate]_&]:animate-[progress-indeterminate_1.5s_ease-in-out_infinite]",
      "[[data-indeterminate]_&]:w-1/3",
      className,
    )}
    {...props}
  />
));
Indicator.displayName = "Progress.Indicator";

/* ============================================================
 * Label
 * ============================================================ */

const Label = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseProgress.Label>>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Label
      ref={ref}
      data-slot="progress-label"
      className={cn("text-fg-default text-sm font-medium", className)}
      {...props}
    />
  ),
);
Label.displayName = "Progress.Label";

/* ============================================================
 * Value
 * ============================================================ */

const Value = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseProgress.Value>>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Value
      ref={ref}
      data-slot="progress-value"
      className={cn("text-fg-muted text-sm tabular-nums", className)}
      {...props}
    />
  ),
);
Value.displayName = "Progress.Value";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Progress = { Root, Track, Indicator, Label, Value };
