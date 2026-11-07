import * as React from "react";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseToolbar.Root>>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Root
      ref={ref}
      data-slot="toolbar"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-1",
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Toolbar.Root";

const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseToolbar.Group>>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Group
      ref={ref}
      data-slot="toolbar-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  ),
);
Group.displayName = "Toolbar.Group";

const Button = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseToolbar.Button>>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Button
      ref={ref}
      data-slot="toolbar-button"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-neutral-900 data-[pressed]:text-white",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Toolbar.Button";

const Link = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof BaseToolbar.Link>>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Link
      ref={ref}
      data-slot="toolbar-link"
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    />
  ),
);
Link.displayName = "Toolbar.Link";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof BaseToolbar.Input>>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Input
      ref={ref}
      data-slot="toolbar-input"
      className={cn(
        "h-8 rounded-md border border-neutral-300 bg-transparent px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Toolbar.Input";

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToolbar.Separator>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Separator
    ref={ref}
    data-slot="toolbar-separator"
    className={cn("mx-1 h-6 w-px shrink-0 bg-neutral-200", className)}
    {...props}
  />
));
Separator.displayName = "Toolbar.Separator";

export const Toolbar = {
  Root,
  Group,
  Button,
  Link,
  Input,
  Separator,
};
