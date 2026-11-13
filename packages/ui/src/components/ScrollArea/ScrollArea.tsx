import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../../lib/cn";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// package doesn't need @types/node.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * Types
 * ============================================================ */

/**
 * When the scrollbars are visible.
 * - `auto` — visible whenever the content overflows (default)
 * - `always` — always visible, track shown even when nothing overflows
 * - `hover` — visible while the pointer is over the area, while scrolling, or on keyboard focus
 * - `scroll` — visible only while scrolling (or on keyboard focus)
 * - `never` — hidden; the area still scrolls
 */
export type ScrollAreaType = "auto" | "always" | "hover" | "scroll" | "never";
export type ScrollAreaSize = "sm" | "md" | "lg";
/** Which axes scroll. Scrolling on the other axis is disabled. */
export type ScrollAreaAxes = "x" | "y" | "xy";
/** Visual cue that more content is hidden past an edge. */
export type ScrollAreaEdgeIndicator = "none" | "fade" | "shadow";

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface ScrollAreaScrollIntoViewOptions {
  /** Vertical alignment. @default "nearest" */
  block?: ScrollLogicalPosition;
  /** Horizontal alignment. @default "nearest" */
  inline?: ScrollLogicalPosition;
  /** `smooth` falls back to `auto` when the user prefers reduced motion. @default "auto" */
  behavior?: ScrollBehavior;
  /**
   * Space (px) to keep between the element and the viewport edge.
   * Defaults to the viewport's `scroll-padding`, which matches the fade size
   * when `edgeIndicator="fade"`, so the target never lands inside the fade.
   */
  offset?: number;
}

/** Imperative API, exposed through `actionsRef`. */
export interface ScrollAreaActions {
  /** The scrollable viewport element. */
  getViewport: () => HTMLDivElement | null;
  /** Like `Element.scrollTo`, but respects reduced motion. */
  scrollTo: (options: ScrollToOptions) => void;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  /**
   * Scroll a descendant into view, moving only this viewport (never the page
   * or ancestor scroll containers, unlike `Element.scrollIntoView`).
   * Accepts an element or a CSS selector scoped to the viewport.
   */
  scrollIntoView: (target: Element | string, options?: ScrollAreaScrollIntoViewOptions) => void;
}

/* ============================================================
 * Helpers
 * ============================================================ */

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.MutableRefObject<T>).current = value;
}

