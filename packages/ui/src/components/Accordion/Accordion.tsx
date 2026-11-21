import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "../../lib/cn";
import { Button } from "../Button/Button";
import {
  CollapsibleChevron,
  collapsibleStyles,
  useCollapsibleOpenChangeComplete,
  type CollapsibleSize,
  type HeadingLevel,
} from "../Collapsible/Collapsible";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// package doesn't need @types/node.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * Types
 * ============================================================ */

export type AccordionSize = CollapsibleSize;
/**
 * - `default` — dividers between items
 * - `bordered` — one boxed container with dividers (Mantine "contained")
 * - `separated` — each item is its own card, with a gap between
 * - `filled` — no borders; the open item gets a sunken background
 * - `ghost` — flush: no padding, borders or fill (Carbon "flush")
 */
export type AccordionVariant = "default" | "bordered" | "separated" | "filled" | "ghost";
export type { HeadingLevel };

type Value = unknown;
type ChangeDetails = BaseAccordion.Root.ChangeEventDetails;

export interface AccordionStateText {
  /** Shown while the section is closed. @default "Show" */
  closed?: React.ReactNode;
  /** Shown while the section is open. @default "Hide" */
  open?: React.ReactNode;
}

export interface AccordionExpandAllLabels {
  /** @default "Show all sections" */
  expandLabel?: React.ReactNode;
  /** @default "Hide all sections" */
  collapseLabel?: React.ReactNode;
}

/* ============================================================
 * Context
 * ============================================================ */

interface RootContextValue {
  value: Value[];
  size: AccordionSize;
  variant: AccordionVariant;
  headingLevel: HeadingLevel;
  iconPosition: "start" | "end";
  stateText: Required<AccordionStateText> | null;
  collapsible: boolean;
  ordered: boolean;
  regions: boolean;
  animateOpacity: boolean;
  register: (key: string, entry: { value: Value; disabled: boolean }) => void;
  unregister: (key: string) => void;
}

const RootContext = React.createContext<RootContextValue | null>(null);

function useRootContext(part: string) {
  const ctx = React.useContext(RootContext);
  if (!ctx) throw new Error(`Accordion.${part} must be used inside Accordion.Root`);
  return ctx;
}

