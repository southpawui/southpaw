import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseNumberField.Root>>(
  ({ className, ...props }, ref) => (
    <BaseNumberField.Root
      ref={ref}
      data-slot="number-field-root"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  ),
);
Root.displayName = "NumberField.Root";

/* ----- Group ----- */
const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseNumberField.Group>>(
  ({ className, ...props }, ref) => (
    <BaseNumberField.Group
      ref={ref}
      data-slot="number-field-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  ),
);
Group.displayName = "NumberField.Group";

/* ----- Input ----- */
const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof BaseNumberField.Input>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Input
    ref={ref}
    data-slot="number-field-input"
    className={cn(
      "h-10 w-full border-y border-neutral-300 bg-white px-3 text-center text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "NumberField.Input";

/* ----- Increment ----- */
const Increment = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseNumberField.Increment>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Increment
    ref={ref}
    data-slot="number-field-increment"
    className={cn(
      "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-md border border-neutral-300 bg-white text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Increment.displayName = "NumberField.Increment";

/* ----- Decrement ----- */
const Decrement = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseNumberField.Decrement>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Decrement
    ref={ref}
    data-slot="number-field-decrement"
    className={cn(
      "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-md border border-neutral-300 bg-white text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Decrement.displayName = "NumberField.Decrement";

/* ----- ScrubArea ----- */
const ScrubArea = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseNumberField.ScrubArea>
>(({ className, ...props }, ref) => (
  <BaseNumberField.ScrubArea
    ref={ref}
    data-slot="number-field-scrub-area"
    className={cn("cursor-ew-resize", className)}
    {...props}
  />
));
ScrubArea.displayName = "NumberField.ScrubArea";

/* ----- ScrubAreaCursor ----- */
const ScrubAreaCursor = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseNumberField.ScrubAreaCursor>
>(({ className, ...props }, ref) => (
  <BaseNumberField.ScrubAreaCursor
    ref={ref}
    data-slot="number-field-scrub-area-cursor"
    className={cn("", className)}
    {...props}
  />
));
ScrubAreaCursor.displayName = "NumberField.ScrubAreaCursor";

export const NumberField = {
  Root,
  Group,
  Input,
  Increment,
  Decrement,
  ScrubArea,
  ScrubAreaCursor,
};