/** Merge our base style under a consumer `style`, which Base UI allows to be a function of state. */
function withStyle<S>(
  style: React.CSSProperties | ((state: S) => React.CSSProperties | undefined) | undefined,
  base: React.CSSProperties,
) {
  if (typeof style === "function") return (state: S) => ({ ...base, ...style(state) });
  return { ...base, ...style };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function resolveBehavior(behavior: ScrollBehavior | undefined): ScrollBehavior {
  if (behavior === "smooth" && prefersReducedMotion()) return "auto";
  return behavior ?? "auto";
}

function alignOffset(
  start: number,
  size: number,
  scroll: number,
  viewportSize: number,
  align: ScrollLogicalPosition,
  offset: number,
): number {
  switch (align) {
    case "start":
      return start - offset;
    case "end":
      return start + size - viewportSize + offset;
    case "center":
      return start - (viewportSize - size) / 2;
    default: {
      // nearest
      if (start - offset < scroll) return start - offset;
      if (start + size + offset > scroll + viewportSize) {
        return start + size - viewportSize + offset;
      }
      return scroll;
    }
  }
}

/* Fade masks (alpha only — #000 means "opaque", not a colour) */
const FADE_Y =
  "[--sp-mask-y:linear-gradient(to_bottom,transparent_0,#000_min(var(--sp-scroll-area-fade-size,2rem),var(--scroll-area-overflow-y-start,0px)),#000_calc(100%_-_min(var(--sp-scroll-area-fade-size,2rem),var(--scroll-area-overflow-y-end,0px))),transparent_100%)]";
const FADE_X =
  "ltr:[--sp-mask-x:linear-gradient(to_right,transparent_0,#000_min(var(--sp-scroll-area-fade-size,2rem),var(--scroll-area-overflow-x-start,0px)),#000_calc(100%_-_min(var(--sp-scroll-area-fade-size,2rem),var(--scroll-area-overflow-x-end,0px))),transparent_100%)] rtl:[--sp-mask-x:linear-gradient(to_left,transparent_0,#000_min(var(--sp-scroll-area-fade-size,2rem),var(--scroll-area-overflow-x-start,0px)),#000_calc(100%_-_min(var(--sp-scroll-area-fade-size,2rem),var(--scroll-area-overflow-x-end,0px))),transparent_100%)]";

/** Tolerance (px) for "reached an edge" — avoids sub-pixel misses. */
const EDGE_TOLERANCE = 1;

/* ============================================================
 * Context
 * ============================================================ */

interface ScrollAreaContextValue {
  type: ScrollAreaType;
  scrollbars: ScrollAreaAxes;
  edgeIndicator: ScrollAreaEdgeIndicator;
  /**
   * Viewport behaviour props set on Root. In composed mode the consumer's
   * <ScrollArea.Viewport> picks these up; its own props take precedence.
   */
  viewportDefaults?: ViewportBehaviourProps & { viewportRef?: React.Ref<HTMLDivElement> };
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue>({
  type: "auto",
  scrollbars: "xy",
  edgeIndicator: "fade",
});

/* ============================================================
 * Root
 * ============================================================ */

const sizeClasses: Record<ScrollAreaSize, string> = {
  // Thickness follows density: compact −2px, comfortable +2px
  sm: "[--sp-scrollbar-size:8px] [[data-density=compact]_&]:[--sp-scrollbar-size:6px] [[data-density=comfortable]_&]:[--sp-scrollbar-size:10px]",
  md: "[--sp-scrollbar-size:10px] [[data-density=compact]_&]:[--sp-scrollbar-size:8px] [[data-density=comfortable]_&]:[--sp-scrollbar-size:12px]",
  lg: "[--sp-scrollbar-size:14px] [[data-density=compact]_&]:[--sp-scrollbar-size:12px] [[data-density=comfortable]_&]:[--sp-scrollbar-size:16px]",
};

export interface ScrollAreaRootProps
  extends
    Omit<React.ComponentProps<typeof BaseScrollArea.Root>, "children">,
    ViewportBehaviourProps {
  children?: React.ReactNode;
  /** When the scrollbars are visible. @default "auto" */
  type?: ScrollAreaType;
  /** Delay (ms) before `hover`/`scroll` scrollbars fade out. @default 600 */
  scrollHideDelay?: number;
  /** Scrollbar thickness. Adjusts with density. @default "md" */
  size?: ScrollAreaSize;
  /** Which axes scroll and get a scrollbar. @default "xy" */
  scrollbars?: ScrollAreaAxes;
  /** Cue that content is hidden past an edge. @default "fade" */
  edgeIndicator?: ScrollAreaEdgeIndicator;
  /** Ref to the scrollable viewport element (auto-rendered mode). */
  viewportRef?: React.Ref<HTMLDivElement>;
  /** Extra props for the auto-rendered Viewport. */
  viewportProps?: Omit<ViewportProps, keyof ViewportBehaviourProps>;
  /** Extra props for the auto-rendered Content wrapper. */
  contentProps?: React.ComponentProps<typeof BaseScrollArea.Content>;
}

const VIEWPORT_BEHAVIOUR_KEYS = [
  "aria-label",
  "aria-labelledby",
  "offsetScrollbars",
  "maxHeight",
  "maxWidth",
  "overscrollBehavior",
  "stickToBottom",
  "startScrollPosition",
  "onScrollPositionChange",
  "onTopReached",
  "onBottomReached",
  "onLeftReached",
  "onRightReached",
  "onOverflowChange",
  "actionsRef",
] as const satisfies readonly (keyof ViewportBehaviourProps)[];

function isViewportElement(child: React.ReactNode) {
  return React.isValidElement(child) && child.type === Viewport;
}

const Root = React.forwardRef<HTMLDivElement, ScrollAreaRootProps>((props, ref) => {
  const {
    className,
    style,
    children,
    type = "auto",
    scrollHideDelay = 600,
    size = "md",
    scrollbars = "xy",
    edgeIndicator = "fade",
    viewportRef,
    viewportProps,
    contentProps,
    ...rest
  } = props;

  // Split viewport behaviour props from Root props
  const behaviour: Record<string, unknown> = {};
  const rootProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if ((VIEWPORT_BEHAVIOUR_KEYS as readonly string[]).includes(key)) behaviour[key] = value;
    else rootProps[key] = value;
  }

  // Composed mode: consumer supplies their own <ScrollArea.Viewport> etc.
  const composed = React.Children.toArray(children).some(isViewportElement);

  // In composed mode, Root-level behaviour props (aria-label, maxHeight,
  // callbacks, actionsRef…) reach the consumer's Viewport through context.
  const contextValue: ScrollAreaContextValue = {
    type,
    scrollbars,
    edgeIndicator,
    viewportDefaults: composed
      ? { ...(behaviour as ViewportBehaviourProps), viewportRef }
      : undefined,
  };

  return (
    <ScrollAreaContext.Provider value={contextValue}>
      <BaseScrollArea.Root
        ref={ref}
        data-slot="scroll-area"
        className={cn(
          "group/scroll-area relative isolate overflow-hidden",
          sizeClasses[size],
          // Focus ring on the Root (outset), so overflow:hidden can't clip it
          "has-[>[data-slot=scroll-area-viewport]:focus-visible]:sp-focus-ring",
          className,
        )}
        style={withStyle(style, {
          "--sp-scroll-hide-delay": `${scrollHideDelay}ms`,
        } as React.CSSProperties)}
        {...rootProps}
      >
        {composed ? (
          children
        ) : (
          <>
            <Viewport ref={viewportRef} {...viewportProps} {...behaviour}>
              <Content {...contentProps}>{children}</Content>
            </Viewport>
            {type !== "never" && (scrollbars === "y" || scrollbars === "xy") && (
              <Scrollbar orientation="vertical" />
            )}
            {type !== "never" && (scrollbars === "x" || scrollbars === "xy") && (
              <Scrollbar orientation="horizontal" />
            )}
            {type !== "never" && scrollbars === "xy" && <Corner />}
          </>
        )}
        {edgeIndicator === "shadow" && <EdgeShadows />}
      </BaseScrollArea.Root>
    </ScrollAreaContext.Provider>
  );
});
Root.displayName = "ScrollArea.Root";

/* ============================================================
 * Edge shadows (decorative)
 * ============================================================ */

// Literal string so Tailwind can detect it
const shadowFrom = "from-[color-mix(in_oklab,var(--sp-fg-default)_14%,transparent)]";

function EdgeShadows() {
  const { scrollbars } = React.useContext(ScrollAreaContext);
  const base =
    "pointer-events-none absolute z-[1] opacity-0 transition-opacity duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] motion-reduce:transition-none forced-colors:hidden";
  return (
    <>
      {scrollbars !== "x" && (
        <>
          <span
            aria-hidden="true"
            data-slot="scroll-area-shadow"
            data-edge="top"
            className={cn(
              base,
              "inset-x-0 top-0 h-3 bg-gradient-to-b to-transparent",
              shadowFrom,
              "group-data-[overflow-y-start]/scroll-area:opacity-100",
            )}
          />
          <span
            aria-hidden="true"
            data-slot="scroll-area-shadow"
            data-edge="bottom"
            className={cn(
              base,
              "inset-x-0 bottom-0 h-3 bg-gradient-to-t to-transparent",
              shadowFrom,
              "group-data-[overflow-y-end]/scroll-area:opacity-100",
            )}
          />
        </>
      )}
      {scrollbars !== "y" && (
        <>
          <span
            aria-hidden="true"
            data-slot="scroll-area-shadow"
            data-edge="start"
            className={cn(
              base,
              "inset-y-0 start-0 w-3 bg-gradient-to-r to-transparent rtl:bg-gradient-to-l",
              shadowFrom,
              "group-data-[overflow-x-start]/scroll-area:opacity-100",
            )}
          />
          <span
            aria-hidden="true"
            data-slot="scroll-area-shadow"
            data-edge="end"
            className={cn(
              base,
              "inset-y-0 end-0 w-3 bg-gradient-to-l to-transparent rtl:bg-gradient-to-r",
              shadowFrom,
              "group-data-[overflow-x-end]/scroll-area:opacity-100",
            )}
          />
        </>
      )}
    </>
  );
}

/* ============================================================
 * Viewport
 * ============================================================ */

interface ViewportBehaviourProps {
  /** Accessible name. Applied (with `role="region"`) only while content overflows. */
  "aria-label"?: string;
  /** Id of the element that names the region. Applied only while content overflows. */
  "aria-labelledby"?: string;
  /**
   * Reserve space so scrollbars don't cover content.
   * `true` both axes, `"x"` horizontal bar, `"y"` vertical bar,
   * `"present"` only on axes that currently overflow.
   */
  offsetScrollbars?: boolean | "x" | "y" | "present";
  /** Grow with content up to this height, then scroll. */
  maxHeight?: React.CSSProperties["maxHeight"];
  /** Grow with content up to this width, then scroll. */
  maxWidth?: React.CSSProperties["maxWidth"];
  /** CSS `overscroll-behavior` of the viewport. @default "auto" */
  overscrollBehavior?: React.CSSProperties["overscrollBehavior"];
  /** Keep the view pinned to the bottom as content grows, unless the user has scrolled up. */
  stickToBottom?: boolean;
  /** Scroll position applied on mount. */
  startScrollPosition?: Partial<ScrollPosition>;
  onScrollPositionChange?: (position: ScrollPosition) => void;
  onTopReached?: () => void;
  onBottomReached?: () => void;
  onLeftReached?: () => void;
  onRightReached?: () => void;
  /** Called when overflow on either axis starts or stops. */
  onOverflowChange?: (overflow: { x: boolean; y: boolean }) => void;
  /** Imperative scroll API. */
  actionsRef?: React.Ref<ScrollAreaActions>;
}

export interface ViewportProps
  extends React.ComponentProps<typeof BaseScrollArea.Viewport>, ViewportBehaviourProps {}

type ViewportState = BaseScrollArea.Viewport.State;

interface ViewportElementProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  state: ViewportState;
  /** Consumer's `render` prop (element or function), applied with our ARIA merged in. */
  userRender?: ViewportProps["render"];
  label?: string;
  labelledBy?: string;
  onOverflowChange?: (overflow: { x: boolean; y: boolean }) => void;
}

