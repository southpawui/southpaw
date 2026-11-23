import * as React from "react";
import { InfoIcon } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Link, type LinkProps } from "../Link/Link";
import { Tooltip } from "../Tooltip/Tooltip";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { CopyButton } from "./copy-button";
import {
  formatDescriptionValue,
  isEmptyValue,
  type DescriptionFormat,
  type DescriptionValue,
} from "./format";

export {
  formatDescriptionValue,
  type DescriptionFormat,
  type DescriptionRange,
  type DescriptionValue,
} from "./format";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// library doesn't need Node types.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * DescriptionList (GEO-966)
 *
 * Key–value content on a real `dl > div > dt + dd`. An optional actions
 * column makes it GOV.UK's Summary list, and SummaryCard puts one in a
 * Card with a heading.
 *
 * Layout: in one column, the `dl` is a grid (term | value | actions) and
 * each row is a subgrid, so the columns line up across rows and a row
 * without actions keeps its place. `display: contents` is never used on
 * `dt`/`dd` (Safari has dropped semantics for it). In several columns,
 * each item lays itself out.
 * ============================================================ */

type Orientation = "horizontal" | "vertical" | "responsive";
type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6;

export interface DescriptionListLabels {
  /** Shown when a value is missing (GOV.UK Check answers). */
  empty: string;
  /** Copy button tooltip, then its name with the term as hidden context. */
  copy: string;
  copied: string;
  copyFailed: string;
  /** Name of the info button next to a term: `info("Email")` → "More about Email". */
  info: (term?: string) => string;
}

export const defaultDescriptionListLabels: DescriptionListLabels = {
  empty: "Not provided",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Copy failed",
  info: (term) => (term ? `More about ${term}` : "More information"),
};

/* ----- Contexts ----- */

interface RootContextValue {
  orientation: Orientation;
  /** One column at every breakpoint: rows share the dl's grid (subgrid). */
  aligned: boolean;
  columns: Record<Breakpoint, ColumnCount>;
  variant: "plain" | "divided" | "bordered" | "striped";
  size: "sm" | "md" | "lg";
  labelStyle: "muted" | "strong";
  labelAlign: "start" | "end";
  labels: DescriptionListLabels;
  locale?: string | string[];
  hideEmpty: boolean;
}

const RootContext = React.createContext<RootContextValue | null>(null);

interface ItemContextValue {
  /** The term as text, for hidden context on actions and buttons. */
  term?: string;
  setDomTerm: (term: string | undefined) => void;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

/** Set by SummaryCard (every action inside) and Header (its own actions). */
interface TitleContextValue {
  title?: string;
  headingId?: string;
}

const TitleContext = React.createContext<TitleContextValue>({});

const fallbackRoot: RootContextValue = {
  orientation: "vertical",
  aligned: false,
  columns: { base: 1, sm: 1, md: 1, lg: 1, xl: 1 },
  variant: "plain",
  size: "md",
  labelStyle: "muted",
  labelAlign: "start",
  labels: defaultDescriptionListLabels,
  hideEmpty: false,
};

/* ----- Helpers ----- */

/** Plain text of a node made only of strings and numbers, else undefined. */
function textOf(node: React.ReactNode): string | undefined {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(textOf);
    return parts.every((p) => p !== undefined) ? parts.join("") : undefined;
  }
  return undefined;
}

function isEmptyNode(node: React.ReactNode): boolean {
  if (node == null || node === false || node === true) return true;
  if (typeof node === "string") return node.trim() === "";
  if (Array.isArray(node)) return node.every(isEmptyNode);
  return false;
}

const BREAKPOINTS: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];

function resolveColumns(
  columns: ColumnCount | Partial<Record<Breakpoint, ColumnCount>> | undefined,
): Record<Breakpoint, ColumnCount> {
  const given = typeof columns === "number" ? { base: columns } : (columns ?? {});
  const out = {} as Record<Breakpoint, ColumnCount>;
  let last: ColumnCount = 1;
  for (const bp of BREAKPOINTS) {
    last = given[bp] ?? last;
    out[bp] = last;
  }
  return out;
}

