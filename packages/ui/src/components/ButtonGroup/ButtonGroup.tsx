import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "../../lib/cn";
import { connectedClasses } from "../../lib/connected";
import { ButtonGroupContext, type ButtonGroupContextValue } from "./context";

function isDev(): boolean {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env;
  return env?.NODE_ENV !== "production";
}

/** Base UI's className may be a function of state; clsx drops functions, so wrap them. */
type ClassNameProp<State> = string | ((state: State) => string | undefined) | undefined;
function mergeClassName<State>(
  base: string,
  className: ClassNameProp<State>,
): ClassNameProp<State> {
  if (typeof className === "function") return (state: State) => cn(base, className(state));
  return cn(base, className);
}

type Orientation = "horizontal" | "vertical";

interface LayoutContextValue {
  orientation: Orientation;
  attached: boolean;
}

const LayoutContext = React.createContext<LayoutContextValue>({
  orientation: "horizontal",
  attached: false,
});

/* ============================================================
 * Root
 * ============================================================ */

export interface ButtonGroupRootProps
  extends
    Omit<React.ComponentPropsWithRef<"fieldset">, "color" | "disabled">,
    ButtonGroupContextValue {
  /** Layout direction. Default: "horizontal" */
  orientation?: Orientation;
  /**
   * Join the buttons into one connected control (shared borders, rounded outer corners).
   * Default: false (spaced, with the density-aware control gap).
   */
  attached?: boolean;
  /**
   * Spaced horizontal groups stack vertically, full width, below this breakpoint (GOV.UK).
   * `false` keeps them in a row. Ignored for attached and vertical groups. Default: "sm"
   */
  stackBelow?: "sm" | false;
  /** Stretch the children to fill the group (Chakra `grow`, MUI `fullWidth`). Default: false */
  grow?: boolean;
  /** Alignment along the group's main axis (Spectrum). Default: "start" */
  align?: "start" | "center" | "end";
  /**
   * Replace the rendered element (Base UI `render`). Default: a `<fieldset>`, which is what
   * makes `disabled` cascade to every native control inside. Another element (e.g. `<nav>`)
   * keeps the Button-level `disabled` (via context) but loses the native cascade.
   */
  render?: useRender.RenderProp;
}

const justify = { start: "justify-start", center: "justify-center", end: "justify-end" } as const;
const smJustify = {
  start: "sm:justify-start",
  center: "sm:justify-center",
  end: "sm:justify-end",
} as const;
const itemsAlign = { start: "items-start", center: "items-center", end: "items-end" } as const;

