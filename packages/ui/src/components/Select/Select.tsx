import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDown, Check, X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { Button } from "../Button/Button";

/* ============================================================
 * Root
 * ============================================================ */

const Root = BaseSelect.Root;

/* ============================================================
 * Trigger
 * ============================================================ */

interface SelectTriggerProps extends React.ComponentProps<typeof BaseSelect.Trigger> {
  /** Show valid/success state — green border */
  valid?: boolean;
  /** Show a clear button when a value is selected. Pass the onClear callback. */
  onClear?: () => void;
}

const Trigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, valid, onClear, children, ...props }, ref) => (
    <BaseSelect.Trigger
      ref={ref}
      data-slot="select-trigger"
      className={cn(
        "bg-surface-base text-fg-default inline-flex h-[var(--sp-control-height)] w-full items-center justify-between gap-2 rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))] px-3 text-sm",
        "border-border-control border-2",
        "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "hover:border-fg-muted",
        "focus-visible:sp-focus-ring",
        "data-[popup-open]:border-accent",
        "data-[invalid]:!border-danger",
        valid && "!border-success",
        "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-[var(--sp-state-disabled-opacity)]",
        "data-[readonly]:bg-surface-sunken data-[readonly]:border-border-default",
        className,
      )}
      {...props}
    >
      {children ?? <Value />}
      <span className="flex shrink-0 items-center gap-1.5">
        {onClear && (
          <>
            <ClearButton onClear={onClear} />
            <span className="bg-border-default h-4 w-px" aria-hidden="true" />
          </>
        )}
        <SelectIcon />
      </span>
    </BaseSelect.Trigger>
  ),
);
Trigger.displayName = "Select.Trigger";

/* ============================================================
 * Clear button (internal)
 * ============================================================ */

function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <Button
      size="icon"
      variant="ghost"
      srOnly="Clear selection"
      icon={<X className="h-3.5 w-3.5" />}
      data-slot="select-clear"
      className="text-fg-muted hover:text-fg-default !h-5 !min-h-0 !w-5 !min-w-0 !rounded-full"
      tabIndex={-1}
      render={<span role="button" />}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClear();
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
}

/* ============================================================
 * Value
 * ============================================================ */

const Value = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseSelect.Value>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Value
      ref={ref}
      data-slot="select-value"
      className={cn("text-sm", "data-[placeholder]:text-fg-muted", className)}
      {...props}
    />
  ),
);
Value.displayName = "Select.Value";

/* ============================================================
 * Icon (chevron)
 * ============================================================ */

const SelectIcon = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof BaseSelect.Icon>>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.Icon
      ref={ref}
      data-slot="select-icon"
      className={cn(
        "text-fg-muted transition-transform duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "[[data-popup-open]_&]:rotate-180",
        className,
      )}
      {...props}
    >
      {children ?? <CaretDown weight="bold" className="h-3.5 w-3.5" />}
    </BaseSelect.Icon>
  ),
);
SelectIcon.displayName = "Select.Icon";

/* ============================================================
 * Portal + Backdrop
 * ============================================================ */

const Portal = BaseSelect.Portal;
const Backdrop = BaseSelect.Backdrop;

/* ============================================================
 * Positioner
 * ============================================================ */

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.Positioner>
>(({ className, sideOffset = 4, alignItemWithTrigger = false, ...props }, ref) => (
  <BaseSelect.Positioner
    ref={ref}
    data-slot="select-positioner"
    sideOffset={sideOffset}
    alignItemWithTrigger={alignItemWithTrigger}
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "Select.Positioner";

/* ============================================================
 * Popup
 * ============================================================ */

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Popup
      ref={ref}
      data-slot="select-popup"
      className={cn(
        "bg-surface-overlay z-50 max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded-[var(--radius-DEFAULT)] p-1 outline-none",
        "border-border-default border shadow-lg",
        // Entry/exit animation
        "origin-[var(--transform-origin)]",
        "transition-[transform,scale,opacity] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Select.Popup";

/* ============================================================
 * List
 * ============================================================ */

interface SelectListProps extends React.ComponentProps<typeof BaseSelect.List> {
  /** Enable CSS content-visibility optimisation for long lists (100+ items). */
  virtualized?: boolean;
}

const List = React.forwardRef<HTMLDivElement, SelectListProps>(
  ({ className, virtualized, ...props }, ref) => (
    <BaseSelect.List
      ref={ref}
      data-slot="select-list"
      className={cn(
        "outline-none",
        virtualized && "[contain-intrinsic-size:auto_2000px] [content-visibility:auto]",
        className,
      )}
      {...props}
    />
  ),
);
List.displayName = "Select.List";

/* ============================================================
 * Item
 * ============================================================ */

const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSelect.Item>>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.Item
      ref={ref}
      data-slot="select-item"
      className={cn(
        "text-fg-default relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 pl-8 text-sm outline-none",
        "data-[highlighted]:bg-[var(--sp-state-hover)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    >
      {children}
    </BaseSelect.Item>
  ),
);
Item.displayName = "Select.Item";

/* ============================================================
 * ItemIndicator
 * ============================================================ */

const ItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseSelect.ItemIndicator>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.ItemIndicator
    ref={ref}
    data-slot="select-item-indicator"
    className={cn(
      "text-accent absolute left-2 flex h-4 w-4 items-center justify-center",
      className,
    )}
    {...props}
  >
    {children ?? <Check className="h-3 w-3" />}
  </BaseSelect.ItemIndicator>
));
ItemIndicator.displayName = "Select.ItemIndicator";

/* ============================================================
 * ItemText
 * ============================================================ */

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

/* ============================================================
 * Arrow
 * ============================================================ */

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

/* ============================================================
 * Group + GroupLabel
 * ============================================================ */

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

/* ============================================================
 * Separator
 * ============================================================ */

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

/* ============================================================
 * Scroll arrows
 * ============================================================ */

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

/* ============================================================
 * Compound export
 * ============================================================ */

export const Select = {
  Root,
  Trigger,
  Value,
  Icon: SelectIcon,
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
