/* ============================================================
 * Kbd: server-safe entry (GEO-972)
 *
 * The parts live in ./Kbd.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Kbd.Group>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import * as React from "react";
import { KbdGroup, KbdRoot } from "./Kbd.parts";

export type * from "./Kbd.parts";
export { parseKeys, resolveKey, usePlatform } from "./Kbd.parts";

/** A server-safe stand-in for the root, so `<Kbd>` and `<Kbd.Group>` both work. */
function KbdComponent(props: React.ComponentProps<typeof KbdRoot>) {
  return <KbdRoot {...props} />;
}
KbdComponent.displayName = "Kbd";

export const Kbd: typeof KbdComponent & {
  Group: typeof KbdGroup;
} = Object.assign(KbdComponent, {
  Group: KbdGroup,
});
