import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { Tooltip } from "../Tooltip/Tooltip";
import { Button } from "../Button/Button";
import { cn } from "../../lib/cn";

/* ============================================================
 * Types
 * ============================================================ */

export type SliderSize = "sm" | "md" | "lg";
export type SliderValueLabel = "auto" | "always" | "off";
export type SliderTrack = "normal" | "inverted" | "none";

export interface SliderMark {
  value: number;
  /** Text under (or beside) the tick. Decorative: the thumb announces its own value. */
  label?: React.ReactNode;
  /** Snap to this value without drawing a tick (Mantine). */
  hidden?: boolean;
}

export interface SliderEditable {
  /** Fewest handles allowed. @default 1 */
  minCount?: number;
  /** Most handles allowed. @default Infinity */
  maxCount?: number;
}

type ChangeDetails = BaseSlider.Root.ChangeEventDetails | undefined;
type CommitDetails = BaseSlider.Root.CommitEventDetails | undefined;
type BaseRootProps = BaseSlider.Root.Props<number | readonly number[]>;

export interface SliderRootProps<V extends number | number[] = number | number[]> extends Omit<
  BaseRootProps,
  "value" | "defaultValue" | "onValueChange" | "onValueCommitted" | "children"
> {
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V, details: ChangeDetails) => void;
  onValueCommitted?: (value: V, details: CommitDetails) => void;
  children?: React.ReactNode;
  /** Track thickness and thumb size. @default "md" */
  size?: SliderSize;
  /** Success colouring (Southpaw `valid` pattern). Invalid comes from Field. */
  valid?: boolean;
  /** Focusable and announced, but the value can't change (Chakra, Carbon). */
  readOnly?: boolean;
  /** Ticks on the track: `true` = one per step, or values / `{ value, label, hidden }`. */
  marks?: boolean | ReadonlyArray<number | SliderMark>;
  /** Only allow mark values (Mantine `restrictToMarks`, MUI/Ant `step={null}`). */
  restrictToMarks?: boolean;
  /** Value label on the thumb (a Tooltip). @default "auto" — on hover, focus and drag */
  valueLabel?: SliderValueLabel;
  /** Formats a (scaled) value for the label, `Slider.Value` and `aria-valuetext`. */
  formatValue?: (value: number, index: number) => string;
  /** Maps the slider value to the displayed value, e.g. `(v) => 2 ** v` (MUI, Mantine). */
  scale?: (value: number) => number;
  /** Where the fill starts: `start`, `center`, or a value (Chakra, Mantine, Spectrum). */
  origin?: "start" | "center" | number;
  /** Fill style: `normal`, `inverted`, or `none` (MUI `track`). @default "normal" */
  track?: SliderTrack;
  /** Drag the filled range to move every thumb at once (Ant `draggableTrack`). */
  draggableTrack?: boolean;
  /** Let the user add and remove handles (Ant `range.editable`). */
  editable?: boolean | SliderEditable;
  /** Show the formatted min and max under the track (Carbon). */
  showMinMax?: boolean;
  /** Accessible name per thumb. Defaults to "Minimum"/"Maximum" for two thumbs. */
  getAriaLabel?: (index: number, count: number) => string;
}

/* ============================================================
 * Context
 * ============================================================ */

interface SliderContextValue {
  values: number[];
  min: number;
  max: number;
  orientation: "horizontal" | "vertical";
  size: SliderSize;
  disabled: boolean;
  readOnly: boolean;
  marks: SliderMark[];
  track: SliderTrack;
  originValue: number;
  valueLabel: SliderValueLabel;
  draggableTrack: boolean;
  editable: Required<SliderEditable> | null;
  percent: (value: number) => number;
  display: (value: number, index: number) => string;
  hasCustomDisplay: boolean;
  ariaLabel: (index: number) => string | undefined;
  /** Replace all values (non-Base changes: marks keyboard, track drag, add/remove). */
  setValues: (next: number[], commit?: boolean) => void;
  snap: (value: number) => number;
  restrictToMarks: boolean;
  step: number;
  // interaction state for the value label
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  focusedIndex: number | null;
  focusVisible: boolean;
  setFocus: (index: number | null, visible: boolean) => void;
  dragging: boolean;
  activeIndex: number | null;
  setDragging: (dragging: boolean) => void;
  setActiveIndex: (index: number | null) => void;
  lastFocusedIndex: number;
  addHandle: (at?: number) => void;
  removeHandle: (index: number) => void;
  removingIndex: number | null;
  setRemovingIndex: (index: number | null) => void;
  trackRef: React.RefObject<HTMLDivElement | null>;
  controlRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
  valueFromPointer: (clientX: number, clientY: number) => number;
}

const SliderContext = React.createContext<SliderContextValue | null>(null);

function useSlider(part: string) {
  const ctx = React.useContext(SliderContext);
  if (!ctx) throw new Error(`Slider.${part} must be used inside Slider.Root`);
  return ctx;
}

