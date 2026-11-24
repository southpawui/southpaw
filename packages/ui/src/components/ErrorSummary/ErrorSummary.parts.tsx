"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { Link } from "../Link/Link";
import {
  getErrorMessage,
  lowerFirst,
  useErrorMessages,
  type ErrorMessageContext,
  type ErrorMessages,
} from "./error-messages";
import { FormSummaryRegistryContext } from "../Form/context";

export {
  defaultErrorMessages,
  ErrorMessagesProvider,
  getErrorMessage,
  getValidityKey,
  useErrorMessages,
  type ErrorMessageContext,
  type ErrorMessages,
  type ValidityKey,
} from "./error-messages";

/* ============================================================
 * Error Summary (GOV.UK pattern, GEO-887)
 *
 * Shown at the top of a form after a failed submit. It takes focus,
 * lists every error as a link that moves focus to its field, and puts
 * "Error: (2 errors) " at the start of the page title.
 *
 * Two ways to feed it:
 * - `errors`: a list you control (server errors, a form library). This is
 *   what Form (GEO-935) will use.
 * - Collect mode (no `errors`): it listens for the form's submit and reads
 *   the invalid fields, their labels and their Field.Error text. Base UI's
 *   Form never calls onSubmit while a field is invalid, so this is how a
 *   plain Base UI form gets a summary.
 * ============================================================ */

export interface ErrorSummaryError {
  /** What went wrong. Use the same wording as next to the field. */
  message: React.ReactNode;
  /**
   * The field to link to: an element id, or the element. Radio and checkbox
   * groups link to their first option. Leave out for an error with no field
   * (it shows as plain text).
   */
  target?: string | HTMLElement | null;
  /** The field's `name`, looked up in the form when there is no `target`. */
  name?: string;
}

export interface ErrorSummaryLabels {
  /** Heading. */
  title: string;
  /** Put before the page title while the summary shows. */
  titlePrefix: string;
  /** The error count in the page title, after the prefix. */
  titleCount: (count: number) => string;
}

export const errorSummaryDefaultLabels: ErrorSummaryLabels = {
  title: "There is a problem",
  titlePrefix: "Error: ",
  titleCount: (count) => `(${count} ${count === 1 ? "error" : "errors"}) `,
};

interface ErrorSummaryContextValue {
  errors: ErrorSummaryError[];
  labels: ErrorSummaryLabels;
  titleId: string;
  focusError: (error: Pick<ErrorSummaryError, "target" | "name">) => void;
  hrefFor: (error: Pick<ErrorSummaryError, "target" | "name">) => string | undefined;
}

const ErrorSummaryContext = React.createContext<ErrorSummaryContextValue | null>(null);

function useErrorSummary(part: string) {
  const ctx = React.useContext(ErrorSummaryContext);
  if (!ctx) throw new Error(`[Southpaw] <${part}> must be used inside <ErrorSummary.Root>.`);
  return ctx;
}

/* ============================================================
 * Root
 * ============================================================ */

export interface ErrorSummaryRootProps extends Omit<
  React.ComponentPropsWithRef<"div">,
  "title" | "children"
> {
  /** Errors to show. Leave out to collect them from the form on submit. */
  errors?: ErrorSummaryError[];
  /**
   * The form to collect from (collect mode), and to look up `name`s in: its id,
   * the element, or a ref. Defaults to the form the summary sits in.
   */
  form?: string | HTMLFormElement | React.RefObject<HTMLFormElement | null> | null;
  /**
   * What gets focus when errors appear: `summary` (GOV.UK, default); `auto`,
   * which focuses the first field instead when there are fewer than 3 errors
   * (Primer); or `none` (GOV.UK `disableAutoFocus`).
   */
  focusTarget?: "summary" | "auto" | "none";
  /** Put "Error: (n errors) " before the page title while shown. Default `true`. */
  updateTitle?: boolean;
  /** Replace built-in strings (translation). */
  labels?: Partial<ErrorSummaryLabels>;
  /** Override the default per-validation messages used in collect mode. */
  messages?: Partial<ErrorMessages>;
  /** Shorthand for a Title part. Defaults to `labels.title`. */
  title?: React.ReactNode;
  /** Shorthand for a Description part. */
  description?: React.ReactNode;
  /** Called with the collected errors after each submit (collect mode). */
  onErrorsChange?: (errors: ErrorSummaryError[]) => void;
  /** Custom anatomy. Defaults to Title, Description and List. */
  children?: React.ReactNode;
}

