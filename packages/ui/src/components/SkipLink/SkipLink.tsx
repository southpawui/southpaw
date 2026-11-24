/* ============================================================
 * SkipLink: server-safe entry (GEO-972)
 *
 * The parts live in ./SkipLink.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<SkipLink.Target>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import * as React from "react";
import { SkipLinkRoot, SkipLinkTarget } from "./SkipLink.parts";

export type * from "./SkipLink.parts";

/** A server-safe stand-in for the root, so `<SkipLink>` and `<SkipLink.Target>` both work. */
function SkipLinkComponent(props: React.ComponentProps<typeof SkipLinkRoot>) {
  return <SkipLinkRoot {...props} />;
}
SkipLinkComponent.displayName = "SkipLink";

export const SkipLink: typeof SkipLinkComponent & {
  Target: typeof SkipLinkTarget;
} = Object.assign(SkipLinkComponent, {
  Target: SkipLinkTarget,
});
