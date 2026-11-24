/* ============================================================
 * RadioGroup: server-safe entry (GEO-972)
 *
 * The parts live in ./RadioGroup.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<RadioGroup.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from "./RadioGroup.parts";

export type * from "./RadioGroup.parts";

export const RadioGroup: {
  Root: typeof RadioGroupRoot;
  Item: typeof RadioGroupItem;
  Indicator: typeof RadioGroupIndicator;
} = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
};
