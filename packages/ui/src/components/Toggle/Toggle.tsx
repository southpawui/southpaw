import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { CheckIcon } from "@phosphor-icons/react";
import { Spinner } from "../Spinner/Spinner";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { ButtonGroupContext } from "../ButtonGroup/context";
import { ToggleGroupContext } from "../ToggleGroup/context";

function isDev(): boolean {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env;
  return env?.NODE_ENV !== "production";
}

type BaseToggleProps = React.ComponentProps<typeof BaseToggle>;

/** Drop hover classes (incl. `data-[pressed]:hover:`) for read-only/inactive toggles. */
function withoutHover(classes: string): string {
  return classes
    .split(" ")
    .filter((c) => !/(^|:)hover:/.test(c))
    .join(" ");
}

export interface ToggleProps extends Omit<BaseToggleProps, "color" | "className"> {
  className?: string;
  /** Visible text label. Use this or children — label takes precedence. */
  label?: string;
  /** Visual style, matching Button. Default: "outline" (or the ButtonGroup's variant). */
  variant?: "solid" | "outline" | "ghost";
  /** Colour of the pressed state, matching Button. Default: "default" (accent). */
  color?: "default" | "brand" | "danger" | "inverse";
  /** Size — "icon" renders a square toggle. Default: "md" (or the ButtonGroup's size). */
  size?: "sm" | "md" | "lg" | "icon";
  /** Icon shown when not pressed (and when pressed, unless `pressedIcon` is set). */
  icon?: React.ReactNode;
  /**
   * Icon shown instead of `icon` while pressed (e.g. an outline vs filled heart). The
   * accessible name must stay the same — if the meaning changes (Mute/Unmute), use a Button.
   */
  pressedIcon?: React.ReactNode;
  /** Position of the icon relative to text. Default: "start" */
  iconPosition?: "start" | "end";
  /** Screen-reader label — required for icon-only toggles. */
  srOnly?: string;
  /** Show a checkmark while pressed, so the state isn't carried by colour alone (Chakra, Mantine). */
  indicator?: boolean;
  /** Show a spinner and block toggling. */
  loading?: boolean;
  /** Focusable and announced, but the pressed state can't change (Mantine Chip). */
  readOnly?: boolean;
  /**
   * Looks disabled but stays focusable and hoverable, so a Tooltip can explain why
   * (Primer `inactive`). Exposed as `aria-disabled="true"`; toggling does nothing.
   */
  inactive?: boolean;
  /**
   * Submit with a form: renders a hidden input named `name` that sends `value` (default "on")
   * while pressed, and nothing while unpressed — like a checkbox.
   */
  name?: string;
}

/* Pressed look per colour. Not colour alone (WCAG 1.4.1): outline gets a thicker border (a 1px
 * outline drawn just inside the 2px border — an outline, not a box-shadow, because the focus ring
 * is a box-shadow and would otherwise be overridden on a focused pressed toggle); ghost gains a
 * border; solid goes from a muted fill to the full fill. */
const pressedByVariant = {
  outline: {
    default:
      "data-[pressed]:bg-accent/10 data-[pressed]:border-accent data-[pressed]:text-accent data-[pressed]:outline-1 data-[pressed]:outline-accent data-[pressed]:-outline-offset-3",
    brand:
      "data-[pressed]:bg-brand/10 data-[pressed]:border-brand data-[pressed]:text-brand data-[pressed]:outline-1 data-[pressed]:outline-brand data-[pressed]:-outline-offset-3",
    danger:
      "data-[pressed]:bg-danger/10 data-[pressed]:border-danger data-[pressed]:text-danger data-[pressed]:outline-1 data-[pressed]:outline-danger data-[pressed]:-outline-offset-3",
    inverse:
      "data-[pressed]:bg-surface-base/15 data-[pressed]:border-surface-base data-[pressed]:text-surface-base data-[pressed]:outline-1 data-[pressed]:outline-surface-base data-[pressed]:-outline-offset-3",
  },
  ghost: {
    default: "data-[pressed]:bg-accent/10 data-[pressed]:border-accent data-[pressed]:text-accent",
    brand: "data-[pressed]:bg-brand/10 data-[pressed]:border-brand data-[pressed]:text-brand",
    danger: "data-[pressed]:bg-danger/10 data-[pressed]:border-danger data-[pressed]:text-danger",
    inverse:
      "data-[pressed]:bg-surface-base/15 data-[pressed]:border-surface-base data-[pressed]:text-surface-base",
  },
  solid: {
    default:
      "data-[pressed]:bg-accent data-[pressed]:text-fg-on-brand data-[pressed]:hover:bg-accent/90",
    brand:
      "data-[pressed]:bg-brand data-[pressed]:text-fg-on-brand data-[pressed]:hover:bg-brand/90",
    danger:
      "data-[pressed]:bg-danger data-[pressed]:text-fg-on-danger data-[pressed]:hover:bg-danger/90",
    inverse:
      "data-[pressed]:bg-surface-base data-[pressed]:text-fg-default data-[pressed]:hover:bg-surface-base/90",
  },
} as const;

