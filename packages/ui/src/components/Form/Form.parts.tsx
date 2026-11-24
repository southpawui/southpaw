"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Form as BaseForm } from "@base-ui/react/form";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { Button, type ButtonProps } from "../Button/Button";
import { ErrorSummary } from "../ErrorSummary/ErrorSummary";
// Client to client: the collector is internal to ErrorSummary, not on its server-safe entry
import {
  collectErrors,
  useErrorMessages,
  type ErrorSummaryError,
  type ErrorSummaryRootProps,
} from "../ErrorSummary/ErrorSummary.parts";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import {
  FormFieldContext,
  FormSummaryRegistryContext,
  defaultFormNecessityLabels,
  type FormFieldDefaults,
  type FormNecessity,
  type FormNecessityLabels,
} from "./context";

/* ============================================================
 * Form (GEO-935)
 *
 * Base UI's Form (noValidate, validate on submit then on change, focus the
 * first invalid field) with GOV.UK's error handling built in:
 *
 * - an error summary at the top that takes focus, lists every error and
 *   prefixes the page title ("There is a problem");
 * - server errors by field name (`errors`) and form-level ones (`formErrors`);
 * - `onInvalid(errors)` after a failed submit;
 * - "(optional)" marking instead of asterisks, through Field.Label;
 * - `action` + useActionState, a Submit that shows the pending state, and
 *   `submitting` while an async `onFormSubmit` runs;
 * - form-wide `disabled` (a fieldset cascade), layout, `transformValues`,
 *   an optional Standard Schema, and a warning before leaving with changes.
 * ============================================================ */

type Values = Record<string, unknown>;
/** Base UI's map: a field name to its message(s). */
export type FormErrors = Record<string, string | string[]>;

/** Standard Schema v1 (Zod 3.24+, Valibot, ArkType…), typed locally so no package is needed. */
export interface StandardSchemaV1<Output = unknown> {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (value: unknown) => StandardResult<Output> | Promise<StandardResult<Output>>;
  };
}
type StandardResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | {
      readonly issues: ReadonlyArray<{
        readonly message: string;
        readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
      }>;
    };

export interface FormLabels extends FormNecessityLabels {
  /** The `beforeunload` prompt's text. Browsers show their own wording; some still use this. */
  unsavedChanges: string;
}

const defaultFormLabels: FormLabels = {
  ...defaultFormNecessityLabels,
  unsavedChanges: "You have unsaved changes.",
};

interface FormStateContextValue {
  summaryErrors: ErrorSummaryError[];
  summaryProps: Pick<ErrorSummaryRootProps, "focusTarget" | "updateTitle" | "labels">;
  submitting: boolean;
  formRef: React.RefObject<HTMLFormElement | null>;
}

const FormStateContext = React.createContext<FormStateContextValue | null>(null);

/** The first key of a Standard Schema issue path: the field name. */
function pathName(path: unknown): string | null {
  if (!Array.isArray(path) || path.length === 0) return null;
  const first = path[0] as PropertyKey | { key: PropertyKey };
  const key = typeof first === "object" && first !== null && "key" in first ? first.key : first;
  return key == null ? null : String(key);
}

/** The field name a collected summary entry points at. */
function nameOf(error: ErrorSummaryError, form: HTMLFormElement): string | null {
  const target =
    typeof error.target === "string"
      ? form.ownerDocument.getElementById(error.target)
      : (error.target ?? null);
  if (!target) return null;
  const named =
    target.getAttribute("name") ??
    target
      .closest('[data-slot="field"]')
      ?.querySelector("input[name], textarea[name], select[name]")
      ?.getAttribute("name");
  return named ?? null;
}

const firstMessage = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

/* ============================================================
 * Root
 * ============================================================ */

// `onInvalid` is ours: the form is noValidate, so the native invalid event doesn't apply
export interface FormRootProps extends Omit<
  React.ComponentProps<typeof BaseForm>,
  "onFormSubmit" | "errors" | "onInvalid"