interface ItemContextValue {
  value: Value;
  open: boolean;
  disabled: boolean;
  onOpenChangeComplete?: (open: boolean) => void;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItemContext(part: string) {
  const ctx = React.useContext(ItemContext);
  if (!ctx) throw new Error(`Accordion.${part} must be used inside Accordion.Item`);
  return ctx;
}

/** Details object for changes that aren't a trigger press (expand all). */
function createDetails(event: Event): ChangeDetails {
  let canceled = false;
  return {
    reason: "none",
    event,
    cancel: () => {
      canceled = true;
    },
    allowPropagation: () => {},
    get isCanceled() {
      return canceled;
    },
    isPropagationAllowed: false,
    trigger: undefined,
  } as unknown as ChangeDetails;
}

const storageKey = (key: string) => `sp-accordion:${key}`;

function readStored(key: string): Value[] | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey(key));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: Value[]) {
  try {
    window.sessionStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    // Storage blocked (private mode, quota): remembering is a convenience only
  }
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/* ============================================================
 * Root
 * ============================================================ */

export interface AccordionRootProps extends Omit<
  BaseAccordion.Root.Props,
  "orientation" | "loopFocus"
> {
  /** Trigger height and padding. Heights follow density. @default "md" */
  size?: AccordionSize;
  /** @default "default" */
  variant?: AccordionVariant;
  /** Heading level wrapping each trigger. Override per item on `Accordion.Header`. @default 3 */
  headingLevel?: HeadingLevel;
  /** Where the chevron sits. `start` suits tree-like content. @default "end" */
  iconPosition?: "start" | "end";
  /** Visible "Show" / "Hide" text beside the chevron (GOV.UK). `true` uses the defaults. */
  stateText?: boolean | AccordionStateText;
  /**
   * Render a "Show all sections" / "Hide all sections" toggle above the items.
   * Needs `multiple`. Pass an object to localise the labels.
   */
  expandAll?: boolean | AccordionExpandAllLabels;
  /**
   * Whether the last open item can be closed. `false` keeps one section open
   * (its trigger gets `aria-disabled`). @default true
   */
  collapsible?: boolean;
  /**
   * Arrow Up/Down, Home and End move focus between triggers. Off by default:
   * the APG pattern removed these keys in 2026, so Tab is the expected way.
   * @default false
   */
  keyboardNavigation?: boolean;
  /**
   * Remember which sections are open for the browser session (sessionStorage),
   * under this key. Give each item a stable `value`. Ignored when controlled.
   */
  rememberKey?: string;
  /** Numbered items rendered as an ordered list (`<ol>`). @default false */
  ordered?: boolean;
  /**
   * Give each panel `role="region"` labelled by its trigger. Off by default:
   * APG advises against it when many panels can be open, as it floods the
   * landmark list. @default false
   */
  regions?: boolean;
  /**
   * Let browser find-in-page and text-fragment links open closed panels.
   * Panels stay in the DOM. @default true
   */
  hiddenUntilFound?: boolean;
  /** Fade panels in and out as they expand. @default false */
  animateOpacity?: boolean;
  /** Override the expand/collapse duration (ms). Defaults to `--sp-duration-slow`. */
  transitionDuration?: number;
  /** Override the expand/collapse easing (any CSS easing). */
  transitionEasing?: string;
}

const listVariantClasses: Record<AccordionVariant, string> = {
  default: "",
  ghost: "",
  bordered:
    "border-border-default bg-surface-base rounded-[var(--radius-DEFAULT)] border [--sp-nested-radius:calc(var(--radius-DEFAULT)-1px)]",
  separated: "flex flex-col gap-2 [--sp-nested-radius:calc(var(--radius-DEFAULT)-1px)]",
  filled: "flex flex-col gap-1",
};

const Root = React.forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  const {
    className,
    style,
    children,
    value: valueProp,
    defaultValue,
    onValueChange,
    multiple = false,
    disabled = false,
    size = "md",
    variant = "default",
    headingLevel = 3,
    iconPosition = "end",
    stateText,
    expandAll,
    collapsible = true,
    keyboardNavigation = false,
    rememberKey,
    ordered = false,
    regions = false,
    hiddenUntilFound = true,
    animateOpacity = false,
    transitionDuration,
    transitionEasing,
    onKeyDown,
    ...rest
  } = props;

  // Mirror Base UI's value so expand-all, remembering and the "keep one open" rule can read it
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<Value[]>(() => defaultValue ?? []);
  const value = isControlled ? valueProp : uncontrolled;

  // Restore remembered state after mount (sessionStorage isn't available during SSR)
  useIsoLayoutEffect(() => {
    if (!rememberKey || isControlled) return;
    const stored = readStored(rememberKey);
    if (stored) setUncontrolled(multiple ? stored : stored.slice(0, 1));
    // Only on mount / key change
  }, [rememberKey]);

  const handleValueChange = React.useCallback(
    (next: Value[], details: ChangeDetails) => {
      // Keep one section open: cancel the change that would close the last one
      if (!collapsible && next.length === 0 && value.length > 0) {
        details.cancel();
        return;
      }
      onValueChange?.(next, details);
      if (details.isCanceled) return;
      if (isControlled) return;
      setUncontrolled(next);
      if (rememberKey) writeStored(rememberKey, next);
    },
    [collapsible, value.length, onValueChange, isControlled, rememberKey],
  );

  // Item registry: which values exist (and are enabled), for expand all
  const items = React.useRef(new Map<string, { value: Value; disabled: boolean }>());
  const [, setVersion] = React.useState(0);
  const register = React.useCallback((key: string, entry: { value: Value; disabled: boolean }) => {
    const prev = items.current.get(key);
    if (prev && Object.is(prev.value, entry.value) && prev.disabled === entry.disabled) return;
    items.current.set(key, entry);
    setVersion((v) => v + 1);
  }, []);
  const unregister = React.useCallback((key: string) => {
    items.current.delete(key);
    setVersion((v) => v + 1);
  }, []);

  const stateClosed = stateText && stateText !== true ? stateText.closed : undefined;
  const stateOpen = stateText && stateText !== true ? stateText.open : undefined;
  const hasStateText = Boolean(stateText);
  const resolvedStateText = React.useMemo(
    () => (hasStateText ? { closed: stateClosed ?? "Show", open: stateOpen ?? "Hide" } : null),
    [hasStateText, stateClosed, stateOpen],
  );

  // Memoised so parts only re-render when something they read changes
  const ctx = React.useMemo<RootContextValue>(
    () => ({
      value,
      size,
      variant,
      headingLevel,
      iconPosition,
      stateText: resolvedStateText,
      collapsible,
      ordered,
      regions,
      animateOpacity,
      register,
      unregister,
    }),
    [
      value,
      size,
      variant,
      headingLevel,
      iconPosition,
      resolvedStateText,
      collapsible,
      ordered,
      regions,
      animateOpacity,
      register,
      unregister,
    ],
  );

  // Optional roving arrow keys between this accordion's own triggers
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const handleKeyDown: NonNullable<AccordionRootProps["onKeyDown"]> = (event) => {
    onKeyDown?.(event);
    if (!keyboardNavigation || event.defaultPrevented) return;
    const root = rootRef.current;
    const target = event.target as HTMLElement;
    if (!root || target.getAttribute("data-slot") !== "accordion-trigger") return;
    if (target.closest("[data-slot=accordion]") !== root) return;
    const triggers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-slot=accordion-trigger]:not([data-disabled])"),
    ).filter((el) => el.closest("[data-slot=accordion]") === root);
    const index = triggers.indexOf(target);
    if (index === -1) return;
    let next: HTMLElement | undefined;
    if (event.key === "ArrowDown") next = triggers[(index + 1) % triggers.length];
    else if (event.key === "ArrowUp")
      next = triggers[(index - 1 + triggers.length) % triggers.length];
    else if (event.key === "Home") next = triggers[0];
    else if (event.key === "End") next = triggers[triggers.length - 1];
    if (!next) return;
    event.preventDefault();
    next.focus();
  };

  const warned = React.useRef(false);
  React.useEffect(() => {
    if (isDev && expandAll && !multiple && !warned.current) {
      warned.current = true;
      console.warn(
        "[Southpaw] Accordion.Root: `expandAll` needs `multiple`; the toggle is not rendered.",
      );
    }
  }, [expandAll, multiple]);

  const showToggle = Boolean(expandAll) && multiple;
  const toggleLabels = {
    expandLabel: "Show all sections",
    collapseLabel: "Hide all sections",
    ...(typeof expandAll === "object" ? expandAll : {}),
  };
  const enabledValues = Array.from(items.current.values())
    .filter((entry) => !entry.disabled)
    .map((entry) => entry.value);
  const allOpen = enabledValues.length > 0 && enabledValues.every((v) => value.includes(v));
  const toggleAll = (event: React.MouseEvent) => {
    let next = allOpen
      ? value.filter((v) => !enabledValues.includes(v))
      : [...value, ...enabledValues.filter((v) => !value.includes(v))];
    // Keep-one-open: "hide all" leaves the first open section rather than doing nothing
    if (!collapsible && next.length === 0 && value.length > 0) next = [value[0]];
    handleValueChange(next, createDetails(event.nativeEvent));
  };

  // A separate list element is needed for <ol> semantics, or so the toggle
  // sits outside the bordered box
  const needsList = ordered || showToggle;
  const listClasses = cn(
    listVariantClasses[variant],
    ordered && "m-0 list-none p-0 [counter-reset:sp-accordion-item]",
  );
  const List = ordered ? "ol" : "div";

  const vars: Record<string, string> = {};
  if (transitionDuration !== undefined)
    vars["--sp-collapsible-duration"] = `${transitionDuration}ms`;
  if (transitionEasing !== undefined) vars["--sp-collapsible-easing"] = transitionEasing;

  return (
    <RootContext.Provider value={ctx}>
      <BaseAccordion.Root
        ref={setRefs}
        data-slot="accordion"
        data-variant={variant}
        data-size={size}
        value={value}
        onValueChange={handleValueChange}
        multiple={multiple}
        disabled={disabled}
        hiddenUntilFound={hiddenUntilFound}
        onKeyDown={handleKeyDown}
        className={cn("w-full", needsList ? "flex flex-col gap-2" : listClasses, className)}
        style={
          typeof style === "function"
            ? (state) => ({ ...vars, ...style(state) })
            : ({ ...vars, ...style } as React.CSSProperties)
        }
        {...rest}
      >
        {showToggle && (
          <div data-slot="accordion-toolbar" className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              data-slot="accordion-expand-all"
              aria-expanded={allOpen}
              disabled={disabled}
              onClick={toggleAll}
            >
              {allOpen ? toggleLabels.collapseLabel : toggleLabels.expandLabel}
            </Button>
          </div>
        )}
        {needsList ? (
          <List data-slot="accordion-list" className={listClasses}>
            {children}
          </List>
        ) : (
          children
        )}
      </BaseAccordion.Root>
    </RootContext.Provider>
  );
});
Root.displayName = "Accordion.Root";

