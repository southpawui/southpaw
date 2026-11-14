# Popover — Change Log

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
