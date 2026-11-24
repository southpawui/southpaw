/* ============================================================
 * OTPField: server-safe entry (GEO-972)
 *
 * The parts live in ./OTPField.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<OTPField.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { OTPFieldGroup, OTPFieldInput, OTPFieldRoot, OTPFieldSeparator } from "./OTPField.parts";

export type * from "./OTPField.parts";
export { defaultSlotLabel } from "./OTPField.parts";

export const OTPField: {
  Root: typeof OTPFieldRoot;
  Group: typeof OTPFieldGroup;
  Input: typeof OTPFieldInput;
  Separator: typeof OTPFieldSeparator;
} = {
  Root: OTPFieldRoot,
  Group: OTPFieldGroup,
  Input: OTPFieldInput,
  Separator: OTPFieldSeparator,
};
