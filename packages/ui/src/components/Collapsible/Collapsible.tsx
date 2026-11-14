import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "../../lib/cn";

// Bundlers statically replace `process.env.NODE_ENV`; declared locally so the
// package doesn't need @types/node.
declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/* ============================================================
 * Types
 * ============================================================ */

export type CollapsibleSize = "sm" | "md" | "lg";
/**
 * - `default` — full-width trigger with a hover background
 * - `bordered` — boxed container with a divider above the panel
 * - `ghost` — flush: no padding, background or border (inline "details" style)
 */
export type CollapsibleVariant = "default" | "bordered" | "ghost";
export type CollapsibleOrientation = "vertical" | "horizontal";
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type OpenChangeDetails = BaseCollapsible.Root.ChangeEventDetails;

/* ============================================================
 * Context
 * ============================================================ */

interface CollapsibleContextValue {
  open: boolean;
  /** Open without a trigger press (e.g. focus entering a partially collapsed panel). */
  requestOpen: (event: Event) => void;
  size: CollapsibleSize;
  variant: CollapsibleVariant;
  orientation: CollapsibleOrientation;
  animateOpacity: boolean;
  disabled: boolean;
  /** Default id for the Trigger (used unless the consumer passes `id`). */
  defaultTriggerId: string;
  /** Id of the mounted Trigger, if any — what the Panel is labelled by. */
  labelTriggerId: string | undefined;
  registerTrigger: (id: string | undefined) => void;
  panelId: string;
  /** Show-more mode: whether content fits within collapsedHeight (toggle hides itself). */
  fits: boolean;
  setFits: (fits: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext(part: string) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error(`Collapsible.${part} must be used inside Collapsible.Root`);
  return ctx;
}

/* ============================================================
 * Root
 * ============================================================ */

export interface CollapsibleRootProps extends React.ComponentProps<typeof BaseCollapsible.Root> {
  /** Trigger height and padding. Heights follow density. @default "md" */
  size?: CollapsibleSize;
  /** @default "default" */
  variant?: CollapsibleVariant;
  /** Collapse height (vertical) or width (horizontal). @default "vertical" */
  orientation?: CollapsibleOrientation;
  /** Fade the panel in and out as it expands. @default false */
  animateOpacity?: boolean;
  /** Override the expand/collapse duration (ms). Defaults to `--sp-duration-slow`. */
  transitionDuration?: number;
  /** Override the expand/collapse easing (any CSS easing). Defaults to `--sp-easing-default`. */
  transitionEasing?: string;
  /** Called once the expand/collapse animation has finished (immediately under reduced motion). */
  onOpenChangeComplete?: (open: boolean) => void;
}

const rootVariantClasses: Record<CollapsibleVariant, string> = {
  default: "",
  ghost: "",
  bordered:
    "border-border-default bg-surface-base rounded-[var(--radius-DEFAULT)] border [--sp-nested-radius:calc(var(--radius-DEFAULT)-1px)]",
};

const Root = React.forwardRef<HTMLDivElement, CollapsibleRootProps>((props, ref) => {
  const {
    className,
    style,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    size = "md",
    variant = "default",
    orientation = "vertical",
    animateOpacity = false,
    transitionDuration,
    transitionEasing,
    onOpenChangeComplete,
    ...rest
  } = props;

  // Mirror Base UI's open state so every part (and show-more mode) can read it
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean, details: OpenChangeDetails) => {
      onOpenChange?.(next, details);
      if (details.isCanceled) return;
      if (!isControlled) setUncontrolledOpen(next);
    },
    [onOpenChange, isControlled],
  );

  const requestOpen = React.useCallback(
    (event: Event) => {
      if (open || disabled) return;
      // Minimal details object for consumers; reason "none" = not a trigger press
      let canceled = false;
      const details = {
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
      } as unknown as OpenChangeDetails;
      handleOpenChange(true, details);
    },
    [open, disabled, handleOpenChange],
  );

