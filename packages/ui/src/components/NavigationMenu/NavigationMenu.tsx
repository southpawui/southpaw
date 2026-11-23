import * as React from "react";
import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { focusRingClasses } from "../../lib/link";
import { Link as NavLink, type LinkProps } from "../Link/Link";
import { Accordion } from "../Accordion/Accordion";
import { Button } from "../Button/Button";
import { CollapsibleChevron } from "../Collapsible/Collapsible";
import { Drawer } from "../Drawer/Drawer";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// package doesn't need @types/node.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * Types
 * ============================================================ */

export type NavigationMenuSize = "sm" | "md" | "lg";
/** Below this breakpoint the menu collapses into a "Menu" button + Drawer. */
export type NavigationMenuCollapse = "sm" | "md" | "lg" | "always" | "never";
/**
 * What happens when items don't fit on one line (horizontal only):
 * - `more` — trailing items move into a "More" dropdown (Primer, AntD)
 * - `scroll` — the list scrolls, with arrow buttons at the edges (MUI)
 * - `none` — no handling (items wrap or overflow as your layout allows)
 */
export type NavigationMenuOverflow = "more" | "scroll" | "none";

export interface NavigationMenuLabels {
  /** Mobile toggle and drawer title. @default "Menu" */
  menu?: string;
  /** Overflow dropdown trigger. @default "More" */
  more?: string;
  /** Appended (visually hidden) to "More" when it holds the current page. @default "includes current page" */
  moreIncludesCurrent?: string;
  /** Scroll-arrow buttons. @default "Scroll left" / "Scroll right" */
  scrollStart?: string;
  scrollEnd?: string;
  /** Close button in the mobile drawer. @default "Close menu" */
  close?: string;
}

const defaultLabels: Required<NavigationMenuLabels> = {
  menu: "Menu",
  more: "More",
  moreIncludesCurrent: "includes current page",
  scrollStart: "Scroll back",
  scrollEnd: "Scroll forward",
  close: "Close menu",
};

/* ============================================================
 * Contexts
 * ============================================================ */

interface RootContextValue {
  size: NavigationMenuSize;
  orientation: "horizontal" | "vertical";
  indicator: boolean;
  morph: boolean;
  nested: boolean;
  /** Nested menu that expands inline (chevron points down, not to the side). */
  inlineSubmenu: boolean;
  /** Close the open panel (used by the "More" dropdown's stacked links). */
  closeMenu: () => void;
}

const RootContext = React.createContext<RootContextValue | null>(null);

function useRootContext(part: string) {
  const ctx = React.useContext(RootContext);
  if (!ctx) throw new Error(`NavigationMenu.${part} must be used inside NavigationMenu.Root`);
  return ctx;
}

/**
 * Stacked mode: the same parts re-rendered as Accordion sections, inside the
 * mobile Drawer or the "More" dropdown. Base UI's NavigationMenu parts aren't
 * used there, so these parts render their own markup.
 */
interface StackedContextValue {
  /** Close the surface the links live in (drawer / More dropdown). */
  close: () => void;
}

const StackedContext = React.createContext<StackedContextValue | null>(null);

interface ItemContextValue {
  current: boolean;
}

const ItemContext = React.createContext<ItemContextValue>({ current: false });

/** True inside a dropdown panel (Content), where links use the panel style. */
const InContentContext = React.createContext(false);

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/* ============================================================
 * Shared classes
 * ============================================================ */

const triggerSize: Record<NavigationMenuSize, string> = {
  sm: "min-h-[var(--sp-control-height-sm)] gap-1 px-2 text-sm",
  md: "min-h-[var(--sp-control-height)] gap-1.5 px-3 text-sm",
  lg: "min-h-[var(--sp-control-height-lg)] gap-2 px-4 text-base",
};

// The shared link focus ring (GEO-967); rows keep their own radius
const focusRing = focusRingClasses;

/** Navigation rows are Links in the text colour: no underline, visited colour or print URL. */
const navLinkOptions = {
  variant: "inherit",
  standalone: true,
  underline: "none",
  visited: false,
  printUrl: false,
} as const;

/** Top-level trigger and link: same box so the row lines up. */
const topLevelItem = cn(
  "text-fg-muted inline-flex cursor-pointer items-center whitespace-nowrap rounded-[var(--radius-DEFAULT)] font-medium",
  "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] motion-reduce:transition-none",
  "hover:text-fg-default aria-expanded:text-fg-default [&[aria-current]]:text-fg-default",
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)] data-[disabled]:hover:bg-transparent",
  focusRing,
);

/**
 * `highlight="fill"` (and rows inside panels): background on hover / open; the
 * current item keeps a stronger "selected" fill. No line.
 */
const fillHighlight =
  "hover:bg-state-hover active:bg-state-pressed aria-expanded:bg-state-hover [&[aria-current]]:bg-state-selected [&[aria-current]]:font-semibold forced-colors:[&[aria-current]]:outline forced-colors:[&[aria-current]]:outline-1";

export type NavigationMenuHighlight = "line" | "fill";

