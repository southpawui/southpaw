import * as React from "react";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import { ArrowSquareOutIcon, DotsThreeIcon } from "@phosphor-icons/react";
import { Button, type ButtonProps } from "../Button/Button";
import { ButtonGroupContext, type ButtonGroupContextValue } from "../ButtonGroup/context";
import { parseKeys, resolveKey, usePlatform, type KbdPlatform } from "../Kbd/Kbd";
import { Menu } from "../Menu/Menu";
import { Toggle, type ToggleProps } from "../Toggle/Toggle";
import { ToggleGroup } from "../ToggleGroup/ToggleGroup";
import { Tooltip } from "../Tooltip/Tooltip";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import { cn } from "../../lib/cn";
import { connectedClasses } from "../../lib/connected";
import { defaultLinkLabels, focusRingClasses, getLinkBehaviour } from "../../lib/link";
import { mergeClassName } from "../../lib/merge-class-name";
import { useOverflow } from "../../lib/use-overflow";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// library doesn't need Node types.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * Toolbar (GEO-928)
 *
 * A `role="toolbar"` row of controls with one Tab stop and arrow-key
 * movement (Base UI), plus what Base UI leaves out:
 *
 * - Home/End jump to the first and last item (APG; Base UI 1.9 has none);
 * - our Button and Toggle as items, sized by the toolbar (ButtonGroupContext);
 * - automatic tooltips on icon-only items, with an optional shortcut (GEO-959);
 * - labels that hide below a breakpoint, moving into tooltips (Spectrum);
 * - a measured "More" menu for items that don't fit (Primer, Spectrum),
 *   where Toggles become checkbox items and a single-select ToggleGroup a
 *   radio group;
 * - sizes, bordered / flush, gap, sticky, and attached groups.
 *
 * Disabled items stay focusable (Base UI default, APG): they're
 * `aria-disabled`, show no hover, and their tooltip still opens.
 * ============================================================ */

type Orientation = "horizontal" | "vertical";
type Size = "sm" | "md" | "lg";
type Breakpoint = "sm" | "md";

export interface ToolbarLabels {
  /** The overflow menu trigger's name. */
  more: string;
}

export const defaultToolbarLabels: ToolbarLabels = { more: "More" };

interface ToolbarContextValue {
  size: Size;
  orientation: Orientation;
  disabled: boolean;
  hideLabelsBelow: Breakpoint | false;
  /** True while the viewport is below `hideLabelsBelow`. */
  labelsHidden: boolean;
}

const ToolbarContext = React.createContext<ToolbarContextValue | null>(null);
/** True inside the invisible measuring copy: items skip their tooltip there. */
const MeasuringContext = React.createContext(false);
/** A disabled Toolbar.Group disables its items (Base UI cascades the state; we drop hover). */
const GroupDisabledContext = React.createContext(false);

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Literal queries, matching Tailwind's `sm` (40rem) and `md` (48rem). */
const BELOW: Record<Breakpoint, string> = {
  sm: "(max-width: 39.99rem)",
  md: "(max-width: 47.99rem)",
};

function useMediaQuery(query: string | null): boolean {
  const [matches, setMatches] = React.useState(false);
  useIsoLayoutEffect(() => {
    if (!query || typeof window === "undefined" || !window.matchMedia) {
      setMatches(false);
      return;
    }
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, [query]);
  return matches;
}

/** Plain text of a node made only of strings and numbers, else undefined. */
function textOf(node: React.ReactNode): string | undefined {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(textOf);
    return parts.every((p) => p !== undefined) ? parts.join("") : undefined;
  }
  return undefined;
}

/** Children as a flat list of elements, looking through fragments. */
function flatten(nodes: React.ReactNode): React.ReactElement[] {
  return React.Children.toArray(nodes).flatMap((node) =>
    React.isValidElement(node) && node.type === React.Fragment
      ? flatten((node.props as { children?: React.ReactNode }).children)
      : React.isValidElement(node)
        ? [node]
        : [],
  );
}

/* ----- Shared item styling ----- */

// Disabled items stay focusable (aria-disabled) and keep pointer events for their tooltip,
// so the disabled look is keyed off Base UI's data-disabled. Hover is removed by `inactive`.
const disabledItem =
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]";

const SQUARE: Record<Size, string> = {
  sm: "w-[var(--sp-control-height-sm)]",
  md: "w-[var(--sp-control-height)]",
  lg: "w-[var(--sp-control-height-lg)]",
};
const HEIGHT: Record<Size, string> = {
  sm: "h-[var(--sp-control-height-sm)]",
  md: "h-[var(--sp-control-height)]",
  lg: "h-[var(--sp-control-height-lg)]",
};
// Below the breakpoint a labelled item becomes a square, like an icon-only one.
const HIDDEN_LABEL_ITEM: Record<Breakpoint, Record<Size, string>> = {
  sm: {
    sm: "max-sm:gap-0 max-sm:px-0 max-sm:w-[var(--sp-control-height-sm)]",
    md: "max-sm:gap-0 max-sm:px-0 max-sm:w-[var(--sp-control-height)]",
    lg: "max-sm:gap-0 max-sm:px-0 max-sm:w-[var(--sp-control-height-lg)]",
  },
  md: {
    sm: "max-md:gap-0 max-md:px-0 max-md:w-[var(--sp-control-height-sm)]",
    md: "max-md:gap-0 max-md:px-0 max-md:w-[var(--sp-control-height)]",
    lg: "max-md:gap-0 max-md:px-0 max-md:w-[var(--sp-control-height-lg)]",
  },
};
const HIDDEN_LABEL_TEXT: Record<Breakpoint, string> = {
  sm: "max-sm:sr-only",
  md: "max-md:sr-only",
};

