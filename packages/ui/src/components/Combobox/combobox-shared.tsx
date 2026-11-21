/* eslint-disable @typescript-eslint/no-explicit-any -- items are consumer-typed; the
   shared layer only passes them through. Public types live in Combobox.tsx / Autocomplete.tsx. */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import { CaretDown, Check, CheckCircle, Plus, WarningCircle, X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { menuItemClasses, type MenuHighlight, type MenuSize } from "../Menu/Menu";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import { Spinner } from "../Spinner/Spinner";
import { Button } from "../Button/Button";
import { Tooltip } from "../Tooltip/Tooltip";

/* ============================================================
 * Shared building blocks for Combobox and Autocomplete.
 *
 * Base UI's Autocomplete reuses most Combobox parts (Input, List, Popup,
 * Empty, Status…). Only Root, InputGroup, Trigger, Item and Separator
 * differ, so every styled part is written once here and given the
 * matching primitive and `data-slot` prefix.
 * ============================================================ */

export type ComboboxKind = "combobox" | "autocomplete";
export type ComboboxSize = MenuSize;
export type ComboboxHighlight = MenuHighlight;

/* ============================================================
 * Strings
 * ============================================================ */

export interface ComboboxLabels {
  /** Empty list. */
  noResults: string;
  /** Empty list while `loading`. */
  loading: string;
  /** Row under the list while more results load. */
  loadingMore: string;
  /** Default error text when `error` is `true`. */
  error: string;
  /** The retry option shown with an error. */
  retry: string;
  /** Shown until the query reaches `minLength`. */
  minLength: (min: number) => string;
  /** Polite announcement of the result count. */
  results: (count: number) => string;
  /** The creatable option. */
  create: (query: string) => string;
  /** Select-all option. */
  selectAll: string;
  /** Description of the select-all option. */
  selectedOf: (selected: number, total: number) => string;
  /** Clear button (single value). Also its tooltip. */
  clear: string;
  /** Clear button when several values are selected. Also its tooltip. */
  clearAll: string;
  /** Chevron button. */
  toggle: string;
  /** Chip remove button. */
  removeChip: (label: string) => string;
  /** Collapsed chips. */
  moreChips: (count: number) => string;
  /** Count display (`selectionDisplay="count"`). */
  selectedCount: (count: number) => string;
  /** Description on the input while chips are present. */
  chipsHint: string;
  /** Description on the input while chips can be reordered. */
  reorderHint: string;
  /** Message when `maxSelected` is reached. */
  maxSelected: (max: number) => string;
  /** Announcement after a chip is moved. */
  moved: (label: string, position: number, total: number) => string;
  /** Close button in the full-screen mobile popup. */
  close: string;
  /** Accessible name of the scrolling list area. */
  options: string;
}

export const defaultLabels: ComboboxLabels = {
  noResults: "No results",
  loading: "Loading…",
  loadingMore: "Loading more…",
  error: "Couldn’t load results",
  retry: "Try again",
  minLength: (min) => `Type ${min} or more characters for results`,
  results: (count) => `${count} ${count === 1 ? "result is" : "results are"} available`,
  create: (query) => `Create “${query}”`,
  selectAll: "Select all",
  selectedOf: (selected, total) => `${selected} of ${total} selected`,
  clear: "Clear",
  clearAll: "Clear all",
  toggle: "Show options",
  removeChip: (label) => `Remove ${label}`,
  moreChips: (count) => `+${count} more`,
  selectedCount: (count) => `${count} selected`,
  chipsHint: "Press Backspace to remove the last selection",
  reorderHint: "Press Alt Shift and an arrow key on a selection to move it",
  maxSelected: (max) => `You can choose up to ${max}. Remove one to choose another.`,
  moved: (label, position, total) => `${label} moved to position ${position} of ${total}`,
  close: "Close",
  options: "Options",
};

/* ============================================================
 * Sentinel options (select all, create, retry)
 *
 * These are real items in Base UI's collection, so they are reachable
 * with the arrow keys through `aria-activedescendant` like any option.
 * Root intercepts them in `onValueChange`; they are never stored.
 * ============================================================ */

const SENTINEL = "__southpawComboboxSentinel";

export type Sentinel =
  { [SENTINEL]: "select-all" } | { [SENTINEL]: "create"; query: string } | { [SENTINEL]: "retry" };

export const SELECT_ALL: Sentinel = { [SENTINEL]: "select-all" };
export const RETRY: Sentinel = { [SENTINEL]: "retry" };
export const createSentinel = (query: string): Sentinel => ({ [SENTINEL]: "create", query });

export function sentinelKind(item: unknown): Sentinel[typeof SENTINEL] | undefined {
  return item != null && typeof item === "object" && SENTINEL in item
    ? (item as Sentinel)[SENTINEL]
    : undefined;
}

export const isSentinel = (item: unknown) => sentinelKind(item) !== undefined;

export interface ItemGroup<Item = any> {
  value?: unknown;
  label?: string;
  items: readonly Item[];
}

export function isGroupList(items: readonly unknown[] | undefined): items is readonly ItemGroup[] {
  const first = items?.[0];
  return (
    first != null &&
    typeof first === "object" &&
    "items" in first &&
    Array.isArray((first as ItemGroup).items)
  );
}

export function flattenItems(items: readonly unknown[] | undefined): unknown[] {
  if (!items) return [];
  return isGroupList(items) ? items.flatMap((group) => group.items as unknown[]) : [...items];
}

/** Default label: strings as-is, objects by `label`, then `name`, then String(). */
export function defaultItemLabel(item: unknown): string {
  if (item == null) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    const record = item as Record<string, unknown>;
    if (typeof record.label === "string") return record.label;
    if (typeof record.name === "string") return record.name;
  }
  return String(item);
}

/* ============================================================
 * Context
 * ============================================================ */

export interface ComboboxContextValue {
  kind: ComboboxKind;
  size: ComboboxSize;
  highlight: ComboboxHighlight;
  valid: boolean;
  warning: boolean;
  loading: boolean;
  error: React.ReactNode;
  hasMore: boolean;
  onLoadMore?: () => void;
  labels: ComboboxLabels;
  inputValue: string;
  open: boolean;
  minLength: number;
  highlightMatches: boolean;
  indicatorPosition: "start" | "end";
  multiple: boolean;
  itemToLabel: (item: unknown) => string;
  isSelected: (item: unknown) => boolean;
  /** Current value (array when multiple). */
  value: unknown;
  maxSelected?: number;
  atMax: boolean;
  isFixed: (item: unknown) => boolean;
  selectAllState: "all" | "some" | "none";
  selectAllTotal: number;
  /** The popup was opened from the keyboard: skip the open animation. */
  keyboardOpen: boolean;
  /** Full-screen popup is active (opt-in, narrow screens). */
  fullScreen: boolean;
  statusDelay: number;
  lastSelectionAt: React.MutableRefObject<number>;
  announcement: { text: string; key: number };
  announce: (text: string) => void;
  virtualizerRef: React.MutableRefObject<Virtualizer<HTMLDivElement, Element> | null>;
  // Chips (Combobox multiple)
  maxVisibleChips?: number | "responsive";
  selectionDisplay: "chips" | "count";
  reorderable: boolean;
  moveValue: (from: number, to: number) => void;
  /** Delimiter/paste handling for creatable tags. */
  tagHandlers?: {
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  };
  /** `blurOnSelect`: remember how the last item was picked. */
  pointerTypeRef: React.MutableRefObject<string>;
  stickyGroupLabels: boolean;
  setStickyGroupLabels: (sticky: boolean) => void;
  /** Close the popup. */
  close: () => void;
  /** Title for the full-screen sheet. */
  fullScreenTitle?: React.ReactNode;
  /** Input props handed from `Input` to the full-screen header. */
  fullScreenInputRef: React.MutableRefObject<FullScreenInputProps | null>;
  /** No `items` on Root: the consumer renders the options. */
  composed: boolean;
  /** Values of options rendered as disabled. */
  disabledItems: React.MutableRefObject<Set<unknown>>;
  /** A pointer pressed this option (a touch tap may not highlight it first). */
  notePressed: (item: unknown) => void;
}

