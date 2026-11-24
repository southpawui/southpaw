/* ============================================================
 * Input: server-safe entry (GEO-972)
 *
 * The parts live in ./Input.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Input.Phone>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import * as React from "react";
import { InputCard, InputPassword, InputPhone, InputRoot } from "./Input.parts";

export type * from "./Input.parts";

/** A server-safe stand-in for the root, so `<Input>` and `<Input.Phone>` both work. */
function InputComponent(props: React.ComponentProps<typeof InputRoot>) {
  return <InputRoot {...props} />;
}
InputComponent.displayName = "Input";

export const Input: typeof InputComponent & {
  Phone: typeof InputPhone;
  Card: typeof InputCard;
  Password: typeof InputPassword;
} = Object.assign(InputComponent, {
  Phone: InputPhone,
  Card: InputCard,
  Password: InputPassword,
});
