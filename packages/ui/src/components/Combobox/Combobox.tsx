/* eslint-disable @typescript-eslint/no-explicit-any -- Base UI's Root is generic over the
   consumer's item type; our wrapper forwards it and handles sentinel items internally. */
import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { Virtualizer } from "@tanstack/react-virtual";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import {
  ComboboxContext,
  RETRY,
  SELECT_ALL,
  createContent,
  createInput,
  createItem,
  createSentinel,
  createSeparator,
  defaultItemLabel,
  defaultLabels,
  flattenItems,
  Group as GroupBase,
  GroupLabel as GroupLabelBase,
  Highlight,
  isGroupList,
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
  type Sentinel,
} from "./combobox-shared";

export type {
  ComboboxContentProps,
  ComboboxHighlight,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxLabels,
  ComboboxListProps,
  ComboboxSize,
  ComboboxVirtualListProps,
};
export { defaultLabels as comboboxDefaultLabels };

/* ============================================================
 * Root
 * ============================================================ */

type BaseRootProps<Value, Multiple extends boolean | undefined> = React.ComponentProps<
  typeof BaseCombobox.Root<Value, Multiple>
>;

export interface ComboboxOwnProps<Value> {
  /** Control and row size. Heights follow `data-density`. Default `md`. */
  size?: ComboboxSize;
  /** Highlight style for rows. `subtle` (default) tints; `solid` fills with accent. */
  highlight?: ComboboxHighlight;
  /** Valid state: green border and check. Field `invalid` overrides it. */
  valid?: boolean;
  /** Warning state: amber border (`--sp-warning`). Overrides `valid`; Field `invalid` overrides both. */
  warning?: boolean;
  /** Results are loading: spinner in the field, "Loading…" in the list, `aria-busy`. */
  loading?: boolean;
  /** Loading failed. `true` shows `labels.error`; a node shows that. Adds a "Try again" option. */
  error?: React.ReactNode;
  /** Called when the user picks "Try again". */
  onRetry?: () => void;
  /** More results exist: `onLoadMore` fires when the list is scrolled to the end. */
  hasMore?: boolean;
  onLoadMore?: () => void;
  /** Replace any built-in string (i18n). */
  labels?: Partial<ComboboxLabels>;
  /** Characters needed before results show (GOV.UK `minLength`). */
  minLength?: number;
  /** Where the query must match. Default `contains`. Ignored when `filter` is set. */
  matchFrom?: "contains" | "start";
  /** Bold the matched part of each option. */
  highlightMatches?: boolean;
  /** Where the selected check (or checkbox) sits. Default `start`. */
  indicatorPosition?: "start" | "end";
  /** Delay before the result count is announced (ms). Default 1400 (GOV.UK). */
  statusDelay?: number;
  /** Pick the highlighted option when the input loses focus (GOV.UK `confirmOnBlur`, MUI `autoSelect`). */
  autoSelectOnBlur?: boolean;
  /** Blur the input after a pick, to hide the on-screen keyboard. `touch` limits it to touch. */
  blurOnSelect?: boolean | "touch" | "mouse";
  /** Below 640px the list opens full screen with the input inside (Primer, Spectrum). */
  fullScreenOnMobile?: boolean;
  /** Title for the full-screen sheet. Defaults to the input's `aria-label`. */
  fullScreenTitle?: React.ReactNode;
  /** Offer a "Create '…'" option for text that matches nothing. */
  creatable?: boolean;
  /** Turns the typed text into a new item. Return the item to select it. Default: the text. */
  onCreate?: (query: string) => Value | void;
  /** Multiple + creatable: keys that commit the text as a tag (e.g. `[",", ";"]`). Pasted text is split on them and on new lines. */
  delimiters?: string[];
  /** Allow creating a tag that matches an existing item's label. */
  allowDuplicates?: boolean;
  /** Multiple: the most items that can be selected (Mantine `maxValues`, Ant `maxCount`). */
  maxSelected?: number;
  /** Multiple: chips shown while the field is idle. The rest collapse into "+N more". */
  maxVisibleChips?: number | "responsive";
  /** Multiple: `chips` (default) or one `count` tag that clears all (Carbon). */
  selectionDisplay?: "chips" | "count";
  /** Multiple: chips can be moved with Alt+Shift+←/→ or dragged (Mantine). */
  reorderable?: boolean;
  /** Multiple: items that can't be removed (MUI fixed options). */
  isItemFixed?: (item: Value) => boolean;
  /** Multiple: a "Select all" option for the visible results (Carbon, Primer). */
  selectAll?: boolean;
  /** Multiple: leave selected items out of the list (Mantine `hidePickedOptions`). */
  hidePicked?: boolean;
  /** Multiple: move selected items to the top when the list opens, not while it's open (Primer). */
  selectedFirst?: boolean;
}

