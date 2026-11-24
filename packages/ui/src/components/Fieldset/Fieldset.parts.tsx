"use client";

import * as React from "react";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";

/* ============================================================
 * Root
 * ============================================================ */

/**
 * Lets Fieldset.Error register its id so the <fieldset> is described by it (GEO-957 / GEO-939).
 * The error used to be a role="alert" live region, which screen readers announced on page load
 * whenever the page rendered with an error. Validation messages aren't live regions (GOV.UK,
 * Primer; Base UI's Field.Error has no role either): the ErrorSummary announces, and the
 * group's description is read when focus enters it.
 */
/** Each shown Fieldset.Error adds its id, and removes it when hidden or unmounted. */
type FieldsetErrorRegistry = { add: (id: string) => void; remove: (id: string) => void };
const FieldsetErrorContext = React.createContext<FieldsetErrorRegistry | null>(null);

const Root = React.forwardRef<HTMLFieldSetElement, React.ComponentProps<typeof BaseFieldset.Root>>(
  ({ className, children, ...props }, ref) => {
    // A list, so several Fieldset.Errors (or one remounting) don't clear each other.
    const [errorIds, setErrorIds] = React.useState<string[]>([]);
    const registry = React.useMemo<FieldsetErrorRegistry>(
      () => ({
        add: (id) => setErrorIds((ids) => (ids.includes(id) ? ids : [...ids, id])),
        remove: (id) => setErrorIds((ids) => ids.filter((x) => x !== id)),
      }),
      [],
    );
    const describedBy =
      [props["aria-describedby"], ...errorIds].filter(Boolean).join(" ") || undefined;
    return (
      <FieldsetErrorContext.Provider value={registry}>
        <BaseFieldset.Root
          ref={ref}
          data-slot="fieldset"
          className={cn(
            "border-border-default rounded-lg border p-6",
            // No container opacity when disabled (GEO-962): the controls and Field.Labels inside dim
            // themselves (native :disabled / Base UI data-disabled from this Fieldset), so dimming the
            // container too left them at ~0.14. Only the legend and description dim here.
            className,
          )}
          {...props}
          aria-describedby={describedBy}
        >
          {children}
        </BaseFieldset.Root>
      </FieldsetErrorContext.Provider>
    );
  },
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
    className={mergeClassName(
      cn(
        "text-fg-default text-sm font-semibold",
        // Base UI sets data-disabled on the legend from its Fieldset (GEO-962).
        "data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
      ),
      className,
    )}
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
      className={mergeClassName(
        cn(
          "text-fg-muted mt-1 text-sm",
          // A plain <p>: dim from the disabled Fieldset around it (Base UI sets data-disabled there).
          "[[data-slot=fieldset][data-disabled]_&]:opacity-[var(--sp-state-disabled-opacity)]",
        ),
        className,
      )}
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
  ({ className, errors, children, id: idProp, ...props }, ref) => {
    const content = errors?.length ? errors : children ? [children] : [];
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const register = React.useContext(FieldsetErrorContext);
    const shown = content.length > 0;
    React.useEffect(() => {
      if (!register || !shown) return;
      register.add(id);
      return () => register.remove(id);
    }, [register, shown, id]);
    if (!shown) return null;

    return (
      <div
        ref={ref}
        id={id}
        data-slot="fieldset-error"
        className={mergeClassName(
          cn("text-danger mt-2 flex items-start gap-1.5 text-sm"),
          className,
        )}
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

// Parts for the server-safe namespace in ./Fieldset (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
export {
  Root as FieldsetRoot,
  Legend as FieldsetLegend,
  Description as FieldsetDescription,
  Error as FieldsetError,
};
