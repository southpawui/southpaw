import { cn } from "./cn";

/** Base UI's `className`: a string, or a function of the part's state. */
export type StateClassName<State> = (state: State) => string | undefined;

/**
 * Merge Southpaw's classes with a consumer `className` that may be a function of state
 * (Base UI's `className` type). `cn()` alone silently drops functions (clsx ignores them),
 * so a state-function className was lost in every wrapper (GEO-958).
 *
 * - string / undefined → a merged string (tailwind-merge; the consumer's classes win)
 * - function → a function that merges the base classes with its result for each state
 */
export function mergeClassName(base: string, className: string | undefined): string;
export function mergeClassName<State>(
  base: string,
  className: string | StateClassName<State> | undefined,
): string | StateClassName<State>;
export function mergeClassName<State>(
  base: string,
  className: string | StateClassName<State> | undefined,
): string | StateClassName<State> {
  if (typeof className === "function") return (state: State) => cn(base, className(state));
  return cn(base, className);
}

/**
 * Resolve a Base UI `className` (string or function of state) to a string, for parts that
 * Southpaw renders as plain elements (no Base UI part to resolve it), or where the state
 * comes from a different part than the element the class lands on.
 */
export function resolveClassName<State>(
  className: string | StateClassName<State> | undefined,
  state: State,
): string | undefined {
  return typeof className === "function" ? className(state) : className;
}
