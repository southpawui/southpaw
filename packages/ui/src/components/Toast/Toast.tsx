import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { Spinner } from "../Spinner/Spinner";
import { cn } from "../../lib/cn";

/* ============================================================
 * Types
 * ============================================================ */

export type ToastType = "neutral" | "info" | "success" | "warning" | "danger" | "loading";
export type ToastAppearance = "subtle" | "solid";
export type ToastPosition =
  "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type SwipeDirection = "up" | "down" | "left" | "right";

export interface ToastButtonOptions {
  /** Visible button text. Keep it to one or two words (Carbon). */
  label: string;
  /** Call `event.preventDefault()` to keep the toast open after the click. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Southpaw-specific data carried on each toast (Base UI `data`). */
export interface ToastData {
  appearance?: ToastAppearance;
  /** Custom icon, or `false` to hide the intent icon. */
  icon?: React.ReactNode | false;
  /** Secondary "cancel" button. Always closes the toast. */
  cancel?: ToastButtonOptions;
  /** Small caption under the description, e.g. a timestamp (Carbon). */
  caption?: React.ReactNode;
  /** Show a bar counting down the remaining time (Mantine, Ant). */
  showProgress?: boolean;
}

export type ToastObject = BaseToast.Root.ToastObject<ToastData>;
export type ToastManager = ReturnType<typeof BaseToast.createToastManager<ToastData>>;

/* ============================================================
 * Defaults
 * ============================================================ */

/** Spectrum's minimum; Base UI's default. */
export const DEFAULT_TIMEOUT = 5000;
export const DEFAULT_LIMIT = 3;
const DEFAULT_CLOSE_LABEL = "Dismiss notification";

const swipeFor: Record<ToastPosition, SwipeDirection[]> = {
  "top-left": ["up", "left"],
  "top-center": ["up"],
  "top-right": ["up", "right"],
  "bottom-left": ["down", "left"],
  "bottom-center": ["down"],
  "bottom-right": ["down", "right"],
};

/* ============================================================
 * Viewport context — position, expand, defaults for children
 * ============================================================ */

interface ViewportContextValue {
  position: ToastPosition;
  expand: boolean;
  appearance: ToastAppearance;
  timeout: number;
  showProgress: boolean;
}

const ViewportContext = React.createContext<ViewportContextValue>({
  position: "bottom-right",
  expand: false,
  appearance: "subtle",
  timeout: DEFAULT_TIMEOUT,
  showProgress: false,
});

interface ToastItemContextValue {
  toast: ToastObject;
  type: ToastType;
  appearance: ToastAppearance;
}

const ToastItemContext = React.createContext<ToastItemContextValue | null>(null);

/** Normalises Base UI's free-form `type` to a Southpaw type. */
function toType(type: string | undefined): ToastType {
  switch (type) {
    case "info":
    case "success":
    case "warning":
    case "danger":
    case "loading":
      return type;
    case "error":
      return "danger";
    default:
      return "neutral";
  }
}

/* ============================================================
 * Provider
 * ============================================================ */

export type ToastProviderProps = React.ComponentProps<typeof BaseToast.Provider>;

/** Base UI Provider with Southpaw defaults (5000ms timeout, 3 visible). */
function Provider({
  timeout = DEFAULT_TIMEOUT,
  limit = DEFAULT_LIMIT,
  ...props
}: ToastProviderProps) {
  return <BaseToast.Provider timeout={timeout} limit={limit} {...props} />;
}

const Portal = BaseToast.Portal;

/* ============================================================
 * Viewport
 * ============================================================ */

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 sm:top-6 sm:left-6",
  "top-center": "top-4 sm:top-6 sm:left-1/2 sm:-translate-x-1/2",
  "top-right": "top-4 sm:top-6 sm:right-6",
  "bottom-left": "bottom-4 sm:bottom-6 sm:left-6",
  "bottom-center": "bottom-4 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2",
  "bottom-right": "bottom-4 sm:bottom-6 sm:right-6",
};

export interface ToastViewportProps extends React.ComponentProps<typeof BaseToast.Viewport> {
  /** Corner or edge the toasts stack from. @default "bottom-right" */
  position?: ToastPosition;
  /** Always show every toast instead of a collapsed stack (Sonner `expand`). @default false */
  expand?: boolean;
  /** Default appearance for toasts that don't set one. @default "subtle" */
  appearance?: ToastAppearance;
  /** Default progress bar setting for toasts that don't set one. @default false */
  showProgress?: boolean;
  /** Timeout used by the progress bar when a toast has none. Match the Provider's. */
  timeout?: number;
  /** Density for the portalled toasts (they can't inherit it from your layout). */
  density?: "compact" | "default" | "comfortable";
}

const Viewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  (
    {
      className,
      position = "bottom-right",
      expand = false,
      appearance = "subtle",
      showProgress = false,
      timeout = DEFAULT_TIMEOUT,
      density,
      ...props
    },
    ref,
  ) => {
    const side = position.startsWith("top") ? "top" : "bottom";
    const value = React.useMemo(
      () => ({ position, expand, appearance, timeout, showProgress }),
      [position, expand, appearance, timeout, showProgress],
    );
    return (
      <ViewportContext.Provider value={value}>
        <BaseToast.Viewport
          ref={ref}
          data-slot="toast-viewport"
          data-position={position}
          data-side={side}
          data-expand={expand ? "" : undefined}
          data-density={density}
          className={cn(
            "group/toast-viewport fixed inset-x-4 z-50 outline-none sm:inset-x-auto sm:w-[22.5rem]",
            // +1 stacks downwards from the top edge, -1 upwards from the bottom edge.
            side === "top" ? "[--sp-toast-dir:1]" : "[--sp-toast-dir:-1]",
            expand && "flex gap-3",
            expand && (side === "top" ? "flex-col" : "flex-col-reverse"),
            positionClasses[position],
            className,
          )}
          {...props}
        />
      </ViewportContext.Provider>
    );
  },
);
Viewport.displayName = "Toast.Viewport";

/* ============================================================
 * Root — the toast card
 * ============================================================ */

const intentClasses: Record<ToastType, Record<ToastAppearance, string>> = {
  neutral: {
    subtle:
      "[--sp-toast-bg:var(--sp-surface-overlay)] [--sp-toast-border:var(--sp-border-control)] [--sp-toast-fg:var(--sp-fg-default)] [--sp-toast-muted:var(--sp-fg-muted)] [--sp-toast-icon:var(--sp-fg-muted)]",
    solid:
      "[--sp-toast-bg:var(--sp-fg-default)] [--sp-toast-border:var(--sp-fg-default)] [--sp-toast-fg:var(--sp-surface-base)] [--sp-toast-muted:var(--sp-surface-base)] [--sp-toast-icon:var(--sp-surface-base)]",
  },
  loading: {
    subtle:
      "[--sp-toast-bg:var(--sp-surface-overlay)] [--sp-toast-border:var(--sp-border-control)] [--sp-toast-fg:var(--sp-fg-default)] [--sp-toast-muted:var(--sp-fg-muted)] [--sp-toast-icon:var(--sp-fg-muted)]",
    solid:
      "[--sp-toast-bg:var(--sp-fg-default)] [--sp-toast-border:var(--sp-fg-default)] [--sp-toast-fg:var(--sp-surface-base)] [--sp-toast-muted:var(--sp-surface-base)] [--sp-toast-icon:var(--sp-surface-base)]",
  },
  info: {
    subtle:
      "[--sp-toast-bg:var(--sp-info-subtle)] [--sp-toast-border:var(--sp-info)] [--sp-toast-fg:var(--sp-fg-default)] [--sp-toast-muted:var(--sp-fg-muted)] [--sp-toast-icon:var(--sp-info)]",
    solid:
      "[--sp-toast-bg:var(--sp-info)] [--sp-toast-border:var(--sp-info)] [--sp-toast-fg:var(--sp-fg-on-info)] [--sp-toast-muted:var(--sp-fg-on-info)] [--sp-toast-icon:var(--sp-fg-on-info)]",
  },
  success: {
    subtle:
      "[--sp-toast-bg:var(--sp-success-subtle)] [--sp-toast-border:var(--sp-success)] [--sp-toast-fg:var(--sp-fg-default)] [--sp-toast-muted:var(--sp-fg-muted)] [--sp-toast-icon:var(--sp-success)]",
    solid:
      "[--sp-toast-bg:var(--sp-success)] [--sp-toast-border:var(--sp-success)] [--sp-toast-fg:var(--sp-fg-on-success)] [--sp-toast-muted:var(--sp-fg-on-success)] [--sp-toast-icon:var(--sp-fg-on-success)]",
  },
  warning: {
    subtle:
      "[--sp-toast-bg:var(--sp-warning-subtle)] [--sp-toast-border:var(--sp-warning)] [--sp-toast-fg:var(--sp-fg-default)] [--sp-toast-muted:var(--sp-fg-muted)] [--sp-toast-icon:var(--sp-warning)]",
    solid:
      "[--sp-toast-bg:var(--sp-warning)] [--sp-toast-border:var(--sp-warning)] [--sp-toast-fg:var(--sp-fg-on-warning)] [--sp-toast-muted:var(--sp-fg-on-warning)] [--sp-toast-icon:var(--sp-fg-on-warning)]",
  },
  danger: {
    subtle:
      "[--sp-toast-bg:var(--sp-danger-subtle)] [--sp-toast-border:var(--sp-danger)] [--sp-toast-fg:var(--sp-fg-default)] [--sp-toast-muted:var(--sp-fg-muted)] [--sp-toast-icon:var(--sp-danger)]",
    solid:
      "[--sp-toast-bg:var(--sp-danger)] [--sp-toast-border:var(--sp-danger)] [--sp-toast-fg:var(--sp-fg-on-danger)] [--sp-toast-muted:var(--sp-fg-on-danger)] [--sp-toast-icon:var(--sp-fg-on-danger)]",
  },
};