// Literal class names, so Tailwind can see them.
const GRID_COLS: Record<Breakpoint, string[]> = {
  base: [
    "",
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
  ],
  sm: [
    "",
    "sm:grid-cols-1",
    "sm:grid-cols-2",
    "sm:grid-cols-3",
    "sm:grid-cols-4",
    "sm:grid-cols-5",
    "sm:grid-cols-6",
  ],
  md: [
    "",
    "md:grid-cols-1",
    "md:grid-cols-2",
    "md:grid-cols-3",
    "md:grid-cols-4",
    "md:grid-cols-5",
    "md:grid-cols-6",
  ],
  lg: [
    "",
    "lg:grid-cols-1",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
    "lg:grid-cols-4",
    "lg:grid-cols-5",
    "lg:grid-cols-6",
  ],
  xl: [
    "",
    "xl:grid-cols-1",
    "xl:grid-cols-2",
    "xl:grid-cols-3",
    "xl:grid-cols-4",
    "xl:grid-cols-5",
    "xl:grid-cols-6",
  ],
};
const COL_SPAN: Record<Breakpoint, string[]> = {
  base: ["", "col-span-1", "col-span-2", "col-span-3", "col-span-4", "col-span-5", "col-span-6"],
  sm: [
    "",
    "sm:col-span-1",
    "sm:col-span-2",
    "sm:col-span-3",
    "sm:col-span-4",
    "sm:col-span-5",
    "sm:col-span-6",
  ],
  md: [
    "",
    "md:col-span-1",
    "md:col-span-2",
    "md:col-span-3",
    "md:col-span-4",
    "md:col-span-5",
    "md:col-span-6",
  ],
  lg: [
    "",
    "lg:col-span-1",
    "lg:col-span-2",
    "lg:col-span-3",
    "lg:col-span-4",
    "lg:col-span-5",
    "lg:col-span-6",
  ],
  xl: [
    "",
    "xl:col-span-1",
    "xl:col-span-2",
    "xl:col-span-3",
    "xl:col-span-4",
    "xl:col-span-5",
    "xl:col-span-6",
  ],
};

/** Per-orientation placement. `responsive` stacks, then goes side by side from `sm`. */
const PLACEMENT: Record<
  Orientation,
  {
    dl: string;
    itemAligned: string;
    itemOwn: string;
    term: string;
    details: string;
    actions: string;
    labelEnd: string;
  }
> = {
  horizontal: {
    dl: "grid-cols-[minmax(0,var(--sp-dl-label-width,30%))_minmax(0,1fr)_auto] gap-x-[calc(var(--sp-control-gap)*2)]",
    itemAligned: "col-span-full grid grid-cols-subgrid items-start gap-y-1",
    itemOwn:
      "grid grid-cols-[minmax(0,var(--sp-dl-label-width,40%))_minmax(0,1fr)_auto] items-start gap-x-[calc(var(--sp-control-gap)*2)] gap-y-1",
    term: "col-start-1 row-start-1",
    details: "col-start-2",
    actions: "col-start-3 row-start-1 justify-self-end text-end",
    labelEnd: "text-end",
  },
  responsive: {
    dl: "grid-cols-1 sm:grid-cols-[minmax(0,var(--sp-dl-label-width,30%))_minmax(0,1fr)_auto] sm:gap-x-[calc(var(--sp-control-gap)*2)]",
    itemAligned: "col-span-full flex flex-col gap-y-1 sm:grid sm:grid-cols-subgrid sm:items-start",
    itemOwn:
      "flex flex-col gap-1 sm:grid sm:grid-cols-[minmax(0,var(--sp-dl-label-width,40%))_minmax(0,1fr)_auto] sm:items-start sm:gap-x-[calc(var(--sp-control-gap)*2)]",
    term: "sm:col-start-1 sm:row-start-1",
    details: "sm:col-start-2",
    actions: "sm:col-start-3 sm:row-start-1 sm:justify-self-end sm:text-end",
    labelEnd: "sm:text-end",
  },
  vertical: {
    dl: "grid-cols-1",
    itemAligned: "flex flex-col gap-1",
    itemOwn: "flex flex-col gap-1",
    term: "",
    details: "",
    actions: "",
    labelEnd: "",
  },
};

