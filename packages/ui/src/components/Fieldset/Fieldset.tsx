import * as React from "react";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLFieldSetElement, React.ComponentProps<typeof BaseFieldset.Root>>(
  ({ className, ...props }, ref) => (
    <BaseFieldset.Root
      ref={ref}
      data-slot="fieldset"
      className={cn("rounded-lg border border-neutral-200 p-6", className)}
      {...props}
    />
  ),
);
Root.displayName = "Fieldset.Root";

const Legend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentProps<typeof BaseFieldset.Legend>
>(({ className, ...props }, ref) => (
  <BaseFieldset.Legend
    ref={ref}
    data-slot="fieldset-legend"
    className={cn("px-2 text-sm font-semibold text-neutral-900", className)}
    {...props}
  />
));
Legend.displayName = "Fieldset.Legend";

export const Fieldset = { Root, Legend };
