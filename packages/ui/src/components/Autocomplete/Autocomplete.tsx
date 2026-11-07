import * as React from "react";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { cn } from "../../lib/cn";

const Root = BaseAutocomplete.Root;

const Trigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAutocomplete.Trigger>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Trigger
    ref={ref}
    data-slot="autocomplete-trigger"
    className={cn(
      "inline-flex items-center text-neutral-500 transition-colors hover:text-neutral-700",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "Autocomplete.Trigger";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof BaseAutocomplete.Input>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Input
    ref={ref}
    data-slot="autocomplete-input"
    className={cn(
      "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Autocomplete.Input";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAutocomplete.InputGroup>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.InputGroup
    ref={ref}
    data-slot="autocomplete-input-group"
    className={cn("relative flex items-center", className)}
    {...props}
  />
));
InputGroup.displayName = "Autocomplete.InputGroup";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAutocomplete.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseAutocomplete.Popup
      ref={ref}
      data-slot="autocomplete-popup"
      className={cn(
        "z-50 max-h-[var(--available-height)] overflow-y-auto rounded-md border border-neutral-200 bg-white p-1 shadow-lg outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Autocomplete.Popup";

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAutocomplete.Positioner>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Positioner
    ref={ref}
    data-slot="autocomplete-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "Autocomplete.Positioner";

const List = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAutocomplete.List>>(
  ({ className, ...props }, ref) => (
    <BaseAutocomplete.List
      ref={ref}
      data-slot="autocomplete-list"
      className={cn("outline-none", className)}
      {...props}
    />
  ),
);
List.displayName = "Autocomplete.List";

const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAutocomplete.Item>>(
  ({ className, ...props }, ref) => (
    <BaseAutocomplete.Item
      ref={ref}
      data-slot="autocomplete-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-100 data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Item.displayName = "Autocomplete.Item";

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAutocomplete.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseAutocomplete.Arrow
      ref={ref}
      data-slot="autocomplete-arrow"
      className={cn("fill-white stroke-neutral-200", className)}
      {...props}
    />
  ),
);
Arrow.displayName = "Autocomplete.Arrow";

const Portal = BaseAutocomplete.Portal;

const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAutocomplete.Group>>(
  ({ className, ...props }, ref) => (
    <BaseAutocomplete.Group
      ref={ref}
      data-slot="autocomplete-group"
      className={cn(className)}
      {...props}
    />
  ),
);
Group.displayName = "Autocomplete.Group";

const GroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAutocomplete.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.GroupLabel
    ref={ref}
    data-slot="autocomplete-group-label"
    className={cn("px-2 py-1.5 text-xs font-semibold text-neutral-500", className)}
    {...props}
  />
));
GroupLabel.displayName = "Autocomplete.GroupLabel";

const Empty = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAutocomplete.Empty>>(
  ({ className, ...props }, ref) => (
    <BaseAutocomplete.Empty
      ref={ref}
      data-slot="autocomplete-empty"
      className={cn("px-2 py-4 text-center text-sm text-neutral-500", className)}
      {...props}
    />
  ),
);
Empty.displayName = "Autocomplete.Empty";

const Status = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAutocomplete.Status>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Status
    ref={ref}
    data-slot="autocomplete-status"
    className={cn("sr-only", className)}
    {...props}
  />
));
Status.displayName = "Autocomplete.Status";

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAutocomplete.Separator>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Separator
    ref={ref}
    data-slot="autocomplete-separator"
    className={cn("-mx-1 my-1 h-px bg-neutral-200", className)}
    {...props}
  />
));
Separator.displayName = "Autocomplete.Separator";

const Clear = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAutocomplete.Clear>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Clear
    ref={ref}
    data-slot="autocomplete-clear"
    className={cn(
      "inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:text-neutral-700",
      className,
    )}
    {...props}
  />
));
Clear.displayName = "Autocomplete.Clear";

const Icon = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseAutocomplete.Icon>>(
  ({ className, ...props }, ref) => (
    <BaseAutocomplete.Icon
      ref={ref}
      data-slot="autocomplete-icon"
      className={cn("text-neutral-500", className)}
      {...props}
    />
  ),
);
Icon.displayName = "Autocomplete.Icon";

const Value = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseAutocomplete.Value>
>(({ className, ...props }, ref) => (
  <BaseAutocomplete.Value
    ref={ref}
    data-slot="autocomplete-value"
    className={cn("text-sm", className)}
    {...props}
  />
));
Value.displayName = "Autocomplete.Value";

export const Autocomplete = {
  Root,
  Trigger,
  Input,
  InputGroup,
  Popup,
  Positioner,
  List,
  Item,
  Arrow,
  Portal,
  Group,
  GroupLabel,
  Empty,
  Status,
  Separator,
  Clear,
  Icon,
  Value,
};
