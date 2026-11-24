/* ============================================================
 * PreviewCard: server-safe entry (GEO-972)
 *
 * The parts live in ./PreviewCard.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<PreviewCard.Group>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  PreviewCardArrow,
  PreviewCardBackdrop,
  PreviewCardContent,
  PreviewCardCreateHandle,
  PreviewCardDescription,
  PreviewCardGroup,
  PreviewCardMedia,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardRoot,
  PreviewCardTitle,
  PreviewCardTrigger,
  PreviewCardViewport,
} from "./PreviewCard.parts";

export type * from "./PreviewCard.parts";
export { DEFAULT_CLOSE_DELAY, DEFAULT_DELAY, DEFAULT_GROUP_TIMEOUT } from "./PreviewCard.parts";

export const PreviewCard: {
  Group: typeof PreviewCardGroup;
  Root: typeof PreviewCardRoot;
  Trigger: typeof PreviewCardTrigger;
  Portal: typeof PreviewCardPortal;
  Backdrop: typeof PreviewCardBackdrop;
  Positioner: typeof PreviewCardPositioner;
  Popup: typeof PreviewCardPopup;
  Viewport: typeof PreviewCardViewport;
  Arrow: typeof PreviewCardArrow;
  Content: typeof PreviewCardContent;
  Media: typeof PreviewCardMedia;
  Title: typeof PreviewCardTitle;
  Description: typeof PreviewCardDescription;
  createHandle: typeof PreviewCardCreateHandle;
} = {
  Group: PreviewCardGroup,
  Root: PreviewCardRoot,
  Trigger: PreviewCardTrigger,
  Portal: PreviewCardPortal,
  Backdrop: PreviewCardBackdrop,
  Positioner: PreviewCardPositioner,
  Popup: PreviewCardPopup,
  Viewport: PreviewCardViewport,
  Arrow: PreviewCardArrow,
  Content: PreviewCardContent,
  Media: PreviewCardMedia,
  Title: PreviewCardTitle,
  Description: PreviewCardDescription,
  createHandle: PreviewCardCreateHandle,
};