// Collapsed stack geometry (Emil/Sonner): each toast behind the front one is
// scaled down and peeks out. Base UI provides --toast-index / --toast-offset-y /
// --toast-height / --toast-frontmost-height / --toast-swipe-movement-*.
const stackClasses = cn(
  "absolute inset-x-0 z-[calc(1000-var(--toast-index))]",
  "group-data-[side=top]/toast-viewport:top-0 group-data-[side=top]/toast-viewport:origin-top",
  "group-data-[side=bottom]/toast-viewport:bottom-0 group-data-[side=bottom]/toast-viewport:origin-bottom",
  "[--gap:0.75rem] [--peek:0.625rem]",
  "[--scale:calc(max(0,1-(var(--toast-index)*0.05)))] [--shrink:calc(1-var(--scale))]",
  "[--height:var(--toast-frontmost-height,var(--toast-height))]",
  "[--s:var(--scale)]",
  "[--y:calc(var(--toast-swipe-movement-y)+var(--sp-toast-dir)*(var(--toast-index)*var(--peek)+var(--shrink)*var(--height)))]",
  "h-[var(--height)]",
  // Expanded on hover/focus: full height, laid out with a gap.
  "data-[expanded]:h-[var(--toast-height)] data-[expanded]:[--s:1]",
  "data-[expanded]:[--y:calc(var(--sp-toast-dir)*(var(--toast-offset-y)+var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
  // Hover bridge across the gap so the stack doesn't collapse between toasts.
  "after:absolute after:inset-x-0 after:h-[calc(var(--gap)+1px)] after:content-['']",
  "group-data-[side=top]/toast-viewport:after:top-full group-data-[side=bottom]/toast-viewport:after:bottom-full",
  // Toasts beyond the limit stay mounted (Base UI) but are hidden.
  "data-[limited]:opacity-0",
);

const listClasses = cn(
  "relative shrink-0",
  "[--s:1] [--y:var(--toast-swipe-movement-y)]",
  "data-[limited]:hidden",
);

const motionClasses = cn(
  "[--x:var(--toast-swipe-movement-x)]",
  "[transform:translateX(var(--x))_translateY(var(--y))_scale(var(--s))]",
  "transition-[transform,opacity,height] duration-[var(--sp-duration-entrance)] ease-[var(--sp-easing-default)]",
  // Enter from (and leave to) the edge the stack grows from. Doubled attribute
  // selectors outrank data-[expanded] so the slide still runs while expanded.
  "[&[data-starting-style][data-starting-style]]:[--y:calc(var(--sp-toast-dir)*-150%)] data-[starting-style]:opacity-0",
  "data-[ending-style]:opacity-0 data-[ending-style]:duration-[var(--sp-duration-exit)]",
  "[&[data-ending-style][data-ending-style]:not([data-swipe-direction])]:[--y:calc(var(--sp-toast-dir)*-150%)]",
  // Swipe: continue in the direction of the gesture.
  "[&[data-ending-style][data-swipe-direction=down]]:[--y:calc(var(--toast-swipe-movement-y)+150%)]",
  "[&[data-ending-style][data-swipe-direction=up]]:[--y:calc(var(--toast-swipe-movement-y)-150%)]",
  "[&[data-ending-style][data-swipe-direction=left]]:[--x:calc(var(--toast-swipe-movement-x)-150%)]",
  "[&[data-ending-style][data-swipe-direction=right]]:[--x:calc(var(--toast-swipe-movement-x)+150%)]",
);

// Anchored toasts (Positioner) scale + fade from their anchor, like Tooltip.
const anchoredClasses = cn(
  "relative w-max max-w-xs origin-[var(--transform-origin)]",
  "transition-[transform,opacity] duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)]",
  "data-[starting-style]:scale-[var(--sp-scale-enter)] data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-[var(--sp-scale-enter)] data-[ending-style]:opacity-0",
  "data-[ending-style]:duration-[var(--sp-duration-exit)]",
);

export interface ToastRootProps extends React.ComponentProps<typeof BaseToast.Root> {
  /** Overrides the toast's own `data.appearance` and the Viewport default. */
  appearance?: ToastAppearance;
}

