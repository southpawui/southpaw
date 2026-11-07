import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = BaseMenu.Root;

/* ----- Trigger ----- */
const Trigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseMenu.Trigger>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Trigger
      ref={ref}
      data-slot="menu-trigger"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
Trigger.displayName = "MenuTrigger";

/* ----- Portal ----- */
const Portal = BaseMenu.Portal;

/* ----- Positioner ----- */
const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseMenu.Positioner
    ref={ref}
    data-slot="menu-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "MenuPositioner";

/* ----- Popup ----- */
const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Popup
      ref={ref}
      data-slot="menu-popup"
      className={cn(
        "min-w-[8rem] origin-[var(--transform-origin)] rounded-md border border-neutral-200 bg-white p-1 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "MenuPopup";

/* ----- Item ----- */
const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Item>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Item
      ref={ref}
      data-slot="menu-item"
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-neutral-100",
        className,
      )}
      {...props}
    />
  ),
);
Item.displayName = "MenuItem";

/* ----- Group ----- */
const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Group>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Group ref={ref} data-slot="menu-group" className={cn("", className)} {...props} />
  ),
);
Group.displayName = "MenuGroup";

/* ----- GroupLabel ----- */
const GroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseMenu.GroupLabel
    ref={ref}
    data-slot="menu-group-label"
    className={cn("px-2 py-1.5 text-xs font-semibold text-neutral-500", className)}
    {...props}
  />
));
GroupLabel.displayName = "MenuGroupLabel";

/* ----- Separator ----- */
const Separator = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Separator>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Separator
      ref={ref}
      data-slot="menu-separator"
      className={cn("my-1 h-px bg-neutral-200", className)}
      {...props}
    />
  ),
);
Separator.displayName = "MenuSeparator";

/* ----- Arrow ----- */
const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Arrow
      ref={ref}
      data-slot="menu-arrow"
      className={cn(
        "data-[side=bottom]:top-[-6px] data-[side=left]:right-[-6px] data-[side=right]:left-[-6px] data-[side=top]:bottom-[-6px]",
        className,
      )}
      {...props}
    />
  ),
);
Arrow.displayName = "MenuArrow";

/* ----- CheckboxItem ----- */
const CheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMenu.CheckboxItem>
>(({ className, ...props }, ref) => (
  <BaseMenu.CheckboxItem
    ref={ref}
    data-slot="menu-checkbox-item"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-neutral-100",
      className,
    )}
    {...props}
  />
));
CheckboxItem.displayName = "MenuCheckboxItem";

/* ----- CheckboxItemIndicator ----- */
const CheckboxItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseMenu.CheckboxItemIndicator>
>(({ className, ...props }, ref) => (
  <BaseMenu.CheckboxItemIndicator
    ref={ref}
    data-slot="menu-checkbox-item-indicator"
    className={cn("absolute left-2 inline-flex items-center justify-center", className)}
    {...props}
  />
));
CheckboxItemIndicator.displayName = "MenuCheckboxItemIndicator";

/* ----- RadioGroup ----- */
const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseMenu.RadioGroup
    ref={ref}
    data-slot="menu-radio-group"
    className={cn("", className)}
    {...props}
  />
));
RadioGroup.displayName = "MenuRadioGroup";

/* ----- RadioItem ----- */
const RadioItem = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.RadioItem>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.RadioItem
      ref={ref}
      data-slot="menu-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-neutral-100",
        className,
      )}
      {...props}
    />
  ),
);
RadioItem.displayName = "MenuRadioItem";

/* ----- RadioItemIndicator ----- */
const RadioItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseMenu.RadioItemIndicator>
>(({ className, ...props }, ref) => (
  <BaseMenu.RadioItemIndicator
    ref={ref}
    data-slot="menu-radio-item-indicator"
    className={cn("absolute left-2 inline-flex items-center justify-center", className)}
    {...props}
  />
));
RadioItemIndicator.displayName = "MenuRadioItemIndicator";

export const Menu = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Item,
  Group,
  GroupLabel,
  Separator,
  Arrow,
  CheckboxItem,
  CheckboxItemIndicator,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
};
