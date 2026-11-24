/* ============================================================
 * Accordion: server-safe entry (GEO-972)
 *
 * The parts live in ./Accordion.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Accordion.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionPartSkeleton,
  AccordionRoot,
  AccordionTrigger,
} from "./Accordion.parts";

export type * from "./Accordion.parts";

export const Accordion: {
  Root: typeof AccordionRoot;
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Trigger: typeof AccordionTrigger;
  Panel: typeof AccordionPanel;
  Skeleton: typeof AccordionPartSkeleton;
} = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
  Skeleton: AccordionPartSkeleton,
};
