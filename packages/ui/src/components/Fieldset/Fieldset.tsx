import * as React from "react";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ============================================================
 * Root
 * ============================================================ */

const Root = React.forwardRef<HTMLFieldSetElement, React.ComponentProps<typeof BaseFieldset.Root>>(
  ({ className, ...props }, ref) => (
    <BaseFieldset.Root
      ref={ref}
      data-slot="fieldset"
      className={cn(
        "border-border-default rounded-lg border p-6",
        "disabled:opacity-[var(--sp-state-disabled-opacity)]",
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = "Fieldset.Root";

/* ============================================================
 * Legend
 * ============================================================ */

const Legend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentProps<typeof BaseFieldset.Legend>
>(({ className, ...props }, ref) => (
  <BaseFieldset.Legend
    ref={ref}
    data-slot="fieldset-legend"
    className={cn("text-fg-default text-sm font-semibold", className)}
    {...props}
  />
));
Legend.displayName = "Fieldset.Legend";

/* ============================================================
 * Description
 * ============================================================ */

const Description = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="fieldset-description"
      className={cn("text-fg-muted mt-1 text-sm", className)}
      {...props}
    />
  ),
);
Description.displayName = "Fieldset.Description";

/* ============================================================
 * Error
 * ============================================================ */

interface FieldsetErrorProps extends React.ComponentPropsWithRef<"p"> {
  /** Array of error messages (e.g. from form libraries) */
  errors?: string[];
}

const Error = React.forwardRef<HTMLParagraphElement, FieldsetErrorProps>(
  ({ className, errors, children, ...props }, ref) => {
    const content = errors?.length ? errors : children ? [children] : [];
    if (!content.length) return null;

    return (
      <div
        ref={ref}
        data-slot="fieldset-error"
        role="alert"
        className={cn("text-danger mt-2 flex items-start gap-1.5 text-sm", className)}
        {...props}
      >
        <WarningCircle weight="fill" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <span className="sr-only">Error: </span>
          {content.length === 1 ? (
            content[0]
          ) : (
            <ul className="list-inside list-disc">
              {content.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
);
Error.displayName = "Fieldset.Error";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Fieldset = { Root, Legend, Description, Error };