const toArray = (v: number | readonly number[]) => (Array.isArray(v) ? [...v] : [v as number]);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function roundToStep(value: number, step: number, min: number) {
  const rounded = Math.round((value - min) / step) * step + min;
  // Avoid float noise like 0.30000000000000004
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(rounded.toFixed(decimals));
}

/* ============================================================
 * Root
 * ============================================================ */

// Thumb size follows the density's icon size (16 / 20 / 24px for md); track thickness is fixed.
const sizeVars: Record<SliderSize, string> = {
  sm: "[--sp-slider-track-size:4px] [--sp-slider-thumb:calc(var(--sp-control-icon)*0.8)]",
  md: "[--sp-slider-track-size:6px] [--sp-slider-thumb:var(--sp-control-icon)]",
  lg: "[--sp-slider-track-size:8px] [--sp-slider-thumb:calc(var(--sp-control-icon)*1.2)]",
};

function RootInner<V extends number | number[]>(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    onValueCommitted,
    min = 0,
    max = 100,
    step = 1,
    orientation = "horizontal",
    disabled = false,
    size = "md",
    valid = false,
    readOnly = false,
    marks: marksProp,
    restrictToMarks = false,
    valueLabel = "auto",
    formatValue,
    scale,
    origin = "start",
    track = "normal",
    draggableTrack = false,
    editable: editableProp,
    showMinMax = false,
    getAriaLabel,
    "aria-label": rootAriaLabel,
    format,
    locale,
    className,
    children,
    ...props
  }: SliderRootProps<V>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const isArray = Array.isArray(valueProp ?? defaultValue);
  const [internal, setInternal] = React.useState<number[]>(() =>
    toArray((valueProp ?? defaultValue ?? min) as number | number[]),
  );
  const values = valueProp !== undefined ? toArray(valueProp) : internal;
  const valuesRef = React.useRef(values);
  valuesRef.current = values;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const controlRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const editable = React.useMemo<Required<SliderEditable> | null>(() => {
    if (!editableProp) return null;
    const opts = editableProp === true ? {} : editableProp;
    return { minCount: opts.minCount ?? 1, maxCount: opts.maxCount ?? Infinity };
  }, [editableProp]);

  // ---- marks -------------------------------------------------
  const marks = React.useMemo<SliderMark[]>(() => {
    if (!marksProp) return [];
    if (marksProp === true) {
      const count = Math.floor((max - min) / step);
      if (count > 200) return []; // too dense to draw
      return Array.from({ length: count + 1 }, (_, i) => ({
        value: roundToStep(min + i * step, step, min),
      }));
    }
    return marksProp
      .map((m) => (typeof m === "number" ? { value: m } : m))
      .filter((m) => m.value >= min && m.value <= max)
      .sort((a, b) => a.value - b.value);
  }, [marksProp, min, max, step]);

  const snap = React.useCallback(
    (v: number) => {
      if (!restrictToMarks || marks.length === 0) return v;
      return marks.reduce(
        (best, m) => (Math.abs(m.value - v) < Math.abs(best - v) ? m.value : best),
        marks[0]!.value,
      );
    },
    [restrictToMarks, marks],
  );

  // ---- formatting -------------------------------------------
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const display = React.useCallback(
    (v: number, index: number) => {
      const shown = scale ? scale(v) : v;
      return formatValue ? formatValue(shown, index) : formatter.format(shown);
    },
    [scale, formatValue, formatter],
  );
  const percent = React.useCallback(
    (v: number) => (max === min ? 0 : ((clamp(v, min, max) - min) / (max - min)) * 100),
    [min, max],
  );
  const originValue =
    origin === "start" ? min : origin === "center" ? (min + max) / 2 : clamp(origin, min, max);

  const ariaLabel = React.useCallback(
    (index: number) => {
      const count = valuesRef.current.length;
      if (getAriaLabel) return getAriaLabel(index, count);
      // `aria-label` on Root names the thumb(s): Base UI leaves it on the root div,
      // where it labels nothing.
      if (count < 2) return rootAriaLabel;
      const prefix = rootAriaLabel ? `${rootAriaLabel}, ` : "";
      const part =
        count === 2 ? (index === 0 ? "minimum" : "maximum") : `handle ${index + 1} of ${count}`;
      const text = `${prefix}${part}`;
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    [getAriaLabel, rootAriaLabel],
  );

  // ---- value updates ----------------------------------------
  const emit = React.useCallback(
    (next: number[], details: ChangeDetails) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.((isArray ? next : next[0]) as V, details);
    },
    [valueProp, onValueChange, isArray],
  );

  const commit = React.useCallback(
    (details: CommitDetails) => {
      const current = valuesRef.current;
      onValueCommitted?.((isArray ? current : current[0]) as V, details);
    },
    [onValueCommitted, isArray],
  );

  const setValues = React.useCallback(
    (next: number[], shouldCommit = true) => {
      if (readOnly || disabled) return;
      next = next.map(snap);
      valuesRef.current = next;
      emit(next, undefined);
      if (shouldCommit) commit(undefined);
    },
    [readOnly, disabled, snap, emit, commit],
  );

  const handleBaseChange = React.useCallback(
    (v: number | readonly number[], details: BaseSlider.Root.ChangeEventDetails) => {
      if (readOnly) return;
      const next = toArray(v).map(snap);
      valuesRef.current = next;
      emit(next, details);
      setActiveIndex(details.activeThumbIndex);
    },
    [readOnly, snap, emit],
  );

  // ---- interaction state (value label, drag-off removal) -----
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const [lastFocusedIndex, setLastFocusedIndex] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [removingIndex, setRemovingIndexState] = React.useState<number | null>(null);
  const removingRef = React.useRef<number | null>(null);
  const setRemovingIndex = React.useCallback((index: number | null) => {
    removingRef.current = index;
    setRemovingIndexState(index);
  }, []);
  const removeHandleRef = React.useRef<(index: number) => void>(() => {});
  const [announcement, setAnnouncement] = React.useState("");

  const setFocus = React.useCallback((index: number | null, visible: boolean) => {
    setFocusedIndex(index);
    setFocusVisible(visible);
    if (index !== null) setLastFocusedIndex(index);
  }, []);

  React.useEffect(() => {
    if (!dragging) return;
    const end = () => {
      setDragging(false);
      setActiveIndex(null);
      // Drag-off removal (Ant editable). Deferred: Base UI's own pointerup commits the
      // dragged value afterwards and would otherwise restore the handle.
      const pending = removingRef.current;
      if (pending !== null) {
        setRemovingIndex(null);
        setTimeout(() => removeHandleRef.current(pending), 0);
      }
    };
    window.addEventListener("pointerup", end, true);
    window.addEventListener("pointercancel", end, true);
    return () => {
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", end, true);
    };
  }, [dragging, setRemovingIndex]);

  const valueFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = trackRef.current;
      if (!el) return min;
      const rect = el.getBoundingClientRect();
      const vertical = orientation === "vertical";
      const rtl = !vertical && getComputedStyle(el).direction === "rtl";
      let ratio = vertical
        ? (rect.bottom - clientY) / rect.height
        : (clientX - rect.left) / rect.width;
      if (rtl) ratio = 1 - ratio;
      return clamp(roundToStep(min + clamp(ratio, 0, 1) * (max - min), step, min), min, max);
    },
    [min, max, step, orientation],
  );

  // ---- editable: add / remove handles -------------------------
  const focusThumb = React.useCallback((index: number) => {
    requestAnimationFrame(() => {
      const inputs = rootRef.current?.querySelectorAll<HTMLInputElement>('input[type="range"]');
      inputs?.[index]?.focus();
    });
  }, []);

  const addHandle = React.useCallback(
    (at?: number) => {
      if (!editable || readOnly || disabled) return;
      const current = valuesRef.current;
      if (current.length >= editable.maxCount) return;
      let value = at;
      if (value === undefined) {
        // Middle of the widest gap (including the ends of the track).
        const points = [min, ...[...current].sort((a, b) => a - b), max];
        let best = 0;
        for (let i = 1; i < points.length; i++) {
          if (points[i]! - points[i - 1]! > points[best + 1]! - points[best]!) best = i - 1;
        }
        value = (points[best]! + points[best + 1]!) / 2;
      }
      value = snap(clamp(roundToStep(value, step, min), min, max));
      const next = [...current, value].sort((a, b) => a - b);
      const index = next.indexOf(value);
      setValues(next);
      setAnnouncement(`Handle added at ${display(value, index)}. ${next.length} handles.`);
      focusThumb(index);
    },
    [editable, readOnly, disabled, min, max, step, snap, setValues, display, focusThumb],
  );

  const removeHandle = React.useCallback(
    (index: number) => {
      if (!editable || readOnly || disabled) return;
      const current = valuesRef.current;
      if (current.length <= editable.minCount || index < 0 || index >= current.length) return;
      const removed = current[index]!;
      const next = current.filter((_, i) => i !== index);
      setValues(next);
      setAnnouncement(
        `Handle at ${display(removed, index)} removed. ${next.length} handle${next.length === 1 ? "" : "s"}.`,
      );
      focusThumb(Math.min(index, next.length - 1));
    },
    [editable, readOnly, disabled, setValues, display, focusThumb],
  );
  removeHandleRef.current = removeHandle;

  const ctx = React.useMemo<SliderContextValue>(
    () => ({
      values,
      min,
      max,
      orientation,
      size,
      disabled,
      readOnly,
      marks,
      track,
      originValue,
      valueLabel,
      draggableTrack,
      editable,
      percent,
      display,
      hasCustomDisplay: !!(formatValue || scale),
      ariaLabel,
      setValues,
      snap,
      restrictToMarks,
      step,
      hoveredIndex,
      setHoveredIndex,
      focusedIndex,
      focusVisible,
      setFocus,
      dragging,
      activeIndex,
      setDragging,
      setActiveIndex,
      lastFocusedIndex,
      addHandle,
      removeHandle,
      removingIndex,
      setRemovingIndex,
      trackRef,
      controlRef,
      rootRef,
      valueFromPointer,
    }),
    [
      values,
      min,
      max,
      orientation,
      size,
      disabled,
      readOnly,
      marks,
      track,
      originValue,
      valueLabel,
      draggableTrack,
      editable,
      percent,
      display,
      formatValue,
      scale,
      ariaLabel,
      setValues,
      snap,
      restrictToMarks,
      step,
      hoveredIndex,
      focusedIndex,
      focusVisible,
      setFocus,
      dragging,
      activeIndex,
      lastFocusedIndex,
      addHandle,
      removeHandle,
      removingIndex,
      setRemovingIndex,
      valueFromPointer,
    ],
  );

  // Auto-render the body unless the consumer composes Body or Control themselves.
  const composesControl = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child.type === Control || child.type === Body),
  );

  return (
    <SliderContext.Provider value={ctx}>
      <BaseSlider.Root
        ref={mergedRootRef}
        value={isArray ? values : values[0]}
        onValueChange={handleBaseChange}
        onValueCommitted={(_, details) => commit(details)}
        min={min}
        max={max}
        step={step}
        orientation={orientation}
        disabled={disabled}
        format={format}
        locale={locale}
        data-slot="slider"
        data-size={size}
        data-valid={valid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        className={cn(
          "group/slider flex flex-col gap-[var(--sp-control-gap)]",
          orientation === "vertical" ? "h-56 w-fit" : "w-full",
          sizeVars[size],
          // Colour roles: accent fill (UI control), success when valid, danger when invalid.
          "[--sp-slider-fill:var(--sp-accent)]",
          valid && "[--sp-slider-fill:var(--sp-success)]",
          "data-[invalid]:[--sp-slider-fill:var(--sp-danger)]",
          readOnly && "[--sp-slider-fill:var(--sp-fg-muted)]",
          className,
        )}
        {...props}
      >
        {children}
        {!composesControl && (
          <Body>
            <Control>
              <Track>
                <Indicator />
                <Marks />
                <Thumbs />
              </Track>
            </Control>
            {marks.some((m) => m.label != null) && <MarkLabels />}
            {showMinMax && <MinMax />}
          </Body>
        )}
        {editable && <DragOffRemoval />}
        {editable && (
          <span role="status" aria-live="polite" className="sr-only" data-slot="slider-announcer">
            {announcement}
          </span>
        )}
      </BaseSlider.Root>
    </SliderContext.Provider>
  );
}

