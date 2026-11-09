# Badge — Change Log

## 2026-11-09 — Full enhancement

### What changed

- Added `size` prop: sm/md/lg (Mantine, Chakra, MUI, Spectrum — 4/8 competitors)
- Added `appearance` prop: solid (default) / outline
- Added `icon` prop for leading icon (Chakra, MUI, Spectrum — 3/8)
- Added `onDismiss` prop — renders X button when provided
- Added `data-variant` attribute for external styling hooks
- Fixed warning variant: replaced hardcoded hex (#FFF3CD, #856404) with OKLCH values
- Added dark theme overrides for warning variant (contrast was failing WCAG AA — 2.5:1)
- 9 unit tests, 6 stories (Default, Sizes, Outline, WithIcon, Dismissible, Themes)
- 0 a11y violations across all stories

### Why

- **Size variants**: 4/8 competitors offer sizes. Essential for using badges in different contexts (table cells vs headers vs cards).
- **Outline appearance**: Spectrum has this. Provides a lighter visual weight for badges that shouldn't dominate — useful alongside solid badges for hierarchy.
- **Icon support**: Common pattern for status badges (checkmark for verified, warning for critical). Without it, consumers have to manually compose icon + text inside the badge.
- **Dismissible**: Only Chakra has it (1/8), but since we were adding icons anyway, the X button was trivial to add. Useful for filter tags, selected options, etc.
- **Warning contrast fix**: The original hardcoded hex values didn't adapt to dark theme. OKLCH values with dark-mode overrides ensure WCAG AA compliance in all themes.

### Considered and rejected

- **Count badge** (MUI, Ant — 2/8): A count badge is typically positioned as an overlay on another element (avatar, icon). This is better as a separate component or utility rather than a variant of Badge. Deferred.
- **Dot variant** (MUI, Ant — 2/8): Similar to count badge — it's an overlay indicator, not a standalone badge. Better suited to Avatar or a separate Indicator component.
- **Pulse animation** (Ant — 1/8): Only one competitor. Not worth adding complexity for a niche feature.
- **Raw `<button>` for dismiss**: The dismiss button uses a native `<button>` instead of our Button component. Button would be overkill inside a tiny badge — it would bring its own padding, sizing, and styles that conflict with the badge layout. Documented exception, similar to Input.Phone's native approach.
