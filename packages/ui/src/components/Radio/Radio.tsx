import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseRadio.Root>>(
  ({ className, children, ...props }, ref) => (
    <BaseRadio.Root
      ref={ref}
      data-slot="radio"
      className={cn(
        // Base
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
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
        // Disabled
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    >
      {children}
    </BaseRadio.Root>
  ),
);
Root.displayName = "Radio.Root";

const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseRadio.Indicator>
>(({ className, ...props }, ref) => (
  <BaseRadio.Indicator
    ref={ref}
    data-slot="radio-indicator"
    className={cn("bg-accent h-2.5 w-2.5 rounded-full data-[unchecked]:hidden", className)}
    {...props}
  />
));
Indicator.displayName = "Radio.Indicator";

export const Radio = { Root, Indicator };
