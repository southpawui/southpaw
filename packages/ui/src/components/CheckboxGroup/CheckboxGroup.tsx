import * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";

/* ============================================================
 * Root
 * ============================================================ */

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseCheckboxGroup>>(
  ({ className, render, ...props }, ref) => (
    <BaseCheckboxGroup
      ref={ref}
      data-slot="checkbox-group"
      className={mergeClassName(cn("flex flex-col gap-[var(--sp-control-gap)]"), className)}
      // Base UI's CheckboxGroup (unlike RadioGroup) doesn't expose aria-disabled, so a disabled
      // group — set directly, from Field.Root, or from an ancestor Fieldset — wasn't announced
      // as disabled, and its (dimmed) group label failed axe contrast.
      render={
        render ??
        ((renderProps, state) => (
          <div {...renderProps} aria-disabled={state.disabled || undefined} />
        ))
      }
      {...props}
    />
  ),
);
Root.displayName = "CheckboxGroup.Root";

/* ============================================================
 * Compound export
 * ============================================================ */

export const CheckboxGroup = { Root };