interface FullScreenInputProps {
  props: React.ComponentProps<typeof BaseCombobox.Input>;
  startIcon?: React.ReactNode;
}

/** Announces through the control's live region, clearing the text after 1s. */
export function useAnnouncer(
  setAnnouncement: React.Dispatch<React.SetStateAction<{ text: string; key: number }>>,
) {
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  return React.useCallback(
    (text: string) => {
      setAnnouncement((prev) => ({ text, key: prev.key + 1 }));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(
        () => setAnnouncement((prev) => ({ ...prev, text: "" })),
        1000,
      );
    },
    [setAnnouncement],
  );
}

export const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

export function useComboboxContext(part: string) {
  const ctx = React.useContext(ComboboxContext);
  if (!ctx) throw new Error(`[Southpaw] <${part}> must be used inside its Root.`);
  return ctx;
}

/** Virtualized row placement, provided by VirtualList to each Item. */
interface VirtualRow {
  index: number;
  start: number;
  setSize: number;
  measure: (el: Element | null) => void;
}
const VirtualRowContext = React.createContext<VirtualRow | null>(null);

/* ============================================================
 * Hooks shared by both Roots
 * ============================================================ */

/** Controlled/uncontrolled state, like Base UI's useControlled. */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
): [T, (next: T) => void] {
  const isControlled = controlled !== undefined;
  const [inner, setInner] = React.useState<T>(defaultValue);
  const value = isControlled ? (controlled as T) : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
    },
    [isControlled],
  );
  return [value, set];
}

/** Matches the Tailwind `sm` breakpoint (below 640px). */
export function useNarrowScreen(enabled: boolean) {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(max-width: 639.98px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [enabled]);
  return enabled && narrow;
}

/** True when an open-change event came from a key press or typing. */
export function isKeyboardOpen(details: { reason?: string; event?: Event } | undefined) {
  if (!details) return false;
  if (details.reason === "input-change") return true;
  return typeof KeyboardEvent !== "undefined" && details.event instanceof KeyboardEvent;
}

/** Scrolls a virtualized list to keep the keyboard highlight in view (Base UI recipe). */
export function scrollVirtualToHighlight(
  virtualizer: Virtualizer<HTMLDivElement, Element> | null,
  details: { reason: string; index: number },
) {
  if (!virtualizer || details.index < 0) return;
  const isStart = details.index === 0;
  const isEnd = details.index === virtualizer.options.count - 1;
  if (details.reason === "none" || (details.reason === "keyboard" && (isStart || isEnd))) {
    queueMicrotask(() =>
      virtualizer.scrollToIndex(details.index, { align: isEnd ? "start" : "end" }),
    );
  }
}

/* ============================================================
 * Primitive lookup per kind
 * ============================================================ */

type AnyComponent = React.ComponentType<any>;

const primitives: Record<
  ComboboxKind,
  { InputGroup: AnyComponent; Trigger: AnyComponent; Item: AnyComponent; Separator: AnyComponent }
> = {
  combobox: {
    InputGroup: BaseCombobox.InputGroup,
    Trigger: BaseCombobox.Trigger,
    Item: BaseCombobox.Item,
    Separator: BaseCombobox.Separator,
  },
  autocomplete: {
    InputGroup: BaseAutocomplete.InputGroup,
    Trigger: BaseAutocomplete.Trigger,
    Item: BaseAutocomplete.Item,
    Separator: BaseAutocomplete.Separator,
  },
};

/* ============================================================
 * Control (input group) styling
 * ============================================================ */

const controlHeight: Record<ComboboxSize, string> = {
  sm: "[--sp-cb-height:var(--sp-control-height-sm)]",
  md: "[--sp-cb-height:var(--sp-control-height)]",
  lg: "[--sp-cb-height:var(--sp-control-height-lg)]",
};

/** Classes for the field box. Matches Input, Select and NumberField. */
export function controlClasses(ctx: Pick<ComboboxContextValue, "size" | "valid" | "warning">) {
  return cn(
    "group/cb-control relative flex w-full min-w-0 items-center",
    controlHeight[ctx.size],
    "min-h-[var(--sp-cb-height)]",
    "bg-surface-base text-fg-default rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
    "border-border-control border-2",
    ctx.size === "lg" ? "text-base" : "text-sm",
    "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
    "hover:border-fg-muted",
    "has-[input:focus-visible]:sp-focus-ring",
    // Open: accent border, like Select. Keyed to aria-expanded on the input/trigger inside, the
    // library-wide open signal (GEO-970); Tooltip triggers set data-popup-open, never aria-expanded.
    "has-[[aria-expanded=true]]:border-accent",
    // State priority: invalid > warning > valid (NumberField)
    ctx.valid && !ctx.warning && "border-success hover:border-success",
    ctx.warning && "border-warning hover:border-warning",
    "has-[[data-invalid]]:!border-danger data-[invalid]:!border-danger",
    "has-[input:disabled]:bg-surface-sunken has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-[var(--sp-state-disabled-opacity)]",
    "has-[input[readonly]]:bg-surface-sunken has-[input[readonly]]:border-border-default",
  );
}

const inputClasses = cn(
  "text-fg-default placeholder:text-fg-muted h-[calc(var(--sp-cb-height)-4px)] min-w-12 flex-1 bg-transparent outline-none",
  "disabled:cursor-not-allowed",
);

/** Small square icon button inside the control (clear, chevron, chip remove). */
const controlButtonClasses = cn(
  "text-fg-muted inline-flex size-6 shrink-0 items-center justify-center rounded-[calc(var(--sp-nested-radius,var(--radius-DEFAULT))-2px)] outline-none",
  "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
  "hover:text-fg-default hover:bg-[var(--sp-state-hover)]",
  "focus-visible:sp-focus-ring",
  "disabled:pointer-events-none",
);

/**
 * Open-trigger look (Lane 2 parity, local until the restack): a pressed
 * overlay plus an inset currentColor ring, with a Highlight outline in
 * forced colours. Keyed to `aria-expanded` (the chevron is also a Tooltip trigger,
 * which sets `data-popup-open` while its tooltip shows), like Menu's
 * `menuTriggerOpenClasses` (GEO-970).
 */
const triggerOpenClasses = cn(
  "aria-expanded:bg-[var(--sp-state-pressed)] aria-expanded:text-fg-default",
  "aria-expanded:shadow-[inset_0_0_0_1.5px_currentColor]",
  "forced-colors:aria-expanded:outline-solid forced-colors:aria-expanded:outline-2 forced-colors:aria-expanded:outline-[color:Highlight]",
);

/* ============================================================
 * Chips (Combobox multiple)
 * ============================================================ */

/** Chips fit inside the control at every density: control − border − row padding. */
const chipHeight: Record<ComboboxSize, string> = {
  sm: "h-[min(1.25rem,calc(var(--sp-cb-height)-10px))] text-xs",
  md: "h-[min(1.5rem,calc(var(--sp-cb-height)-10px))] text-sm",
  lg: "h-[min(1.75rem,calc(var(--sp-cb-height)-10px))] text-sm",
};

function chipClasses(size: ComboboxSize, fixed?: boolean) {
  return cn(
    "bg-surface-alternate text-fg-default inline-flex max-w-full shrink-0 items-center gap-0.5 rounded-[calc(var(--sp-nested-radius,var(--radius-DEFAULT))-3px)] ps-2 outline-none",
    chipHeight[size],
    fixed ? "pe-2" : "pe-0.5",
    "focus-visible:sp-focus-ring data-[highlighted]:sp-focus-ring",
    "aria-disabled:opacity-[var(--sp-state-disabled-opacity)]",
  );
}

/**
 * Tooltip for an icon-only button in the control (clear, chip remove,
 * chevron). Uses Tooltip's label mode: the tooltip text IS the button's
 * accessible name (`aria-labelledby`), so nothing is announced twice and
 * there is no separate `aria-label`. Shown above the field so it never
 * covers the list. Touch long-press is handled by Tooltip.
 */
