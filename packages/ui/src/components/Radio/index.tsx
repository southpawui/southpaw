import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseRadio.Root>>(
  ({ className, children, ...props }, ref) => (
    <BaseRadio.Root
      ref={ref}
      data-slot="radio"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-neutral-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 data-[disabled]:cursor-not-allowed data-[checked]:border-neutral-900 data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </BaseRadio.Root>
  ),
);
Root.displayName = "Radio.Root";

const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseRadio.Indicator>
>(({ className, ...props }, ref) => (
  <BaseRadio.Indicator
    ref={ref}
    data-slot="radio-indicator"
    className={cn("h-2.5 w-2.5 rounded-full bg-neutral-900 data-[unchecked]:hidden", className)}
    {...props}
  />
));
Indicator.displayName = "Radio.Indicator";

export const Radio = {
  Root,
  Indicator,
};
