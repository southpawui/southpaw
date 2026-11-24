/* ============================================================
 * Checkbox: server-safe entry (GEO-972)
 *
 * The parts live in ./Checkbox.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Checkbox.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { CheckboxIndicator, CheckboxRoot } from "./Checkbox.parts";

export type * from "./Checkbox.parts";

export const Checkbox: {
  Root: typeof CheckboxRoot;
  Indicator: typeof CheckboxIndicator;
} = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
};