const Root = React.forwardRef(RootInner) as <V extends number | number[] = number | number[]>(
  props: SliderRootProps<V> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(Root as { displayName?: string }).displayName = "Slider.Root";

/* ============================================================
 * Header, Label, Value
 * ============================================================ */

/** Lays out Label and Value on one row. */
const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="slider-header"
      className={cn("flex items-baseline justify-between gap-2", className)}
      {...props}
    />
  ),
);
Header.displayName = "Slider.Header";

const Label = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSlider.Label>>(
  ({ className, ...props }, ref) => (
    <BaseSlider.Label
      ref={ref}
      data-slot="slider-label"
      className={cn("text-fg-default data-[disabled]:text-fg-muted text-sm font-medium", className)}
      {...props}
    />
  ),
);
Label.displayName = "Slider.Label";

const Value = React.forwardRef<HTMLOutputElement, React.ComponentProps<typeof BaseSlider.Value>>(
  ({ className, children, ...props }, ref) => {
    const ctx = useSlider("Value");
    return (
      <BaseSlider.Value
        ref={ref}
        data-slot="slider-value"
        className={cn("text-fg-muted text-sm tabular-nums", className)}
        {...props}
      >
        {children ?? ((_, values) => values.map((v, i) => ctx.display(v, i)).join(" – "))}
      </BaseSlider.Value>
    );
  },
);
Value.displayName = "Slider.Value";

