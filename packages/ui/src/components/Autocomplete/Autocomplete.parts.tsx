"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Base UI's Root is generic over the
   consumer's item type; our wrapper forwards it and handles sentinel items internally. */
import * as React from "react";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import type { Virtualizer } from "@tanstack/react-virtual";
import {
  ComboboxContext,
  RETRY,
  createContent,
  createInput,
  createItem,
  createSeparator,
  defaultItemLabel,
  defaultLabels,
  Group as GroupBase,
  GroupLabel as GroupLabelBase,
  Highlight,
  isKeyboardOpen,
  isSentinel,
  List as ListBase,
  scrollVirtualToHighlight,
  sentinelKind,
  useControllableState,
  useAnnouncer,
  useNarrowScreen,
  VirtualList as VirtualListBase,
  type ComboboxContentProps,
  type ComboboxContextValue,
  type ComboboxHighlight,
  type ComboboxInputProps,
  type ComboboxItemProps,
  type ComboboxLabels,
  type ComboboxListProps,
  type ComboboxSize,
  type ComboboxVirtualListProps,
} from "../Combobox/combobox-shared";

export type AutocompleteContentProps = ComboboxContentProps;
export type AutocompleteInputProps = ComboboxInputProps;
export type AutocompleteItemProps = ComboboxItemProps;
export type AutocompleteListProps = ComboboxListProps;
export type AutocompleteVirtualListProps = ComboboxVirtualListProps;
export type AutocompleteLabels = ComboboxLabels;

/* ============================================================
 * Root
 * ============================================================ */

type BaseRootProps<Item> = Omit<BaseAutocomplete.Root.Props<Item>, "items"> & {
  items?: readonly Item[] | readonly { value?: unknown; items: readonly Item[] }[];
};

export interface AutocompleteOwnProps {
  /** Control and row size. Heights follow `data-density`. Default `md`. */
  size?: ComboboxSize;
  /** Highlight style for rows. `subtle` (default) tints; `solid` fills with accent. */
  highlight?: ComboboxHighlight;
  /** Valid state: green border and check. Field `invalid` overrides it. */
  valid?: boolean;
  /** Warning state: amber border (`--sp-warning`). Overrides `valid`; Field `invalid` overrides both. */
  warning?: boolean;
  /** Suggestions are loading: spinner in the field, "Loading…" in the list, `aria-busy`. */
  loading?: boolean;
  /** Loading failed. `true` shows `labels.error`; a node shows that. Adds a "Try again" option. */
  error?: React.ReactNode;
  /** Called when the user picks "Try again". */
  onRetry?: () => void;
  /** More suggestions exist: `onLoadMore` fires when the list is scrolled to the end. */
  hasMore?: boolean;
  onLoadMore?: () => void;
  /** Replace any built-in string (i18n). */
  labels?: Partial<ComboboxLabels>;
  /** Characters needed before suggestions show (GOV.UK `minLength`). */
  minLength?: number;
  /** Where the query must match. Default `contains`. Ignored when `filter` is set. */
  matchFrom?: "contains" | "start";
  /** Bold the matched part of each suggestion. */
  highlightMatches?: boolean;
  /** Delay before the result count is announced (ms). Default 1400 (GOV.UK). */
  statusDelay?: number;
  /** Fill the input with the highlighted suggestion when it loses focus (GOV.UK `confirmOnBlur`). */
  autoSelectOnBlur?: boolean;
  /** Blur the input after a pick, to hide the on-screen keyboard. `touch` limits it to touch. */
  blurOnSelect?: boolean | "touch" | "mouse";
  /** Below 640px the list opens full screen with the input inside (Primer, Spectrum). */
  fullScreenOnMobile?: boolean;
  /** Title for the full-screen sheet. Defaults to the input's `aria-label`. */
  fullScreenTitle?: React.ReactNode;
  /** Enter submits the surrounding form, even while a suggestion is highlighted (Chakra `alwaysSubmitOnEnter`). */
  submitOnEnter?: boolean;
}

export type AutocompleteRootProps<Item = any> = BaseRootProps<Item> & AutocompleteOwnProps;

