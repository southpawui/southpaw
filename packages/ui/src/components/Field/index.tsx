import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseField.Root>>(
  ({ className, ...props }, ref) => (
    <BaseField.Root
      ref={ref}
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  ),
);
Root.displayName = "Field.Root";

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<typeof BaseField.Label>>(
  ({ className, ...props }, ref) => (
    <BaseField.Label
      ref={ref}
      data-slot="field-label"
      className={cn("text-sm font-medium text-neutral-900", className)}
      {...props}
    />
  ),
);
Label.displayName = "Field.Label";

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseField.Description>
>(({ className, ...props }, ref) => (
  <BaseField.Description
    ref={ref}
    data-slot="field-description"
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  />
));
Description.displayName = "Field.Description";

const Error = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseField.Error>>(
  ({ className, ...props }, ref) => (
    <BaseField.Error
      ref={ref}
      data-slot="field-error"
      className={cn("text-sm text-red-600", className)}
      {...props}
    />
  ),
);
Error.displayName = "Field.Error";

const Control = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof BaseField.Control>>(
  ({ className, ...props }, ref) => (
    <BaseField.Control
      ref={ref}
      data-slot="field-control"
      className={cn(
        "rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 data-[invalid]:border-red-500 data-[invalid]:focus:ring-red-500",
        className,
      )}
      {...props}
    />
  ),
);
Control.displayName = "Field.Control";

export const Field = { Root, Label, Description, Error, Control };
