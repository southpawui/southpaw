/* ============================================================
 * ToggleGroup: server-safe entry (GEO-972)
 *
 * The parts live in ./ToggleGroup.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<ToggleGroup.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { ToggleGroupRoot, ToggleGroupSeparator } from "./ToggleGroup.parts";

export type * from "./ToggleGroup.parts";

export const ToggleGroup: {
  Root: typeof ToggleGroupRoot;
  Separator: typeof ToggleGroupSeparator;
} = {
  Root: ToggleGroupRoot,
  Separator: ToggleGroupSeparator,
};