/* ============================================================
 * Body, Control, Track
 * ============================================================ */

/** Stacks the control with mark labels / min-max (beside them when vertical). */
const Body = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => {
    const { orientation } = useSlider("Body");
    return (
      <div
        ref={ref}
        data-slot="slider-body"
        className={cn(
          "flex",
          orientation === "vertical" ? "min-h-0 flex-1 flex-row gap-2" : "flex-col gap-1",
          className,
        )}
        {...props}
      />
    );
  },
);
Body.displayName = "Slider.Body";

const Control = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSlider.Control>>(
  ({ className, onPointerDown, ...props }, ref) => {
    const ctx = useSlider("Control");
    const vertical = ctx.orientation === "vertical";
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        ctx.controlRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ref],
    );
    return (
      <BaseSlider.Control
        ref={mergedRef}
        data-slot="slider-control"
        onPointerDown={(e) => {
          onPointerDown?.(e);
          if (!ctx.disabled && !ctx.readOnly && e.button === 0) {
            ctx.setDragging(true);
            // Know which thumb is held even before its value changes (drag-off removal).
            const thumb = (e.target as Element).closest("[data-slot='slider-thumb']");
            const index = thumb?.getAttribute("data-index");
            if (index != null) ctx.setActiveIndex(Number(index));
          }
        }}
        className={cn(
          "relative flex touch-none select-none",
          // Half a thumb of room at each end so thumbs never clip.
          vertical
            ? "h-full flex-col items-center py-[calc(var(--sp-slider-thumb)/2)]"
            : "w-full items-center px-[calc(var(--sp-slider-thumb)/2)]",
          "min-h-[var(--sp-slider-thumb)] min-w-[var(--sp-slider-thumb)]",
          ctx.readOnly ? "cursor-default" : "cursor-pointer",
          // Dim the control only; text keeps AA contrast (axe can't tell it's disabled).
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Control.displayName = "Slider.Control";

const Track = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSlider.Track>>(
  ({ className, onPointerDown, ...props }, ref) => {
    const ctx = useSlider("Track");
    const vertical = ctx.orientation === "vertical";
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        ctx.trackRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ref],
    );
    return (
      <BaseSlider.Track
        ref={mergedRef}
        data-slot="slider-track"
        onPointerDown={(e) => {
          onPointerDown?.(e);
          // Editable: a press on the bare track adds a handle there (Ant) instead of moving one.
          // (The fill only counts as "a handle's range" when it is draggable.)
          const target = e.target as Element;
          const skip = ctx.draggableTrack
            ? '[data-slot="slider-thumb"], [data-slot="slider-indicator"]'
            : '[data-slot="slider-thumb"]';
          if (ctx.editable && e.button === 0 && !target.closest(skip)) {
            e.preventDefault();
            ctx.addHandle(ctx.valueFromPointer(e.clientX, e.clientY));
          }
        }}
        className={cn(
          "relative rounded-full",
          vertical
            ? "h-full w-[var(--sp-slider-track-size)]"
            : "h-[var(--sp-slider-track-size)] w-full",
          "bg-surface-sunken shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--sp-border-control)_50%,transparent)]",
          "forced-colors:border forced-colors:border-[CanvasText] forced-colors:shadow-none",
          className,
        )}
        {...props}
      />
    );
  },
);
Track.displayName = "Slider.Track";

/* ============================================================
 * Indicator — the fill (origin, inverted, none, draggable range)
 * ============================================================ */

function fillSegments(ctx: SliderContextValue): Array<[number, number]> {
  const sorted = [...ctx.values].sort((a, b) => a - b);
  if (ctx.track === "none" || sorted.length === 0) return [];
  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;
  if (ctx.track === "inverted") {
    return sorted.length === 1
      ? [[first, ctx.max]]
      : [
          [ctx.min, first],
          [last, ctx.max],
        ];
  }
  if (sorted.length === 1) {
    return [[Math.min(ctx.originValue, first), Math.max(ctx.originValue, first)]];
  }
  return [[first, last]];
}

const Indicator = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, ...props }, ref) => {
    const ctx = useSlider("Indicator");
    const vertical = ctx.orientation === "vertical";
    const segments = fillSegments(ctx);
    const canDrag =
      ctx.draggableTrack &&
      ctx.values.length >= 2 &&
      ctx.track === "normal" &&
      !ctx.disabled &&
      !ctx.readOnly;

    const startTrackDrag = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (!canDrag || e.button !== 0) return;
      // Stop Base UI's control handler from moving the nearest thumb.
      e.preventDefault();
      e.stopPropagation();
      const startValues = [...ctx.values];
      const lo = Math.min(...startValues);
      const hi = Math.max(...startValues);
      const startValue = ctx.valueFromPointer(e.clientX, e.clientY);
      let latest = startValues;
      const onMove = (ev: PointerEvent) => {
        let delta = ctx.valueFromPointer(ev.clientX, ev.clientY) - startValue;
        delta = clamp(delta, ctx.min - lo, ctx.max - hi);
        latest = startValues.map((v) => v + delta);
        ctx.setValues(latest, false);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (latest !== startValues) ctx.setValues(latest, true);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    return (
      <>
        {segments.map(([from, to], i) => {
          const start = ctx.percent(from);
          const size = ctx.percent(to) - start;
          return (
            <span
              key={i}
              ref={i === 0 ? ref : undefined}
              data-slot="slider-indicator"
              data-draggable={canDrag ? "" : undefined}
              onPointerDown={startTrackDrag}
              style={
                vertical
                  ? { bottom: `${start}%`, height: `${size}%` }
                  : { insetInlineStart: `${start}%`, width: `${size}%` }
              }
              className={cn(
                "absolute rounded-full bg-[var(--sp-slider-fill)]",
                vertical ? "inset-x-0" : "inset-y-0",
                canDrag && "cursor-grab active:cursor-grabbing",
                className,
              )}
              {...props}
            />
          );
        })}
      </>
    );
  },
);
Indicator.displayName = "Slider.Indicator";