function IconTooltip({
  label,
  disabled,
  children,
}: {
  label: string;
  disabled?: boolean;
  children: React.ReactElement;
}) {
  return (
    <Tooltip.Root type="label" disabled={disabled}>
      <Tooltip.Trigger render={children} />
      <Tooltip.Content side="top">{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}

/**
 * Polite live region for messages that can happen while the list is closed
 * (chip moves, load errors). Always mounted, and portalled to `document.body`:
 * Base UI keeps `aria-live` elements audible while a popup is open by hiding
 * their siblings one level deeper, so a live region inside the field would
 * get the input itself `aria-hidden` instead of the field as a whole.
 */
function Announcer({ kind, text }: { kind: ComboboxKind; text: string }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === "undefined") return null;
  return ReactDOM.createPortal(
    <span role="status" aria-live="polite" data-slot={`${kind}-announcer`} className="sr-only">
      {text}
    </span>,
    document.body,
  );
}

interface ChipListProps {
  values: unknown[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** The input has focus. */
  editing: boolean;
}

// Remove buttons go when the field is read-only or disabled, as the clear button does
const hideWhenLocked =
  "group-has-[input:disabled]/cb-control:hidden group-has-[input[readonly]]/cb-control:hidden";

/** Chips for every selected value, with "+N more" collapsing and reordering. */
function ChipList({ values, inputRef, editing }: ChipListProps) {
  const ctx = useComboboxContext("Combobox.Input");
  const { size, labels, itemToLabel, isFixed, maxVisibleChips, reorderable, moveValue } = ctx;
  const [focusWithin, setFocusWithin] = React.useState(false);
  // Measured fit, keyed to the number of values so a new value starts a fresh measurement
  const [fit, setFit] = React.useState({ len: values.length, count: values.length });
  const fitCount = fit.len === values.length ? fit.count : values.length;
  const setFitCount = React.useCallback(
    (count: number) => setFit({ len: values.length, count }),
    [values.length],
  );
  const listRef = React.useRef<HTMLSpanElement>(null);
  const dragFrom = React.useRef<number | null>(null);
  const refocusIndex = React.useRef<number | null>(null);

  // Collapse only while the field is idle (no focus in the input or a chip, list
  // closed), so editing always shows everything (MUI). Backspace never removes
  // a chip the user can't see.
  const collapsing = maxVisibleChips !== undefined && !focusWithin && !editing && !ctx.open;
  const limit =
    !collapsing || maxVisibleChips === undefined
      ? values.length
      : maxVisibleChips === "responsive"
        ? fitCount
        : maxVisibleChips;
  const hidden = Math.max(0, values.length - limit);

  // Responsive: show as many chips as fit on the first line (Ant `maxTagCount="responsive"`).
  // Measure with every chip shown, then shrink one step at a time until the
  // "+N" chip also fits on the first line. Start over when the width changes.
  const responsive = maxVisibleChips === "responsive" && collapsing;
  React.useLayoutEffect(() => {
    if (!responsive) return;
    const el = listRef.current?.parentElement;
    if (!el) return;
    const chips = Array.from(el.querySelectorAll<HTMLElement>("[data-chip-index]:not([hidden])"));
    if (chips.length === 0) return;
    const firstTop = chips[0]!.offsetTop;
    if (fitCount >= values.length) {
      const wrapped = chips.findIndex((chip) => chip.offsetTop > firstTop + 2);
      if (wrapped !== -1) setFitCount(Math.max(1, wrapped));
      return;
    }
    // The "+N" chip and the input must both stay on the first line
    const more = el.querySelector<HTMLElement>("[data-slot$=chip-more]");
    const input = el.querySelector<HTMLElement>("input");
    const wraps = [more, input].some((node) => node && node.offsetTop > firstTop + 2);
    if (wraps && fitCount > 1) setFitCount(fitCount - 1);
    // `fit` (a new object on every reset) re-measures after a resize even when the count is unchanged
  }, [responsive, fit, fitCount, values.length, setFitCount]);

  React.useEffect(() => {
    if (!responsive) return;
    const el = listRef.current?.parentElement;
    if (!el) return;
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      setFitCount(values.length);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [responsive, values.length, setFitCount]);

  // Keep focus on a chip after it moves
  React.useEffect(() => {
    if (refocusIndex.current == null) return;
    const el = listRef.current?.parentElement?.querySelector<HTMLElement>(
      `[data-chip-index="${refocusIndex.current}"]`,
    );
    refocusIndex.current = null;
    el?.focus();
  });

  const move = (from: number, to: number) => {
    if (to < 0 || to >= values.length || from === to) return;
    moveValue(from, to);
    refocusIndex.current = to;
    ctx.announce(labels.moved(itemToLabel(values[from]), to + 1, values.length));
  };

  if (ctx.selectionDisplay === "count") {
    if (values.length === 0) return null;
    return (
      <span data-slot="combobox-count" className={chipClasses(size)}>
        <span className="truncate">{labels.selectedCount(values.length)}</span>
        <IconTooltip label={labels.clearAll}>
          <BaseCombobox.Clear
            data-slot="combobox-count-clear"
            className={cn(controlButtonClasses, "size-5", hideWhenLocked)}
          >
            <X aria-hidden="true" className="size-3" />
          </BaseCombobox.Clear>
        </IconTooltip>
      </span>
    );
  }

  return (
    <>
      <span
        ref={listRef}
        hidden
        // Tracks focus inside the chips row (chips + input) without a wrapper element
      />
      {values.map((value, index) => {
        const label = itemToLabel(value);
        const fixed = isFixed(value);
        const isHidden = index >= limit;
        return (
          <BaseCombobox.Chip
            key={`${label}-${index}`}
            data-slot="combobox-chip"
            data-chip-index={index}
            data-fixed={fixed ? "" : undefined}
            hidden={isHidden}
            draggable={reorderable && !ctx.fullScreen ? true : undefined}
            className={cn(chipClasses(size, fixed), reorderable && "cursor-grab")}
            onFocus={() => setFocusWithin(true)}
            onBlur={(event: React.FocusEvent) => {
              // Moving to the input hands over to its own focus tracking
              const next = event.relatedTarget as Element | null;
              if (!next?.closest?.("[data-chip-index]")) setFocusWithin(false);
            }}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (!reorderable || !event.altKey || !event.shiftKey) return;
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                event.stopPropagation();
                const rtl =
                  getComputedStyle(event.currentTarget as HTMLElement).direction === "rtl";
                const forward = event.key === (rtl ? "ArrowLeft" : "ArrowRight");
                move(index, forward ? index + 1 : index - 1);
              }
            }}
            onMouseDown={(event: React.MouseEvent & { baseUIHandlerPrevented?: boolean }) => {
              // Base UI's Chips container prevents mousedown (to keep focus in the
              // input), which also cancels native drag. Let reorderable chips drag.
              if (reorderable && !(event.target as Element).closest("button")) {
                event.baseUIHandlerPrevented = true;
              }
            }}
            onDragStart={(event: React.DragEvent) => {
              dragFrom.current = index;
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", label);
            }}
            onDragOver={(event: React.DragEvent) => {
              if (dragFrom.current == null) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event: React.DragEvent) => {
              event.preventDefault();
              if (dragFrom.current != null) move(dragFrom.current, index);
              dragFrom.current = null;
            }}
            onDragEnd={() => {
              dragFrom.current = null;
              inputRef.current?.focus();
            }}
          >
            <span data-slot="combobox-chip-label" className="truncate">
              {label}
            </span>
            {!fixed && (
              <IconTooltip label={labels.removeChip(label)}>
                <BaseCombobox.ChipRemove
                  data-slot="combobox-chip-remove"
                  className={cn(controlButtonClasses, "size-5", hideWhenLocked)}
                >
                  <X aria-hidden="true" className="size-3" />
                </BaseCombobox.ChipRemove>
              </IconTooltip>
            )}
          </BaseCombobox.Chip>
        );
      })}
      {hidden > 0 && (
        <span
          data-slot="combobox-chip-more"
          className={cn(chipClasses(size, true), "text-fg-muted")}
        >
          {labels.moreChips(hidden)}
        </span>
      )}
    </>
  );
}

