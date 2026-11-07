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
          "w-full rounded-md border border-neutral-300 bg-white text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" && "h-8 px-2.5 text-sm",
          size === "md" && "h-10 px-3 text-sm",
          size === "lg" && "h-12 px-4 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