function Root<Item = any>(props: AutocompleteRootProps<Item>) {
  const {
    size = "md",
    highlight = "subtle",
    valid = false,
    warning = false,
    loading = false,
    error,
    onRetry,
    hasMore,
    onLoadMore,
    labels: labelsProp,
    minLength = 0,
    matchFrom = "contains",
    highlightMatches = false,
    statusDelay = 1400,
    autoSelectOnBlur = false,
    blurOnSelect = false,
    fullScreenOnMobile = false,
    fullScreenTitle,
    submitOnEnter = false,
    items,
    filter,
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen,
    onOpenChange,
    onItemHighlighted,
    itemToStringValue,
    limit,
    locale,
    children,
    ...rest
  } = props as AutocompleteRootProps<any> & { locale?: Intl.LocalesArgument };

  const labels = React.useMemo(() => ({ ...defaultLabels, ...labelsProp }), [labelsProp]);
  const [value, setValueState] = useControllableState<string>(
    valueProp as string | undefined,
    (defaultValue as string | undefined) ?? "",
  );
  const [open, setOpenState] = useControllableState<boolean>(openProp, defaultOpen ?? false);
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);
  const [stickyGroupLabels, setStickyGroupLabels] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState({ text: "", key: 0 });
  const lastSelectionAt = React.useRef(0);
  const pointerTypeRef = React.useRef("");
  const highlightedRef = React.useRef<unknown>(undefined);
  const virtualizerRef = React.useRef<Virtualizer<HTMLDivElement, Element> | null>(null);
  const fullScreenInputRef = React.useRef(null);
  const fullScreen = useNarrowScreen(fullScreenOnMobile);
  // Values of the options rendered as disabled (autoSelectOnBlur must not pick them)
  const disabledItems = React.useRef(new Set<unknown>());

  const itemToLabel = React.useCallback(
    (item: unknown) => {
      if (isSentinel(item)) return "";
      return itemToStringValue ? itemToStringValue(item) : defaultItemLabel(item);
    },
    [itemToStringValue],
  );

  const announce = useAnnouncer(setAnnouncement);

  const core = BaseAutocomplete.useFilter({ locale });
  const wrappedFilter = React.useCallback(
    (item: unknown, query: string, toString?: (item: unknown) => string) => {
      if (isSentinel(item)) return true;
      // `filter={null}` turns client filtering off (server-side search)
      if (filter === null) return true;
      if (filter) return filter(item as never, query, toString as never);
      const stringify = toString ?? itemToLabel;
      return matchFrom === "start"
        ? core.startsWith(item, query, stringify)
        : core.contains(item, query, stringify);
    },
    [filter, matchFrom, core, itemToLabel],
  );

  const query = value.trim();
  const belowMin = minLength > 0 && query.length < minLength;
  const collection = React.useMemo(() => {
    if (items === undefined) return undefined;
    if (error) return [RETRY];
    if (belowMin) return [];
    return items as readonly unknown[];
  }, [items, error, belowMin]);

  const maybeBlur = () => {
    const type = pointerTypeRef.current || "keyboard";
    const should =
      blurOnSelect === true ||
      (blurOnSelect === "touch" && (type === "touch" || type === "pen")) ||
      (blurOnSelect === "mouse" && type === "mouse");
    if (should) queueMicrotask(() => (document.activeElement as HTMLElement | null)?.blur());
  };

  const setValue = (next: string, details: any) => {
    setValueState(next);
    onValueChange?.(next, details);
  };

  const ctx: ComboboxContextValue = {
    kind: "autocomplete",
    size,
    highlight,
    valid,
    warning,
    loading,
    error: error === false ? null : error,
    hasMore: !!hasMore,
    onLoadMore,
    labels,
    inputValue: value,
    open,
    minLength,
    highlightMatches,
    indicatorPosition: "start",
    multiple: false,
    itemToLabel,
    isSelected: () => false,
    value,
    atMax: false,
    isFixed: () => false,
    selectAllState: "none",
    selectAllTotal: 0,
    keyboardOpen,
    fullScreen,
    statusDelay,
    lastSelectionAt,
    announcement,
    announce,
    virtualizerRef,
    selectionDisplay: "chips",
    reorderable: false,
    moveValue: () => {},
    tagHandlers: submitOnEnter
      ? {
          onKeyDown: (event) => {
            if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
            // Enter on "Try again" retries; it doesn't submit the old query
            if (open && isSentinel(highlightedRef.current)) return;
            const form = event.currentTarget.form;
            // After Base UI fills the input with the highlighted suggestion
            window.setTimeout(() => form?.requestSubmit());
          },
          onPaste: () => {},
        }
      : undefined,
    pointerTypeRef,
    stickyGroupLabels,
    setStickyGroupLabels,
    close: () => {
      setOpenState(false);
      onOpenChange?.(false, { reason: "close-press" } as never);
    },
    fullScreenTitle,
    fullScreenInputRef,
    composed: items === undefined,
    disabledItems,
    notePressed: (item) => (highlightedRef.current = item),
  };

  return (
    <ComboboxContext.Provider value={ctx}>
      {/* Remount when the full-screen layout switches: Base UI decides once whether
          the input lives inside the popup. Value, input and open state are held
          here, so nothing is lost. */}
      <BaseAutocomplete.Root
        key={fullScreen ? "full-screen" : "inline"}
        {...(rest as any)}
        items={collection as any}
        filter={wrappedFilter as any}
        limit={limit != null && error ? limit + 1 : limit}
        locale={locale}
        value={value}
        onValueChange={(next: string, details: any) => {
          if (details?.reason === "item-press") {
            if (sentinelKind(highlightedRef.current) === "retry") {
              onRetry?.();
              return;
            }
            lastSelectionAt.current = Date.now();
            maybeBlur();
          }
          setValue(next, details);
        }}
        open={open}
        onOpenChange={(next: boolean, details: any) => {
          if (next) setKeyboardOpen(isKeyboardOpen(details));
          // autoSelectOnBlur (GOV.UK confirmOnBlur): leaving the field takes the
          // highlighted suggestion. Base UI closes before blur fires, so act here.
          const highlighted = highlightedRef.current;
          if (
            !next &&
            autoSelectOnBlur &&
            (details?.reason === "focus-out" || details?.reason === "outside-press") &&
            highlighted !== undefined &&
            !isSentinel(highlighted) &&
            !disabledItems.current.has(highlighted)
          ) {
            setValue(itemToLabel(highlighted), details);
          }
          setOpenState(next);
          onOpenChange?.(next, details);
        }}
        onItemHighlighted={(item: any, details: any) => {
          highlightedRef.current = item;
          scrollVirtualToHighlight(virtualizerRef.current, details);
          // Internal rows (retry) reach the consumer as no item
          onItemHighlighted?.(isSentinel(item) ? undefined : item, details);
        }}
        itemToStringValue={(item: unknown) =>
          sentinelKind(item) === "retry" ? value : itemToLabel(item)
        }
      >
        <PointerTypeTracker pointerTypeRef={pointerTypeRef} />
        {children}
      </BaseAutocomplete.Root>
    </ComboboxContext.Provider>
  );
}