/* Unpressed look per variant (inverse sits on a dark surface). */
const offByVariant = {
  outline: {
    light: "border-border-control text-fg-default bg-transparent hover:bg-[var(--sp-state-hover)]",
    inverse: "border-surface-base/60 text-surface-base bg-transparent hover:bg-surface-base/10",
  },
  ghost: {
    light: "border-transparent text-fg-default bg-transparent hover:bg-[var(--sp-state-hover)]",
    inverse: "border-transparent text-surface-base bg-transparent hover:bg-surface-base/10",
  },
  solid: {
    light: "border-transparent bg-surface-sunken text-fg-default hover:bg-[var(--sp-state-hover)]",
    inverse: "border-transparent bg-surface-base/15 text-surface-base hover:bg-surface-base/25",
  },
} as const;

const sizeClasses = {
  sm: "h-[var(--sp-control-height-sm)] px-3 text-sm",
  md: "h-[var(--sp-control-height)] px-3 text-sm",
  lg: "h-[var(--sp-control-height-lg)] px-5 text-base",
} as const;

const iconSquare = {
  sm: "h-[var(--sp-control-height-sm)] w-[var(--sp-control-height-sm)]",
  md: "h-[var(--sp-control-height)] w-[var(--sp-control-height)]",
  lg: "h-[var(--sp-control-height-lg)] w-[var(--sp-control-height-lg)]",
} as const;