/* ============================================================
 * Item
 * ============================================================ */

export interface AccordionItemProps extends BaseAccordion.Item.Props {
  /** Called once this item's expand/collapse animation has finished. */
  onOpenChangeComplete?: (open: boolean) => void;
}

const itemVariantClasses: Record<AccordionVariant, string> = {
  // Dividers are top borders so both lines around a hovered header can be hidden
  // without nesting :has(): the line above is the item's own top border, the line
  // below is the next item's (only while closed; when open the panel sits between).
  // Transparent, not removed, so nothing shifts.
  default: cn(
    "border-border-default border-t first:border-t-0",
    "[&:has(>*>[data-slot=accordion-trigger]:not([data-disabled]):not([aria-disabled=true]):hover,>*>*>[data-slot=accordion-trigger]:not([data-disabled]):not([aria-disabled=true]):hover)]:border-t-transparent",
    "[[data-slot=accordion-item]:not([data-open]):has(>*>[data-slot=accordion-trigger]:not([data-disabled]):not([aria-disabled=true]):hover,>*>*>[data-slot=accordion-trigger]:not([data-disabled]):not([aria-disabled=true]):hover)+&]:border-t-transparent",
    "transition-[border-color] duration-[var(--sp-duration-fast)] motion-reduce:transition-none",
  ),
  ghost: "",
  bordered:
    "border-border-default border-b last:border-b-0 first:[--sp-accordion-radius-top:var(--sp-nested-radius)] last:[--sp-accordion-radius-bottom:var(--sp-nested-radius)]",
  separated:
    "border-border-default bg-surface-base rounded-[var(--radius-DEFAULT)] border [--sp-accordion-radius-bottom:var(--sp-nested-radius)] [--sp-accordion-radius-top:var(--sp-nested-radius)]",
  filled:
    "data-[open]:bg-surface-sunken rounded-[var(--radius-DEFAULT)] [--sp-accordion-radius-bottom:var(--radius-DEFAULT)] [--sp-accordion-radius-top:var(--radius-DEFAULT)]",
};