/* ----- Shortcuts ----- */

const ARIA_MODIFIERS: Record<string, string> = {
  ctrl: "Control",
  control: "Control",
  cmd: "Meta",
  command: "Meta",
  meta: "Meta",
  alt: "Alt",
  option: "Alt",
  opt: "Alt",
  shift: "Shift",
};

/**
 * `shortcut` uses Kbd's syntax (`"Mod+B"`); `aria-keyshortcuts` needs real key names
 * (`"Meta+B"` / `"Control+B"`). A sequence ("g i") can't be expressed there, so it's left out.
 */
export function toAriaKeyShortcut(keys: string, platform: KbdPlatform): string | undefined {
  const steps = parseKeys(keys);
  if (steps.length !== 1) return undefined;
  return steps[0]!
    .map((token) => {
      const lower = token.toLowerCase();
      if (lower === "mod") return platform === "apple" ? "Meta" : "Control";
      return ARIA_MODIFIERS[lower] ?? (token.length === 1 ? token.toUpperCase() : token);
    })
    .join("+");
}

/** What the tooltip shows: "⌘B" on Apple devices, "Ctrl+B" elsewhere. */
function shortcutLabel(keys: string, platform: KbdPlatform): string {
  return parseKeys(keys)
    .map((chord) =>
      chord
        .map((token) => resolveKey(token, platform, "condensed").label)
        .join(platform === "apple" ? "" : "+"),
    )
    .join(" ");
}

/* ----- Disabled items ----- */

/*
 * Base UI's Toolbar.Button forwards a React `disabled` prop to a custom `render`
 * element. Our Button and Toggle would then take their native-disabled path, which
 * keeps hover. Map it to their `inactive` state instead: focusable, aria-disabled,
 * no hover, and activation swallowed (GEO-932), which is what a toolbar item needs.
 */
const ItemButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, inactive, ...props }, ref) => (
    <Button ref={ref} {...props} inactive={Boolean(disabled) || inactive} />
  ),
);
ItemButton.displayName = "Toolbar.ItemButton";

const ItemToggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ disabled, inactive, ...props }, ref) => (
    <Toggle ref={ref} {...props} inactive={Boolean(disabled) || inactive} />
  ),
);
ItemToggle.displayName = "Toolbar.ItemToggle";

/* ----- Tooltip wrapper for items ----- */

interface ItemTooltipProps {
  show: boolean;
  content: React.ReactNode;
  shortcut?: string;
  side: "top" | "right";
  children: React.ReactElement;
}

/**
 * Icon-only items (and labelled items whose label is hidden) are named by their
 * tooltip (`type="label"`), so the name and the tooltip never disagree (GEO-959).
 */