/** Root-provided options the desktop list needs (overflow mode, labels). */
const ListOptionsContext = React.createContext<{
  overflow: NavigationMenuOverflow;
  labels: Required<NavigationMenuLabels>;
}>({ overflow: "more", labels: defaultLabels });

/* ============================================================
 * Root
 * ============================================================ */

export interface NavigationMenuRootProps extends BaseNavigationMenu.Root.Props {
  /** Trigger and link height. Heights follow density. @default "md" */
  size?: NavigationMenuSize;
  /**
   * How hovered, open and current items are marked (one style, never both):
   * - `line` (default): a sliding line under the item; no background fill.
   *   It rests on the current page. Moves without sliding under reduced motion.
   * - `fill`: a background fill on hover / open; the current page keeps a
   *   stronger fill. No line.
   * The chevron rotates when open in both.
   */
  highlight?: NavigationMenuHighlight;
  /**
   * `true` (default): one shared panel that resizes and slides between items.
   * `false`: each item's panel opens on its own under its trigger, without
   * morphing from the previous one.
   */
  viewport?: boolean;
  /** `hover` opens on hover or click; `click` only on click (or Enter/Space). @default "hover" */
  openOn?: "hover" | "click";
  /** Collapse into a "Menu" button + Drawer below this breakpoint. @default "md" */
  collapseBelow?: NavigationMenuCollapse;
  /** What happens when items don't fit. @default "more" */
  overflow?: NavigationMenuOverflow;
  /** Pointer arrow on the dropdown panel. @default false */
  arrow?: boolean;
  /** Dim the page behind an open panel (useful for mega menus). @default false */
  backdrop?: boolean;
  /** Distance between the list and the panel (px). @default 8 */
  sideOffset?: number;
  /** Nested menus only: flyout to the side (default) or expand inline. */
  submenu?: "flyout" | "inline";
  /** Localisable strings. */
  labels?: NavigationMenuLabels;
}

/** Tailwind's default breakpoints, for closing the drawer when the layout turns desktop. */
const collapseMinWidth: Partial<Record<NavigationMenuCollapse, string>> = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
};

const collapseClasses: Record<NavigationMenuCollapse, { desktop: string; mobile: string }> = {
  sm: { desktop: "hidden sm:block", mobile: "sm:hidden" },
  md: { desktop: "hidden md:block", mobile: "md:hidden" },
  lg: { desktop: "hidden lg:block", mobile: "lg:hidden" },
  always: { desktop: "hidden", mobile: "" },
  never: { desktop: "", mobile: "hidden" },
};

const Root = React.forwardRef<HTMLElement, NavigationMenuRootProps>((props, ref) => {
  // In the drawer / More dropdown a nested Root is just a nested section list
  const stacked = React.useContext(StackedContext);
  if (stacked) return <>{props.children}</>;
  return <DesktopRoot ref={ref} {...props} />;
});
Root.displayName = "NavigationMenu.Root";