function PointerTypeTracker({
  pointerTypeRef,
}: {
  pointerTypeRef: React.MutableRefObject<string>;
}) {
  React.useEffect(() => {
    const onPointer = (event: PointerEvent) => (pointerTypeRef.current = event.pointerType);
    const onKey = () => (pointerTypeRef.current = "keyboard");
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [pointerTypeRef]);
  return null;
}

/* ============================================================
 * Parts
 * ============================================================ */

const Input = createInput("autocomplete");
const Content = createContent("autocomplete");
const Item = createItem("autocomplete");
const Separator = createSeparator("autocomplete");

function List(props: ComboboxListProps) {
  return <ListBase kind="autocomplete" {...props} />;
}
List.displayName = "Autocomplete.List";

function VirtualList(props: ComboboxVirtualListProps) {
  return <VirtualListBase kind="autocomplete" {...props} />;
}
VirtualList.displayName = "Autocomplete.VirtualList";

function Group(props: React.ComponentProps<typeof BaseAutocomplete.Group>) {
  return <GroupBase kind="autocomplete" {...props} />;
}
Group.displayName = "Autocomplete.Group";

function GroupLabel(props: React.ComponentProps<typeof BaseAutocomplete.GroupLabel>) {
  return <GroupLabelBase kind="autocomplete" {...props} />;
}
GroupLabel.displayName = "Autocomplete.GroupLabel";

// Parts for the server-safe namespace in ./Autocomplete (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
const AutocompleteCollection = BaseAutocomplete.Collection;
const AutocompleteRow = BaseAutocomplete.Row;
const AutocompletePortal = BaseAutocomplete.Portal;
const AutocompletePositioner = BaseAutocomplete.Positioner;
const AutocompletePopup = BaseAutocomplete.Popup;
const AutocompleteTrigger = BaseAutocomplete.Trigger;
const AutocompleteEmpty = BaseAutocomplete.Empty;
const AutocompleteStatus = BaseAutocomplete.Status;
const AutocompleteUseFilter = BaseAutocomplete.useFilter;
const AutocompleteUseFilteredItems = BaseAutocomplete.useFilteredItems;
export {
  Root as AutocompleteRoot,
  Input as AutocompleteInput,
  Content as AutocompleteContent,
  List as AutocompleteList,
  VirtualList as AutocompleteVirtualList,
  Item as AutocompleteItem,
  Group as AutocompleteGroup,
  GroupLabel as AutocompleteGroupLabel,
  Separator as AutocompleteSeparator,
  Highlight as AutocompleteHighlight,
  AutocompleteCollection,
  AutocompleteRow,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteTrigger,
  AutocompleteEmpty,
  AutocompleteStatus,
  AutocompleteUseFilter,
  AutocompleteUseFilteredItems,
};