/**
 * Rendered through Base UI's `render` prop so it receives the live overflow
 * state: `role="region"` and the accessible name are only present while the
 * viewport is scrollable (Primer / Carbon pattern). A named, focusable region
 * when nothing scrolls would be a pointless tab stop and landmark.
 */
function ViewportElement({
  state,
  userRender,
  label,
  labelledBy,
  onOverflowChange,
  ...props
}: ViewportElementProps) {
  const overflowing = state.hasOverflowX || state.hasOverflowY;
  const prevOverflow = React.useRef({ x: false, y: false });
  const warned = React.useRef(false);

  React.useEffect(() => {
    const prev = prevOverflow.current;
    if (prev.x !== state.hasOverflowX || prev.y !== state.hasOverflowY) {
      prevOverflow.current = { x: state.hasOverflowX, y: state.hasOverflowY };
      onOverflowChange?.(prevOverflow.current);
    }
  }, [state.hasOverflowX, state.hasOverflowY, onOverflowChange]);

  React.useEffect(() => {
    if (isDev && overflowing && !label && !labelledBy && !warned.current) {
      warned.current = true;
      console.warn(
        "[Southpaw] ScrollArea: scrollable regions are keyboard-focusable and need an accessible name. " +
          "Pass `aria-label` or `aria-labelledby`.",
      );
    }
  }, [overflowing, label, labelledBy]);

  const { ref, ...rest } = props;
  const finalProps = {
    ...rest,
    role: overflowing ? "region" : undefined,
    "aria-label": overflowing ? label : undefined,
    "aria-labelledby": overflowing ? labelledBy : undefined,
  };
  const isFn = typeof userRender === "function";

  // Element render (or none → <div>): Base UI's useRender merges props and refs
  // exactly as Base UI parts do. Base UI renders a <div> here by default too.
  const element = useRender({
    render: isFn ? undefined : (userRender as React.ReactElement | undefined),
    ref,
    props: finalProps,
    defaultTagName: "div",
    enabled: !isFn,
  });
  if (isFn) {
    return (userRender as Exclude<ViewportProps["render"], React.ReactElement | undefined>)(
      { ...finalProps, ref } as Parameters<
        Exclude<ViewportProps["render"], React.ReactElement | undefined>
      >[0],
      state,
    );
  }
  return element;
}

