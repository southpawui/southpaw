/* ============================================================
 * Select: server-safe entry (GEO-972)
 *
 * The parts live in ./Select.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Select.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  SelectArrow,
  SelectBackdrop,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectPartIcon,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectScrollDownArrow,
  SelectScrollUpArrow,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./Select.parts";

export type * from "./Select.parts";

export const Select: {
  Root: typeof SelectRoot;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Icon: typeof SelectPartIcon;
  Portal: typeof SelectPortal;
  Backdrop: typeof SelectBackdrop;
  Positioner: typeof SelectPositioner;
  Popup: typeof SelectPopup;
  List: typeof SelectList;
  Item: typeof SelectItem;
  ItemIndicator: typeof SelectItemIndicator;
  ItemText: typeof SelectItemText;
  Arrow: typeof SelectArrow;
  Group: typeof SelectGroup;
  GroupLabel: typeof SelectGroupLabel;
  Separator: typeof SelectSeparator;
  ScrollUpArrow: typeof SelectScrollUpArrow;
  ScrollDownArrow: typeof SelectScrollDownArrow;
} = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectPartIcon,
  Portal: SelectPortal,
  Backdrop: SelectBackdrop,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
  Arrow: SelectArrow,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  ScrollUpArrow: SelectScrollUpArrow,
  ScrollDownArrow: SelectScrollDownArrow,
};
