import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cn } from "../../lib/cn";

export const Toggle = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseToggle>>(
  ({ className, ...props }, ref) => (
    <BaseToggle
      ref={ref}
      data-slot="toggle"
      className={cn(
        // Base
        "text-fg-default inline-flex h-[var(--sp-control-height)] items-center justify-center rounded-[var(--radius-DEFAULT)] px-3 text-sm font-medium",
        // Border
        "border-border-default border bg-transparent",
        // Transition
        "transition-[background-color,border-color,color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:bg-[var(--sp-state-hover)]",
        // Focus
        "focus-visible:sp-focus-ring",
        // Pressed — uses accent
        "data-[pressed]:border-accent data-[pressed]:bg-accent data-[pressed]:text-fg-on-brand",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    />
  ),
);

Toggle.displayName = "Toggle";
