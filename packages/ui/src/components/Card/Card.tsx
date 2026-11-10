import * as React from "react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

export interface CardRootProps extends React.ComponentPropsWithRef<"div"> {
  /** Visual style */
  variant?: "elevated" | "outline" | "filled";
  /** Makes the card interactive — adds hover effect and cursor */
  interactive?: boolean;
  /** Layout direction — vertical (image on top) or horizontal (image on side) */
  direction?: "vertical" | "horizontal";
}

const Root = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, variant = "elevated", interactive, direction = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      data-variant={variant}
      data-direction={direction}
      data-interactive={interactive ? "" : undefined}
      className={cn(
        // flex-col for vertical layout + footer mt-auto; overridden by sm:grid when horizontal
        "flex flex-col overflow-clip rounded-[var(--radius-lg)]",
        // Variants
        variant === "elevated" && "bg-surface-raised border-border-default border shadow-sm",
        variant === "outline" && "bg-surface-base border-border-default border",
        variant === "filled" && "bg-surface-alternate border border-transparent",
        // Direction — horizontal: stacks on mobile, side-by-side at sm+
        direction === "horizontal" &&
          "sm:grid sm:grid-cols-[auto_1fr] sm:items-stretch sm:*:col-start-2 sm:[&>[data-slot=card-image]]:col-start-1 sm:[&>[data-slot=card-image]]:[grid-row:1/span_99]",
        // Interactive
        interactive &&
          "hover:border-fg-muted origin-center cursor-pointer transition-[border-color,box-shadow,transform] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] active:scale-[var(--sp-scale-press)]",
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Card.Root";

/* ============================================================
 * Header
 * ============================================================ */

const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        // Always grid — shadcn pattern
        "grid auto-rows-min gap-1.5 p-6 pb-0",
        // When HeaderAction present: two-column layout
        "has-[[data-slot=card-header-action]]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  ),
);
Header.displayName = "Card.Header";

/* ============================================================
 * Icon (leading icon in header)
 * ============================================================ */

const Icon = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="card-icon"
      className={cn(
        "text-fg-muted bg-surface-alternate flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  ),
);
Icon.displayName = "Card.Icon";

/* ============================================================
 * HeaderAction (action slot pinned top-right in header)
 * ============================================================ */

const HeaderAction = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex shrink-0 items-center gap-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  ),
);
HeaderAction.displayName = "Card.HeaderAction";

/* ============================================================
 * Eyebrow
 * ============================================================ */

const Eyebrow = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="card-eyebrow"
      className={cn("text-fg-muted text-xs font-medium uppercase tracking-wide", className)}
      {...props}
    />
  ),
);
Eyebrow.displayName = "Card.Eyebrow";

/* ============================================================
 * Title
 * ============================================================ */

const Title = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithRef<"h3">>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("text-fg-default text-lg font-semibold", className)}
      {...props}
    >
      {children}
    </h3>
  ),
);
Title.displayName = "Card.Title";

/* ============================================================
 * Description
 * ============================================================ */

const Description = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-fg-muted text-sm", className)}
      {...props}
    />
  ),
);
Description.displayName = "Card.Description";

/* ============================================================
 * Content
 * ============================================================ */

const Content = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn("p-6", className)} {...props} />
  ),
);
Content.displayName = "Card.Content";

/* ============================================================
 * Footer
 * ============================================================ */

const Footer = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        "mt-auto flex flex-wrap items-center gap-2 p-6 pt-0",
        "[&>[data-slot=button]]:w-full sm:[&>[data-slot=button]]:w-auto",
        "sm:gap-3",
        // Restore top padding when no Card.Content sibling exists
        "[:not(:has(>[data-slot=card-content]))>&]:pt-6",
        className,
      )}
      {...props}
    />
  ),
);
Footer.displayName = "Card.Footer";

/* ============================================================
 * Action (visual affordance for interactive cards — not a button)
 * ============================================================ */

const Action = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="card-action"
      className={cn(
        "text-fg-muted inline-flex items-center gap-1.5 text-sm font-medium",
        "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
        "[[data-slot=card]:hover_&]:text-fg-default",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);
Action.displayName = "Card.Action";

/* ============================================================
 * Image
 * ============================================================ */

interface CardImageProps extends Omit<React.ComponentPropsWithRef<"div">, "children"> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Inline styles passed to the inner <img> element */
  imgStyle?: React.CSSProperties;
}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, alt = "", src, imgStyle, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-image"
      className={cn(
        "relative overflow-clip",
        // Vertical: full width
        "[[data-direction=vertical]_&]:w-full",
        // Horizontal: full width + fixed height on mobile, fixed width at sm+
        "[[data-direction=horizontal]_&]:h-48 [[data-direction=horizontal]_&]:w-full",
        "[[data-direction=horizontal]_&]:sm:h-auto [[data-direction=horizontal]_&]:sm:w-48",
        className,
      )}
      {...props}
    >
      <img
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--sp-duration-slow)] ease-[var(--sp-easing-default)] [[data-slot=card][data-interactive]:hover_&]:scale-105"
        src={src}
        alt={alt}
        style={imgStyle}
      />
    </div>
  ),
);
CardImage.displayName = "Card.Image";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Card = {
  Root,
  Header,
  Icon,
  HeaderAction,
  Eyebrow,
  Title,
  Description,
  Content,
  Footer,
  Action,
  Image: CardImage,
};