const Root = React.forwardRef<HTMLDivElement, ErrorSummaryRootProps>(
  (
    {
      errors: errorsProp,
      form,
      focusTarget = "summary",
      updateTitle = true,
      labels: labelsProp,
      messages: messagesProp,
      title,
      description,
      onErrorsChange,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const labels = React.useMemo(
      () => ({ ...errorSummaryDefaultLabels, ...labelsProp }),
      [labelsProp],
    );
    const messages = useErrorMessages(messagesProp);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const ref = useMergedRef(forwardedRef, rootRef);
    const titleId = React.useId();

    // Inside a Form (GEO-935): tell it a summary is placed, so it skips its built-in one
    const registerWithForm = React.useContext(FormSummaryRegistryContext);
    React.useEffect(() => registerWithForm?.(), [registerWithForm]);

    const [collected, setCollected] = React.useState<ErrorSummaryError[]>([]);
    const collecting = errorsProp === undefined;
    const errors = collecting ? collected : errorsProp;
    const visible = errors.length > 0;

    const getForm = React.useCallback((): HTMLFormElement | null => {
      if (form == null) return rootRef.current?.closest("form") ?? null;
      if (typeof form === "string") {
        if (typeof document === "undefined") return null;
        const el = document.getElementById(form);
        return el instanceof HTMLFormElement ? el : null;
      }
      if (form instanceof HTMLFormElement) return form;
      return form.current;
    }, [form]);

    const resolve = React.useCallback(
      (error: Pick<ErrorSummaryError, "target" | "name">) => resolveTarget(error, getForm()),
      [getForm],
    );

    /* ---------- Focus: each new set of errors takes focus once ---------- */

    // Collect mode bumps this per failed submit; controlled mode when the
    // content of `errors` changes (not on every new array).
    const [focusRequest, setFocusRequest] = React.useState(0);
    const errorsKey = collecting ? null : keyOf(errorsProp);
    const lastKey = React.useRef<string | null>(null);
    React.useEffect(() => {
      if (errorsKey == null || errorsKey === lastKey.current) return;
      lastKey.current = errorsKey;
      if (errorsKey !== "") setFocusRequest((n) => n + 1);
    }, [errorsKey]);

    const focusError = React.useCallback(
      (error: Pick<ErrorSummaryError, "target" | "name">) => {
        const control = resolve(error);
        if (control) focusField(control);
      },
      [resolve],
    );

    React.useEffect(() => {
      if (!focusRequest || focusTarget === "none" || errors.length === 0) return;
      // After Base UI has focused the first invalid field
      const id = window.setTimeout(() => {
        if (focusTarget === "auto" && errors.length < 3 && resolve(errors[0]!)) {
          focusError(errors[0]!);
        } else if (rootRef.current) {
          focusSummary(rootRef.current);
        }
      });
      return () => window.clearTimeout(id);
    }, [focusRequest]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ---------- Collect mode ---------- */

    const messagesRef = React.useRef(messages);
    messagesRef.current = messages;
    const onErrorsChangeRef = React.useRef(onErrorsChange);
    onErrorsChangeRef.current = onErrorsChange;

    React.useEffect(() => {
      if (!collecting) return;
      let timer: number | undefined;
      const onSubmit = (event: Event) => {
        const formEl = getForm();
        if (!formEl || event.target !== formEl) return;
        // Base UI validates during the submit; read the result once it has rendered
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          const next = collectErrors(formEl, messagesRef.current);
          setCollected(next);
          onErrorsChangeRef.current?.(next);
          if (next.length) setFocusRequest((n) => n + 1);
        });
      };
      const onReset = (event: Event) => {
        if (event.target !== getForm()) return;
        window.clearTimeout(timer);
        setCollected([]);
        onErrorsChangeRef.current?.([]);
      };
      // On the document, so it runs after React's own submit handling
      document.addEventListener("submit", onSubmit);
      document.addEventListener("reset", onReset);
      return () => {
        window.clearTimeout(timer);
        document.removeEventListener("submit", onSubmit);
        document.removeEventListener("reset", onReset);
      };
    }, [collecting, getForm]);

    /* ---------- Page title ---------- */

    // Shared across summaries: one prefix, the total count, one restore
    const labelsRef = React.useRef(labels);
    labelsRef.current = labels;
    const count = errors.length;
    React.useEffect(() => {
      if (!updateTitle || !visible) return;
      const owner = { count, labels: labelsRef };
      titleOwners.add(owner);
      syncTitle();
      return () => {
        titleOwners.delete(owner);
        syncTitle();
      };
    }, [updateTitle, visible, count, labels.titlePrefix]);

    // The temporary tabindex goes when the summary hides, even without a blur
    React.useEffect(() => {
      if (!visible) clearTemporaryTabindex(rootRef.current);
    }, [visible]);

    const hrefFor = React.useCallback(
      (error: Pick<ErrorSummaryError, "target" | "name">) => {
        const el = resolve(error);
        if (el?.id) return `#${el.id}`;
        return typeof error.target === "string" ? `#${error.target}` : undefined;
      },
      [resolve],
    );
    const ctx: ErrorSummaryContextValue = { errors, labels, titleId, focusError, hrefFor };

    return (
      <ErrorSummaryContext.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="error-summary"
          hidden={!visible}
          className={mergeClassName(
            cn(
              "border-danger bg-surface-base text-fg-default rounded-md border border-s-4",
              "p-[calc(var(--sp-control-gap)*2)] outline-none",
              // Focus moves here by script after a click, which :focus-visible misses
              "focus:sp-focus-ring",
            ),
            className,
          )}
          {...props}
        >
          {/* role="alert" on an inner wrapper, not the focused element (GOV.UK, JAWS) */}
          {visible && (
            <div role="alert" className="flex flex-col gap-[var(--sp-control-gap)]">
              {children ?? (
                <>
                  <Title>{title}</Title>
                  {description != null && <Description>{description}</Description>}
                  <List />
                </>
              )}
            </div>
          )}
        </div>
      </ErrorSummaryContext.Provider>
    );
  },
);
Root.displayName = "ErrorSummary.Root";

