/* ============================================================
 * Progress: server-safe entry (GEO-972)
 *
 * The parts live in ./Progress.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Progress.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  ProgressIndicator,
  ProgressLabel,
  ProgressRoot,
  ProgressTrack,
  ProgressValue,
} from "./Progress.parts";

export type * from "./Progress.parts";

export const Progress: {
  Root: typeof ProgressRoot;
  Track: typeof ProgressTrack;
  Indicator: typeof ProgressIndicator;
  Label: typeof ProgressLabel;
  Value: typeof ProgressValue;
} = {
  Root: ProgressRoot,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Value: ProgressValue,
};
