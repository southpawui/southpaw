import * as React from "react";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "../../lib/cn";

export const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToggleGroup>
>(({ className, ...props }, ref) => (
  <BaseToggleGroup
    ref={ref}
    data-slot="toggle-group"
    className={cn("inline-flex gap-1", className)}
    {...props}
  />
));

ToggleGroup.displayName = "ToggleGroup";