/* ============================================================
 * Title, Description
 * ============================================================ */

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithRef<"h2">>(
  ({ className, children, ...props }, ref) => {
    const ctx = useErrorSummary("ErrorSummary.Title");
    return (
      <h2
        ref={ref}
        id={ctx.titleId}
        data-slot="error-summary-title"
        className={mergeClassName(
          cn("text-fg-default flex items-start gap-2 text-base font-semibold"),
          className,
        )}
        {...props}
      >
        <WarningCircle
          aria-hidden="true"
          weight="fill"
          className="text-danger mt-0.5 size-5 shrink-0"
        />
        <span>{children ?? ctx.labels.title}</span>
      </h2>
    );
  },
);
Title.displayName = "ErrorSummary.Title";

const Description = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="error-summary-description"
      className={mergeClassName(cn("text-fg-default ps-7 text-sm"), className)}
      {...props}
    />
  ),
);
Description.displayName = "ErrorSummary.Description";

/* ============================================================
 * List, Item
 * ============================================================ */

export interface ErrorSummaryListProps extends Omit<React.ComponentPropsWithRef<"ul">, "children"> {
  /** Render each error. Defaults to an Item per error. */
  children?: React.ReactNode | ((error: ErrorSummaryError, index: number) => React.ReactNode);
}

const List = React.forwardRef<HTMLUListElement, ErrorSummaryListProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useErrorSummary("ErrorSummary.List");
    const content =
      typeof children === "function" || children === undefined
        ? ctx.errors.map((error, index) =>
            typeof children === "function" ? (
              children(error, index)
            ) : (
              <Item key={index} target={error.target} name={error.name}>
                {error.message}
              </Item>
            ),
          )
        : children;
    return (
      <ul
        ref={ref}
        data-slot="error-summary-list"
        className={mergeClassName(cn("flex flex-col gap-1 ps-7 text-sm"), className)}
        {...props}
      >
        {content}
      </ul>
    );
  },
);
List.displayName = "ErrorSummary.List";