const Viewport = React.forwardRef<HTMLDivElement, ViewportProps>((ownProps, ownRef) => {
  const { scrollbars, edgeIndicator, viewportDefaults } = React.useContext(ScrollAreaContext);
  // Root-level defaults (composed mode), overridden by props set on Viewport
  const props: ViewportProps = { ...ownProps };
  if (viewportDefaults) {
    for (const [key, value] of Object.entries(viewportDefaults)) {
      if (key !== "viewportRef" && props[key as keyof ViewportProps] === undefined) {
        (props as Record<string, unknown>)[key] = value;
      }
    }
  }
  const rootViewportRef = viewportDefaults?.viewportRef;

  const {
    className,
    style,
    onScroll,
    "aria-label": label,
    "aria-labelledby": labelledBy,
    offsetScrollbars,
    maxHeight,
    maxWidth,
    overscrollBehavior = "auto",
    stickToBottom,
    startScrollPosition,
    onScrollPositionChange,
    onTopReached,
    onBottomReached,
    onLeftReached,
    onRightReached,
    onOverflowChange,
    actionsRef,
    render: userRender,
    ...rest
  } = props;

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const atBottomRef = React.useRef(true);
  const edgesRef = React.useRef({ top: true, bottom: false, left: true, right: false });
  const rtlRef = React.useRef(false);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      setRef(ownRef, node);
      setRef(rootViewportRef, node);
    },
    [ownRef, rootViewportRef],
  );

  // Start position + initial stick-to-bottom, before paint
  React.useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    rtlRef.current = getComputedStyle(el).direction === "rtl";
    if (startScrollPosition?.y !== undefined) el.scrollTop = startScrollPosition.y;
    if (startScrollPosition?.x !== undefined) el.scrollLeft = startScrollPosition.x;
    if (stickToBottom) el.scrollTop = el.scrollHeight;
    // Mount-only by design
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stick to bottom as content grows
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!stickToBottom || !el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (atBottomRef.current) el.scrollTop = el.scrollHeight;
    });
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [stickToBottom]);

  const handleScroll: NonNullable<ViewportProps["onScroll"]> = (event) => {
    onScroll?.(event);
    const el = event.currentTarget;
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;
    onScrollPositionChange?.({ x: scrollLeft, y: scrollTop });

    const absLeft = Math.abs(scrollLeft); // RTL scrollLeft is ≤ 0
    const atTop = scrollTop <= EDGE_TOLERANCE;
    const atBottom = scrollTop + clientHeight >= scrollHeight - EDGE_TOLERANCE;
    const atInlineStart = absLeft <= EDGE_TOLERANCE;
    const atInlineEnd = absLeft + clientWidth >= scrollWidth - EDGE_TOLERANCE;
    // Physical left/right (Mantine semantics), flipped in RTL
    const atLeft = rtlRef.current ? atInlineEnd : atInlineStart;
    const atRight = rtlRef.current ? atInlineStart : atInlineEnd;

    atBottomRef.current = atBottom;
    const prev = edgesRef.current;
    const hasY = scrollHeight > clientHeight;
    const hasX = scrollWidth > clientWidth;
    if (hasY && atTop && !prev.top) onTopReached?.();
    if (hasY && atBottom && !prev.bottom) onBottomReached?.();
    if (hasX && atLeft && !prev.left) onLeftReached?.();
    if (hasX && atRight && !prev.right) onRightReached?.();
    edgesRef.current = { top: atTop, bottom: atBottom, left: atLeft, right: atRight };
  };

  React.useImperativeHandle(
    actionsRef,
    (): ScrollAreaActions => ({
      getViewport: () => viewportRef.current,
      scrollTo: (options) => {
        viewportRef.current?.scrollTo({ ...options, behavior: resolveBehavior(options.behavior) });
      },
      scrollToTop: (behavior) => {
        viewportRef.current?.scrollTo({ top: 0, behavior: resolveBehavior(behavior) });
      },
      scrollToBottom: (behavior) => {
        const el = viewportRef.current;
        el?.scrollTo({ top: el.scrollHeight, behavior: resolveBehavior(behavior) });
      },
      scrollIntoView: (target, options = {}) => {
        const el = viewportRef.current;
        if (!el) return;
        const node = typeof target === "string" ? el.querySelector(target) : target;
        if (!node || !el.contains(node)) return;
        const { block = "nearest", inline = "nearest", behavior, offset } = options;
        const cs = getComputedStyle(el);
        const offsetY = offset ?? (parseFloat(cs.scrollPaddingTop) || 0);
        const offsetX = offset ?? (parseFloat(cs.scrollPaddingInlineStart) || 0);
        const vr = el.getBoundingClientRect();
        const tr = node.getBoundingClientRect();
        const top = tr.top - vr.top + el.scrollTop;
        const left = tr.left - vr.left + el.scrollLeft;
        el.scrollTo({
          top: alignOffset(top, tr.height, el.scrollTop, el.clientHeight, block, offsetY),
          left: alignOffset(left, tr.width, el.scrollLeft, el.clientWidth, inline, offsetX),
          behavior: resolveBehavior(behavior),
        });
      },
    }),
    [],
  );

  const fadeX = edgeIndicator === "fade" && scrollbars !== "y";
  const fadeY = edgeIndicator === "fade" && scrollbars !== "x";

  const viewportStyle: React.CSSProperties = {
    maxHeight,
    maxWidth,
    overscrollBehavior,
    ...(scrollbars === "y" && { overflowX: "hidden" }),
    ...(scrollbars === "x" && { overflowY: "hidden" }),
  };

  return (
    <BaseScrollArea.Viewport
      ref={setRefs}
      data-slot="scroll-area-viewport"
      className={cn(
        "size-full rounded-[inherit] outline-none",
        // Gutter so scrollbars don't cover content
        (offsetScrollbars === true || offsetScrollbars === "y") && "pe-[var(--sp-scrollbar-size)]",
        (offsetScrollbars === true || offsetScrollbars === "x") && "pb-[var(--sp-scrollbar-size)]",
        offsetScrollbars === "present" &&
          "data-[has-overflow-x]:pb-[var(--sp-scrollbar-size)] data-[has-overflow-y]:pe-[var(--sp-scrollbar-size)]",
        // Edge fades: masks driven by Base UI's distance-to-edge vars, capped at
        // --sp-scroll-area-fade-size. Horizontal mask flips in RTL.
        fadeY && FADE_Y,
        fadeX && FADE_X,
        // Keep focused / scrolled-to items out of the fade zone. Browsers honour
        // scroll-padding for focus navigation and native scrollIntoView too.
        fadeY && "scroll-py-[var(--sp-scroll-area-fade-size,2rem)]",
        fadeX && "scroll-px-[var(--sp-scroll-area-fade-size,2rem)]",
        fadeY && !fadeX && "[mask-image:var(--sp-mask-y)]",
        fadeX && !fadeY && "[mask-image:var(--sp-mask-x)]",
        fadeX &&
          fadeY &&
          "[mask-composite:intersect] [mask-image:var(--sp-mask-y),var(--sp-mask-x)]",
        className,
      )}
      style={withStyle(style, viewportStyle)}
      onScroll={handleScroll}
      render={(renderProps, state) => (
        <ViewportElement
          {...(renderProps as ViewportElementProps)}
          state={state}
          userRender={userRender}
          label={label}
          labelledBy={labelledBy}
          onOverflowChange={onOverflowChange}
        />
      )}
      {...rest}
    />
  );
});
Viewport.displayName = "ScrollArea.Viewport";

