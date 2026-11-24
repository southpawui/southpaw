/* ============================================================
 * Toolbar: server-safe entry (GEO-972)
 *
 * The parts live in ./Toolbar.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Toolbar.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  ToolbarGroup,
  ToolbarInput,
  ToolbarPartButton,
  ToolbarPartLink,
  ToolbarPartToggle,
  ToolbarRoot,
  ToolbarSeparator,
} from "./Toolbar.parts";

export type * from "./Toolbar.parts";
export { defaultToolbarLabels, markLineEdges, toAriaKeyShortcut } from "./Toolbar.parts";

export const Toolbar: {
  Root: typeof ToolbarRoot;
  Group: typeof ToolbarGroup;
  Button: typeof ToolbarPartButton;
  Toggle: typeof ToolbarPartToggle;
  Link: typeof ToolbarPartLink;
  Input: typeof ToolbarInput;
  Separator: typeof ToolbarSeparator;
} = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Button: ToolbarPartButton,
  Toggle: ToolbarPartToggle,
  Link: ToolbarPartLink,
  Input: ToolbarInput,
  Separator: ToolbarSeparator,
};