const Item = React.forwardRef<HTMLDivElement, AccordionItemProps>((props, ref) => {
  const {
    className,
    value: valueProp,
    disabled = false,
    onOpenChangeComplete,
    render,
    ...rest
  } = props;
  const root = useRootContext("Item");
  const key = React.useId();
  // Base UI would generate a value too; ours is needed for expand all
  const value: Value = valueProp ?? key;
  const open = root.value.includes(value);

  const { register, unregister } = root;
  useIsoLayoutEffect(() => {
    register(key, { value, disabled });
  }, [key, value, disabled, register]);
  useIsoLayoutEffect(() => () => unregister(key), [key, unregister]);

  return (
    <ItemContext.Provider value={{ value, open, disabled, onOpenChangeComplete }}>
      <BaseAccordion.Item
        ref={ref}
        data-slot="accordion-item"
        value={value}
        disabled={disabled}
        render={render ?? (root.ordered ? <li /> : undefined)}
        className={cn(
          // Reset so nested accordions don't inherit the outer item's corners
          "[--sp-accordion-radius-bottom:0px] [--sp-accordion-radius-top:0px]",
          root.ordered && "[counter-increment:sp-accordion-item]",
          root.variant === "filled" &&
            "transition-colors duration-[var(--sp-duration-normal)] motion-reduce:transition-none",
          itemVariantClasses[root.variant],
          className,
        )}
        {...rest}
      />
    </ItemContext.Provider>
  );
});
Item.displayName = "Accordion.Item";

