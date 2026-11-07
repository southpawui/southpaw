import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "../../lib/cn";

export interface InputProps extends React.ComponentProps<typeof BaseInput> {
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        data-slot="input"
        className={cn(
          // Base
          "bg-surface-base text-fg-default w-full rounded-[var(--radius-DEFAULT)]",
          // Border
          "border-border-control border-2",
          // Placeholder
          "placeholder:text-fg-muted",
          // Transition
          "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
          // Hover
          "hover:border-fg-muted",
          // Focus
          "focus-visible:sp-focus-ring",
          // Invalid (when used inside Field.Root with invalid prop)
          "data-[invalid]:border-danger",
          // Disabled
          "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-[var(--sp-state-disabled-opacity)]",
          // Read-only
          "read-only:bg-surface-sunken read-only:border-border-default",
          // Sizes (density-aware)
          size === "sm" && "h-[var(--sp-control-height-sm)] px-2.5 text-sm",
          size === "md" && "h-[var(--sp-control-height)] px-3 text-sm",
          size === "lg" && "h-[var(--sp-control-height-lg)] px-4 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