export interface ErrorSummaryItemProps extends Omit<React.ComponentPropsWithRef<"li">, "children"> {
  /** The field to link to: an element id, or the element. */
  target?: string | HTMLElement | null;
  /** The field's `name`, looked up in the form when there is no `target`. */
  name?: string;
  /** Replace the link element, e.g. with a router link. */
  render?: useRender.RenderProp;
  children?: React.ReactNode;
}

const Item = React.forwardRef<HTMLLIElement, ErrorSummaryItemProps>(
  ({ target, name, render, className, children, ...props }, ref) => {
    const ctx = useErrorSummary("ErrorSummary.Item");
    const linked = target != null || name != null;
    // Resolved after mount: the DOM isn't there during render (or on the server)
    const [href, setHref] = React.useState<string | undefined>(
      typeof target === "string" ? `#${target}` : undefined,
    );
    const { hrefFor, errors } = ctx;
    React.useEffect(() => {
      if (linked) setHref(hrefFor({ target, name }));
    }, [linked, target, name, hrefFor, errors]);
    return (
      <li
        ref={ref}
        data-slot="error-summary-item"
        className={mergeClassName("text-danger font-medium", className)}
        {...props}
      >
        {linked ? (
          // Link in the danger text colour. Hash links: no visited colour, no print URL.
          <Link
            href={href ?? "#"}
            variant="inherit"
            visited={false}
            printUrl={false}
            render={render}
            data-slot="error-summary-link"
            onClick={(event) => {
              // GOV.UK: scroll the label or legend into view, then focus the field
              event.preventDefault();
              ctx.focusError({ target, name });
            }}
          >
            {children}
          </Link>
        ) : (
          children
        )}
      </li>
    );
  },
);
Item.displayName = "ErrorSummary.Item";

/* ============================================================
 * Focus and scrolling
 * ============================================================ */

/** Focus the summary with a temporary tabindex (removed on blur, GOV.UK). */
function focusSummary(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.setAttribute("data-temporary-tabindex", "");
    el.addEventListener("blur", () => clearTemporaryTabindex(el), { once: true });
  }
  el.focus();
}

function clearTemporaryTabindex(el: HTMLElement | null) {
  if (!el?.hasAttribute("data-temporary-tabindex")) return;
  el.removeAttribute("tabindex");
  el.removeAttribute("data-temporary-tabindex");
}

/* ---------- Page title (shared by every summary on the page) ---------- */

const titleOwners = new Set<{
  count: number;
  labels: React.MutableRefObject<ErrorSummaryLabels>;
}>();
const titleState: { base: string | null; written: string | null } = { base: null, written: null };

function syncTitle() {
  // The app changed the title while errors showed: that becomes the base
  if (titleState.written != null && document.title !== titleState.written) {
    titleState.base = document.title;
  }
  if (titleOwners.size === 0) {
    if (titleState.base != null) document.title = titleState.base;
    titleState.base = titleState.written = null;
    return;
  }
  titleState.base ??= document.title;
  const total = [...titleOwners].reduce((sum, o) => sum + o.count, 0);
  const labels = [...titleOwners][0]!.labels.current;
  titleState.written = `${labels.titlePrefix}${labels.titleCount(total)}${titleState.base}`;
  document.title = titleState.written;
}

const FOCUSABLE =
  'input:not([type="hidden"]):not([disabled]):not([aria-hidden="true"]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [role="radio"], [role="checkbox"], [role="combobox"], [role="switch"], [tabindex]:not([tabindex="-1"])';

