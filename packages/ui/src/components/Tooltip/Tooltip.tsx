import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { CheckCircleIcon, InfoIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Defaults
 *
 * Emil Kowalski: delay the first tooltip to prevent accidental
 * activation, then open neighbours instantly with no animation.
 * Base UI's Provider handles the "warm" group; [data-instant]
 * removes the transition (also set on keyboard focus).
 * ============================================================ */

const DEFAULT_DELAY = 300;
const DEFAULT_CLOSE_DELAY = 0;
const DEFAULT_TIMEOUT = 400;
const DEFAULT_TOUCH_DELAY = 700; // MUI enterTouchDelay
const DEFAULT_TOUCH_CLOSE_DELAY = 1500; // MUI leaveTouchDelay
const TOUCH_MOVE_TOLERANCE = 10; // px — a scroll/drag cancels the long-press

/* ============================================================
 * Contexts
 * ============================================================ */

const ProviderPresenceContext = React.createContext(false);

type TooltipType = "description" | "label";

interface RootContextValue {
  popupId: string;
  type: TooltipType;
  triggerRef: React.RefObject<HTMLElement | null>;
  touch: boolean;
  touchDelay: number;
  touchCloseDelay: number;
  handle: BaseTooltip.Handle<unknown>;
  density: string | undefined;
}

const RootContext = React.createContext<RootContextValue | null>(null);

function useRootContext() {
  return React.useContext(RootContext);
}

/* ============================================================
 * Provider — shared delays + warm group
 * ============================================================ */

type ProviderProps = React.ComponentProps<typeof BaseTooltip.Provider>;

function Provider({
  delay = DEFAULT_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  timeout = DEFAULT_TIMEOUT,
  ...props
}: ProviderProps) {
  return (
    <ProviderPresenceContext.Provider value={true}>
      <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout} {...props} />
    </ProviderPresenceContext.Provider>
  );
}
Provider.displayName = "Tooltip.Provider";

/* ============================================================
 * Root
 * ============================================================ */

type BaseRootProps = React.ComponentProps<typeof BaseTooltip.Root>;

interface RootProps extends BaseRootProps {
  /**
   * How the tooltip text relates to the trigger for assistive tech.
   * - `description` (default): `aria-describedby`, supplementary info.
   * - `label`: `aria-labelledby`, the tooltip IS the trigger's name.
   *   Use for icon-only buttons with no other visible label.
   * @default "description"
   */
  type?: TooltipType;
  /**
   * Show the tooltip on touch long-press (MUI behaviour).
   * Base UI never opens tooltips on touch by default.
   * @default true
   */
  touch?: boolean;
  /** Long-press duration before the tooltip shows (ms). @default 700 */
  touchDelay?: number;
  /** How long the tooltip stays visible after the finger lifts (ms). @default 1500 */
  touchCloseDelay?: number;
}

function Root({
  type = "description",
  touch = true,
  touchDelay = DEFAULT_TOUCH_DELAY,
  touchCloseDelay = DEFAULT_TOUCH_CLOSE_DELAY,
  handle: handleProp,
  onOpenChange,
  ...props
}: RootProps) {
  const popupId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const [ownHandle] = React.useState(() => BaseTooltip.createHandle());
  const handle = (handleProp ?? ownHandle) as BaseTooltip.Handle<unknown>;
  const hasProvider = React.useContext(ProviderPresenceContext);

  // Portalled content can't inherit data-density from the trigger's subtree,
  // so read it from the trigger (or the active trigger) and forward it.
  const [density, setDensity] = React.useState<string | undefined>(undefined);
  const readDensity = React.useCallback((el?: Element | null) => {
    const source = el ?? triggerRef.current;
    setDensity(source?.closest("[data-density]")?.getAttribute("data-density") ?? undefined);
  }, []);
  React.useLayoutEffect(() => readDensity(), [readDensity]);

  const handleOpenChange = React.useCallback<NonNullable<BaseRootProps["onOpenChange"]>>(
    (open, details) => {
      if (open) readDensity(details.trigger);
      onOpenChange?.(open, details);
    },
    [onOpenChange, readDensity],
  );

  const ctx = React.useMemo<RootContextValue>(
    () => ({ popupId, type, triggerRef, touch, touchDelay, touchCloseDelay, handle, density }),
    [popupId, type, touch, touchDelay, touchCloseDelay, handle, density],
  );

  const root = (
    <RootContext.Provider value={ctx}>
      <BaseTooltip.Root
        handle={handle as BaseRootProps["handle"]}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </RootContext.Provider>
  );

  // A standalone tooltip still gets Southpaw's default delays.
  return hasProvider ? root : <Provider>{root}</Provider>;
}
Root.displayName = "Tooltip.Root";