  const id = React.useId();
  const [fits, setFits] = React.useState(false);
  const [labelTriggerId, registerTrigger] = React.useState<string | undefined>(undefined);

  const ctx: CollapsibleContextValue = {
    open,
    requestOpen,
    size,
    variant,
    orientation,
    animateOpacity,
    disabled,
    defaultTriggerId: `${id}-trigger`,
    labelTriggerId,
    registerTrigger,
    panelId: `${id}-panel`,
    fits,
    setFits,
    onOpenChangeComplete,
  };

  const vars: Record<string, string> = {};
  if (transitionDuration !== undefined)
    vars["--sp-collapsible-duration"] = `${transitionDuration}ms`;
  if (transitionEasing !== undefined) vars["--sp-collapsible-easing"] = transitionEasing;

  return (
    <CollapsibleContext.Provider value={ctx}>
      <BaseCollapsible.Root
        ref={ref}
        data-slot="collapsible"
        data-variant={variant}
        data-size={size}
        data-orientation={orientation}
        open={open}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        className={cn(
          orientation === "vertical" ? "w-full" : "flex items-stretch",
          rootVariantClasses[variant],
          className,
        )}
        style={
          typeof style === "function"
            ? (state) => ({ ...vars, ...style(state) })
            : ({ ...vars, ...style } as React.CSSProperties)
        }
        {...rest}
      />
    </CollapsibleContext.Provider>
  );
});
Root.displayName = "Collapsible.Root";

/* ============================================================
 * Chevron (default icon)
 * ============================================================ */

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-4 shrink-0", className)}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconRotation = {
  // End: points down, flips up when open
  end: "transition-transform duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)] motion-reduce:transition-none [[data-panel-open]_&]:rotate-180",
  // Start (tree style): points inline-end, turns down when open (Carbon guidance)
  start:
    "transition-transform duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)] motion-reduce:transition-none -rotate-90 rtl:rotate-90 [[data-panel-open]_&]:rotate-0",
  // Horizontal panels: points inline-end, flips when open
  horizontal:
    "transition-transform duration-[var(--sp-duration-normal)] ease-[var(--sp-easing-default)] motion-reduce:transition-none -rotate-90 rtl:rotate-90 [[data-panel-open]_&]:rotate-90 rtl:[[data-panel-open]_&]:-rotate-90",
};

/* ============================================================
 * Trigger
 * ============================================================ */

const triggerSizeClasses: Record<CollapsibleSize, string> = {
  sm: "min-h-[var(--sp-control-height-sm)] gap-1.5 px-2 text-sm",
  md: "min-h-[var(--sp-control-height)] gap-2 px-3 text-sm",
  lg: "min-h-[var(--sp-control-height-lg)] gap-2.5 px-4 text-base",
};

const triggerIconOnlySize: Record<CollapsibleSize, string> = {
  sm: "size-[var(--sp-control-height-sm)]",
  md: "size-[var(--sp-control-height)]",
  lg: "size-[var(--sp-control-height-lg)]",
};

const triggerVariantClasses: Record<CollapsibleVariant, string> = {
  default: "rounded-[var(--radius-DEFAULT)] hover:bg-state-hover active:bg-state-pressed",
  bordered: "rounded-[var(--sp-nested-radius)] hover:bg-state-hover active:bg-state-pressed",
  // Flush: no padding or fill; underline the label on hover so it still reads as a control
  ghost: "!px-0 rounded-sm hover:[&_[data-slot=collapsible-trigger-label]]:underline",
};

export interface CollapsibleTriggerProps extends React.ComponentProps<
  typeof BaseCollapsible.Trigger
> {
  /**
   * Indicator icon. Defaults to a chevron that rotates when open.
   * Pass a function to swap icons by state (e.g. plus/minus) — no rotation is applied.
   * Pass `null` to hide it.
   */
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  /** Where the icon sits. `start` suits tree-like content. @default "end" */
  iconPosition?: "start" | "end";
  /** Wrap the trigger in `<h1>`–`<h6>` so it appears in the page's heading outline. */
  headingLevel?: HeadingLevel;
  /** Accessible name while closed (icon-only triggers). */
  closedLabel?: string;
  /** Accessible name while open (icon-only triggers). */
  openLabel?: string;
}

const Trigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>((props, ref) => {
  const {
    className,
    children,
    icon,
    iconPosition = "end",
    headingLevel,
    closedLabel,
    openLabel,
    id,
    "aria-label": ariaLabel,
    ...rest
  } = props;
  const ctx = useCollapsibleContext("Trigger");
  const iconOnly = children === undefined || children === null || children === false;
  const triggerId = id ?? ctx.defaultTriggerId;

  // The Panel is labelled by whatever id the Trigger actually renders with
  const { registerTrigger } = ctx;
  React.useLayoutEffect(() => {
    registerTrigger(triggerId);
    return () => registerTrigger(undefined);
  }, [triggerId, registerTrigger]);

  // State-specific labels win over a static aria-label
  const stateLabel = (ctx.open ? openLabel : closedLabel) ?? ariaLabel;
  const unnamed = iconOnly && !stateLabel && !rest["aria-labelledby"];
  const warned = React.useRef(false);
  React.useEffect(() => {
    if (isDev && unnamed && !warned.current) {
      warned.current = true;
      console.warn(
        "[Southpaw] Collapsible.Trigger: an icon-only trigger needs an accessible name. " +
          "Pass `closedLabel`/`openLabel`, `aria-label` or `aria-labelledby`.",
      );
    }
  }, [unnamed]);
  const rotation = ctx.orientation === "horizontal" ? "horizontal" : iconPosition;

  let iconNode: React.ReactNode;
  if (icon === null) iconNode = null;
  else if (typeof icon === "function") {
    iconNode = (
      <span
        aria-hidden="true"
        data-slot="collapsible-icon"
        className="text-fg-muted inline-flex shrink-0"
      >
        {icon(ctx.open)}
      </span>
    );
  } else {
    iconNode = (
      <span
        aria-hidden="true"
        data-slot="collapsible-icon"
        className={cn("text-fg-muted inline-flex shrink-0", iconRotation[rotation])}
      >
        {icon ?? <Chevron />}
      </span>
    );
  }

  const button = (
    <BaseCollapsible.Trigger
      ref={ref}
      id={triggerId}
      data-slot="collapsible-trigger"
      aria-label={stateLabel}
      className={cn(
        "text-fg-default flex cursor-pointer items-center font-medium",
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] motion-reduce:transition-none",
        "focus-visible:sp-focus-ring outline-none",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)] data-[disabled]:hover:bg-transparent",
        "forced-colors:border forced-colors:border-[ButtonText]",
        iconOnly
          ? cn("shrink-0 justify-center", triggerIconOnlySize[ctx.size])
          : cn("w-full text-start", triggerSizeClasses[ctx.size]),
        triggerVariantClasses[ctx.variant],
        iconOnly && ctx.variant === "ghost" && "!px-0",
        className,
      )}
      {...rest}
    >
      {iconPosition === "start" && iconNode}
      {!iconOnly && (
        <span data-slot="collapsible-trigger-label" className="min-w-0 flex-1">
          {children}
        </span>
      )}
      {iconPosition === "end" && iconNode}
    </BaseCollapsible.Trigger>
  );

  if (!headingLevel) return button;
  const Heading = `h${headingLevel}` as const;
  return (
    <Heading
      data-slot="collapsible-heading"
      className={cn("m-0 font-[inherit] text-[length:inherit]", !iconOnly && "w-full")}
    >
      {button}
    </Heading>
  );
});
Trigger.displayName = "Collapsible.Trigger";

/* ============================================================
 * Header — trigger + extra actions on one row
 * ============================================================ */

