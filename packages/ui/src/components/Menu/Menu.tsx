/* ============================================================
 * Menu: server-safe entry (GEO-972)
 *
 * The parts live in ./Menu.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Menu.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  MenuArrow,
  MenuBackdrop,
  MenuCheckboxItem,
  MenuCreateHandle,
  MenuEmpty,
  MenuFilterProvider,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuList,
  MenuPartRoot,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSearch,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuTrigger,
  MenuUseFilter,
  MenuViewport,
} from "./Menu.parts";

export type * from "./Menu.parts";
export {
  KeyboardOpenContext,
  isKeyboardOpenChange,
  menuItemClasses,
  menuTriggerOpenClasses,
  toAriaKeyshortcuts,
  useKeyboardOpenTracking,
  useMenuStyle,
} from "./Menu.parts";

export const Menu: {
  Root: typeof MenuPartRoot;
  Trigger: typeof MenuTrigger;
  Portal: typeof MenuPortal;
  Backdrop: typeof MenuBackdrop;
  Positioner: typeof MenuPositioner;
  Popup: typeof MenuPopup;
  Arrow: typeof MenuArrow;
  Viewport: typeof MenuViewport;
  Item: typeof MenuItem;
  LinkItem: typeof MenuLinkItem;
  SubmenuRoot: typeof MenuSubmenuRoot;
  SubmenuTrigger: typeof MenuSubmenuTrigger;
  CheckboxItem: typeof MenuCheckboxItem;
  RadioGroup: typeof MenuRadioGroup;
  RadioItem: typeof MenuRadioItem;
  Group: typeof MenuGroup;
  GroupLabel: typeof MenuGroupLabel;
  Separator: typeof MenuSeparator;
  FilterProvider: typeof MenuFilterProvider;
  Search: typeof MenuSearch;
  List: typeof MenuList;
  Empty: typeof MenuEmpty;
  createHandle: typeof MenuCreateHandle;
  useFilter: typeof MenuUseFilter;
} = {
  Root: MenuPartRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Backdrop: MenuBackdrop,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Arrow: MenuArrow,
  Viewport: MenuViewport,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  SubmenuRoot: MenuSubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
  FilterProvider: MenuFilterProvider,
  Search: MenuSearch,
  List: MenuList,
  Empty: MenuEmpty,
  createHandle: MenuCreateHandle,
  useFilter: MenuUseFilter,
};