export type ComboboxRootProps<
  Value = any,
  Multiple extends boolean | undefined = false,
> = BaseRootProps<Value, Multiple> & ComboboxOwnProps<Value>;

function Root<Value = any, Multiple extends boolean | undefined = false>(
  props: ComboboxRootProps<Value, Multiple>,
) {
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
    indicatorPosition = "start",
    statusDelay = 1400,
    autoSelectOnBlur = false,
    blurOnSelect = false,
    fullScreenOnMobile = false,
    fullScreenTitle,
    creatable = false,
    onCreate,
    delimiters,
    allowDuplicates = false,
    maxSelected,
    maxVisibleChips,
    selectionDisplay = "chips",
    reorderable = false,
    isItemFixed,
    selectAll = false,
    hidePicked = false,
    selectedFirst = false,
    // Base UI props we wrap
    items,
    filter,
    value: valueProp,
    defaultValue,
    onValueChange,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputValueChange,
    open: openProp,
    defaultOpen,
    onOpenChange,
    onItemHighlighted,
    itemToStringLabel,
    isItemEqualToValue,
    multiple,
    limit,
    locale,
    readOnly,
    disabled,
    children,
    ...rest
  } = props as ComboboxRootProps<any, boolean> & { locale?: Intl.LocalesArgument };

  const isMultiple = !!multiple;
  const labels = React.useMemo(() => ({ ...defaultLabels, ...labelsProp }), [labelsProp]);

  const [value, setValueState] = useControllableState<any>(
    valueProp,
    defaultValue ?? (isMultiple ? [] : null),
  );
  // Single select starts with the selected item's label in the input, as Base UI does
  const initialValue = valueProp ?? defaultValue;
  const [inputValue, setInputValueState] = useControllableState<string>(
    inputValueProp as string | undefined,
    (defaultInputValue as string | undefined) ??
      (!multiple && initialValue != null
        ? itemToStringLabel
          ? itemToStringLabel(initialValue as never)
          : defaultItemLabel(initialValue)
        : ""),
  );
  const [open, setOpenState] = useControllableState<boolean>(openProp, defaultOpen ?? false);
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);
  const [stickyGroupLabels, setStickyGroupLabels] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState({ text: "", key: 0 });
  const lastSelectionAt = React.useRef(0);
  const pointerTypeRef = React.useRef("");
  const highlightedRef = React.useRef<unknown>(undefined);
  const virtualizerRef = React.useRef<Virtualizer<HTMLDivElement, Element> | null>(null);
  const fullScreen = useNarrowScreen(fullScreenOnMobile);
  const fullScreenInputRef = React.useRef(null);
  // Values of the options rendered as disabled (autoSelectOnBlur must not pick them)
  const disabledItems = React.useRef(new Set<unknown>());
  const editable = !readOnly && !disabled;

  const itemToLabel = React.useCallback(
    (item: unknown) => {
      const kind = sentinelKind(item);
      if (kind === "create") return (item as { query: string }).query;
      if (kind) return "";
      return itemToStringLabel ? itemToStringLabel(item) : defaultItemLabel(item);
    },
    [itemToStringLabel],
  );
  // Sentinel rows never reach the consumer's comparator
  const equals = React.useCallback(
    (a: unknown, b: unknown) =>
      a == null || b == null || isSentinel(a) || isSentinel(b)
        ? Object.is(a, b)
        : isItemEqualToValue
          ? isItemEqualToValue(a, b)
          : Object.is(a, b),
    [isItemEqualToValue],
  );
  const selectedList: unknown[] = React.useMemo(
    () => (isMultiple ? (Array.isArray(value) ? value : []) : value == null ? [] : [value]),
    [isMultiple, value],
  );
  const isSelected = React.useCallback(
    (item: unknown) => selectedList.some((v) => equals(v, item)),
    [selectedList, equals],
  );
  const isFixed = React.useCallback(
    (item: unknown) => (isItemFixed ? isItemFixed(item as never) : false),
    [isItemFixed],
  );

  const announce = useAnnouncer(setAnnouncement);

  /* ---------- Filtering ---------- */

  const core = BaseCombobox.useFilter({ locale, multiple: isMultiple, value });
  const baseFilter = React.useCallback(
    (item: unknown, query: string, toString?: (item: unknown) => string) => {
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

  const grouped = isGroupList(items as readonly unknown[] | undefined);
  const query = inputValue.trim();

  // What was selected when the list opened (selectedFirst). Only the selection is
  // snapshotted, so items that arrive while the list is open still show.
  const [openSelected, setOpenSelected] = React.useState<unknown[] | null>(null);

  const realItems = React.useMemo(() => {
    let list = (items as readonly unknown[] | undefined) ?? [];
    if (grouped) {
      if (hidePicked && isMultiple) {
        list = (list as any[]).map((g) => ({
          ...g,
          items: g.items.filter((i: unknown) => !isSelected(i)),
        }));
      }
      return list;
    }
    if (selectedFirst && isMultiple && openSelected) {
      const pinned = (i: unknown) => openSelected.some((v) => equals(v, i));
      list = [...list.filter(pinned), ...list.filter((i) => !pinned(i))];
    }
    if (hidePicked && isMultiple) list = list.filter((i) => !isSelected(i));
    return list;
  }, [items, grouped, hidePicked, isMultiple, isSelected, selectedFirst, openSelected, equals]);

  // Matches, capped at `limit`. The cap is applied here rather than by Base UI so
  // the select-all and create rows never take a result's place.
  const visibleReal = React.useMemo(() => {
    const matches = flattenItems(realItems).filter((item) => !query || baseFilter(item, query));
    return limit != null && !grouped ? matches.slice(0, limit) : matches;
  }, [realItems, query, baseFilter, limit, grouped]);

  const showCreate =
    creatable &&
    query !== "" &&
    !(isMultiple ? false : value != null && itemToLabel(value) === inputValue) &&
    (allowDuplicates ||
      !flattenItems(items as readonly unknown[]).some(
        (item) => itemToLabel(item).toLocaleLowerCase() === query.toLocaleLowerCase(),
      ));

  const belowMin = minLength > 0 && query.length < minLength;

  const collection = React.useMemo(() => {
    if (items === undefined) return undefined;
    if (error) return [RETRY];
    if (belowMin) return [];
    if (grouped) return realItems;
    const out: unknown[] = [];
    if (selectAll && isMultiple && visibleReal.length > 0) out.push(SELECT_ALL);
    out.push(...(limit != null ? visibleReal : realItems));
    if (showCreate) out.push(createSentinel(query));
    return out;
  }, [
    items,
    error,
    belowMin,
    grouped,
    realItems,
    selectAll,
    isMultiple,
    visibleReal,
    limit,
    showCreate,
    query,
  ]);

  const wrappedFilter = React.useCallback(
    (item: unknown, q: string, toString?: (item: unknown) => string) =>
      isSentinel(item) ? true : baseFilter(item, q, toString),
    [baseFilter],
  );

  /* ---------- Select all ---------- */

  const selectAllTargets = visibleReal;
  const selectedTargets = selectAllTargets.filter((i) => isSelected(i)).length;
  const selectAllState: ComboboxContextValue["selectAllState"] =
    selectedTargets === 0 ? "none" : selectedTargets === selectAllTargets.length ? "all" : "some";

  /* ---------- Value changes ---------- */

  const atMax = isMultiple && maxSelected != null && selectedList.length >= maxSelected;
  // Select all clears instead when everything is picked, or when nothing more can be added
  const selectAllClears = selectAllState === "all" || (atMax && selectAllState === "some");

  const commitValue = (next: any, details: any) => {
    setValueState(next);
    onValueChange?.(next, details);
    lastSelectionAt.current = Date.now();
  };

  const createItemFrom = (text: string): unknown => {
    const created = onCreate ? onCreate(text) : text;
    return created === undefined ? undefined : created;
  };

  const maybeBlur = () => {
    const type = pointerTypeRef.current || "keyboard";
    const should =
      blurOnSelect === true ||
      (blurOnSelect === "touch" && (type === "touch" || type === "pen")) ||
      (blurOnSelect === "mouse" && type === "mouse");
    if (should) queueMicrotask(() => (document.activeElement as HTMLElement | null)?.blur());
  };

  const handleValueChange = (next: any, details: any) => {
    if (isMultiple) {
      let list = (Array.isArray(next) ? next : []) as unknown[];
      const current = selectedList;
      if (list.some((i) => sentinelKind(i) === "retry")) {
        // Cancel so Base UI keeps the typed query for the retry
        details?.cancel?.();
        onRetry?.();
        return;
      }
      if (list.some((i) => sentinelKind(i) === "select-all")) {
        list = current.slice();
        if (selectAllClears) {
          list = list.filter((i) => isFixed(i) || !selectAllTargets.some((t) => equals(t, i)));
        } else {
          for (const target of selectAllTargets) {
            if (maxSelected != null && list.length >= maxSelected) break;
            if (!list.some((i) => equals(i, target))) list.push(target);
          }
        }
      }
      const created = list.find((i) => sentinelKind(i) === "create") as
        Extract<Sentinel, { query: string }> | undefined;
      list = list.filter((i) => !isSentinel(i));
      if (created) {
        // At the maximum, refuse before onCreate runs (it may have side effects)
        if (atMax) {
          details?.cancel?.();
          return;
        }
        const item = createItemFrom(created.query);
        if (item !== undefined && !list.some((i) => equals(i, item))) list.push(item);
        setInputValueState("");
        onInputValueChange?.("", details);
      }
      // Fixed items always stay (Backspace and Clear can't remove them), in their place
      current.forEach((item, index) => {
        if (isFixed(item) && !list.some((n) => equals(n, item))) {
          list.splice(Math.min(index, list.length), 0, item);
        }
      });
      // Max selections: refuse additions past the limit
      if (maxSelected != null && list.length > maxSelected && list.length > current.length) {
        details?.cancel?.();
        return;
      }
      commitValue(list, details);
    } else {
      const kind = sentinelKind(next);
      if (kind === "retry") {
        details?.cancel?.();
        onRetry?.();
        return;
      }
      let item = next;
      if (kind === "create") {
        item = createItemFrom((next as { query: string }).query);
        if (item === undefined) return;
      }
      commitValue(item, details);
    }
    maybeBlur();
  };

  const moveValue = (from: number, to: number) => {
    if (!isMultiple) return;
    const list = selectedList.slice();
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    commitValue(list, { reason: "none" });
  };

  /* ---------- Tags: delimiters and paste ---------- */

  const commitTokens = (tokens: string[], details: any) => {
    const list = selectedList.slice();
    for (const raw of tokens) {
      const token = raw.trim();
      if (!token) continue;
      if (maxSelected != null && list.length >= maxSelected) break;
      const existing = allowDuplicates
        ? undefined
        : flattenItems(items as readonly unknown[]).find(
            (item) => itemToLabel(item).toLocaleLowerCase() === token.toLocaleLowerCase(),
          );
      const item = existing ?? createItemFrom(token);
      if (item === undefined) continue;
      if (!allowDuplicates && list.some((i) => equals(i, item))) continue;
      list.push(item);
    }
    commitValue(list, details);
    setInputValueState("");
    onInputValueChange?.("", details);
  };

  const tagHandlers =
    isMultiple && creatable && editable && delimiters?.length
      ? {
          onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (!delimiters.includes(event.key)) return;
            event.preventDefault();
            if (event.currentTarget.value.trim()) {
              commitTokens([event.currentTarget.value], {
                reason: "input-change",
                event: event.nativeEvent,
              });
            }
          },
          onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => {
            const text = event.clipboardData.getData("text");
            const pattern = new RegExp(
              `[${delimiters.map((d) => d.replace(/[\\\]^-]/g, "\\$&")).join("")}\\n\\r\\t]`,
            );
            if (!pattern.test(text)) return;
            event.preventDefault();
            commitTokens(text.split(pattern), { reason: "input-paste", event: event.nativeEvent });
          },
        }
      : undefined;

  /* ---------- autoSelectOnBlur ---------- */

  // Leaving the field takes the highlighted option (GOV.UK confirmOnBlur, MUI
  // autoSelect). Base UI closes the popup before the input's blur fires, so this
  // runs on the close event.
  const commitHighlightedOnClose = (details: any) => {
    const highlighted = highlightedRef.current;
    if (!autoSelectOnBlur || highlighted === undefined || isSentinel(highlighted)) return;
    if ([...disabledItems.current].some((d) => equals(d, highlighted))) return;
    if (details?.reason !== "focus-out" && details?.reason !== "outside-press") return;
    if (isMultiple) {
      if (!isSelected(highlighted)) handleValueChange([...selectedList, highlighted], details);
    } else {
      handleValueChange(highlighted, details);
      setInputValueState(itemToLabel(highlighted));
    }
  };

  /* ---------- Context ---------- */

  const ctx: ComboboxContextValue = {
    kind: "combobox",
    size,
    highlight,
    valid,
    warning,
    loading,
    error: error === false ? null : error,
    hasMore: !!hasMore,
    onLoadMore,
    labels,
    inputValue,
    open,
    minLength,
    highlightMatches,
    indicatorPosition,
    multiple: isMultiple,
    itemToLabel,
    isSelected,
    value,
    maxSelected,
    atMax,
    isFixed,
    selectAllState,
    selectAllTotal: selectAllTargets.length,
    keyboardOpen,
    fullScreen,
    statusDelay,
    lastSelectionAt,
    announcement,
    announce,
    virtualizerRef,
    maxVisibleChips,
    selectionDisplay,
    reorderable: reorderable && editable,
    moveValue,
    tagHandlers,
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
      <BaseCombobox.Root
        key={fullScreen ? "full-screen" : "inline"}
        {...(rest as any)}
        readOnly={readOnly}
        disabled={disabled}
        multiple={multiple as any}
        items={collection as any}
        filter={
          items === undefined && !filter && matchFrom === "contains"
            ? undefined
            : (wrappedFilter as any)
        }
        // Flat lists are capped above; grouped lists are capped by Base UI
        limit={grouped ? limit : undefined}
        locale={locale}
        value={value}
        onValueChange={handleValueChange as any}
        inputValue={inputValue}
        onInputValueChange={(next: string, details: any) => {
          setInputValueState(next);
          onInputValueChange?.(next, details);
        }}
        open={open}
        onOpenChange={(next: boolean, details: any) => {
          if (next) {
            setKeyboardOpen(isKeyboardOpen(details));
            if (selectedFirst && isMultiple && !grouped) setOpenSelected(selectedList.slice());
          }
          if (!next) commitHighlightedOnClose(details);
          setOpenState(next);
          onOpenChange?.(next, details);
        }}
        onItemHighlighted={(item: any, details: any) => {
          highlightedRef.current = item;
          scrollVirtualToHighlight(virtualizerRef.current, details);
          // Internal rows (select all, create, retry) reach the consumer as no item
          onItemHighlighted?.(isSentinel(item) ? undefined : item, details);
        }}
        itemToStringLabel={itemToLabel as any}
        isItemEqualToValue={equals as any}
      >
        <PointerTypeTracker pointerTypeRef={pointerTypeRef} />
        {children}
      </BaseCombobox.Root>
    </ComboboxContext.Provider>
  );
}