/* ============================================================
 * Input (auto-renders the control)
 * ============================================================ */

export interface ComboboxInputProps extends React.ComponentProps<typeof BaseCombobox.Input> {
  /** Leading icon. Decorative. */
  startIcon?: React.ReactNode;
  /** Show a clear button while there is a value. Default `true`. */
  showClear?: boolean;
  /** Show the chevron button that opens the list. Default `true` for Combobox, `false` for Autocomplete. */
  showTrigger?: boolean;
  /** Props for the control element that wraps the input. */
  controlProps?: React.ComponentProps<typeof BaseCombobox.InputGroup>;
}

export function createInput(kind: ComboboxKind) {
  const { InputGroup, Trigger } = primitives[kind];
  const Input = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
    (
      {
        className,
        startIcon,
        showClear = true,
        showTrigger = kind === "combobox",
        controlProps,
        onKeyDown,
        onPaste,
        onFocus,
        onBlur,
        "aria-describedby": ariaDescribedBy,
        ...props
      },
      forwardedRef,
    ) => {
      const ctx = useComboboxContext(`${kindName(kind)}.Input`);
      const inputRef = React.useRef<HTMLInputElement>(null);
      const ref = useMergedRef(forwardedRef, inputRef);
      const hintId = React.useId();
      const [editing, setEditing] = React.useState(false);
      const values = ctx.multiple && Array.isArray(ctx.value) ? (ctx.value as unknown[]) : [];
      const hasChips = values.length > 0 && ctx.selectionDisplay === "chips";

      const describedBy = cn(ariaDescribedBy, hasChips && hintId).trim() || undefined;

      // The consumer's handlers run first; preventDefault() skips ours (delimiters,
      // paste splitting, submitOnEnter).
      const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event as never);
        if (!event.defaultPrevented) ctx.tagHandlers?.onKeyDown(event);
      };
      const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(event as never);
        if (!event.defaultPrevented) ctx.tagHandlers?.onPaste(event);
      };

      // Full screen (narrow screens): the field becomes a button that opens the
      // sheet, and the real input moves into the sheet's header (Base UI's
      // input-inside-popup pattern; the button takes the combobox role).
      if (ctx.fullScreen) {
        ctx.fullScreenInputRef.current = {
          props: {
            ...props,
            "aria-describedby": ariaDescribedBy,
            onKeyDown: handleKeyDown,
            onPaste: handlePaste,
            onFocus,
            onBlur,
            ref,
          } as never,
          startIcon,
        };
        const summary = ctx.multiple
          ? values.map((v) => ctx.itemToLabel(v)).join(", ")
          : kind === "combobox"
            ? ctx.value != null
              ? ctx.itemToLabel(ctx.value)
              : ""
            : ctx.inputValue;
        return (
          <Trigger
            data-slot={`${kind}-control`}
            data-full-screen=""
            aria-label={(props["aria-label"] as string | undefined) ?? undefined}
            className={cn(
              controlClasses(ctx),
              "cursor-default gap-2 pe-2 text-start",
              triggerOpenClasses,
            )}
          >
            {startIcon != null && (
              <span
                aria-hidden="true"
                className="text-fg-muted flex shrink-0 items-center ps-0.5 [&_svg]:size-[var(--sp-control-icon)]"
              >
                {startIcon}
              </span>
            )}
            <span
              data-slot={`${kind}-value`}
              className={cn(
                "min-w-0 flex-1 truncate",
                startIcon == null && "ps-1",
                !summary && "text-fg-muted",
              )}
            >
              {summary || (props.placeholder as string | undefined)}
            </span>
            <CaretDown
              aria-hidden="true"
              weight="bold"
              className="text-fg-muted size-3.5 shrink-0"
            />
          </Trigger>
        );
      }
      ctx.fullScreenInputRef.current = null;

      const input = (
        <BaseCombobox.Input
          ref={ref}
          data-slot={`${kind}-input`}
          className={mergeClassName(
            cn(
              inputClasses,
              // In the chips row: control − 2×2px border − 2×3px row padding
              ctx.multiple && "h-[calc(var(--sp-cb-height)-10px)]",
              startIcon == null && !ctx.multiple && "ps-3",
            ),
            className,
          )}
          {...props}
          aria-describedby={describedBy}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={(event) => {
            setEditing(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setEditing(false);
            onBlur?.(event);
          }}
          placeholder={values.length > 0 ? undefined : props.placeholder}
        />
      );

      return (
        // One delay group for every tooltip in the control: the first waits,
        // the next ones show at once as the pointer moves along the chips.
        <Tooltip.Provider>
          <InputGroup
            data-slot={`${kind}-control`}
            data-size={ctx.size}
            data-valid={ctx.valid && !ctx.warning ? "" : undefined}
            data-warning={ctx.warning ? "" : undefined}
            {...controlProps}
            className={cn(controlClasses(ctx), controlProps?.className)}
          >
            {startIcon != null && (
              <span
                data-slot={`${kind}-start-icon`}
                aria-hidden="true"
                className="text-fg-muted flex shrink-0 items-center pe-1.5 ps-2.5 [&_svg]:size-[var(--sp-control-icon)]"
              >
                {startIcon}
              </span>
            )}
            {ctx.multiple ? (
              <BaseCombobox.Chips
                data-slot={`${kind}-chips`}
                className={cn(
                  "flex min-w-0 flex-1 flex-wrap items-center gap-1 py-[3px]",
                  startIcon == null && "ps-1.5",
                )}
              >
                <ChipList values={values} inputRef={inputRef} editing={editing} />
                {input}
              </BaseCombobox.Chips>
            ) : (
              input
            )}
            <Announcer kind={kind} text={ctx.announcement.text} />
            {hasChips && (
              <span id={hintId} hidden>
                {ctx.labels.chipsHint}
                {ctx.reorderable ? `. ${ctx.labels.reorderHint}` : ""}
              </span>
            )}
            <span
              data-slot={`${kind}-end`}
              className="flex shrink-0 items-center gap-1 self-stretch pe-1.5 ps-1"
            >
              {ctx.loading && (
                <Spinner
                  aria-hidden="true"
                  role={undefined}
                  data-slot={`${kind}-spinner`}
                  className="text-fg-muted size-4"
                />
              )}
              {ctx.valid && !ctx.warning && !ctx.loading && (
                <CheckCircle
                  aria-hidden="true"
                  weight="fill"
                  data-slot={`${kind}-valid-icon`}
                  className="text-success size-4"
                />
              )}
              {showClear && ctx.selectionDisplay !== "count" && (
                <IconTooltip label={ctx.multiple ? ctx.labels.clearAll : ctx.labels.clear}>
                  <BaseCombobox.Clear
                    data-slot={`${kind}-clear`}
                    className={cn(
                      controlButtonClasses,
                      "group-has-[input:disabled]/cb-control:hidden group-has-[input[readonly]]/cb-control:hidden",
                    )}
                  >
                    <X aria-hidden="true" className="size-3.5" />
                  </BaseCombobox.Clear>
                </IconTooltip>
              )}
              {showTrigger && (
                <>
                  <span
                    aria-hidden="true"
                    data-slot={`${kind}-divider`}
                    className="bg-border-default hidden h-4 w-px group-has-[input:disabled]/cb-control:!hidden group-has-[input[readonly]]/cb-control:!hidden [[data-slot$=-clear]+&]:block"
                  />
                  {/* Base UI labels the trigger with the field label ("Fruit", same as
                    the input). The tooltip names it for what it does instead, so
                    voice-control users can say "click Show options". Hidden while
                    the list is open: it would describe the wrong action. */}
                  <IconTooltip label={ctx.labels.toggle} disabled={ctx.open}>
                    <Trigger
                      data-slot={`${kind}-trigger`}
                      className={cn(controlButtonClasses, triggerOpenClasses, "group/cb-trigger")}
                    >
                      <CaretDown
                        aria-hidden="true"
                        weight="bold"
                        className="size-3.5 transition-transform duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] group-aria-expanded/cb-trigger:rotate-180 motion-reduce:transition-none"
                      />
                    </Trigger>
                  </IconTooltip>
                </>
              )}
            </span>
          </InputGroup>
        </Tooltip.Provider>
      );
    },
  );
  Input.displayName = `${kindName(kind)}.Input`;
  return Input;
}