/* ============================================================
 * Marks — ticks on the track, labels beside it, min/max
 * ============================================================ */

function isFilled(ctx: SliderContextValue, value: number) {
  return fillSegments(ctx).some(([a, b]) => value >= a && value <= b);
}

/** Tick marks drawn on the track. Decorative (`aria-hidden`). */
const Marks = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, ...props }, ref) => {
    const ctx = useSlider("Marks");
    const visible = ctx.marks.filter((m) => !m.hidden);
    if (visible.length === 0) return null;
    const vertical = ctx.orientation === "vertical";
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="slider-marks"
        className={cn("pointer-events-none absolute inset-0", className)}
        {...props}
      >
        {visible.map((m) => (
          <span
            key={m.value}
            data-slot="slider-mark"
            data-filled={isFilled(ctx, m.value) ? "" : undefined}
            style={
              vertical
                ? { bottom: `${ctx.percent(m.value)}%` }
                : { insetInlineStart: `${ctx.percent(m.value)}%` }
            }
            className={cn(
              "absolute size-1 rounded-full",
              vertical
                ? "left-1/2 -translate-x-1/2 translate-y-1/2"
                : "top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2",
              "bg-border-control data-[filled]:bg-surface-base",
              "forced-colors:bg-[CanvasText]",
            )}
          />
        ))}
      </span>
    );
  },
);
Marks.displayName = "Slider.Marks";