function ItemTooltip({ show, content, shortcut, side, children }: ItemTooltipProps) {
  const platform = usePlatform();
  // The measuring copy needs widths, not tooltips (their popups would be portalled twice)
  const measuring = React.useContext(MeasuringContext);
  if (!show || measuring) return children;
  return (
    <Tooltip.Root type="label">
      <Tooltip.Trigger render={children} />
      <Tooltip.Content side={side}>
        {content}
        {shortcut ? (
          <Tooltip.Shortcut keys={toAriaKeyShortcut(shortcut, platform)}>
            {shortcutLabel(shortcut, platform)}
          </Tooltip.Shortcut>
        ) : null}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

/* ============================================================
 * Root
 * ============================================================ */

export interface ToolbarRootProps extends Omit<
  React.ComponentProps<typeof BaseToolbar.Root>,
  "render"
> {
  /** Item size, passed to every item inside (Buttons, Toggles, ToggleGroups, links, inputs). Default `md`. */
  size?: Size;
  /** `bordered` (default): a raised bar with a border. `flush`: no frame, for headers and panels. */
  variant?: "bordered" | "flush";
  /** Space between items. `condensed` packs them for dense editors. Default `default`. */
  gap?: "default" | "condensed";
  /**
   * What happens when the items don't fit (horizontal toolbars only):
   * - `menu` (default): trailing items move into a "More" menu, measured (Primer, Spectrum).
   *   It reads the Root's direct children (fragments are fine): an item wrapped in your own
   *   component is one item the menu can't show, so it stays in the toolbar;
   * - `wrap`: items wrap onto more lines;
   * - `none`: nothing, the items overflow as your layout allows.
   */
  overflow?: "menu" | "wrap" | "none";
  /** Below this breakpoint, item labels are hidden and shown in tooltips instead (Spectrum). */
  hideLabelsBelow?: Breakpoint | false;
  /** Stick to the top of the scrolling container (Mantine RichTextEditor). */
  sticky?: boolean;
  /** Distance from the top when sticky, e.g. a header's height. A number is px. Default 0. */
  stickyOffset?: number | string;
  /** Translations. */
  labels?: Partial<ToolbarLabels>;
}

type ItemKind = "button" | "toggle" | "link" | "group" | "separator" | "toggleGroup" | "other";

function kindOf(el: React.ReactElement): ItemKind {
  if (el.type === ToolbarButton) return "button";
  if (el.type === ToolbarToggle) return "toggle";
  if (el.type === ToolbarLink) return "link";
  if (el.type === Group) return "group";
  if (el.type === Separator) return "separator";
  if (el.type === ToggleGroup.Root) return "toggleGroup";
  return "other";
}

/** Items the More menu can't show (inputs, custom content) stay put, as does `overflow={false}`. */
function isPinned(el: React.ReactElement): boolean {
  const kind = kindOf(el);
  if (kind === "other") return true;
  return (el.props as { overflow?: boolean }).overflow === false;
}

type Store = Record<string, unknown>;
type SetStore = React.Dispatch<React.SetStateAction<Store>>;

/**
 * Uncontrolled Toggles and ToggleGroups keep their state in the Root, so it survives an
 * item moving into the More menu and back (the menu shows the same state).
 */
function withState(
  el: React.ReactElement,
  key: string,
  store: Store,
  setStore: SetStore,
  size: Size,
): React.ReactElement {
  const kind = kindOf(el);
  if (kind === "toggle") {
    const p = el.props as ToolbarToggleProps;
    if (p.pressed !== undefined) return el;
    const pressed = (store[key] as boolean | undefined) ?? p.defaultPressed ?? false;
    return React.cloneElement(el as React.ReactElement<ToolbarToggleProps>, {
      pressed,
      defaultPressed: undefined,
      onPressedChange: (next, details) => {
        p.onPressedChange?.(next, details);
        if (!details.isCanceled) setStore((s) => ({ ...s, [key]: next }));
      },
    });
  }
  if (kind === "toggleGroup") {
    const p = el.props as React.ComponentProps<typeof ToggleGroup.Root>;
    // Toolbar defaults, which the group's own props override: the toolbar's size (its own
    // ButtonGroupContext would otherwise reset items to md), ghost items, spaced with the
    // toolbar's gap, on one line (a wrapping group would stack in a narrow toolbar).
    const attached = p.attached ?? false;
    const toolbarLook = {
      size: p.size ?? size,
      variant: p.variant ?? ("ghost" as const),
      attached,
      className: cn(
        !attached && "flex-nowrap gap-[calc(var(--sp-control-gap)/2)]",
        "shrink-0",
        p.className,
      ),
    };
    const cloneable = el as React.ReactElement<React.ComponentProps<typeof ToggleGroup.Root>>;
    if (p.value !== undefined) return React.cloneElement(cloneable, toolbarLook);
    const value = (store[key] as string[] | undefined) ?? p.defaultValue ?? [];
    return React.cloneElement(cloneable, {
      ...toolbarLook,
      value,
      defaultValue: undefined,
      onValueChange: (next, details) => {
        p.onValueChange?.(next, details);
        if (!details.isCanceled) setStore((s) => ({ ...s, [key]: next }));
      },
    });
  }
  if (kind === "group") {
    const p = el.props as GroupProps;
    return React.cloneElement(el as React.ReactElement<GroupProps>, {
      children: flatten(p.children).map((child, i) =>
        withState(child, `${key}.${child.key ?? i}`, store, setStore, size),
      ),
    });
  }
  return el;
}

/**
 * In a wrapping toolbar, mark separators that start or end a line (`data-line-edge`), so
 * they can hide. Visibility only: the layout doesn't change, so this can't loop.
 */
export function markLineEdges(root: HTMLElement) {
  // Real items only: not the measuring copy, Base UI's focus guards and portal owners
  // (around an open menu's trigger), hidden inputs, or anything without a box.
  const kids = (Array.from(root.children) as HTMLElement[]).filter(
    (c) =>
      c.getAttribute("data-slot") !== "toolbar-measure" &&
      !c.matches("[data-base-ui-focus-guard], [aria-owns]:empty, [type=hidden]") &&
      c.getBoundingClientRect().height > 0,
  );
  kids.forEach((el, i) => {
    if (el.getAttribute("role") !== "separator") return;
    const box = el.getBoundingClientRect();
    if (box.height === 0) return; // no layout (tests, display:none)
    const prev = kids[i - 1]?.getBoundingClientRect();
    const next = kids[i + 1]?.getBoundingClientRect();
    const edge = !prev || !next || prev.bottom <= box.top + 0.5 || next.top >= box.bottom - 0.5;
    el.toggleAttribute("data-line-edge", edge);
  });
}

/** Drop separators at the ends and next to each other (after items moved away). */
function tidySeparators<T>(list: T[], isSeparator: (item: T) => boolean): T[] {
  const out: T[] = [];
  for (const item of list) {
    if (isSeparator(item) && (out.length === 0 || isSeparator(out[out.length - 1]!))) continue;
    out.push(item);
  }
  while (out.length && isSeparator(out[out.length - 1]!)) out.pop();
  return out;
}

const Root = React.forwardRef<HTMLDivElement, ToolbarRootProps>(
  (
    {
      size = "md",
      variant = "bordered",
      gap = "default",
      overflow: overflowProp = "menu",
      hideLabelsBelow = false,
      sticky = false,
      stickyOffset = 0,
      labels: labelsProp,
      orientation = "horizontal",
      disabled = false,
      className,
      style,
      children,
      onKeyDownCapture,
      ...props
    },
    forwardedRef,
  ) => {
    const parent = React.useContext(ToolbarContext);
    const labels = { ...defaultToolbarLabels, ...labelsProp };
    const labelsHidden = useMediaQuery(hideLabelsBelow ? BELOW[hideLabelsBelow] : null);
    const horizontal = orientation === "horizontal";
    const overflow = horizontal ? overflowProp : "none";

    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];
    React.useEffect(() => {
      if (!isDev || ariaLabel || ariaLabelledBy) return;
      console.warn(
        `[Southpaw] Toolbar${parent ? " (nested, rendered as a group)" : ""}: give it an aria-label or aria-labelledby, so screen readers say what the controls are for.`,
      );
    }, [ariaLabel, ariaLabelledBy, parent]);

    const ctx = React.useMemo<ToolbarContextValue>(
      () => ({
        size,
        orientation,
        disabled: disabled || Boolean(parent?.disabled),
        hideLabelsBelow,
        labelsHidden,
      }),
      [size, orientation, disabled, parent?.disabled, hideLabelsBelow, labelsHidden],
    );
    // Items are ghost by default; a Button's own props still win.
    const groupCtx = React.useMemo<ButtonGroupContextValue>(
      () => ({ size, variant: "ghost" }),
      [size],
    );

    /* ----- Items, with uncontrolled state lifted into the Root ----- */
    const [store, setStore] = React.useState<Store>({});
    const items = flatten(children).map((el, i) =>
      withState(el, String(el.key ?? i), store, setStore, size),
    );
    const pinned = items.map(isPinned);

    /* ----- Overflow ----- */
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const measureRef = React.useRef<HTMLDivElement | null>(null);
    const setRef = React.useCallback(
      (el: HTMLDivElement | null) => {
        rootRef.current = el;
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
      },
      [forwardedRef],
    );
    const menuEnabled = overflow === "menu" && !parent;
    const overflowedIdx = useOverflow({
      enabled: menuEnabled,
      containerRef: rootRef,
      measureRef,
      pinned,
      deps: [items.length, size, gap, labelsHidden],
    });
    const overflowed = new Set(menuEnabled ? overflowedIdx : []);

    // The menu maps measured DOM items back to children by position. A wrapper component
    // that renders several items breaks that mapping: say so instead of failing quietly.
    const warnedWrapped = React.useRef(false);
    React.useEffect(() => {
      if (!isDev || !menuEnabled || warnedWrapped.current || !measureRef.current) return;
      const measured = Array.from(measureRef.current.children).filter(
        (c) => !c.hasAttribute("data-overflow-more"),
      ).length;
      if (measured !== items.length) {
        warnedWrapped.current = true;
        console.warn(
          `[Southpaw] Toolbar: ${items.length} direct children render ${measured} items. The More menu reads direct children (fragments are fine), so pass items directly rather than inside your own component, or set overflow="wrap".`,
        );
      }
    });

    const moreTrigger = (
      <Menu.Trigger
        render={
          <ToolbarButton
            iconOnly
            icon={<DotsThreeIcon aria-hidden="true" weight="bold" />}
            label={labels.more}
            overflow={false}
            data-slot="toolbar-more"
          />
        }
      />
    );

    // The visible row: items that fit, with the More menu where the first overflowed item was.
    const firstOverflowed = Math.min(...overflowed);
    const row: Array<{ el: React.ReactElement; separator: boolean }> = [];
    items.forEach((el, i) => {
      if (i === firstOverflowed) {
        row.push({
          el: (
            <Menu.Root key="toolbar-more">
              {moreTrigger}
              <Menu.Portal>
                <Menu.Positioner align="end">
                  <Menu.Popup size={size === "lg" ? "lg" : size === "sm" ? "sm" : "md"}>
                    {(() => {
                      const menuItems = items.filter((_, j) => overflowed.has(j));
                      return renderMenuItems(menuItems, ctx.disabled, {
                        ...scanMenuLayout(menuItems),
                        size: size === "lg" ? "lg" : size === "sm" ? "sm" : "md",
                      });
                    })()}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          ),
          separator: false,
        });
      }
      if (overflowed.has(i)) return;
      row.push({ el, separator: kindOf(el) === "separator" });
    });
    const visible = tidySeparators(row, (r) => r.separator).map((r) => r.el);

    /* ----- Wrapping: hide separators that start or end a line ----- */
    useIsoLayoutEffect(() => {
      if (overflow !== "wrap" || parent) return;
      const root = rootRef.current;
      if (!root) return;
      const run = () => markLineEdges(root);
      run();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(run);
      observer.observe(root);
      return () => observer.disconnect();
    });

    /* ----- Home / End (APG; Base UI 1.9 only does the arrow keys) ----- */
    // Capture phase: a disabled (aria-disabled) item swallows its own keydown, and Home/End
    // must still work from there.
    const handleHomeEnd = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownCapture?.(event as Parameters<NonNullable<typeof onKeyDownCapture>>[0]);
      if (event.defaultPrevented || (event.key !== "Home" && event.key !== "End")) return;
      const target = event.target as HTMLElement;
      // A text field keeps Home/End for its caret
      if (target.closest("input, textarea, [contenteditable=true]")) return;
      const root = rootRef.current;
      if (!root) return;
      // This toolbar's items: everything Base UI gave a roving tabindex, except its focus
      // guards and the invisible measuring copy (its own toolbar).
      const items = (
        Array.from(
          root.querySelectorAll("[tabindex]:not([data-base-ui-focus-guard])"),
        ) as HTMLElement[]
      ).filter((el) => el.closest("[role=toolbar]") === root);
      const next = event.key === "Home" ? items[0] : items[items.length - 1];
      if (next) {
        event.preventDefault();
        next.focus();
      }
    };

    const offset = typeof stickyOffset === "number" ? `${stickyOffset}px` : stickyOffset;
    const gapClass = gap === "condensed" ? "gap-px" : "gap-[calc(var(--sp-control-gap)/2)]";

    const content = (
      <ToolbarContext.Provider value={ctx}>
        <ButtonGroupContext.Provider value={groupCtx}>{visible}</ButtonGroupContext.Provider>
      </ToolbarContext.Provider>
    );

    // Nested: a toolbar inside a toolbar is a labelled group in the same Tab stop (APG).
    if (parent) {
      return (
        <BaseToolbar.Group
          ref={setRef}
          data-slot="toolbar-group"
          data-nested=""
          disabled={disabled}
          className={mergeClassName(
            cn("flex items-center", gapClass, !horizontal && "flex-col"),
            className,
          )}
          {...(props as React.ComponentProps<typeof BaseToolbar.Group>)}
        >
          {content}
        </BaseToolbar.Group>
      );
    }

    return (
      <Tooltip.Provider>
        <BaseToolbar.Root
          ref={setRef}
          data-slot="toolbar"
          data-variant={variant}
          data-size={size}
          data-overflow={overflow}
          data-overflowed={overflowed.size || undefined}
          data-sticky={sticky ? "" : undefined}
          orientation={orientation}
          disabled={disabled}
          onKeyDownCapture={handleHomeEnd}
          style={sticky ? { ...style, ["--sp-toolbar-sticky-offset" as string]: offset } : style}
          className={mergeClassName(
            cn(
              "relative flex min-w-0 max-w-full",
              horizontal ? "w-full items-center" : "w-fit flex-col items-stretch",
              gapClass,
              overflow === "wrap" && "flex-wrap",
              overflow !== "wrap" && "flex-nowrap",
              variant === "bordered" &&
                "bg-surface-raised border-border-default rounded-[var(--radius-lg)] border p-1",
              sticky && "sticky top-[var(--sp-toolbar-sticky-offset)] z-10",
              sticky && variant === "flush" && "bg-surface-base",
            ),
            className,
          )}
          {...props}
        >
          {content}
          {menuEnabled ? (
            // Every item at its natural width, for measuring. Invisible, inert and outside
            // this toolbar's arrow-key order (its own BaseToolbar.Root).
            <BaseToolbar.Root
              ref={measureRef}
              aria-hidden="true"
              inert
              data-slot="toolbar-measure"
              className={cn(
                // Zero-size and clipped, so it never adds scroll. Children keep their natural width:
                // no shrinking, and no max-width (max-w-full of a 0-wide row would be 0).
                "pointer-events-none invisible absolute start-0 top-0 flex h-0 w-0 items-center overflow-hidden [&>*]:!max-w-none [&>*]:shrink-0",
                gapClass,
              )}
            >
              <MeasuringContext.Provider value={true}>
                <ToolbarContext.Provider value={ctx}>
                  <ButtonGroupContext.Provider value={groupCtx}>
                    {items}
                    <span data-overflow-more="" className="inline-flex">
                      <ToolbarButton
                        iconOnly
                        icon={<DotsThreeIcon aria-hidden="true" weight="bold" />}
                        label={labels.more}
                        tooltip={false}
                      />
                    </span>
                  </ButtonGroupContext.Provider>
                </ToolbarContext.Provider>
              </MeasuringContext.Provider>
            </BaseToolbar.Root>
          ) : null}
        </BaseToolbar.Root>
      </Tooltip.Provider>
    );
  },
);
Root.displayName = "Toolbar.Root";

