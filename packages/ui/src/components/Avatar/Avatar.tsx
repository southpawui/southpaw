import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface AvatarRootProps extends React.ComponentProps<typeof BaseAvatar.Root> {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Shape variant */
  shape?: "circle" | "square";
  /** User's name — shown as native tooltip on hover. Will upgrade to Tooltip component in Wave 4. */
  name?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

const Root = React.forwardRef<HTMLSpanElement, AvatarRootProps>(
  ({ className, size = "md", shape = "circle", name, ...props }, ref) => (
    <BaseAvatar.Root
      ref={ref}
      data-slot="avatar"
      data-size={size}
      data-shape={shape}
      title={name}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        "bg-surface-alternate",
        shape === "circle" && "rounded-full",
        shape === "square" && "rounded-lg",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Avatar.Root";

/* ============================================================
 * Image
 * ============================================================ */

const Image = React.forwardRef<HTMLImageElement, React.ComponentProps<typeof BaseAvatar.Image>>(
  ({ className, ...props }, ref) => (
    <BaseAvatar.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn(
        "pointer-events-none h-full w-full select-none rounded-[inherit] object-cover",
        className,
      )}
      draggable={false}
      {...props}
    />
  ),
);
Image.displayName = "Avatar.Image";

/* ============================================================
 * Fallback
 * ============================================================ */

const Fallback = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseAvatar.Fallback>
>(({ className, ...props }, ref) => (
  <BaseAvatar.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "text-fg-muted flex h-full w-full select-none items-center justify-center rounded-[inherit] font-medium",
      className,
    )}
    {...props}
  />
));
Fallback.displayName = "Avatar.Fallback";

/* ============================================================
 * Status (online/offline/busy indicator)
 * ============================================================ */

export interface AvatarStatusProps extends React.ComponentPropsWithRef<"span"> {
  /** Status type */
  status: "online" | "offline" | "busy" | "away";
}

const statusColours: Record<string, string> = {
  online: "bg-success",
  offline: "bg-fg-muted",
  busy: "bg-danger",
  away: "bg-[oklch(0.75_0.15_85)]",
};

const Status = React.forwardRef<HTMLSpanElement, AvatarStatusProps>(
  ({ className, status, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="avatar-status"
      data-status={status}
      className={cn(
        "ring-surface-base absolute bottom-0 right-0 block rounded-full ring-2",
        // Size scales with parent avatar via data-size
        "[[data-size=sm]_&]:h-2 [[data-size=sm]_&]:w-2",
        "[[data-size=md]_&]:h-2.5 [[data-size=md]_&]:w-2.5",
        "[[data-size=lg]_&]:h-3.5 [[data-size=lg]_&]:w-3.5",
        statusColours[status],
        className,
      )}
      role="img"
      aria-label={`Status: ${status}`}
      {...props}
    />
  ),
);
Status.displayName = "Avatar.Status";

/* ============================================================
 * Group (overlapping stack)
 * ============================================================ */

export interface AvatarGroupProps extends React.ComponentPropsWithRef<"div"> {
  /** Maximum visible avatars. Extra shows as "+N" counter. */
  max?: number;
}

const Group = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visible = max ? childArray.slice(0, max) : childArray;
    const overflow = max ? childArray.length - max : 0;

    return (
      <div
        ref={ref}
        data-slot="avatar-group"
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visible.map((child, i) => (
          <div
            key={i}
            className={cn(
              "ring-surface-base relative rounded-full ring-2",
              "transition-[transform,z-index] duration-[var(--sp-duration-press)] ease-[var(--sp-easing-default)]",
              "origin-center hover:z-20 hover:scale-110",
            )}
          >
            {child}
          </div>
        ))}
        {overflow > 0 && (
          <span
            data-slot="avatar-overflow"
            className={cn(
              "ring-surface-base bg-surface-alternate text-fg-muted relative inline-flex cursor-default select-none items-center justify-center rounded-full ring-2",
              "h-10 w-10 text-xs font-medium",
              "transition-[transform,z-index] duration-[var(--sp-duration-press)] ease-[var(--sp-easing-default)]",
              "origin-center hover:z-20 hover:scale-110",
            )}
          >
            +{overflow}
          </span>
        )}
      </div>
    );
  },
);
Group.displayName = "Avatar.Group";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Avatar = { Root, Image, Fallback, Status, Group };