const Root = React.forwardRef<HTMLFieldSetElement, ButtonGroupRootProps>(
  (
    {
      className,
      orientation = "horizontal",
      attached = false,
      stackBelow = "sm",
      grow = false,
      align = "start",
      size,
      variant,
      color,
      disabled,
      render,
      children,
      ...props
    },
    ref,
  ) => {
    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];

    React.useEffect(() => {
      if (!attached || ariaLabel || ariaLabelledBy || !isDev()) return;
      console.warn(
        "[Southpaw] ButtonGroup: an attached group reads as one control — give it an " +
          "aria-label or aria-labelledby so screen readers announce what the buttons are for.",
      );
    }, [attached, ariaLabel, ariaLabelledBy]);

    const groupCtx = React.useMemo<ButtonGroupContextValue>(
      () => ({ size, variant, color, disabled }),
      [size, variant, color, disabled],
    );
    const layoutCtx = React.useMemo(() => ({ orientation, attached }), [orientation, attached]);

    const horizontal = orientation === "horizontal";
    const stacks = !attached && horizontal && stackBelow === "sm";

    // Rendered as a Base UI Fieldset (a native <fieldset>) so `disabled` cascades the way
    // `<fieldset disabled>` does: every native control inside (Button, Toggle, Input, Select
    // trigger, NumberField, OTPField…) is disabled and matches :disabled, and any Field.Root
    // inside inherits it through Base UI's Fieldset context (George, 2026-11-18).
    return (
      <BaseFieldset.Root
        ref={ref}
        render={render as React.ComponentProps<typeof BaseFieldset.Root>["render"]}
        disabled={disabled}
        role="group"
        data-slot="button-group"
        data-orientation={orientation}
        data-attached={attached ? "" : undefined}
        aria-disabled={disabled || undefined}
        {...(props as React.ComponentProps<typeof BaseFieldset.Root>)}
        className={cn(
          // A <fieldset>: reset its default chrome (min-inline-size: min-content would stop wrapping).
          "m-0 flex min-w-0 max-w-full border-0 p-0",
          // Toggles fit their content on their own (w-fit); inside a group the group's layout
          // decides, as for Buttons (stretch when vertical/stacked, grow when `grow`). Icon-only
          // toggles keep their square.
          "[&>[data-slot=toggle]:not([data-icon-only])]:w-auto",
          // ---- Attached (connected) ----
          attached && connectedClasses(orientation),
          attached && horizontal && cn("items-stretch", justify[align]),
          attached && !horizontal && "w-fit",
          // Solid buttons have no border: draw a divider so the boundary between actions
          // is visible (WCAG 1.4.11). Drawn from the button's own text colour at 50%, which always
          // contrasts with its fill (the surface colour vanished on inverse buttons).
          attached &&
            horizontal &&
            "[&>:is([data-variant=solid]+[data-variant=solid],[data-variant=solid]+[data-base-ui-focus-guard]+[data-variant=solid],[data-variant=solid]+[type=hidden]+[data-variant=solid])]:shadow-[inset_1px_0_0_color-mix(in_srgb,currentColor_50%,transparent)]",
          attached &&
            !horizontal &&
            "[&>:is([data-variant=solid]+[data-variant=solid],[data-variant=solid]+[data-base-ui-focus-guard]+[data-variant=solid],[data-variant=solid]+[type=hidden]+[data-variant=solid])]:shadow-[inset_0_1px_0_color-mix(in_srgb,currentColor_50%,transparent)]",
          // Inputs and Select triggers fill the remaining space in an attached row (shadcn, Ant).
          attached &&
            horizontal &&
            "[&>[data-slot=input-group]]:min-w-0 [&>[data-slot=input-group]]:flex-1 [&>[data-slot=select-trigger]]:w-auto [&>[data-slot=select-trigger]]:min-w-0",
          // ---- Spaced ----
          !attached && "gap-[var(--sp-control-gap)]",
          !attached &&
            horizontal &&
            !stacks &&
            cn("flex-row flex-wrap items-center", justify[align]),
          // GOV.UK: stack full width on small screens, row from `sm` up.
          stacks &&
            cn("flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center", smJustify[align]),
          !attached && !horizontal && cn("flex-col", grow ? "items-stretch" : itemsAlign[align]),
          // ---- Grow ----
          grow && horizontal && "[&>:not([role=separator])]:flex-1",
          grow && !horizontal && "w-full [&>:not([role=separator])]:w-full",
          className,
        )}
      >
        <ButtonGroupContext.Provider value={groupCtx}>
          <LayoutContext.Provider value={layoutCtx}>{children}</LayoutContext.Provider>
        </ButtonGroupContext.Provider>
      </BaseFieldset.Root>
    );
  },
);
Root.displayName = "ButtonGroup.Root";

/* ============================================================
 * Separator
 * ============================================================ */

const Separator = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseSeparator>>(
  ({ className, orientation, ...props }, ref) => {
    const layout = React.useContext(LayoutContext);
    // A separator runs across the group: vertical in a row, horizontal in a column.
    const resolved =
      orientation ?? (layout.orientation === "horizontal" ? "vertical" : "horizontal");
    return (
      <BaseSeparator
        ref={ref}
        data-slot="button-group-separator"
        orientation={resolved}
        className={mergeClassName(
          cn(
            "bg-border-control shrink-0 forced-colors:bg-[CanvasText]",
            resolved === "vertical" ? "w-px self-stretch" : "h-px w-full self-stretch",
            // Spaced groups already have a gap; keep the line short of the buttons' edges.
            !layout.attached && (resolved === "vertical" ? "my-1.5" : "mx-1.5"),
          ),
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = "ButtonGroup.Separator";

/* ============================================================
 * Text — a non-interactive segment (shadcn ButtonGroupText, Mantine GroupSection)
 * ============================================================ */

export interface ButtonGroupTextProps extends React.ComponentPropsWithRef<"span"> {
  /** Replace the rendered element, e.g. a `<label>` (Base UI `render`). Default: a `<span>`. */
  render?: useRender.RenderProp;
}

const textHeight = {
  sm: "h-[var(--sp-control-height-sm)] px-2.5",
  md: "h-[var(--sp-control-height)] px-3",
  lg: "h-[var(--sp-control-height-lg)] px-4 text-base",
} as const;

const Text = React.forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  ({ className, render, ...props }, ref) => {
    const group = React.useContext(ButtonGroupContext);
    return useRender({
      render,
      ref,
      defaultTagName: "span",
      props: {
        "data-slot": "button-group-text",
        ...props,
        className: cn(
          "bg-surface-sunken text-fg-default border-border-control inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-2 text-sm font-medium",
          "rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
          "[&>svg]:size-[var(--sp-control-icon)]",
          textHeight[group?.size ?? "md"],
          className,
        ),
      },
    });
  },
);
Text.displayName = "ButtonGroup.Text";

export const ButtonGroup = {
  Root,
  Separator,
  Text,
};