const Root = React.forwardRef<HTMLDivElement, ToastRootProps>(
  ({ className, toast, appearance: appearanceProp, swipeDirection, children, ...props }, ref) => {
    const viewport = React.useContext(ViewportContext);
    const data = (toast.data ?? {}) as ToastData;
    const type = toType(toast.type);
    const appearance = appearanceProp ?? data.appearance ?? viewport.appearance;
    const anchored = toast.positionerProps?.anchor != null;
    const item = React.useMemo(
      () => ({ toast: toast as ToastObject, type, appearance }),
      [toast, type, appearance],
    );
    return (
      <ToastItemContext.Provider value={item}>
        <BaseToast.Root
          ref={ref}
          toast={toast}
          swipeDirection={swipeDirection ?? (anchored ? [] : swipeFor[viewport.position])}
          data-slot="toast"
          data-type={type}
          data-appearance={appearance}
          className={cn(
            "select-none rounded-[var(--radius-DEFAULT)] border shadow-lg outline-none",
            "border-[var(--sp-toast-border)] bg-[var(--sp-toast-bg)] text-[var(--sp-toast-fg)]",
            "forced-colors:border-[CanvasText]",
            "focus-visible:sp-focus-ring",
            intentClasses[type][appearance],
            anchored
              ? anchoredClasses
              : ["w-full", viewport.expand ? listClasses : stackClasses, motionClasses],
            className,
          )}
          {...props}
        >
          {children}
        </BaseToast.Root>
      </ToastItemContext.Provider>
    );
  },
);
Root.displayName = "Toast.Root";

/* ============================================================
 * Content and text parts
 * ============================================================ */

const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseToast.Content>>(
  ({ className, ...props }, ref) => {
    const { expand } = React.useContext(ViewportContext);
    return (
      <BaseToast.Content
        ref={ref}
        data-slot="toast-content"
        className={cn(
          "relative flex items-start gap-3 overflow-hidden rounded-[inherit]",
          "p-[calc(var(--sp-control-gap)*1.5)]",
          // Reserve room for the × only when one is rendered.
          "has-[>[data-slot=toast-close-button]]:pe-[calc(var(--sp-control-height-sm)+var(--sp-control-gap))]",
          "transition-opacity duration-[var(--sp-duration-slow)] ease-[var(--sp-easing-default)]",
          // In a collapsed stack only the front toast's content is visible.
          !expand && "data-[behind]:opacity-0 data-[expanded]:opacity-100",
          className,
        )}
        {...props}
      />
    );
  },
);
Content.displayName = "Toast.Content";

/** Wraps title, description, caption and actions next to the icon. */
const Body = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="toast-body"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  ),
);
Body.displayName = "Toast.Body";

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BaseToast.Title>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Title
      ref={ref}
      data-slot="toast-title"
      className={cn(
        "text-sm font-semibold text-[var(--sp-toast-fg,var(--sp-fg-default))]",
        className,
      )}
      {...props}
    />
  ),
);
Title.displayName = "Toast.Title";

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseToast.Description>
>(({ className, ...props }, ref) => (
  <BaseToast.Description
    ref={ref}
    data-slot="toast-description"
    className={cn("text-sm text-[var(--sp-toast-muted,var(--sp-fg-muted))]", className)}
    {...props}
  />
));
Description.displayName = "Toast.Description";

/** Small secondary line, e.g. a timestamp (Carbon `caption`). */
const Caption = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="toast-caption"
      className={cn("mt-1 text-xs text-[var(--sp-toast-muted,var(--sp-fg-muted))]", className)}
      {...props}
    />
  ),
);
Caption.displayName = "Toast.Caption";

/* ============================================================
 * Icon
 * ============================================================ */

const typeIcons: Record<Exclude<ToastType, "neutral" | "loading">, React.ReactNode> = {
  info: <InfoIcon weight="bold" />,
  success: <CheckCircleIcon weight="bold" />,
  warning: <WarningIcon weight="bold" />,
  danger: <WarningCircleIcon weight="bold" />,
};

export interface ToastIconProps extends React.ComponentPropsWithRef<"span"> {
  /** Replaces the intent icon. */
  children?: React.ReactNode;
}

/** The intent icon for the toast's type. Neutral toasts have none unless given one. */
const Icon = React.forwardRef<HTMLSpanElement, ToastIconProps>(
  ({ className, children, ...props }, ref) => {
    const item = React.useContext(ToastItemContext);
    const type = item?.type ?? "neutral";
    let icon: React.ReactNode = children;
    if (icon == null) {
      if (type === "loading") icon = <Spinner size="md" aria-hidden />;
      else if (type !== "neutral") icon = typeIcons[type];
    }
    if (icon == null || icon === false) return null;
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="toast-icon"
        className={cn(
          "inline-flex shrink-0 text-[var(--sp-toast-icon)] [&_svg]:size-5",
          // Optically centre on the first line of the title.
          "mt-px",
          className,
        )}
        {...props}
      >
        {icon}
      </span>
    );
  },
);
Icon.displayName = "Toast.Icon";