/* ============================================================
 * Trigger — unstyled (consumer renders a Button via `render`)
 * Adds ARIA wiring + touch long-press.
 * ============================================================ */

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

type TriggerProps = React.ComponentProps<typeof BaseTooltip.Trigger>;
type TriggerTouchEvent = Parameters<NonNullable<TriggerProps["onTouchStart"]>>[0];
type TriggerMouseEvent = Parameters<NonNullable<TriggerProps["onContextMenu"]>>[0];

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  (
    {
      className,
      id: idProp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      onContextMenu,
      ...props
    },
    ref,
  ) => {
    const ctx = useRootContext();
    const generatedId = React.useId();
    const triggerId = idProp ?? generatedId;

    const pressTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const closeTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const startPoint = React.useRef<{ x: number; y: number } | null>(null);
    const longPressed = React.useRef(false);

    React.useEffect(
      () => () => {
        clearTimeout(pressTimer.current);
        clearTimeout(closeTimer.current);
      },
      [],
    );

    const touchEnabled = !!ctx?.touch && !props.disabled;

    const cancelPress = () => {
      clearTimeout(pressTimer.current);
      startPoint.current = null;
    };

    const touchHandlers = touchEnabled
      ? {
          onTouchStart: (e: TriggerTouchEvent) => {
            onTouchStart?.(e);
            const t = e.touches[0];
            if (!t || e.touches.length > 1) return;
            longPressed.current = false;
            startPoint.current = { x: t.clientX, y: t.clientY };
            clearTimeout(closeTimer.current);
            clearTimeout(pressTimer.current);
            pressTimer.current = setTimeout(() => {
              longPressed.current = true;
              ctx.handle.open(triggerId);
            }, ctx.touchDelay);
          },
          onTouchMove: (e: TriggerTouchEvent) => {
            onTouchMove?.(e);
            const t = e.touches[0];
            if (!t || !startPoint.current) return;
            const dx = t.clientX - startPoint.current.x;
            const dy = t.clientY - startPoint.current.y;
            if (Math.hypot(dx, dy) > TOUCH_MOVE_TOLERANCE) cancelPress();
          },
          onTouchEnd: (e: TriggerTouchEvent) => {
            onTouchEnd?.(e);
            cancelPress();
            if (longPressed.current) {
              // Swallow the synthetic click so a long-press doesn't also activate the button.
              e.preventDefault();
              closeTimer.current = setTimeout(() => ctx.handle.close(), ctx.touchCloseDelay);
            }
          },
          onTouchCancel: (e: TriggerTouchEvent) => {
            onTouchCancel?.(e);
            cancelPress();
          },
          onContextMenu: (e: TriggerMouseEvent) => {
            onContextMenu?.(e);
            // Android fires contextmenu on long-press; don't show the native menu over the tooltip.
            if (startPoint.current || longPressed.current) e.preventDefault();
          },
        }
      : { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, onContextMenu };

    const ariaProps = ctx
      ? ctx.type === "label"
        ? { "aria-labelledby": ctx.popupId }
        : { "aria-describedby": ctx.popupId }
      : {};

    return (
      <BaseTooltip.Trigger
        ref={mergeRefs(ref, ctx?.triggerRef as React.Ref<HTMLButtonElement>)}
        id={triggerId}
        data-slot="tooltip-trigger"
        className={cn(touchEnabled && "select-none [-webkit-touch-callout:none]", className)}
        {...ariaProps}
        {...touchHandlers}
        {...props}
      />
    );
  },
);
Trigger.displayName = "Tooltip.Trigger";

