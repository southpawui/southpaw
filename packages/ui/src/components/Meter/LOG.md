# Meter — Change Log

## 2026-11-10 — Full enhancement

### What changed

- Added `low`/`high`/`optimum` props for automatic colour-coding (HTML meter spec, Chakra, Spectrum — 2/8)
- Auto-colour logic: success (green) when in optimum range, warning (amber) when suboptimal, danger (red) when poor
- Supports all three threshold patterns: low optimum (CPU), high optimum (battery), middle optimum (temperature)
- Added `size` prop on Track: sm (4px) / md (8px, default) / lg (12px)
- Switched from hardcoded neutral-* colours to semantic tokens
- Track uses `bg-surface-sunken`, indicator colour driven by `data-state` attribute
- Transition uses motion tokens (`--sp-duration-slow`, `--sp-easing-default`)
- 8 unit tests, 4 stories (Default, AutoColour, Sizes, Themes)
- Themes shows default + all three colour states across light/dark/high-contrast
- 0 a11y violations

### Why

- **Auto-colour thresholds**: 2/8 competitors offer this. The key differentiator between Meter and Progress — consumers set `low`/`high`/`optimum` and the bar auto-colours. Without this, Meter is just Progress with a different name.
- **HTML meter semantics**: The `low`/`high`/`optimum` props mirror the native `<meter>` element's attributes. Even though we use Base UI's div-based implementation (for styling control), the API matches the web standard.
- **Separate from Progress**: Considered merging into Progress. HTML spec, Base UI, Chakra, MUI, and Spectrum all keep them separate. Progress = temporary completion tracking, Meter = persistent scalar measurement. Different semantic purposes.

### Considered and rejected

- **Merging into Progress**: User asked about this. Decided to keep separate since all competitors and the HTML spec separate them. The threshold auto-colouring logic doesn't belong on a completion indicator.
- **Native `<meter>` element**: The research flagged this. However, native `<meter>` is notoriously difficult to style cross-browser. Base UI's div-based approach gives us full control. The API still matches the spec.
