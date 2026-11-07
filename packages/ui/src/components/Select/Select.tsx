import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "../../lib/cn";

const Root = BaseSelect.Root;

const Trigger = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.Trigger>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Trigger
      ref={ref}
      data-slot="select-trigger"
      className={cn(
        // Base
        "bg-surface-base text-fg-default inline-flex h-[var(--sp-control-height)] w-full items-center justify-between gap-2 rounded-[var(--radius-DEFAULT)] px-3 text-sm",
        // Border
        "border-border-control border-2",
        // Transition
        "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:border-fg-muted",
        // Focus
        "focus-visible:sp-focus-ring",
        // Open
        "data-[popup-open]:border-accent",
        // Invalid
        "data-[invalid]:border-danger",
        // Disabled
        "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    />
  ),
);
Trigger.displayName = "Select.Trigger";

const Value = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseSelect.Value>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Value
      ref={ref}
      data-slot="select-value"
      className={cn("text-sm", className)}
      {...props}
    />
  ),
);
Value.displayName = "Select.Value";

const Icon = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseSelect.Icon>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Icon
      ref={ref}
      data-slot="select-icon"
      className={cn("text-fg-muted", className)}
      {...props}
    />
  ),
);
Icon.displayName = "Select.Icon";

const Portal = BaseSelect.Portal;
const Backdrop = BaseSelect.Backdrop;

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.Positioner>
>(({ className, ...props }, ref) => (
  <BaseSelect.Positioner
    ref={ref}
    data-slot="select-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "Select.Positioner";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Popup
      ref={ref}
      data-slot="select-popup"
      className={cn(
        // Base
        "bg-surface-overlay z-50 max-h-[var(--available-height)] overflow-y-auto rounded-[var(--radius-DEFAULT)] p-1 outline-none",
        // Border + shadow
        "border-border-default border shadow-lg",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Select.Popup";

const List = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.List>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.List
      ref={ref}
      data-slot="select-list"
      className={cn("outline-none", className)}
      {...props}
    />
  ),
);
List.displayName = "Select.List";

const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.Item>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Item
      ref={ref}
      data-slot="select-item"
      className={cn(
        "text-fg-default relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 pl-8 text-sm outline-none",
        // Highlighted
        "data-[highlighted]:bg-[var(--sp-state-hover)]",
        // Disabled
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    />
  ),
);
Item.displayName = "Select.Item";

const ItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseSelect.ItemIndicator>
>(({ className, ...props }, ref) => (
  <BaseSelect.ItemIndicator
    ref={ref}
    data-slot="select-item-indicator"
    className={cn(
      "text-accent absolute left-2 flex h-4 w-4 items-center justify-center",
      className,
    )}
    {...props}
  />
));
ItemIndicator.displayName = "Select.ItemIndicator";

const ItemText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseSelect.ItemText>
>(({ className, ...props }, ref) => (
  <BaseSelect.ItemText
    ref={ref}
    data-slot="select-item-text"
    className={cn(className)}
    {...props}
  />
));
ItemText.displayName = "Select.ItemText";

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Arrow
      ref={ref}
      data-slot="select-arrow"
      className={cn("fill-surface-overlay stroke-border-default", className)}
      {...props}
    />
  ),
);
Arrow.displayName = "Select.Arrow";

const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.Group>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Group ref={ref} data-slot="select-group" className={cn(className)} {...props} />
  ),
);
Group.displayName = "Select.Group";

const GroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    data-slot="select-group-label"
    className={cn("text-fg-muted px-2 py-1.5 text-xs font-semibold", className)}
    {...props}
  />
));
GroupLabel.displayName = "Select.GroupLabel";

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.Separator>
>(({ className, ...props }, ref) => (
  <BaseSelect.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn("bg-border-default -mx-1 my-1 h-px", className)}
    {...props}
  />
));
Separator.displayName = "Select.Separator";

const ScrollUpArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.ScrollUpArrow>
>(({ className, ...props }, ref) => (
  <BaseSelect.ScrollUpArrow
    ref={ref}
    data-slot="select-scroll-up-arrow"
    className={cn("text-fg-muted flex items-center justify-center py-1", className)}
    {...props}
  />
));
ScrollUpArrow.displayName = "Select.ScrollUpArrow";

const ScrollDownArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.ScrollDownArrow>
>(({ className, ...props }, ref) => (
  <BaseSelect.ScrollDownArrow
    ref={ref}
    data-slot="select-scroll-down-arrow"
    className={cn("text-fg-muted flex items-center justify-center py-1", className)}
    {...props}
  />
));
ScrollDownArrow.displayName = "Select.ScrollDownArrow";

export const Select = {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Backdrop,
  Positioner,
  Popup,
  List,
  Item,
  ItemIndicator,
  ItemText,
  Arrow,
  Group,
  GroupLabel,
  Separator,
  ScrollUpArrow,
  ScrollDownArrow,
};
