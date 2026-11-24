/* ============================================================
 * Drawer: server-safe entry (GEO-972)
 *
 * The parts live in ./Drawer.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Drawer.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerClose,
  DrawerCloseButton,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerPopup,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer.parts";

export type * from "./Drawer.parts";

export const Drawer: {
  Root: typeof DrawerRoot;
  Trigger: typeof DrawerTrigger;
  Portal: typeof DrawerPortal;
  Backdrop: typeof DrawerBackdrop;
  Popup: typeof DrawerPopup;
  Handle: typeof DrawerHandle;
  Header: typeof DrawerHeader;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
  Title: typeof DrawerTitle;
  Description: typeof DrawerDescription;
  Close: typeof DrawerClose;
  CloseButton: typeof DrawerCloseButton;
} = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Backdrop: DrawerBackdrop,
  Popup: DrawerPopup,
  Handle: DrawerHandle,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  CloseButton: DrawerCloseButton,
};
