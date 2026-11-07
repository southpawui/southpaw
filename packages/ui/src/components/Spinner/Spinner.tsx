import * as React from "react";
import { cn } from "../../lib/cn";

export interface SpinnerProps extends React.ComponentPropsWithRef<"svg"> {
  /** Size follows the parent's font size by default. Override with a class or explicit size. */
  size?: "sm" | "md" | "lg";
}

/**
 * Accessible loading spinner.
 *
 * - Inherits color from currentColor
 * - Inherits size from --sp-control-icon or explicit size prop
 * - Slows animation under prefers-reduced-motion (BRIEF 7a)
 * - Uses role="status" with sr-only "Loading" text
 */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <svg
      ref={ref}
      data-slot="spinner"
      role="status"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "animate-spin text-current motion-reduce:animate-[spin_3s_linear_infinite]",
        // Sizes
        size === "sm" && "h-4 w-4",
        size === "md" && "h-5 w-5",
        size === "lg" && "h-6 w-6",
        // Default: inherit from icon sizing
        !size && "h-[1em] w-[1em]",
        className,
      )}
      {...props}
    >
      <title>Loading</title>
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
  ),
);

Spinner.displayName = "Spinner";
