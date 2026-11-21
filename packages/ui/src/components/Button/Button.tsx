import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Spinner } from "../Spinner/Spinner";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { ButtonGroupContext } from "../ButtonGroup/context";

export interface ButtonProps extends Omit<React.ComponentProps<typeof BaseButton>, "color"> {
  /** Visible text label. Use this or children — label takes precedence. */
  label?: string;
  /** Visual style */
  variant?: "solid" | "outline" | "ghost";
  /** Color intent */
  color?: "default" | "brand" | "danger" | "inverse";
  /** Size — "icon" renders a square button */
  size?: "sm" | "md" | "lg" | "icon";
  /** Icon element to render alongside or instead of text */
  icon?: React.ReactNode;
  /** Position of the icon relative to text */
  iconPosition?: "start" | "end";
  /** Screen reader label — use for icon-only buttons or to override the visible label */
  srOnly?: string;
  /** Show a loading spinner. Disables the button and replaces the icon. */
  loading?: boolean;
  /**
   * Looks and acts disabled but stays focusable and hoverable (Primer `inactive`), so a
   * Tooltip can explain why it's unavailable. Exposed as `aria-disabled="true"`; clicks and
   * Enter/Space do nothing. Prefer `disabled` when no explanation is needed.
   */
  inactive?: boolean;
}

/** Drop `hover:` classes (inactive buttons must not react to hover). Source keeps the literals. */
function withoutHover(classes: string | undefined): string | undefined {
  return classes
    ?.split(" ")
    .filter((c) => !c.startsWith("hover:"))
    .join(" ");
}

