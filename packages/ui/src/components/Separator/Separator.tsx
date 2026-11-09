import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "../../lib/cn";

/* ============================================================
 * Separator
 * ============================================================ */

export interface SeparatorProps extends React.ComponentProps<typeof BaseSeparator> {
  /** Optional label text on the separator (e.g. "OR", "Section 2") */
  label?: string;
  /** Label position along the separator line */
  labelPosition?: "start" | "center" | "end";
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, label, labelPosition = "center", ...props }, ref) => {
    if (label) {
      const isVertical = props.orientation === "vertical";
      const lineClass = isVertical ? "w-px" : "h-px";

      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          data-slot="separator"
          role="separator"
          aria-orientation={props.orientation ?? "horizontal"}
          className={cn("flex items-center gap-3", isVertical && "flex-col", className)}
        >
          <span
            className={cn(
              "bg-border-default shrink-0",
              lineClass,
              labelPosition === "start" ? (isVertical ? "h-4" : "w-4") : "flex-1",
            )}
          />
          <span className="text-fg-muted shrink-0 text-xs font-medium">{label}</span>
          <span
            className={cn(
              "bg-border-default shrink-0",
              lineClass,
              labelPosition === "end" ? (isVertical ? "h-4" : "w-4") : "flex-1",
            )}
          />
        </div>
      );
    }

    return (
      <BaseSeparator
        ref={ref}
        data-slot="separator"
        className={cn(
          "bg-border-default shrink-0",
          "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";
