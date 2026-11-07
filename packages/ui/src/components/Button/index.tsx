import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../../lib/cn";

export interface ButtonProps extends React.ComponentProps<typeof BaseButton> {
  variant?: "solid" | "brand" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        data-slot="button"
        className={cn(
          // Base
          "inline-flex cursor-pointer items-center justify-center gap-2 font-medium",
          // Shape
          "rounded-[var(--radius-DEFAULT)]",
          // Motion (Emil's easing)
          "transition-[color,background-color,border-color,box-shadow,transform]",
          "duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
          // Press feedback (Emil's scale)
          "active:scale-[var(--sp-scale-press)]",
          // Focus — two-tone ring
          "focus-visible:sp-focus-ring",
          // Disabled
          "disabled:pointer-events-none disabled:opacity-[var(--sp-state-disabled-opacity)]",

          // Variants
          variant === "solid" && "bg-accent text-fg-on-brand hover:bg-accent/90",
          variant === "brand" && "bg-brand text-fg-on-brand hover:bg-brand/90",
          variant === "outline" &&
            "border-border-control text-fg-default border-2 bg-transparent hover:bg-[var(--sp-state-hover)]",
          variant === "ghost" && "text-fg-default bg-transparent hover:bg-[var(--sp-state-hover)]",
          variant === "danger" && "bg-danger text-fg-on-danger hover:bg-danger/90",

          // Sizes (density-aware)
          size === "sm" && "h-[var(--sp-control-height-sm)] px-3 text-sm",
          size === "md" && "h-[var(--sp-control-height)] px-4 text-sm",
          size === "lg" && "h-[var(--sp-control-height-lg)] px-6 text-base",

          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
