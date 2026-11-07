import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCollapsible.Root>>(
  ({ className, ...props }, ref) => (
    <BaseCollapsible.Root
      ref={ref}
      data-slot="collapsible"
      className={cn("w-full", className)}
      {...props}
    />
  ),
);
Root.displayName = "Collapsible.Root";

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseCollapsible.Trigger>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Trigger
    ref={ref}
    data-slot="collapsible-trigger"
    className={cn(
      "flex w-full cursor-pointer items-center justify-between rounded-md py-2 text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "Collapsible.Trigger";

const Panel = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCollapsible.Panel>>(
  ({ className, ...props }, ref) => (
    <BaseCollapsible.Panel
      ref={ref}
      data-slot="collapsible-panel"
      className={cn(
        "overflow-hidden text-sm transition-all data-[ending-style]:h-0 data-[starting-style]:h-0",
        className,
      )}
      {...props}
    />
  ),
);
Panel.displayName = "Collapsible.Panel";

export const Collapsible = { Root, Trigger, Panel };