/* ----- The More menu's contents ----- */

function itemLabel(props: {
  label?: React.ReactNode;
  children?: React.ReactNode;
  "aria-label"?: string;
  srOnly?: string;
}): React.ReactNode {
  return props.label ?? props.children ?? props.srOnly ?? props["aria-label"];
}

/**
 * The More menu lines up every row: [indicator column][icon column][label]. Checkbox and
 * radio items draw their indicator in a leading `size-4` column (Menu); plain items reserve
 * that column whenever any item has one, and every row reserves the icon column whenever
 * any item has an icon. Otherwise radio rows sit ~24px right of the rows below them.
 */
interface MenuLayout {
  indicator: boolean;
  icon: boolean;
  size: "sm" | "md" | "lg";
}

function scanMenuLayout(elements: React.ReactElement[]): Omit<MenuLayout, "size"> {
  let indicator = false;
  let icon = false;
  const visit = (el: React.ReactElement) => {
    const kind = kindOf(el);
    const p = el.props as {
      icon?: React.ReactNode;
      children?: React.ReactNode;
      items?: { icon?: React.ReactNode }[];
    };
    if (kind === "group") return flatten(p.children).forEach(visit);
    if (kind === "toggle" || kind === "toggleGroup") indicator = true;
    if (kind === "toggleGroup") {
      if (p.items?.some((o) => o.icon != null)) icon = true;
      flatten(p.children).forEach((c) => {
        if ((c.props as { icon?: React.ReactNode }).icon != null) icon = true;
      });
      return;
    }
    if (p.icon != null) icon = true;
  };
  elements.forEach(visit);
  return { indicator, icon };
}