/* ============================================================
 * Portal — keepMounted by default so aria-describedby /
 * aria-labelledby always resolve (the popup is `hidden` when closed).
 * ============================================================ */

function Portal({ keepMounted = true, ...props }: React.ComponentProps<typeof BaseTooltip.Portal>) {
  return <BaseTooltip.Portal keepMounted={keepMounted} {...props} />;
}
Portal.displayName = "Tooltip.Portal";

/* ============================================================
 * Positioner
 * ============================================================ */

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseTooltip.Positioner>
>(({ className, sideOffset = 6, collisionPadding = 8, ...props }, ref) => (
  <BaseTooltip.Positioner
    ref={ref}
    data-slot="tooltip-positioner"
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    className={cn(
      "z-50 outline-none",
      // Mantine hideDetached — hide when the trigger scrolls out of view
      "data-[anchor-hidden]:invisible",
      className,
    )}
    {...props}
  />
));
Positioner.displayName = "Tooltip.Positioner";

/* ============================================================
 * Popup
 * ============================================================ */

type Variant = "neutral" | "info" | "success" | "danger";

const variantClasses: Record<Variant, string> = {
  // Inverse surface: dark on light, light on dark, black on white in HC
  neutral: "[--sp-tooltip-bg:var(--sp-fg-default)] [--sp-tooltip-fg:var(--sp-surface-base)]",
  info: "[--sp-tooltip-bg:var(--sp-info)] [--sp-tooltip-fg:var(--sp-fg-on-info)]",
  success: "[--sp-tooltip-bg:var(--sp-success)] [--sp-tooltip-fg:var(--sp-fg-on-success)]",
  danger: "[--sp-tooltip-bg:var(--sp-danger)] [--sp-tooltip-fg:var(--sp-fg-on-danger)]",
};

const variantIcons: Record<Variant, React.ElementType | null> = {
  neutral: null,
  info: InfoIcon,
  success: CheckCircleIcon,
  danger: WarningCircleIcon,
};

interface PopupProps extends React.ComponentProps<typeof BaseTooltip.Popup> {
  /** Colour intent. @default "neutral" */
  variant?: Variant;
  /** Show the intent icon (Spectrum `showIcon`). Ignored for `neutral`. */
  showIcon?: boolean;
}

const Popup = React.forwardRef<HTMLDivElement, PopupProps>(
  ({ className, variant = "neutral", showIcon, children, ...props }, ref) => {
    const ctx = useRootContext();
    const density = ctx?.density;
    const Icon = showIcon ? variantIcons[variant] : null;

    return (
      <BaseTooltip.Popup
        ref={ref}
        id={ctx?.popupId}
        role="tooltip"
        data-slot="tooltip-popup"
        data-variant={variant}
        data-density={density}
        className={cn(
          variantClasses[variant],
          "bg-[var(--sp-tooltip-bg)] text-[var(--sp-tooltip-fg)]",
          "flex max-w-xs items-start rounded-[var(--radius-sm)] shadow-md",
          // Transparent border becomes visible in Windows forced-colours (bg is overridden there)
          "border border-transparent forced-colors:border-[CanvasText]",
          // Density-aware type + spacing
          "gap-1.5 px-2 py-1 text-sm leading-snug",
          "data-[density=compact]:gap-1 data-[density=compact]:px-1.5 data-[density=compact]:py-0.5 data-[density=compact]:text-xs",
          "data-[density=comfortable]:gap-2 data-[density=comfortable]:px-3 data-[density=comfortable]:py-1.5",
          // Motion (Emil): 125ms, scale 0.97 → 1 from the trigger, strong ease-out
          "origin-[var(--transform-origin)]",
          "transition-[opacity,scale] duration-[var(--sp-duration-press)] ease-[var(--sp-easing-default)]",
          "data-[starting-style]:scale-[var(--sp-scale-press)] data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-[var(--sp-scale-press)] data-[ending-style]:opacity-0",
          // Warm group, keyboard focus, dismiss → no animation
          "data-[instant]:duration-0",
          className,
        )}
        {...props}
      >
        {Icon && (
          <Icon
            aria-hidden="true"
            data-slot="tooltip-icon"
            weight="fill"
            className="mt-[0.1em] size-[1.15em] shrink-0"
          />
        )}
        {children}
      </BaseTooltip.Popup>
    );
  },
);
Popup.displayName = "Tooltip.Popup";

