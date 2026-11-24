/* ============================================================
 * ButtonGroup: server-safe entry (GEO-972)
 *
 * The parts live in ./ButtonGroup.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<ButtonGroup.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { ButtonGroupPartText, ButtonGroupRoot, ButtonGroupSeparator } from "./ButtonGroup.parts";

export type * from "./ButtonGroup.parts";

export const ButtonGroup: {
  Root: typeof ButtonGroupRoot;
  Separator: typeof ButtonGroupSeparator;
  Text: typeof ButtonGroupPartText;
} = {
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator,
  Text: ButtonGroupPartText,
};
