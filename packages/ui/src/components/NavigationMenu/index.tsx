import * as React from "react";
import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = React.forwardRef<HTMLElement, React.ComponentProps<typeof BaseNavigationMenu.Root>>(
  ({ className, ...props }, ref) => (
    <BaseNavigationMenu.Root
      ref={ref}
      data-slot="navigation-menu-root"
      className={cn("relative", className)}
      {...props}
    />
  ),
);
Root.displayName = "NavigationMenu.Root";

/* ----- List ----- */
const List = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<typeof BaseNavigationMenu.List>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.List
    ref={ref}
    data-slot="navigation-menu-list"
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
List.displayName = "NavigationMenu.List";

/* ----- Item ----- */
const Item = React.forwardRef<HTMLLIElement, React.ComponentProps<typeof BaseNavigationMenu.Item>>(
  ({ className, ...props }, ref) => (
    <BaseNavigationMenu.Item
      ref={ref}
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  ),
);
Item.displayName = "NavigationMenu.Item";

/* ----- Trigger ----- */
const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseNavigationMenu.Trigger>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Trigger
    ref={ref}
    data-slot="navigation-menu-trigger"
    className={cn(
      "inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 data-[popup-open]:bg-neutral-100",
      className,
    )}
    {...props}
  />
));
Trigger.displayName = "NavigationMenu.Trigger";

/* ----- Content ----- */
const Content = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseNavigationMenu.Content>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Content
    ref={ref}
    data-slot="navigation-menu-content"
    className={cn("p-4", className)}
    {...props}
  />
));
Content.displayName = "NavigationMenu.Content";

/* ----- Popup ----- */
const Popup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseNavigationMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Popup
    ref={ref}
    data-slot="navigation-menu-popup"
    className={cn(
      "origin-[var(--transform-origin)] rounded-md border border-neutral-200 bg-white shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
      className,
    )}
    {...props}
  />
));
Popup.displayName = "NavigationMenu.Popup";

/* ----- Portal ----- */
const Portal = BaseNavigationMenu.Portal;

/* ----- Positioner ----- */
const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseNavigationMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Positioner
    ref={ref}
    data-slot="navigation-menu-positioner"
    className={cn("outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "NavigationMenu.Positioner";

/* ----- Viewport ----- */
const Viewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseNavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Viewport
    ref={ref}
    data-slot="navigation-menu-viewport"
    className={cn("", className)}
    {...props}
  />
));
Viewport.displayName = "NavigationMenu.Viewport";

/* ----- Link ----- */
const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof BaseNavigationMenu.Link>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Link
    ref={ref}
    data-slot="navigation-menu-link"
    className={cn(
      "block rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900",
      className,
    )}
    {...props}
  />
));
Link.displayName = "NavigationMenu.Link";

/* ----- Icon ----- */
const Icon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseNavigationMenu.Icon>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Icon
    ref={ref}
    data-slot="navigation-menu-icon"
    className={cn(
      "inline-block transition-transform duration-200 data-[popup-open]:rotate-180",
      className,
    )}
    {...props}
  />
));
Icon.displayName = "NavigationMenu.Icon";

/* ----- Arrow ----- */
const Arrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseNavigationMenu.Arrow>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Arrow
    ref={ref}
    data-slot="navigation-menu-arrow"
    className={cn(
      "data-[side=bottom]:top-[-6px] data-[side=left]:right-[-6px] data-[side=right]:left-[-6px] data-[side=top]:bottom-[-6px]",
      className,
    )}
    {...props}
  />
));
Arrow.displayName = "NavigationMenu.Arrow";

export const NavigationMenu = {
  Root,
  List,
  Item,
  Trigger,
  Content,
  Popup,
  Portal,
  Positioner,
  Viewport,
  Link,
  Icon,
  Arrow,
};
