import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "../../lib/cn";
import { Tooltip } from "../Tooltip/Tooltip";

/* ============================================================
 * Root
 * ============================================================ */

export interface AvatarRootProps extends React.ComponentProps<typeof BaseAvatar.Root> {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Shape variant */
  shape?: "circle" | "square";
  /**
   * The person's name. Becomes the avatar's accessible name and, by default,
   * a Tooltip on hover / touch long-press. Static avatars aren't focusable, so
   * keyboard users get the name from assistive tech, not the tooltip; render the
   * avatar as a link or button (`render`) to make the tooltip keyboard-reachable.
   *
   * When `name` is set, give `Avatar.Image` an empty `alt=""` — otherwise the
   * name is announced twice ("Ada Byron, group, image Ada Byron").
   * A consumer `aria-label` takes precedence as the name; the tooltip then
   * becomes the description.
   */
  name?: string;
  /** Show `name` in a Tooltip. Set `false` to keep only the accessible name. @default true */
  tooltip?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

const Root = React.forwardRef<HTMLSpanElement, AvatarRootProps>(
  (
    {
      className,
      size = "md",
      shape = "circle",
      name,
      tooltip = true,
      children,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    // A named static avatar is a labelled group: the name is announced and the
    // image/status inside stay reachable (role="img" would hide the status dot).
    // A custom `render` (link/button) keeps its own role.
    const namedRole = name && !props.render && !props.role ? "group" : undefined;
    const showTooltip = !!name && tooltip;

    const rootProps = {
      "data-slot": "avatar",
      "data-size": size,
      "data-shape": shape,
      role: namedRole,
      // Without a tooltip the name goes straight onto the element.
      "aria-label": ariaLabel ?? (name && !showTooltip ? name : undefined),
      className: cn(
        "relative inline-flex shrink-0 items-center justify-center",
        "bg-surface-alternate",
        shape === "circle" && "rounded-full",
        shape === "square" && "rounded-lg",
        sizeClasses[size],
        className,
      ),
      ...props,
    };

    if (!showTooltip) {
      return (
        <BaseAvatar.Root
          ref={ref}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          {...rootProps}
        >
          {children}
        </BaseAvatar.Root>
      );
    }

    return (
      // A consumer aria-label stays the name; the tooltip then describes.
      <Tooltip.Root type={ariaLabel ? "description" : "label"}>
        <Tooltip.Trigger
          ref={ref as React.Ref<HTMLButtonElement>}
          // ARIA references go on the trigger so they merge with the tooltip's.
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          render={<BaseAvatar.Root {...rootProps} />}
        >
          {children}
        </Tooltip.Trigger>
        <Tooltip.Content>{name}</Tooltip.Content>
      </Tooltip.Root>
    );
  },
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
    const hidden = max ? childArray.slice(max) : [];
    const overflow = hidden.length;
    // Names of the avatars folded into "+N" (Mantine lists them in a tooltip).
    const hiddenNames = hidden
      .map((child) =>
        React.isValidElement<{ name?: unknown }>(child) && typeof child.props.name === "string"
          ? child.props.name
          : null,
      )
      .filter((n): n is string => !!n);
    const unnamedCount = overflow - hiddenNames.length;

    const overflowClassName = cn(
      "ring-surface-base bg-surface-alternate text-fg-muted relative inline-flex cursor-default select-none items-center justify-center rounded-full ring-2",
      "h-10 w-10 text-xs font-medium",
      "transition-[transform,z-index] duration-[var(--sp-duration-press)] ease-[var(--sp-easing-default)]",
      "origin-center hover:z-20 hover:scale-110",
    );

    return (
      // Shared provider: once one name shows, neighbours open instantly.
      <Tooltip.Provider>
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
          {/*
           * "+N" is named (role="img"), not merely described: screen readers in
           * browse mode don't announce descriptions on static text. With names,
           * the tooltip IS the name ("2 more: Cy, Di") via a visually hidden prefix.
           */}
          {overflow > 0 &&
            (hiddenNames.length > 0 ? (
              <Tooltip.Root type="label">
                <Tooltip.Trigger
                  render={
                    <span role="img" data-slot="avatar-overflow" className={overflowClassName} />
                  }
                >
                  +{overflow}
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <span className="sr-only">{overflow} more: </span>
                  <ul data-slot="avatar-overflow-names" className="flex flex-col">
                    {hiddenNames.map((n, i) => (
                      <li key={i}>
                        {n}
                        {/* Comma for the accessible name only ("2 more: Cy, Di") */}
                        {(i < hiddenNames.length - 1 || unnamedCount > 0) && (
                          <span className="sr-only">,</span>
                        )}
                      </li>
                    ))}
                    {unnamedCount > 0 && <li>{`and ${unnamedCount} more`}</li>}
                  </ul>
                </Tooltip.Content>
              </Tooltip.Root>
            ) : (
              <span
                role="img"
                aria-label={`${overflow} more`}
                data-slot="avatar-overflow"
                className={overflowClassName}
              >
                +{overflow}
              </span>
            ))}
        </div>
      </Tooltip.Provider>
    );
  },
);
Group.displayName = "Avatar.Group";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Avatar = { Root, Image, Fallback, Status, Group };
