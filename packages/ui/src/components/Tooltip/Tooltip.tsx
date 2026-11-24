/* ============================================================
 * Tooltip: server-safe entry (GEO-972)
 *
 * The parts live in ./Tooltip.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Tooltip.Provider>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  TooltipArrow,
  TooltipContent,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipRoot,
  TooltipShortcut,
  TooltipTrigger,
  TooltipViewport,
} from "./Tooltip.parts";

export type * from "./Tooltip.parts";

export const Tooltip: {
  Provider: typeof TooltipProvider;
  Root: typeof TooltipRoot;
  Trigger: typeof TooltipTrigger;
  Portal: typeof TooltipPortal;
  Positioner: typeof TooltipPositioner;
  Popup: typeof TooltipPopup;
  Arrow: typeof TooltipArrow;
  Shortcut: typeof TooltipShortcut;
  Viewport: typeof TooltipViewport;
  Content: typeof TooltipContent;
  createHandle: typeof TooltipCreateHandle;
} = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
  Shortcut: TooltipShortcut,
  Viewport: TooltipViewport,
  Content: TooltipContent,
  createHandle: TooltipCreateHandle,
};