/** Records how the user last pressed (for `blurOnSelect`). */
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

const Input = createInput("combobox");
const Content = createContent("combobox");
const Item = createItem("combobox");
const Separator = createSeparator("combobox");

function List(props: ComboboxListProps) {
  return <ListBase kind="combobox" {...props} />;
}
List.displayName = "Combobox.List";

function VirtualList(props: ComboboxVirtualListProps) {
  return <VirtualListBase kind="combobox" {...props} />;
}
VirtualList.displayName = "Combobox.VirtualList";

function Group(props: React.ComponentProps<typeof BaseCombobox.Group>) {
  return <GroupBase kind="combobox" {...props} />;
}
Group.displayName = "Combobox.Group";

function GroupLabel(props: React.ComponentProps<typeof BaseCombobox.GroupLabel>) {
  return <GroupLabelBase kind="combobox" {...props} />;
}
GroupLabel.displayName = "Combobox.GroupLabel";

/** Styled Base UI parts for custom composition. */
const Label = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCombobox.Label>>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Label
      ref={ref}
      data-slot="combobox-label"
      className={mergeClassName(cn("text-fg-default text-sm font-medium"), className)}
      {...props}
    />
  ),
);
Label.displayName = "Combobox.Label";

export const Combobox = {
  Root,
  Input,
  Content,
  List,
  VirtualList,
  Item,
  Group,
  GroupLabel,
  Separator,
  Label,
  Highlight,
  /* Base UI parts, unstyled, for custom anatomy */
  Collection: BaseCombobox.Collection,
  Row: BaseCombobox.Row,
  Portal: BaseCombobox.Portal,
  Positioner: BaseCombobox.Positioner,
  Popup: BaseCombobox.Popup,
  Trigger: BaseCombobox.Trigger,
  Value: BaseCombobox.Value,
  Empty: BaseCombobox.Empty,
  Status: BaseCombobox.Status,
  useFilter: BaseCombobox.useFilter,
  useFilteredItems: BaseCombobox.useFilteredItems,
};