// Color × variant class map
const colorVariantClasses: Record<string, Record<string, string>> = {
  default: {
    solid: "bg-accent text-fg-on-brand hover:bg-accent/90",
    outline:
      "border-2 border-border-control text-fg-default bg-transparent hover:bg-[var(--sp-state-hover)]",
    ghost: "text-fg-default bg-transparent hover:bg-[var(--sp-state-hover)]",
  },
  brand: {
    solid: "bg-brand text-fg-on-brand hover:bg-brand/90",
    outline: "border-2 border-brand text-brand bg-transparent hover:bg-brand/10",
    ghost: "text-brand bg-transparent hover:bg-brand/10",
  },
  danger: {
    solid: "bg-danger text-fg-on-danger hover:bg-danger/90",
    outline: "border-2 border-danger text-danger bg-transparent hover:bg-danger/10",
    ghost: "text-danger bg-transparent hover:bg-danger/10",
  },
  inverse: {
    solid: "bg-surface-base text-fg-default hover:bg-surface-base/90",
    outline:
      "border-2 border-surface-base text-surface-base bg-transparent hover:bg-surface-base/10",
    ghost: "text-surface-base bg-transparent hover:bg-surface-base/10",
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      label,
      variant: variantProp,
      color: colorProp,
      size: sizeProp,
      icon,
      iconPosition = "start",
      srOnly,
      loading = false,
      inactive = false,
      disabled: disabledProp,
      children,
      ...props
    },
    ref,
  ) => {
    // Inside a ButtonGroup, the group's size/variant/color are defaults; the Button's own
    // props win. `disabled` from the group disables every Button (GEO-896).
    const group = React.useContext(ButtonGroupContext);
    const variant = variantProp ?? group?.variant ?? "solid";
    const color = colorProp ?? group?.color ?? "default";
    const size = sizeProp ?? group?.size ?? "md";
    const disabled = Boolean(group?.disabled) || disabledProp;
    // Inactive only applies while the button isn't genuinely disabled or loading.
    const isInactive = inactive && !disabled && !loading;
    const isIconOnly = size === "icon";
    // When loading, show spinner in place of icon
    const displayIcon = loading ? <Spinner /> : icon;
    const hasIcon = !!(displayIcon || loading);
    const iconStart = hasIcon && iconPosition === "start";
    const iconEnd = hasIcon && iconPosition === "end";
    // label prop takes precedence over children
    const textContent = label ?? children;
    // For icon-only buttons, use srOnly or label for accessibility
    const ariaLabel = srOnly ?? (isIconOnly && typeof label === "string" ? label : undefined);

    return (
      <BaseButton
        ref={ref}
        data-slot="button"
        data-variant={variant}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        disabled={loading || disabled || isInactive}
        // Base UI keeps a focusable-when-disabled button in the tab order with aria-disabled
        // and swallows activation (GEO-932: Primer `inactive`).
        focusableWhenDisabled={isInactive || undefined}
        data-inactive={isInactive ? "" : undefined}
        className={mergeClassName(
          cn(
            // Base
            "inline-flex cursor-pointer items-center justify-center font-medium",
            // Gap between icon/spinner and text (only when both present)
            !isIconOnly && hasIcon && "gap-2",
            // Shape — uses nested radius when container sets it, otherwise default
            "rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
            // Motion (Emil's easing)
            "transition-[color,background-color,border-color,box-shadow,transform]",
            "duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
            // Press feedback (Emil's scale) — not when loading
            !loading && !isInactive && "active:scale-[var(--sp-scale-press)]",
            // Focus — two-tone ring
            "focus-visible:sp-focus-ring",
            // Disabled / loading
            "disabled:pointer-events-none",
            // Loading is natively disabled too, but it isn't "unavailable": it keeps a light 90%
            // fade (busy) instead of the disabled fade. Before GEO-961 the :disabled rule won
            // (higher specificity), so a loading Button showed at the full disabled fade.
            loading
              ? "pointer-events-none opacity-90"
              : "disabled:opacity-[var(--sp-state-disabled-opacity)]",
            // Inactive: the disabled look, but pointer events stay on so a Tooltip can open.
            isInactive && "cursor-not-allowed opacity-[var(--sp-state-disabled-opacity)]",

            // Color × Variant
            isInactive
              ? withoutHover(colorVariantClasses[color]?.[variant])
              : colorVariantClasses[color]?.[variant],

            // Sizes (density-aware) — tighten padding on icon side
            // Icon-only buttons are square; inside a sized ButtonGroup they match its height.
            isIconOnly &&
              group?.size === "sm" &&
              "h-[var(--sp-control-height-sm)] w-[var(--sp-control-height-sm)]",
            isIconOnly &&
              group?.size === "lg" &&
              "h-[var(--sp-control-height-lg)] w-[var(--sp-control-height-lg)]",
            isIconOnly &&
              (group?.size ?? "md") === "md" &&
              "h-[var(--sp-control-height)] w-[var(--sp-control-height)]",
            size === "sm" && !hasIcon && "h-[var(--sp-control-height-sm)] px-3 text-sm",
            size === "sm" && iconStart && "h-[var(--sp-control-height-sm)] pl-2 pr-3 text-sm",
            size === "sm" && iconEnd && "h-[var(--sp-control-height-sm)] pl-3 pr-2 text-sm",
            size === "md" && !hasIcon && "h-[var(--sp-control-height)] px-4 text-sm",
            size === "md" && iconStart && "h-[var(--sp-control-height)] pl-3 pr-4 text-sm",
            size === "md" && iconEnd && "h-[var(--sp-control-height)] pl-4 pr-3 text-sm",
            size === "lg" && !hasIcon && "h-[var(--sp-control-height-lg)] px-6 text-base",
            size === "lg" && iconStart && "h-[var(--sp-control-height-lg)] pl-4 pr-6 text-base",
            size === "lg" && iconEnd && "h-[var(--sp-control-height-lg)] pl-6 pr-4 text-base",
          ),
          className,
        )}
        {...props}
      >
        {isIconOnly ? (
          <span
            data-slot="button-icon"
            className="shrink-0 [&>svg]:h-[var(--sp-control-icon)] [&>svg]:w-[var(--sp-control-icon)]"
          >
            {displayIcon ?? textContent}
          </span>
        ) : (
          <>
            {hasIcon && iconPosition === "start" && (
              <span
                data-slot="button-icon"
                className="shrink-0 [&>svg]:h-[var(--sp-control-icon)] [&>svg]:w-[var(--sp-control-icon)]"
              >
                {displayIcon}
              </span>
            )}
            {srOnly && !isIconOnly ? (
              <>
                <span className="sr-only">{srOnly}</span>
                {textContent}
              </>
            ) : (
              textContent
            )}
            {hasIcon && iconPosition === "end" && (
              <span
                data-slot="button-icon"
                className="shrink-0 [&>svg]:h-[var(--sp-control-icon)] [&>svg]:w-[var(--sp-control-icon)]"
              >
                {displayIcon}
              </span>
            )}
          </>
        )}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";
