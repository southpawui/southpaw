"use client";

import * as React from "react";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { connectedClasses } from "../../lib/connected";
import { ButtonGroupContext, type ButtonGroupContextValue } from "../ButtonGroup/context";
import { Toggle } from "../Toggle/Toggle";
import { ToggleGroupContext, type ToggleGroupContextValue } from "./context";

function isDev(): boolean {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env;
  return env?.NODE_ENV !== "production";
}

type BaseRootProps = React.ComponentProps<typeof BaseToggleGroup>;
type ChangeDetails = Parameters<NonNullable<BaseRootProps["onValueChange"]>>[1];
type Orientation = "horizontal" | "vertical";

/** An item for the data-driven `items` prop (Mantine `data`, Ant `options`, Chakra `items`). */
export interface ToggleGroupItem {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  pressedIcon?: React.ReactNode;
  /** Accessible name for an icon-only item. */
  srOnly?: string;
  disabled?: boolean;
}

export interface ToggleGroupRootProps
  extends
    Omit<
      BaseRootProps,
      "className" | "value" | "defaultValue" | "onValueChange" | "color" | "orientation"
    >,
    Omit<ButtonGroupContextValue, "disabled"> {
  className?: string;
  /** Pressed values (controlled). Always an array, in single mode too (Base UI). */
  value?: string[];
  /** Initially pressed values (uncontrolled). */
  defaultValue?: string[];
  onValueChange?: (value: string[], eventDetails: ChangeDetails) => void;
  /** Layout direction; arrow keys follow it. Default: "horizontal" */
  orientation?: Orientation;
  /** Join the items into one segmented control. Default: true. `false` spaces them. */
  attached?: boolean;
  /** Items share the full width equally (Mantine fullWidth, Ant block, Spectrum isJustified). */
  grow?: boolean;
  /** Never let the selection become empty — deselecting the last item is ignored (Spectrum). */
  disallowEmptySelection?: boolean;
  /** Every item stays focusable but none can change (Mantine, Chakra). */
  readOnly?: boolean;
  /** Danger border on the items + aria-invalid (Chakra). Pair with Field.Error. */
  invalid?: boolean;
  /** Form validation: the form can't submit while nothing is selected. */
  required?: boolean;
  /** Submit with a form: one hidden input per selected value, all named `name`. */
  name?: string;
  /** Below this breakpoint, item labels become screen-reader-only and icons stay (Primer). */
  hideLabelsBelow?: "sm" | "md" | false;
  /**
   * An animated highlight that slides to the pressed item (Mantine, Chakra, Ant). Applies to
   * single-select attached groups. Respects reduced motion. Default: true
   */
  slidingIndicator?: boolean;
  /** Data-driven items, rendered as Toggles before any children. */
  items?: ToggleGroupItem[];
}

/* Sliding-indicator fill per variant × colour (mirrors the Toggle's pressed fill). */
const indicatorFill = {
  tint: {
    default: "before:bg-accent/10",
    brand: "before:bg-brand/10",
    danger: "before:bg-danger/10",
    inverse: "before:bg-surface-base/15",
  },
  solid: {
    default: "before:bg-accent",
    brand: "before:bg-brand",
    danger: "before:bg-danger",
    inverse: "before:bg-surface-base",
  },
} as const;

