"use client";

import * as React from "react";
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";

/* ============================================================
 * Defaults
 *
 * Emil Kowalski: delay the first hover card so it isn't opened by a
 * pointer passing over a link, then open neighbours instantly with no
 * animation (PreviewCard.Group). Base UI's own defaults are 600 / 300ms.
 * Values and reasoning: RESEARCH.md "Delays".
 * ============================================================ */

const DEFAULT_DELAY = 500;
const DEFAULT_CLOSE_DELAY = 150;
/** After the last card closes, the group stays "warm" this long (matches Tooltip). */
const DEFAULT_GROUP_TIMEOUT = 400;
const DEFAULT_TOUCH_DELAY = 700; // matches Tooltip (MUI enterTouchDelay)
const TOUCH_MOVE_TOLERANCE = 10; // px — a scroll/drag cancels the long-press

/* ============================================================
 * Group — shared delays + warm group (Mantine HoverCard.Group)
 * ============================================================ */

interface GroupContextValue {
  delay: number;
  closeDelay: number;
  warm: boolean;
  /** A card opened: warm the group and close whichever card was open before. */
  notifyOpen: (id: string, closeInstantly: () => void) => void;
  notifyClose: (id: string) => void;
}

const GroupContext = React.createContext<GroupContextValue | null>(null);

export interface PreviewCardGroupProps {
  /** Open delay for the first card in the group (ms). @default 500 */
  delay?: number;
  /** Close delay for every card in the group (ms). @default 150 */
  closeDelay?: number;
  /** How long the group stays warm after the last card closes (ms). @default 400 */
  timeout?: number;
  children?: React.ReactNode;
}

/**
 * Shares delays across preview cards. Once one card has opened, moving to another
 * opens it with no delay and no animation, and the previous card closes instantly.
 */
function Group({
  delay = DEFAULT_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  timeout = DEFAULT_GROUP_TIMEOUT,
  children,
}: PreviewCardGroupProps) {
  const [warm, setWarm] = React.useState(false);
  const active = React.useRef<{ id: string; close: () => void } | null>(null);
  const cooldown = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(cooldown.current), []);

  const notifyOpen = React.useCallback((id: string, closeInstantly: () => void) => {
    clearTimeout(cooldown.current);
    const previous = active.current;
    active.current = { id, close: closeInstantly };
    if (previous && previous.id !== id) previous.close();
    setWarm(true);
  }, []);

  const notifyClose = React.useCallback(
    (id: string) => {
      if (active.current?.id === id) active.current = null;
      clearTimeout(cooldown.current);
      cooldown.current = setTimeout(() => {
        if (!active.current) setWarm(false);
      }, timeout);
    },
    [timeout],
  );

  const value = React.useMemo(
    () => ({ delay, closeDelay, warm, notifyOpen, notifyClose }),
    [delay, closeDelay, warm, notifyOpen, notifyClose],
  );
  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}
Group.displayName = "PreviewCard.Group";

/* ============================================================
 * Root
 * ============================================================ */

interface RootContextValue {
  handle: BasePreviewCard.Handle<unknown>;
  disabled: boolean;
  touch: boolean;
  touchDelay: number;
  density: string | undefined;
  /** A trigger reports its nearest [data-density] (covers `defaultOpen`, which fires no open event). */
  reportTrigger: (el: Element | null) => void;
  /** Open/close without animation (warm group, keyboard focus, group switch). */
  instant: boolean;
}

const RootContext = React.createContext<RootContextValue | null>(null);

/*
 * Detached triggers (rendered outside Root, linked by `handle`) can't read
 * RootContext, so Root also publishes its context against its handle
 * (same approach as Tooltip).
 */
type RegistryEntry = { ctx: RootContextValue | null; listeners: Set<() => void> };
const handleRegistry = new WeakMap<object, RegistryEntry>();

function getRegistryEntry(handle: object): RegistryEntry {
  let entry = handleRegistry.get(handle);
  if (!entry) {
    entry = { ctx: null, listeners: new Set() };
    handleRegistry.set(handle, entry);
  }
  return entry;
}