/* ============================================================
 * Header — the heading, plus optional actions beside it
 * ============================================================ */

export interface AccordionHeaderProps extends BaseAccordion.Header.Props {
  /** Heading level for this item. Defaults to the Root's `headingLevel` (3). */
  level?: HeadingLevel;
  /**
   * Extra controls on the header row (e.g. an edit button). They sit beside
   * the heading, not inside it, so the heading holds only the trigger (APG).
   */
  actions?: React.ReactNode;
}

const actionCellSize: Record<AccordionSize, string> = {
  sm: "[&>*]:min-h-[var(--sp-control-height-sm)] [&>*]:w-[var(--sp-control-height-sm)]",
  md: "[&>*]:min-h-[var(--sp-control-height)] [&>*]:w-[var(--sp-control-height)]",
  lg: "[&>*]:min-h-[var(--sp-control-height-lg)] [&>*]:w-[var(--sp-control-height-lg)]",
};

const Header = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>((props, ref) => {
  const { className, level, actions, render, ...rest } = props;
  const root = useRootContext("Header");
  const Heading = `h${level ?? root.headingLevel}` as const;

  const heading = (
    <BaseAccordion.Header
      ref={ref}
      data-slot="accordion-header"
      render={render ?? <Heading />}
      className={cn("m-0 flex min-w-0 flex-1 font-[inherit] text-[length:inherit]", className)}
      {...rest}
    />
  );
  if (!actions) return heading;
  // Boxed variants: actions fill square end cells flush with the container edge
  // (same treatment as Collapsible's bordered Header)
  const boxed =
    root.variant === "bordered" || root.variant === "separated" || root.variant === "filled";
  return (
    <div
      data-slot="accordion-header-row"
      className={cn("flex", boxed ? "items-stretch" : "items-center gap-1")}
    >
      {heading}
      <div
        data-slot="accordion-actions"
        className={cn(
          "flex shrink-0",
          boxed
            ? cn(
                "items-stretch [&>*]:h-auto [&>*]:rounded-none",
                actionCellSize[root.size],
                "[&>:last-child]:rounded-se-[var(--sp-accordion-radius-top,0px)]",
                "[[data-slot=accordion-item]:not([data-open])_&>:last-child]:rounded-ee-[var(--sp-accordion-radius-bottom,0px)]",
              )
            : "items-center gap-1",
        )}
      >
        {actions}
      </div>
    </div>
  );
});
Header.displayName = "Accordion.Header";

/* ============================================================
 * Trigger
 * ============================================================ */

export interface AccordionTriggerProps extends BaseAccordion.Trigger.Props {
  /**
   * Indicator icon. Defaults to a chevron that rotates when open.
   * Pass a function to swap icons by state (e.g. plus/minus) — no rotation is applied.
   * Pass `null` to hide it.
   */
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  /** Overrides the Root's `iconPosition` for this item. */
  iconPosition?: "start" | "end";
  /** Icon or avatar before the title. Decorative (hidden from assistive tech). */
  leadingIcon?: React.ReactNode;
  /** Short secondary line under the title (GOV.UK summary). Part of the button's name. */
  summary?: React.ReactNode;
}