const iconSlot =
  "inline-flex shrink-0 [&>svg]:h-[var(--sp-control-icon)] [&>svg]:w-[var(--sp-control-icon)]";

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      label,
      variant: variantProp,
      color: colorProp,
      size: sizeProp,
      icon,
      pressedIcon,
      iconPosition = "start",
      srOnly,
      indicator = false,
      loading = false,
      readOnly: readOnlyProp = false,
      inactive = false,
      name,
      value,
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      disabled: disabledProp,
      children,
      ...props
    },
    ref,
  ) => {
    // Inside a ButtonGroup (or later ToggleGroup/Toolbar), the group's settings are defaults.
    const group = React.useContext(ButtonGroupContext);
    // A ToggleGroup also passes read-only and invalid to its items (GEO-933).
    const toggleGroup = React.useContext(ToggleGroupContext);
    const readOnly = readOnlyProp || Boolean(toggleGroup?.readOnly);
    const variant = variantProp ?? group?.variant ?? "outline";
    const color = colorProp ?? group?.color ?? "default";
    const size = sizeProp ?? group?.size ?? "md";
    const disabled = Boolean(group?.disabled) || Boolean(disabledProp) || loading;
    const isIconOnly = size === "icon";
    const squareSize = group?.size ?? "md";
    // Inactive / read-only keep focus: they're aria-disabled rather than natively disabled.
    const locked = !disabled && (inactive || readOnly);

    // Mirror the pressed state so the hidden form input can follow it (controlled or not).
    const [uncontrolled, setUncontrolled] = React.useState(defaultPressed);
    const pressed = pressedProp ?? uncontrolled;

    const handlePressedChange: NonNullable<BaseToggleProps["onPressedChange"]> = (
      next,
      details,
    ) => {
      if (locked) {
        details.cancel();
        return;
      }
      onPressedChange?.(next, details);
      if (!details.isCanceled && pressedProp === undefined) setUncontrolled(next);
    };

    const ariaLabelProp = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];
    React.useEffect(() => {
      if (!isIconOnly || srOnly || label || ariaLabelProp || ariaLabelledBy || !isDev()) return;
      console.warn(
        "[Southpaw] Toggle: an icon-only toggle needs an accessible name — pass `srOnly`, " +
          "`aria-label` or `aria-labelledby`.",
      );
    }, [isIconOnly, srOnly, label, ariaLabelProp, ariaLabelledBy]);

    const textContent = label ?? children;
    const ariaLabel = srOnly ?? (isIconOnly && typeof label === "string" ? label : undefined);

    const iconNode = loading ? (
      <span data-slot="toggle-icon" className={iconSlot}>
        <Spinner />
      </span>
    ) : icon || pressedIcon ? (
      <>
        {icon && (
          <span
            data-slot="toggle-icon"
            className={cn(iconSlot, pressedIcon && "group-data-[pressed]/toggle:hidden")}
          >
            {icon}
          </span>
        )}
        {pressedIcon && (
          <span
            data-slot="toggle-pressed-icon"
            className={cn(iconSlot, "hidden group-data-[pressed]/toggle:inline-flex")}
          >
            {pressedIcon}
          </span>
        )}
      </>
    ) : null;

    const indicatorNode = indicator ? (
      // Space is reserved while unpressed, so pressing doesn't shift the layout.
      <span
        data-slot="toggle-indicator"
        aria-hidden="true"
        className={cn(iconSlot, "opacity-0 group-data-[pressed]/toggle:opacity-100")}
      >
        <CheckIcon weight="bold" />
      </span>
    ) : null;

    const inverse = color === "inverse" ? "inverse" : "light";

    return (
      <>
        <BaseToggle
          ref={ref}
          data-slot="toggle"
          data-variant={variant}
          data-icon-only={isIconOnly ? "" : undefined}
          data-readonly={readOnly && !disabled ? "" : undefined}
          data-inactive={inactive && !disabled && !readOnly ? "" : undefined}
          value={value}
          pressed={pressedProp}
          defaultPressed={pressedProp === undefined ? defaultPressed : undefined}
          onPressedChange={handlePressedChange}
          disabled={disabled}
          aria-disabled={locked || undefined}
          aria-busy={loading || undefined}
          aria-invalid={toggleGroup?.invalid || undefined}
          aria-label={ariaLabel}
          className={mergeClassName(
            cn(
              "group/toggle inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium",
              // Fits its content by default, even in a column flex parent that would stretch it
              // (George, GEO-932). `className="w-full"` or ButtonGroup `grow` makes it full width.
              "w-fit",
              "rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))] border-2",
              "transition-[color,background-color,border-color,box-shadow,transform]",
              "duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
              "focus-visible:sp-focus-ring",
              !disabled && !locked && "active:scale-[var(--sp-scale-press)]",
              // Unpressed + pressed looks (no hover reaction while read-only / inactive)
              locked
                ? withoutHover(
                    `${offByVariant[variant][inverse]} ${pressedByVariant[variant][color]}`,
                  )
                : cn(offByVariant[variant][inverse], pressedByVariant[variant][color]),
              // Forced colours: system colours carry the pressed state.
              "forced-colors:data-[pressed]:border-[Highlight] forced-colors:data-[pressed]:outline-2 forced-colors:data-[pressed]:-outline-offset-4 forced-colors:data-[pressed]:outline-[Highlight]",
              // Invalid (shadcn): danger border from aria-invalid
              "aria-[invalid=true]:!border-danger",
              // Size
              isIconOnly ? cn(iconSquare[squareSize], "px-0") : sizeClasses[size],
              // Disabled / loading
              "disabled:pointer-events-none disabled:opacity-[var(--sp-state-disabled-opacity)]",
              loading && "disabled:opacity-80",
              // Read-only: focusable, state locked. The pressed look stays; unpressed goes sunken
              // like a read-only Input.
              readOnly &&
                !disabled &&
                "not-data-[pressed]:bg-surface-sunken not-data-[pressed]:border-border-default cursor-default",
              // Inactive: disabled look, pointer events stay on for a Tooltip
              inactive &&
                !disabled &&
                !readOnly &&
                "cursor-not-allowed opacity-[var(--sp-state-disabled-opacity)]",
            ),
            className,
          )}
          {...props}
        >
          {isIconOnly ? (
            (iconNode ?? textContent)
          ) : (
            <>
              {indicatorNode}
              {iconPosition === "start" && iconNode}
              {srOnly ? (
                <>
                  <span className="sr-only">{srOnly}</span>
                  {textContent}
                </>
              ) : textContent != null && textContent !== false ? (
                // Wrapped so a ToggleGroup can hide visible labels on small screens (hideLabelsBelow).
                <span data-slot="toggle-label" className="inline-flex items-center gap-2">
                  {textContent}
                </span>
              ) : null}
              {iconPosition === "end" && iconNode}
            </>
          )}
        </BaseToggle>
        {name && (
          <input
            type="hidden"
            data-slot="toggle-input"
            name={name}
            value={value ?? "on"}
            disabled={!pressed || disabled}
          />
        )}
      </>
    );
  },
);

Toggle.displayName = "Toggle";