function publishHandleContext(handle: object, ctx: RootContextValue | null) {
  const entry = getRegistryEntry(handle);
  entry.ctx = ctx;
  entry.listeners.forEach((listener) => listener());
}

const noopSubscribe = () => () => {};

function useHandleContext(handle: object | undefined) {
  const subscribe = React.useCallback(
    (listener: () => void) => {
      if (!handle) return () => {};
      const entry = getRegistryEntry(handle);
      entry.listeners.add(listener);
      return () => {
        entry.listeners.delete(listener);
      };
    },
    [handle],
  );
  return React.useSyncExternalStore(
    handle ? subscribe : noopSubscribe,
    () => (handle ? getRegistryEntry(handle).ctx : null),
    () => null,
  );
}

export interface PreviewCardRootProps<Payload = unknown> extends BasePreviewCard.Root
  .Props<Payload> {
  /** Never open the card. The trigger stays a working link. @default false */
  disabled?: boolean;
  /**
   * Open on touch long-press (Mantine `events.touch`). Off by default: on touch
   * devices a long-press on a link opens the browser's own link menu, which this
   * suppresses for the trigger. A normal tap always follows the link.
   * @default false
   */
  touch?: boolean;
  /** Long-press duration before the card opens (ms). @default 700 */
  touchDelay?: number;
}

function Root<Payload = unknown>({
  disabled = false,
  touch = false,
  touchDelay = DEFAULT_TOUCH_DELAY,
  handle: handleProp,
  open: openProp,
  onOpenChange,
  actionsRef: actionsRefProp,
  ...props
}: PreviewCardRootProps<Payload>) {
  const group = React.useContext(GroupContext);
  const id = React.useId();
  const [ownHandle] = React.useState(() => BasePreviewCard.createHandle<Payload>());
  const typedHandle = handleProp ?? ownHandle;
  const handle = typedHandle as unknown as BasePreviewCard.Handle<unknown>;
  const ownActionsRef = React.useRef<BasePreviewCard.Root.Actions | null>(null);
  const actionsRef = actionsRefProp ?? ownActionsRef;
  const [density, setDensity] = React.useState<string | undefined>(undefined);
  const [instant, setInstant] = React.useState(false);

  const closeInstantly = React.useCallback(() => {
    setInstant(true);
    actionsRef.current?.close();
  }, [actionsRef]);

  const handleOpenChange = React.useCallback<
    NonNullable<BasePreviewCard.Root.Props<Payload>["onOpenChange"]>
  >(
    (open, details) => {
      if (open && disabled) {
        details.cancel();
        return;
      }
      if (open) {
        // Portalled content can't inherit data-density from the trigger's subtree.
        const source = details.trigger ?? null;
        setDensity(source?.closest("[data-density]")?.getAttribute("data-density") ?? undefined);
        // Keyboard-initiated or warm-group opens skip the animation (Emil).
        setInstant(details.reason === "trigger-focus" || !!group?.warm);
        group?.notifyOpen(id, closeInstantly);
      } else {
        if (details.reason === "escape-key") setInstant(true);
        group?.notifyClose(id);
      }
      onOpenChange?.(open, details);
    },
    [disabled, group, id, closeInstantly, onOpenChange],
  );

  const reportTrigger = React.useCallback((el: Element | null) => {
    setDensity(
      (current) =>
        current ?? el?.closest("[data-density]")?.getAttribute("data-density") ?? undefined,
    );
  }, []);

  const ctx = React.useMemo<RootContextValue>(
    () => ({ handle, disabled, touch, touchDelay, density, reportTrigger, instant }),
    [handle, disabled, touch, touchDelay, density, reportTrigger, instant],
  );

  React.useLayoutEffect(() => {
    publishHandleContext(handle, ctx);
  }, [handle, ctx]);
  React.useLayoutEffect(() => () => publishHandleContext(handle, null), [handle]);

  // If this card unmounts while open inside a Group, tell the Group, or it would
  // stay "warm" forever and every later card would skip the first-open delay.
  const notifyClose = group?.notifyClose;
  React.useEffect(() => () => notifyClose?.(id), [notifyClose, id]);

  return (
    <RootContext.Provider value={ctx}>
      <BasePreviewCard.Root<Payload>
        handle={typedHandle}
        actionsRef={actionsRef}
        open={disabled ? false : openProp}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </RootContext.Provider>
  );
}
Root.displayName = "PreviewCard.Root";