/* ============================================================
 * Content
 * ============================================================ */

const Content = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseScrollArea.Content>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Content
    ref={ref}
    data-slot="scroll-area-content"
    className={cn(className)}
    {...props}
  />
));
Content.displayName = "ScrollArea.Content";

/* ============================================================
 * Scrollbar
 * ============================================================ */

const visibilityClasses: Record<ScrollAreaType, string> = {
  auto: "",
  always: "",
  never: "hidden",
  // Fade out after --sp-scroll-hide-delay; fade in immediately
  hover: cn(
    "pointer-events-none opacity-0 delay-[var(--sp-scroll-hide-delay)]",
    "data-[hovering]:pointer-events-auto data-[hovering]:opacity-100 data-[hovering]:delay-0",
    "data-[scrolling]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:delay-0",
    "group-has-[>[data-slot=scroll-area-viewport]:focus-visible]/scroll-area:opacity-100 group-has-[>[data-slot=scroll-area-viewport]:focus-visible]/scroll-area:delay-0",
  ),
  scroll: cn(
    "pointer-events-none opacity-0 delay-[var(--sp-scroll-hide-delay)]",
    "data-[scrolling]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:delay-0",
    "group-has-[>[data-slot=scroll-area-viewport]:focus-visible]/scroll-area:opacity-100 group-has-[>[data-slot=scroll-area-viewport]:focus-visible]/scroll-area:delay-0",
  ),
};

const Scrollbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseScrollArea.Scrollbar>
>(({ className, keepMounted, children, ...props }, ref) => {
  const { type } = React.useContext(ScrollAreaContext);
  return (
    <BaseScrollArea.Scrollbar
      ref={ref}
      data-slot="scroll-area-scrollbar"
      keepMounted={keepMounted ?? type === "always"}
      className={cn(
        "z-[2] flex rounded-full p-0.5",
        "data-[orientation=vertical]:w-[var(--sp-scrollbar-size)]",
        "data-[orientation=horizontal]:h-[var(--sp-scrollbar-size)] data-[orientation=horizontal]:flex-col",
        // Track: persistent for `always` (like native overflow:scroll), else on direct hover
        type === "always" ? "bg-surface-sunken" : "hover:bg-surface-sunken",
        // No overflow on this axis (keepMounted): hide the thumb rather than draw a stub
        "data-[orientation=vertical]:not-data-[has-overflow-y]:*:invisible",
        "data-[orientation=horizontal]:not-data-[has-overflow-x]:*:invisible",
        "transition-[opacity,background-color] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)] motion-reduce:transition-none",
        visibilityClasses[type],
        className,
      )}
      {...props}
    >
      {children ?? <Thumb />}
    </BaseScrollArea.Scrollbar>
  );
});
Scrollbar.displayName = "ScrollArea.Scrollbar";