const Root = React.forwardRef<HTMLDivElement, ToggleGroupRootProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = [],
      onValueChange,
      orientation = "horizontal",
      multiple = false,
      attached = true,
      grow = false,
      disallowEmptySelection = false,
      readOnly = false,
      invalid: invalidProp = false,
      required = false,
      name,
      hideLabelsBelow = false,
      slidingIndicator = true,
      items,
      size,
      variant,
      color,
      disabled = false,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const invalid =
      invalidProp || props["aria-invalid"] === true || props["aria-invalid"] === "true";
    const horizontal = orientation === "horizontal";

    // Mirror the value so the hidden form inputs (and required check) can follow it.
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);
    const value = valueProp ?? uncontrolled;

    const handleValueChange = (next: string[], details: ChangeDetails) => {
      if (readOnly || (disallowEmptySelection && next.length === 0)) {
        details.cancel();
        return;
      }
      onValueChange?.(next, details);
      if (!details.isCanceled && valueProp === undefined) setUncontrolled(next);
    };

    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];
    React.useEffect(() => {
      if (ariaLabel || ariaLabelledBy || !isDev()) return;
      console.warn(
        "[Southpaw] ToggleGroup: give the group an aria-label or aria-labelledby so screen " +
          "readers announce what the options are for.",
      );
    }, [ariaLabel, ariaLabelledBy]);

    /* ---------- Sliding indicator ---------- */
    const sliding = slidingIndicator && !multiple && attached;
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    React.useLayoutEffect(() => {
      const root = rootRef.current;
      if (!sliding || !root) return;
      let frame = 0;
      const measure = () => {
        const item = root.querySelector<HTMLElement>(":scope > [data-slot=toggle][data-pressed]");
        if (!item) {
          // Also drop a pending "ready" frame: if the press clears within the first frame,
          // that frame would otherwise bring the indicator back with nothing pressed (GEO-974).
          cancelAnimationFrame(frame);
          root.removeAttribute("data-indicator");
          return;
        }
        // offset* are relative to the (position: relative) root and physical, so this also
        // holds in RTL; the ::before is placed with physical left/top + translate.
        root.style.setProperty("--sp-tg-x", `${item.offsetLeft}px`);
        root.style.setProperty("--sp-tg-y", `${item.offsetTop}px`);
        root.style.setProperty("--sp-tg-w", `${item.offsetWidth}px`);
        root.style.setProperty("--sp-tg-h", `${item.offsetHeight}px`);
        root.style.setProperty("--sp-tg-r", getComputedStyle(item).borderRadius);
        if (!root.hasAttribute("data-indicator")) {
          // First placement: show it without sliding in from 0, then enable the transition.
          root.setAttribute("data-indicator", "");
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            // Only if it's still shown (nothing un-pressed in the meantime)
            if (root.hasAttribute("data-indicator")) root.setAttribute("data-indicator", "ready");
          });
        }
      };
      measure();
      // Pressed changes (controlled or not) and size changes (density, resize, font load).
      const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
      const observeChildren = () =>
        Array.from(root.children).forEach((child) => resize?.observe(child));
      resize?.observe(root);
      observeChildren();
      // Pressed changes, and items added/removed after mount (observe is idempotent).
      const mutations = new MutationObserver(() => {
        observeChildren();
        measure();
      });
      mutations.observe(root, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-pressed"],
      });
      return () => {
        cancelAnimationFrame(frame);
        mutations.disconnect();
        resize?.disconnect();
        root.removeAttribute("data-indicator");
      };
    }, [sliding, orientation, items]);

    const buttonGroupCtx = React.useMemo<ButtonGroupContextValue>(
      () => ({ size, variant, color, disabled }),
      [size, variant, color, disabled],
    );
    const toggleGroupCtx = React.useMemo<ToggleGroupContextValue>(
      () => ({ readOnly, invalid, orientation, attached }),
      [readOnly, invalid, orientation, attached],
    );

    const resolvedVariant = variant ?? "outline";
    const resolvedColor = color ?? "default";

    const focusFirstItem = () =>
      rootRef.current?.querySelector<HTMLElement>("[data-slot=toggle]:not(:disabled)")?.focus();

    return (
      <BaseToggleGroup
        ref={setRefs}
        data-slot="toggle-group"
        data-attached={attached ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-required={required ? "" : undefined}
        value={valueProp}
        defaultValue={valueProp === undefined ? defaultValue : undefined}
        onValueChange={handleValueChange}
        multiple={multiple}
        orientation={orientation}
        disabled={disabled}
        {...props}
        className={mergeClassName(
          cn(
            "relative max-w-full",
            grow ? "flex w-full" : "inline-flex",
            // Toggles fit their content on their own; inside the group its layout decides.
            // Icon-only items keep their square.
            "[&>[data-slot=toggle]:not([data-icon-only])]:w-auto",
            // ---- Attached ----
            attached && connectedClasses(orientation),
            attached && horizontal && "items-stretch",
            attached && !horizontal && !grow && "w-fit",
            attached &&
              horizontal &&
              "[&>:is([data-variant=solid]+[data-variant=solid],[data-variant=solid]+[type=hidden]+[data-variant=solid])]:shadow-[inset_1px_0_0_color-mix(in_srgb,currentColor_50%,transparent)]",
            attached &&
              !horizontal &&
              "[&>:is([data-variant=solid]+[data-variant=solid],[data-variant=solid]+[type=hidden]+[data-variant=solid])]:shadow-[inset_0_1px_0_color-mix(in_srgb,currentColor_50%,transparent)]",
            // ---- Spaced ----
            !attached && "gap-[var(--sp-control-gap)]",
            !attached && horizontal && "flex-row flex-wrap items-center",
            !attached && !horizontal && "flex-col items-stretch",
            // ---- Grow ----
            grow && horizontal && "[&>:not([role=separator])]:flex-1",
            grow && !horizontal && "[&>:not([role=separator])]:w-full",
            // ---- Hide labels on small screens (labels stay as the accessible name) ----
            hideLabelsBelow === "sm" && "max-sm:[&_[data-slot=toggle-label]]:sr-only",
            hideLabelsBelow === "md" && "max-md:[&_[data-slot=toggle-label]]:sr-only",
            // ---- Sliding indicator: the root's ::before, under the pressed item ----
            sliding && [
              "before:pointer-events-none before:absolute before:left-0 before:top-0 before:content-['']",
              "before:h-[var(--sp-tg-h)] before:w-[var(--sp-tg-w)] before:translate-x-[var(--sp-tg-x)] before:translate-y-[var(--sp-tg-y)] before:rounded-[var(--sp-tg-r)]",
              "before:opacity-0 data-[indicator]:before:opacity-100",
              "data-[indicator=ready]:before:transition-[translate,width,height,opacity] data-[indicator=ready]:before:duration-[var(--sp-duration-normal)] data-[indicator=ready]:before:ease-[var(--sp-easing-default)] motion-reduce:before:!transition-none",
              "forced-colors:before:hidden",
              indicatorFill[resolvedVariant === "solid" ? "solid" : "tint"][resolvedColor],
              // The indicator is the pressed fill, so the pressed item itself goes transparent.
              "[&>[data-slot=toggle][data-pressed]]:!bg-transparent forced-colors:[&>[data-slot=toggle][data-pressed]]:!bg-[Highlight]",
            ],
          ),
          className,
        )}
      >
        <ButtonGroupContext.Provider value={buttonGroupCtx}>
          <ToggleGroupContext.Provider value={toggleGroupCtx}>
            {items?.map((item) => (
              <Toggle
                key={item.value}
                value={item.value}
                label={item.label}
                icon={item.icon}
                pressedIcon={item.pressedIcon}
                srOnly={item.srOnly}
                disabled={item.disabled}
                size={!item.label && item.icon ? "icon" : undefined}
              />
            ))}
            {children}
          </ToggleGroupContext.Provider>
        </ButtonGroupContext.Provider>
        {name &&
          !disabled &&
          value.map((v) => (
            <input key={v} type="hidden" data-slot="toggle-group-input" name={name} value={v} />
          ))}
        {required && (
          // Constraint validation can't use a hidden input: a visually hidden, required text
          // input blocks submission while nothing is selected; focusing it moves to the group.
          <input
            data-slot="toggle-group-required"
            data-connected-ignore=""
            aria-hidden="true"
            tabIndex={-1}
            required
            value={value.length ? value.join(",") : ""}
            onChange={() => {}}
            onFocus={focusFirstItem}
            className="sr-only"
          />
        )}
      </BaseToggleGroup>
    );
  },
);
Root.displayName = "ToggleGroup.Root";

/* ============================================================
 * Separator — runs across the group (Primer Divider)
 * ============================================================ */

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSeparator> & { className?: string }
>(({ className, orientation, ...props }, ref) => {
  const group = React.useContext(ToggleGroupContext);
  // Runs across the group: vertical in a row, horizontal in a column.
  const resolved = orientation ?? (group?.orientation === "vertical" ? "horizontal" : "vertical");
  return (
    <BaseSeparator
      ref={ref}
      data-slot="toggle-group-separator"
      orientation={resolved}
      className={mergeClassName(
        cn(
          "bg-border-control shrink-0 self-stretch forced-colors:bg-[CanvasText]",
          resolved === "vertical" ? "w-px" : "h-px w-full",
          // Spaced groups: keep the line short of the items (like ButtonGroup.Separator).
          !group?.attached && (resolved === "vertical" ? "my-1.5" : "mx-1.5"),
        ),
        className,
      )}
      {...props}
    />
  );
});
Separator.displayName = "ToggleGroup.Separator";

// Parts for the server-safe namespace in ./ToggleGroup (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
export { Root as ToggleGroupRoot, Separator as ToggleGroupSeparator };