/* ============================================================
 * Buttons — Action, Close, CloseButton (X)
 * ============================================================ */

const onToastButton =
  "rounded-[var(--radius-sm)] border border-[var(--sp-toast-fg)] text-[var(--sp-toast-fg)] hover:bg-[color-mix(in_oklab,var(--sp-toast-fg)_10%,transparent)]";

/** Groups the action and cancel buttons. */
const Actions = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="toast-actions"
      className={cn("mt-2 flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  ),
);
Actions.displayName = "Toast.Actions";

/**
 * The toast's primary action, rendered as a Southpaw Button. Its label and click handler
 * come from the toast's `actionProps` (set by `toast.*({ action })`) or from children.
 * Clicking it closes the toast (Sonner) unless a handler calls `event.preventDefault()`.
 */
const Action = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseToast.Action>>(
  ({ className, onClick, ...props }, ref) => {
    const item = React.useContext(ToastItemContext);
    const { close } = BaseToast.useToastManager();
    const toastId = item?.toast.id;
    return (
      <BaseToast.Action
        ref={ref}
        data-slot="toast-action"
        render={<Button size="sm" variant="outline" className={cn(onToastButton, className)} />}
        onClick={(event) => {
          onClick?.(event);
          // Base UI also runs the toast's actionProps.onClick; check after every handler ran.
          queueMicrotask(() => {
            if (toastId && !event.defaultPrevented && !event.nativeEvent.defaultPrevented) {
              close(toastId);
            }
          });
        }}
        {...props}
      />
    );
  },
);
Action.displayName = "Toast.Action";

/** A text button that closes the toast, e.g. "Cancel" or "Dismiss". */
const Close = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseToast.Close>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Close
      ref={ref}
      data-slot="toast-close"
      render={
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "text-[var(--sp-toast-fg)] hover:bg-[color-mix(in_oklab,var(--sp-toast-fg)_10%,transparent)]",
            className,
          )}
        />
      }
      {...props}
    />
  ),
);
Close.displayName = "Toast.Close";

export interface ToastCloseButtonProps extends Omit<
  React.ComponentProps<typeof BaseToast.Close>,
  "children"
> {
  /** Accessible name. @default "Dismiss notification" */
  label?: string;
}

/** The "×" icon button in the toast's top corner. Always render one (Carbon, Spectrum). */
const CloseButton = React.forwardRef<HTMLButtonElement, ToastCloseButtonProps>(
  ({ className, label = DEFAULT_CLOSE_LABEL, ...props }, ref) => (
    <BaseToast.Close
      ref={ref}
      data-slot="toast-close-button"
      render={
        <Button
          size="icon"
          variant="ghost"
          srOnly={label}
          icon={<XIcon />}
          className={cn(
            "absolute end-[calc(var(--sp-control-gap)*0.5)] top-[calc(var(--sp-control-gap)*0.5)]",
            "size-[var(--sp-control-height-sm)] rounded-[var(--radius-sm)]",
            "text-[var(--sp-toast-fg)] hover:bg-[color-mix(in_oklab,var(--sp-toast-fg)_10%,transparent)]",
            className,
          )}
        />
      }
      {...props}
    />
  ),
);
CloseButton.displayName = "Toast.CloseButton";

/* ============================================================
 * Progress — remaining time (Mantine withAutoCloseProgress, Ant showProgress)
 * ============================================================ */

export interface ToastProgressProps extends React.ComponentPropsWithRef<"span"> {
  /** Duration in ms. Defaults to the toast's timeout, then the Viewport's. */
  timeout?: number;
}

/**
 * A thin bar that empties over the toast's timeout. It pauses whenever Base UI pauses the
 * timer: while the stack is expanded (hover/focus) and while the window is blurred.
 * Decorative: the time limit itself is not announced.
 */
