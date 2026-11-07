import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseScrollArea.Root>>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Root
      ref={ref}
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  ),
);
Root.displayName = "ScrollArea.Root";

const Viewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseScrollArea.Viewport>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Viewport
    ref={ref}
    data-slot="scroll-area-viewport"
    className={cn("h-full w-full overscroll-contain", className)}
    {...props}
  />
));
Viewport.displayName = "ScrollArea.Viewport";

const Scrollbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseScrollArea.Scrollbar>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Scrollbar
    ref={ref}
    data-slot="scroll-area-scrollbar"
    className={cn(
      "flex touch-none select-none p-0.5 transition-opacity data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col",
      className,
    )}
    {...props}
  />
));
Scrollbar.displayName = "ScrollArea.Scrollbar";

const Thumb = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseScrollArea.Thumb>>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Thumb
      ref={ref}
      data-slot="scroll-area-thumb"
      className={cn(
        "relative flex-1 rounded-full bg-neutral-300 transition-colors hover:bg-neutral-400",
        className,
      )}
      {...props}
    />
  ),
);
Thumb.displayName = "ScrollArea.Thumb";

const Corner = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseScrollArea.Corner>>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Corner
      ref={ref}
      data-slot="scroll-area-corner"
      className={cn("bg-neutral-200", className)}
      {...props}
    />
  ),
);
Corner.displayName = "ScrollArea.Corner";

const Content = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseScrollArea.Content>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Content
    ref={ref}
    data-slot="scroll-area-content"
    className={cn(className)}
    {...props}
  />
));
Content.displayName = "ScrollArea.Content";

export const ScrollArea = {
  Root,
  Viewport,
  Scrollbar,
  Thumb,
  Corner,
  Content,
};