const MENU_ICON_BOX = { sm: "size-4", md: "size-4", lg: "size-5" } as const;
const MENU_COLUMN_GAP = { sm: "gap-2", md: "gap-2", lg: "gap-3" } as const;

/** The leading columns for one row (see MenuLayout). */
function menuLeading(
  icon: React.ReactNode,
  layout: MenuLayout,
  reserveIndicator: boolean,
): React.ReactNode {
  const indicator = reserveIndicator && layout.indicator;
  const iconNode =
    icon ??
    (layout.icon ? (
      <span aria-hidden="true" className={cn(MENU_ICON_BOX[layout.size], "shrink-0")} />
    ) : null);
  if (!indicator) return iconNode ?? undefined;
  return (
    <span className={cn("flex items-center", MENU_COLUMN_GAP[layout.size])}>
      {/* The same box as Menu's checkbox/radio indicator */}
      <span
        aria-hidden="true"
        data-slot="toolbar-menu-indicator-space"
        className="size-4 shrink-0"
      />
      {iconNode}
    </span>
  );
}

function renderMenuItems(
  elements: React.ReactElement[],
  disabled: boolean,
  layout: MenuLayout,
): React.ReactNode {
  type Entry = { node: React.ReactNode; separator: boolean };
  const entries: Entry[] = [];
  elements.forEach((el, i) => {
    const key = String(el.key ?? i);
    const kind = kindOf(el);
    if (kind === "separator") {
      entries.push({ node: <Menu.Separator key={key} />, separator: true });
      return;
    }
    if (kind === "group") {
      const p = el.props as GroupProps;
      entries.push({ node: <Menu.Separator key={`${key}-before`} />, separator: true });
      entries.push({
        node: (
          <Menu.Group key={key} aria-label={p["aria-label"]}>
            {renderMenuItems(flatten(p.children), disabled || Boolean(p.disabled), layout)}
          </Menu.Group>
        ),
        separator: false,
      });
      entries.push({ node: <Menu.Separator key={`${key}-after`} />, separator: true });
      return;
    }
    entries.push({ node: menuItemFor(el, key, disabled, layout), separator: false });
  });
  return tidySeparators(entries, (e) => e.separator).map((e) => e.node);
}

