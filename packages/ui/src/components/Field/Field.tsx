/* ============================================================
 * Field: server-safe entry (GEO-972)
 *
 * The parts live in ./Field.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Field.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  FieldCharacterCount,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldRoot,
  FieldSeparator,
  FieldValidity,
} from "./Field.parts";

export type * from "./Field.parts";

export const Field: {
  Root: typeof FieldRoot;
  Content: typeof FieldContent;
  Label: typeof FieldLabel;
  Description: typeof FieldDescription;
  Error: typeof FieldError;
  CharacterCount: typeof FieldCharacterCount;
  Separator: typeof FieldSeparator;
  Group: typeof FieldGroup;
  Validity: typeof FieldValidity;
  Item: typeof FieldItem;
} = {
  Root: FieldRoot,
  Content: FieldContent,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  CharacterCount: FieldCharacterCount,
  Separator: FieldSeparator,
  Group: FieldGroup,
  Validity: FieldValidity,
  Item: FieldItem,
};