/** The element an error points at, made focusable (a group links to its first option). */
function resolveTarget(
  error: Pick<ErrorSummaryError, "target" | "name">,
  form: HTMLFormElement | null,
): HTMLElement | null {
  let el: Element | null = null;
  if (typeof error.target === "string") el = document.getElementById(error.target);
  else if (error.target) el = error.target;
  else if (error.name && form) {
    const named = form.elements.namedItem(error.name);
    el = named instanceof RadioNodeList ? ((named[0] as Element | undefined) ?? null) : named;
  }
  // Base UI keeps the value in a hidden native input (aria-hidden, or
  // type=hidden) next to the visible control: use the control
  if (
    el instanceof HTMLInputElement &&
    (el.type === "hidden" || el.getAttribute("aria-hidden") === "true")
  ) {
    const scope = el.closest('[data-slot="field"]') ?? el.parentElement;
    el = scope?.querySelector(FOCUSABLE) ?? el;
  }
  if (!(el instanceof HTMLElement)) return null;
  if (el.matches(FOCUSABLE)) return el;
  return el.querySelector<HTMLElement>(FOCUSABLE) ?? el;
}

function isChoice(el: Element) {
  const role = el.getAttribute("role");
  return (
    role === "radio" ||
    role === "checkbox" ||
    (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox"))
  );
}

/**
 * GOV.UK's link behaviour: scroll the question into view, not just the
 * input, then focus without scrolling again. A fieldset's legend wins for
 * radios and checkboxes, and for other fields when it is within half a
 * viewport above them.
 */
function focusField(control: HTMLElement) {
  const legend = control.closest("fieldset")?.querySelector("legend") ?? null;
  let anchor: Element | null = null;
  if (legend) {
    if (isChoice(control)) anchor = legend;
    else {
      const legendTop = legend.getBoundingClientRect().top;
      const controlBottom = control.getBoundingClientRect().bottom;
      if (controlBottom - legendTop < window.innerHeight / 2) anchor = legend;
    }
  }
  anchor ??= labelOf(control);
  (anchor ?? control).scrollIntoView?.();
  control.focus({ preventScroll: true });
}

function labelOf(control: HTMLElement): HTMLElement | null {
  if (control.id) {
    const byFor = document.querySelector<HTMLElement>(`label[for="${cssEscape(control.id)}"]`);
    if (byFor) return byFor;
  }
  const labelledBy = control.getAttribute("aria-labelledby")?.split(/\s+/)[0];
  if (labelledBy) {
    const el = document.getElementById(labelledBy);
    if (el) return el;
  }
  return (
    control.closest("label") ??
    control
      .closest('[data-slot="field"]')
      ?.querySelector<HTMLElement>('[data-slot="field-label"]') ??
    null
  );
}

/* ============================================================
 * Collect mode: read the invalid fields from the DOM
 * ============================================================ */

let generatedId = 0;

/**
 * Read a form's invalid fields as summary errors (collect mode). Exported for Form
 * (GEO-935), which feeds its built-in summary from the same reading.
 */
export function collectErrors(form: HTMLFormElement, messages: ErrorMessages): ErrorSummaryError[] {
  // A Field root marks itself invalid; controls outside a Field mark aria-invalid
  const fields = Array.from(
    form.querySelectorAll<HTMLElement>('[data-slot="field"][data-invalid]'),
  );
  const loose = Array.from(form.querySelectorAll<HTMLElement>('[aria-invalid="true"]')).filter(
    (el) => !el.closest('[data-slot="field"][data-invalid]'),
  );
  const nodes = [...fields, ...loose].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );

  const errors: ErrorSummaryError[] = [];
  for (const node of nodes) {
    const isField = node.matches('[data-slot="field"]');
    const invalidControl = isField
      ? node.querySelector<HTMLElement>('[aria-invalid="true"]')
      : node;
    const control =
      (invalidControl && resolveTarget({ target: invalidControl }, form)) ??
      node.querySelector<HTMLElement>(FOCUSABLE);
    if (control && !control.id) control.id = `sp-error-summary-field-${++generatedId}`;

    // Same wording as next to the field: use the Field.Error text when there is one
    const inline = isField ? node.querySelector('[data-slot="field-error"]') : null;
    const inlineText = inline ? visibleText(inline) : "";
    const message = inlineText || templateMessage(node, control, messages);
    if (message) errors.push({ message, target: control?.id ?? null });
  }
  return errors;
}