/* ============================================================
 * Content (Portal + Positioner + Popup + scrolling list + state rows)
 * ============================================================ */

export interface ComboboxContentProps extends Omit<
  React.ComponentProps<typeof BaseCombobox.Popup>,
  "children"
> {
  children?: React.ReactNode;
  /** Max height of the list before it scrolls (any CSS length). Default `20rem`. */
  maxHeight?: string;
  /** Content above the list (Mantine/Primer header). */
  header?: React.ReactNode;
  /** Content below the list, e.g. actions (Primer SelectPanel footer). */
  footer?: React.ReactNode;
  /** Text or node for the empty state. Defaults to `labels.noResults`. */
  empty?: React.ReactNode;
  /** Keep group labels visible while scrolling. */
  stickyGroupLabels?: boolean;
  /** Props for Base UI's Positioner (side, align, sideOffset, collisionPadding…). */
  positionerProps?: React.ComponentProps<typeof BaseCombobox.Positioner>;
  /** Props for the Portal (e.g. `container`). */
  portalProps?: React.ComponentProps<typeof BaseCombobox.Portal>;
  /** Extra props for the ScrollArea around the list. */
  scrollAreaProps?: Partial<React.ComponentProps<typeof ScrollArea.Root>>;
}

const popupClasses = cn(
  "bg-surface-overlay text-fg-default border-border-default flex flex-col overflow-hidden rounded-[var(--radius-DEFAULT)] border shadow-lg outline-none [--sp-nested-radius:6px]",
  // At least as wide as the input; may grow for long options
  "w-[var(--anchor-width)] min-w-40 max-w-[var(--available-width)]",
  "max-h-[min(var(--available-height),calc(var(--sp-cb-max-height,20rem)+var(--sp-cb-chrome,0px)))]",
  // Animation (Menu), skipped when opened from the keyboard
  "origin-[var(--transform-origin)]",
  "transition-[transform,scale,opacity] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
  "data-[keyboard-open]:transition-none",
  "motion-reduce:transition-none",
);

/** Full-screen sheet on narrow screens (Primer SelectPanel, Spectrum tray). */
const fullScreenPositioner =
  "!fixed !inset-0 !h-dvh !w-screen !translate-x-0 !translate-y-0 ![transform:none]";
const fullScreenPopup =
  "h-dvh max-h-none w-screen max-w-none rounded-none border-0 shadow-none data-[starting-style]:scale-100 data-[ending-style]:scale-100";

const rowClasses = "text-fg-muted flex items-center gap-2 px-2 py-2 text-sm";

export function createContent(kind: ComboboxKind) {
  const Content = React.forwardRef<HTMLDivElement, ComboboxContentProps>(
    (
      {
        className,
        children,
        maxHeight,
        header,
        footer,
        empty,
        stickyGroupLabels = false,
        positionerProps,
        portalProps,
        scrollAreaProps,
        style,
        ...props
      },
      ref,
    ) => {
      const ctx = useComboboxContext(`${kindName(kind)}.Content`);
      const { labels } = ctx;
      const query = ctx.inputValue.trim();
      const belowMin = ctx.minLength > 0 && query.length < ctx.minLength;

      React.useEffect(() => {
        ctx.setStickyGroupLabels(stickyGroupLabels);
      }, [stickyGroupLabels, ctx.setStickyGroupLabels]); // eslint-disable-line react-hooks/exhaustive-deps

      // Announce errors when they appear (the error row itself is not a live region)
      const errorText =
        ctx.error === true ? labels.error : typeof ctx.error === "string" ? ctx.error : null;
      const hasError = ctx.error != null && ctx.error !== false;

      // Composed options (no `items`): Root can't swap the collection, so the
      // list is hidden below `minLength` and replaced by "Try again" on error.
      let listContent: React.ReactNode = children ?? <List kind={kind} />;
      if (ctx.composed && hasError) {
        listContent = (
          <List kind={kind}>
            <SentinelItem kind={kind} item={RETRY} />
          </List>
        );
      } else if (ctx.composed && belowMin) {
        listContent = null;
      }

      let emptyContent: React.ReactNode;
      if (belowMin) {
        emptyContent = labels.minLength(ctx.minLength);
      } else if (ctx.loading) {
        emptyContent = (
          <span className="flex items-center justify-center gap-2">
            <Spinner aria-hidden="true" role={undefined} className="size-4" />
            {labels.loading}
          </span>
        );
      } else {
        emptyContent = empty ?? labels.noResults;
      }

      return (
        <BaseCombobox.Portal {...portalProps}>
          <BaseCombobox.Positioner
            sideOffset={4}
            align="start"
            data-slot={`${kind}-positioner`}
            {...positionerProps}
            className={cn(
              "z-50 outline-none",
              ctx.fullScreen && fullScreenPositioner,
              positionerProps?.className as string,
            )}
          >
            <BaseCombobox.Popup
              ref={ref}
              data-slot={`${kind}-popup`}
              data-size={ctx.size}
              data-highlight={ctx.highlight}
              data-keyboard-open={ctx.keyboardOpen ? "" : undefined}
              data-full-screen={ctx.fullScreen ? "" : undefined}
              aria-busy={ctx.loading || undefined}
              style={
                {
                  ...(maxHeight ? { "--sp-cb-max-height": maxHeight } : null),
                  ...style,
                } as React.CSSProperties
              }
              className={mergeClassName(
                cn(popupClasses, ctx.fullScreen && fullScreenPopup),
                className,
              )}
              {...props}
            >
              {ctx.fullScreen && <FullScreenHeader kind={kind} />}
              {header != null && (
                <div
                  data-slot={`${kind}-header`}
                  className="border-border-default shrink-0 border-b px-3 py-2 text-sm"
                >
                  {header}
                </div>
              )}
              {hasError ? (
                <div
                  data-slot={`${kind}-error`}
                  className={cn(rowClasses, "text-danger shrink-0 px-3 pb-0")}
                >
                  <WarningCircle aria-hidden="true" weight="fill" className="size-4 shrink-0" />
                  <ErrorText text={errorText}>{errorText ?? ctx.error}</ErrorText>
                </div>
              ) : null}
              {ctx.atMax && ctx.maxSelected != null && (
                <div
                  data-slot={`${kind}-max-notice`}
                  className={cn(rowClasses, "shrink-0 px-3 pb-0 text-[0.8125rem]")}
                >
                  {labels.maxSelected(ctx.maxSelected)}
                </div>
              )}
              <ListScroller kind={kind} scrollAreaProps={scrollAreaProps}>
                {listContent}
                {ctx.loading && ctx.hasMore && <LoadingMoreRow kind={kind} />}
              </ListScroller>
              <BaseCombobox.Empty
                data-slot={`${kind}-empty`}
                className="text-fg-muted shrink-0 px-3 py-4 text-center text-sm empty:hidden"
              >
                {emptyContent}
              </BaseCombobox.Empty>
              {footer != null && (
                <div
                  data-slot={`${kind}-footer`}
                  className="border-border-default flex shrink-0 items-center justify-end gap-2 border-t p-2"
                >
                  {footer}
                </div>
              )}
              <Status kind={kind} />
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      );
    },
  );
  Content.displayName = `${kindName(kind)}.Content`;
  return Content;
}