// Square end cell sized to the trigger row (density-aware control height)
const headerEndCellSize: Record<CollapsibleSize, string> = {
  sm: "[&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:w-[var(--sp-control-height-sm)] [&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:min-h-[var(--sp-control-height-sm)]",
  md: "[&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:w-[var(--sp-control-height)] [&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:min-h-[var(--sp-control-height)]",
  lg: "[&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:w-[var(--sp-control-height-lg)] [&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:min-h-[var(--sp-control-height-lg)]",
};

const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => {
    const ctx = useCollapsibleContext("Header");
    return (
      <div
        ref={ref}
        data-slot="collapsible-header"
        className={cn(
          "flex w-full items-center",
          ctx.variant === "bordered"
            ? // Flush: the trailing action (or icon-only trigger) fills the row's end
              // cell edge to edge, matching the container's inner radius
              cn(
                "items-stretch gap-0",
                headerEndCellSize[ctx.size],
                "[&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:h-auto [&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:shrink-0",
                "[&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:rounded-none [&>:last-child:not(:has([data-slot=collapsible-trigger-label]))]:rounded-e-[var(--sp-nested-radius)]",
              )
            : "gap-2",
          className,
        )}
        {...props}
      />
    );
  },
);
Header.displayName = "Collapsible.Header";

/* ============================================================
 * Panel
 * ============================================================ */

const contentPadding: Record<CollapsibleVariant, Record<CollapsibleSize, string>> = {
  default: { sm: "px-2 pb-2 pt-1", md: "px-3 pb-3 pt-1", lg: "px-4 pb-4 pt-1.5" },
  bordered: { sm: "p-2", md: "p-3", lg: "p-4" },
  ghost: { sm: "pb-2 pt-1", md: "pb-3 pt-1", lg: "pb-4 pt-1.5" },
};

const motion =
  "duration-[var(--sp-collapsible-duration,var(--sp-duration-slow))] ease-[var(--sp-collapsible-easing,var(--sp-easing-default))] motion-reduce:transition-none";

export interface CollapsiblePanelProps extends React.ComponentProps<typeof BaseCollapsible.Panel> {
  /**
   * Show-more mode: stay partly visible at this height when closed, with a fade.
   * Pair with `<Collapsible.ShowMore>`. Number = px.
   */
  collapsedHeight?: number | string;
  /** Fade the bottom edge while partly collapsed. @default true */
  fade?: boolean;
  /**
   * `group` (default when set) or `region` for landmark-worthy sections.
   * Either way the panel is labelled by the trigger.
   */
  role?: "group" | "region";
  /** Props for the inner content element (padding lives here so height animates cleanly). */
  contentProps?: React.ComponentPropsWithRef<"div">;
}

/** Fire onOpenChangeComplete after the size transition (or immediately if there is none). */
function useOpenChangeComplete(
  elRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  callback: ((open: boolean) => void) | undefined,
) {
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!callback) return;
    const el = elRef.current;
    const duration = el ? parseFloat(getComputedStyle(el).transitionDuration) || 0 : 0;
    if (!el || duration === 0) {
      callback(open);
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      callback(open);
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el && (e.propertyName === "height" || e.propertyName === "width")) finish();
    };
    el.addEventListener("transitionend", onEnd);
    // Safety net: transitionend doesn't fire if the transition is interrupted
    const timer = window.setTimeout(finish, duration * 1000 + 100);
    return () => {
      el.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
    };
  }, [open, callback, elRef]);
}

type DisclosurePanelProps = Omit<CollapsiblePanelProps, "collapsedHeight" | "fade">;
type ShowMorePanelProps = Omit<
  CollapsiblePanelProps,
  "collapsedHeight" | "hiddenUntilFound" | "keepMounted" | "render"
> & { collapsedHeight: number | string };

