# Popover — Change Log

## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `Popover.parts.tsx` (`"use client"`, one named export per part). `Popover.tsx` is now a server-safe entry that rebuilds the `Popover` namespace and re-exports its types and helpers, so `<Popover.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- See `packages/ui/LOG.md` for the whole change and the guard that enforces it.

## 2026-11-12 — Full enhancement

### What changed

- Switched all hardcoded colours to semantic tokens (bg-surface-overlay, border-border-default, text-fg-default, text-fg-muted)
- Unstyled Trigger and Close (consumer wraps with Button, matching Dialog/Drawer pattern)
- Animation uses motion tokens: --sp-duration-normal (200ms), --sp-easing-default
- Arrow styled with semantic tokens ([&>polygon]:fill-surface-overlay, [&>polyline]:stroke-border-default)
- Popup uses --radius-DEFAULT for consistent border radius
- Stories rewritten with Southpaw components (Button, Field, Input) — no raw HTML
- Match trigger width via `w-[var(--anchor-width)]` on Popup (Mantine `width="target"`, Primer width variants)
- 6 unit tests, 5 stories (Default, WithArrow, WithForm, MatchTriggerWidth, Themes)
- 0 a11y violations

### Why

- **Semantic tokens**: The original hardcoded neutral-* colours didn't respond to theme changes. Now the popover adapts correctly in dark and high-contrast.
- **Unstyled Trigger/Close**: Matches the pattern established by Dialog and Drawer. Consumer chooses which Button variant to use.
- **Motion tokens**: Consistent with the rest of the library. Popover uses --sp-duration-normal (200ms) — faster than Dialog (350ms) because popovers are smaller surfaces.
- **Arrow styling**: The arrow needs to match the popup's background and border colours. Using semantic tokens ensures it adapts with the theme.

### Considered and rejected

- **Focus trap**: Mantine and Spectrum (2/9) have optional focus trap for popover forms. Base UI doesn't include this on Popover (it's a Dialog concern). Consumers who need focus trap should use Dialog instead.
- **Match trigger width**: Mantine has `width="target"`, Primer has preset sizes. Rather than a prop, we expose Base UI's `--anchor-width` CSS variable — consumers use `className="w-[var(--anchor-width)]"` on Popup. More flexible than a boolean prop.
- **CloseButton (styled X)**: Popovers are small — a styled X button takes up disproportionate space. The unstyled Close wrapped in a small Button is sufficient. Unlike Dialog/Drawer, popovers also close on click-outside and Escape.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
