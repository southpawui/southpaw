import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseCheckbox.Root>>(
  ({ className, ...props }, ref) => (
    <BaseCheckbox.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        // Base
        "inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-[4px]",
        // Border
        "border-border-control border-2",
        // Transition
        "transition-[background-color,border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:border-fg-muted",
        // Focus
        "focus-visible:sp-focus-ring",
        // Checked / Indeterminate — uses accent, not brand
        "data-[checked]:border-accent data-[checked]:bg-accent",
        "data-[indeterminate]:border-accent data-[indeterminate]:bg-accent",
        // Disabled
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Checkbox.Root";

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
    {children ?? (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </BaseCheckbox.Indicator>
));
Indicator.displayName = "Checkbox.Indicator";

export const Checkbox = { Root, Indicator };
