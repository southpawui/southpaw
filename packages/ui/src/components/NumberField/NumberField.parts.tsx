"use client";

import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import {
  ArrowsHorizontalIcon,
  CaretDownIcon,
  CaretUpIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { Spinner } from "../Spinner/Spinner";

/* ============================================================
 * Types + context
 * ============================================================ */

export type NumberFieldControls = "split" | "end" | "stacked" | "none";
export type NumberFieldSize = "sm" | "md" | "lg";

interface NumberFieldContextValue {
  size: NumberFieldSize;
  controls: NumberFieldControls;
  valid: boolean;
  warning: boolean;
  loading: boolean;
  selectOnFocus: boolean;
}

const NumberFieldContext = React.createContext<NumberFieldContextValue>({
  size: "md",
  controls: "end",
  valid: false,
  warning: false,
  loading: false,
  selectOnFocus: false,
});

/** Minimum height of each stacked stepper half — WCAG 2.5.8 Target Size (Minimum). */
export const STACKED_MIN_TARGET_PX = 24;

const heightVar: Record<NumberFieldSize, string> = {
  sm: "[--sp-nf-height:var(--sp-control-height-sm)]",
  md: "[--sp-nf-height:var(--sp-control-height)]",
  lg: "[--sp-nf-height:var(--sp-control-height-lg)]",
};

function isDev(): boolean {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env;
  return env?.NODE_ENV !== "production";
}

/* ============================================================
 * Root
 * ============================================================ */

export interface NumberFieldRootProps extends React.ComponentProps<typeof BaseNumberField.Root> {
  /** Control height. Maps to the density-aware control-height tokens. Default: "md" */
  size?: NumberFieldSize;
  /**
   * Stepper button layout. Default: "end".
   * - `end`: both buttons side by side after the value (Carbon)
   * - `split`: decrement before, increment after the value (MUI spinner, Ant `mode="spinner"`)
   * - `stacked`: chevrons stacked after the value (Mantine, Chakra, Ant, Spectrum).
   *   Only honoured when each half is at least 24px tall (WCAG 2.5.8). Otherwise it
   *   falls back to `end` and warns in development.
   * - `none`: no steppers — keyboard only (GOV.UK)
   */
  controls?: NumberFieldControls;
  /** Valid/success state — green border. No icon (it would crowd the steppers). */
  valid?: boolean;
  /** Warning state — amber border. Overrides `valid`; `invalid` from Field overrides both. */
  warning?: boolean;
  /** Show a spinner after the value and mark the input `aria-busy`. */
  loading?: boolean;
  /** Select the whole value when the input receives focus. Default: false */
  selectOnFocus?: boolean;
}

const Root = React.forwardRef<HTMLDivElement, NumberFieldRootProps>(
  (
    {
      className,
      size = "md",
      controls = "end",
      valid = false,
      warning = false,
      loading = false,
      selectOnFocus = false,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useMemo(
      () => ({ size, controls, valid, warning, loading, selectOnFocus }),
      [size, controls, valid, warning, loading, selectOnFocus],
    );
    return (
      <NumberFieldContext.Provider value={ctx}>
        <BaseNumberField.Root
          ref={ref}
          data-slot="number-field"
          data-size={size}
          className={mergeClassName(cn("flex w-full flex-col gap-1.5", heightVar[size]), className)}
          {...props}
        />
      </NumberFieldContext.Provider>
    );
  },
);
Root.displayName = "NumberField.Root";

/* ============================================================
 * Stacked fallback — measure the rendered height
 * ============================================================ */

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function useResolvedControls(
  requested: NumberFieldControls,
  groupRef: React.RefObject<HTMLDivElement | null>,
): NumberFieldControls {
  const [stackedAllowed, setStackedAllowed] = React.useState(true);
  const warned = React.useRef(false);

  useIsoLayoutEffect(() => {
    if (requested !== "stacked") return;
    const el = groupRef.current;
    if (!el) return;

    const check = () => {
      // Stacked steppers overlap the group's own border (they carry it themselves),
      // so each half's hit area is the full outer height / 2.
      const half = el.getBoundingClientRect().height / 2;
      const allowed = half >= STACKED_MIN_TARGET_PX;
      setStackedAllowed(allowed);
      if (!allowed && !warned.current && isDev()) {
        warned.current = true;
        console.warn(
          `[Southpaw] NumberField: controls="stacked" needs each stepper to be at least ${STACKED_MIN_TARGET_PX}px tall (WCAG 2.5.8). ` +
            `At this size/density each half is ${half.toFixed(0)}px, so it falls back to controls="end". ` +
            `Use data-density="comfortable" or size="lg".`,
        );
      }
    };
    check();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [requested, groupRef]);

  if (requested === "stacked" && !stackedAllowed) return "end";
  return requested;
}

/* ============================================================
 * Group — the bordered control. Auto-composes when empty.
 * ============================================================ */

// No text size here: adornments inherit the group's text-sm / text-base (size="lg").
const addonClasses =
  "text-fg-muted flex shrink-0 items-center select-none [&>svg]:size-[var(--sp-control-icon)]";

export interface NumberFieldGroupProps extends React.ComponentProps<typeof BaseNumberField.Group> {
  /** Content before the value (e.g. "£", an icon). Same API as Input. */
  prepend?: React.ReactNode;
  /** Content after the value (e.g. "kg", "%"). Same API as Input. */
  append?: React.ReactNode;
  /** Props for the auto-rendered Input (only used when Group has no children). */
  inputProps?: React.ComponentProps<typeof Input>;
}

const Group = React.forwardRef<HTMLDivElement, NumberFieldGroupProps>(
  ({ className, prepend, append, inputProps, children, ...props }, forwardedRef) => {
    const ctx = React.useContext(NumberFieldContext);
    const groupRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        groupRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );
    const controls = useResolvedControls(ctx.controls, groupRef);
    const resolvedCtx = React.useMemo(() => ({ ...ctx, controls }), [ctx, controls]);

    const autoCompose = children === undefined || children === null;

    return (
      <NumberFieldContext.Provider value={resolvedCtx}>
        <BaseNumberField.Group
          ref={setRefs}
          data-slot="number-field-group"
          data-controls={controls}
          data-success={ctx.valid && !ctx.warning ? "" : undefined}
          data-warning={ctx.warning ? "" : undefined}
          data-loading={ctx.loading ? "" : undefined}
          className={mergeClassName(
            cn(
              "flex w-full items-stretch",
              // Stacked steppers sit over the group's end border, so they can't be clipped.
              controls === "stacked" ? "overflow-visible" : "overflow-hidden",
              "bg-surface-base rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
              "border-border-control border-2",
              "h-[var(--sp-nf-height)]",
              ctx.size === "lg" ? "text-base" : "text-sm",
              "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
              "hover:border-fg-muted",
              "has-[input:focus-visible]:sp-focus-ring",
              ctx.valid && !ctx.warning && "border-success hover:border-success",
              ctx.warning && "border-warning hover:border-warning",
              "data-[invalid]:!border-danger",
              "data-[disabled]:bg-surface-sunken data-[disabled]:border-border-control data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
              // Also disabled by an ancestor <fieldset disabled> (e.g. a disabled ButtonGroup): Base UI
              // doesn't set data-disabled then, but the native input matches :disabled.
              "has-[input:disabled]:bg-surface-sunken has-[input:disabled]:border-border-control has-[input:disabled]:opacity-[var(--sp-state-disabled-opacity)]",
              "data-[readonly]:bg-surface-sunken data-[readonly]:border-border-default",
            ),
            className,
          )}
          {...props}
        >
          {autoCompose ? (
            <>
              {controls === "split" && <Decrement />}
              {prepend !== undefined && (
                <span
                  data-slot="number-field-prepend"
                  className={cn(addonClasses, typeof prepend === "string" ? "pl-3" : "pl-2.5")}
                >
                  {prepend}
                </span>
              )}
              <Input
                {...inputProps}
                className={mergeClassName(
                  cn(
                    prepend !== undefined && "pl-1",
                    // A centred value drifts away from its adornments in split — keep them together.
                    (prepend !== undefined || append !== undefined) && "text-start",
                    (append !== undefined || ctx.loading) && "pr-1",
                  ),
                  inputProps?.className,
                )}
              />
              {append !== undefined && (
                <span
                  data-slot="number-field-append"
                  className={cn(
                    addonClasses,
                    typeof append === "string" ? "pr-3" : "pr-2.5",
                    ctx.loading && "pr-1.5",
                  )}
                >
                  {append}
                </span>
              )}
              {ctx.loading && <Loading />}
              {controls === "split" && <Increment />}
              {controls === "end" && (
                <>
                  <Decrement />
                  <Increment />
                </>
              )}
              {controls === "stacked" && <Stepper />}
            </>
          ) : (
            children
          )}
        </BaseNumberField.Group>
      </NumberFieldContext.Provider>
    );
  },
);
Group.displayName = "NumberField.Group";

/* ============================================================
 * Input
 * ============================================================ */

type InputProps = React.ComponentProps<typeof BaseNumberField.Input>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onFocus, ...props }, ref) => {
    const ctx = React.useContext(NumberFieldContext);
    const handleFocus = React.useCallback<NonNullable<InputProps["onFocus"]>>(
      (e) => {
        onFocus?.(e);
        if (ctx.selectOnFocus) e.currentTarget.select();
      },
      [onFocus, ctx.selectOnFocus],
    );
    return (
      <BaseNumberField.Input
        ref={ref}
        data-slot="number-field-input"
        aria-busy={ctx.loading || undefined}
        onFocus={handleFocus}
        className={mergeClassName(
          cn(
            "text-fg-default placeholder:text-fg-muted h-full w-full min-w-0 flex-1 bg-transparent px-3 tabular-nums outline-none",
            ctx.controls === "split" ? "text-center" : "text-start",
            "disabled:cursor-not-allowed",
          ),
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "NumberField.Input";

/* ============================================================
 * Increment / Decrement
 * ============================================================ */

const stepperBase = cn(
  "text-fg-muted inline-flex shrink-0 cursor-pointer items-center justify-center",
  "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
  "hover:bg-surface-sunken hover:text-fg-default active:bg-surface-alternate",
  // Fade only the icon: in the stacked layout the button also draws the group's outer border.
  // Base UI marks disabled AND read-only steppers with aria-disabled (read-only has no `disabled` attr).
  "aria-disabled:cursor-not-allowed aria-disabled:[&_svg]:opacity-[var(--sp-state-disabled-opacity)] aria-disabled:hover:bg-transparent aria-disabled:hover:text-fg-muted aria-disabled:active:bg-transparent",
  // Natively disabled by an ancestor <fieldset disabled> (no aria-disabled then): same look.
  "disabled:cursor-not-allowed disabled:[&_svg]:opacity-[var(--sp-state-disabled-opacity)] disabled:hover:bg-transparent disabled:hover:text-fg-muted disabled:active:bg-transparent",
  "[&_svg]:size-[calc(var(--sp-control-icon)*0.8)]",
);

const separator = "border-border-default forced-colors:border-[CanvasText]";

function stepperLayout(controls: NumberFieldControls, kind: "increment" | "decrement"): string {
  switch (controls) {
    case "split":
      return cn("aspect-square h-full", separator, kind === "decrement" ? "border-e" : "border-s");
    case "stacked":
      // Each half takes over the group's outer border on its sides (border-color inherits
      // from the group, so hover/valid/invalid/warning states follow), which makes the
      // hit area exactly half the control height: 24px at comfortable density.
      return cn(
        "w-full shrink-0 grow-0 basis-1/2 [border-color:inherit] border-e-2",
        kind === "increment"
          ? "border-t-2 rounded-se-[var(--sp-nested-radius,var(--radius-DEFAULT))]"
          : "border-b-2 rounded-ee-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
      );
    default:
      // end: Decrement then Increment, separated from the value and each other.
      return cn("aspect-square h-full border-s", separator);
  }
}

type StepperProps = React.ComponentProps<typeof BaseNumberField.Increment>;

const Increment = React.forwardRef<HTMLButtonElement, StepperProps>(
  ({ className, children, ...props }, ref) => {
    const { controls } = React.useContext(NumberFieldContext);
    return (
      <BaseNumberField.Increment
        ref={ref}
        data-slot="number-field-increment"
        className={mergeClassName(cn(stepperBase, stepperLayout(controls, "increment")), className)}
        {...props}
      >
        {children ??
          (controls === "stacked" ? (
            <CaretUpIcon aria-hidden="true" weight="bold" />
          ) : (
            <PlusIcon aria-hidden="true" weight="bold" />
          ))}
      </BaseNumberField.Increment>
    );
  },
);
Increment.displayName = "NumberField.Increment";

const Decrement = React.forwardRef<HTMLButtonElement, StepperProps>(
  ({ className, children, ...props }, ref) => {
    const { controls } = React.useContext(NumberFieldContext);
    return (
      <BaseNumberField.Decrement
        ref={ref}
        data-slot="number-field-decrement"
        className={mergeClassName(cn(stepperBase, stepperLayout(controls, "decrement")), className)}
        {...props}
      >
        {children ??
          (controls === "stacked" ? (
            <CaretDownIcon aria-hidden="true" weight="bold" />
          ) : (
            <MinusIcon aria-hidden="true" weight="bold" />
          ))}
      </BaseNumberField.Decrement>
    );
  },
);
Decrement.displayName = "NumberField.Decrement";

/* ============================================================
 * Stepper — stacked container for Increment over Decrement
 * ============================================================ */

const Stepper = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="number-field-stepper"
      className={mergeClassName(
        cn(
          // Overlap the group's 2px border on the top, end and bottom edges.
          "relative -my-0.5 -me-0.5 flex h-[calc(100%+4px)] w-[calc(var(--sp-nf-height)*0.75)] shrink-0 flex-col [border-color:inherit]",
          // Separators drawn inside the outer border so they don't notch it.
          "before:bg-border-default before:pointer-events-none before:absolute before:inset-y-0.5 before:start-0 before:w-px",
          "after:bg-border-default after:pointer-events-none after:absolute after:end-0.5 after:start-0 after:top-1/2 after:h-px after:-translate-y-1/2",
          "forced-colors:before:bg-[CanvasText] forced-colors:before:[forced-color-adjust:none] forced-colors:after:bg-[CanvasText] forced-colors:after:[forced-color-adjust:none]",
        ),
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <Increment />
          <Decrement />
        </>
      )}
    </span>
  ),
);
Stepper.displayName = "NumberField.Stepper";

/* ============================================================
 * Loading indicator
 * ============================================================ */

const Loading = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="number-field-loading"
      className={mergeClassName(cn("text-fg-muted flex shrink-0 items-center pe-2.5"), className)}
      {...props}
    >
      <Spinner aria-label="Loading" />
    </span>
  ),
);
Loading.displayName = "NumberField.Loading";