function menuItemFor(
  el: React.ReactElement,
  key: string,
  groupDisabled: boolean,
  layout: MenuLayout,
): React.ReactNode {
  const kind = kindOf(el);
  if (kind === "button") {
    const p = el.props as ToolbarButtonProps;
    return (
      <Menu.Item
        key={key}
        icon={menuLeading(p.icon, layout, true)}
        shortcut={p.shortcut}
        disabled={groupDisabled || Boolean(p.disabled)}
        variant={p.color === "danger" ? "danger" : undefined}
        onClick={p.onClick as unknown as React.ComponentProps<typeof Menu.Item>["onClick"]}
      >
        {itemLabel(p)}
      </Menu.Item>
    );
  }
  if (kind === "toggle") {
    const p = el.props as ToolbarToggleProps;
    return (
      <Menu.CheckboxItem
        key={key}
        icon={menuLeading(p.icon, layout, false)}
        shortcut={p.shortcut}
        disabled={groupDisabled || Boolean(p.disabled)}
        checked={Boolean(p.pressed)}
        onCheckedChange={(checked, details) =>
          p.onPressedChange?.(
            checked,
            details as unknown as Parameters<NonNullable<ToggleProps["onPressedChange"]>>[1],
          )
        }
      >
        {itemLabel(p)}
      </Menu.CheckboxItem>
    );
  }
  if (kind === "link") {
    const p = el.props as ToolbarLinkProps;
    return (
      <Menu.LinkItem
        key={key}
        href={p.href}
        target={p.target}
        icon={menuLeading(p.icon, layout, true)}
      >
        {p.children}
      </Menu.LinkItem>
    );
  }
  if (kind === "toggleGroup") {
    const p = el.props as React.ComponentProps<typeof ToggleGroup.Root> & { multiple?: boolean };
    const value = p.value ?? [];
    const options = [
      ...(p.items ?? []),
      ...flatten(p.children)
        .filter((c) => c.type === Toggle || c.type === ToolbarToggle)
        .map((c) => c.props as ToggleProps & { value?: string; label?: string }),
    ].map((o) => ({
      value: String(o.value ?? ""),
      label: itemLabel(o as Parameters<typeof itemLabel>[0]),
      icon: o.icon,
      disabled: Boolean(o.disabled),
    }));
    const isDisabled = groupDisabled || Boolean(p.disabled);
    if (p.multiple) {
      return (
        <Menu.Group key={key} aria-label={p["aria-label"]}>
          {options.map((o) => (
            <Menu.CheckboxItem
              key={o.value}
              icon={menuLeading(o.icon, layout, false)}
              disabled={isDisabled || o.disabled}
              checked={value.includes(o.value)}
              onCheckedChange={(checked, details) =>
                p.onValueChange?.(
                  checked ? [...value, o.value] : value.filter((v) => v !== o.value),
                  details as unknown as Parameters<NonNullable<typeof p.onValueChange>>[1],
                )
              }
            >
              {o.label}
            </Menu.CheckboxItem>
          ))}
        </Menu.Group>
      );
    }
    return (
      <Menu.RadioGroup
        key={key}
        aria-label={p["aria-label"]}
        value={value[0] ?? null}
        onValueChange={(next: unknown, details: unknown) =>
          p.onValueChange?.(
            [String(next)],
            details as Parameters<NonNullable<typeof p.onValueChange>>[1],
          )
        }
      >
        {options.map((o) => (
          <Menu.RadioItem
            key={o.value}
            value={o.value}
            icon={menuLeading(o.icon, layout, false)}
            disabled={isDisabled || o.disabled}
          >
            {o.label}
          </Menu.RadioItem>
        ))}
      </Menu.RadioGroup>
    );
  }
  return null;
}

/* ============================================================
 * Button
 * ============================================================ */

export interface ToolbarButtonProps extends Omit<ButtonProps, "size"> {
  /** Show only the icon. The label becomes the tooltip and the accessible name. */
  iconOnly?: boolean;
  /** A keyboard shortcut shown in the tooltip and set as `aria-keyshortcuts` (`"Mod+B"`). */
  shortcut?: string;
  /** Tooltip content. Defaults to the label; `false` turns the tooltip off. */
  tooltip?: React.ReactNode | false;
  /** `false` keeps this item in the toolbar when the rest overflow into the More menu. */
  overflow?: boolean;
}

