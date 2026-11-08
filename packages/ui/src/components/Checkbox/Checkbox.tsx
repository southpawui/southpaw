import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface CheckboxProps extends React.ComponentProps<typeof BaseCheckbox.Root> {
  /** Show valid/success state — green border when checked */
  valid?: boolean;
}

const Root = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, valid, children, ...props }, ref) => (
    <BaseCheckbox.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        // Base — fixed size
        "inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-[4px]",
        // Border
        "border-border-control border-2",
        // Transition
        "transition-[background-color,border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:border-fg-muted",
        // Focus
        "focus-visible:sp-focus-ring",
        // Checked / Indeterminate — uses accent
        "data-[checked]:border-accent data-[checked]:bg-accent",
        "data-[indeterminate]:border-accent data-[indeterminate]:bg-accent",
        // Invalid (from Field context)
        "data-[invalid]:!border-danger",
        // Valid
        valid && "data-[checked]:!border-success data-[checked]:!bg-success",
        // Disabled
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    >
      {children ?? <Indicator />}
    </BaseCheckbox.Root>
  ),
);
Root.displayName = "Checkbox.Root";

/* ============================================================
 * Indicator
 * ============================================================ */

const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseCheckbox.Indicator>
>(({ className, children, ...props }, ref) => (
  <BaseCheckbox.Indicator
    ref={ref}
    data-slot="checkbox-indicator"
    className={cn("text-fg-on-brand flex items-center justify-center", className)}
    {...props}
  >
    {children ?? <CheckOrMinus />}
  </BaseCheckbox.Indicator>
));
Indicator.displayName = "Checkbox.Indicator";

/**
 * Renders Check for checked state, Minus for indeterminate.
 * Uses CSS to show/hide based on parent data attributes.
 */
function CheckOrMinus() {
  return (
    <>
      <Check weight="bold" className="hidden h-3 w-3 [[data-checked]_&]:block" aria-hidden="true" />
      <Minus
        weight="bold"
        className="hidden h-3 w-3 [[data-indeterminate]_&]:block"
        aria-hidden="true"
      />
    </>
  );
}

/* ============================================================
 * Compound export
 * ============================================================ */

export const Checkbox = { Root, Indicator };
