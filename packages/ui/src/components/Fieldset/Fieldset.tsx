/* ============================================================
 * Fieldset: server-safe entry (GEO-972)
 *
 * The parts live in ./Fieldset.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Fieldset.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { FieldsetDescription, FieldsetError, FieldsetLegend, FieldsetRoot } from "./Fieldset.parts";

export type * from "./Fieldset.parts";

export const Fieldset: {
  Root: typeof FieldsetRoot;
  Legend: typeof FieldsetLegend;
  Description: typeof FieldsetDescription;
  Error: typeof FieldsetError;
} = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
  Error: FieldsetError,
};
