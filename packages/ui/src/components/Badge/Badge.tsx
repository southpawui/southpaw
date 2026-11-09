import * as React from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Badge
 * ============================================================ */

export interface BadgeProps extends React.ComponentPropsWithRef<"span"> {
  /** Semantic colour */
  variant?: "default" | "success" | "danger" | "warning" | "info";
  /** Visual style */
  appearance?: "solid" | "outline";
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Leading icon */
  icon?: React.ReactNode;
  /** Callback when dismiss (×) button is clicked. Shows dismiss button when provided. */
  onDismiss?: () => void;
}

const variantSolid: Record<string, string> = {
  default: "bg-surface-alternate text-fg-default",
  success: "bg-success-subtle text-success",
  danger: "bg-danger/10 text-danger",
  warning:
    "bg-[oklch(0.92_0.04_85)] text-[oklch(0.45_0.1_85)] [[data-theme=dark]_&]:bg-[oklch(0.3_0.05_85)] [[data-theme=dark]_&]:text-[oklch(0.8_0.1_85)]",
  info: "bg-brand/10 text-brand",
};

const variantOutline: Record<string, string> = {
  default: "border-border-default text-fg-default",
  success: "border-success text-success",
  danger: "border-danger text-danger",
  warning:
    "border-[oklch(0.7_0.1_85)] text-[oklch(0.45_0.1_85)] [[data-theme=dark]_&]:border-[oklch(0.6_0.1_85)] [[data-theme=dark]_&]:text-[oklch(0.8_0.1_85)]",
  info: "border-brand text-brand",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-[11px] gap-1",
  md: "px-2.5 py-0.5 text-xs gap-1.5",
  lg: "px-3 py-1 text-sm gap-1.5",
};

const iconSizeClasses: Record<string, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      appearance = "solid",
      size = "md",
      icon,
      onDismiss,
      children,
      ...props
    },
    ref,
  ) => (
    <span
      ref={ref}
      data-slot="badge"
      data-variant={variant}
      className={cn(
        // Base
        "inline-flex items-center rounded-full font-medium",
        // Size
        sizeClasses[size],
        // Appearance
        appearance === "solid" && variantSolid[variant],
        appearance === "outline" && `border ${variantOutline[variant]}`,
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          data-slot="badge-icon"
          className={cn("shrink-0", iconSizeClasses[size])}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
      {onDismiss && (
        <button
          type="button"
          data-slot="badge-dismiss"
          className="ml-0.5 shrink-0 cursor-pointer rounded-full opacity-60 transition-opacity hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Dismiss"
        >
          <X weight="bold" className={iconSizeClasses[size]} />
        </button>
      )}
    </span>
  ),
);

Badge.displayName = "Badge";
