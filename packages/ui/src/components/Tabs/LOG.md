# Tabs — Change Log

## 2026-11-21 — Selected tab style now applies (GEO-970)

- **Bug:** the selected style used `data-[selected]`, but Base UI 1.9 marks the selected tab with `data-active`. The accent colour and semibold weight never applied, so without `<Tabs.Indicator />` nothing showed which tab was selected. The fix is `data-[active]:text-accent data-[active]:font-semibold`.
- **Checked with Playwright** in light, dark and high contrast. Before, the selected tab had the same muted colour and weight 500 as the others. After, it has the accent colour at weight 600. A new test pins `data-active` on the selected tab, so a Base UI rename would fail loudly.
- **Not changed: `scrollbar-none`.** The GEO-939 research said it was undefined, but Tailwind 4.3.4 ships it as `scrollbar-width: none`. Computed styles confirm the list's scrollbar is already hidden, so it stays.

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

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
