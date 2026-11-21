import * as React from "react";
import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import { MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";

/* ============================================================
 * Helpers
 * ============================================================ */

function isDev(): boolean {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env;
  return env?.NODE_ENV !== "production";
}

/** Default accessible name for slots 2..N. Slot 1 is labelled by the Field label (Base UI). */
export function defaultSlotLabel(index: number, length: number): string {
  return `Character ${index + 1} of ${length}`;
}

/* ============================================================
 * Context
 * ============================================================ */

export type OTPFieldSize = "sm" | "md" | "lg";

interface OTPFieldContextValue {
  size: OTPFieldSize;
  attached: boolean;
  valid: boolean;
  warning: boolean;
  placeholder?: string;
}

const OTPFieldContext = React.createContext<OTPFieldContextValue>({
  size: "md",
  attached: false,
  valid: false,
  warning: false,
});

const sizeVar: Record<OTPFieldSize, string> = {
  sm: "[--sp-otp-size:var(--sp-control-height-sm)]",
  md: "[--sp-otp-size:var(--sp-control-height)]",
  lg: "[--sp-otp-size:var(--sp-control-height-lg)]",
};

const textSize: Record<OTPFieldSize, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};

/* ============================================================
 * Root
 * ============================================================ */

type BaseRootProps = React.ComponentProps<typeof BaseOTPField.Root>;

export interface OTPFieldRootProps extends Omit<BaseRootProps, "length"> {
  /** Number of characters. Optional when `groups` is given (it defaults to their sum). */
  length?: number;
  /**
   * Split the auto-rendered slots into groups with a separator between them,
   * e.g. `[3, 3]` → `▢▢▢ – ▢▢▢`. Only used when Root has no children.
   */
  groups?: number[];
  /**
   * Separator between groups. A node, or a function of the separator's index (0-based).
   * Default: a dash icon. Pass `null` for a gap only.
   */
  separator?: React.ReactNode | ((index: number) => React.ReactNode);
  /**
   * Accessible name for slots 2..N (slot 1 is labelled by the Field label).
   * Default: "Character 2 of 6". Override to translate.
   */
  getSlotLabel?: (index: number, length: number) => string;
  /** Slot size. Maps to the density-aware control-height tokens. Default: "md" */
  size?: OTPFieldSize;
  /** Join the slots in each group into one connected bar (Chakra `attached`). */
  attached?: boolean;
  /** Valid/success state — green border on every slot. */
  valid?: boolean;
  /** Warning state — amber border. Overrides `valid`; `invalid` from Field overrides both. */
  warning?: boolean;
  /** A single character shown in each empty slot, e.g. "○". Default: none. */
  placeholder?: string;
  /**
   * Blur the field once every slot is filled. Moves focus — tell users beforehand
   * (e.g. in the description) per WCAG 3.2.2. Default: false
   */
  blurOnComplete?: boolean;
}

const Root = React.forwardRef<HTMLDivElement, OTPFieldRootProps>(
  (
    {
      className,
      children,
      length: lengthProp,
      groups,
      separator,
      getSlotLabel = defaultSlotLabel,
      size = "md",
      attached = false,
      valid = false,
      warning = false,
      placeholder,
      blurOnComplete = false,
      onValueComplete,
      ...props
    },
    forwardedRef,
  ) => {
    const groupSum = groups?.reduce((a, b) => a + b, 0);
    const length = lengthProp ?? groupSum ?? 6;
    // `length` is authoritative: Base UI needs it to match the rendered slots, so groups that
    // don't add up are ignored (one run of `length` slots) rather than rendering a broken field.
    const groupsMismatch = groupSum != null && groupSum !== length;
    const groupsKey = groups?.join(",");

    React.useEffect(() => {
      if (!groupsMismatch || !isDev()) return;
      console.warn(
        `[Southpaw] OTPField: groups (${groupsKey}) add up to ${groupSum}, but length is ${length}. ` +
          `Ignoring groups and rendering ${length} slots.`,
      );
    }, [groupsMismatch, groupsKey, groupSum, length]);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const handleComplete = React.useCallback<NonNullable<BaseRootProps["onValueComplete"]>>(
      (value, details) => {
        onValueComplete?.(value, details);
        if (!blurOnComplete) return;
        const active = rootRef.current?.ownerDocument.activeElement;
        if (active instanceof HTMLElement && rootRef.current?.contains(active)) active.blur();
      },
      [onValueComplete, blurOnComplete],
    );

    const ctx = React.useMemo(
      () => ({ size, attached, valid, warning, placeholder }),
      [size, attached, valid, warning, placeholder],
    );

    let content = children;
    if (children === undefined || children === null) {
      const sizes = groups && groups.length > 0 && !groupsMismatch ? groups : [length];
      let index = 0;
      content = sizes.map((count, g) => {
        const slots = Array.from({ length: count }, () => {
          const i = index++;
          return <Input key={i} aria-label={i === 0 ? undefined : getSlotLabel(i, length)} />;
        });
        const sep =
          g === 0 ? null : typeof separator === "function" ? (
            separator(g - 1)
          ) : separator === undefined ? (
            <Separator />
          ) : (
            separator
          );
        return (
          <React.Fragment key={g}>
            {sep !== null &&
              sep !== undefined &&
              sep !== false &&
              (React.isValidElement(sep) && sep.type === Separator ? (
                sep
              ) : (
                <Separator>{sep}</Separator>
              ))}
            <Group>{slots}</Group>
          </React.Fragment>
        );
      });
    }

    return (
      <OTPFieldContext.Provider value={ctx}>
        <BaseOTPField.Root
          ref={setRefs}
          data-slot="otp-field"
          data-size={size}
          data-attached={attached ? "" : undefined}
          data-success={valid && !warning ? "" : undefined}
          data-warning={warning ? "" : undefined}
          length={length}
          onValueComplete={handleComplete}
          className={mergeClassName(
            cn(
              // One row: groups shrink to fit rather than wrapping (a wrapped row would leave
              // a separator dangling at the line end).
              "flex max-w-full items-center gap-[var(--sp-control-gap)]",
              sizeVar[size],
            ),
            className,
          )}
          {...props}
        >
          {content}
        </BaseOTPField.Root>
      </OTPFieldContext.Provider>
    );
  },
);
Root.displayName = "OTPField.Root";

