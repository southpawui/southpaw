import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "../../lib/cn";

const Root = BaseDialog.Root;

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Trigger>
>(({ className, ...props }, ref) => (
  <BaseDialog.Trigger
    ref={ref}
    data-slot="dialog-trigger"
    className={cn(
      "inline-flex cursor-pointer items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "Dialog.Trigger";

const Portal = BaseDialog.Portal;

const Backdrop = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDialog.Backdrop>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Backdrop
      ref={ref}
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 bg-black/50 transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Backdrop.displayName = "Dialog.Backdrop";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDialog.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Popup
      ref={ref}
      data-slot="dialog-popup"
      className={cn(
        "fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg transition-all data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Dialog.Popup";

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BaseDialog.Title>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("text-lg font-semibold text-neutral-900", className)}
      {...props}
    />
  ),
);
Title.displayName = "Dialog.Title";

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("mt-2 text-sm text-neutral-600", className)}
    {...props}
  />
));
Description.displayName = "Dialog.Description";

const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseDialog.Close>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Close
      ref={ref}
      data-slot="dialog-close"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
Close.displayName = "Dialog.Close";

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Title,
  Description,
  Close,
};
