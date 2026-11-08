import * as React from "react";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "../../lib/cn";

export const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseRadioGroup>
>(({ className, ...props }, ref) => (
  <BaseRadioGroup
    ref={ref}
    data-slot="radio-group"
    className={cn("flex flex-col gap-[var(--sp-control-gap)]", className)}
    {...props}
  />
));

RadioGroup.displayName = "RadioGroup";
