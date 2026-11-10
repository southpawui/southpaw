# Tabs — Change Log

## 2026-11-10 — Full enhancement

### What changed

- Added vertical orientation support via `orientation="vertical"` on Root (6/8 competitors)
- Root switches between `flex-col` (horizontal) and `flex-row` (vertical)
- List border adapts: bottom border (horizontal), right border (vertical)
- Indicator adapts: bottom bar (horizontal), right bar (vertical)
- Panel spacing adapts: `mt-4` (horizontal), `ml-4` (vertical)
- Added overflow scroll on List (`overflow-x-auto scrollbar-none`) for narrow containers (MUI, Ant — 2/8)
- Tab gets `shrink-0` to prevent text wrapping in scrollable tabs
- Tab gets `gap-2` for icon + text composition
- Fixed hardcoded `text-neutral-600` in stories to `text-fg-muted`
- All orientation-aware styles use `[[data-orientation=*]_&]` CSS selectors
- 8 unit tests, 5 stories (Default, WithIcons, Vertical, Disabled, Themes)
- Themes shows icons, active/disabled states across light/dark/high-contrast
- 0 a11y violations

### Why

- **Vertical orientation**: 6/8 competitors support this. Essential for settings pages, sidebar navigation. Base UI's Tab component already supports `orientation` prop — we just needed to wire up the CSS.
- **Overflow scroll**: MUI and Ant (2/8). When there are many tabs, narrow containers clip them. `overflow-x-auto` with `scrollbar-none` provides scroll without visible scrollbar (touchpad/drag to scroll).
- **Data-orientation selectors**: Instead of passing orientation as a prop to each sub-component, we use CSS attribute selectors targeting the Root's `data-orientation`. One prop on Root, all children adapt automatically.

### Considered and rejected

- **Lazy loading**: Only Chakra (1/8). Doesn't meet 2+ threshold. Base UI renders all panels anyway — lazy loading would require custom keepMounted logic.
- **Fitted/stretch width**: Chakra, MUI (2/8). Achievable with `className="w-full [&>button]:flex-1"` on List — doesn't need a dedicated prop.
- **Segmented control variant**: 0/8 competitors have this on Tabs. It's a separate pattern better suited to ToggleGroup.
