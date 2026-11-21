/**
 * Connected ("attached") group styling — defined once, reused by ButtonGroup,
 * ToggleGroup (GEO-933), Toolbar (GEO-928) and, later, OTPField `attached`.
 *
 * Applied to the GROUP container; it styles the direct children:
 * - square inner corners, rounded outer corners (nested radius)
 * - neighbouring 2px borders overlap so a seam is 2px, not 4px
 * - hovered / focused children lift above their neighbours so their border
 *   and focus ring aren't clipped by the overlap
 * - separators (role="separator") are left alone
 *
 * NOTE: this file is .tsx (not .ts) on purpose. Storybook's Tailwind only scans
 * `packages/ui/src/**\/*.tsx` (apps/storybook/styles.css `@source`), so class names in a
 * .ts file would never be generated. Rename once `@source` also covers .ts.
 *
 * Every class below is a literal: Tailwind can't see class names built at runtime.
 */

export type ConnectedOrientation = "horizontal" | "vertical";

/**
 * A "segment" is a direct child that is a real control: not a separator, and not one of
 * the hidden spans Base UI inserts around an open Popover/Menu trigger
 * (`[data-base-ui-focus-guard]` focus guards and an empty `[aria-owns]` portal owner).
 * Without excluding them, opening a split button's menu broke :last-child (the trigger
 * lost its rounded end) and the `+` adjacency (overlap and dividers).
 *
 * First/last use `:nth-child(1 of S)` / `:nth-last-child(1 of S)`; adjacency allows one
 * focus guard in between (Base UI puts exactly one before a trigger).
 */
const base = [
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty)]:relative",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty)]:!rounded-none",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty):hover]:z-10",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty):focus-visible]:z-20",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty):has(:focus-visible)]:z-20",
].join(" ");

const horizontal = [
  "flex-row",
  "[&>:is(:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty)+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty),:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty)+[data-base-ui-focus-guard]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty))]:-ms-0.5",
  "[&>:nth-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty))]:!rounded-s-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>:nth-last-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty))]:!rounded-e-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
].join(" ");

const vertical = [
  "flex-col items-stretch",
  "[&>:is(:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty)+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty),:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty)+[data-base-ui-focus-guard]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty))]:-mt-0.5",
  "[&>:nth-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty))]:!rounded-t-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>:nth-last-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty))]:!rounded-b-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
].join(" ");

/** Classes for a connected group container in the given orientation. */
export function connectedClasses(orientation: ConnectedOrientation = "horizontal"): string {
  return `${base} ${orientation === "vertical" ? vertical : horizontal}`;
}
