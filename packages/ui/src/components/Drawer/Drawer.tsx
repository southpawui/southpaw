import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cn } from "../../lib/cn";

const Root = BaseDrawer.Root;

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDrawer.Trigger>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Trigger
    ref={ref}
    data-slot="drawer-trigger"
    className={cn(
      "inline-flex cursor-pointer items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "Drawer.Trigger";

const Portal = BaseDrawer.Portal;

const Backdrop = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDrawer.Backdrop>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Backdrop
      ref={ref}
      data-slot="drawer-backdrop"
      className={cn(
        "fixed inset-0 bg-black/50 transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
Backdrop.displayName = "Drawer.Backdrop";

const Popup = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDrawer.Popup>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Popup
      ref={ref}
      data-slot="drawer-popup"
      className={cn(
        "fixed bottom-0 right-0 top-0 w-full max-w-sm bg-white shadow-lg transition-all data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
        className,
      )}
      {...props}
    />
  ),
);
Popup.displayName = "Drawer.Popup";

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BaseDrawer.Title>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Title
      ref={ref}
      data-slot="drawer-title"
      className={cn("text-lg font-semibold text-neutral-900", className)}
      {...props}
    />
  ),
);
Title.displayName = "Drawer.Title";

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseDrawer.Description>
>(({ className, ...props }, ref) => (
  <BaseDrawer.Description
    ref={ref}
    data-slot="drawer-description"
    className={cn("mt-2 text-sm text-neutral-600", className)}
    {...props}
  />
));
Description.displayName = "Drawer.Description";

const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseDrawer.Close>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Close
      ref={ref}
      data-slot="drawer-close"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
Close.displayName = "Drawer.Close";

const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDrawer.Content>>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Content
      ref={ref}
      data-slot="drawer-content"
      className={cn("flex h-full flex-col p-6", className)}
      {...props}
    />
  ),
);
Content.displayName = "Drawer.Content";

export const Drawer = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Title,
  Description,
  Close,
  Content,
};
