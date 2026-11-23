import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { announce as announceMessage } from "../../lib/announce";
import { formatCount, type FormatCountOptions } from "../../lib/format-count";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// library doesn't need Node types.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * Indicator (GEO-964)
 *
 * A count, dot, status or short content placed on the corner of its child
 * ("5" on a bell button, a status shape on an avatar). With no child it
 * renders inline, beside text (a tab, a nav item), like Primer's CounterLabel.
 *
 * Screen readers never read the visible badge ("99+", "1.2K"). Overlays add
 * `label` (with the raw count) to the child's aria-describedby, so an icon
 * button keeps its name and gains "5 unread notifications". Inline counts add
 * a visually hidden " (12)" that joins the name of the tab or link.
 *
 * Status presets have a distinct shape each, so they never rely on colour
 * alone (WCAG 1.4.1). Pulse stops under reduced motion and in disabled.
 * ============================================================ */

export type IndicatorTone = "accent" | "neutral" | "danger" | "success" | "warning" | "info";
export type IndicatorStatus = "success" | "danger" | "warning" | "info" | "neutral";
export type IndicatorPosition =
  | "top-start"
  | "top-center"
  | "top-end"
  | "middle-start"
  | "middle-center"
  | "middle-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";
export type IndicatorSize = "sm" | "md" | "lg";

/** Default spoken text per status: presence, the most common use (Avatar maps onto these). */
export const defaultStatusLabels: Record<IndicatorStatus, string> = {
  success: "Online",
  danger: "Busy",
  warning: "Away",
  info: "New",
  neutral: "Offline",
};

const DOT_FALLBACK_LABEL = "New activity";

export interface IndicatorProps extends Omit<
  React.ComponentPropsWithRef<"span">,
  "content" | "children"
> {
  /** A number to show. Formatted for the locale, capped at `max`. */
  count?: number;
  /** Show a plain dot instead of the count. */
  dot?: boolean;
  /** A status preset: its own shape and colour, and a default label. */
  status?: IndicatorStatus;
  /** Short visible content instead of a count: an icon or a word such as "New". */
  content?: React.ReactNode;
  /**
   * What screen readers hear. A string, or a function of the raw count:
   * `label={(n) => \`${n} unread notifications\`}`. Never the visible "99+".
   */
  label?: string | ((count: number) => string);
  /** Inline status only: show the label as visible text beside the shape. */
  showLabel?: boolean;
  /** Highest count shown before "+". Default 99 (none with `format="compact"`). `false` for no cap. */
  max?: number | false;
  /** Show the indicator when `count` is 0. Default `false`. */
  showZero?: boolean;
  /** `standard` (default) or `compact` ("1.2K"). */
  format?: "standard" | "compact";
  /** Locale for the number. Default: the runtime's. */
  locale?: string | string[];
  /** Extra Intl.NumberFormat options. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Build the capped text from the formatted max, for translation. Default `(max) => \`${max}+\``. */
  formatOverflow?: FormatCountOptions["overflow"];
  /** Where it sits on the child. Logical: `end` is the right in LTR, the left in RTL. Default `top-end`. */
  position?: IndicatorPosition;
  /** Nudge it, in px or any CSS length. `x` runs along the reading direction. */
  offset?: number | string | { x?: number | string; y?: number | string };
  /** `circular` pulls corner positions in to sit on a round child's curve. Default `rectangular`. */
  overlap?: "rectangular" | "circular";
  /** Colour for counts, dots and content. Default `accent`. Status presets set their own. */
  tone?: IndicatorTone;
  /** A ring that grows out of it, for something in progress. Static under reduced motion. */
  pulse?: boolean;
  /** Default `true`. Hidden indicators stay mounted, scale away, and say nothing. */
  visible?: boolean;
  /** Muted (neutral, no pulse). Keeps its count and label, so nothing is lost. */
  disabled?: boolean;
  /** A ring in `--sp-indicator-ring` to separate it from the child. Default: on for overlays, off inline. */
  bordered?: boolean;
  /** Default `md`. Counts 16/20/24px tall; dots 8/10/12px; status shapes 10/12/16px. */
  size?: IndicatorSize;
  /** Announce changes to the count politely. Off by default, never on first render. */
  announce?: boolean;
  /** The element to place it on. Without one, it renders inline. */
  children?: React.ReactNode;
  /** Replace the wrapper element, e.g. `render={<div />}` around a block child. */
  render?: useRender.RenderProp;
}

