/* ============================================================
 * Menubar: server-safe entry (GEO-972)
 *
 * The parts live in ./Menubar.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Menubar.Menu>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import * as React from "react";
import {
  MenubarArrow,
  MenubarBackdrop,
  MenubarCheckboxItem,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarItem,
  MenubarLinkItem,
  MenubarPartMenu,
  MenubarPopup,
  MenubarPortal,
  MenubarPositioner,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarRoot,
  MenubarSeparator,
  MenubarSubmenuRoot,
  MenubarSubmenuTrigger,
  MenubarTrigger,
} from "./Menubar.parts";

export type * from "./Menubar.parts";

/** A server-safe stand-in for the root, so `<Menubar>` and `<Menubar.Menu>` both work. */
function MenubarComponent(props: React.ComponentProps<typeof MenubarRoot>) {
  return <MenubarRoot {...props} />;
}
MenubarComponent.displayName = "Menubar";

export const Menubar: typeof MenubarComponent & {
  Menu: typeof MenubarPartMenu;
  Trigger: typeof MenubarTrigger;
  Portal: typeof MenubarPortal;
  Backdrop: typeof MenubarBackdrop;
  Positioner: typeof MenubarPositioner;
  Popup: typeof MenubarPopup;
  Arrow: typeof MenubarArrow;
  Item: typeof MenubarItem;
  LinkItem: typeof MenubarLinkItem;
  SubmenuRoot: typeof MenubarSubmenuRoot;
  SubmenuTrigger: typeof MenubarSubmenuTrigger;
  CheckboxItem: typeof MenubarCheckboxItem;
  RadioGroup: typeof MenubarRadioGroup;
  RadioItem: typeof MenubarRadioItem;
  Group: typeof MenubarGroup;
  GroupLabel: typeof MenubarGroupLabel;
  Separator: typeof MenubarSeparator;
} = Object.assign(MenubarComponent, {
  Menu: MenubarPartMenu,
  Trigger: MenubarTrigger,
  Portal: MenubarPortal,
  Backdrop: MenubarBackdrop,
  Positioner: MenubarPositioner,
  Popup: MenubarPopup,
  Arrow: MenubarArrow,
  Item: MenubarItem,
  LinkItem: MenubarLinkItem,
  SubmenuRoot: MenubarSubmenuRoot,
  SubmenuTrigger: MenubarSubmenuTrigger,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  Group: MenubarGroup,
  GroupLabel: MenubarGroupLabel,
  Separator: MenubarSeparator,
});
