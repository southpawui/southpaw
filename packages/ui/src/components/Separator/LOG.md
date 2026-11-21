# Separator — Change Log

## 2026-11-09 — Full enhancement

### What changed

- Added `label` prop — text centred on the separator line (e.g. "OR", "Section 2")
- Added `labelPosition` prop: start/center (default)/end — controls where the label sits along the line
- Switched from hardcoded `bg-neutral-200` to semantic token `bg-border-default` (theme-aware)
- Label variant renders as a flex container with two line segments and text between them
- Label text uses `text-fg-muted` for visual hierarchy
- 6 unit tests, 4 stories (Default, Vertical, WithLabel, Themes)
- 0 a11y violations

### Why

- **Label support**: Common pattern for "OR" dividers in auth flows, section titles, "Read more" links. shadcn's Field.Separator had this but the standalone Separator didn't.
- **Label position**: Start/end positions are useful for section headers (label at the start with a long line) and "read more" patterns (label at the end). Only needs different `flex-1` vs fixed width on each line segment.
- **Semantic tokens**: The hardcoded `neutral-200` didn't adapt to dark/high-contrast themes.

### Considered and rejected

- **Style variants (dashed/dotted)** — only Chakra (1/8). Doesn't meet 2+ threshold. Consumers can override with `className="border-dashed"` if needed.
- **Spacing prop** — only MUI (1/8). Tailwind's `my-*` / `mx-*` utilities handle this already.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- The labelled separator renders a plain `<div>`, so its `className` is resolved with `resolveClassName(className, { orientation })`. The unlabelled one is a Base UI part and uses `mergeClassName`.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