/** "Loading more…" row under the list while `loading` with items present. */
function LoadingMoreRow({ kind }: { kind: ComboboxKind }) {
  const ctx = useComboboxContext(`${kindName(kind)}.Content`);
  const items = BaseCombobox.useFilteredItems<unknown>();
  if (items.length === 0) return null;
  return (
    <div data-slot={`${kind}-loading-more`} className={cn(rowClasses, "justify-center")}>
      <Spinner aria-hidden="true" role={undefined} className="size-4" />
      {ctx.labels.loadingMore}
    </div>
  );
}

const ViewportElementContext = React.createContext<{
  viewport: HTMLDivElement | null;
}>({ viewport: null });

/**
 * ScrollArea around the list. The viewport is a scroll container only:
 * focus stays in the input (`aria-activedescendant`), so the viewport's
 * conditional `role="region"` and tab stop are removed. The listbox
 * inside already carries the name and role.
 */
function ListScroller({
  kind,
  children,
  scrollAreaProps,
}: {
  kind: ComboboxKind;
  children: React.ReactNode;
  scrollAreaProps?: Partial<React.ComponentProps<typeof ScrollArea.Root>>;
}) {
  const ctx = useComboboxContext(`${kindName(kind)}.Content`);
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null);
  const { viewportProps, className, ...rest } = scrollAreaProps ?? {};
  return (
    <ViewportElementContext.Provider value={{ viewport }}>
      <ScrollArea.Root
        data-slot={`${kind}-scroll-area`}
        type="auto"
        size="sm"
        scrollbars="y"
        overscrollBehavior="contain"
        edgeIndicator={ctx.stickyGroupLabels ? "shadow" : "fade"}
        aria-label={ctx.labels.options}
        viewportRef={setViewport}
        onBottomReached={() => {
          if (ctx.hasMore && !ctx.loading) ctx.onLoadMore?.();
        }}
        viewportProps={{
          ...viewportProps,
          className: cn("max-h-[inherit]", viewportProps?.className as string),
          render: (
            renderProps: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
          ) => (
            <div
              {...renderProps}
              role={undefined}
              aria-label={undefined}
              aria-labelledby={undefined}
              tabIndex={-1}
            />
          ),
        }}
        className={cn(
          "flex min-h-0 flex-1 flex-col [&>[data-slot=scroll-area-viewport]]:min-h-0 [&>[data-slot=scroll-area-viewport]]:flex-1",
          className as string,
        )}
        {...rest}
      >
        {children}
      </ScrollArea.Root>
    </ViewportElementContext.Provider>
  );
}

/* ============================================================
 * Status (polite result-count announcements, GOV.UK)
 * ============================================================ */

function Status({ kind }: { kind: ComboboxKind }) {
  const ctx = useComboboxContext(`${kindName(kind)}.Status`);
  const filtered = BaseCombobox.useFilteredItems<unknown>();
  const count = flattenItems(filtered).filter((item) => !isSentinel(item)).length;
  const [text, setText] = React.useState("");
  const toggle = React.useRef(false);
  const belowMin = ctx.minLength > 0 && ctx.inputValue.trim().length < ctx.minLength;

  // Counts only. Empty, loading and too-short states live in Base UI's Empty,
  // which is its own polite live region; announcing them here would double up.
  const message =
    !ctx.open || ctx.loading || ctx.error || belowMin || count === 0
      ? ""
      : ctx.labels.results(count);

  React.useEffect(() => {
    if (!message) {
      setText("");
      return;
    }
    const timer = window.setTimeout(() => {
      // Silent straight after a selection (GOV.UK)
      if (Date.now() - ctx.lastSelectionAt.current < ctx.statusDelay) return;
      // Alternate a trailing no-break space so a repeated message is re-read
      toggle.current = !toggle.current;
      setText(message + (toggle.current ? " " : ""));
    }, ctx.statusDelay);
    return () => window.clearTimeout(timer);
  }, [message, ctx.statusDelay, ctx.lastSelectionAt]);

  return (
    <BaseCombobox.Status data-slot={`${kind}-status`} className="sr-only">
      {text}
    </BaseCombobox.Status>
  );
}

/* ============================================================
 * List and VirtualList
 * ============================================================ */

export interface ComboboxListProps extends Omit<
  React.ComponentProps<typeof BaseCombobox.List>,
  "children"
> {
  /** Render function per item (or group), or static children. Defaults to an Item per item. */
  children?: React.ReactNode | ((item: any, index: number) => React.ReactNode);
}

/** Renders our own rows for sentinel items, and the consumer's for the rest. */
function renderWithSentinels(
  kind: ComboboxKind,
  render: ((item: any, index: number) => React.ReactNode) | undefined,
) {
  // A render callback for Base UI's List, not a component.
  // eslint-disable-next-line react/display-name
  return (item: unknown, index: number) => {
    const sentinel = sentinelKind(item);
    if (sentinel) return <SentinelItem key={`__${sentinel}`} kind={kind} item={item as Sentinel} />;
    if (render) return render(item, index);
    if (isGroupList([item])) {
      const group = item as ItemGroup;
      return (
        <GroupWithItems
          key={String(group.value ?? group.label ?? index)}
          kind={kind}
          group={group}
        />
      );
    }
    return <ItemBase key={defaultItemKey(item, index)} kind={kind} value={item} />;
  };
}

function defaultItemKey(item: unknown, index: number) {
  if (item != null && typeof item === "object") {
    const record = item as Record<string, unknown>;
    if (record.id != null) return String(record.id);
    if (record.value != null) return String(record.value);
  }
  return `${defaultItemLabel(item)}-${index}`;
}

/** Default rendering for a group from `items` (`{ value/label, items }`). */
function GroupWithItems({ kind, group }: { kind: ComboboxKind; group: ItemGroup }) {
  const label = group.label ?? (typeof group.value === "string" ? group.value : undefined);
  return (
    <Group kind={kind} items={group.items as any[]}>
      {label && <GroupLabel kind={kind}>{label}</GroupLabel>}
      <BaseCombobox.Collection>
        {(item: unknown, index: number) => (
          <ItemBase key={defaultItemKey(item, index)} kind={kind} value={item} />
        )}
      </BaseCombobox.Collection>
    </Group>
  );
}

export function List({
  kind,
  className,
  children,
  ...props
}: ComboboxListProps & { kind: ComboboxKind }) {
  const render = typeof children === "function" ? children : undefined;
  return (
    <BaseCombobox.List
      data-slot={`${kind}-list`}
      className={mergeClassName(cn("p-1 outline-none empty:hidden"), className)}
      {...props}
    >
      {typeof children === "function" || children === undefined
        ? (renderWithSentinels(kind, render) as any)
        : children}
    </BaseCombobox.List>
  );
}

export interface ComboboxVirtualListProps {
  /** Render one item. Return an `Item`; its position is set for you. Defaults to an Item per item. */
  children?: (item: any, index: number) => React.ReactNode;
  /** Estimated row height in px. Defaults to the row size. */
  estimateSize?: number;
  /** Rows rendered beyond the visible area. Default 12. */
  overscan?: number;
  className?: string;
}

const estimatedRow: Record<ComboboxSize, number> = { sm: 28, md: 32, lg: 40 };

/**
 * Virtualized list (@tanstack/react-virtual) inside the popup's ScrollArea.
 * Set `virtualized` on Root. Items need flat `items` on Root.
 */
