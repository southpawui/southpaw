import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface RadioProps extends React.ComponentProps<typeof BaseRadio.Root> {
  /** Show valid/success state — green border when checked */
  valid?: boolean;
}

const Root = React.forwardRef<HTMLButtonElement, RadioProps>(
  ({ className, valid, children, ...props }, ref) => (
    <BaseRadio.Root
      ref={ref}
      data-slot="radio"
      className={cn(
        // Base — fixed size, circular
        "inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full",
        // Border
        "border-border-control border-2",
        // Transition
        "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:border-fg-muted",
        // Focus
        "focus-visible:sp-focus-ring",
        // Checked — uses accent
        "data-[checked]:border-accent",
        // Invalid (from Field context)
        "data-[invalid]:!border-danger",
        // Valid
        valid && "data-[checked]:!border-success",
        // Disabled
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    >
      {children ?? <Indicator />}
    </BaseRadio.Root>
  ),
);
Root.displayName = "Radio.Root";

/* ============================================================
 * Indicator
 * ============================================================ */

const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseRadio.Indicator>
>(({ className, ...props }, ref) => (
  <BaseRadio.Indicator
    ref={ref}
    data-slot="radio-indicator"
    className={cn("h-2.5 w-2.5 rounded-full data-[unchecked]:hidden", "bg-accent", className)}
    {...props}
  />
));
Indicator.displayName = "Radio.Indicator";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Radio = { Root, Indicator };
