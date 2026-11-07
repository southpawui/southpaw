import * as React from "react";
import { cn } from "../../lib/cn";

const Root = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "bg-surface-raised border-border-default rounded-[var(--radius-lg)] border shadow-sm",
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Card.Root";

const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
      {...props}
    />
  ),
);
Header.displayName = "Card.Header";

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

const Content = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn("p-6", className)} {...props} />
  ),
);
Content.displayName = "Card.Content";

const Footer = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  ),
);
Footer.displayName = "Card.Footer";

export const Card = { Root, Header, Title, Description, Content, Footer };
