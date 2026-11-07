import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseSwitch.Root>>(
  ({ className, children, ...props }, ref) => (
    <BaseSwitch.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-neutral-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-neutral-900",
        className,
      )}
      {...props}
    >
      {children}
    </BaseSwitch.Root>
  ),
);
Root.displayName = "Switch.Root";

const Thumb = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseSwitch.Thumb>>(
  ({ className, ...props }, ref) => (
    <BaseSwitch.Thumb
      ref={ref}
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
        className,
      )}
      {...props}
    />
  ),
);
Thumb.displayName = "Switch.Thumb";

export const Switch = {
  Root,
  Thumb,
};
