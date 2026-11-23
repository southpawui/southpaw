# Toolbar — Change Log

## 2026-11-22 — Toolbar.Link uses the shared link behaviour (GEO-967)

Toolbar hasn't been enhanced yet. This entry covers only what Link (GEO-967) needed from Toolbar.Link, as the Link refactor audit set out:

- **Focus:** the shared focus ring (`focusRingClasses`: `focus-visible:sp-focus-ring`). It replaces the raw `outline-neutral-900` outline. Since GEO-950, the ring also shows in forced colours.
- **New tab:** for `target="_blank"`, the same behaviour as Link. It adds the `ArrowSquareOut` icon (mirrored in RTL), hidden "(opens in new tab)" text through VisuallyHidden, and `rel="noopener noreferrer"` merged into the consumer's `rel`.
- **Tests:** the first `Toolbar.test.tsx`, with 3 tests.

**Sign-off fix (/improve, 2026-11-23):** the first version used `linkFocusClasses`, whose `rounded-sm` overrode the link's own `rounded-md` (tailwind-merge keeps the later radius), so the corners shrank. It now uses `focusRingClasses`, which has no radius. A regression test covers it.

**Not changed:** the raw `neutral-*` colours and the sizing. Those wait for Toolbar's own enhancement.

**Verify inconclusives (pre-existing):**

- Default: color-contrast (3 nodes) and label-content-name-mismatch (6 nodes).
- With input: label-content-name-mismatch (2 nodes).

Running verify on the original Toolbar.tsx gives exactly the same set, so they come from the unenhanced Toolbar, not this change. They belong to Toolbar's own enhancement.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