const Progress = React.forwardRef<HTMLSpanElement, ToastProgressProps>(
  ({ className, timeout: timeoutProp, ...props }, ref) => {
    const item = React.useContext(ToastItemContext);
    const viewport = React.useContext(ViewportContext);
    const barRef = React.useRef<HTMLSpanElement | null>(null);
    const duration = timeoutProp ?? item?.toast.timeout ?? viewport.timeout;
    const updateKey = item?.toast.updateKey;

    React.useEffect(() => {
      const bar = barRef.current;
      if (!bar || !duration || typeof bar.animate !== "function") return;
      const animation = bar.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], {
        duration,
        easing: "linear",
        fill: "forwards",
      });
      const root = bar.closest<HTMLElement>("[data-slot='toast']");
      let windowFocused = typeof document === "undefined" || document.hasFocus();
      const sync = () => {
        const paused = !windowFocused || root?.hasAttribute("data-expanded");
        if (paused && animation.playState === "running") animation.pause();
        else if (!paused && animation.playState === "paused") animation.play();
      };
      const onBlur = () => {
        windowFocused = false;
        sync();
      };
      const onFocus = () => {
        windowFocused = true;
        sync();
      };
      const observer = root ? new MutationObserver(sync) : null;
      observer?.observe(root as HTMLElement, {
        attributes: true,
        attributeFilter: ["data-expanded"],
      });
      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);
      sync();
      return () => {
        animation.cancel();
        observer?.disconnect();
        window.removeEventListener("blur", onBlur);
        window.removeEventListener("focus", onFocus);
      };
    }, [duration, updateKey]);

    if (!duration) return null;
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="toast-progress"
        className={cn("absolute inset-x-0 bottom-0 h-1 overflow-hidden", className)}
        {...props}
      >
        <span
          ref={barRef}
          className="block h-full w-full origin-left bg-[var(--sp-toast-icon)] opacity-60 rtl:origin-right forced-colors:bg-[CanvasText]"
        />
      </span>
    );
  },
);
Progress.displayName = "Toast.Progress";

/* ============================================================
 * Anchored toasts — Positioner + Arrow (e.g. "Copied!" next to a button)
 * ============================================================ */

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToast.Positioner>
>(({ className, sideOffset = 8, collisionPadding = 8, ...props }, ref) => (
  <BaseToast.Positioner
    ref={ref}
    data-slot="toast-positioner"
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    className={cn("z-50", className)}
    {...props}
  />
));
Positioner.displayName = "Toast.Positioner";

const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseToast.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseToast.Arrow
      ref={ref}
      data-slot="toast-arrow"
      className={cn(
        "size-2.5 rotate-45 border-[var(--sp-toast-border)] bg-[var(--sp-toast-bg)] forced-colors:hidden",
        "data-[side=top]:-bottom-[5px] data-[side=top]:border-b data-[side=top]:border-e",
        "data-[side=bottom]:-top-[5px] data-[side=bottom]:border-s data-[side=bottom]:border-t",
        "data-[side=left]:-right-[5px] data-[side=left]:border-e data-[side=left]:border-t",
        "data-[side=right]:-left-[5px] data-[side=right]:border-b data-[side=right]:border-s",
        className,
      )}
      {...props}
    />
  ),
);
Arrow.displayName = "Toast.Arrow";

/* ============================================================
 * Item — the default toast layout used by Toaster
 * ============================================================ */

export interface ToastItemProps extends Omit<ToastRootProps, "children"> {
  /** Accessible name of the × button. @default "Dismiss notification" */
  closeLabel?: string;
}

/** Renders a toast object with icon, text, caption, actions, × and progress. */
const Item = React.forwardRef<HTMLDivElement, ToastItemProps>(
  ({ toast, closeLabel, ...props }, ref) => {
    const viewport = React.useContext(ViewportContext);
    const data = (toast.data ?? {}) as ToastData;
    const hasAction = toast.actionProps?.children != null;
    const showProgress =
      (data.showProgress ?? viewport.showProgress) && (toast.timeout ?? viewport.timeout) > 0;
    return (
      <Root ref={ref} toast={toast} {...props}>
        <Content>
          {data.icon === false ? null : <Icon>{data.icon}</Icon>}
          <Body>
            <Title />
            <Description />
            {data.caption != null && <Caption>{data.caption}</Caption>}
            {(hasAction || data.cancel) && (
              <Actions>
                {hasAction && <Action />}
                {data.cancel && <Close onClick={data.cancel.onClick}>{data.cancel.label}</Close>}
              </Actions>
            )}
          </Body>
          <CloseButton label={closeLabel} />
          {showProgress && <Progress />}
        </Content>
      </Root>
    );
  },
);
Item.displayName = "Toast.Item";

/* ============================================================
 * Toaster + toast() — Sonner-style convenience API
 * ============================================================ */

let idCounter = 0;
const nextId = () => `sp-toast-${(idCounter += 1)}`;

/**
 * A Base UI toast manager that queues calls made before any Provider/Toaster has
 * subscribed (e.g. `toast()` during the first render) and replays them on mount.
 * Base UI's own manager drops them.
 */
