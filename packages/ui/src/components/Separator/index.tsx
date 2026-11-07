import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "../../lib/cn";

export const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSeparator>
>(({ className, ...props }, ref) => (
  <BaseSeparator
    ref={ref}
    data-slot="separator"
    className={cn(
      "shrink-0 bg-neutral-200 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
      className,
    )}
    {...props}
  />
));

Separator.displayName = "Separator";
