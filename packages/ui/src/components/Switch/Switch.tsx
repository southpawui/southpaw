/* ============================================================
 * Switch: server-safe entry (GEO-972)
 *
 * The parts live in ./Switch.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Switch.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { SwitchRoot, SwitchThumb } from "./Switch.parts";

export type * from "./Switch.parts";

export const Switch: {
  Root: typeof SwitchRoot;
  Thumb: typeof SwitchThumb;
} = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};
