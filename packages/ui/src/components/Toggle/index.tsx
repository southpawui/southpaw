import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cn } from "../../lib/cn";

export const Toggle = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseToggle>>(
  ({ className, ...props }, ref) => (
    <BaseToggle
      ref={ref}
      data-slot="toggle"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 bg-transparent text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-neutral-900 data-[pressed]:text-white",
        className,
      )}
      {...props}
    />
  ),
);

Toggle.displayName = "Toggle";
