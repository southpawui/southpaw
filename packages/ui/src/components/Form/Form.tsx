/* ============================================================
 * Form: server-safe entry (GEO-935, GEO-972 pattern)
 *
 * The parts live in ./Form.parts ("use client"). This file has no directive,
 * so a Server Component gets a plain object of client references and can
 * render <Form.Root action={serverAction}> directly. Keep it free of hooks,
 * context and Base UI imports: the guard in lib/use-client.test.ts checks.
 * ============================================================ */

import { FormErrorSummary, FormRoot, FormSubmit } from "./Form.parts";

export type * from "./Form.parts";
export type { FormNecessity, FormNecessityLabels } from "./context";

export const Form: {
  Root: typeof FormRoot;
  ErrorSummary: typeof FormErrorSummary;
  Submit: typeof FormSubmit;
} = {
  Root: FormRoot,
  ErrorSummary: FormErrorSummary,
  Submit: FormSubmit,
};
