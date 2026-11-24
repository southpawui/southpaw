/* ============================================================
 * ScrollArea: server-safe entry (GEO-972)
 *
 * The parts live in ./ScrollArea.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<ScrollArea.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "./ScrollArea.parts";

export type * from "./ScrollArea.parts";

export const ScrollArea: {
  Root: typeof ScrollAreaRoot;
  Viewport: typeof ScrollAreaViewport;
  Content: typeof ScrollAreaContent;
  Scrollbar: typeof ScrollAreaScrollbar;
  Thumb: typeof ScrollAreaThumb;
  Corner: typeof ScrollAreaCorner;
} = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Content: ScrollAreaContent,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
};
