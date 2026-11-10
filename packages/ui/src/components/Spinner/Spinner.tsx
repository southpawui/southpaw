import * as React from "react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Spinner
 * ============================================================ */

export interface SpinnerProps extends React.ComponentPropsWithRef<"span"> {
  /** Size follows the parent's font size by default. Override with explicit size. */
  size?: "sm" | "md" | "lg";
  /** Optional label text alongside the spinner */
  label?: string;
  /** Visual style: circle (default spinning ring) or dots (three bouncing dots) */
  variant?: "circle" | "dots";
}

const sizeClasses: Record<string, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const dotSizeClasses: Record<string, string> = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label, variant = "circle", ...props }, ref) => (
    <span
      ref={ref}
      data-slot="spinner"
      role="status"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {variant === "circle" && (
        <svg
          data-slot="spinner-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={cn(
            "animate-spin text-current motion-reduce:animate-[spin_3s_linear_infinite]",
            size ? sizeClasses[size] : "h-[1em] w-[1em]",
          )}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-20"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}

      {variant === "dots" && (
        <span
          data-slot="spinner-dots"
          aria-hidden="true"
          className="inline-flex items-center gap-1"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "rounded-full bg-current",
                "animate-bounce motion-reduce:animate-none",
                size ? dotSizeClasses[size] : "h-1.5 w-1.5",
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      )}

      {label ? (
        <span className="text-fg-default text-sm">{label}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </span>
  ),
);

Spinner.displayName = "Spinner";
