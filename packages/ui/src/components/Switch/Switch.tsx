import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseSwitch.Root>>(
  ({ className, children, ...props }, ref) => (
    <BaseSwitch.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        // Base
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        // Background — unchecked uses border-default area, checked uses accent
        "bg-border-default",
        // Transition
        "transition-[background-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Focus
        "focus-visible:sp-focus-ring",
        // Checked — uses accent, not brand
        "data-[checked]:bg-accent",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    >
      {children}
    </BaseSwitch.Root>
  ),
);
Root.displayName = "Switch.Root";

const Thumb = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseSwitch.Thumb>>(
  ({ className, ...props }, ref) => (
    <BaseSwitch.Thumb
      ref={ref}
      data-slot="switch-thumb"
      className={cn(
        // Base
        "bg-surface-base pointer-events-none block h-5 w-5 rounded-full shadow-sm",
        // Position
        "translate-x-0.5",
        // Transition
        "transition-transform duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Checked position
        "data-[checked]:translate-x-5",
        className,
      )}
      {...props}
    />
  ),
);
Thumb.displayName = "Switch.Thumb";

export const Switch = { Root, Thumb };
