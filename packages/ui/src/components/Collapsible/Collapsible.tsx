/* ============================================================
 * Collapsible: server-safe entry (GEO-972)
 *
 * The parts live in ./Collapsible.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Collapsible.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  CollapsibleHeader,
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleShowMore,
  CollapsibleTrigger,
} from "./Collapsible.parts";

export type * from "./Collapsible.parts";
export {
  CollapsibleChevron,
  collapsibleStyles,
  useCollapsibleOpenChangeComplete,
} from "./Collapsible.parts";

export const Collapsible: {
  Root: typeof CollapsibleRoot;
  Header: typeof CollapsibleHeader;
  Trigger: typeof CollapsibleTrigger;
  Panel: typeof CollapsiblePanel;
  ShowMore: typeof CollapsibleShowMore;
} = {
  Root: CollapsibleRoot,
  Header: CollapsibleHeader,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
  ShowMore: CollapsibleShowMore,
};