/* ============================================================
 * ScrubArea + cursor
 * ============================================================ */

const ScrubArea = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseNumberField.ScrubArea>
>(({ className, ...props }, ref) => (
  <BaseNumberField.ScrubArea
    ref={ref}
    data-slot="number-field-scrub-area"
    className={mergeClassName(
      "inline-flex w-fit cursor-ew-resize touch-none select-none [&_label]:cursor-ew-resize",
      className,
    )}
    {...props}
  />
));
ScrubArea.displayName = "NumberField.ScrubArea";

const ScrubAreaCursor = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BaseNumberField.ScrubAreaCursor>
>(({ className, children, ...props }, ref) => (
  <BaseNumberField.ScrubAreaCursor
    ref={ref}
    data-slot="number-field-scrub-area-cursor"
    className={mergeClassName("text-fg-default drop-shadow-sm [&_svg]:size-5", className)}
    {...props}
  >
    {children ?? <ArrowsHorizontalIcon aria-hidden="true" weight="bold" />}
  </BaseNumberField.ScrubAreaCursor>
));
ScrubAreaCursor.displayName = "NumberField.ScrubAreaCursor";

// Parts for the server-safe namespace in ./NumberField (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
export {
  Root as NumberFieldRoot,
  Group as NumberFieldGroup,
  Input as NumberFieldInput,
  Increment as NumberFieldIncrement,
  Decrement as NumberFieldDecrement,
  Stepper as NumberFieldStepper,
  Loading as NumberFieldLoading,
  ScrubArea as NumberFieldScrubArea,
  ScrubAreaCursor as NumberFieldScrubAreaCursor,
};