/* ============================================================
 * Classes (literal, so Tailwind can see them)
 * ============================================================ */

const toneClasses: Record<IndicatorTone, string> = {
  accent: "bg-accent text-surface-base [--sp-indicator-color:var(--sp-accent)]",
  neutral: "bg-fg-muted text-surface-base [--sp-indicator-color:var(--sp-fg-muted)]",
  danger: "bg-danger text-fg-on-danger [--sp-indicator-color:var(--sp-danger)]",
  success: "bg-success text-fg-on-success [--sp-indicator-color:var(--sp-success)]",
  warning: "bg-warning text-fg-on-warning [--sp-indicator-color:var(--sp-warning)]",
  info: "bg-info text-fg-on-info [--sp-indicator-color:var(--sp-info)]",
};

const statusColour: Record<IndicatorStatus, string> = {
  success: "text-success [--sp-indicator-color:var(--sp-success)]",
  danger: "text-danger [--sp-indicator-color:var(--sp-danger)]",
  warning: "text-warning [--sp-indicator-color:var(--sp-warning)]",
  info: "text-info [--sp-indicator-color:var(--sp-info)]",
  neutral: "text-fg-muted [--sp-indicator-color:var(--sp-fg-muted)]",
};

const pillSize: Record<IndicatorSize, string> = {
  sm: "h-4 min-w-4 px-1 text-[0.625rem]",
  md: "h-5 min-w-5 px-1.5 text-xs",
  lg: "h-6 min-w-6 px-2 text-sm",
};
const dotSize: Record<IndicatorSize, string> = { sm: "size-2", md: "size-2.5", lg: "size-3" };
const statusSize: Record<IndicatorSize, string> = { sm: "size-2.5", md: "size-3", lg: "size-4" };

const vertical = {
  top: "top-[var(--sp-indicator-inset)] [--sp-indicator-ty:-50%]",
  middle: "top-1/2 [--sp-indicator-ty:-50%]",
  bottom: "bottom-[var(--sp-indicator-inset)] [--sp-indicator-ty:50%]",
} as const;
const horizontal = {
  start: "start-[var(--sp-indicator-inset)] [--sp-indicator-tx:-50%]",
  center: "start-1/2 [--sp-indicator-tx:-50%]",
  end: "end-[var(--sp-indicator-inset)] [--sp-indicator-tx:50%]",
} as const;

// Translate isn't logical, so the inline part is multiplied by the direction
const overlayPlacement = cn(
  "absolute z-[1] [--sp-indicator-dir:1] rtl:[--sp-indicator-dir:-1]",
  "[translate:calc((var(--sp-indicator-tx)_+_var(--sp-indicator-ox,0px))_*_var(--sp-indicator-dir))_calc(var(--sp-indicator-ty)_+_var(--sp-indicator-oy,0px))]",
);

const motion = cn(
  "transition-[scale,opacity] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
);

const pulseClasses = cn(
  "isolate before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-[var(--sp-indicator-color)] before:content-['']",
  "before:animate-[sp-indicator-pulse_1.6s_ease-out_infinite]",
  // Reduced motion: a still ring instead of a growing one
  "motion-reduce:before:animate-none motion-reduce:before:scale-[1.7] motion-reduce:before:opacity-30",
  "forced-colors:before:bg-[CanvasText]",
);

// Backgrounds are dropped in forced colours: draw it in system colours instead
const forcedPill =
  "forced-colors:[forced-color-adjust:none] forced-colors:bg-[CanvasText] forced-colors:text-[Canvas]";

const popClass = "animate-[sp-indicator-pop_var(--sp-duration-normal)_var(--sp-easing-default)]";

/* ============================================================
 * Status shapes: one per status, so meaning doesn't rest on colour
 * ============================================================ */

