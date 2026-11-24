"use client";

import * as React from "react";

/* ============================================================
 * Form contexts (GEO-935)
 *
 * In their own file so Field and ErrorSummary can read them without
 * importing Form (no cycle), and so the server-safe Form.tsx stays free of
 * React state.
 * ============================================================ */

export type FormNecessity = "optional" | "required" | "none";

export interface FormNecessityLabels {
  /** After an optional field's label (GOV.UK). */
  optional: string;
  /** After a required field's label, when `necessity="required"`. */
  required: string;
}

export const defaultFormNecessityLabels: FormNecessityLabels = {
  optional: "(optional)",
  required: "(required)",
};

/** Defaults a Form passes to the Fields inside it. Outside a Form, Field keeps its own. */
export interface FormFieldDefaults {
  /**
   * How labels mark necessity:
   * - `optional` (default): "(optional)" after optional fields, no asterisks (GOV.UK);
   * - `required`: "(required)" after required fields, for forms where most are optional;
   * - `none`: no marking.
   */
  necessity: FormNecessity;
  labels: FormNecessityLabels;
  /** Field.Root's default orientation. A Field's own prop wins. */
  orientation?: "vertical" | "horizontal";
}

export const FormFieldContext = React.createContext<FormFieldDefaults | null>(null);

/**
 * An ErrorSummary placed inside a Form registers here, so the Form doesn't render
 * its built-in one as well. Returns the unregister function.
 */
export const FormSummaryRegistryContext = React.createContext<(() => () => void) | null>(null);
