import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface MeterRootProps extends React.ComponentProps<typeof BaseMeter.Root> {
  /** Value below which the meter is "low" (poor if below optimum) */
  low?: number;
  /** Value above which the meter is "high" (poor if above optimum) */
  high?: number;
  /** The optimum value — determines which range is "good" */
  optimum?: number;
}

/**
 * Compute the colour state based on HTML meter semantics:
 * - If value is in the optimum range → success (green)
 * - If value is in the suboptimal range → warning (amber)
 * - If value is in the poor range → danger (red)
 * - If no thresholds set → default (accent)
 */
function getMeterState(
  value: number | undefined,
  min: number,
  max: number,
  low?: number,
  high?: number,
  optimum?: number,
): "default" | "success" | "warning" | "danger" {
  if (value === undefined || low === undefined || high === undefined) return "default";

  const opt = optimum ?? (low + high) / 2;

  if (opt <= low) {
    // Optimum is in the low range
    if (value <= low) return "success";
    if (value <= high) return "warning";
    return "danger";
  } else if (opt >= high) {
    // Optimum is in the high range
    if (value >= high) return "success";
    if (value >= low) return "warning";
    return "danger";
  } else {
    // Optimum is in the middle range
    if (value >= low && value <= high) return "success";
    return "warning";
  }
}

const Root = React.forwardRef<HTMLDivElement, MeterRootProps>(
  ({ className, low, high, optimum, value, min = 0, max = 100, ...props }, ref) => {
    const state = getMeterState(value as number, min, max, low, high, optimum);

    return (
      <BaseMeter.Root
        ref={ref}
        data-slot="meter"
        data-state={state}
        value={value}
        min={min}
        max={max}
        className={cn("flex w-full flex-col gap-1", className)}
        {...props}
      />
    );
  },
);
Root.displayName = "Meter.Root";

/* ============================================================
 * Track
 * ============================================================ */

export interface MeterTrackProps extends React.ComponentProps<typeof BaseMeter.Track> {
  size?: "sm" | "md" | "lg";
}

const trackSizes: Record<string, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const Track = React.forwardRef<HTMLDivElement, MeterTrackProps>(
  ({ className, size = "md", ...props }, ref) => (
    <BaseMeter.Track
      ref={ref}
      data-slot="meter-track"
      className={cn(
        "bg-surface-sunken relative w-full overflow-hidden rounded-full",
        trackSizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Track.displayName = "Meter.Track";

/* ============================================================
 * Indicator
 * ============================================================ */

const Indicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMeter.Indicator>
>(({ className, ...props }, ref) => (
  <BaseMeter.Indicator
    ref={ref}
    data-slot="meter-indicator"
    className={cn(
      "h-full rounded-full",
      "transition-[width,background-color] duration-[var(--sp-duration-slow)] ease-[var(--sp-easing-default)]",
      // Colour from parent Root's data-state
      "[[data-state=default]_&]:bg-accent",
      "[[data-state=success]_&]:bg-success",
      "[[data-state=warning]_&]:bg-[oklch(0.7_0.15_85)]",
      "[[data-state=danger]_&]:bg-danger",
      className,
    )}
    {...props}
  />
));
Indicator.displayName = "Meter.Indicator";

/* ============================================================
 * Label
 * ============================================================ */

const Label = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseMeter.Label>>(
  ({ className, ...props }, ref) => (
    <BaseMeter.Label
      ref={ref}
      data-slot="meter-label"
      className={cn("text-fg-default text-sm font-medium", className)}
      {...props}
    />
  ),
);
Label.displayName = "Meter.Label";

/* ============================================================
 * Value
 * ============================================================ */

const Value = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseMeter.Value>>(
  ({ className, ...props }, ref) => (
    <BaseMeter.Value
      ref={ref}
      data-slot="meter-value"
      className={cn("text-fg-muted text-sm tabular-nums", className)}
      {...props}
    />
  ),
);
Value.displayName = "Meter.Value";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Meter = { Root, Track, Indicator, Label, Value };
