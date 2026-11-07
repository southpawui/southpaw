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
const Portal = BaseToast.Portal;

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
        "border-border-default bg-surface-overlay flex w-full items-start gap-3 rounded-[var(--radius-DEFAULT)] border p-4 shadow-lg",
        // Productive motion (fast entrance)
        "transition-[opacity,transform] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
        "data-[ending-style]:translate-x-full data-[ending-style]:opacity-0",
        "data-[starting-style]:translate-x-full data-[starting-style]:opacity-0",
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
      className={cn("text-fg-default text-sm font-semibold", className)}
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
    className={cn("text-fg-muted text-sm", className)}
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
        "text-fg-muted inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "hover:text-fg-default focus-visible:sp-focus-ring",
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
        "border-border-control text-fg-default inline-flex h-[var(--sp-control-height-sm)] items-center justify-center rounded-[var(--radius-DEFAULT)] border bg-transparent px-3 text-sm font-medium",
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "focus-visible:sp-focus-ring hover:bg-[var(--sp-state-hover)]",
        className,
      )}
      {...props}
    />
  ),
);
Action.displayName = "Toast.Action";

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
