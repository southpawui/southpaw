import * as React from "react";

/* ============================================================
 * Default error messages per validation type
 *
 * GOV.UK wording (design-system.service.gov.uk/patterns/validation):
 * an instruction for empty fields ("Enter …", "Select …"), a description
 * for everything else. No "please", "sorry", "valid" or "invalid".
 * Keyed by the browser's ValidityState flags, which Base UI's Field uses.
 * Override per summary (`messages`) or app-wide (ErrorMessagesProvider),
 * e.g. to translate.
 * ============================================================ */

/** What a message template knows about the field. */
export interface ErrorMessageContext {
  /** The field's label, as written ("Full name"). */
  label: string;
  /** The label for use mid-sentence ("full name"). Acronyms keep their case. */
  lowerLabel: string;
  /**
   * `text` for typed input, `choice` for radios, checkboxes, selects and
   * switches (they take "Select …"), `file` for file inputs.
   */
  kind: "text" | "choice" | "file";
  /** The input's `type` (`email`, `number`, `date`…), when there is one. */
  type?: string;
  minLength?: number;
  maxLength?: number;
  min?: string;
  max?: string;
  step?: string;
  pattern?: string;
}

export type ValidityKey =
  | "valueMissing"
  | "typeMismatch"
  | "patternMismatch"
  | "tooShort"
  | "tooLong"
  | "rangeUnderflow"
  | "rangeOverflow"
  | "stepMismatch"
  | "badInput";

export type ErrorMessages = Record<ValidityKey, (ctx: ErrorMessageContext) => string> & {
  /** Any other failure (custom validation without a message). */
  invalid: (ctx: ErrorMessageContext) => string;
};

const isDate = (type?: string) =>
  type === "date" || type === "datetime-local" || type === "month" || type === "week";
const isTime = (type?: string) => type === "time";

/** "2026-01-01" → "1 January 2026" (GOV.UK date style, in the user's locale). */
function formatDate(value: string | undefined, type?: string) {
  if (!value || type !== "date") return value;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export const defaultErrorMessages: ErrorMessages = {
  valueMissing: ({ lowerLabel, kind }) =>
    kind === "text" ? `Enter ${lowerLabel}` : `Select ${lowerLabel}`,
  typeMismatch: ({ lowerLabel, type }) => {
    if (type === "email")
      return "Enter an email address in the correct format, like name@example.com";
    if (type === "url")
      return "Enter a web address in the correct format, like https://example.com";
    return `Enter ${lowerLabel} in the correct format`;
  },
  patternMismatch: ({ lowerLabel }) => `Enter ${lowerLabel} in the correct format`,
  tooShort: ({ label, minLength }) => `${label} must be ${minLength} characters or more`,
  tooLong: ({ label, maxLength }) => `${label} must be ${maxLength} characters or less`,
  rangeUnderflow: ({ label, min, type }) =>
    isDate(type) || isTime(type)
      ? `${label} must be the same as or after ${formatDate(min, type)}`
      : `${label} must be ${min} or more`,
  rangeOverflow: ({ label, max, type }) =>
    isDate(type) || isTime(type)
      ? `${label} must be the same as or before ${formatDate(max, type)}`
      : `${label} must be ${max} or less`,
  stepMismatch: ({ label, step, min, type }) => {
    // "Whole number" only when whole numbers are what the step allows
    const wholeSteps = (!step || Number(step) === 1) && (!min || Number.isInteger(Number(min)));
    if (wholeSteps && (!type || type === "number" || type === "range")) {
      return `${label} must be a whole number`;
    }
    return `${label} must be in steps of ${step ?? 1}${min ? `, starting from ${min}` : ""}`;
  },
  badInput: ({ label, type }) =>
    isDate(type) ? `${label} must be a real date` : `${label} must be a number`,
  invalid: ({ lowerLabel, kind }) =>
    kind === "text" ? `Enter ${lowerLabel} in the correct format` : `Select ${lowerLabel}`,
};

/** Order matters: missing information first, then impossible values, then rules (GOV.UK). */
const VALIDITY_ORDER: ValidityKey[] = [
  "valueMissing",
  "badInput",
  "typeMismatch",
  "patternMismatch",
  "tooShort",
  "tooLong",
  "rangeUnderflow",
  "rangeOverflow",
  "stepMismatch",
];

/** The first failing validity flag, or `null` when the control is valid. */
export function getValidityKey(validity: ValidityState): ValidityKey | "invalid" | null {
  if (validity.valid) return null;
  return VALIDITY_ORDER.find((key) => validity[key]) ?? "invalid";
}

/** The message for a validity state, using the merged templates. */
export function getErrorMessage(
  validity: ValidityState,
  ctx: ErrorMessageContext,
  messages: Partial<ErrorMessages> = {},
): string | null {
  const key = getValidityKey(validity);
  if (!key) return null;
  const merged = { ...defaultErrorMessages, ...messages };
  return merged[key](ctx);
}

/** "Full name" → "full name"; "NHS number" stays. */
export function lowerFirst(label: string) {
  if (/^[A-Z]{2}/.test(label)) return label;
  return label.charAt(0).toLowerCase() + label.slice(1);
}

/* ---------- App-wide overrides (translation) ---------- */

const ErrorMessagesContext = React.createContext<Partial<ErrorMessages>>({});

/** Overrides the default messages for everything inside, e.g. to translate them. */
export function ErrorMessagesProvider({
  messages,
  children,
}: {
  messages: Partial<ErrorMessages>;
  children: React.ReactNode;
}) {
  const parent = React.useContext(ErrorMessagesContext);
  const value = React.useMemo(() => ({ ...parent, ...messages }), [parent, messages]);
  return React.createElement(ErrorMessagesContext.Provider, { value }, children);
}

/** The templates in effect here: defaults < providers < `overrides`. */
export function useErrorMessages(overrides?: Partial<ErrorMessages>): ErrorMessages {
  const fromProvider = React.useContext(ErrorMessagesContext);
  return React.useMemo(
    () => ({ ...defaultErrorMessages, ...fromProvider, ...overrides }),
    [fromProvider, overrides],
  );
}