/* ============================================================
 * Trigger — a real link, styled as one
 * ============================================================ */

type TriggerProps = React.ComponentProps<typeof BasePreviewCard.Trigger>;
type TriggerTouchEvent = Parameters<NonNullable<TriggerProps["onTouchStart"]>>[0];
type TriggerMouseEvent = Parameters<NonNullable<TriggerProps["onContextMenu"]>>[0];

const Trigger = React.forwardRef<HTMLAnchorElement, TriggerProps>(
  (
    {
      className,
      id: idProp,
      delay: delayProp,
      closeDelay: closeDelayProp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      onContextMenu,
      onClick,
      ...props
    },
    ref,
  ) => {
    const group = React.useContext(GroupContext);
    // Inside Root → RootContext; detached (handle) → the Root published against that handle.
    const rootCtx = React.useContext(RootContext);
    const handleCtx = useHandleContext(props.handle as object | undefined);
    const ctx = rootCtx ?? handleCtx;
    const generatedId = React.useId();
    const triggerId = idProp ?? generatedId;
    const delay = delayProp ?? (group ? (group.warm ? 0 : group.delay) : DEFAULT_DELAY);
    const closeDelay = closeDelayProp ?? group?.closeDelay ?? DEFAULT_CLOSE_DELAY;

    const ownRef = React.useRef<HTMLAnchorElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLAnchorElement | null) => {
        ownRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );
    const reportTrigger = ctx?.reportTrigger;
    React.useLayoutEffect(() => {
      reportTrigger?.(ownRef.current);
    }, [reportTrigger]);

    const pressTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const startPoint = React.useRef<{ x: number; y: number } | null>(null);
    const longPressed = React.useRef(false);
    React.useEffect(() => () => clearTimeout(pressTimer.current), []);

    const touchEnabled = !!ctx?.touch && !ctx.disabled;
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
            // A long-press shows the card; don't also follow the link.
            if (longPressed.current) e.preventDefault();
          },
          onTouchCancel: (e: TriggerTouchEvent) => {
            onTouchCancel?.(e);
            cancelPress();
          },
          onContextMenu: (e: TriggerMouseEvent) => {
            onContextMenu?.(e);
            if (startPoint.current || longPressed.current) e.preventDefault();
          },
          onClick: (e: TriggerMouseEvent) => {
            onClick?.(e);
            // Some browsers still synthesise a click after a long-press.
            if (longPressed.current) {
              e.preventDefault();
              longPressed.current = false;
            }
          },
        }
      : { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, onContextMenu, onClick };

    return (
      <BasePreviewCard.Trigger
        ref={mergedRef}
        id={triggerId}
        delay={delay}
        closeDelay={closeDelay}
        data-slot="preview-card-trigger"
        className={mergeClassName(
          cn(
            "text-fg-default rounded-[2px] underline decoration-1 underline-offset-4",
            "decoration-[color-mix(in_oklab,var(--sp-fg-default)_40%,transparent)]",
            "transition-[text-decoration-color] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
            "hover:decoration-current data-[popup-open]:decoration-current",
            "focus-visible:sp-focus-ring outline-none",
            "forced-colors:decoration-[LinkText]",
            touchEnabled && "[-webkit-touch-callout:none]",
          ),
          className,
        )}
        {...touchHandlers}
        {...props}
      />
    );
  },
);
Trigger.displayName = "PreviewCard.Trigger";

