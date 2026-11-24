/* ============================================================
 * ContextMenu: server-safe entry (GEO-972)
 *
 * The parts live in ./ContextMenu.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<ContextMenu.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  ContextMenuArrow,
  ContextMenuBackdrop,
  ContextMenuCheckboxItem,
  ContextMenuEmpty,
  ContextMenuFilterProvider,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuList,
  ContextMenuPopup,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRoot,
  ContextMenuSearch,
  ContextMenuSeparator,
  ContextMenuSubmenuRoot,
  ContextMenuSubmenuTrigger,
  ContextMenuTrigger,
} from "./ContextMenu.parts";

export type * from "./ContextMenu.parts";

export const ContextMenu: {
  Root: typeof ContextMenuRoot;
  Trigger: typeof ContextMenuTrigger;
  Positioner: typeof ContextMenuPositioner;
  Portal: typeof ContextMenuPortal;
  Backdrop: typeof ContextMenuBackdrop;
  Popup: typeof ContextMenuPopup;
  Arrow: typeof ContextMenuArrow;
  Item: typeof ContextMenuItem;
  LinkItem: typeof ContextMenuLinkItem;
  SubmenuRoot: typeof ContextMenuSubmenuRoot;
  SubmenuTrigger: typeof ContextMenuSubmenuTrigger;
  CheckboxItem: typeof ContextMenuCheckboxItem;
  RadioGroup: typeof ContextMenuRadioGroup;
  RadioItem: typeof ContextMenuRadioItem;
  Group: typeof ContextMenuGroup;
  GroupLabel: typeof ContextMenuGroupLabel;
  Separator: typeof ContextMenuSeparator;
  FilterProvider: typeof ContextMenuFilterProvider;
  Search: typeof ContextMenuSearch;
  List: typeof ContextMenuList;
  Empty: typeof ContextMenuEmpty;
} = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Positioner: ContextMenuPositioner,
  Portal: ContextMenuPortal,
  Backdrop: ContextMenuBackdrop,
  Popup: ContextMenuPopup,
  Arrow: ContextMenuArrow,
  Item: ContextMenuItem,
  LinkItem: ContextMenuLinkItem,
  SubmenuRoot: ContextMenuSubmenuRoot,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Separator: ContextMenuSeparator,
  FilterProvider: ContextMenuFilterProvider,
  Search: ContextMenuSearch,
  List: ContextMenuList,
  Empty: ContextMenuEmpty,
};