/** Mark labels under (or beside, when vertical) the track. Decorative. */
const MarkLabels = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => {
    const ctx = useSlider("MarkLabels");
    const vertical = ctx.orientation === "vertical";
    const labelled = ctx.marks.filter((m) => m.label != null && !m.hidden);
    return (
      <div
        ref={ref}
        aria-hidden
        data-slot="slider-mark-labels"
        className={cn(
          "text-fg-muted relative text-xs",
          "group-data-[disabled]/slider:opacity-[var(--sp-state-disabled-opacity)]",
          vertical
            ? "my-[calc(var(--sp-slider-thumb)/2)] w-12"
            : "mx-[calc(var(--sp-slider-thumb)/2)] h-5",
          className,
        )}
        {...props}
      >
        {labelled.map((m) => {
          const at = ctx.percent(m.value);
          // Labels at the very ends align inward so they never overflow the slider.
          const edge = at === 0 ? "start" : at === 100 ? "end" : undefined;
          return (
            <span
              key={m.value}
              data-slot="slider-mark-label"
              data-edge={edge}
              style={
                vertical
                  ? { bottom: `${ctx.percent(m.value)}%` }
                  : { insetInlineStart: `${ctx.percent(m.value)}%` }
              }
              className={cn(
                "absolute whitespace-nowrap",
                vertical
                  ? "translate-y-1/2"
                  : edge === "start"
                    ? "translate-x-[calc(var(--sp-slider-thumb)/-2)] rtl:translate-x-[calc(var(--sp-slider-thumb)/2)]"
                    : edge === "end"
                      ? "translate-x-[calc(-100%+var(--sp-slider-thumb)/2)] rtl:translate-x-[calc(100%-var(--sp-slider-thumb)/2)]"
                      : "-translate-x-1/2 rtl:translate-x-1/2",
              )}
            >
              {m.label}
            </span>
          );
        })}
      </div>
    );
  },
);
MarkLabels.displayName = "Slider.MarkLabels";

/** Formatted min and max at the ends of the track (Carbon). Decorative. */
const MinMax = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => {
    const ctx = useSlider("MinMax");
    const vertical = ctx.orientation === "vertical";
    return (
      <div
        ref={ref}
        aria-hidden
        data-slot="slider-min-max"
        className={cn(
          "text-fg-muted flex justify-between text-xs tabular-nums",
          "group-data-[disabled]/slider:opacity-[var(--sp-state-disabled-opacity)]",
          vertical ? "flex-col-reverse" : "",
          className,
        )}
        {...props}
      >
        <span>{ctx.display(ctx.min, 0)}</span>
        <span>{ctx.display(ctx.max, ctx.values.length - 1)}</span>
      </div>
    );
  },
);
MinMax.displayName = "Slider.MinMax";

/* ============================================================
 * Thumb — with the value label (Tooltip)
 * ============================================================ */

const NEXT_KEYS = new Set(["ArrowRight", "ArrowUp", "PageUp"]);
const PREV_KEYS = new Set(["ArrowLeft", "ArrowDown", "PageDown"]);

