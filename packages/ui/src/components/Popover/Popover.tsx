import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = BasePopover.Root;

/* ----- Trigger ----- */
const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BasePopover.Trigger>
>(({ className, ...props }, ref) => (
  <BasePopover.Trigger
    ref={ref}
    data-slot="popover-trigger"
    className={cn(
      "inline-flex cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "PopoverTrigger";

/* ----- Portal ----- */
const Portal = BasePopover.Portal;

/* ----- Positioner ----- */
const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BasePopover.Positioner>
>(({ className, ...props }, ref) => (
  <BasePopover.Positioner
    ref={ref}
    data-slot="popover-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "PopoverPositioner";

/* ----- Popup ----- */
const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BasePopover.Popup>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Popup
      ref={ref}
      data-slot="popover-popup"
      className={cn(
        "w-72 origin-[var(--transform-origin)] rounded-md border border-neutral-200 bg-white p-4 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "PopoverPopup";

/* ----- Arrow ----- */
const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BasePopover.Arrow>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Arrow
      ref={ref}
      data-slot="popover-arrow"
      className={cn(
        "data-[side=bottom]:top-[-6px] data-[side=left]:right-[-6px] data-[side=right]:left-[-6px] data-[side=top]:bottom-[-6px]",
        className,
      )}
      {...props}
    />
  ),
);
Arrow.displayName = "PopoverArrow";

/* ----- Title ----- */
const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BasePopover.Title>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Title
      ref={ref}
      data-slot="popover-title"
      className={cn("text-base font-semibold text-neutral-900", className)}
      {...props}
    />
  ),
);
Title.displayName = "PopoverTitle";

/* ----- Description ----- */
const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BasePopover.Description>
>(({ className, ...props }, ref) => (
  <BasePopover.Description
    ref={ref}
    data-slot="popover-description"
    className={cn("mt-1 text-sm text-neutral-500", className)}
    {...props}
  />
));
Description.displayName = "PopoverDescription";

/* ----- Close ----- */
const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BasePopover.Close>>(
  ({ className, ...props }, ref) => (
    <BasePopover.Close
      ref={ref}
      data-slot="popover-close"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-md px-2 py-1 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900",
        className,
      )}
      {...props}
    />
  ),
);
Close.displayName = "PopoverClose";

export const Popover = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Title,
  Description,
  Close,
};