// Row padding follows the density's control gap (8px default, 6 compact, 12 comfortable).
const ROW_PADDING = {
  sm: "py-[var(--sp-control-gap)]",
  md: "py-[calc(var(--sp-control-gap)*1.5)]",
  lg: "py-[calc(var(--sp-control-gap)*2)]",
};
const TEXT_SIZE = { sm: "text-sm", md: "text-base", lg: "text-lg" };

/* ============================================================
 * Root
 * ============================================================ */

export interface DescriptionListItemData {
  /** React key. Defaults to the term text or the index. */
  id?: React.Key;
  term: React.ReactNode;
  /** Help next to the term (an info button with a tooltip). */
  info?: React.ReactNode;
  /** The value, or several (alternatives, one `dd` each). */
  details?: React.ReactNode | React.ReactNode[];
  /** A value to format with Intl instead of `details`. */
  value?: DescriptionValue | null;
  format?: DescriptionFormat;
  copyable?: boolean | string;
  empty?: React.ReactNode;
  /** Row actions: each is an Action's props, with the label as `children`. */
  actions?: ActionProps[];
  span?: ItemProps["span"];
  divider?: boolean;
  hideEmpty?: boolean;
}

export interface DescriptionListRootProps extends React.ComponentPropsWithRef<"dl"> {
  /** `responsive` (default) stacks below `sm`, then puts the term beside the value. */
  orientation?: Orientation;
  /** Items per row, as a number or per breakpoint (`{ base: 1, md: 2 }`). Default 1. */
  columns?: ColumnCount | Partial<Record<Breakpoint, ColumnCount>>;
  /** `divided` (default): a line between rows. `bordered` adds a box; `striped` tints every other row. */
  variant?: "plain" | "divided" | "bordered" | "striped";
  size?: "sm" | "md" | "lg";
  /** `muted` (default): quieter terms, values stand out. `strong`: bold terms (GOV.UK). */
  labelStyle?: "muted" | "strong";
  /** Width of the term column when side by side. Default 30% (GOV.UK), 40% in several columns. */
  labelWidth?: string | number;
  /** Align terms to the start or end of their column. Logical, so it flips in RTL. */
  labelAlign?: "start" | "end";
  /** Shorthand for simple lists. Rendered before any children. */
  items?: DescriptionListItemData[];
  /** Translations. */
  labels?: Partial<DescriptionListLabels>;
  /** Locale for formatted values. Default: the runtime's. */
  locale?: string | string[];
  /**
   * Leave out rows with no value instead of showing "Not provided". Use it for
   * optional details; on a check-answers page, show the empty text instead (GOV.UK).
   */
  hideEmpty?: boolean;
}

