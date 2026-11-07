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
        "inline-flex h-10 items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:border-neutral-400",
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
      className={cn("text-neutral-500", className)}
      {...props}
    />
  ),
);
Icon.displayName = "Select.Icon";

const Portal = BaseSelect.Portal;

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
        "z-50 max-h-[var(--available-height)] overflow-y-auto rounded-md border border-neutral-200 bg-white p-1 shadow-lg outline-none",
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
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-100 data-[disabled]:opacity-50",
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
    className={cn("absolute left-2 flex h-4 w-4 items-center justify-center", className)}
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
      className={cn("fill-white stroke-neutral-200", className)}
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
    className={cn("px-2 py-1.5 text-xs font-semibold text-neutral-500", className)}
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
    className={cn("-mx-1 my-1 h-px bg-neutral-200", className)}
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
    className={cn("flex items-center justify-center py-1 text-neutral-500", className)}
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
    className={cn("flex items-center justify-center py-1 text-neutral-500", className)}
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