/* ============================================================
 * Arrow — rotated square, inherits the popup's variant colour
 * ============================================================ */

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseTooltip.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseTooltip.Arrow
      ref={ref}
      data-slot="tooltip-arrow"
      aria-hidden="true"
      className={cn(
        "size-2 rotate-45 bg-[var(--sp-tooltip-bg)] forced-colors:hidden",
        "data-[side=bottom]:-top-1 data-[side=top]:-bottom-1",
        "data-[side=left]:-right-1 data-[side=right]:-left-1",
        "data-[side=inline-end]:-left-1 data-[side=inline-start]:-right-1",
        className,
      )}
      {...props}
    />
  ),
);
Arrow.displayName = "Tooltip.Arrow";

/* ============================================================
 * Shortcut — keyboard hint (Primer keybindingHint, shadcn).
 * Will switch to the Kbd component once GEO-940 lands.
 * ============================================================ */

const Shortcut = React.forwardRef<HTMLElement, React.ComponentProps<"kbd">>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      data-slot="tooltip-shortcut"
      className={cn(
        "ms-1 inline-flex items-center rounded-[calc(var(--radius-sm)-2px)] px-1",
        "border-current/30 border font-sans text-[0.85em] leading-tight opacity-80",
        className,
      )}
      {...props}
    />
  ),
);
Shortcut.displayName = "Tooltip.Shortcut";

/* ============================================================
 * Viewport (pass-through — animate content between triggers)
 * ============================================================ */

const Viewport = BaseTooltip.Viewport;

/* ============================================================
 * Content — convenience: Portal + Positioner + Popup + Arrow
 * ============================================================ */

type PositionerProps = React.ComponentProps<typeof BaseTooltip.Positioner>;

interface ContentProps extends PopupProps {
  side?: PositionerProps["side"];
  align?: PositionerProps["align"];
  sideOffset?: PositionerProps["sideOffset"];
  alignOffset?: PositionerProps["alignOffset"];
  collisionPadding?: PositionerProps["collisionPadding"];
  /** Show the arrow. @default true */
  arrow?: boolean;
  /** Keep the popup in the DOM while closed (needed for ARIA wiring). @default true */
  keepMounted?: boolean;
  /** Portal container. */
  container?: React.ComponentProps<typeof BaseTooltip.Portal>["container"];
  /** Extra props for the positioner. */
  positionerProps?: Omit<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset">;
}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  (
    {
      side = "top",
      align = "center",
      sideOffset,
      alignOffset,
      collisionPadding,
      arrow = true,
      keepMounted,
      container,
      positionerProps,
      children,
      ...popupProps
    },
    ref,
  ) => (
    <Portal keepMounted={keepMounted} container={container}>
      <Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        {...positionerProps}
      >
        <Popup ref={ref} {...popupProps}>
          {children}
          {arrow && <Arrow />}
        </Popup>
      </Positioner>
    </Portal>
  ),
);
Content.displayName = "Tooltip.Content";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Tooltip = {
  Provider,
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Shortcut,
  Viewport,
  Content,
  createHandle: BaseTooltip.createHandle,
};

export type {
  RootProps as TooltipRootProps,
  PopupProps as TooltipPopupProps,
  ContentProps as TooltipContentProps,
};