const Root = React.forwardRef<HTMLDListElement, DescriptionListRootProps>(
  (
    {
      orientation = "responsive",
      columns: columnsProp,
      variant = "divided",
      size = "md",
      labelStyle = "muted",
      labelWidth,
      labelAlign = "start",
      hideEmpty = false,
      items,
      labels: labelsProp,
      locale,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    // Inline objects (`columns={{ base: 1, md: 2 }}`, `labels={{ … }}`) are new every
    // render, so memoise on their contents.
    const columnsKey = JSON.stringify(resolveColumns(columnsProp));
    const labelsKey = labelsProp
      ? Object.entries(labelsProp)
          .filter(([, v]) => typeof v !== "function")
          .map(([k, v]) => `${k}:${String(v)}`)
          .join("|")
      : "";
    // A function's source text isn't its identity (closures differ), so track it directly.
    const labelsInfo = labelsProp?.info;
    const ctx = React.useMemo<RootContextValue>(() => {
      const columns = JSON.parse(columnsKey) as Record<Breakpoint, ColumnCount>;
      return {
        orientation,
        aligned: BREAKPOINTS.every((bp) => columns[bp] === 1),
        columns,
        variant,
        size,
        labelStyle,
        labelAlign,
        labels: { ...defaultDescriptionListLabels, ...labelsProp },
        locale,
        hideEmpty,
      };
      // labelsProp is tracked by labelsKey (strings) and labelsInfo (the function itself)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      orientation,
      columnsKey,
      variant,
      size,
      labelStyle,
      labelAlign,
      locale,
      labelsKey,
      labelsInfo,
      hideEmpty,
    ]);
    const { columns, aligned } = ctx;

    // A Header child renders above the dl and names it (a dl can't hold a heading).
    let header: React.ReactElement<HeaderProps> | null = null;
    const rest: React.ReactNode[] = [];
    React.Children.forEach(children, (child) => {
      if (!header && React.isValidElement(child) && child.type === Header) {
        header = child as React.ReactElement<HeaderProps>;
      } else {
        rest.push(child);
      }
    });
    const generatedId = React.useId();
    const headerEl = header as React.ReactElement<HeaderProps> | null;
    const headingId = headerEl ? (headerEl.props.id ?? `${generatedId}-heading`) : undefined;
    const card = React.useContext(TitleContext);
    const labelledBy =
      props["aria-labelledby"] ?? (props["aria-label"] ? undefined : (headingId ?? card.headingId));

    const p = PLACEMENT[orientation];
    const widthVar =
      labelWidth === undefined
        ? undefined
        : typeof labelWidth === "number"
          ? `${labelWidth}px`
          : labelWidth;

    const list = (
      <dl
        ref={ref}
        data-slot="description-list"
        data-orientation={orientation}
        data-variant={variant}
        data-size={size}
        aria-labelledby={labelledBy}
        style={widthVar ? { ...style, ["--sp-dl-label-width" as string]: widthVar } : style}
        className={mergeClassName(
          cn(
            "text-fg-default grid w-full min-w-0",
            TEXT_SIZE[size],
            aligned
              ? p.dl
              : cn(
                  BREAKPOINTS.map((bp) => GRID_COLS[bp][columns[bp]]),
                  "gap-x-[calc(var(--sp-control-gap)*3)]",
                ),
            variant === "bordered" && "border-border-default rounded-[var(--radius-lg)] border",
          ),
          className,
        )}
        {...props}
      >
        <RootContext.Provider value={ctx}>
          {items?.map((item, i) => (
            <ItemFromData key={item.id ?? textOf(item.term) ?? i} item={item} />
          ))}
          {rest}
        </RootContext.Provider>
      </dl>
    );

    if (!headerEl) return list;
    return (
      <div data-slot="description-list-container" className="flex w-full min-w-0 flex-col gap-3">
        {React.cloneElement(headerEl, { id: headingId })}
        {list}
      </div>
    );
  },
);
Root.displayName = "DescriptionList.Root";

function ItemFromData({ item }: { item: DescriptionListItemData }) {
  const details = Array.isArray(item.details) ? item.details : [item.details];
  return (
    <Item span={item.span} divider={item.divider} hideEmpty={item.hideEmpty}>
      <Term info={item.info}>{item.term}</Term>
      {details.map((d, i) => (
        <Details
          key={i}
          value={i === 0 ? item.value : undefined}
          format={item.format}
          copyable={item.copyable}
          empty={item.empty}
        >
          {d}
        </Details>
      ))}
      {item.actions?.length ? (
        <Actions>
          {item.actions.map((a, i) => (
            <Action key={i} {...a} />
          ))}
        </Actions>
      ) : null}
    </Item>
  );
}

/* ============================================================
 * Item — one term with its value(s) and actions
 * ============================================================ */

export interface ItemProps extends React.ComponentPropsWithRef<"div"> {
  /** Columns to cover in a multi-column list, or `full` for the whole row. */
  span?: ColumnCount | "full";
  /** Show this row's divider. Default true. Keep dividers when rows have actions (GOV.UK). */
  divider?: boolean;
  /**
   * Leave this row out when every value in it is empty. Defaults to the Root's
   * `hideEmpty`. Only direct `Details` children are checked.
   */
  hideEmpty?: boolean;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    { span, divider = true, hideEmpty: hideEmptyProp, className, children, ...props },
    forwardedRef,
  ) => {
    const rootCtx = React.useContext(RootContext);
    const standalone = !rootCtx;
    const root = rootCtx ?? fallbackRoot;
    const p = PLACEMENT[root.orientation];

    // The term's text, found without waiting for the DOM (so it's there on the server)…
    let scanned: string | undefined;
    // …and whether it has values, all of them empty (for hideEmpty).
    let detailsCount = 0;
    let filledCount = 0;
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      if (scanned === undefined && child.type === Term) {
        scanned = textOf((child.props as TermProps).children);
      } else if (child.type === Details) {
        const d = child.props as DetailsProps;
        detailsCount += 1;
        if (!isEmptyNode(d.children) || (d.value != null && !isEmptyValue(d.value))) {
          filledCount += 1;
        }
      }
    });
    const hideEmpty = hideEmptyProp ?? root.hideEmpty;
    const hidden = hideEmpty && detailsCount > 0 && filledCount === 0;
    // …or, for a Term nested in something else, reported by the Term after it renders.
    const [domTerm, setDomTerm] = React.useState<string | undefined>(undefined);
    const term = scanned ?? domTerm;

    const ref = React.useRef<HTMLElement | null>(null);
    const setRef = React.useCallback(
      (el: HTMLElement | null) => {
        ref.current = el;
        if (typeof forwardedRef === "function") forwardedRef(el as HTMLDivElement);
        else if (forwardedRef) forwardedRef.current = el as HTMLDivElement;
      },
      [forwardedRef],
    );

    const warned = React.useRef(false);
    React.useEffect(() => {
      if (!isDev || warned.current || !ref.current || hidden) return;
      if (!ref.current.querySelector(":scope > dt")) {
        warned.current = true;
        console.warn(
          "[Southpaw] DescriptionList.Item has no Term. Every value needs a term saying what it is.",
        );
      }
    });

    const ctx = React.useMemo<ItemContextValue>(() => ({ term, setDomTerm }), [term]);

    const spanClasses =
      span === "full"
        ? "col-span-full"
        : span && !root.aligned
          ? BREAKPOINTS.map((bp) => COL_SPAN[bp][Math.min(span, root.columns[bp])])
          : undefined;

    const classes = mergeClassName(
      cn(
        "min-w-0",
        root.aligned ? p.itemAligned : p.itemOwn,
        !standalone && ROW_PADDING[root.size],
        spanClasses,
        // Dividers between rows
        divider &&
          (root.variant === "divided" || root.variant === "bordered") &&
          "border-border-default not-last:border-b",
        root.variant === "bordered" && "px-4",
        root.variant === "striped" &&
          // Forced colours drop backgrounds, so stripes become lines there.
          "odd:bg-surface-alternate rounded-[var(--radius-DEFAULT)] px-3 forced-colors:not-last:border-b",
      ),
      className,
    );

    if (hidden) return null;

    const content = <ItemContext.Provider value={ctx}>{children}</ItemContext.Provider>;

    // On its own, an Item is a one-pair `dl` (a `div` can't hold a `dt`).
    if (standalone) {
      return (
        <dl
          ref={setRef as React.Ref<HTMLDListElement>}
          data-slot="description-list-item"
          data-standalone=""
          className={cn("text-fg-default", TEXT_SIZE.md, classes)}
          {...(props as React.ComponentPropsWithoutRef<"dl">)}
        >
          {content}
        </dl>
      );
    }
    return (
      <div
        ref={setRef as React.Ref<HTMLDivElement>}
        data-slot="description-list-item"
        className={classes}
        {...props}
      >
        {content}
      </div>
    );
  },
);
Item.displayName = "DescriptionList.Item";

