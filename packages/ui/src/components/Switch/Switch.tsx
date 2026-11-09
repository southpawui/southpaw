import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface SwitchProps extends React.ComponentProps<typeof BaseSwitch.Root> {
  /** Show valid/success state — green track when checked */
  valid?: boolean;
  /** Text label shown inside the track when checked (e.g. "On", "Yes") */
  onLabel?: string;
  /** Text label shown inside the track when unchecked (e.g. "Off", "No") */
  offLabel?: string;
  /** Icon shown inside the thumb when checked */
  checkedIcon?: React.ReactNode;
  /** Icon shown inside the thumb when unchecked */
  uncheckedIcon?: React.ReactNode;
}

const Root = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { className, valid, onLabel, offLabel, checkedIcon, uncheckedIcon, children, ...props },
    ref,
  ) => {
    const hasLabels = !!(onLabel || offLabel);

    return (
      <BaseSwitch.Root
        ref={ref}
        data-slot="switch"
        className={cn(
          // Base
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
          // Size — wider when labels are present
          hasLabels ? "h-7 w-14" : "h-6 w-11",
          // Background — unchecked uses muted track
          "bg-border-default",
          // Transition
          "transition-[background-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
          // Focus
          "focus-visible:sp-focus-ring",
          // Checked — uses accent
          "data-[checked]:bg-accent",
          // Invalid (from Field context)
          "data-[invalid]:ring-danger data-[invalid]:ring-2 data-[invalid]:ring-offset-1",
          // Valid
          valid && "data-[checked]:!bg-success",
          // Disabled
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
          className,
        )}
        {...props}
      >
        {hasLabels && (
          <>
            <span
              aria-hidden="true"
              data-slot="switch-label-on"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2",
                "text-[10px] font-semibold uppercase leading-none",
                "text-fg-on-brand select-none",
                "opacity-0 transition-opacity duration-[var(--sp-duration-fast)]",
                "[[data-checked]_&]:opacity-100",
              )}
            >
              {onLabel}
            </span>
            <span
              aria-hidden="true"
              data-slot="switch-label-off"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2",
                "text-[10px] font-semibold uppercase leading-none",
                "text-fg-muted select-none",
                "opacity-100 transition-opacity duration-[var(--sp-duration-fast)]",
                "[[data-checked]_&]:opacity-0",
              )}
            >
              {offLabel}
            </span>
          </>
        )}
        {children ?? (
          <Thumb hasLabels={hasLabels} checkedIcon={checkedIcon} uncheckedIcon={uncheckedIcon} />
        )}
      </BaseSwitch.Root>
    );
  },
);
Root.displayName = "Switch.Root";

/* ============================================================
 * Thumb
 * ============================================================ */

interface ThumbProps extends React.ComponentProps<typeof BaseSwitch.Thumb> {
  /** Whether the parent has on/off labels (affects sizing + position) */
  hasLabels?: boolean;
  /** Icon shown inside thumb when checked */
  checkedIcon?: React.ReactNode;
  /** Icon shown inside thumb when unchecked */
  uncheckedIcon?: React.ReactNode;
}

const Thumb = React.forwardRef<HTMLSpanElement, ThumbProps>(
  ({ className, hasLabels, checkedIcon, uncheckedIcon, ...props }, ref) => {
    const hasIcons = !!(checkedIcon || uncheckedIcon);

    return (
      <BaseSwitch.Thumb
        ref={ref}
        data-slot="switch-thumb"
        className={cn(
          // Base
          "bg-surface-base pointer-events-none block rounded-full shadow-sm",
          // Size — slightly larger when labels or icons present
          hasLabels || hasIcons ? "h-[22px] w-[22px]" : "h-5 w-5",
          // Centre icons inside thumb
          hasIcons && "flex items-center justify-center",
          // Position — unchecked
          "translate-x-0.5",
          // Transition
          "transition-transform duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
          "motion-reduce:transition-none",
          // Checked position
          hasLabels
            ? "data-[checked]:translate-x-[32px]" // track(56) - thumb(22) - offset(2) = 32px
            : hasIcons
              ? "data-[checked]:translate-x-[20px]" // track(44) - thumb(22) - offset(2) = 20px
              : "data-[checked]:translate-x-[22px]", // track(44) - thumb(20) - offset(2) = 22px
          className,
        )}
        {...props}
      >
        {hasIcons && (
          <>
            {checkedIcon && (
              <span
                aria-hidden="true"
                className={cn(
                  "text-accent absolute text-[12px] leading-none",
                  "opacity-0 transition-opacity duration-[var(--sp-duration-fast)]",
                  "[[data-checked]_&]:opacity-100",
                )}
              >
                {checkedIcon}
              </span>
            )}
            {uncheckedIcon && (
              <span
                aria-hidden="true"
                className={cn(
                  "text-fg-muted absolute text-[12px] leading-none",
                  "opacity-100 transition-opacity duration-[var(--sp-duration-fast)]",
                  "[[data-checked]_&]:opacity-0",
                )}
              >
                {uncheckedIcon}
              </span>
            )}
          </>
        )}
      </BaseSwitch.Thumb>
    );
  },
);
Thumb.displayName = "Switch.Thumb";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Switch = { Root, Thumb };
