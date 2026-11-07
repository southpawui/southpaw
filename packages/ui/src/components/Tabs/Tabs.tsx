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
      className={cn("border-border-default relative inline-flex items-center border-b", className)}
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
        // Base
        "text-fg-muted inline-flex items-center justify-center px-4 py-2 text-sm font-medium",
        // Transition
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:text-fg-default",
        // Focus
        "focus-visible:sp-focus-ring",
        // Selected — uses accent, shows weight change (BRIEF 7a)
        "data-[selected]:text-accent data-[selected]:font-semibold",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-[var(--sp-state-disabled-opacity)]",
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
      className={cn("text-fg-default focus-visible:sp-focus-ring mt-4", className)}
      {...props}
    />
  ),
);
Panel.displayName = "Tabs.Panel";

/* Selected indicator bar — uses accent (BRIEF 7a: "shows weight or bar as well as colour") */
const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseTabs.Indicator>
>(({ className, ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    data-slot="tabs-indicator"
    className={cn(
      "bg-accent absolute bottom-0 h-0.5",
      "transition-all duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
      className,
    )}
    {...props}
  />
));
Indicator.displayName = "Tabs.Indicator";

export const Tabs = { Root, List, Tab, Panel, Indicator };