/* ============================================================
 * Term (dt)
 * ============================================================ */

export interface TermProps extends React.ComponentPropsWithRef<"dt"> {
  /** Help shown in a tooltip from an info button next to the term (Chakra InfoTip). */
  info?: React.ReactNode;
}

const Term = React.forwardRef<HTMLElement, TermProps>(
  ({ info, className, children, ...props }, ref) => {
    const root = React.useContext(RootContext) ?? fallbackRoot;
    const item = React.useContext(ItemContext);
    const p = PLACEMENT[root.orientation];
    const own = textOf(children);
    const textRef = React.useRef<HTMLSpanElement>(null);

    // Report a non-string term's text to the Item, for hidden context.
    const setDomTerm = item?.setDomTerm;
    React.useEffect(() => {
      if (own !== undefined || !setDomTerm) return;
      const text = textRef.current?.textContent?.trim();
      setDomTerm(text || undefined);
    });

    const termText = own ?? item?.term;
    return (
      <dt
        ref={ref}
        data-slot="description-list-term"
        className={mergeClassName(
          cn(
            "min-w-0 break-words",
            p.term,
            root.labelStyle === "strong" ? "text-fg-default font-semibold" : "text-fg-muted",
            root.labelAlign === "end" && p.labelEnd,
          ),
          className,
        )}
        {...props}
      >
        <span ref={textRef} data-slot="description-list-term-text">
          {children}
        </span>
        {info ? (
          <Tooltip.Root>
            <Tooltip.Trigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  data-slot="description-list-info"
                  srOnly={root.labels.info(termText)}
                  icon={<InfoIcon aria-hidden="true" />}
                  className="text-fg-muted hover:text-fg-default -my-1 ms-[calc(var(--sp-control-gap)*1.5)] size-[var(--sp-control-height-sm)] align-middle [&_svg]:size-[1em]"
                />
              }
            />
            <Tooltip.Content>{info}</Tooltip.Content>
          </Tooltip.Root>
        ) : null}
      </dt>
    );
  },
);
Term.displayName = "DescriptionList.Term";

