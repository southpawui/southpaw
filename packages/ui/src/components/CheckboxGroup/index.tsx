import * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { cn } from "../../lib/cn";

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseCheckboxGroup>
>(({ className, ...props }, ref) => (
  <BaseCheckboxGroup
    ref={ref}
    data-slot="checkbox-group"
    className={cn("flex flex-col gap-3", className)}
    {...props}
  />
));
CheckboxGroup.displayName = "CheckboxGroup";
