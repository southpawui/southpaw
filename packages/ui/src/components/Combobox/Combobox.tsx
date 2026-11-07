import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cn } from "../../lib/cn";

const Root = BaseCombobox.Root;

const Trigger = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Trigger>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Trigger
      ref={ref}
      data-slot="combobox-trigger"
      className={cn(
        "inline-flex items-center text-neutral-500 transition-colors hover:text-neutral-700",
        className,
      )}
      {...props}
    />
  ),
);
Trigger.displayName = "Combobox.Trigger";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof BaseCombobox.Input>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Input
      ref={ref}
      data-slot="combobox-input"
      className={cn(
        "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Combobox.Input";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseCombobox.InputGroup>
>(({ className, ...props }, ref) => (
  <BaseCombobox.InputGroup
    ref={ref}
    data-slot="combobox-input-group"
    className={cn("relative flex items-center", className)}
    {...props}
  />
));
InputGroup.displayName = "Combobox.InputGroup";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Popup
      ref={ref}
      data-slot="combobox-popup"
      className={cn(
        "z-50 max-h-[var(--available-height)] overflow-y-auto rounded-md border border-neutral-200 bg-white p-1 shadow-lg outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Combobox.Popup";

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseCombobox.Positioner>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Positioner
    ref={ref}
    data-slot="combobox-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "Combobox.Positioner";

const List = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.List>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.List
      ref={ref}
      data-slot="combobox-list"
      className={cn("outline-none", className)}
      {...props}
    />
  ),
);
List.displayName = "Combobox.List";

const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Item>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Item
      ref={ref}
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 pl-8 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-100 data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Item.displayName = "Combobox.Item";

const ItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseCombobox.ItemIndicator>
>(({ className, ...props }, ref) => (
  <BaseCombobox.ItemIndicator
    ref={ref}
    data-slot="combobox-item-indicator"
    className={cn("absolute left-2 flex h-4 w-4 items-center justify-center", className)}
    {...props}
  />
));
ItemIndicator.displayName = "Combobox.ItemIndicator";

const Value = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseCombobox.Value>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Value
      ref={ref}
      data-slot="combobox-value"
      className={cn("text-sm", className)}
      {...props}
    />
  ),
);
Value.displayName = "Combobox.Value";

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Arrow
      ref={ref}
      data-slot="combobox-arrow"
      className={cn("fill-white stroke-neutral-200", className)}
      {...props}
    />
  ),
);
Arrow.displayName = "Combobox.Arrow";

const Portal = BaseCombobox.Portal;

const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Group>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Group ref={ref} data-slot="combobox-group" className={cn(className)} {...props} />
  ),
);
Group.displayName = "Combobox.Group";

const GroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseCombobox.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseCombobox.GroupLabel
    ref={ref}
    data-slot="combobox-group-label"
    className={cn("px-2 py-1.5 text-xs font-semibold text-neutral-500", className)}
    {...props}
  />
));
GroupLabel.displayName = "Combobox.GroupLabel";

const Empty = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Empty>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Empty
      ref={ref}
      data-slot="combobox-empty"
      className={cn("px-2 py-4 text-center text-sm text-neutral-500", className)}
      {...props}
    />
  ),
);
Empty.displayName = "Combobox.Empty";

const Status = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Status>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Status
      ref={ref}
      data-slot="combobox-status"
      className={cn("sr-only", className)}
      {...props}
    />
  ),
);
Status.displayName = "Combobox.Status";

const Clear = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseCombobox.Clear>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Clear
      ref={ref}
      data-slot="combobox-clear"
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:text-neutral-700",
        className,
      )}
      {...props}
    />
  ),
);
Clear.displayName = "Combobox.Clear";

const Icon = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseCombobox.Icon>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Icon
      ref={ref}
      data-slot="combobox-icon"
      className={cn("text-neutral-500", className)}
      {...props}
    />
  ),
);
Icon.displayName = "Combobox.Icon";

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<typeof BaseCombobox.Label>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Label
      ref={ref}
      data-slot="combobox-label"
      className={cn("text-sm font-medium text-neutral-700", className)}
      {...props}
    />
  ),
);
Label.displayName = "Combobox.Label";

const Chips = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Chips>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Chips
      ref={ref}
      data-slot="combobox-chips"
      className={cn("flex flex-wrap gap-1", className)}
      {...props}
    />
  ),
);
Chips.displayName = "Combobox.Chips";

const Chip = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Chip>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Chip
      ref={ref}
      data-slot="combobox-chip"
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Chip.displayName = "Combobox.Chip";

const ChipRemove = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseCombobox.ChipRemove>
>(({ className, ...props }, ref) => (
  <BaseCombobox.ChipRemove
    ref={ref}
    data-slot="combobox-chip-remove"
    className={cn(
      "inline-flex h-4 w-4 items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-700",
      className,
    )}
    {...props}
  />
));
ChipRemove.displayName = "Combobox.ChipRemove";

const Collection = BaseCombobox.Collection;

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseCombobox.Separator>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Separator
    ref={ref}
    data-slot="combobox-separator"
    className={cn("-mx-1 my-1 h-px bg-neutral-200", className)}
    {...props}
  />
));
Separator.displayName = "Combobox.Separator";

export const Combobox = {
  Root,
  Trigger,
  Input,
  InputGroup,
  Popup,
  Positioner,
  List,
  Item,
  ItemIndicator,
  Value,
  Arrow,
  Portal,
  Group,
  GroupLabel,
  Empty,
  Status,
  Clear,
  Icon,
  Label,
  Chips,
  Chip,
  ChipRemove,
  Collection,
  Separator,
};