function createManager(): ToastManager {
  const base = BaseToast.createToastManager<ToastData>();
  const queue: Array<() => void> = [];
  let subscribers = 0;
  const run = (fn: () => void) => (subscribers > 0 ? fn() : queue.push(fn));
  const manager = {
    " subscribe": (listener: Parameters<ToastManager[" subscribe"]>[0]) => {
      const unsubscribe = base[" subscribe"](listener);
      subscribers += 1;
      queue.splice(0).forEach((fn) => fn());
      return () => {
        subscribers -= 1;
        unsubscribe();
      };
    },
    add: (options: AddOptions) => {
      const id = options.id ?? nextId();
      run(() => base.add({ ...options, id }));
      return id;
    },
    close: (id?: string) => {
      run(() => base.close(id));
    },
    update: (id: string, updates: Parameters<ToastManager["update"]>[1]) => {
      run(() => base.update(id, updates));
    },
    promise: <Value,>(
      promise: Promise<Value>,
      options: Parameters<ToastManager["promise"]>[1],
    ): Promise<Value> => {
      if (subscribers > 0) return base.promise(promise, options) as Promise<Value>;
      // The caller handles rejection on the promise we return; the replayed chain must not
      // raise a second, unhandled rejection.
      queue.push(() => void base.promise(promise, options).catch(() => undefined));
      return promise;
    },
  };
  return manager as unknown as ToastManager;
}

/** The global manager behind `toast()` and `<Toast.Toaster />`. */
export const toastManager: ToastManager = createManager();

export interface ToasterProps extends Omit<ToastViewportProps, "children" | "ref"> {
  /** Use your own manager instead of the global one. */
  toastManager?: ToastManager;
  /** Most toasts shown at once; the rest queue (Base UI `limit`). @default 3 */
  limit?: number;
  /** Portal container. @default document.body */
  container?: React.ComponentProps<typeof BaseToast.Portal>["container"];
  /** Accessible name of each toast's × button. */
  closeLabel?: string;
  children?: React.ReactNode;
}

function ToastList({ closeLabel }: { closeLabel?: string }) {
  const { toasts } = BaseToast.useToastManager<ToastData>();
  return toasts.map((t) => <Item key={t.id} toast={t} closeLabel={closeLabel} />);
}

/**
 * Provider + Portal + Viewport + default toast rendering in one part. Mount it once, then
 * call `toast.success(...)` etc. from anywhere. Children render inside the Provider, so
 * they can also use `Toast.useToastManager()`.
 */
function Toaster({
  toastManager: manager = toastManager,
  limit = DEFAULT_LIMIT,
  timeout = DEFAULT_TIMEOUT,
  container,
  closeLabel,
  children,
  ...viewportProps
}: ToasterProps) {
  return (
    <Provider toastManager={manager} limit={limit} timeout={timeout}>
      {children}
      <Portal container={container}>
        <Viewport timeout={timeout} {...viewportProps}>
          <ToastList closeLabel={closeLabel} />
        </Viewport>
      </Portal>
    </Provider>
  );
}

export interface ToastOptions extends ToastData {
  id?: string;
  description?: React.ReactNode;
  /** Ms before auto-dismiss; `0` keeps it open. Defaults depend on the type (see docs). */
  timeout?: number;
  /** `high` announces assertively (`alertdialog`). Defaults to `high` for danger. */
  priority?: "low" | "high";
  /** Primary action. Makes the toast persistent unless you set `timeout`. */
  action?: ToastButtonOptions;
  onClose?: () => void;
  onRemove?: () => void;
}

type AddOptions = Parameters<ToastManager["add"]>[0];
type UpdateOptions = Exclude<Parameters<ToastManager["update"]>[1], (...args: never[]) => unknown>;

/** Builds Base UI options, applying Southpaw's safe-by-default rules. */
function buildOptions(
  type: ToastType,
  title: React.ReactNode,
  options: ToastOptions = {},
): AddOptions {
  const {
    id,
    description,
    timeout,
    priority,
    action,
    onClose,
    onRemove,
    appearance,
    icon,
    cancel,
    caption,
    showProgress,
  } = options;
  // Errors, toasts with an action, and loading toasts persist (Spectrum, Carbon).
  const persistent = isPersistentType(type) || action != null;
  const result: AddOptions = {
    title,
    description,
    type,
    priority: priority ?? (type === "danger" ? "high" : "low"),
    data: { appearance, icon, cancel, caption, showProgress },
    onClose,
    onRemove,
  };
  if (id !== undefined) result.id = id;
  if (timeout !== undefined) result.timeout = timeout;
  else if (persistent) result.timeout = 0;
  if (action) result.actionProps = actionProps(action);
  return result;
}

/** `Toast.Action` closes the toast after these run, unless one calls preventDefault. */
function actionProps(action: ToastButtonOptions): AddOptions["actionProps"] {
  return { children: action.label, onClick: action.onClick };
}

