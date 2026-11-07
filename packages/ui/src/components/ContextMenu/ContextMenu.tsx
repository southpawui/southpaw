import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { cn } from "../../lib/cn";

const Root = BaseContextMenu.Root;

const Trigger = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseContextMenu.Trigger>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Trigger
    ref={ref}
    data-slot="context-menu-trigger"
    className={cn(className)}
    {...props}
  />
));
Trigger.displayName = "ContextMenu.Trigger";

const Portal = BaseContextMenu.Portal;

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseContextMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Positioner
    ref={ref}
    data-slot="context-menu-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "ContextMenu.Positioner";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseContextMenu.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseContextMenu.Popup
      ref={ref}
      data-slot="context-menu-popup"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "ContextMenu.Popup";

const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseContextMenu.Item>>(
  ({ className, ...props }, ref) => (
    <BaseContextMenu.Item
      ref={ref}
      data-slot="context-menu-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-100 data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Item.displayName = "ContextMenu.Item";

const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseContextMenu.Group>>(
  ({ className, ...props }, ref) => (
    <BaseContextMenu.Group
      ref={ref}
      data-slot="context-menu-group"
      className={cn(className)}
      {...props}
    />
  ),
);
Group.displayName = "ContextMenu.Group";

const GroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseContextMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.GroupLabel
    ref={ref}
    data-slot="context-menu-group-label"
    className={cn("px-2 py-1.5 text-xs font-semibold text-neutral-500", className)}
    {...props}
  />
));
GroupLabel.displayName = "ContextMenu.GroupLabel";

const Separator = React.forwardRef<
  HTMLHRElement,
  React.ComponentProps<typeof BaseContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Separator
    ref={ref}
    data-slot="context-menu-separator"
    className={cn("-mx-1 my-1 h-px bg-neutral-200", className)}
    {...props}
  />
));
Separator.displayName = "ContextMenu.Separator";

const CheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseContextMenu.CheckboxItem>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.CheckboxItem
    ref={ref}
    data-slot="context-menu-checkbox-item"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-100 data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
CheckboxItem.displayName = "ContextMenu.CheckboxItem";

const CheckboxItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseContextMenu.CheckboxItemIndicator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.CheckboxItemIndicator
    ref={ref}
    data-slot="context-menu-checkbox-item-indicator"
    className={cn("absolute left-2 flex h-4 w-4 items-center justify-center", className)}
    {...props}
  />
));
CheckboxItemIndicator.displayName = "ContextMenu.CheckboxItemIndicator";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseContextMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioGroup
    ref={ref}
    data-slot="context-menu-radio-group"
    className={cn(className)}
    {...props}
  />
));
RadioGroup.displayName = "ContextMenu.RadioGroup";

const RadioItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseContextMenu.RadioItem>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioItem
    ref={ref}
    data-slot="context-menu-radio-item"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-100 data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
RadioItem.displayName = "ContextMenu.RadioItem";

const RadioItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseContextMenu.RadioItemIndicator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioItemIndicator
    ref={ref}
    data-slot="context-menu-radio-item-indicator"
    className={cn("absolute left-2 flex h-4 w-4 items-center justify-center", className)}
    {...props}
  />
));
RadioItemIndicator.displayName = "ContextMenu.RadioItemIndicator";

export const ContextMenu = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Item,
  Group,
  GroupLabel,
  Separator,
  CheckboxItem,
  CheckboxItemIndicator,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
};