export interface SliderThumbProps extends React.ComponentProps<typeof BaseSlider.Thumb> {
  index?: number;
}

const Thumb = React.forwardRef<HTMLDivElement, SliderThumbProps>(
  (
    {
      className,
      index = 0,
      onKeyDown,
      onFocus,
      onBlur,
      onPointerEnter,
      onPointerLeave,
      inputRef: inputRefProp,
      getAriaValueText,
      children,
      ...props
    },
    ref,
  ) => {
    const ctx = useSlider("Thumb");
    const [thumbEl, setThumbEl] = React.useState<HTMLDivElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        setThumbEl(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const { readOnly, editable } = ctx;
    const inputRef = React.useCallback(
      (input: HTMLInputElement | null) => {
        if (input) {
          if (readOnly) input.setAttribute("aria-readonly", "true");
          else input.removeAttribute("aria-readonly");
          if (editable) input.setAttribute("aria-keyshortcuts", "Delete Backspace");
          else input.removeAttribute("aria-keyshortcuts");
        }
        if (typeof inputRefProp === "function") inputRefProp(input);
        else if (inputRefProp) inputRefProp.current = input;
      },
      [readOnly, editable, inputRefProp],
    );

    const value = ctx.values[index] ?? ctx.min;
    const thumbLabel = ctx.ariaLabel(index);
    const vertical = ctx.orientation === "vertical";

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      onKeyDown?.(e);
      // Keyboard use shows the value label, even if focus arrived by pointer.
      if (!ctx.focusVisible || ctx.focusedIndex !== index) ctx.setFocus(index, true);
      if (e.defaultPrevented) return;
      // Editable: Delete / Backspace removes this handle.
      if (ctx.editable && (e.key === "Delete" || e.key === "Backspace")) {
        e.preventDefault();
        ctx.removeHandle(index);
        return;
      }
      if (ctx.readOnly) return;
      // Restricted to marks: arrows move mark to mark; Home/End jump to the ends.
      if (ctx.restrictToMarks && ctx.marks.length > 0) {
        const marks = ctx.marks.map((m) => m.value);
        const rtl = !vertical && getComputedStyle(e.currentTarget).direction === "rtl";
        let key = e.key;
        if (rtl && key === "ArrowRight") key = "ArrowLeft";
        else if (rtl && key === "ArrowLeft") key = "ArrowRight";
        let next: number | undefined;
        if (NEXT_KEYS.has(key)) next = marks.find((m) => m > value);
        else if (PREV_KEYS.has(key)) next = [...marks].reverse().find((m) => m < value);
        else if (key === "Home") next = marks[0];
        else if (key === "End") next = marks[marks.length - 1];
        else return;
        e.preventDefault();
        if (next === undefined) return;
        // Keep thumbs in order.
        const lo = ctx.values[index - 1] ?? ctx.min;
        const hi = ctx.values[index + 1] ?? ctx.max;
        const updated = [...ctx.values];
        updated[index] = clamp(next, lo, hi);
        ctx.setValues(updated);
      }
    };

    // Value label (Tooltip): auto = hover, keyboard focus, or dragging this thumb.
    const labelOpen =
      ctx.valueLabel === "always" ||
      (ctx.valueLabel === "auto" &&
        !ctx.disabled &&
        (ctx.hoveredIndex === index ||
          (ctx.focusedIndex === index && ctx.focusVisible) ||
          (ctx.dragging && ctx.activeIndex === index)));

    return (
      <>
        <BaseSlider.Thumb
          ref={mergedRef}
          index={index}
          inputRef={inputRef}
          data-slot="slider-thumb"
          data-index={index}
          data-removing={ctx.removingIndex === index ? "" : undefined}
          getAriaLabel={thumbLabel ? () => thumbLabel : undefined}
          getAriaValueText={
            getAriaValueText ?? (ctx.hasCustomDisplay ? (_f, v, i) => ctx.display(v, i) : undefined)
          }
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            onFocus?.(e);
            ctx.setFocus(index, e.currentTarget.matches(":focus-visible"));
          }}
          onBlur={(e) => {
            onBlur?.(e);
            ctx.setFocus(null, false);
          }}
          onPointerEnter={(e) => {
            onPointerEnter?.(e);
            ctx.setHoveredIndex(index);
          }}
          onPointerLeave={(e) => {
            onPointerLeave?.(e);
            ctx.setHoveredIndex(null);
          }}
          className={cn(
            "bg-surface-base block rounded-full border-2 border-[var(--sp-slider-fill)] shadow-sm outline-none",
            "size-[var(--sp-slider-thumb)]",
            // ≥ 44px hit area on touch (Apple HIG) without changing the visual size.
            "pointer-coarse:before:-inset-3 before:absolute before:-inset-1 before:rounded-full before:content-['']",
            "has-[:focus-visible]:sp-focus-ring",
            // Emil: press feedback on the thumb.
            "transition-[scale,box-shadow] duration-[var(--sp-duration-press)] ease-[var(--sp-easing-default)]",
            "active:scale-[var(--sp-scale-press)]",
            ctx.readOnly ? "cursor-default" : "cursor-grab active:cursor-grabbing",
            "data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--sp-border-control)]",
            "data-[removing]:opacity-40",
            "forced-colors:border-[CanvasText]",
            className,
          )}
          {...props}
        >
          {children}
        </BaseSlider.Thumb>
        {ctx.valueLabel !== "off" && thumbEl && (
          <Tooltip.Root open={labelOpen} touch={false}>
            <Tooltip.Content
              aria-hidden
              side={vertical ? "right" : "top"}
              keepMounted={false}
              // Portal into the control so the label inherits its theme / density subtree
              // without adding a flex child (gap) to the root.
              container={ctx.controlRef}
              positionerProps={{ anchor: thumbEl }}
              data-slot="slider-value-label"
              className="tabular-nums"
            >
              {ctx.display(value, index)}
            </Tooltip.Content>
          </Tooltip.Root>
        )}
      </>
    );
  },
);
Thumb.displayName = "Slider.Thumb";

