import * as React from "react";
import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseOTPField.Root>>(
  ({ className, ...props }, ref) => (
    <BaseOTPField.Root
      ref={ref}
      data-slot="otp-field-root"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  ),
);
Root.displayName = "OTPField.Root";

/* ----- Input ----- */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof BaseOTPField.Input>>(
  ({ className, ...props }, ref) => (
    <BaseOTPField.Input
      ref={ref}
      data-slot="otp-field-input"
      className={cn(
        "h-12 w-10 rounded-md border border-neutral-300 bg-white text-center text-lg font-medium text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "OTPField.Input";

/* ----- Separator ----- */
const Separator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseOTPField.Separator>
>(({ className, ...props }, ref) => (
  <BaseOTPField.Separator
    ref={ref}
    data-slot="otp-field-separator"
    className={cn("text-neutral-300", className)}
    {...props}
  >
    {props.children ?? <span aria-hidden>-</span>}
  </BaseOTPField.Separator>
));
Separator.displayName = "OTPField.Separator";

export const OTPField = {
  Root,
  Input,
  Separator,
};