function useItemState(disabledProp: boolean | undefined) {
  const toolbar = React.useContext(ToolbarContext);
  const groupDisabled = React.useContext(GroupDisabledContext);
  const size = toolbar?.size ?? "md";
  const disabled = Boolean(disabledProp) || Boolean(toolbar?.disabled) || groupDisabled;
  return { toolbar, size, disabled };
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      iconOnly = false,
      shortcut,
      tooltip,
      overflow,
      label,
      icon,
      disabled: disabledProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Read by the Root (pinning), not passed to the DOM
    void overflow;
    const { toolbar, size, disabled } = useItemState(disabledProp);
    const platform = usePlatform();
    const text = label ?? children;
    const name = label ?? textOf(children) ?? props["aria-label"];
    const isIconOnly = Boolean(icon) && (iconOnly || text == null);
    const hideAt =
      !isIconOnly && icon && toolbar?.hideLabelsBelow ? toolbar.hideLabelsBelow : false;
    const showTooltip =
      tooltip !== false && (isIconOnly || (Boolean(hideAt) && Boolean(toolbar?.labelsHidden)));

    const button = (
      <BaseToolbar.Button
        ref={ref}
        disabled={disabledProp}
        {...(isIconOnly && !showTooltip ? { "aria-label": name } : {})}
        // Only when set: an explicit undefined would beat the value Tooltip.Trigger merges in
        {...(!showTooltip && shortcut
          ? { "aria-keyshortcuts": toAriaKeyShortcut(shortcut, platform) }
          : {})}
        render={
          <ItemButton
            size={isIconOnly ? "icon" : undefined}
            icon={icon}
            // Focusable, aria-disabled and no hover: the same as Button `inactive` (GEO-932).
            inactive={disabled}
            data-slot="toolbar-button"
            className={mergeClassName(
              cn(
                "shrink-0",
                disabledItem,
                hideAt && HIDDEN_LABEL_ITEM[hideAt][size],
                HEIGHT[size],
                isIconOnly && SQUARE[size],
              ),
              className,
            )}
          />
        }
        {...props}
      >
        {isIconOnly ? undefined : hideAt ? (
          <span data-slot="toolbar-label" className={HIDDEN_LABEL_TEXT[hideAt]}>
            {text}
          </span>
        ) : (
          text
        )}
      </BaseToolbar.Button>
    );

    return (
      <ItemTooltip
        show={showTooltip}
        content={tooltip ?? name}
        shortcut={shortcut}
        side={toolbar?.orientation === "vertical" ? "right" : "top"}
      >
        {button}
      </ItemTooltip>
    );
  },
);
ToolbarButton.displayName = "Toolbar.Button";

/* ============================================================
 * Toggle
 * ============================================================ */

export interface ToolbarToggleProps extends Omit<ToggleProps, "size"> {
  /** Show only the icon. The label becomes the tooltip and the accessible name. */
  iconOnly?: boolean;
  /** A keyboard shortcut shown in the tooltip and set as `aria-keyshortcuts`. */
  shortcut?: string;
  /** Tooltip content. Defaults to the label; `false` turns the tooltip off. */
  tooltip?: React.ReactNode | false;
  /** `false` keeps this item in the toolbar when the rest overflow into the More menu. */
  overflow?: boolean;
}

const ToolbarToggle = React.forwardRef<HTMLButtonElement, ToolbarToggleProps>(
  (
    {
      iconOnly = false,
      shortcut,
      tooltip,
      overflow,
      label,
      icon,
      srOnly,
      disabled: disabledProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Read by the Root (pinning), not passed to the DOM
    void overflow;
    const { toolbar, size, disabled } = useItemState(disabledProp);
    const platform = usePlatform();
    const text = label ?? children;
    const name = label ?? textOf(children) ?? srOnly ?? props["aria-label"];
    const isIconOnly = Boolean(icon) && (iconOnly || text == null);
    const hideAt =
      !isIconOnly && icon && toolbar?.hideLabelsBelow ? toolbar.hideLabelsBelow : false;
    const showTooltip =
      tooltip !== false && (isIconOnly || (Boolean(hideAt) && Boolean(toolbar?.labelsHidden)));

    const toggle = (
      <BaseToolbar.Button
        ref={ref}
        disabled={disabledProp}
        // Only when set: an explicit undefined would beat the value Tooltip.Trigger merges in
        {...(!showTooltip && shortcut
          ? { "aria-keyshortcuts": toAriaKeyShortcut(shortcut, platform) }
          : {})}
        render={
          <ItemToggle
            size={isIconOnly ? "icon" : undefined}
            icon={icon}
            srOnly={isIconOnly && !showTooltip ? name : undefined}
            label={isIconOnly ? undefined : (label as string | undefined)}
            inactive={disabled}
            data-slot="toolbar-toggle"
            className={mergeClassName(
              cn(
                "shrink-0",
                disabledItem,
                hideAt && HIDDEN_LABEL_ITEM[hideAt][size],
                HEIGHT[size],
                isIconOnly && SQUARE[size],
                // Labels hidden below the breakpoint: Toggle wraps its label in toggle-label
                hideAt === "sm" && "max-sm:[&_[data-slot=toggle-label]]:sr-only",
                hideAt === "md" && "max-md:[&_[data-slot=toggle-label]]:sr-only",
              ),
              className,
            )}
          />
        }
        {...(props as React.ComponentProps<typeof BaseToolbar.Button>)}
      >
        {isIconOnly || label ? undefined : children}
      </BaseToolbar.Button>
    );

    return (
      <ItemTooltip
        show={showTooltip}
        content={tooltip ?? name}
        shortcut={shortcut}
        side={toolbar?.orientation === "vertical" ? "right" : "top"}
      >
        {toggle}
      </ItemTooltip>
    );
  },
);
ToolbarToggle.displayName = "Toolbar.Toggle";

/* ============================================================
 * Group
 * ============================================================ */

export interface GroupProps extends React.ComponentProps<typeof BaseToolbar.Group> {
  /** Join the items into one connected control (shared borders, outline items). */
  attached?: boolean;
  /** `false` keeps the whole group in the toolbar when others overflow. */
  overflow?: boolean;
}

const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, attached = false, overflow, disabled, ...props }, ref) => {
    void overflow; // read by the Root
    const toolbar = React.useContext(ToolbarContext);
    const parentDisabled = React.useContext(GroupDisabledContext);
    const parentGroup = React.useContext(ButtonGroupContext);
    const orientation = toolbar?.orientation ?? "horizontal";
    // Attached items read as one control, so they take an outline (ButtonGroup).
    const groupCtx = React.useMemo<ButtonGroupContextValue>(
      () => ({ ...parentGroup, variant: attached ? "outline" : parentGroup?.variant }),
      [attached, parentGroup],
    );
    return (
      <GroupDisabledContext.Provider value={parentDisabled || Boolean(disabled)}>
        <ButtonGroupContext.Provider value={groupCtx}>
          <BaseToolbar.Group
            ref={ref}
            data-slot="toolbar-group"
            data-attached={attached ? "" : undefined}
            disabled={disabled}
            className={mergeClassName(
              cn(
                "flex shrink-0",
                orientation === "vertical" ? "flex-col items-stretch" : "items-center",
                attached ? connectedClasses(orientation) : "gap-[calc(var(--sp-control-gap)/2)]",
              ),
              className,
            )}
            {...props}
          />
        </ButtonGroupContext.Provider>
      </GroupDisabledContext.Provider>
    );
  },
);
Group.displayName = "Toolbar.Group";

