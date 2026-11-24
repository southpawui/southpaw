/* ============================================================
 * Autocomplete: server-safe entry (GEO-972)
 *
 * The parts live in ./Autocomplete.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Autocomplete.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteHighlight,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteRoot,
  AutocompleteRow,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteUseFilter,
  AutocompleteUseFilteredItems,
  AutocompleteVirtualList,
} from "./Autocomplete.parts";

export type * from "./Autocomplete.parts";

export const Autocomplete: {
  Root: typeof AutocompleteRoot;
  Input: typeof AutocompleteInput;
  Content: typeof AutocompleteContent;
  List: typeof AutocompleteList;
  VirtualList: typeof AutocompleteVirtualList;
  Item: typeof AutocompleteItem;
  Group: typeof AutocompleteGroup;
  GroupLabel: typeof AutocompleteGroupLabel;
  Separator: typeof AutocompleteSeparator;
  Highlight: typeof AutocompleteHighlight;
  Collection: typeof AutocompleteCollection;
  Row: typeof AutocompleteRow;
  Portal: typeof AutocompletePortal;
  Positioner: typeof AutocompletePositioner;
  Popup: typeof AutocompletePopup;
  Trigger: typeof AutocompleteTrigger;
  Empty: typeof AutocompleteEmpty;
  Status: typeof AutocompleteStatus;
  useFilter: typeof AutocompleteUseFilter;
  useFilteredItems: typeof AutocompleteUseFilteredItems;
} = {
  Root: AutocompleteRoot,
  Input: AutocompleteInput,
  Content: AutocompleteContent,
  List: AutocompleteList,
  VirtualList: AutocompleteVirtualList,
  Item: AutocompleteItem,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Separator: AutocompleteSeparator,
  Highlight: AutocompleteHighlight,
  Collection: AutocompleteCollection,
  Row: AutocompleteRow,
  Portal: AutocompletePortal,
  Positioner: AutocompletePositioner,
  Popup: AutocompletePopup,
  Trigger: AutocompleteTrigger,
  Empty: AutocompleteEmpty,
  Status: AutocompleteStatus,
  useFilter: AutocompleteUseFilter,
  useFilteredItems: AutocompleteUseFilteredItems,
};
