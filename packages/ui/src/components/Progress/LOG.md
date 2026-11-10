# Progress — Change Log

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
