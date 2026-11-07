import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "../../lib/cn";

export interface AvatarRootProps extends React.ComponentProps<typeof BaseAvatar.Root> {
  size?: "sm" | "md" | "lg";
}

const Root = React.forwardRef<HTMLSpanElement, AvatarRootProps>(
  ({ className, size = "md", ...props }, ref) => (
    <BaseAvatar.Root
      ref={ref}
      data-slot="avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200",
        size === "sm" && "h-8 w-8 text-xs",
        size === "md" && "h-10 w-10 text-sm",
        size === "lg" && "h-14 w-14 text-base",
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Avatar.Root";

const Image = React.forwardRef<HTMLImageElement, React.ComponentProps<typeof BaseAvatar.Image>>(
  ({ className, ...props }, ref) => (
    <BaseAvatar.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  ),
);
Image.displayName = "Avatar.Image";

const Fallback = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseAvatar.Fallback>
>(({ className, ...props }, ref) => (
  <BaseAvatar.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "flex h-full w-full items-center justify-center font-medium text-neutral-600",
      className,
    )}
    {...props}
  />
));
Fallback.displayName = "Avatar.Fallback";

export const Avatar = { Root, Image, Fallback };
