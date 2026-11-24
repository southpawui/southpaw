/* ============================================================
 * DescriptionList: server-safe entry (GEO-972)
 *
 * The parts live in ./DescriptionList.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<DescriptionList.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  DescriptionListAction,
  DescriptionListActions,
  DescriptionListDetails,
  DescriptionListHeader,
  DescriptionListItem,
  DescriptionListRoot,
  DescriptionListSummaryCard,
  DescriptionListTerm,
} from "./DescriptionList.parts";

export type * from "./DescriptionList.parts";
export {
  SummaryCard,
  defaultDescriptionListLabels,
  formatDescriptionValue,
} from "./DescriptionList.parts";

export const DescriptionList: {
  Root: typeof DescriptionListRoot;
  Header: typeof DescriptionListHeader;
  Item: typeof DescriptionListItem;
  Term: typeof DescriptionListTerm;
  Details: typeof DescriptionListDetails;
  Actions: typeof DescriptionListActions;
  Action: typeof DescriptionListAction;
  SummaryCard: typeof DescriptionListSummaryCard;
} = {
  Root: DescriptionListRoot,
  Header: DescriptionListHeader,
  Item: DescriptionListItem,
  Term: DescriptionListTerm,
  Details: DescriptionListDetails,
  Actions: DescriptionListActions,
  Action: DescriptionListAction,
  SummaryCard: DescriptionListSummaryCard,
};
