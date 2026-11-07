import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Spinner } from "../Spinner/Spinner";
import { cn } from "../../lib/cn";

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
      variant = "solid",
      color = "default",
      size = "md",
      icon,
      iconPosition = "start",
      srOnly,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
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
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        disabled={loading || props.disabled}
        className={cn(
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
          !loading && "active:scale-[var(--sp-scale-press)]",
          // Focus — two-tone ring
          "focus-visible:sp-focus-ring",
          // Disabled / loading
          "disabled:pointer-events-none disabled:opacity-[var(--sp-state-disabled-opacity)]",
          // Loading keeps full opacity (unlike disabled)
          loading && "pointer-events-none opacity-80",

          // Color × Variant
          colorVariantClasses[color]?.[variant],

          // Sizes (density-aware) — tighten padding on icon side
          isIconOnly && "h-[var(--sp-control-height)] w-[var(--sp-control-height)]",
          size === "sm" && !hasIcon && "h-[var(--sp-control-height-sm)] px-3 text-sm",
          size === "sm" && iconStart && "h-[var(--sp-control-height-sm)] pl-2 pr-3 text-sm",
          size === "sm" && iconEnd && "h-[var(--sp-control-height-sm)] pl-3 pr-2 text-sm",
          size === "md" && !hasIcon && "h-[var(--sp-control-height)] px-4 text-sm",
          size === "md" && iconStart && "h-[var(--sp-control-height)] pl-3 pr-4 text-sm",
          size === "md" && iconEnd && "h-[var(--sp-control-height)] pl-4 pr-3 text-sm",
          size === "lg" && !hasIcon && "h-[var(--sp-control-height-lg)] px-6 text-base",
          size === "lg" && iconStart && "h-[var(--sp-control-height-lg)] pl-4 pr-6 text-base",
          size === "lg" && iconEnd && "h-[var(--sp-control-height-lg)] pl-6 pr-4 text-base",

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
