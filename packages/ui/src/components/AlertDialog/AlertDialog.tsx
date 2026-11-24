/* ============================================================
 * AlertDialog: server-safe entry (GEO-972)
 *
 * The parts live in ./AlertDialog.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<AlertDialog.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog.parts";

export type * from "./AlertDialog.parts";

export const AlertDialog: {
  Root: typeof AlertDialogRoot;
  Trigger: typeof AlertDialogTrigger;
  Portal: typeof AlertDialogPortal;
  Backdrop: typeof AlertDialogBackdrop;
  Popup: typeof AlertDialogPopup;
  Header: typeof AlertDialogHeader;
  Icon: typeof AlertDialogIcon;
  Footer: typeof AlertDialogFooter;
  Title: typeof AlertDialogTitle;
  Description: typeof AlertDialogDescription;
  Close: typeof AlertDialogClose;
} = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Backdrop: AlertDialogBackdrop,
  Popup: AlertDialogPopup,
  Header: AlertDialogHeader,
  Icon: AlertDialogIcon,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
};
