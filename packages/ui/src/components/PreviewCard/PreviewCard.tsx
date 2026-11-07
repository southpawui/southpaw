import * as React from "react";
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = BasePreviewCard.Root;

/* ----- Trigger ----- */
const Trigger = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof BasePreviewCard.Trigger>
>(({ className, ...props }, ref) => (
  <BasePreviewCard.Trigger
    ref={ref}
    data-slot="preview-card-trigger"
    className={cn(
      "text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "PreviewCardTrigger";

/* ----- Portal ----- */
const Portal = BasePreviewCard.Portal;

/* ----- Positioner ----- */
const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BasePreviewCard.Positioner>
>(({ className, ...props }, ref) => (
  <BasePreviewCard.Positioner
    ref={ref}
    data-slot="preview-card-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "PreviewCardPositioner";

/* ----- Popup ----- */
const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BasePreviewCard.Popup>>(
  ({ className, ...props }, ref) => (
    <BasePreviewCard.Popup
      ref={ref}
      data-slot="preview-card-popup"
      className={cn(
        "w-64 origin-[var(--transform-origin)] rounded-md border border-neutral-200 bg-white p-4 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "PreviewCardPopup";

/* ----- Arrow ----- */
const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BasePreviewCard.Arrow>>(
  ({ className, ...props }, ref) => (
    <BasePreviewCard.Arrow
      ref={ref}
      data-slot="preview-card-arrow"
      className={cn(
        "data-[side=bottom]:top-[-6px] data-[side=left]:right-[-6px] data-[side=right]:left-[-6px] data-[side=top]:bottom-[-6px]",
        className,
      )}
      {...props}
    />
  ),
);
Arrow.displayName = "PreviewCardArrow";

export const PreviewCard = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
};
