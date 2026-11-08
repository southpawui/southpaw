import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Textarea
 * ============================================================ */

export interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  /** Auto-resize to fit content. Uses CSS field-sizing: content. */
  autosize?: boolean;
  /** CSS resize behavior. Default: "vertical". Ignored when autosize is true. */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** Show valid/success state — green border + checkmark */
  valid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autosize, resize = "vertical", valid, rows, ...props }, ref) => {
    return (
      <div
        data-slot="textarea-group"
        className={cn(
          "relative flex",
          !autosize &&
            { none: "", vertical: "resize-y", horizontal: "resize-x", both: "resize" }[resize],
          "overflow-hidden",
          "bg-surface-base w-full rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
          "border-border-control border-2",
          "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
          "hover:has-[:not(:disabled,:read-only)]:border-fg-muted",
          "has-[:focus-visible]:sp-focus-ring",
          "has-[[data-invalid]]:!border-danger",
          valid && "!border-success",
          "has-[:disabled]:bg-surface-sunken has-[:disabled]:opacity-[var(--sp-state-disabled-opacity)]",
          "has-[textarea:read-only]:bg-surface-sunken has-[textarea:read-only]:border-border-default",
          className,
        )}
      >
        <BaseField.Control
          ref={ref}
          render={<textarea />}
          data-slot="textarea"
          rows={rows ?? 3}
          className={cn(
            "text-fg-default placeholder:text-fg-muted w-full bg-transparent text-sm outline-none",
            "px-3 py-2 [[data-density=comfortable]_&]:px-4 [[data-density=comfortable]_&]:py-3 [[data-density=compact]_&]:px-2 [[data-density=compact]_&]:py-1.5",
            "disabled:cursor-not-allowed",
            autosize ? "[field-sizing:content]" : "",
            "resize-none",
            !autosize &&
              "min-h-20 [[data-density=comfortable]_&]:min-h-24 [[data-density=compact]_&]:min-h-16",
          )}
          {...props}
        />
        {valid && (
          <span
            data-slot="textarea-valid"
            className={cn(
              "text-success pointer-events-none absolute",
              "right-3 top-2.5 [[data-density=comfortable]_&]:right-4 [[data-density=comfortable]_&]:top-3 [[data-density=compact]_&]:right-2 [[data-density=compact]_&]:top-2",
            )}
          >
            <CheckIcon className="h-4 w-4" />
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
