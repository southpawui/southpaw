import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLLIElement, React.ComponentProps<typeof BaseToast.Root>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Root ref={ref} data-slot="toast" className={cn(className)} {...props} />
  ),
);
Root.displayName = "Toast.Root";

const Provider = BaseToast.Provider;

const Viewport = React.forwardRef<
  HTMLOListElement,
  React.ComponentProps<typeof BaseToast.Viewport>
>(({ className, ...props }, ref) => (
  <BaseToast.Viewport
    ref={ref}
    data-slot="toast-viewport"
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-md",
      className,
    )}
    {...props}
  />
));
Viewport.displayName = "Toast.Viewport";

const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseToast.Content>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Content
      ref={ref}
      data-slot="toast-content"
      className={cn(
        "flex w-full items-start gap-3 rounded-md border border-neutral-200 bg-white p-4 shadow-lg",
        className,
      )}
      {...props}
    />
  ),
);
Content.displayName = "Toast.Content";

const Title = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseToast.Title>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Title
      ref={ref}
      data-slot="toast-title"
      className={cn("text-sm font-semibold text-neutral-900", className)}
      {...props}
    />
  ),
);
Title.displayName = "Toast.Title";

const Description = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToast.Description>
>(({ className, ...props }, ref) => (
  <BaseToast.Description
    ref={ref}
    data-slot="toast-description"
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  />
));
Description.displayName = "Toast.Description";

const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseToast.Close>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Close
      ref={ref}
      data-slot="toast-close"
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    />
  ),
);
Close.displayName = "Toast.Close";

const Action = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseToast.Action>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Action
      ref={ref}
      data-slot="toast-action"
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md border border-neutral-300 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    />
  ),
);
Action.displayName = "Toast.Action";

const Portal = BaseToast.Portal;

export const Toast = {
  Root,
  Provider,
  Viewport,
  Content,
  Title,
  Description,
  Close,
  Action,
  Portal,
  useToastManager: BaseToast.useToastManager,
};