/* ============================================================
 * Link
 * ============================================================ */

export interface ToolbarLinkProps extends React.ComponentProps<typeof BaseToolbar.Link> {
  /** An icon before the text. */
  icon?: React.ReactNode;
  /** `false` keeps this link in the toolbar when the rest overflow into the More menu. */
  overflow?: boolean;
}

const ToolbarLink = React.forwardRef<HTMLAnchorElement, ToolbarLinkProps>(
  ({ className, target, rel, icon, overflow, children, ...props }, ref) => {
    void overflow; // read by the Root
    const toolbar = React.useContext(ToolbarContext);
    const size = toolbar?.size ?? "md";
    // Shared with Link (GEO-967): new-tab icon, hidden "(opens in new tab)" and rel
    const { newTab, rel: mergedRel } = getLinkBehaviour({ target, rel });
    return (
      <BaseToolbar.Link
        ref={ref}
        data-slot="toolbar-link"
        target={target}
        rel={mergedRel}
        className={mergeClassName(
          cn(
            "text-fg-default inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))] px-3 font-medium",
            size === "lg" ? "text-base" : "text-sm",
            HEIGHT[size],
            "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] hover:bg-[var(--sp-state-hover)]",
            "[&>svg]:size-[var(--sp-control-icon)] [&>svg]:shrink-0",
            // The shared ring, without Link's small radius: the item keeps its own
            focusRingClasses,
          ),
          className,
        )}
        {...props}
      >
        {icon}
        {children}
        {newTab && (
          <>
            <ArrowSquareOutIcon aria-hidden="true" className="!size-[1em] rtl:-scale-x-100" />
            <VisuallyHidden>{defaultLinkLabels.newTab}</VisuallyHidden>
          </>
        )}
      </BaseToolbar.Link>
    );
  },
);
ToolbarLink.displayName = "Toolbar.Link";

/* ============================================================
 * Input
 * ============================================================ */

/**
 * A text field in the toolbar. APG: use one at most, and put it last, because it
 * keeps the arrow keys while the caret isn't at an end (Base UI is caret-aware).
 * It never moves into the More menu.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof BaseToolbar.Input>>(
  ({ className, ...props }, ref) => {
    const toolbar = React.useContext(ToolbarContext);
    const size = toolbar?.size ?? "md";
    return (
      <BaseToolbar.Input
        ref={ref}
        data-slot="toolbar-input"
        className={mergeClassName(
          cn(
            "text-fg-default placeholder:text-fg-muted border-border-control min-w-0 rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))] border-2 bg-transparent px-2",
            // A bordered control next to borderless items: the same breathing room a
            // separator gets, so it doesn't sit 4px from a solid button
            "mx-1",
            size === "lg" ? "text-base" : "text-sm",
            HEIGHT[size],
            "focus-visible:sp-focus-ring outline-none",
            disabledItem,
          ),
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Toolbar.Input";

/* ============================================================
 * Separator
 * ============================================================ */

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToolbar.Separator>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Separator
    ref={ref}
    data-slot="toolbar-separator"
    className={mergeClassName(
      cn(
        "bg-border-default shrink-0",
        // Perpendicular to the toolbar (Base UI sets the orientation)
        "data-[orientation=vertical]:mx-1 data-[orientation=vertical]:my-1 data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        "data-[orientation=horizontal]:mx-1 data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px",
        // Forced colours drop backgrounds: draw it with a border
        "forced-colors:border-s forced-colors:border-[CanvasText]",
        // At the start or end of a wrapped line it separates nothing (Root marks it)
        "data-[line-edge]:invisible",
      ),
      className,
    )}
    {...props}
  />
));
Separator.displayName = "Toolbar.Separator";

export const Toolbar = {
  Root,
  Group,
  Button: ToolbarButton,
  Toggle: ToolbarToggle,
  Link: ToolbarLink,
  Input,
  Separator,
};