const Panel = React.forwardRef<HTMLDivElement, CollapsiblePanelProps>((props, ref) => {
  const { collapsedHeight, fade, hiddenUntilFound, keepMounted, render, ...common } = props;
  // Show-more mode isn't a Base UI Panel, so Base-only props don't apply there
  if (collapsedHeight !== undefined) {
    return <ShowMorePanel ref={ref} collapsedHeight={collapsedHeight} fade={fade} {...common} />;
  }
  return (
    <DisclosurePanel
      ref={ref}
      hiddenUntilFound={hiddenUntilFound}
      keepMounted={keepMounted}
      render={render}
      {...common}
    />
  );
});
Panel.displayName = "Collapsible.Panel";

const DisclosurePanel = React.forwardRef<HTMLDivElement, DisclosurePanelProps>((props, ref) => {
  const { className, children, role, hiddenUntilFound = true, contentProps, ...rest } = props;
  const ctx = useCollapsibleContext("Panel");
  const elRef = React.useRef<HTMLDivElement | null>(null);
  useOpenChangeComplete(elRef, ctx.open, ctx.onOpenChangeComplete);

  const setRefs = (node: HTMLDivElement | null) => {
    elRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const horizontal = ctx.orientation === "horizontal";
  const { className: contentClassName, ...contentRest } = contentProps ?? {};

  return (
    <BaseCollapsible.Panel
      ref={setRefs}
      id={ctx.panelId}
      data-slot="collapsible-panel"
      hiddenUntilFound={hiddenUntilFound}
      role={role}
      aria-labelledby={role ? ctx.labelTriggerId : undefined}
      className={cn(
        "overflow-hidden",
        horizontal
          ? cn(
              "h-auto w-[var(--collapsible-panel-width)] transition-[width,opacity] data-[ending-style]:w-0 data-[starting-style]:w-0",
            )
          : "h-[var(--collapsible-panel-height)] transition-[height,opacity] data-[ending-style]:h-0 data-[starting-style]:h-0",
        motion,
        ctx.animateOpacity && "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...rest}
    >
      <div
        data-slot="collapsible-content"
        className={cn(
          "text-fg-default text-sm",
          horizontal ? "h-full w-max" : contentPadding[ctx.variant][ctx.size],
          // Divider lives on the content so it's clipped with it (no 1px line when closed)
          ctx.variant === "bordered" && !horizontal && "border-border-default border-t",
          contentClassName,
        )}
        {...contentRest}
      >
        {children}
      </div>
    </BaseCollapsible.Panel>
  );
});
DisclosurePanel.displayName = "Collapsible.DisclosurePanel";

/**
 * Partly-collapsed panel ("show more"). Not a Base UI Panel: Base UI hides a
 * closed panel entirely (`hidden`), but here the first `collapsedHeight` of
 * content must stay visible. Content stays in the DOM and accessibility tree.
 */
const ShowMorePanel = React.forwardRef<HTMLDivElement, ShowMorePanelProps>((props, ref) => {
  const {
    className,
    style,
    children,
    role,
    collapsedHeight,
    fade = true,
    contentProps,
    ...rest
  } = props;
  const ctx = useCollapsibleContext("Panel");
  const elRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);
  const [collapsedPx, setCollapsedPx] = React.useState<number | null>(null);
  useOpenChangeComplete(elRef, ctx.open, ctx.onOpenChangeComplete);

  const setRefs = (node: HTMLDivElement | null) => {
    elRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  // Measure content and the resolved collapsed height (supports any CSS length)
  React.useLayoutEffect(() => {
    const content = contentRef.current;
    const el = elRef.current;
    if (!content || !el) return;
    const measure = () => {
      setContentHeight(content.scrollHeight);
      const probe = document.createElement("div");
      probe.style.height =
        typeof collapsedHeight === "number" ? `${collapsedHeight}px` : String(collapsedHeight);
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      el.appendChild(probe);
      setCollapsedPx(probe.getBoundingClientRect().height);
      el.removeChild(probe);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [collapsedHeight]);

  const fits =
    contentHeight !== null && collapsedPx !== null ? contentHeight <= collapsedPx + 1 : false;
  const { setFits } = ctx;
  React.useEffect(() => setFits(fits), [fits, setFits]);

  const height =
    fits || contentHeight === null
      ? undefined
      : ctx.open
        ? contentHeight
        : (collapsedPx ?? collapsedHeight);

  // Keyboard focus entering the clipped part expands it, so focus is never hidden.
  // A native listener (not a JSX prop) so a consumer's onFocus can't replace it.
  const latest = React.useRef({ open: ctx.open, fits, requestOpen: ctx.requestOpen });
  latest.current = { open: ctx.open, fits, requestOpen: ctx.requestOpen };
  React.useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const onFocusIn = (event: FocusEvent) => {
      const { open, fits: contentFits, requestOpen } = latest.current;
      if (!open && !contentFits) requestOpen(event);
    };
    el.addEventListener("focusin", onFocusIn);
    return () => el.removeEventListener("focusin", onFocusIn);
  }, []);

  const faded = fade && !fits && !ctx.open;
  const { className: contentClassName, ...contentRest } = contentProps ?? {};

  return (
    <div
      ref={setRefs}
      id={ctx.panelId}
      data-slot="collapsible-panel"
      data-show-more=""
      data-open={ctx.open ? "" : undefined}
      data-closed={ctx.open ? undefined : ""}
      role={role}
      aria-labelledby={role ? ctx.labelTriggerId : undefined}
      className={cn(
        "overflow-hidden transition-[height]",
        motion,
        faded &&
          "[mask-image:linear-gradient(to_bottom,#000_calc(100%-var(--sp-collapsible-fade-size,3rem)),transparent)]",
        className,
      )}
      style={{ height, ...(style as React.CSSProperties) }}
      {...(rest as React.ComponentPropsWithoutRef<"div">)}
    >
      <div
        ref={contentRef}
        data-slot="collapsible-content"
        className={cn("text-fg-default text-sm", contentClassName)}
        {...contentRest}
      >
        {children}
      </div>
    </div>
  );
});
ShowMorePanel.displayName = "Collapsible.ShowMorePanel";

/* ============================================================
 * ShowMore — toggle for a partly collapsed panel
 * ============================================================ */

export interface CollapsibleShowMoreProps extends Omit<
  React.ComponentProps<typeof BaseCollapsible.Trigger>,
  "children"
> {
  /** @default "Show more" */
  showLabel?: React.ReactNode;
  /** @default "Show less" */
  hideLabel?: React.ReactNode;
}

const ShowMore = React.forwardRef<HTMLButtonElement, CollapsibleShowMoreProps>((props, ref) => {
  const { className, showLabel = "Show more", hideLabel = "Show less", ...rest } = props;
  const ctx = useCollapsibleContext("ShowMore");
  // Nothing to reveal: no toggle (Mantine Spoiler behaviour)
  if (ctx.fits) return null;
  return (
    <BaseCollapsible.Trigger
      ref={ref}
      id={`${ctx.panelId}-show-more`}
      data-slot="collapsible-show-more"
      aria-controls={ctx.panelId}
      className={cn(
        // relative: sits above the clipped preview in stacking order
        "text-fg-default relative mt-1 inline-flex cursor-pointer items-center gap-1 rounded-sm text-sm font-medium",
        "focus-visible:sp-focus-ring outline-none hover:underline",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...rest}
    >
      {ctx.open ? hideLabel : showLabel}
      <span aria-hidden="true" className={cn("text-fg-muted inline-flex", iconRotation.end)}>
        <Chevron />
      </span>
    </BaseCollapsible.Trigger>
  );
});
ShowMore.displayName = "Collapsible.ShowMore";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Collapsible = { Root, Header, Trigger, Panel, ShowMore };

/**
 * Shared building blocks for other disclosure components (Accordion) so the
 * trigger, chevron and height animation stay identical. Not part of the
 * public Collapsible API.
 */
export const CollapsibleChevron = Chevron;
export const collapsibleStyles = {
  iconRotation,
  triggerSize: triggerSizeClasses,
  triggerIconOnlySize,
  triggerVariant: triggerVariantClasses,
  contentPadding,
  motion,
};
