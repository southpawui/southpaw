"use client";

import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";

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
      className={mergeClassName(cn("flex w-full flex-col gap-1"), className)}
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
      className={mergeClassName(
        cn("bg-surface-sunken relative w-full overflow-hidden rounded-full", trackSizes[size]),
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
    className={mergeClassName(
      cn(
        "h-full rounded-full",
        "transition-[width] duration-[var(--sp-duration-slow)] ease-[var(--sp-easing-default)]",
        // Colour from parent Root's data-color
        "[[data-color=default]_&]:bg-accent",
        "[[data-color=brand]_&]:bg-brand",
        "[[data-color=success]_&]:bg-success",
        "[[data-color=danger]_&]:bg-danger",
        "[[data-color=warning]_&]:bg-warning",
        // Indeterminate: a third-width bar sweeps across (keyframes ship in the tokens CSS)
        "[[data-indeterminate]_&]:w-1/3",
        "motion-safe:[[data-indeterminate]_&]:animate-[sp-progress-indeterminate_1.5s_ease-in-out_infinite]",
        // Right-to-left sweeps the other way (transforms aren't logical)
        "motion-safe:rtl:[[data-indeterminate]_&]:animate-[sp-progress-indeterminate-rtl_1.5s_ease-in-out_infinite]",
        // Reduced motion: no sweep. A full-width bar pulses slowly, so it still reads as busy
        "motion-reduce:[[data-indeterminate]_&]:w-full motion-reduce:[[data-indeterminate]_&]:animate-[sp-progress-pulse_2s_ease-in-out_infinite]",
      ),
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
      className={mergeClassName(cn("text-fg-default text-sm font-medium"), className)}
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
      className={mergeClassName(cn("text-fg-muted text-sm tabular-nums"), className)}
      {...props}
    />
  ),
);
Value.displayName = "Progress.Value";

/* ============================================================
 * Compound export
 * ============================================================ */

// Parts for the server-safe namespace in ./Progress (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
export {
  Root as ProgressRoot,
  Track as ProgressTrack,
  Indicator as ProgressIndicator,
  Label as ProgressLabel,
  Value as ProgressValue,
};