> {
  /**
   * Called with the form's values after it validates (and after `schema`, `transformValues`).
   * Base UI prevents the native submit, so use `action` instead for a server action.
   * Return a Promise to show `submitting` on Form.Submit until it settles.
   */
  onFormSubmit?: (values: Values, details: unknown) => void | Promise<unknown>;
  /** Errors by field `name` (a server, a form library, `useActionState`). Shown inline and in the summary. */
  errors?: FormErrors;
  /** Errors about the whole form, not one field. Listed first in the summary, without a link. */
  formErrors?: React.ReactNode[];
  /** Called with the summary's errors after a submit fails validation. */
  onInvalid?: (errors: ErrorSummaryError[]) => void;
  /**
   * The built-in error summary at the top (GOV.UK). `false` turns it off. Placing
   * `<Form.ErrorSummary />` (or any ErrorSummary) inside the form replaces it.
   */
  errorSummary?: boolean;
  /**
   * What takes focus after a failed submit: `summary` (GOV.UK, default), `auto` (the field
   * when there are fewer than 3 errors, Primer) or `field` (the first invalid field).
   */
  focusTarget?: "summary" | "auto" | "field";
  /** "(optional)" marking (default), "(required)", or none. Applies to every Field.Label inside. */
  necessity?: FormNecessity;
  /**
   * Field layout: `vertical` (default), `horizontal` (label beside the control) or
   * `responsive` (stacked on small screens, beside from `sm`).
   */
  orientation?: "vertical" | "horizontal" | "responsive";
  /** Width of the label column in horizontal layouts (any CSS length). Default 8rem. */
  labelWidth?: string;
  /** Disable every control (a fieldset cascade). */
  disabled?: boolean;
  /** Ask before leaving the page while any field has unsaved changes (`beforeunload`). */
  warnOnUnsavedChanges?: boolean;
  /** Reshape the values before `schema` and `onFormSubmit` (trim, convert, rename). */
  transformValues?: (values: Values) => Values;
  /** A Standard Schema (Zod, Valibot, ArkType…), checked on submit. Its issues show by field name. */
  schema?: StandardSchemaV1;
  /** Translations. */
  labels?: Partial<FormLabels>;
}