const radiusClasses =
  "rounded-t-[var(--sp-accordion-radius-top,0px)] rounded-b-[var(--sp-accordion-radius-bottom,0px)] data-[panel-open]:rounded-b-none";

const triggerVariantClasses: Record<AccordionVariant, string> = {
  default: "rounded-[var(--radius-DEFAULT)] hover:bg-state-hover active:bg-state-pressed",
  bordered: cn(radiusClasses, "hover:bg-state-hover active:bg-state-pressed"),
  separated: cn(radiusClasses, "hover:bg-state-hover active:bg-state-pressed"),
  filled: cn(radiusClasses, "hover:bg-state-hover active:bg-state-pressed"),
  // Flush: underline the title on hover so it still reads as a control
  ghost: "!px-0 rounded-sm hover:[&_[data-slot=accordion-title]]:underline",
};

const Trigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>((props, ref) => {
  const {
    className,
    children,
    icon,
    iconPosition: iconPositionProp,
    leadingIcon,
    summary,
    ...rest
  } = props;
  const root = useRootContext("Trigger");
  const item = useItemContext("Trigger");
  const iconPosition = iconPositionProp ?? root.iconPosition;
  // "Keep one open": the only open item can't be closed
  const locked = !root.collapsible && item.open && root.value.length === 1;

  let indicator: React.ReactNode;
  if (icon === null) indicator = null;
  else if (typeof icon === "function") {
    indicator = (
      <span
        aria-hidden="true"
        data-slot="accordion-icon"
        className="text-fg-muted inline-flex shrink-0"
      >
        {icon(item.open)}
      </span>
    );
  } else {
    indicator = (
      <span
        aria-hidden="true"
        data-slot="accordion-icon"
        className={cn(
          "text-fg-muted inline-flex shrink-0",
          collapsibleStyles.iconRotation[iconPosition],
        )}
      >
        {icon ?? <CollapsibleChevron />}
      </span>
    );
  }

  return (
    <BaseAccordion.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      aria-disabled={locked || undefined}
      className={cn(
        "text-fg-default flex w-full cursor-pointer items-center text-start font-medium",
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] motion-reduce:transition-none",
        "focus-visible:sp-focus-ring outline-none",
        // box-shadow rings are dropped in forced colours: fall back to an outline
        "forced-colors:focus-visible:outline-solid forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight]",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)] data-[disabled]:hover:bg-transparent",
        "aria-disabled:cursor-default aria-disabled:hover:bg-transparent aria-disabled:active:bg-transparent",
        collapsibleStyles.triggerSize[root.size],
        summary !== undefined && "py-2",
        // Actions take the row's end corners
        "[[data-slot=accordion-header-row]_&]:rounded-e-none",
        triggerVariantClasses[root.variant],
        className,
      )}
      {...rest}
    >
      {iconPosition === "start" && indicator}
      {root.ordered && (
        <span
          aria-hidden="true"
          data-slot="accordion-number"
          className="text-fg-muted shrink-0 tabular-nums before:content-[counter(sp-accordion-item)'.']"
        />
      )}
      {leadingIcon && (
        <span
          aria-hidden="true"
          data-slot="accordion-leading-icon"
          className="text-fg-muted inline-flex shrink-0"
        >
          {leadingIcon}
        </span>
      )}
      <span data-slot="accordion-label" className="flex min-w-0 flex-1 flex-col">
        <span data-slot="accordion-title">{children}</span>
        {/* Whitespace keeps the parts apart in the accessible name; flex doesn't render it */}
        {summary !== undefined && " "}
        {summary !== undefined && (
          <span data-slot="accordion-summary" className="text-fg-muted text-sm font-normal">
            {summary}
          </span>
        )}
      </span>
      {root.stateText && " "}
      {root.stateText && (
        <span data-slot="accordion-state-text" className="text-fg-muted shrink-0 text-sm">
          {item.open ? root.stateText.open : root.stateText.closed}
        </span>
      )}
      {iconPosition === "end" && indicator}
    </BaseAccordion.Trigger>
  );
});
Trigger.displayName = "Accordion.Trigger";

