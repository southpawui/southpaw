import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ----- Root ----- */
interface FieldRootProps extends React.ComponentProps<typeof BaseField.Root> {
  /** Layout orientation. Horizontal stacks vertically on mobile automatically. */
  orientation?: "vertical" | "horizontal";
}

const Root = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <BaseField.Root
      ref={ref}
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "flex gap-1.5",
        orientation === "vertical" && "w-full flex-col",
        orientation === "horizontal" && "flex-col sm:flex-row sm:items-start sm:gap-4",
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Field.Root";

/* ----- Content (groups control + description in horizontal layout) ----- */
const Content = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1.5", className)}
      {...props}
    />
  ),
);
Content.displayName = "Field.Content";

/* ----- Label ----- */
interface FieldLabelProps extends React.ComponentProps<typeof BaseField.Label> {
  /** Show a required indicator (*) after the label */
  required?: boolean;
  /** Show an "(Optional)" indicator after the label. Use when most fields are required — mark the minority. */
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, required, optional, children, ...props }, ref) => (
    <BaseField.Label
      ref={ref}
      data-slot="field-label"
      className={cn(
        "text-fg-default text-sm font-medium",
        // In horizontal layout, align with control height on sm+
        "[[data-orientation=horizontal]>&]:sm:mt-2.5 [[data-orientation=horizontal]>&]:sm:w-[var(--sp-field-label-width,8rem)] [[data-orientation=horizontal]>&]:sm:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger ml-0.5" aria-hidden="true">
          *
        </span>
      )}
      {optional && !required && (
        <span className="text-fg-muted ml-1 text-xs font-normal" aria-hidden="true">
          (Optional)
        </span>
      )}
    </BaseField.Label>
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
 *
 * Accepts children OR an errors array (for form library integration):
 *   <Field.Error errors={["Too short", "Must contain a number"]} />
 *   <Field.Error>Please enter a valid email.</Field.Error>
 */
interface FieldErrorProps extends React.ComponentProps<typeof BaseField.Error> {
  /** Hide the error icon. Default: false */
  hideIcon?: boolean;
  /** Array of error messages (from form libraries like react-hook-form, Zod, etc.) */
  errors?: string[];
}

const ErrorIcon = () => (
  <WarningCircle
    aria-hidden="true"
    data-slot="field-error-icon"
    weight="fill"
    className="mt-0.5 h-4 w-4 shrink-0"
  />
);

const Error = React.forwardRef<HTMLSpanElement, FieldErrorProps>(
  ({ className, hideIcon = false, errors, children, ...props }, ref) => {
    // Determine content: errors array takes precedence over children
    const hasMultiple = errors && errors.length > 1;
    const singleError = errors?.[0] ?? children;

    return (
      <BaseField.Error
        ref={ref}
        data-slot="field-error"
        className={cn("text-danger flex gap-1.5 text-sm", className)}
        {...props}
      >
        {!hideIcon && <ErrorIcon />}
        <span>
          <span className="sr-only">Error: </span>
          {hasMultiple ? (
            <ul className="list-inside list-disc">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          ) : (
            singleError
          )}
        </span>
      </BaseField.Error>
    );
  },
);
Error.displayName = "Field.Error";

/* ----- Separator ----- */
interface FieldSeparatorProps extends React.ComponentPropsWithRef<"div"> {
  /** Optional inline text for the separator */
  label?: string;
}

const Separator = React.forwardRef<HTMLDivElement, FieldSeparatorProps>(
  ({ className, label, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-separator"
      className={cn("flex items-center gap-3 py-2", className)}
      {...props}
    >
      <div className="bg-border-default h-px flex-1" />
      {label && (
        <span className="text-fg-muted text-xs font-medium uppercase tracking-wide">{label}</span>
      )}
      <div className="bg-border-default h-px flex-1" />
    </div>
  ),
);
Separator.displayName = "Field.Separator";

/* ----- Character Count ----- */
interface FieldCharacterCountProps extends React.ComponentPropsWithRef<"span"> {
  /** Current character count */
  current: number;
  /** Maximum allowed characters */
  max: number;
}

const CharacterCount = React.forwardRef<HTMLSpanElement, FieldCharacterCountProps>(
  ({ className, current, max, ...props }, ref) => {
    const isOver = current > max;
    return (
      <span
        ref={ref}
        data-slot="field-character-count"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "text-xs tabular-nums",
          isOver ? "text-danger font-medium" : "text-fg-muted",
          className,
        )}
        {...props}
      >
        {current}/{max}
      </span>
    );
  },
);
CharacterCount.displayName = "Field.CharacterCount";

/* ----- Group ----- */
interface FieldGroupProps extends React.ComponentPropsWithRef<"div"> {
  /** Layout direction. "row" for inline checkbox/radio + label. "column" for stacking fields. */
  direction?: "row" | "column";
  /** Spacing between items (column direction only). */
  spacing?: "tight" | "default" | "loose";
}

const Group = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, direction = "column", spacing = "default", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-group"
      role="group"
      className={cn(
        "flex",
        direction === "column" && "flex-col",
        direction === "column" && spacing === "tight" && "gap-3",
        direction === "column" && spacing === "default" && "gap-4",
        direction === "column" && spacing === "loose" && "gap-6",
        direction === "row" && "items-start gap-2",
        className,
      )}
      {...props}
    />
  ),
);
Group.displayName = "Field.Group";

/* ----- Validity (pass-through) ----- */
const Validity = BaseField.Validity;

/* ----- Item (for checkbox/radio within field) ----- */
const Item = BaseField.Item;

export const Field = {
  Root,
  Content,
  Label,
  Description,
  Error,
  CharacterCount,
  Separator,
  Group,
  Validity,
  Item,
};
