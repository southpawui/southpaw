/* ============================================================
 * Meter: server-safe entry (GEO-972)
 *
 * The parts live in ./Meter.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Meter.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { MeterIndicator, MeterLabel, MeterRoot, MeterTrack, MeterValue } from "./Meter.parts";

export type * from "./Meter.parts";

export const Meter: {
  Root: typeof MeterRoot;
  Track: typeof MeterTrack;
  Indicator: typeof MeterIndicator;
  Label: typeof MeterLabel;
  Value: typeof MeterValue;
} = {
  Root: MeterRoot,
  Track: MeterTrack,
  Indicator: MeterIndicator,
  Label: MeterLabel,
  Value: MeterValue,
};
