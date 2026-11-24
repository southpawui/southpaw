/* ============================================================
 * NumberField: server-safe entry (GEO-972)
 *
 * The parts live in ./NumberField.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<NumberField.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLoading,
  NumberFieldRoot,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
  NumberFieldStepper,
} from "./NumberField.parts";

export type * from "./NumberField.parts";
export { STACKED_MIN_TARGET_PX } from "./NumberField.parts";

export const NumberField: {
  Root: typeof NumberFieldRoot;
  Group: typeof NumberFieldGroup;
  Input: typeof NumberFieldInput;
  Increment: typeof NumberFieldIncrement;
  Decrement: typeof NumberFieldDecrement;
  Stepper: typeof NumberFieldStepper;
  Loading: typeof NumberFieldLoading;
  ScrubArea: typeof NumberFieldScrubArea;
  ScrubAreaCursor: typeof NumberFieldScrubAreaCursor;
} = {
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
  Stepper: NumberFieldStepper,
  Loading: NumberFieldLoading,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
};