const Root = React.forwardRef<HTMLFormElement, FormRootProps>(
  (
    {
      onFormSubmit,
      errors: errorsProp,
      formErrors,
      onInvalid,
      errorSummary = true,
      focusTarget = "summary",
      necessity = "optional",
      orientation = "vertical",
      labelWidth,
      disabled,
      warnOnUnsavedChanges = false,
      transformValues,
      schema,
      labels: labelsProp,
      className,
      style,
      children,
      onReset,
      action,
      ...props
    },
    forwardedRef,
  ) => {
    const labels = { ...defaultFormLabels, ...labelsProp };
    const formRef = React.useRef<HTMLFormElement | null>(null);
    const setRef = React.useCallback(
      (el: HTMLFormElement | null) => {
        formRef.current = el;
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
      },
      [forwardedRef],
    );
    const messages = useErrorMessages();

    /* ----- Errors: props, schema issues, and what the fields show ----- */
    const [schemaErrors, setSchemaErrors] = React.useState<FormErrors>({});
    const errors = React.useMemo(
      () => ({ ...schemaErrors, ...errorsProp }),
      [schemaErrors, errorsProp],
    );
    const [summaryErrors, setSummaryErrors] = React.useState<ErrorSummaryError[]>([]);

    const formErrorsRef = React.useRef(formErrors);
    formErrorsRef.current = formErrors;
    const errorsRef = React.useRef(errors);
    errorsRef.current = errors;
    const onInvalidRef = React.useRef(onInvalid);
    onInvalidRef.current = onInvalid;

    /** Read the invalid fields (ErrorSummary's own collector), then apply named messages. */
    const buildSummary = React.useCallback((): ErrorSummaryError[] => {
      const form = formRef.current;
      if (!form) return [];
      const named = errorsRef.current;
      const seen = new Set<string>();
      const fields = collectErrors(form, messages).map((error) => {
        const name = nameOf(error, form);
        if (name) seen.add(name);
        // A named error's own wording beats a template (when the field has no Field.Error)
        return name && named[name] != null
          ? { ...error, name, message: firstMessage(named[name]!) ?? error.message }
          : error;
      });
      // Named errors whose field isn't on the page still get listed (linked by name)
      const missing = Object.entries(named)
        .filter(([name]) => !seen.has(name))
        .map(([name, value]) => ({ name, message: firstMessage(value) }));
      const formLevel = (formErrorsRef.current ?? []).map((message) => ({ message }));
      return [...formLevel, ...fields, ...missing];
    }, [messages]);

    // Errors set from outside (server, schema, formErrors): show them once the fields have
    // rendered as invalid.
    // `errors` by content (an inline object is new every render); `formErrors` by identity,
    // since its items can be any node (a new array with the same length still re-reads).
    const errorsKey = JSON.stringify(errors);
    React.useEffect(() => {
      const id = window.setTimeout(() => setSummaryErrors(buildSummary()));
      return () => window.clearTimeout(id);
    }, [errorsKey, formErrors, buildSummary]);

    // A failed client-side submit: Base UI validates, focuses the first invalid field and never
    // calls onFormSubmit. Read the result after it has rendered (on the document, so it runs
    // after React's own submit handling).
    React.useEffect(() => {
      let timer: number | undefined;
      const onSubmit = (event: Event) => {
        if (event.target !== formRef.current) return;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          const next = buildSummary();
          setSummaryErrors(next);
          const fieldErrors = next.filter((e) => e.target != null || e.name != null);
          if (fieldErrors.length) onInvalidRef.current?.(next);
        });
      };
      document.addEventListener("submit", onSubmit);
      return () => {
        window.clearTimeout(timer);
        document.removeEventListener("submit", onSubmit);
      };
    }, [buildSummary]);

    /* ----- Submit: transform, schema, then the consumer ----- */
    const [submitting, setSubmitting] = React.useState(false);
    const dirtySinceSubmit = React.useRef(false);

    const handleFormSubmit = async (values: Values, details: unknown) => {
      const transformed = transformValues ? transformValues(values) : values;
      if (schema) {
        const result = await schema["~standard"].validate(transformed);
        if (result.issues) {
          const next: FormErrors = {};
          for (const issue of result.issues) {
            const name = pathName(issue.path);
            if (name && next[name] == null) next[name] = issue.message;
          }
          setSchemaErrors(next);
          onInvalidRef.current?.(
            Object.entries(next).map(([name, message]) => ({
              name,
              message: firstMessage(message),
            })),
          );
          return;
        }
      }
      setSchemaErrors({});
      setSummaryErrors(buildSummaryWithoutFields());
      dirtySinceSubmit.current = false;
      const result = onFormSubmit?.(transformed, details);
      if (result && typeof (result as Promise<unknown>).then === "function") {
        setSubmitting(true);
        try {
          await result;
        } finally {
          setSubmitting(false);
        }
      }
    };
    // After a valid submit only form-level errors can remain
    const buildSummaryWithoutFields = () =>
      (formErrorsRef.current ?? []).map((message) => ({ message }));

    const handleReset: React.FormEventHandler<HTMLFormElement> = (event) => {
      onReset?.(event as Parameters<NonNullable<typeof onReset>>[0]);
      setSchemaErrors({});
      setSummaryErrors([]);
      dirtySinceSubmit.current = false;
    };

    /* ----- Unsaved changes ----- */
    React.useEffect(() => {
      if (!warnOnUnsavedChanges) return;
      const form = formRef.current;
      if (!form) return;
      const onInput = () => {
        dirtySinceSubmit.current = true;
      };
      const onBeforeUnload = (event: BeforeUnloadEvent) => {
        if (!dirtySinceSubmit.current) return;
        if (!form.querySelector('[data-slot="field"][data-dirty], [data-dirty]')) return;
        event.preventDefault();
        // Older browsers show this string; current ones use their own wording
        event.returnValue = labels.unsavedChanges;
      };
      form.addEventListener("input", onInput);
      form.addEventListener("change", onInput);
      window.addEventListener("beforeunload", onBeforeUnload);
      return () => {
        form.removeEventListener("input", onInput);
        form.removeEventListener("change", onInput);
        window.removeEventListener("beforeunload", onBeforeUnload);
      };
    }, [warnOnUnsavedChanges, labels.unsavedChanges]);

    /* ----- Where the summary goes ----- */
    const [placedSummaries, setPlacedSummaries] = React.useState(0);
    const register = React.useCallback(() => {
      setPlacedSummaries((n) => n + 1);
      return () => setPlacedSummaries((n) => n - 1);
    }, []);
    const showBuiltIn = errorSummary && placedSummaries === 0;

    const fieldDefaults = React.useMemo<FormFieldDefaults>(
      () => ({
        necessity,
        labels: { optional: labels.optional, required: labels.required },
        orientation: orientation === "vertical" ? "vertical" : "horizontal",
      }),
      [necessity, labels.optional, labels.required, orientation],
    );
    const summaryProps = React.useMemo<FormStateContextValue["summaryProps"]>(
      () => ({ focusTarget: focusTarget === "field" ? "none" : focusTarget }),
      [focusTarget],
    );
    const stateCtx = React.useMemo<FormStateContextValue>(
      () => ({ summaryErrors, summaryProps, submitting, formRef }),
      [summaryErrors, summaryProps, submitting],
    );

    // Server actions keep the native submit: Base UI's onFormSubmit would prevent it.
    const usesAction = action != null;

    return (
      <BaseForm
        ref={setRef}
        data-slot="form"
        data-orientation={orientation}
        data-submitting={submitting ? "" : undefined}
        aria-busy={submitting || undefined}
        errors={errors}
        action={action}
        onFormSubmit={
          usesAction
            ? undefined
            : (handleFormSubmit as React.ComponentProps<typeof BaseForm>["onFormSubmit"])
        }
        onReset={handleReset}
        style={labelWidth ? { ...style, ["--sp-field-label-width" as string]: labelWidth } : style}
        className={mergeClassName(
          cn(
            "flex w-full min-w-0 flex-col gap-[calc(var(--sp-control-gap)*3)]",
            // Horizontal: the label beside the control at every width (Field's own horizontal
            // layout stacks below sm, which is what `responsive` keeps)
            orientation === "horizontal" &&
              "[&_[data-slot=field][data-orientation=horizontal]:has(>[data-slot=field-content]>[data-slot=field-description]:first-child)>[data-slot=field-label]]:mt-0 [&_[data-slot=field][data-orientation=horizontal]>[data-slot=field-label]]:mt-2.5 [&_[data-slot=field][data-orientation=horizontal]>[data-slot=field-label]]:w-[var(--sp-field-label-width,8rem)] [&_[data-slot=field][data-orientation=horizontal]>[data-slot=field-label]]:shrink-0 [&_[data-slot=field][data-orientation=horizontal]]:flex-row [&_[data-slot=field][data-orientation=horizontal]]:items-start [&_[data-slot=field][data-orientation=horizontal]]:gap-4",
          ),
          className,
        )}
        {...props}
      >
        <FormStateContext.Provider value={stateCtx}>
          {showBuiltIn ? <FormErrorSummary /> : null}
          {/* Form-wide `disabled`: a fieldset disables every native control inside, and Base UI's
              Fieldset context reaches its own controls. `contents` keeps it out of the layout. */}
          <BaseFieldset.Root disabled={disabled} data-slot="form-fieldset" className="contents">
            <FormSummaryRegistryContext.Provider value={register}>
              <FormFieldContext.Provider value={fieldDefaults}>
                {children}
              </FormFieldContext.Provider>
            </FormSummaryRegistryContext.Provider>
          </BaseFieldset.Root>
        </FormStateContext.Provider>
      </BaseForm>
    );
  },
);
Root.displayName = "Form.Root";