/* ============================================================
 * Group — a run of slots (attached slots join within a group)
 * ============================================================ */

const Group = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<"span">>(
  ({ className, ...props }, ref) => {
    const { attached } = React.useContext(OTPFieldContext);
    return (
      <span
        ref={ref}
        data-slot="otp-field-group"
        className={mergeClassName(
          cn(
            // min-w-0 lets the slots shrink on narrow screens instead of overflowing.
            "flex min-w-0 max-w-full items-center",
            !attached && "gap-[var(--sp-control-gap)]",
          ),
          className,
        )}
        {...props}
      />
    );
  },
);
Group.displayName = "OTPField.Group";

/* ============================================================
 * Input — one slot. Wrapped in a span that draws the fake caret.
 * ============================================================ */

type InputProps = React.ComponentProps<typeof BaseOTPField.Input>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder, ...props }, ref) => {
    const ctx = React.useContext(OTPFieldContext);
    const hasState = ctx.valid || ctx.warning;

    return (
      <span
        data-slot="otp-field-slot"
        className={cn(
          // Responsive: slots are --sp-otp-size wide but shrink to fit narrow screens,
          // never below 24px (WCAG 2.5.8).
          "relative inline-flex w-[var(--sp-otp-size)] min-w-6 shrink",
          // Attached: overlap neighbouring 2px borders; lift the focused slot above its neighbours.
          ctx.attached && "-ms-0.5 first:ms-0 focus-within:z-10",
          // Fake caret (shadcn): shown in the focused, empty slot. CSS only.
          "after:bg-fg-default after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:hidden after:h-[45%] after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
          "has-[input:focus:not([data-filled]):not(:read-only)]:after:block",
          "after:animate-pulse motion-reduce:after:animate-none",
          "forced-colors:after:!hidden",
        )}
      >
        <BaseOTPField.Input
          ref={ref}
          data-slot="otp-field-input"
          placeholder={placeholder ?? ctx.placeholder}
          className={mergeClassName(
            cn(
              "aspect-square min-h-0 w-full min-w-0 text-center font-medium tabular-nums",
              textSize[ctx.size],
              "bg-surface-base text-fg-default border-border-control border-2 outline-none",
              // Literal classes: Tailwind can't see class names built at runtime.
              ctx.attached
                ? "rounded-none [span:first-child>&]:rounded-s-[var(--sp-nested-radius,var(--radius-DEFAULT))] [span:last-child>&]:rounded-e-[var(--sp-nested-radius,var(--radius-DEFAULT))]"
                : "rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
              "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
              // The fake caret replaces the native one (restored in forced colours, where the fake is hidden).
              "caret-transparent forced-colors:[caret-color:auto]",
              "placeholder:text-fg-muted focus:placeholder:text-transparent",
              !hasState && "enabled:not-read-only:hover:border-fg-muted",
              ctx.valid && !ctx.warning && "border-success",
              ctx.warning && "border-warning",
              "aria-invalid:!border-danger",
              "focus-visible:sp-focus-ring",
              "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-[var(--sp-state-disabled-opacity)]",
              "read-only:bg-surface-sunken read-only:border-border-default",
            ),
            className,
          )}
          {...props}
        />
      </span>
    );
  },
);
Input.displayName = "OTPField.Input";

/* ============================================================
 * Separator
 * ============================================================ */

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseOTPField.Separator>
>(({ className, children, ...props }, ref) => (
  <BaseOTPField.Separator
    ref={ref}
    data-slot="otp-field-separator"
    className={mergeClassName(
      "text-fg-muted flex shrink-0 items-center [&_svg]:size-[calc(var(--sp-control-icon)*0.8)]",
      className,
    )}
    {...props}
  >
    {children ?? <MinusIcon aria-hidden="true" weight="bold" />}
  </BaseOTPField.Separator>
));
Separator.displayName = "OTPField.Separator";

export const OTPField = {
  Root,
  Group,
  Input,
  Separator,
};
