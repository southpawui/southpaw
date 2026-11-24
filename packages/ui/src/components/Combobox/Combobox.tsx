/* ============================================================
 * Combobox: server-safe entry (GEO-972)
 *
 * The parts live in ./Combobox.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Combobox.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxPartHighlight,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxRow,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxUseFilter,
  ComboboxUseFilteredItems,
  ComboboxValue,
  ComboboxVirtualList,
} from "./Combobox.parts";

export type * from "./Combobox.parts";
export { comboboxDefaultLabels } from "./Combobox.parts";

export const Combobox: {
  Root: typeof ComboboxRoot;
  Input: typeof ComboboxInput;
  Content: typeof ComboboxContent;
  List: typeof ComboboxList;
  VirtualList: typeof ComboboxVirtualList;
  Item: typeof ComboboxItem;
  Group: typeof ComboboxGroup;
  GroupLabel: typeof ComboboxGroupLabel;
  Separator: typeof ComboboxSeparator;
  Label: typeof ComboboxLabel;
  Highlight: typeof ComboboxPartHighlight;
  Collection: typeof ComboboxCollection;
  Row: typeof ComboboxRow;
  Portal: typeof ComboboxPortal;
  Positioner: typeof ComboboxPositioner;
  Popup: typeof ComboboxPopup;
  Trigger: typeof ComboboxTrigger;
  Value: typeof ComboboxValue;
  Empty: typeof ComboboxEmpty;
  Status: typeof ComboboxStatus;
  useFilter: typeof ComboboxUseFilter;
  useFilteredItems: typeof ComboboxUseFilteredItems;
} = {
  Root: ComboboxRoot,
  Input: ComboboxInput,
  Content: ComboboxContent,
  List: ComboboxList,
  VirtualList: ComboboxVirtualList,
  Item: ComboboxItem,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
  Label: ComboboxLabel,
  Highlight: ComboboxPartHighlight,
  Collection: ComboboxCollection,
  Row: ComboboxRow,
  Portal: ComboboxPortal,
  Positioner: ComboboxPositioner,
  Popup: ComboboxPopup,
  Trigger: ComboboxTrigger,
  Value: ComboboxValue,
  Empty: ComboboxEmpty,
  Status: ComboboxStatus,
  useFilter: ComboboxUseFilter,
  useFilteredItems: ComboboxUseFilteredItems,
};