const DesktopRoot = React.forwardRef<HTMLElement, NavigationMenuRootProps>((props, ref) => {
  const {
    className,
    children,
    size = "md",
    highlight = "line",
    viewport = true,
    openOn = "hover",
    collapseBelow = "md",
    overflow = "more",
    arrow = false,
    backdrop = false,
    sideOffset = 8,
    submenu = "flyout",
    labels: labelsProp,
    orientation = "horizontal",
    onValueChange,
    actionsRef: actionsRefProp,
    ...rest
  } = props;
  const parent = React.useContext(RootContext);
  const nested = parent !== null;
  const labels = { ...defaultLabels, ...labelsProp };
  const listOptions = React.useMemo(
    () => ({ overflow, labels: { ...defaultLabels, ...labelsProp } }),
    [overflow, labelsProp],
  );
  const ownActions = React.useRef<BaseNavigationMenu.Root.Actions | null>(null);
  const actionsRef = actionsRefProp ?? ownActions;

  const handleValueChange: BaseNavigationMenu.Root.Props["onValueChange"] = (value, details) => {
    // Click mode: ignore hover opens and hover closes (Carbon)
    if (openOn === "click" && details.reason === "trigger-hover") {
      details.cancel();
      return;
    }
    onValueChange?.(value, details);
  };

  const ctx: RootContextValue = {
    size,
    orientation: nested ? "vertical" : orientation,
    indicator: !nested && highlight === "line",
    morph: viewport,
    nested,
    inlineSubmenu: nested && submenu === "inline",
    closeMenu: () => actionsRef.current?.close(),
  };

  const unnamed = !nested && !rest["aria-label"] && !rest["aria-labelledby"];
  const warned = React.useRef(false);
  React.useEffect(() => {
    if (isDev && unnamed && !warned.current) {
      warned.current = true;
      console.warn(
        "[Southpaw] NavigationMenu.Root: give the navigation landmark a name with `aria-label` " +
          '(e.g. "Main") or `aria-labelledby`.',
      );
    }
  }, [unnamed]);

  const vertical = ctx.orientation === "vertical";
  const collapse = nested || vertical ? collapseClasses.never : collapseClasses[collapseBelow];

  const panel =
    nested && submenu === "inline" ? (
      <BaseNavigationMenu.Viewport data-slot="navigation-menu-viewport" className="w-full" />
    ) : (
      <BaseNavigationMenu.Portal>
        {backdrop && !nested && (
          <BaseNavigationMenu.Backdrop
            data-slot="navigation-menu-backdrop"
            className={cn(
              // Visual only: pointer events would land on it and hover-close the panel
              "pointer-events-none fixed inset-0 z-40 bg-black/30 transition-opacity duration-[var(--sp-duration-normal)] motion-reduce:transition-none",
              "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            )}
          />
        )}
        <BaseNavigationMenu.Positioner
          data-slot="navigation-menu-positioner"
          side={vertical ? "inline-end" : "bottom"}
          align="start"
          sideOffset={nested ? 4 : sideOffset}
          collisionPadding={8}
          className={cn(
            "z-50 h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)]",
            viewport &&
              "transition-[top,left,right,bottom] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
            "data-[instant]:transition-none motion-reduce:transition-none",
          )}
        >
          <BaseNavigationMenu.Popup
            data-slot="navigation-menu-popup"
            // Base UI renders a second <nav>; a div avoids an unnamed duplicate landmark
            render={<div />}
            className={cn(
              "border-border-default bg-surface-overlay text-fg-default relative h-[var(--popup-height)] w-[var(--popup-width)] origin-[var(--transform-origin)] rounded-[var(--radius-DEFAULT)] border shadow-lg outline-none",
              viewport ? "transition-[opacity,scale,width,height]" : "transition-[opacity,scale]",
              "duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)] motion-reduce:transition-none",
              "data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
              "forced-colors:border-[CanvasText]",
            )}
          >
            {arrow && (
              <BaseNavigationMenu.Arrow
                data-slot="navigation-menu-arrow"
                className={cn(
                  "border-border-default bg-surface-overlay size-2.5 rotate-45 border",
                  "data-[side=bottom]:-top-[5.5px] data-[side=bottom]:border-b-0 data-[side=bottom]:border-r-0",
                  "data-[side=inline-end]:-start-[5.5px] data-[side=inline-end]:border-t-0",
                  "ltr:data-[side=inline-end]:border-r-0 rtl:data-[side=inline-end]:border-l-0",
                )}
              />
            )}
            <BaseNavigationMenu.Viewport
              data-slot="navigation-menu-viewport"
              className="relative h-full w-full overflow-hidden"
            />
          </BaseNavigationMenu.Popup>
        </BaseNavigationMenu.Positioner>
      </BaseNavigationMenu.Portal>
    );

  return (
    <RootContext.Provider value={ctx}>
      <ListOptionsContext.Provider value={listOptions}>
        <BaseNavigationMenu.Root
          ref={ref}
          data-slot={nested ? "navigation-menu-sub" : "navigation-menu"}
          data-size={size}
          data-orientation={ctx.orientation}
          orientation={ctx.orientation}
          actionsRef={actionsRef}
          onValueChange={handleValueChange}
          className={mergeClassName(
            cn(
              !vertical && !nested && "w-full min-w-0",
              // Keep the nav itself above its backdrop
              backdrop && !nested && "relative z-50",
            ),
            className,
          )}
          {...rest}
        >
          <div data-slot="navigation-menu-desktop" className={cn("min-w-0", collapse.desktop)}>
            {children}
          </div>
          {!nested && !vertical && collapseBelow !== "never" && (
            <MobileMenu
              className={collapse.mobile}
              labels={labels}
              navLabel={rest["aria-label"]}
              desktopFrom={collapseMinWidth[collapseBelow]}
            >
              {children}
            </MobileMenu>
          )}
          {panel}
        </BaseNavigationMenu.Root>
      </ListOptionsContext.Provider>
    </RootContext.Provider>
  );
});
DesktopRoot.displayName = "NavigationMenu.DesktopRoot";

/* ============================================================
 * Mobile — "Menu" button + Drawer with Accordion sections
 * ============================================================ */

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className="size-4">
      <path
        d="M2.5 4h11M2.5 8h11M2.5 12h11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className="size-4">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Current item in the drawer / More list: accent bar on the inline-start edge. */
const stackedCurrent =
  "relative font-semibold text-fg-default before:absolute before:inset-y-2 before:start-0 before:w-0.5 before:rounded-full before:bg-accent forced-colors:before:bg-[CanvasText]";

function MobileMenu({
  className,
  labels,
  navLabel,
  desktopFrom,
  children,
}: {
  className: string;
  labels: Required<NavigationMenuLabels>;
  navLabel?: string;
  /** Min width where the desktop list takes over; the drawer closes when it's reached. */
  desktopFrom?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const stacked = React.useMemo(() => ({ close: () => setOpen(false) }), []);

  // A modal drawer left open over the desktop layout (window resized / rotated) would trap focus
  React.useEffect(() => {
    if (!open || !desktopFrom || typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(`(min-width: ${desktopFrom})`);
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [open, desktopFrom]);
  return (
    <div data-slot="navigation-menu-mobile" className={className}>
      <Drawer.Root open={open} onOpenChange={setOpen} direction="right">
        <Drawer.Trigger
          data-slot="navigation-menu-mobile-toggle"
          render={<Button variant="ghost" icon={<HamburgerIcon />} />}
        >
          {labels.menu}
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Popup size="sm">
            <Drawer.Header className="items-center">
              <Drawer.Title>{labels.menu}</Drawer.Title>
              {/* Drawer.CloseButton hides below `sm` (it expects a swipe handle);
                  a nav drawer always needs a visible close */}
              <Drawer.Close
                data-slot="navigation-menu-mobile-close"
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={labels.close}
                    icon={<CloseIcon />}
                    className="-me-2 shrink-0"
                  />
                }
              />
            </Drawer.Header>
            <Drawer.Body>
              <nav aria-label={navLabel ?? labels.menu} data-slot="navigation-menu-mobile-nav">
                <StackedContext.Provider value={stacked}>{children}</StackedContext.Provider>
              </nav>
            </Drawer.Body>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

/* ============================================================
 * List — overflow ("More" / scroll) and the sliding indicator
 * ============================================================ */

export type NavigationMenuListProps = BaseNavigationMenu.List.Props;

const List = React.forwardRef<HTMLUListElement, NavigationMenuListProps>((props, ref) => {
  const stacked = React.useContext(StackedContext);
  if (stacked) return <StackedList {...props} ref={ref} />;
  return <DesktopList {...props} ref={ref} />;
});
List.displayName = "NavigationMenu.List";

const StackedList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>((props, ref) => {
  const { className, children } = props;
  return (
    <Accordion.Root
      multiple
      size="md"
      // No dividers: fills (hover, current, open) never sit between two lines
      variant="filled"
      ref={ref as unknown as React.Ref<HTMLDivElement>}
      render={<ul />}
      data-slot="navigation-menu-list"
      className={cn("m-0 list-none p-0", className as string)}
    >
      {children}
    </Accordion.Root>
  );
});
StackedList.displayName = "NavigationMenu.StackedList";

const DesktopList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const root = useRootContext("List");
  const { overflow: overflowMode, labels } = React.useContext(ListOptionsContext);
  const horizontal = root.orientation === "horizontal" && !root.nested;
  const overflow = horizontal ? overflowMode : "none";

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const ulRef = React.useRef<HTMLUListElement | null>(null);
  const setUlRef = (node: HTMLUListElement | null) => {
    ulRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const items = React.Children.toArray(children).filter(React.isValidElement);
  const count = items.length;

  /* ---------- "More" overflow ---------- */
  const widths = React.useRef<number[]>([]);
  const moreWidth = React.useRef(0);
  const [visibleCount, setVisibleCount] = React.useState(count);
  const [moreHasCurrent, setMoreHasCurrent] = React.useState(false);

  // Reset when the items change so everything gets measured again
  useIsoLayoutEffect(() => {
    widths.current = [];
    setVisibleCount(count);
  }, [count]);

  useIsoLayoutEffect(() => {
    if (overflow !== "more") return;
    const wrapper = wrapperRef.current;
    const ul = ulRef.current;
    if (!wrapper || !ul) return;
    const measure = () => {
      const lis = Array.from(ul.children) as HTMLElement[];
      const itemLis = lis.filter((li) => !li.hasAttribute("data-more"));
      itemLis.forEach((li, i) => {
        if (!li.hidden) widths.current[i] = li.getBoundingClientRect().width;
      });
      const moreLi = lis.find((li) => li.hasAttribute("data-more"));
      if (moreLi && !moreLi.hidden) moreWidth.current = moreLi.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(ul).columnGap) || 0;
      const available = wrapper.clientWidth;
      const all = widths.current.slice(0, count);
      const total = all.reduce((sum, w) => sum + (w || 0), 0) + gap * Math.max(0, count - 1);
      let next = count;
      if (available > 0 && total > available + 0.5) {
        let used = (moreWidth.current || 80) + gap;
        next = 0;
        for (const w of all) {
          if (used + (w || 0) + gap > available) break;
          used += (w || 0) + gap;
          next++;
        }
      }
      setVisibleCount((prev) => (prev === next ? prev : next));
      // The More trigger reflects a current page hidden inside it (Primer)
      const hidden = itemLis.slice(next);
      setMoreHasCurrent(hidden.some((li) => li.querySelector("[aria-current]")));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [overflow, count, visibleCount]);

  const visible = overflow === "more" ? visibleCount : count;
  const overflowed = items.slice(visible);

  /* ---------- Scroll arrows ---------- */
  const [scrollEdges, setScrollEdges] = React.useState({ start: false, end: false });
  useIsoLayoutEffect(() => {
    if (overflow !== "scroll") return;
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pos = Math.abs(el.scrollLeft);
      setScrollEdges({ start: pos > 1, end: pos < max - 1 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, [overflow]);
  const scrollBy = (dir: 1 | -1) => {
    const el = wrapperRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.75,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  /* ---------- Sliding indicator ---------- */
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
  const [hoverLi, setHoverLi] = React.useState<HTMLElement | null>(null);
  const [, setTick] = React.useState(0);
  const itemFrom = (target: EventTarget | null) => {
    const ul = ulRef.current;
    if (!ul || !(target instanceof Element)) return null;
    let el: Element | null = target;
    while (el && el.parentElement !== ul) el = el.parentElement;
    return (el as HTMLElement | null) ?? null;
  };
  useIsoLayoutEffect(() => {
    if (!root.indicator) return;
    const ul = ulRef.current;
    const bar = indicatorRef.current;
    if (!ul || !bar) return;
    const lis = (Array.from(ul.children) as HTMLElement[]).filter((li) => !li.hidden);
    const target =
      (hoverLi && !hoverLi.hidden ? hoverLi : null) ??
      // aria-expanded, not data-popup-open: a Tooltip on a trigger also sets that (GEO-970).
      lis.find((li) => li.querySelector(":scope > [aria-expanded=true]")) ??
      lis.find((li) => li.querySelector(":scope > [aria-current]")) ??
      lis.find((li) => li.hasAttribute("data-more") && li.hasAttribute("data-current")) ??
      null;
    if (!target) {
      bar.style.opacity = "0";
      return;
    }
    bar.style.opacity = "1";
    if (root.orientation === "vertical") {
      const rtl = getComputedStyle(ul).direction === "rtl";
      const x = rtl ? target.offsetLeft + target.offsetWidth - 2 : target.offsetLeft;
      bar.style.transform = `translate(${x}px, ${target.offsetTop}px)`;
      bar.style.height = `${target.offsetHeight}px`;
      bar.style.width = "";
    } else {
      bar.style.transform = `translate(${target.offsetLeft + 8}px, ${target.offsetTop + target.offsetHeight - 2}px)`;
      bar.style.width = `${Math.max(0, target.offsetWidth - 16)}px`;
      bar.style.height = "";
    }
  });
  // Re-place the bar when the panel opens/closes or the layout changes
  React.useEffect(() => {
    if (!root.indicator) return;
    const ul = ulRef.current;
    if (!ul || typeof MutationObserver === "undefined") return;
    const mo = new MutationObserver(() => setTick((t) => t + 1));
    mo.observe(ul, {
      attributes: true,
      subtree: true,
      attributeFilter: ["aria-expanded", "aria-current", "hidden"],
    });
    const ro =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => setTick((t) => t + 1));
    ro?.observe(ul);
    return () => {
      mo.disconnect();
      ro?.disconnect();
    };
  }, [root.indicator]);

  const vertical = root.orientation === "vertical";
  const ulClasses = cn(
    "m-0 flex list-none p-0",
    vertical ? "flex-col items-stretch gap-0.5" : "items-center gap-1",
    overflow === "scroll" && "w-max",
    className as string,
  );

  const indicatorBar = root.indicator && (
    <span
      ref={indicatorRef}
      aria-hidden="true"
      data-slot="navigation-menu-indicator"
      className={cn(
        "bg-accent pointer-events-none absolute left-0 top-0 rounded-full opacity-0",
        vertical ? "w-0.5" : "h-0.5",
        "transition-[transform,width,height,opacity] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
        // Reduced motion: jump to the new position, no slide
        "motion-reduce:transition-none",
        "forced-colors:bg-[CanvasText]",
      )}
    />
  );

  const list = (
    <BaseNavigationMenu.List
      ref={setUlRef}
      data-slot="navigation-menu-list"
      className={ulClasses}
      {...rest}
    >
      {items.map((child, i) =>
        overflow === "more" && i >= visible
          ? React.cloneElement(child as React.ReactElement<{ hidden?: boolean }>, { hidden: true })
          : child,
      )}
      {overflow === "more" && overflowed.length > 0 && (
        <MoreItem labels={labels} hasCurrent={moreHasCurrent}>
          {overflowed}
        </MoreItem>
      )}
    </BaseNavigationMenu.List>
  );

  const wrapperHandlers = {
    onPointerOver: (e: React.PointerEvent) => setHoverLi(itemFrom(e.target)),
    onPointerLeave: () => setHoverLi(null),
    onFocus: (e: React.FocusEvent) => {
      if ((e.target as HTMLElement).matches(":focus-visible")) setHoverLi(itemFrom(e.target));
    },
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverLi(null);
    },
  };

  if (overflow === "scroll") {
    return (
      <div data-slot="navigation-menu-scroll" className="relative flex min-w-0 items-center">
        {scrollEdges.start && (
          <Button
            size="icon"
            variant="ghost"
            tabIndex={-1}
            aria-label={labels.scrollStart}
            data-slot="navigation-menu-scroll-start"
            className="bg-surface-base absolute start-0 z-10 shadow-[8px_0_8px_var(--sp-surface-base)] rtl:shadow-[-8px_0_8px_var(--sp-surface-base)]"
            icon={<CollapsibleChevron className="rotate-90 rtl:-rotate-90" />}
            onClick={() => scrollBy(-1)}
          />
        )}
        <div
          ref={wrapperRef}
          data-slot="navigation-menu-scroller"
          className="relative min-w-0 flex-1 overflow-x-auto px-1 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          {...wrapperHandlers}
        >
          {list}
          {indicatorBar}
        </div>
        {scrollEdges.end && (
          <Button
            size="icon"
            variant="ghost"
            tabIndex={-1}
            aria-label={labels.scrollEnd}
            data-slot="navigation-menu-scroll-end"
            className="bg-surface-base absolute end-0 z-10 shadow-[-8px_0_8px_var(--sp-surface-base)] rtl:shadow-[8px_0_8px_var(--sp-surface-base)]"
            icon={<CollapsibleChevron className="-rotate-90 rtl:rotate-90" />}
            onClick={() => scrollBy(1)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      data-slot="navigation-menu-list-wrapper"
      className={cn("relative min-w-0", !vertical && "pb-1")}
      {...wrapperHandlers}
    >
      {list}
      {indicatorBar}
    </div>
  );
});
DesktopList.displayName = "NavigationMenu.DesktopList";

function MoreItem({
  labels,
  hasCurrent,
  children,
}: {
  labels: Required<NavigationMenuLabels>;
  hasCurrent: boolean;
  children: React.ReactNode;
}) {
  const root = useRootContext("List");
  const { closeMenu } = root;
  const stacked = React.useMemo(() => ({ close: closeMenu }), [closeMenu]);
  return (
    <Item data-more="" data-current={hasCurrent ? "" : undefined} current={hasCurrent}>
      <Trigger>
        {labels.more}
        {hasCurrent && <span className="sr-only">, {labels.moreIncludesCurrent}</span>}
      </Trigger>
      <Content className="w-72 p-1">
        <StackedContext.Provider value={stacked}>
          <StackedList>{children}</StackedList>
        </StackedContext.Provider>
      </Content>
    </Item>
  );
}

/* ============================================================
 * Item
 * ============================================================ */

export interface NavigationMenuItemProps extends BaseNavigationMenu.Item.Props {
  /**
   * This item's section contains the current page. The trigger gets
   * `aria-current="true"` and the current styling (GOV.UK "active", Carbon).
   */
  current?: boolean;
}

const Item = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>((props, ref) => {
  const { className, current = false, value, children, render, ...rest } = props;
  const stacked = React.useContext(StackedContext);
  const ctx = React.useMemo(() => ({ current }), [current]);

  if (stacked) {
    return (
      <ItemContext.Provider value={ctx}>
        <Accordion.Item
          ref={ref as unknown as React.Ref<HTMLDivElement>}
          value={value}
          render={<li />}
          data-slot="navigation-menu-item"
          className={className as string}
          {...(rest as object)}
        >
          {children}
        </Accordion.Item>
      </ItemContext.Provider>
    );
  }

  return (
    <ItemContext.Provider value={ctx}>
      <BaseNavigationMenu.Item
        ref={ref}
        value={value}
        render={render}
        data-slot="navigation-menu-item"
        data-current={current ? "" : undefined}
        className={mergeClassName(cn("relative"), className)}
        {...rest}
      >
        {children}
      </BaseNavigationMenu.Item>
    </ItemContext.Provider>
  );
});
Item.displayName = "NavigationMenu.Item";

/* ============================================================
 * Trigger
 * ============================================================ */

export interface NavigationMenuTriggerProps extends BaseNavigationMenu.Trigger.Props {
  /** Indicator icon. Defaults to a chevron that flips when open. `null` hides it. */
  icon?: React.ReactNode;
}

const Trigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>((props, ref) => {
  const { className, children, icon, ...rest } = props;
  const stacked = React.useContext(StackedContext);
  const item = React.useContext(ItemContext);

  if (stacked) {
    return (
      <Accordion.Header>
        <Accordion.Trigger
          ref={ref}
          data-slot="navigation-menu-trigger"
          aria-current={item.current ? "true" : undefined}
          className={cn(item.current && stackedCurrent, className as string)}
        >
          {children}
        </Accordion.Trigger>
      </Accordion.Header>
    );
  }

  return (
    <DesktopTrigger ref={ref} className={className} icon={icon} {...rest}>
      {children}
    </DesktopTrigger>
  );
});
Trigger.displayName = "NavigationMenu.Trigger";

const DesktopTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  (props, ref) => {
    const { className, children, icon, ...rest } = props;
    const root = useRootContext("Trigger");
    const item = React.useContext(ItemContext);
    const vertical = root.orientation === "vertical";
    return (
      <BaseNavigationMenu.Trigger
        ref={ref}
        data-slot="navigation-menu-trigger"
        aria-current={item.current ? "true" : undefined}
        className={mergeClassName(
          cn(
            topLevelItem,
            triggerSize[root.size],
            vertical && "w-full justify-between",
            !root.indicator && fillHighlight,
          ),
          className,
        )}
        {...rest}
      >
        {children}
        {icon !== null && (
          <BaseNavigationMenu.Icon
            data-slot="navigation-menu-icon"
            className={cn(
              "text-fg-muted inline-flex shrink-0",
              "transition-transform duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)] motion-reduce:transition-none",
              vertical && !root.inlineSubmenu
                ? "-rotate-90 rtl:rotate-90"
                : "data-[popup-open]:rotate-180",
            )}
          >
            {icon ?? <CollapsibleChevron />}
          </BaseNavigationMenu.Icon>
        )}
      </BaseNavigationMenu.Trigger>
    );
  },
);
DesktopTrigger.displayName = "NavigationMenu.DesktopTrigger";

/* ============================================================
 * Content — one dropdown panel
 * ============================================================ */

export type NavigationMenuContentProps = BaseNavigationMenu.Content.Props;

const Content = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>((props, ref) => {
  const { className, children, keepMounted, ...rest } = props;
  const stacked = React.useContext(StackedContext);
  const root = React.useContext(RootContext);

  if (stacked) {
    return (
      <Accordion.Panel
        ref={ref}
        data-slot="navigation-menu-content"
        contentProps={{
          // Desktop panel widths and multi-column grids don't fit a drawer: stack them
          className:
            "px-1 pb-2 pt-0 [&_*]:!min-w-0 [&_*]:!max-w-full [&>*]:!w-auto [&_[class*=grid-cols]]:!grid-cols-1",
        }}
      >
        <InContentContext.Provider value={true}>{children}</InContentContext.Provider>
      </Accordion.Panel>
    );
  }

  const morph = root?.morph ?? true;
  return (
    <BaseNavigationMenu.Content
      ref={ref}
      data-slot="navigation-menu-content"
      keepMounted={keepMounted}
      className={cn(
        "h-full w-[calc(100vw-2rem)] p-2 sm:w-max",
        "transition-[opacity,translate] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)] motion-reduce:transition-none",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        // Slide in from the side the pointer came from (Base UI activation direction)
        morph &&
          cn(
            "data-[starting-style]:data-[activation-direction=left]:-translate-x-1/4 data-[starting-style]:data-[activation-direction=right]:translate-x-1/4",
            "data-[ending-style]:data-[activation-direction=left]:translate-x-1/4 data-[ending-style]:data-[activation-direction=right]:-translate-x-1/4",
          ),
        className as string,
      )}
      {...rest}
    >
      <InContentContext.Provider value={true}>{children}</InContentContext.Provider>
    </BaseNavigationMenu.Content>
  );
});
Content.displayName = "NavigationMenu.Content";

/* ============================================================
 * Link
 * ============================================================ */

export interface NavigationMenuLinkProps extends Omit<BaseNavigationMenu.Link.Props, "active"> {
  /**
   * `true` / `"page"`: this is the current page (`aria-current="page"`).
   * `"section"`: the current page is within this link's section (`aria-current="true"`).
   */
  active?: boolean | "page" | "section";
  /** Leading icon (decorative). */
  icon?: React.ReactNode;
  /** Secondary line under the title (mega menus). */
  description?: React.ReactNode;
  /** Trailing content, e.g. a counter `<Badge>` or "New". */
  badge?: React.ReactNode;
  /** Close the open panel when the link is followed. @default true inside a panel */
  closeOnClick?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>((props, ref) => {
  const {
    className,
    children,
    active = false,
    icon,
    description,
    badge,
    closeOnClick,
    render,
    onClick,
    ...rest
  } = props;
  const stacked = React.useContext(StackedContext);
  const inContent = React.useContext(InContentContext);
  const root = React.useContext(RootContext);
  const isPage = active === true || active === "page";
  const isSection = active === "section";
  const current = isPage || isSection;
  const rich = icon !== undefined || description !== undefined || badge !== undefined;

  // The current item is also wrapped in <strong> so it stays identifiable
  // without CSS or with colours overridden (GOV.UK)
  const title = current ? (
    <strong data-slot="navigation-menu-current" className="font-[inherit]">
      {children}
    </strong>
  ) : (
    children
  );

  const body = rich ? (
    <>
      {icon !== undefined && (
        <span
          aria-hidden="true"
          data-slot="navigation-menu-link-icon"
          className={cn(
            "text-fg-muted inline-flex shrink-0",
            description !== undefined &&
              "border-border-default bg-surface-base mt-0.5 size-9 items-center justify-center rounded-[var(--radius-DEFAULT)] border",
          )}
        >
          {icon}
        </span>
      )}
      <span data-slot="navigation-menu-link-label" className="flex min-w-0 flex-1 flex-col">
        <span data-slot="navigation-menu-link-title" className="font-medium">
          {title}
        </span>
        {description !== undefined && " "}
        {description !== undefined && (
          <span
            data-slot="navigation-menu-link-description"
            className="text-fg-muted text-sm font-normal"
          >
            {description}
          </span>
        )}
      </span>
      {badge !== undefined && " "}
      {badge !== undefined && (
        <span data-slot="navigation-menu-link-badge" className="shrink-0">
          {badge}
        </span>
      )}
    </>
  ) : (
    title
  );

  const panelStyle = cn(
    "text-fg-default flex w-full items-start gap-3 rounded-[calc(var(--radius-DEFAULT)-2px)] px-3 py-2 text-sm no-underline",
    "transition-colors duration-[var(--sp-duration-fast)] motion-reduce:transition-none",
    "hover:bg-state-hover active:bg-state-pressed",
    "[&[aria-current]]:bg-state-hover [&[aria-current]]:font-semibold",
    !rich && "items-center",
    // Card links (with a description) need room so descriptions don't break awkwardly
    description !== undefined && "sm:min-w-[18rem]",
    focusRing,
  );

  if (stacked) {
    // Plain link (no Base UI NavigationMenu context in the drawer / More list)
    return (
      <StackedLink
        ref={ref}
        render={render}
        className={cn(
          panelStyle,
          !inContent && "min-h-[var(--sp-control-height)] font-medium",
          current && stackedCurrent,
          className as string,
        )}
        ariaCurrent={isPage ? "page" : isSection ? "true" : undefined}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        {...(rest as React.ComponentPropsWithoutRef<"a">)}
      >
        {body}
      </StackedLink>
    );
  }

  const size = root?.size ?? "md";
  const vertical = root?.orientation === "vertical";
  return (
    <BaseNavigationMenu.Link
      ref={ref}
      data-slot="navigation-menu-link"
      active={isPage}
      // Only set when it's a section, so Base UI's aria-current="page" isn't overridden
      {...(isSection ? { "aria-current": "true" as const } : {})}
      // Links in a panel close it (as the drawer and More list do), so single-page
      // apps don't leave the panel open after navigating
      closeOnClick={closeOnClick ?? inContent}
      // Base UI → Link → the consumer's router link (element or function render).
      // Link adds the new-tab icon, hidden text and rel.
      render={<NavLink {...navLinkOptions} render={render as LinkProps["render"]} />}
      onClick={onClick}
      className={cn(
        inContent
          ? panelStyle
          : cn(
              topLevelItem,
              triggerSize[size],
              "no-underline",
              rich && "gap-2",
              vertical && "w-full",
              (!root || !root.indicator) && fillHighlight,
            ),
        className as string,
      )}
      {...rest}
    >
      {body}
    </BaseNavigationMenu.Link>
  );
});
Link.displayName = "NavigationMenu.Link";

const StackedLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    render?: NavigationMenuLinkProps["render"];
    ariaCurrent?: "page" | "true";
  }
>(({ render, ariaCurrent, onClick, ...props }, ref) => {
  const stacked = React.useContext(StackedContext);
  return (
    <NavLink
      {...navLinkOptions}
      {...props}
      ref={ref}
      // Element or function render (e.g. a router link), as on desktop
      render={render as LinkProps["render"]}
      data-slot="navigation-menu-link"
      aria-current={ariaCurrent}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (!event.defaultPrevented && !modified) stacked?.close();
      }}
    />
  );
});
StackedLink.displayName = "NavigationMenu.StackedLink";

/* ============================================================
 * Group — labelled list of links inside a panel
 * ============================================================ */

export interface NavigationMenuGroupProps extends React.ComponentPropsWithRef<"div"> {
  /** Visible group label; also names the list. */
  label?: React.ReactNode;
}

const Group = React.forwardRef<HTMLDivElement, NavigationMenuGroupProps>((props, ref) => {
  const { className, label, children, ...rest } = props;
  const id = React.useId();
  return (
    <div
      ref={ref}
      data-slot="navigation-menu-group"
      className={mergeClassName(cn("flex min-w-0 flex-col"), className)}
      {...rest}
    >
      {label !== undefined && (
        <span
          id={`${id}-label`}
          data-slot="navigation-menu-group-label"
          className="text-fg-muted px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide"
        >
          {label}
        </span>
      )}
      <ul
        aria-labelledby={label !== undefined ? `${id}-label` : undefined}
        className="m-0 flex list-none flex-col gap-0.5 p-0"
      >
        {React.Children.map(children, (child) =>
          child === null || child === undefined || child === false ? null : <li>{child}</li>,
        )}
      </ul>
    </div>
  );
});
Group.displayName = "NavigationMenu.Group";

/* ============================================================
 * Footer — featured strip at the bottom of a panel
 * ============================================================ */

const Footer = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => {
    const stacked = React.useContext(StackedContext);
    return (
      <div
        ref={ref}
        data-slot="navigation-menu-footer"
        className={mergeClassName(
          cn(
            stacked
              ? "bg-surface-sunken text-fg-default mt-2 flex flex-col items-start gap-1 rounded-[var(--radius-DEFAULT)] px-3 py-3 text-sm"
              : "border-border-default bg-surface-sunken text-fg-default -mx-2 -mb-2 mt-2 flex items-center justify-between gap-3 rounded-b-[calc(var(--radius-DEFAULT)-1px)] border-t px-5 py-3 text-sm",
          ),
          className,
        )}
        {...props}
      />
    );
  },
);
Footer.displayName = "NavigationMenu.Footer";

/* ============================================================
 * Compound export
 * ============================================================ */

export const NavigationMenu = {
  Root,
  List,
  Item,
  Trigger,
  Content,
  Link,
  Group,
  Footer,
};