/* ============================================================
 * ErrorSummary: the Form's summary, placed where you put it
 * ============================================================ */

export type FormErrorSummaryProps = Omit<ErrorSummaryRootProps, "errors" | "form">;

const FormErrorSummary = React.forwardRef<HTMLDivElement, FormErrorSummaryProps>((props, ref) => {
  const state = React.useContext(FormStateContext);
  if (!state) {
    throw new Error("Form.ErrorSummary must be inside Form.Root.");
  }
  return (
    <ErrorSummary.Root
      ref={ref}
      data-form-summary=""
      errors={state.summaryErrors}
      form={state.formRef}
      {...state.summaryProps}
      {...props}
    />
  );
});
FormErrorSummary.displayName = "Form.ErrorSummary";

/* ============================================================
 * Submit
 * ============================================================ */

export interface FormSubmitProps extends ButtonProps {
  /** Shown (and so announced) while pending, e.g. "Saving" for a "Save" button. Default: its own label. */
  pendingLabel?: string;
}

/**
 * The form's call to action: a brand button that shows the pending state of a server
 * `action` (useFormStatus) or an async `onFormSubmit`. Render it inside the form.
 */
const Submit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  (
    {
      variant = "solid",
      color = "brand",
      loading,
      pendingLabel,
      label,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { pending } = useFormStatus();
    const state = React.useContext(FormStateContext);
    const busy = Boolean(loading) || pending || Boolean(state?.submitting);
    // While busy, `pendingLabel` replaces the visible text, so what's shown is the name
    // (WCAG 2.5.3 Label in Name: a voice user saying "click Saving" reaches it). aria-busy stays.
    const showPending = busy && pendingLabel != null;
    return (
      <Button
        ref={ref}
        type="submit"
        data-slot="form-submit"
        variant={variant}
        color={color}
        loading={busy}
        label={showPending ? pendingLabel : label}
        // Full width on small screens, its own width from sm (GOV.UK)
        className={mergeClassName("w-full sm:w-auto sm:self-start", className)}
        {...props}
      >
        {showPending ? undefined : children}
      </Button>
    );
  },
);
Submit.displayName = "Form.Submit";

export { Root as FormRoot, FormErrorSummary, Submit as FormSubmit };
export type { ErrorSummaryError as FormError };
