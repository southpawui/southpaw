import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTabs.Root>>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Root
      ref={ref}
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  ),
);
Root.displayName = "Tabs.Root";

const List = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTabs.List>>(
  ({ className, ...props }, ref) => (
    <BaseTabs.List
      ref={ref}
      data-slot="tabs-list"
      className={cn("inline-flex items-center border-b border-neutral-200", className)}
      {...props}
    />
  ),
);
List.displayName = "Tabs.List";

const Tab = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseTabs.Tab>>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Tab
      ref={ref}
      data-slot="tabs-tab"
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-50 data-[selected]:text-neutral-900",
        className,
      )}
      {...props}
    />
  ),
);
Tab.displayName = "Tabs.Tab";

const Panel = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTabs.Panel>>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Panel
      ref={ref}
      data-slot="tabs-panel"
      className={cn("mt-4 focus-visible:outline-2 focus-visible:outline-neutral-900", className)}
      {...props}
    />
  ),
);
Panel.displayName = "Tabs.Panel";

const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseTabs.Indicator>
>(({ className, ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    data-slot="tabs-indicator"
    className={cn("absolute bottom-0 h-0.5 bg-neutral-900 transition-all duration-200", className)}
    {...props}
  />
));
Indicator.displayName = "Tabs.Indicator";

export const Tabs = {
  Root,
  List,
  Tab,
  Panel,
  Indicator,
};