/* ============================================================
 * Details (dd)
 * ============================================================ */

export interface DetailsProps extends Omit<React.ComponentPropsWithRef<"dd">, "children"> {
  children?: React.ReactNode;
  /** A value formatted with Intl (numbers, dates, lists, ranges). `children` win. */
  value?: DescriptionValue | null;
  format?: DescriptionFormat;
  /** Add a copy button. `true` copies the shown text; a string copies that instead. */
  copyable?: boolean | string;
  /** What to show when there's no value. Default "Not provided". Never leave it blank. */
  empty?: React.ReactNode;
}

const Details = React.forwardRef<HTMLElement, DetailsProps>(
  ({ value, format, copyable, empty, className, children, ...props }, ref) => {
    const root = React.useContext(RootContext) ?? fallbackRoot;
    const item = React.useContext(ItemContext);
    const p = PLACEMENT[root.orientation];
    const valueRef = React.useRef<HTMLSpanElement>(null);

    const hasChildren = !isEmptyNode(children);
    const content = hasChildren
      ? children
      : value != null && !isEmptyValue(value)
        ? formatDescriptionValue(value, format, root.locale)
        : null;
    const isEmpty = content === null;

    return (
      <dd
        ref={ref}
        data-slot="description-list-details"
        data-empty={isEmpty ? "" : undefined}
        className={mergeClassName(
          cn(
            "m-0 min-w-0 break-words",
            p.details,
            // Multi-line values (one line per <p>) read as one block: no gap between lines.
            "[&>p]:m-0",
            // Same space as the Term's info button: 1.5 × the control gap, so the
            // focus ring (5px outside the button) stays clear of the text.
            copyable && !isEmpty && "flex items-start gap-[calc(var(--sp-control-gap)*1.5)]",
          ),
          className,
        )}
        {...props}
      >
        {isEmpty ? (
          <span data-slot="description-list-empty" className="text-fg-muted">
            {empty ?? root.labels.empty}
          </span>
        ) : copyable ? (
          <>
            <span ref={valueRef} data-slot="description-list-value" className="min-w-0">
              {content}
            </span>
            <CopyButton
              getText={() =>
                typeof copyable === "string" ? copyable : (valueRef.current?.textContent ?? "")
              }
              context={item?.term}
              labels={root.labels}
            />
          </>
        ) : (
          content
        )}
      </dd>
    );
  },
);
Details.displayName = "DescriptionList.Details";