/* ============================================================
 * Thumb
 * ============================================================ */

const Thumb = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseScrollArea.Thumb>>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Thumb
      ref={ref}
      data-slot="scroll-area-thumb"
      className={cn(
        // --sp-border-control is ≥3:1 against surfaces (WCAG 1.4.11)
        "bg-border-control relative flex-1 rounded-full",
        "hover:bg-fg-muted active:bg-fg-muted data-[scrolling]:bg-fg-muted",
        "transition-colors duration-[var(--sp-duration-fast)] motion-reduce:transition-none",
        // Windows High Contrast: custom backgrounds are stripped — use a system colour
        "forced-colors:bg-[CanvasText] forced-colors:forced-color-adjust-none",
        className,
      )}
      {...props}
    />
  ),
);
Thumb.displayName = "ScrollArea.Thumb";

/* ============================================================
 * Corner
 * ============================================================ */

const Corner = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseScrollArea.Corner>>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Corner
      ref={ref}
      data-slot="scroll-area-corner"
      className={cn("bg-transparent", className)}
      {...props}
    />
  ),
);
Corner.displayName = "ScrollArea.Corner";

/* ============================================================
 * Compound export
 * ============================================================ */

export const ScrollArea = {
  Root,
  Viewport,
  Content,
  Scrollbar,
  Thumb,
  Corner,
};