function templateMessage(node: HTMLElement, control: HTMLElement | null, messages: ErrorMessages) {
  // The native input carries the constraints (Base UI uses a hidden one for
  // radios, checkboxes and selects)
  const native =
    (control && isNative(control) ? control : null) ??
    node.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "input, textarea, select",
    );
  // A field with no label still gets reported, never silently dropped
  const label =
    labelText(node, control) ||
    control?.getAttribute("placeholder") ||
    native?.getAttribute("placeholder") ||
    "an answer";
  const ctx = contextFor(label, node, control, native);
  if (!native) return messages.invalid(ctx);
  return getErrorMessage(native.validity, ctx, messages) ?? messages.invalid(ctx);
}

function isNative(el: Element): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  );
}

function contextFor(
  label: string,
  node: HTMLElement,
  control: HTMLElement | null,
  native: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
): ErrorMessageContext {
  const type = native instanceof HTMLInputElement ? native.type : undefined;
  // A Combobox picks from a list ("Select …"); Autocomplete is typed
  const picks = !!node.querySelector('[data-slot="combobox-input"]');
  const typed =
    !picks &&
    (control instanceof HTMLTextAreaElement ||
      (control instanceof HTMLInputElement &&
        !["radio", "checkbox", "file", "hidden"].includes(control.type)));
  const kind: ErrorMessageContext["kind"] = type === "file" ? "file" : typed ? "text" : "choice";
  const attr = (name: string) => native?.getAttribute(name) ?? undefined;
  const num = (name: string) => {
    const value = attr(name);
    return value != null ? Number(value) : undefined;
  };
  return {
    label,
    lowerLabel: lowerFirst(label),
    kind,
    type: typed ? (control as HTMLInputElement).type : type,
    minLength: num("minlength"),
    maxLength: num("maxlength"),
    min: attr("min"),
    max: attr("max"),
    step: attr("step"),
    pattern: attr("pattern"),
  };
}

function labelText(node: HTMLElement, control: HTMLElement | null) {
  const fieldLabel = node.matches('[data-slot="field"]')
    ? node.querySelector('[data-slot="field-label"]')
    : null;
  const label = fieldLabel ?? (control ? labelOf(control) : null);
  if (label) return visibleText(label);
  return control?.getAttribute("aria-label") ?? "";
}

/** Text a sighted user reads: no aria-hidden marks, no visually hidden prefixes. */
function visibleText(el: Element) {
  const clone = el.cloneNode(true) as Element;
  // VisuallyHidden's `focusable` mode has no bare .sr-only class, so match its slot too
  clone
    .querySelectorAll('[aria-hidden="true"], .sr-only, [data-slot="visually-hidden"]')
    .forEach((n) => n.remove());
  return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

/* ============================================================
 * Utils
 * ============================================================ */

function keyOf(errors: ErrorSummaryError[]) {
  return errors
    .map((e) =>
      [
        nodeText(e.message),
        typeof e.target === "string" ? e.target : e.target ? elementKey(e.target) : "",
        e.name ?? "",
      ].join("|"),
    )
    .join("\n");
}

/** Text of a message, including JSX (so a changed translation counts as new). */
function nodeText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return nodeText(node.props.children);
  }
  return "";
}

const elementKeys = new WeakMap<HTMLElement, string>();
let elementKeyCount = 0;
function elementKey(el: HTMLElement) {
  if (el.id) return `#${el.id}`;
  let key = elementKeys.get(el);
  if (!key) elementKeys.set(el, (key = `@${++elementKeyCount}`));
  return key;
}

function cssEscape(value: string) {
  return typeof CSS !== "undefined" && CSS.escape ? CSS.escape(value) : value.replace(/"/g, '\\"');
}

function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
  return React.useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (typeof ref === "function") ref(value);
        else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
      }
    },
    refs, // eslint-disable-line react-hooks/exhaustive-deps
  );
}

// Parts for the server-safe namespace in ./ErrorSummary (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
export {
  Root as ErrorSummaryRoot,
  Title as ErrorSummaryTitle,
  Description as ErrorSummaryDescription,
  List as ErrorSummaryList,
  Item as ErrorSummaryItem,
};
