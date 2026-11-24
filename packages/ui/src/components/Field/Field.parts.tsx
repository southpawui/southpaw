"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { FormFieldContext } from "../Form/context";

/**
 * Whether the nearest Field.Root was given `invalid` (e.g. app or server validation). Base UI's
 * Field.Error only renders for real constraint validity or `match`, so a Root `invalid` alone
 * gave a red field with no message (GEO-957). Field.Error reads this to default `match`.
 */
const FieldInvalidContext = React.createContext(false);

/* ----- Root ----- */
interface FieldRootProps extends React.ComponentProps<typeof BaseField.Root> {
  /** Layout orientation. Horizontal stacks vertically on mobile automatically. */
  orientation?: "vertical" | "horizontal";
}

const Root = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, orientation: orientationProp, ...props }, ref) => {
    // GEO-935: inside a Form, the Form's layout is the default; the Field's own prop wins
    const formDefaults = React.useContext(FormFieldContext);
    const orientation = orientationProp ?? formDefaults?.orientation ?? "vertical";
    return (
      <FieldInvalidContext.Provider value={Boolean(props.invalid)}>
        <BaseField.Root
          ref={ref}
          data-slot="field"
          data-orientation={orientation}
          className={mergeClassName(
            cn(
              "flex gap-1.5",
              orientation === "vertical" && "w-full flex-col",
              orientation === "horizontal" && "flex-col sm:flex-row sm:items-start sm:gap-4",
            ),
            className,
          )}
          {...props}
        />
      </FieldInvalidContext.Provider>
    );
  },
);
Root.displayName = "Field.Root";

/* ----- Content (groups control + description in horizontal layout) ----- */
const Content = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-content"
      className={mergeClassName(cn("flex flex-1 flex-col gap-1.5"), className)}
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
  ({ className, required, optional, children, ...props }, ref) => {
    // GEO-935 (approved shared change): inside a Form, the Form's `necessity` decides the
    // marking. "optional": "(optional)" text and no asterisk (GOV.UK); "required": "(required)"
    // text; "none": nothing. Outside a Form, the asterisk and "(Optional)" stay as before.
    const form = React.useContext(FormFieldContext);
    const formText = !form
      ? null
      : form.necessity === "optional" && optional
        ? form.labels.optional
        : form.necessity === "required" && required
          ? form.labels.required
          : null;

    let marking: React.ReactNode = null;
    if (form) {
      // Part of the label, so screen readers hear it too (GOV.UK). A real space, so the name
      // reads "Nickname (optional)", not "Nickname(optional)".
      marking = formText ? (
        <>
          {" "}
          <span data-slot="field-necessity" className="text-fg-muted font-normal">
            {formText}
          </span>
        </>
      ) : null;
    } else if (required) {
      marking = (
        <span className="text-danger ml-0.5" aria-hidden="true">
          *
        </span>
      );
    } else if (optional) {
      marking = (
        <span className="text-fg-muted ml-1 text-xs font-normal" aria-hidden="true">
          (Optional)
        </span>
      );
    }

    return (
      <BaseField.Label
        ref={ref}
        data-slot="field-label"
        data-necessity={form?.necessity}
        className={mergeClassName(
          cn(
            "text-fg-default text-sm font-medium",
            // Dim with its control when the field is disabled (Base UI sets data-disabled from
            // Field.Root, Field.Item, or an ancestor Fieldset / disabled ButtonGroup).
            "data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
            // In horizontal layout on sm+: centred on the control, or level with a leading
            // description (GEO-935)
            "[[data-orientation=horizontal]:has(>[data-slot=field-content]>[data-slot=field-description]:first-child)>&]:sm:mt-0 [[data-orientation=horizontal]>&]:sm:mt-2.5 [[data-orientation=horizontal]>&]:sm:w-[var(--sp-field-label-width,8rem)] [[data-orientation=horizontal]>&]:sm:shrink-0",
          ),
          className,
        )}
        {...props}
      >
        {children}
        {marking}
      </BaseField.Label>
    );
  },
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
    className={mergeClassName(cn("text-fg-muted text-sm"), className)}
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

const Error = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, hideIcon = false, errors, children, match: matchProp, ...props }, ref) => {
    // Determine content: errors array takes precedence over children
    const hasMultiple = errors && errors.length > 1;
    const singleError = errors?.[0] ?? children;
    // GEO-957: a Root `invalid` (app/server validation) shows the message. An explicit `match`
    // and Base UI's constraint-validity behaviour are unchanged; an empty Error stays hidden.
    const rootInvalid = React.useContext(FieldInvalidContext);
    const hasContent = Boolean(errors?.length) || (children != null && children !== false);
    const match = matchProp ?? (rootInvalid && hasContent ? true : undefined);

    const classes = mergeClassName(cn("text-danger flex gap-1.5 text-sm"), className);
    const body = (message: React.ReactNode) => (
      <>
        {!hideIcon && <ErrorIcon />}
        <span>
          <span className="sr-only">Error: </span>
          {message}
        </span>
      </>
    );
    const list = (items: React.ReactNode[]) => (
      <ul className="list-inside list-disc">
        {items.map((error, i) => (
          <li key={i}>{error}</li>
        ))}
      </ul>
    );

    // GEO-935: no message given, so show the field's own. Base UI puts it in the default
    // children (a Form `errors` message first, then the field's `validate` or validity
    // message); the render function wraps it in the same icon and "Error:" layout. Before,
    // a bare <Field.Error /> rendered with no message at all.
    if (!hasContent) {
      return (
        <BaseField.Error
          ref={ref}
          data-slot="field-error"
          className={classes}
          match={match}
          {...props}
          render={(renderProps) => {
            const { children: message, ...rest } = renderProps as React.ComponentProps<"div">;
            return (
              <div {...rest}>
                {body(Array.isArray(message) && message.length > 1 ? list(message) : message)}
              </div>
            );
          }}
        />
      );
    }

    return (
      <BaseField.Error
        ref={ref}
        data-slot="field-error"
        className={classes}
        match={match}
        {...props}
      >
        {body(hasMultiple ? list(errors) : singleError)}
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
      className={mergeClassName(cn("flex items-center gap-3 py-2"), className)}
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
        className={mergeClassName(
          cn("text-xs tabular-nums", isOver ? "text-danger font-medium" : "text-fg-muted"),
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
      className={mergeClassName(
        cn(
          "flex",
          direction === "column" && "flex-col",
          direction === "column" && spacing === "tight" && "gap-3",
          direction === "column" && spacing === "default" && "gap-4",
          direction === "column" && spacing === "loose" && "gap-6",
          direction === "row" && "items-center gap-[var(--sp-control-gap)]",
        ),
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

// Parts for the server-safe namespace in ./Field (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
export {
  Root as FieldRoot,
  Content as FieldContent,
  Label as FieldLabel,
  Description as FieldDescription,
  Error as FieldError,
  CharacterCount as FieldCharacterCount,
  Separator as FieldSeparator,
  Group as FieldGroup,
  Validity as FieldValidity,
  Item as FieldItem,
};