/* ============================================================
 * Actions (dd) and Action (a Link with hidden context)
 * ============================================================ */

/** One action renders bare; two or more become a list with dividers (GOV.UK). */
function ActionGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  // Look through fragments: `actions={<>…</>}` is the natural way to pass several.
  const flatten = (nodes: React.ReactNode): React.ReactElement[] =>
    React.Children.toArray(nodes).flatMap((node) =>
      React.isValidElement(node) && node.type === React.Fragment
        ? flatten((node.props as { children?: React.ReactNode }).children)
        : React.isValidElement(node)
          ? [node]
          : [],
    );
  const actions = flatten(children);
  if (actions.length <= 1) return <>{children}</>;
  return (
    <ul
      data-slot="description-list-action-list"
      className={cn("m-0 inline-flex list-none flex-wrap p-0", className)}
    >
      {actions.map((action, i) => (
        <li
          key={action.key ?? i}
          className="border-border-default not-first:border-s not-first:ps-3 not-last:pe-3"
        >
          {action}
        </li>
      ))}
    </ul>
  );
}

const Actions = React.forwardRef<HTMLElement, React.ComponentPropsWithRef<"dd">>(
  ({ className, children, ...props }, ref) => {
    const root = React.useContext(RootContext) ?? fallbackRoot;
    const p = PLACEMENT[root.orientation];
    return (
      <dd
        ref={ref}
        data-slot="description-list-actions"
        className={mergeClassName(cn("m-0 min-w-0", p.actions), className)}
        {...props}
      >
        <ActionGroup>{children}</ActionGroup>
      </dd>
    );
  },
);
Actions.displayName = "DescriptionList.Actions";

export interface ActionProps extends LinkProps {
  /**
   * Hidden text after the label, so "Change" reads "Change name". Defaults to the
   * Item's term (and the SummaryCard title in brackets). `false` turns it off.
   */
  context?: string | false;
}

const Action = React.forwardRef<HTMLAnchorElement, ActionProps>(
  ({ context, children, className, ...props }, ref) => {
    const item = React.useContext(ItemContext);
    const { title } = React.useContext(TitleContext);
    const term = context === false ? undefined : (context ?? item?.term);
    const hidden =
      context === false ? "" : [term, title ? `(${title})` : undefined].filter(Boolean).join(" ");

    const missing = context === undefined && item !== null && item.term === undefined;
    const warned = React.useRef(false);
    React.useEffect(() => {
      if (!isDev || !missing || warned.current) return;
      warned.current = true;
      console.warn(
        '[Southpaw] DescriptionList.Action: the term isn\'t plain text, so pass `context` ("Change name" needs "name").',
      );
    }, [missing]);

    return (
      <Link
        ref={ref}
        data-slot="description-list-action"
        // A focused link sits above its neighbours so their dividers can't cover the ring.
        className={cn("focus-visible:relative focus-visible:z-10", className)}
        {...props}
      >
        {children}
        {hidden ? <VisuallyHidden> {hidden}</VisuallyHidden> : null}
      </Link>
    );
  },
);
Action.displayName = "DescriptionList.Action";