/* ============================================================
 * Portal / Backdrop (pass-through)
 * ============================================================ */

const Portal = BasePreviewCard.Portal;
const Backdrop = BasePreviewCard.Backdrop;

/* ============================================================
 * Positioner
 * ============================================================ */

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BasePreviewCard.Positioner>
>(({ className, sideOffset = 8, collisionPadding = 8, ...props }, ref) => (
  <BasePreviewCard.Positioner
    ref={ref}
    data-slot="preview-card-positioner"
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    className={mergeClassName(
      cn(
        "z-50 outline-none",
        // Mantine hideDetached — hide when the trigger scrolls out of view.
        "data-[anchor-hidden]:invisible",
      ),
      className,
    )}
    {...props}
  />
));
Positioner.displayName = "PreviewCard.Positioner";

/* ============================================================
 * Popup
 * ============================================================ */

export type PreviewCardSize = "sm" | "md" | "lg";

const sizeClasses: Record<PreviewCardSize, string> = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
};

export interface PreviewCardPopupProps extends React.ComponentProps<typeof BasePreviewCard.Popup> {
  /** Width: sm 256px, md 320px, lg 384px. Never wider than the viewport allows. @default "md" */
  size?: PreviewCardSize;
}

const Popup = React.forwardRef<HTMLDivElement, PreviewCardPopupProps>(
  ({ className, size = "md", ...props }, ref) => {
    const ctx = React.useContext(RootContext);
    return (
      <BasePreviewCard.Popup
        ref={ref}
        data-slot="preview-card-popup"
        data-size={size}
        data-density={ctx?.density}
        data-instant={ctx?.instant ? "" : undefined}
        className={mergeClassName(
          cn(
            "bg-surface-overlay border-border-default text-fg-default rounded-[var(--radius-DEFAULT)] border shadow-lg outline-none",
            "max-w-[var(--available-width)]",
            sizeClasses[size],
            "flex flex-col gap-[var(--sp-control-gap)] p-[calc(var(--sp-control-gap)*2)]",
            "forced-colors:border-[CanvasText]",
            // Motion (Emil): small popover 200ms in, faster out, scale from the trigger, ease-out.
            "origin-[var(--transform-origin)]",
            "transition-[transform,opacity] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
            "data-[ending-style]:duration-[var(--sp-duration-fast)]",
            "data-[starting-style]:scale-[var(--sp-scale-press)] data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-[var(--sp-scale-press)] data-[ending-style]:opacity-0",
            "data-[instant]:duration-0",
          ),
          className,
        )}
        {...props}
      />
    );
  },
);
Popup.displayName = "PreviewCard.Popup";

/* ============================================================
 * Viewport — cross-fades content when one card serves several triggers
 * ============================================================ */

const Viewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BasePreviewCard.Viewport>
>(({ className, ...props }, ref) => (
  <BasePreviewCard.Viewport
    ref={ref}
    data-slot="preview-card-viewport"
    className={mergeClassName(
      cn(
        "relative",
        "[&_[data-previous]]:absolute [&_[data-previous]]:inset-0",
        "[&_[data-current]]:transition-opacity [&_[data-previous]]:transition-opacity",
        "[&_[data-current]]:duration-[var(--sp-duration-fast)] [&_[data-previous]]:duration-[var(--sp-duration-fast)]",
        "[&_[data-current][data-starting-style]]:opacity-0 [&_[data-previous][data-ending-style]]:opacity-0",
        "data-[instant]:[&_*]:duration-0",
      ),
      className,
    )}
    {...props}
  />
));
Viewport.displayName = "PreviewCard.Viewport";

