import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAccordion.Root>>(
  ({ className, ...props }, ref) => (
    <BaseAccordion.Root
      ref={ref}
      data-slot="accordion"
      className={cn("w-full divide-y divide-neutral-200", className)}
      {...props}
    />
  ),
);
Root.displayName = "Accordion.Root";

const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAccordion.Item>>(
  ({ className, ...props }, ref) => (
    <BaseAccordion.Item
      ref={ref}
      data-slot="accordion-item"
      className={cn("", className)}
      {...props}
    />
  ),
);
Item.displayName = "Accordion.Item";

const Header = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseAccordion.Header>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Header
    ref={ref}
    data-slot="accordion-header"
    className={cn("flex", className)}
    {...props}
  />
));
Header.displayName = "Accordion.Header";

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAccordion.Trigger>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Trigger
    ref={ref}
    data-slot="accordion-trigger"
    className={cn(
      "flex flex-1 cursor-pointer items-center justify-between py-4 text-sm font-medium transition-all hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 [&[data-panel-open]>svg]:rotate-180",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "Accordion.Trigger";

const Panel = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAccordion.Panel>>(
  ({ className, ...props }, ref) => (
    <BaseAccordion.Panel
      ref={ref}
      data-slot="accordion-panel"
      className={cn(
        "overflow-hidden text-sm transition-all data-[ending-style]:h-0 data-[starting-style]:h-0",
        className,
      )}
      {...props}
    />
  ),
);
Panel.displayName = "Accordion.Panel";

export const Accordion = { Root, Item, Header, Trigger, Panel };
