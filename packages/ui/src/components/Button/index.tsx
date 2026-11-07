import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../../lib/cn";

export interface ButtonProps extends React.ComponentProps<typeof BaseButton> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        data-slot="button"
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "solid" && "bg-neutral-900 text-white hover:bg-neutral-800",
          variant === "outline" && "border border-neutral-300 bg-transparent hover:bg-neutral-100",
          variant === "ghost" && "bg-transparent hover:bg-neutral-100",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