const isPersistentType = (type: ToastType) => type === "danger" || type === "loading";

function makeToast(manager: ToastManager) {
  const show = (type: ToastType) => (title: React.ReactNode, options?: ToastOptions) =>
    manager.add(buildOptions(type, title, options));

  type PromiseState<Value> =
    | React.ReactNode
    | ({ title: React.ReactNode } & ToastOptions)
    | ((value: Value) => React.ReactNode | ({ title: React.ReactNode } & ToastOptions));

  const toUpdate = (type: ToastType, state: unknown): UpdateOptions => {
    const isOptions =
      state != null &&
      typeof state === "object" &&
      !React.isValidElement(state) &&
      "title" in state;
    const { title, ...rest } = isOptions
      ? (state as { title: React.ReactNode } & ToastOptions)
      : { title: state as React.ReactNode };
    // Base UI passes `timeout` through explicitly, so an unset timeout on a settled
    // promise falls back to the Provider's (not a hard-coded default).
    return buildOptions(type, title, rest) as UpdateOptions;
  };

  return Object.assign(show("neutral"), {
    info: show("info"),
    success: show("success"),
    warning: show("warning"),
    error: show("danger"),
    danger: show("danger"),
    loading: show("loading"),
    /** Loading toast that becomes success or danger when the promise settles. */
    promise<Value>(
      promise: Promise<Value>,
      states: {
        loading: PromiseState<never>;
        success: PromiseState<Value>;
        error: PromiseState<unknown>;
      },
    ): Promise<Value> {
      const resolve =
        <V,>(type: ToastType, state: PromiseState<V>) =>
        (value: V) =>
          toUpdate(type, typeof state === "function" ? (state as (v: V) => unknown)(value) : state);
      return manager.promise(promise, {
        loading: toUpdate("loading", states.loading),
        success: resolve("success", states.success),
        error: resolve("danger", states.error),
      });
    },
    /** Closes one toast, or all of them when no id is given. */
    dismiss: (id?: string) => manager.close(id),
    /**
     * Updates a toast in place. Changing the type or adding an action re-applies the
     * safe defaults (danger/loading/actionable persist; danger is high priority) unless
     * you pass `timeout` / `priority`.
     */
    update: (
      id: string,
      options: Omit<ToastOptions, "id"> & { title?: React.ReactNode; type?: ToastType },
    ) => {
      const { title, type, action, timeout, priority, description, onClose, onRemove, ...data } =
        options;
      manager.update(id, (prev) => {
        const update: UpdateOptions = {};
        if (title !== undefined) update.title = title;
        if (description !== undefined) update.description = description;
        if (type !== undefined) update.type = type;
        if (action !== undefined) update.actionProps = actionProps(action);
        if (onClose !== undefined) update.onClose = onClose;
        if (onRemove !== undefined) update.onRemove = onRemove;
        const nextType = type ?? toType(prev.type);
        const hasAction = action != null || prev.actionProps?.children != null;
        if (timeout !== undefined) update.timeout = timeout;
        else if (isPersistentType(nextType) || hasAction) update.timeout = 0;
        // Leaving a persistent type (e.g. loading → success): back to the Provider timeout.
        else if (type !== undefined) update.timeout = undefined;
        if (priority !== undefined) update.priority = priority;
        else if (type !== undefined) update.priority = nextType === "danger" ? "high" : "low";
        const dataUpdates = Object.fromEntries(
          Object.entries(data).filter(([, value]) => value !== undefined),
        ) as ToastData;
        if (Object.keys(dataUpdates).length > 0) {
          update.data = { ...prev.data, ...dataUpdates };
        }
        return update;
      });
    },
  });
}

/**
 * Show toasts from anywhere: `toast("Saved")`, `toast.success(...)`, `toast.error(...)`,
 * `toast.warning(...)`, `toast.info(...)`, `toast.loading(...)`, `toast.promise(...)`,
 * `toast.dismiss(id?)`, `toast.update(id, ...)`. Requires `<Toast.Toaster />`.
 */
export const toast = makeToast(toastManager);

/** Bind the `toast()` helpers to your own manager (e.g. one per Toaster). */
export function createToaster() {
  const manager = createManager();
  return { manager, toast: makeToast(manager) };
}

/* ============================================================
 * Export
 * ============================================================ */

export const Toast = {
  Toaster,
  Provider,
  Portal,
  Viewport,
  Root,
  Item,
  Content,
  Body,
  Icon,
  Title,
  Description,
  Caption,
  Actions,
  Action,
  Close,
  CloseButton,
  Progress,
  Positioner,
  Arrow,
  useToastManager: BaseToast.useToastManager<ToastData>,
  /** Base UI manager that also queues calls made before a Provider mounts. */
  createToastManager: createManager,
};