function StatusShape({ status }: { status: IndicatorStatus }) {
  const common = {
    viewBox: "0 0 16 16",
    "aria-hidden": true,
    focusable: "false" as const,
    className: "block size-full forced-colors:text-[CanvasText]",
  };
  switch (status) {
    case "success": // filled circle
      return (
        <svg {...common} data-shape="circle">
          <circle cx="8" cy="8" r="8" fill="currentColor" />
        </svg>
      );
    case "danger": // circle with a bar ("no entry")
      return (
        <svg {...common} data-shape="bar">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm-4.5 6.5v3h9v-3h-9Z"
          />
        </svg>
      );
    case "warning": // triangle
      return (
        <svg {...common} data-shape="triangle">
          <path fill="currentColor" d="M8 .8 15.6 15H.4L8 .8Z" />
        </svg>
      );
    case "info": // ringed dot
      return (
        <svg {...common} data-shape="ringed-dot">
          <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="8" cy="8" r="2.75" fill="currentColor" />
        </svg>
      );
    case "neutral": // hollow ring
      return (
        <svg {...common} data-shape="ring">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
  }
}

/* ============================================================
 * Indicator
 * ============================================================ */

function toLength(v: number | string | undefined) {
  return typeof v === "number" ? `${v}px` : v;
}

/** Bumps when the shown text changes after the first render, to replay the pop. */
function usePopKey(text: string | undefined) {
  const [prev, setPrev] = React.useState(text);
  const [key, setKey] = React.useState(0);
  if (prev !== text) {
    setPrev(text);
    if (prev !== undefined && text !== undefined) setKey((k) => k + 1);
  }
  return key;
}

export const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  (
    {
      count: countProp,
      dot = false,
      status,
      content,
      label,
      showLabel = false,
      max,
      showZero = false,
      format,
      locale,
      formatOptions,
      formatOverflow,
      position = "top-end",
      offset,
      overlap = "rectangular",
      tone: toneProp = "accent",
      pulse = false,
      visible = true,
      disabled = false,
      bordered: borderedProp,
      size = "md",
      announce = false,
      children,
      render,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const overlay = children != null && children !== false;
    const bordered = borderedProp ?? overlay;
    const labelId = React.useId();

    const count =
      countProp === undefined || Number.isNaN(countProp) ? undefined : Math.max(0, countProp);

    // What it shows: status > dot > content > count
    const kind: "status" | "dot" | "content" | "count" | null = status
      ? "status"
      : dot
        ? "dot"
        : content != null
          ? "content"
          : count !== undefined
            ? "count"
            : null;

    const zeroHidden = kind === "count" && count === 0 && !showZero;
    const shown = visible && kind !== null && !zeroHidden;

    const text =
      kind === "count" && count !== undefined
        ? formatCount(count, { max, format, locale, formatOptions, overflow: formatOverflow })
        : undefined;
    const popKey = usePopKey(shown ? text : undefined);

    // What screen readers hear: the raw count, never "99+" or "1.2K"
    const rawCount = count !== undefined ? new Intl.NumberFormat(locale).format(count) : undefined;
    // A label function needs a count; without one, fall back to the defaults
    const given =
      typeof label === "function" ? (count !== undefined ? label(count) : undefined) : label;
    const labelText =
      given ??
      (status ? defaultStatusLabels[status] : undefined) ??
      (kind === "dot" ? DOT_FALLBACK_LABEL : undefined);

    // Not a crash (Spectrum throws): a negative count shows as 0, with a warning once
    const negative = countProp !== undefined && countProp < 0;
    const warnedNegative = React.useRef(false);
    React.useEffect(() => {
      if (isDev && negative && !warnedNegative.current) {
        warnedNegative.current = true;
        console.warn("[Southpaw] Indicator: `count` can't be negative; showing 0.");
      }
    }, [negative]);

    // Dev warning, once per mount: an overlay count or content with nothing to say
    const warned = React.useRef(false);
    const ariaHidden = props["aria-hidden"];
    const needsLabel = overlay && (kind === "count" || kind === "content") && !label && !ariaHidden;
    React.useEffect(() => {
      if (isDev && needsLabel && !warned.current) {
        warned.current = true;
        console.warn(
          "[Southpaw] Indicator: give it a `label` so screen readers know what the number means, e.g. label={(n) => `${n} unread notifications`}.",
        );
      }
    }, [needsLabel]);

    // Opt-in announcement of changes, debounced, never on first render
    const spoken = shown ? (labelText ?? rawCount) : undefined;
    const firstSpoken = React.useRef(true);
    React.useEffect(() => {
      if (firstSpoken.current) {
        firstSpoken.current = false;
        return;
      }
      if (!announce || !spoken) return;
      const timer = setTimeout(() => announceMessage(spoken), 400);
      return () => clearTimeout(timer);
    }, [announce, spoken]);

    const effectiveTone: IndicatorTone = disabled ? "neutral" : toneProp;
    const pulsing = pulse && !disabled && shown;

    const [v, h] = position.split("-") as [keyof typeof vertical, keyof typeof horizontal];

    /* ---- The visible badge (always aria-hidden) ---- */
    const badge =
      kind === null ? null : (
        <span
          key={popKey}
          data-slot="indicator-badge"
          data-kind={kind}
          data-status={status}
          aria-hidden="true"
          className={cn(
            overlay ? cn(overlayPlacement, vertical[v], horizontal[h]) : "relative",
            "pointer-events-none select-none",
            motion,
            // Overlays scale away (they're out of flow anyway)
            !shown && overlay && "scale-0 opacity-0",
            popKey > 0 && popClass,
            kind === "status"
              ? cn(
                  "inline-block shrink-0 rounded-full",
                  statusSize[size],
                  disabled ? statusColour.neutral : statusColour[status!],
                  bordered && "bg-indicator-ring box-content p-0.5",
                )
              : cn(
                  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-semibold tabular-nums leading-none",
                  kind === "dot" ? dotSize[size] : pillSize[size],
                  toneClasses[effectiveTone],
                  bordered && "ring-indicator-ring ring-2",
                  forcedPill,
                ),
            pulsing && pulseClasses,
            // Inline ones collapse, so a hidden count leaves no gap after the text.
            // Last, so it wins over the badge's display class.
            !shown && !overlay && "hidden",
          )}
        >
          {kind === "status" ? (
            <StatusShape status={status!} />
          ) : kind === "content" ? (
            content
          ) : kind === "count" ? (
            text
          ) : null}
        </span>
      );

    // A number or length nudges both ways; { x, y } each. x runs along the reading direction.
    const { x: ox, y: oy } = typeof offset === "object" ? offset : { x: offset, y: offset };
    const offsetVars =
      offset === undefined
        ? undefined
        : ({
            "--sp-indicator-ox": toLength(ox) ?? "0px",
            "--sp-indicator-oy": toLength(oy) ?? "0px",
          } as React.CSSProperties);

    /* ---- Overlay: wrap the child. Inline: sit beside text. ---- */
    const single =
      overlay && React.Children.count(children) === 1 && React.isValidElement(children);
    const describe = overlay && single && shown && labelText ? labelId : undefined;
    const child =
      describe && React.isValidElement<Record<string, unknown>>(children)
        ? React.cloneElement(children, {
            "aria-describedby": cn(
              children.props["aria-describedby"] as string | undefined,
              describe,
            ),
          })
        : children;
    const srText = labelText ?? rawCount;

    return useRender({
      defaultTagName: "span",
      render,
      ref,
      props: {
        ...props,
        "data-slot": "indicator",
        "data-position": overlay ? position : undefined,
        "data-inline": overlay ? undefined : "",
        "data-hidden": shown ? undefined : "",
        "data-disabled": disabled ? "" : undefined,
        style: { ...offsetVars, ...style },
        className: mergeClassName(
          overlay
            ? cn(
                // w-fit: a flex-column or grid parent would otherwise stretch the
                // wrapper, and the badge would sit on the far edge, not on the child
                "relative inline-flex w-fit shrink-0 align-middle",
                overlap === "circular"
                  ? "[--sp-indicator-inset:14%]"
                  : "[--sp-indicator-inset:0px]",
              )
            : cn(
                "inline-flex items-center gap-1.5 align-middle",
                showLabel && kind === "status" && "text-fg-default text-sm",
              ),
          className,
        ),
        children: overlay ? (
          <>
            {child}
            {badge}
            {shown && labelText && (
              // Referenced by the child's aria-describedby. If the child can't take
              // one (text, several nodes), it's read in place instead.
              <span
                id={labelId}
                data-slot="indicator-label"
                {...(single ? { hidden: true } : { className: "sr-only" })}
              >
                {labelText}
              </span>
            )}
          </>
        ) : (
          <>
            {badge}
            {shown &&
              srText &&
              (showLabel && kind === "status" ? (
                <span data-slot="indicator-label">{srText}</span>
              ) : (
                // Joins the name of the tab or link: "Issues (12)" (Primer)
                <span data-slot="indicator-label" className="sr-only">
                  {` (${srText})`}
                </span>
              ))}
          </>
        ),
      },
    });
  },
);
Indicator.displayName = "Indicator";
