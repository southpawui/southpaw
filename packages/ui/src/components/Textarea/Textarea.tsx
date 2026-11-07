import * as React from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  /** Show a character count. Pass the max length. */
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, onChange, ...props }, ref) => {
    const [length, setLength] = React.useState(() =>
      typeof props.defaultValue === "string" ? props.defaultValue.length : 0,
    );

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLength(e.target.value.length);
        onChange?.(e);
      },
      [onChange],
    );

    return (
      <div data-slot="textarea-wrapper" className="relative">
        <textarea
          ref={ref}
          data-slot="textarea"
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            // Base
            "bg-surface-base text-fg-default w-full rounded-[var(--radius-DEFAULT)]",
            "min-h-20 resize-y px-3 py-2 text-sm",
            // Border
            "border-border-control border-2",
            // Placeholder
            "placeholder:text-fg-muted",
            // Transition
            "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
            // Hover
            "hover:border-fg-muted",
            // Focus
            "focus-visible:sp-focus-ring",
            // Invalid
            "data-[invalid]:border-danger",
            // Disabled
            "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-[var(--sp-state-disabled-opacity)]",
            // Read-only
            "read-only:bg-surface-sunken read-only:border-border-default",
            // If character count shown, add bottom padding
            maxLength && "pb-7",
            className,
          )}
          {...props}
        />
        {maxLength && (
          <span
            data-slot="textarea-count"
            className={cn(
              "text-fg-muted pointer-events-none absolute bottom-2 right-3 text-xs",
              length > maxLength && "text-danger",
            )}
            aria-live="polite"
          >
            {length}/{maxLength}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
