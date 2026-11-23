/* ============================================================
 * Shared "wait before showing" delay (GEO-963)
 *
 * One API for every loading indicator, so a fast response never flashes a
 * placeholder: Skeleton now, Spinner at its GEO-939 rebuild.
 *
 *   delay={true}     1000ms (Primer's "long")
 *   delay="short"    300ms
 *   delay={500}      500ms
 *   delay={false}    none (the default)
 * ============================================================ */

export type LoadingDelay = boolean | "short" | number;

export const DELAY_SHORT_MS = 300;
export const DELAY_LONG_MS = 1000;

/** The delay in milliseconds. Negative or non-finite numbers count as no delay. */
export function delayMs(delay: LoadingDelay | undefined): number {
  if (delay === true) return DELAY_LONG_MS;
  if (delay === "short") return DELAY_SHORT_MS;
  if (typeof delay === "number" && Number.isFinite(delay) && delay > 0) return delay;
  return 0;
}
