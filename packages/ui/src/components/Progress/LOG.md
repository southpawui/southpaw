# Progress — Change Log

## 2026-11-21 — Indeterminate animation ships with the package; RTL and reduced motion (GEO-970)

- **Bug:** `@keyframes progress-indeterminate` was only in `apps/storybook/styles.css`. Apps using the package got a static third-width bar. The keyframes now live in `packages/tokens/src/keyframes.css`, imported by `@southpawui/tokens/css`, and are removed from Storybook's styles. They are prefixed `sp-` (`sp-progress-indeterminate`) so they don't clash with an app's own keyframes.
- **RTL:** the sweep used a physical `translateX`, so in right-to-left layouts it ran the wrong way. It started off the right edge and slid further right. A mirrored `sp-progress-indeterminate-rtl` now runs under `rtl:`.
- **Reduced motion:** the literal `1.5s` ignored the motion tokens, so the bar kept sweeping. Under `motion-reduce` there's no movement now. The bar goes full width and pulses its opacity slowly (2s, 1 → 0.4), so it still reads as busy. That matches the slow-pulse decision for Spinner (GEO-939). The sweep runs under `motion-safe` only.
- **Checked with Playwright** in Storybook, which no longer defines the keyframes itself:
  - LTR: x moves −113 → 566.
  - RTL: x moves 421 → −257. Before the fix it went 225 → 887.
  - Reduced motion: full width, opacity 0.86 → 0.40 → 0.60, no movement. Before the fix it kept sweeping.
- **Tests:** a new test checks the three animation classes. Nothing reads the CSS file from a test: packages/ui has no Node types (GEO-951), so a `node:fs` read would break the type-check once it covers tests. Storybook has no copy of the keyframes now, so the Playwright check above proves the tokens CSS supplies them.

## 2026-11-21 — Warning fill now uses the `--sp-warning` token (GEO-970)

The warning colour was hard-coded as `oklch(0.7 0.15 85)`, the same colour in every theme. It now uses `bg-warning` (`--sp-warning`), so it follows the theme. Checked with Playwright: `#b45309` in light, `#fcd34d` in dark and `#7a4100` in high contrast. In light, this is a darker amber than before, 5:1 on white.

## 2026-11-10 — Full enhancement

### What changed

- Added `color` prop on Root: default/brand/success/danger/warning (Chakra, MUI, Ant, Spectrum — 5/8)
- Added `size` prop on Track: sm (4px) / md (8px, default) / lg (12px) (Mantine, Chakra, Spectrum — 3/8)
- Added built-in indeterminate animation via `data-indeterminate` attribute (Base UI pattern)
- Indeterminate uses `@keyframes progress-indeterminate` (translateX -100% to 400%) at 1.5s ease-in-out
- Indicator colour driven by parent Root's `data-color` via `[[data-color=*]_&]` selectors
- Switched from hardcoded colours (bg-neutral-200, bg-neutral-900, text-neutral-700) to semantic tokens
- Track uses `bg-surface-sunken` (adapts to dark/high-contrast themes)
- Transition uses `--sp-duration-slow` and `--sp-easing-default` motion tokens
- 8 unit tests, 5 stories (Default, Sizes, Colours, Indeterminate, Themes)
- Themes shows all 5 colours + indeterminate across light/dark/high-contrast
- 0 a11y violations

### Why

- **Colour states**: 5/8 competitors offer this. Essential for conveying meaning — green for success, red for danger, amber for warning. Without it, all progress bars look the same regardless of context.
- **Size variants**: 3/8 competitors. Slim bars (sm) for subtle inline indicators, thick bars (lg) for prominent progress displays.
- **Indeterminate**: 4/8 competitors. Common pattern when total is unknown (file uploads, API calls). Base UI handles the `data-indeterminate` attribute automatically when `value={null}`.
- **Semantic tokens**: The original hardcoded `neutral-*` colours didn't respond to theme changes. Now uses `bg-surface-sunken` for track and intent colours for indicator.

### Considered and rejected

- **Circular variant**: MUI, Chakra, Ant (3/8) have this. But circular progress is essentially a different component with different DOM structure (SVG vs div). Better as a separate component if needed.
- **Striped variant**: Chakra, Ant, Spectrum (3/8). Adds visual noise without clear UX benefit. The indeterminate animation serves the same purpose (indicating activity).
- **Custom label format**: Some libraries let you format the value display (e.g. "60 of 100"). Base UI's Value component already supports render props for this.