export function VirtualList({
  kind,
  children,
  estimateSize,
  overscan = 12,
  className,
}: ComboboxVirtualListProps & { kind: ComboboxKind }) {
  const ctx = useComboboxContext(`${kindName(kind)}.VirtualList`);
  const { viewport } = React.useContext(ViewportElementContext);
  const items = BaseCombobox.useFilteredItems<unknown>();
  const render = renderWithSentinels(kind, children);

  const virtualizer = useVirtualizer({
    enabled: ctx.open && viewport != null,
    count: items.length,
    getScrollElement: () => viewport,
    estimateSize: () => estimateSize ?? estimatedRow[ctx.size],
    overscan,
    paddingStart: 4,
    paddingEnd: 4,
    scrollPaddingStart: 4,
    scrollPaddingEnd: 4,
  });
  ctx.virtualizerRef.current = virtualizer;
  React.useEffect(() => () => void (ctx.virtualizerRef.current = null), [ctx.virtualizerRef]);

  const total = virtualizer.getTotalSize();
  return (
    <BaseCombobox.List
      data-slot={`${kind}-list`}
      className={mergeClassName(cn("outline-none"), className)}
    >
      {items.length > 0 ? (
        <div role="presentation" className="relative w-full" style={{ height: total }}>
          {virtualizer.getVirtualItems().map((row) => (
            <VirtualRowContext.Provider
              key={row.key}
              value={{
                index: row.index,
                start: row.start,
                setSize: items.length,
                measure: virtualizer.measureElement,
              }}
            >
              {render(items[row.index], row.index)}
            </VirtualRowContext.Provider>
          ))}
        </div>
      ) : null}
    </BaseCombobox.List>
  );
}

/* ============================================================
 * Item
 * ============================================================ */

export interface ComboboxItemProps extends React.ComponentProps<typeof BaseCombobox.Item> {
  /** Leading icon or avatar. Decorative. */
  icon?: React.ReactNode;
  /** Secondary text, announced as the option's description. */
  description?: React.ReactNode;
  /** Content at the end of the row (count, badge). */
  trailing?: React.ReactNode;
  /** Text used for match highlighting when children aren't a string. */
  label?: string;
}

/** Highlights the part of `text` that matches `query`, ignoring case and accents. */
export function Highlight({
  text,
  query,
  kind = "combobox",
}: {
  text: string;
  query: string;
  kind?: ComboboxKind;
}) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const fold = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  // Map each folded char back to its index in the original string
  const map: number[] = [];
  let folded = "";
  for (let i = 0; i < text.length; i += 1) {
    const part = fold(text[i]!);
    for (let j = 0; j < part.length; j += 1) map.push(i);
    folded += part;
  }
  const at = folded.indexOf(fold(q));
  if (at === -1) return <>{text}</>;
  const start = map[at]!;
  const endFolded = at + fold(q).length - 1;
  const end = (map[endFolded] ?? text.length - 1) + 1;
  return (
    <>
      {text.slice(0, start)}
      <mark data-slot={`${kind}-match`} className="bg-transparent font-semibold text-current">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}

const indicatorSlot = "flex size-4 shrink-0 items-center justify-center";

/**
 * Focus position for the highlighted row. The option is the keyboard focus
 * (focus stays in the input via `aria-activedescendant`), so it needs a 3:1
 * indicator (WCAG 1.4.11). Menu's subtle tint measures 1.19–1.45:1, so the
 * subtle style adds a 2px accent bar at the start of the row. Forced colours
 * drop backgrounds, so the row gets a Highlight outline there.
 */
const highlightIndicator = cn(
  "data-[highlighted]:after:absolute data-[highlighted]:after:inset-y-1 data-[highlighted]:after:start-0 data-[highlighted]:after:w-0.5 data-[highlighted]:after:rounded-full data-[highlighted]:after:bg-accent data-[highlighted]:after:content-['']",
  "[[data-highlight=solid]_&]:data-[highlighted]:after:hidden",
  "forced-colors:data-[highlighted]:outline-solid forced-colors:data-[highlighted]:outline-2 forced-colors:data-[highlighted]:-outline-offset-2 forced-colors:data-[highlighted]:outline-[color:Highlight]",
  // Disabled options: Base UI still highlights them on hover (and on arrow
  // keys — it navigates through disabled options by design, as the APG
  // pattern does). Pointer hover gets no tint, no bar and no solid fill.
  // A keyboard highlight keeps its (faded) visuals so focus stays visible.
  "data-[disabled]:hover:data-[highlighted]:bg-transparent data-[disabled]:hover:data-[highlighted]:text-fg-default",
  "data-[disabled]:hover:after:hidden",
  "forced-colors:data-[disabled]:hover:outline-none",
);

function SelectionIndicator({
  multiple,
  state,
}: {
  multiple: boolean;
  state: "on" | "off" | "mixed";
}) {
  if (!multiple) {
    return (
      <span data-slot="combobox-item-indicator" aria-hidden="true" className={indicatorSlot}>
        {state === "on" && <Check weight="bold" className="size-4" />}
      </span>
    );
  }
  return (
    <span
      data-slot="combobox-item-checkbox"
      data-state={state}
      aria-hidden="true"
      className={cn(
        indicatorSlot,
        "border-border-control bg-surface-base rounded-[3px] border-2",
        state !== "off" && "bg-accent border-accent text-fg-on-brand",
        // Solid highlight: keep the box readable on the accent fill
        "group-data-[highlighted]/menu-item:[[data-highlight=solid]_&]:border-current",
      )}
    >
      {state === "on" && <Check weight="bold" className="size-3" />}
      {state === "mixed" && <span className="h-0.5 w-2 rounded-full bg-current" />}
    </span>
  );
}

function ItemBase({
  kind,
  className,
  children,
  icon,
  description,
  trailing,
  label,
  value,
  disabled,
  style,
  ref: forwardedRef,
  onPointerDown,
  ...props
}: ComboboxItemProps & { kind: ComboboxKind; ref?: React.Ref<HTMLDivElement> }) {
  const ctx = useComboboxContext(`${kindName(kind)}.Item`);
  const row = React.useContext(VirtualRowContext);
  const ref = useMergedRef(forwardedRef, row?.measure);

  // Track disabled options so autoSelectOnBlur never commits one
  const { disabledItems } = ctx;
  React.useEffect(() => {
    if (!disabled) return;
    const set = disabledItems.current;
    set.add(value);
    return () => void set.delete(value);
  }, [disabled, value, disabledItems]);
  const { Item } = primitives[kind];
  const id = React.useId();
  const descId = `${id}-description`;

  const selected = kind === "combobox" && ctx.isSelected(value);
  const maxed = ctx.atMax && !selected;
  const text = label ?? (typeof children === "string" ? children : undefined);
  const labelContent =
    children === undefined ? (
      ctx.highlightMatches ? (
        <Highlight text={ctx.itemToLabel(value)} query={ctx.inputValue} kind={kind} />
      ) : (
        ctx.itemToLabel(value)
      )
    ) : ctx.highlightMatches && text !== undefined && typeof children === "string" ? (
      <Highlight text={text} query={ctx.inputValue} kind={kind} />
    ) : (
      children
    );

  const showIndicator = kind === "combobox";
  const indicator = showIndicator ? (
    <SelectionIndicator multiple={ctx.multiple} state={selected ? "on" : "off"} />
  ) : null;

  const describedBy =
    cn(props["aria-describedby"] as string | undefined, description != null && descId).trim() ||
    undefined;

  const virtualProps = row
    ? {
        index: row.index,
        "data-index": row.index,
        "aria-setsize": row.setSize,
        "aria-posinset": row.index + 1,
        style: {
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: "100%",
          transform: `translateY(${row.start}px)`,
          ...style,
        },
      }
    : { style };

  return (
    <Item
      data-slot={`${kind}-item`}
      value={value}
      disabled={disabled || maxed}
      className={mergeClassName(
        cn(
          menuItemClasses({ size: ctx.size, highlight: ctx.highlight, dividers: false }),
          highlightIndicator,
          "data-[selected]:font-medium",
        ),
        className,
      )}
      {...(props as Record<string, unknown>)}
      {...virtualProps}
      ref={ref}
      aria-describedby={describedBy}
      onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
        ctx.notePressed(value);
        onPointerDown?.(event as never);
      }}
    >
      {showIndicator && ctx.indicatorPosition === "start" && indicator}
      {icon != null && (
        <span data-slot={`${kind}-item-icon`} aria-hidden="true" className="flex items-center">
          {icon}
        </span>
      )}
      <span data-slot={`${kind}-item-content`} className="flex min-w-0 flex-1 flex-col">
        <span data-slot={`${kind}-item-label`} className="truncate">
          {labelContent}
        </span>
        {description != null && (
          <span
            id={descId}
            aria-hidden="true"
            data-slot={`${kind}-item-description`}
            className={cn(
              "text-fg-muted text-[0.8125rem]/snug",
              ctx.highlight === "solid" && "group-data-[highlighted]/menu-item:text-current/85",
            )}
          >
            {description}
          </span>
        )}
      </span>
      {(trailing != null || (showIndicator && ctx.indicatorPosition === "end")) && (
        <span data-slot={`${kind}-item-end`} className="ms-auto flex items-center gap-2">
          {trailing != null && (
            <span
              data-slot={`${kind}-item-trailing`}
              className={cn(
                "text-fg-muted flex items-center",
                ctx.highlight === "solid" && "group-data-[highlighted]/menu-item:text-current/85",
              )}
            >
              {trailing}
            </span>
          )}
          {showIndicator && ctx.indicatorPosition === "end" && indicator}
        </span>
      )}
    </Item>
  );
}

