/**
 * Connected ("attached") group styling — defined once, reused by ButtonGroup,
 * ToggleGroup (GEO-933), Toolbar (GEO-928) and, later, OTPField `attached`.
 *
 * Applied to the GROUP container; it styles the direct children:
 * - square inner corners, rounded outer corners (nested radius)
 * - neighbouring 2px borders overlap so a seam is 2px, not 4px
 * - hovered / focused children lift above their neighbours so their border
 *   and focus ring aren't clipped by the overlap
 * - a separator (role="separator") splits the group into runs: the items either side get the
 *   run's end/start rounding and the separator becomes a control-gap space (GEO-933)
 *
 * Storybook's Tailwind `@source` scans `packages/ui/src/**\/*.{ts,tsx}` (widened in GEO-970), so
 * this lives in a .ts file. It started as .tsx because `@source` used to scan .tsx only.
 *
 * Every class below is a literal: Tailwind can't see class names built at runtime.
 */

export type ConnectedOrientation = "horizontal" | "vertical";

/**
 * A "segment" is a direct child that is a real control: not a separator, and not one of
 * the hidden spans Base UI inserts around an open Popover/Menu trigger
 * (`[data-base-ui-focus-guard]` focus guards and an empty `[aria-owns]` portal owner), nor a
 * hidden form input (a Toggle with `name` renders one as its sibling — GEO-932), nor anything
 * marked `data-connected-ignore` (e.g. ToggleGroup's visually hidden `required` input — GEO-933).
 * Without excluding them, opening a split button's menu broke :last-child (the trigger
 * lost its rounded end) and the `+` adjacency (overlap and dividers).
 *
 * First/last use `:nth-child(1 of S)` / `:nth-last-child(1 of S)`; adjacency allows one
 * focus guard (Base UI puts exactly one before a trigger) or one hidden input in between.
 */
const base = [
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])]:relative",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])]:!rounded-none",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]):hover]:z-10",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]):focus-visible]:z-20",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]):has(:focus-visible)]:z-20",
].join(" ");

const horizontal = [
  "flex-row",
  "[&>:is(:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]),:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])+[data-base-ui-focus-guard]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]),:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])+[type=hidden]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]))]:-ms-0.5",
  "[&>:nth-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]))]:!rounded-s-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>:nth-last-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]))]:!rounded-e-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  // A separator splits the group into runs (George, GEO-933): the item before it ends a run,
  // the item after it starts one, and the separator becomes a control-gap space with no line.
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]):is(:has(+[role=separator]),:has(+[type=hidden]+[role=separator]))]:!rounded-e-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>[role=separator]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])]:!rounded-s-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>[role=separator]]:!m-0 [&>[role=separator]]:!w-[var(--sp-control-gap)] [&>[role=separator]]:!bg-transparent",
].join(" ");

const vertical = [
  "flex-col items-stretch",
  "[&>:is(:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]),:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])+[data-base-ui-focus-guard]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]),:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])+[type=hidden]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]))]:-mt-0.5",
  "[&>:nth-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]))]:!rounded-t-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>:nth-last-child(1_of_:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]))]:!rounded-b-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore]):is(:has(+[role=separator]),:has(+[type=hidden]+[role=separator]))]:!rounded-b-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>[role=separator]+:not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden],[data-connected-ignore])]:!rounded-t-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
  "[&>[role=separator]]:!m-0 [&>[role=separator]]:!h-[var(--sp-control-gap)] [&>[role=separator]]:!bg-transparent",
].join(" ");

/** Classes for a connected group container in the given orientation. */
export function connectedClasses(orientation: ConnectedOrientation = "horizontal"): string {
  return `${base} ${orientation === "vertical" ? vertical : horizontal}`;
}
