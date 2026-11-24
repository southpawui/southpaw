/* ============================================================
 * Toast: server-safe entry (GEO-972)
 *
 * The parts live in ./Toast.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Toast.Toaster>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  ToastAction,
  ToastActions,
  ToastArrow,
  ToastBody,
  ToastCaption,
  ToastClose,
  ToastCloseButton,
  ToastContent,
  ToastCreateToastManager,
  ToastDescription,
  ToastIcon,
  ToastItem,
  ToastPortal,
  ToastPositioner,
  ToastProgress,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastToaster,
  ToastUseToastManager,
  ToastViewport,
} from "./Toast.parts";

export type * from "./Toast.parts";
export { DEFAULT_LIMIT, DEFAULT_TIMEOUT, createToaster, toast, toastManager } from "./Toast.parts";

export const Toast: {
  Toaster: typeof ToastToaster;
  Provider: typeof ToastProvider;
  Portal: typeof ToastPortal;
  Viewport: typeof ToastViewport;
  Root: typeof ToastRoot;
  Item: typeof ToastItem;
  Content: typeof ToastContent;
  Body: typeof ToastBody;
  Icon: typeof ToastIcon;
  Title: typeof ToastTitle;
  Description: typeof ToastDescription;
  Caption: typeof ToastCaption;
  Actions: typeof ToastActions;
  Action: typeof ToastAction;
  Close: typeof ToastClose;
  CloseButton: typeof ToastCloseButton;
  Progress: typeof ToastProgress;
  Positioner: typeof ToastPositioner;
  Arrow: typeof ToastArrow;
  useToastManager: typeof ToastUseToastManager;
  createToastManager: typeof ToastCreateToastManager;
} = {
  Toaster: ToastToaster,
  Provider: ToastProvider,
  Portal: ToastPortal,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Item: ToastItem,
  Content: ToastContent,
  Body: ToastBody,
  Icon: ToastIcon,
  Title: ToastTitle,
  Description: ToastDescription,
  Caption: ToastCaption,
  Actions: ToastActions,
  Action: ToastAction,
  Close: ToastClose,
  CloseButton: ToastCloseButton,
  Progress: ToastProgress,
  Positioner: ToastPositioner,
  Arrow: ToastArrow,
  useToastManager: ToastUseToastManager,
  createToastManager: ToastCreateToastManager,
};