/* ============================================================
 * Header — a heading (and actions) above the list, naming it
 * ============================================================ */

export interface HeaderProps extends Omit<React.ComponentPropsWithRef<"div">, "title"> {
  /** Heading level. Default 2 (GOV.UK). */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Actions for the whole list, e.g. `<DescriptionList.Action>`. Their hidden context is the title. */
  actions?: React.ReactNode;
  /** The heading's id (the list's `aria-labelledby`). Generated if not given. */
  id?: string;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ headingLevel = 2, actions, id: idProp, className, children, ...props }, ref) => {
    const generated = React.useId();
    const id = idProp ?? generated;
    const Heading = `h${headingLevel}` as "h2";
    const title = textOf(children);
    return (
      <div
        ref={ref}
        data-slot="description-list-header"
        className={mergeClassName(
          cn("flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2"),
          className,
        )}
        {...props}
      >
        <Heading
          id={id}
          data-slot="description-list-title"
          className="text-fg-default m-0 text-lg font-semibold"
        >
          {children}
        </Heading>
        {actions ? (
          <TitleContext.Provider value={{ title }}>
            <div data-slot="description-list-header-actions" className="flex items-center">
              <ActionGroup>{actions}</ActionGroup>
            </div>
          </TitleContext.Provider>
        ) : null}
      </div>
    );
  },
);
Header.displayName = "DescriptionList.Header";

/* ============================================================
 * SummaryCard — a Card with a heading around a DescriptionList (GOV.UK)
 * ============================================================ */

export interface SummaryCardProps extends Omit<React.ComponentPropsWithRef<"div">, "title"> {
  /** The card's heading. Plain text also becomes the actions' hidden context. */
  title: React.ReactNode;
  /** Heading level. Default 2 (GOV.UK). */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Actions for the whole card. Keep to 2–3 short ones (GOV.UK). */
  actions?: React.ReactNode;
  /** Hidden context when `title` isn't plain text. */
  context?: string;
}

export const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ title, headingLevel = 2, actions, context, className, children, ...props }, ref) => {
    const headingId = React.useId();
    const Heading = `h${headingLevel}` as "h2";
    const titleText = context ?? textOf(title);
    const ctx = React.useMemo(() => ({ title: titleText, headingId }), [titleText, headingId]);
    return (
      <Card.Root
        ref={ref}
        variant="outline"
        data-slot="summary-card"
        className={mergeClassName("w-full", className)}
        {...props}
      >
        <TitleContext.Provider value={ctx}>
          <div
            data-slot="summary-card-header"
            className={cn(
              "bg-surface-alternate border-border-default flex flex-col gap-2 border-b px-4 py-3",
              "sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4",
            )}
          >
            <Heading
              id={headingId}
              data-slot="summary-card-title"
              className="text-fg-default m-0 text-lg font-semibold"
            >
              {title}
            </Heading>
            {actions ? (
              <div data-slot="summary-card-actions" className="flex items-center">
                <ActionGroup>{actions}</ActionGroup>
              </div>
            ) : null}
          </div>
          <div data-slot="summary-card-content" className="px-4 py-1">
            {children}
          </div>
        </TitleContext.Provider>
      </Card.Root>
    );
  },
);
SummaryCard.displayName = "SummaryCard";

export const DescriptionList = {
  Root,
  Header,
  Item,
  Term,
  Details,
  Actions,
  Action,
  SummaryCard,
};