/* ============================================================
 * Arrow — bordered caret in the popup colours (matches Popover)
 * ============================================================ */

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BasePreviewCard.Arrow>>(
  ({ className, ...props }, ref) => (
    <BasePreviewCard.Arrow
      ref={ref}
      data-slot="preview-card-arrow"
      className={mergeClassName(
        cn(
          "forced-colors:hidden",
          "data-[side=bottom]:top-[-5px] data-[side=left]:right-[-5px] data-[side=right]:left-[-5px] data-[side=top]:bottom-[-5px]",
          "data-[side=inline-end]:left-[-5px] data-[side=inline-start]:right-[-5px]",
        ),
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "bg-surface-overlay border-border-default block size-2.5 rotate-45 border",
          "[[data-side=bottom]>&]:border-b-0 [[data-side=bottom]>&]:border-r-0",
          "[[data-side=top]>&]:border-l-0 [[data-side=top]>&]:border-t-0",
          "[[data-side=left]>&]:border-b-0 [[data-side=left]>&]:border-l-0",
          "[[data-side=right]>&]:border-r-0 [[data-side=right]>&]:border-t-0",
        )}
      />
    </BasePreviewCard.Arrow>
  ),
);
Arrow.displayName = "PreviewCard.Arrow";

/* ============================================================
 * Content — Portal + Positioner + Popup + Arrow in one part
 * ============================================================ */

type PositionerProps = React.ComponentProps<typeof BasePreviewCard.Positioner>;

export interface PreviewCardContentProps extends PreviewCardPopupProps {
  side?: PositionerProps["side"];
  align?: PositionerProps["align"];
  sideOffset?: PositionerProps["sideOffset"];
  alignOffset?: PositionerProps["alignOffset"];
  collisionPadding?: PositionerProps["collisionPadding"];
  /** Show the caret pointing at the trigger. @default false */
  arrow?: boolean;
  /** Keep the popup in the DOM while closed. @default false */
  keepMounted?: boolean;
  /** Portal container. @default document.body */
  container?: React.ComponentProps<typeof BasePreviewCard.Portal>["container"];
  /** Any other Positioner props. */
  positionerProps?: Omit<PositionerProps, "children">;
}

const Content = React.forwardRef<HTMLDivElement, PreviewCardContentProps>(
  (
    {
      side,
      align,
      sideOffset,
      alignOffset,
      collisionPadding,
      arrow = false,
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
          {arrow && <Arrow />}
          {children}
        </Popup>
      </Positioner>
    </Portal>
  ),
);
Content.displayName = "PreviewCard.Content";

/* ============================================================
 * Layout parts — Media, Title, Description
 * ============================================================ */

/** A 16:9 media area for a link preview image. */
const Media = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="preview-card-media"
      className={mergeClassName(
        cn(
          "bg-surface-sunken aspect-video overflow-hidden rounded-[calc(var(--radius-DEFAULT)-4px)]",
          "[&>img]:size-full [&>img]:object-cover",
        ),
        className,
      )}
      {...props}
    />
  ),
);
Media.displayName = "PreviewCard.Media";

const Title = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="preview-card-title"
      className={mergeClassName(cn("text-fg-default text-sm font-semibold"), className)}
      {...props}
    />
  ),
);
Title.displayName = "PreviewCard.Title";

const Description = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="preview-card-description"
      className={mergeClassName(cn("text-fg-muted text-sm"), className)}
      {...props}
    />
  ),
);
Description.displayName = "PreviewCard.Description";

/* ============================================================
 * Export
 * ============================================================ */

// Parts for the server-safe namespace in ./PreviewCard (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
const PreviewCardCreateHandle = BasePreviewCard.createHandle;
export {
  Group as PreviewCardGroup,
  Root as PreviewCardRoot,
  Trigger as PreviewCardTrigger,
  Portal as PreviewCardPortal,
  Backdrop as PreviewCardBackdrop,
  Positioner as PreviewCardPositioner,
  Popup as PreviewCardPopup,
  Viewport as PreviewCardViewport,
  Arrow as PreviewCardArrow,
  Content as PreviewCardContent,
  Media as PreviewCardMedia,
  Title as PreviewCardTitle,
  Description as PreviewCardDescription,
  PreviewCardCreateHandle,
};

export { DEFAULT_DELAY, DEFAULT_CLOSE_DELAY, DEFAULT_GROUP_TIMEOUT };
