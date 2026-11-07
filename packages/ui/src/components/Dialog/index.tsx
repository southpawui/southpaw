import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "../../lib/cn";

const Root = BaseDialog.Root;
const Portal = BaseDialog.Portal;

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Trigger>
>(({ className, ...props }, ref) => (
  <BaseDialog.Trigger ref={ref} data-slot="dialog-trigger" className={cn(className)} {...props} />
));
Trigger.displayName = "Dialog.Trigger";

const Backdrop = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDialog.Backdrop>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Backdrop
      ref={ref}
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 bg-black/50",
        // Expressive motion
        "transition-opacity duration-[var(--sp-duration-entrance)] ease-[var(--sp-easing-expressive)]",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
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
        // Position
        "fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        // Surface
        "bg-surface-overlay rounded-[var(--radius-lg)] p-6 shadow-lg",
        // Expressive motion
        "transition-[opacity,transform] duration-[var(--sp-duration-entrance)] ease-[var(--sp-easing-expressive)]",
        "data-[ending-style]:scale-[var(--sp-scale-enter)] data-[ending-style]:opacity-0",
        "data-[starting-style]:scale-[var(--sp-scale-enter)] data-[starting-style]:opacity-0",
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
      className={cn("text-fg-default text-lg font-semibold", className)}
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
    className={cn("text-fg-muted mt-2 text-sm", className)}
    {...props}
  />
));
Description.displayName = "Dialog.Description";

const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseDialog.Close>>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Close ref={ref} data-slot="dialog-close" className={cn(className)} {...props} />
  ),
);
Close.displayName = "Dialog.Close";

export const Dialog = { Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close };
