import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseField.Root>>(
  ({ className, ...props }, ref) => (
    <BaseField.Root
      ref={ref}
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  ),
);
Root.displayName = "Field.Root";

/* ----- Label ----- */
const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<typeof BaseField.Label>>(
  ({ className, ...props }, ref) => (
    <BaseField.Label
      ref={ref}
      data-slot="field-label"
      className={cn("text-fg-default text-sm font-medium", className)}
      {...props}
    />
  ),
);
Label.displayName = "Field.Label";

/* ----- Description (hint text) ----- */
const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseField.Description>
>(({ className, ...props }, ref) => (
  <BaseField.Description
    ref={ref}
    data-slot="field-description"
    className={cn("text-fg-muted text-sm", className)}
    {...props}
  />
));
Description.displayName = "Field.Description";

/* ----- Error ----- */
/*
 * BRIEF requirement: errors always have an icon and text,
 * with "Error:" prefixed for screen readers.
 */
interface FieldErrorProps extends React.ComponentProps<typeof BaseField.Error> {
  /** Hide the error icon. Default: false */
  hideIcon?: boolean;
}

const Error = React.forwardRef<HTMLSpanElement, FieldErrorProps>(
  ({ className, hideIcon = false, children, ...props }, ref) => (
    <BaseField.Error
      ref={ref}
      data-slot="field-error"
      className={cn("text-danger flex items-center gap-1.5 text-sm", className)}
      {...props}
    >
      {!hideIcon && (
        <svg
          aria-hidden="true"
          data-slot="field-error-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M8 1C4.136 1 1 4.136 1 8s3.136 7 7 7 7-3.136 7-7-3.136-7-7-7Zm0 11a.875.875 0 1 1 0-1.75A.875.875 0 0 1 8 12Zm.875-3.5a.875.875 0 0 1-1.75 0v-3.5a.875.875 0 0 1 1.75 0v3.5Z"
            fill="currentColor"
          />
        </svg>
      )}
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </BaseField.Error>
  ),
);
Error.displayName = "Field.Error";

/* ----- Control ----- */
const Control = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof BaseField.Control>>(
  ({ className, ...props }, ref) => (
    <BaseField.Control
      ref={ref}
      data-slot="field-control"
      className={cn(
        // Base
        "bg-surface-base text-fg-default h-[var(--sp-control-height)] rounded-[var(--radius-DEFAULT)] px-3 text-sm",
        // Border
        "border-border-control border-2",
        // Placeholder
        "placeholder:text-fg-muted",
        // Transition
        "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        // Hover
        "hover:border-fg-muted",
        // Focus
        "focus-visible:sp-focus-ring",
        // Invalid
        "data-[invalid]:border-danger data-[invalid]:focus-visible:ring-danger/20",
        // Disabled
        "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    />
  ),
);
Control.displayName = "Field.Control";

/* ----- Validity (pass-through) ----- */
const Validity = BaseField.Validity;

/* ----- Item (for checkbox/radio within field) ----- */
const Item = BaseField.Item;

export const Field = { Root, Label, Description, Error, Control, Validity, Item };