/* ============================================================
 * Panel
 * ============================================================ */

export interface AccordionPanelProps extends BaseAccordion.Panel.Props {
  /** Props for the inner content element (padding lives here so height animates cleanly). */
  contentProps?: React.ComponentPropsWithRef<"div">;
}

const Panel = React.forwardRef<HTMLDivElement, AccordionPanelProps>((props, ref) => {
  const { className, children, contentProps, ...rest } = props;
  const root = useRootContext("Panel");
  const item = useItemContext("Panel");
  const elRef = React.useRef<HTMLDivElement | null>(null);
  useCollapsibleOpenChangeComplete(elRef, item.open, item.onOpenChangeComplete);

  const setRefs = (node: HTMLDivElement | null) => {
    elRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const { className: contentClassName, ...contentRest } = contentProps ?? {};
  const padding = collapsibleStyles.contentPadding[root.variant === "ghost" ? "ghost" : "default"];

  return (
    <BaseAccordion.Panel
      ref={setRefs}
      data-slot="accordion-panel"
      // Base UI always sets role="region"; only keep it when asked (APG)
      role={root.regions ? "region" : undefined}
      // ...and its aria-labelledby, which is prohibited on a role-less div
      {...(root.regions ? {} : { "aria-labelledby": undefined })}
      className={cn(
        "overflow-hidden",
        "h-[var(--accordion-panel-height)] transition-[height,opacity] data-[ending-style]:h-0 data-[starting-style]:h-0",
        collapsibleStyles.motion,
        root.animateOpacity && "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...rest}
    >
      <div
        data-slot="accordion-content"
        className={cn("text-fg-default text-sm", padding[root.size], contentClassName)}
        {...contentRest}
      >
        {children}
      </div>
    </BaseAccordion.Panel>
  );
});
Panel.displayName = "Accordion.Panel";

/* ============================================================
 * Skeleton — loading placeholder (Carbon AccordionSkeleton)
 * ============================================================ */

export interface AccordionSkeletonProps extends React.ComponentPropsWithRef<"div"> {
  /** Number of placeholder rows. @default 3 */
  count?: number;
  size?: AccordionSize;
  variant?: AccordionVariant;
  /** Announced to assistive tech. @default "Loading" */
  label?: string;
}

const skeletonHeight: Record<AccordionSize, string> = {
  sm: "h-[var(--sp-control-height-sm)]",
  md: "h-[var(--sp-control-height)]",
  lg: "h-[var(--sp-control-height-lg)]",
};

const Skeleton = React.forwardRef<HTMLDivElement, AccordionSkeletonProps>((props, ref) => {
  const {
    className,
    count = 3,
    size = "md",
    variant = "default",
    label = "Loading",
    ...rest
  } = props;
  const widths = ["w-2/5", "w-3/5", "w-1/2", "w-2/3"];
  return (
    <div
      ref={ref}
      role="status"
      data-slot="accordion-skeleton"
      className={cn("w-full", listVariantClasses[variant], className)}
      {...rest}
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          data-slot="accordion-skeleton-item"
          className={cn(
            "flex items-center justify-between",
            collapsibleStyles.triggerSize[size],
            skeletonHeight[size],
            itemVariantClasses[variant],
          )}
        >
          <span
            className={cn(
              "bg-fg-default/10 h-3 animate-pulse rounded-sm motion-reduce:animate-none",
              "forced-colors:bg-[CanvasText]",
              widths[i % widths.length],
            )}
          />
          <span className="bg-fg-default/10 size-4 animate-pulse rounded-sm motion-reduce:animate-none forced-colors:bg-[CanvasText]" />
        </div>
      ))}
    </div>
  );
});
Skeleton.displayName = "Accordion.Skeleton";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Accordion = { Root, Item, Header, Trigger, Panel, Skeleton };
