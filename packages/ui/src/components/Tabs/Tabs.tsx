import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTabs.Root>>(
  ({ className, orientation, ...props }, ref) => (
    <BaseTabs.Root
      ref={ref}
      data-slot="tabs"
      orientation={orientation}
      className={cn("flex", orientation === "vertical" ? "flex-row" : "flex-col", className)}
      {...props}
    />
  ),
);
Root.displayName = "Tabs.Root";

/* ============================================================
 * List
 * ============================================================ */

const List = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTabs.List>>(
  ({ className, ...props }, ref) => (
    <BaseTabs.List
      ref={ref}
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex items-center",
        // Horizontal: bottom border, scrollable
        "[[data-orientation=horizontal]_&]:border-border-default [[data-orientation=horizontal]_&]:scrollbar-none [[data-orientation=horizontal]_&]:overflow-x-auto [[data-orientation=horizontal]_&]:border-b",
        // Vertical: right border, column layout
        "[[data-orientation=vertical]_&]:border-border-default [[data-orientation=vertical]_&]:flex-col [[data-orientation=vertical]_&]:border-r",
        className,
      )}
      {...props}
    />
  ),
);
List.displayName = "Tabs.List";

/* ============================================================
 * Tab
 * ============================================================ */

const Tab = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseTabs.Tab>>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Tab
      ref={ref}
      data-slot="tabs-tab"
      className={cn(
        // Base
        "text-fg-muted inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 px-4 py-2 text-sm font-medium",
        // Transition
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:text-fg-default",
        // Focus
        "focus-visible:sp-focus-ring",
        // Selected — uses accent, shows weight change
        "data-[selected]:text-accent data-[selected]:font-semibold",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    />
  ),
);
Tab.displayName = "Tabs.Tab";

/* ============================================================
 * Panel
 * ============================================================ */

const Panel = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTabs.Panel>>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Panel
      ref={ref}
      data-slot="tabs-panel"
      className={cn(
        "text-fg-default focus-visible:sp-focus-ring",
        "[[data-orientation=horizontal]_&]:mt-4",
        "[[data-orientation=vertical]_&]:ml-4",
        className,
      )}
      {...props}
    />
  ),
);
Panel.displayName = "Tabs.Panel";

/* ============================================================
 * Indicator (animated bar following selected tab)
 * ============================================================ */

const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseTabs.Indicator>
>(({ className, ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    data-slot="tabs-indicator"
    className={cn(
      "bg-accent absolute",
      // Horizontal: bottom bar, sized by CSS vars from Base UI
      "[[data-orientation=horizontal]_&]:-bottom-px [[data-orientation=horizontal]_&]:h-[2px]",
      "[[data-orientation=horizontal]_&]:left-[var(--active-tab-left)] [[data-orientation=horizontal]_&]:w-[var(--active-tab-width)]",
      // Vertical: right bar, sized by CSS vars from Base UI
      "[[data-orientation=vertical]_&]:-right-px [[data-orientation=vertical]_&]:w-[2px]",
      "[[data-orientation=vertical]_&]:top-[var(--active-tab-top)] [[data-orientation=vertical]_&]:h-[var(--active-tab-height)]",
      // Transition
      "transition-all duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
      className,
    )}
    {...props}
  />
));
Indicator.displayName = "Tabs.Indicator";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Tabs = { Root, List, Tab, Panel, Indicator };
