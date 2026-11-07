import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseCheckbox.Root>>(
  ({ className, ...props }, ref) => (
    <BaseCheckbox.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        "inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border border-neutral-300 bg-white transition-colors hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 data-[disabled]:cursor-not-allowed data-[checked]:border-neutral-900 data-[indeterminate]:border-neutral-900 data-[checked]:bg-neutral-900 data-[indeterminate]:bg-neutral-900 data-[disabled]:opacity-50",
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
>(({ className, ...props }, ref) => (
  <BaseCheckbox.Indicator
    ref={ref}
    data-slot="checkbox-indicator"
    className={cn("flex items-center justify-center text-white", className)}
    {...props}
  >
    {props.children ?? (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
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