export function createItem(kind: ComboboxKind) {
  const Item = React.forwardRef<HTMLDivElement, ComboboxItemProps>((props, ref) => (
    <ItemBase kind={kind} {...props} ref={ref as never} />
  ));
  Item.displayName = `${kindName(kind)}.Item`;
  return Item;
}

/** Select all, Create "…", Try again. */
function SentinelItem({ kind, item }: { kind: ComboboxKind; item: Sentinel }) {
  const ctx = useComboboxContext(`${kindName(kind)}.Item`);
  const { Item } = primitives[kind];
  const row = React.useContext(VirtualRowContext);
  const sentinel = sentinelKind(item);
  const descId = React.useId();
  const base = cn(
    menuItemClasses({ size: ctx.size, highlight: ctx.highlight, dividers: false }),
    highlightIndicator,
  );
  const virtualProps = row
    ? {
        index: row.index,
        ref: row.measure,
        "aria-setsize": row.setSize,
        "aria-posinset": row.index + 1,
        style: {
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: "100%",
          transform: `translateY(${row.start}px)`,
        },
      }
    : {};

  if (sentinel === "select-all") {
    const state =
      ctx.selectAllState === "all" ? "on" : ctx.selectAllState === "some" ? "mixed" : "off";
    const selectedCount = Array.isArray(ctx.value) ? ctx.value.length : 0;
    return (
      <>
        <Item
          value={item}
          data-slot={`${kind}-select-all`}
          aria-describedby={descId}
          className={cn(base, "font-medium")}
          {...virtualProps}
        >
          {ctx.indicatorPosition === "start" && <SelectionIndicator multiple state={state} />}
          <span className="flex-1">{ctx.labels.selectAll}</span>
          {ctx.indicatorPosition === "end" && <SelectionIndicator multiple state={state} />}
          <span id={descId} hidden>
            {ctx.labels.selectedOf(selectedCount, ctx.selectAllTotal)}
          </span>
        </Item>
        {!row && (
          <BaseCombobox.Separator
            data-slot={`${kind}-separator`}
            className="border-border-default -mx-1 my-1 h-0 border-t"
          />
        )}
      </>
    );
  }

  if (sentinel === "create") {
    const query = (item as Extract<Sentinel, { query: string }>).query;
    return (
      <Item
        value={item}
        data-slot={`${kind}-create`}
        disabled={ctx.atMax}
        className={base}
        {...virtualProps}
      >
        <span aria-hidden="true" className={indicatorSlot}>
          <Plus weight="bold" className="size-4" />
        </span>
        <span className="min-w-0 flex-1 truncate">{ctx.labels.create(query)}</span>
      </Item>
    );
  }

  return (
    <Item
      value={item}
      data-slot={`${kind}-retry`}
      className={base}
      onPointerDown={() => ctx.notePressed(item)}
      {...virtualProps}
    >
      <span className="flex-1">{ctx.labels.retry}</span>
    </Item>
  );
}

/**
 * The error message. It announces itself when it appears, since the row is not
 * a live region; an error given as a node is announced by its text content.
 */
function ErrorText({ text, children }: { text: string | null; children: React.ReactNode }) {
  const ctx = useComboboxContext("Combobox.Content");
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const message = text ?? ref.current?.textContent?.trim();
    if (message) ctx.announce(message);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{children}</span>;
}

/* ============================================================
 * Group, GroupLabel, Separator
 * ============================================================ */

export function Group({
  kind,
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Group> & { kind: ComboboxKind }) {
  return (
    <BaseCombobox.Group
      data-slot={`${kind}-group`}
      className={mergeClassName(cn("[&+&]:mt-1"), className)}
      {...props}
    />
  );
}

export function GroupLabel({
  kind,
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.GroupLabel> & { kind: ComboboxKind }) {
  const ctx = useComboboxContext(`${kindName(kind)}.GroupLabel`);
  return (
    <BaseCombobox.GroupLabel
      data-slot={`${kind}-group-label`}
      className={mergeClassName(
        cn(
          "text-fg-muted px-2 pb-1 pt-2 text-xs font-semibold",
          ctx.stickyGroupLabels &&
            "bg-surface-overlay sticky top-0 z-[1] -mx-1 px-3 shadow-[0_1px_0_var(--sp-border-default)]",
        ),
        className,
      )}
      {...props}
    />
  );
}

export function createSeparator(kind: ComboboxKind) {
  const { Separator: BaseSep } = primitives[kind];
  const Separator = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof BaseCombobox.Separator>
  >(({ className, ...props }, ref) => (
    <BaseSep
      ref={ref}
      data-slot={`${kind}-separator`}
      className={mergeClassName(
        cn("border-border-default -mx-1 my-1 h-0 shrink-0 border-t"),
        className,
      )}
      {...props}
    />
  ));
  Separator.displayName = `${kindName(kind)}.Separator`;
  return Separator;
}

/* ============================================================
 * Full-screen header (narrow screens): close button + input inside popup
 * ============================================================ */

export function FullScreenHeader({ kind }: { kind: ComboboxKind }) {
  const ctx = useComboboxContext(`${kindName(kind)}.Content`);
  const handoff = ctx.fullScreenInputRef.current;
  const inputProps = handoff?.props ?? {};
  const title =
    ctx.fullScreenTitle ??
    (inputProps["aria-label"] as string | undefined) ??
    (inputProps.placeholder as string | undefined);
  return (
    <div
      data-slot={`${kind}-full-screen-header`}
      className="border-border-default flex shrink-0 flex-col gap-3 border-b p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-fg-default text-base font-semibold">{title}</span>
        <Button
          variant="ghost"
          size="icon"
          srOnly={ctx.labels.close}
          icon={<X aria-hidden="true" className="size-4" />}
          data-slot={`${kind}-close`}
          onClick={ctx.close}
        />
      </div>
      <div data-slot={`${kind}-control`} className={controlClasses(ctx)}>
        {handoff?.startIcon != null && (
          <span
            aria-hidden="true"
            className="text-fg-muted flex shrink-0 items-center pe-1.5 ps-2.5 [&_svg]:size-[var(--sp-control-icon)]"
          >
            {handoff.startIcon}
          </span>
        )}
        <BaseCombobox.Input
          data-slot={`${kind}-input`}
          aria-label={typeof title === "string" ? title : undefined}
          {...inputProps}
          className={cn(
            inputClasses,
            handoff?.startIcon == null && "ps-3",
            inputProps.className as string,
          )}
        />
      </div>
      <span role="status" aria-live="polite" data-slot={`${kind}-announcer`} className="sr-only">
        {ctx.announcement.text}
      </span>
    </div>
  );
}

/* ============================================================
 * Utils
 * ============================================================ */

export function kindName(kind: ComboboxKind) {
  return kind === "combobox" ? "Combobox" : "Autocomplete";
}

export function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
  return React.useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (typeof ref === "function") ref(value);
        else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
      }
    },
    refs, // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export { controlButtonClasses, triggerOpenClasses, chipClasses };