/** One Thumb per value — follows added / removed handles (Chakra `Slider.Thumbs`). */
function Thumbs(props: Omit<SliderThumbProps, "index">) {
  const ctx = useSlider("Thumbs");
  return (
    <>
      {ctx.values.map((_, i) => (
        <Thumb key={i} index={i} {...props} />
      ))}
    </>
  );
}
Thumbs.displayName = "Slider.Thumbs";

/* ============================================================
 * Editable handle buttons
 * ============================================================ */

export interface SliderHandleButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> {
  children?: React.ReactNode;
}

/** Adds a handle in the middle of the widest gap. Disabled at `maxCount`. */
const AddHandle = React.forwardRef<HTMLButtonElement, SliderHandleButtonProps>(
  ({ children = "Add handle", ...props }, ref) => {
    const ctx = useSlider("AddHandle");
    const atMax = !ctx.editable || ctx.values.length >= ctx.editable.maxCount;
    return (
      <Button
        ref={ref}
        data-slot="slider-add-handle"
        variant="outline"
        size="sm"
        icon={<PlusIcon />}
        disabled={atMax || ctx.disabled || ctx.readOnly}
        onClick={() => ctx.addHandle()}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
AddHandle.displayName = "Slider.AddHandle";

/** Removes the handle that was focused last. Disabled at `minCount`. */
const RemoveHandle = React.forwardRef<HTMLButtonElement, SliderHandleButtonProps>(
  ({ children = "Remove handle", ...props }, ref) => {
    const ctx = useSlider("RemoveHandle");
    const atMin = !ctx.editable || ctx.values.length <= ctx.editable.minCount;
    return (
      <Button
        ref={ref}
        data-slot="slider-remove-handle"
        variant="outline"
        size="sm"
        icon={<MinusIcon />}
        disabled={atMin || ctx.disabled || ctx.readOnly}
        onClick={() => ctx.removeHandle(Math.min(ctx.lastFocusedIndex, ctx.values.length - 1))}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
RemoveHandle.displayName = "Slider.RemoveHandle";

/* ============================================================
 * Drag a thumb off the track to remove it (Ant editable)
 * ============================================================ */

function DragOffRemoval() {
  const ctx = React.useContext(SliderContext);
  const editable = ctx?.editable;
  const dragging = ctx?.dragging;
  const activeIndex = ctx?.activeIndex ?? null;
  const count = ctx?.values.length ?? 0;
  const trackRef = ctx?.trackRef;
  const orientation = ctx?.orientation;
  const setRemovingIndex = ctx?.setRemovingIndex;
  React.useEffect(() => {
    if (!editable || !dragging || activeIndex === null || !setRemovingIndex) return;
    const DISTANCE = 40; // px away from the track
    const onMove = (e: PointerEvent) => {
      const rect = trackRef?.current?.getBoundingClientRect();
      if (!rect) return;
      const off =
        orientation === "vertical"
          ? e.clientX < rect.left - DISTANCE || e.clientX > rect.right + DISTANCE
          : e.clientY < rect.top - DISTANCE || e.clientY > rect.bottom + DISTANCE;
      setRemovingIndex(off && count > editable.minCount ? activeIndex : null);
    };
    window.addEventListener("pointermove", onMove, true);
    return () => window.removeEventListener("pointermove", onMove, true);
  }, [editable, dragging, activeIndex, count, trackRef, orientation, setRemovingIndex]);
  return null;
}

/* ============================================================
 * Export
 * ============================================================ */

export const Slider = {
  Root,
  Header,
  Label,
  Value,
  Body,
  Control,
  Track,
  Indicator,
  Marks,
  MarkLabels,
  MinMax,
  Thumb,
  Thumbs,
  AddHandle,
  RemoveHandle,
};
