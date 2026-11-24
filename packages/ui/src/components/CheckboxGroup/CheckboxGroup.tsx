/* ============================================================
 * CheckboxGroup: server-safe entry (GEO-972)
 *
 * The parts live in ./CheckboxGroup.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<CheckboxGroup.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { CheckboxGroupRoot } from "./CheckboxGroup.parts";

export type * from "./CheckboxGroup.parts";

export const CheckboxGroup: {
  Root: typeof CheckboxGroupRoot;
} = {
  Root: CheckboxGroupRoot,
};
