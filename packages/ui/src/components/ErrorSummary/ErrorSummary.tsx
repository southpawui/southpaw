/* ============================================================
 * ErrorSummary: server-safe entry (GEO-972)
 *
 * The parts live in ./ErrorSummary.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<ErrorSummary.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  ErrorSummaryDescription,
  ErrorSummaryItem,
  ErrorSummaryList,
  ErrorSummaryRoot,
  ErrorSummaryTitle,
} from "./ErrorSummary.parts";

export type * from "./ErrorSummary.parts";
export {
  ErrorMessagesProvider,
  defaultErrorMessages,
  errorSummaryDefaultLabels,
  getErrorMessage,
  getValidityKey,
  useErrorMessages,
} from "./ErrorSummary.parts";

export const ErrorSummary: {
  Root: typeof ErrorSummaryRoot;
  Title: typeof ErrorSummaryTitle;
  Description: typeof ErrorSummaryDescription;
  List: typeof ErrorSummaryList;
  Item: typeof ErrorSummaryItem;
} = {
  Root: ErrorSummaryRoot,
  Title: ErrorSummaryTitle,
  Description: ErrorSummaryDescription,
  List: ErrorSummaryList,
  Item: ErrorSummaryItem,
};
