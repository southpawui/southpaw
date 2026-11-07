import * as React from "react";
import { cn } from "../../lib/cn";

export interface BadgeProps extends React.ComponentPropsWithRef<"span"> {
  variant?: "default" | "success" | "danger" | "warning" | "info";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      data-slot="badge"
      className={cn(
        // Base
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        // Variants
        variant === "default" && "bg-surface-alternate text-fg-default",
        variant === "success" && "bg-success-subtle text-success",
        variant === "danger" && "bg-danger/10 text-danger",
        variant === "warning" && "bg-[#FFF3CD] text-[#856404]",
        variant === "info" && "bg-brand/10 text-brand",
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";
