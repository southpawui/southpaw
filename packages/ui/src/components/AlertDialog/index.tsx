import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "../../lib/cn";

const Root = BaseAlertDialog.Root;

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAlertDialog.Trigger>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Trigger
    ref={ref}
    data-slot="alert-dialog-trigger"
    className={cn(
      "inline-flex cursor-pointer items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "AlertDialog.Trigger";

const Portal = BaseAlertDialog.Portal;

const Backdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAlertDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Backdrop
    ref={ref}
    data-slot="alert-dialog-backdrop"
    className={cn(
      "fixed inset-0 bg-black/50 transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
      className,
    )}
    {...props}
  />
));
Backdrop.displayName = "AlertDialog.Backdrop";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAlertDialog.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseAlertDialog.Popup
      ref={ref}
      data-slot="alert-dialog-popup"
      className={cn(
        "fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg transition-all data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "AlertDialog.Popup";

const Title = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseAlertDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn("text-lg font-semibold text-neutral-900", className)}
    {...props}
  />
));
Title.displayName = "AlertDialog.Title";

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseAlertDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn("mt-2 text-sm text-neutral-600", className)}
    {...props}
  />
));
Description.displayName = "AlertDialog.Description";

const Close = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    data-slot="alert-dialog-close"
    className={cn(
      "inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
      className,
    )}
    {...props}
  />
));
Close.displayName = "AlertDialog.Close";

export const AlertDialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Title,
  Description,
  Close,
};
