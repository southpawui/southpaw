# Skeleton — Change Log

## 2026-11-23 — Sign-off (GEO-963)

George signed off Skeleton, choosing "Combobox a": Combobox's skeleton rows are deferred to a separate Combobox follow-up ticket.

**/improve findings**

1. **Fixed:** when loaded content was a Fragment, the fade-in put `className` on it, and React warns about that. A Fragment child now appears without a fade. Test: no console error, no wrapper.
2. **Fixed, `lib/announce`:** if the app removed the region, the next identical message was skipped even though a fresh region had heard nothing. `lastMessage` now resets when the region is gone. Test added.
3. **Kept as specified:** a Group without `loadedLabel` that starts loading again within 7s doesn't repeat "Loading". That's the de-duplication George asked for. Adding `loadedLabel` makes each cycle announce.

**Checks:** 37 tests for Skeleton and announce/delay, and the full suite passes.

## 2026-11-23 — Implementation (GEO-963)

Built to George's decisions of 2026-11-21: option (a) on all 20, the `--sp-skeleton` token, and the exceptions in RESEARCH.md. On 2026-11-23 he also approved ("a a yes") building the shared announcer and delay now, and editing the shared keyframes file.

**Shared, new**

- **`lib/announce.ts`:** one polite, atomic, visually hidden live region.
  - It's created on the first `announce()` and reused after that.
  - It writes after 100ms so screen readers notice the change, and clears after 7s.
  - An identical consecutive message is skipped. `destroyAnnouncer()` cleans up.
  - SSR-safe: nothing touches `document` at import.
  - Skeleton.Group is the first user. **Spinner, Button (loading) and Toast adopt it at their GEO-939 rebuilds.**
- **`lib/delay.ts`:** `delayMs()` maps the shared delay API: `true` is 1000ms, `"short"` 300ms, a number is ms, and anything else is none. Spinner adopts it at its GEO-939 rebuild.
- **Tokens** (approved):
  - `--sp-skeleton`, `--sp-skeleton-highlight` and `--sp-skeleton-outline`, mapped to `bg-skeleton` and `outline-skeleton-outline`.
  - The fill is `fg-default` mixed to 10–12% transparent, so it reads on the base, sunken, raised and alternate surfaces in every theme.
  - High contrast: the outline is `border-control` (black).
  - Forced colours: the fill becomes Canvas and the outline GrayText.
- **Keyframes** (`packages/tokens/src/keyframes.css`, so they ship with the package): `sp-skeleton-pulse`, `sp-skeleton-pulse-reduced`, `sp-skeleton-wave` and `-rtl`, `sp-skeleton-appear` (the delay) and `sp-skeleton-fade-in`.

**Skeleton**

- One `span`, `aria-hidden`, never focusable, with `render`.
  - `shape`: text, circle, rectangle or rounded (default rounded, with a nested radius).
  - `animation`: pulse (default), wave or none.
  - `width` and `height` take px or any CSS length.
- **Text shape:** a 1em bar centred in the line box (`1lh`), so it follows the surrounding type.
- **Loop timing:** loops use fixed durations (2s, and 3s under reduced motion), not the motion tokens, which drop to 0ms.
- **Reduced motion:** both animations become a slow, gentle opacity pulse with no sweep.
- **Wave:** follows reading direction, through `rtl:` and its own keyframe.
- **Delay:** pure CSS. A zero-length `sp-skeleton-appear` with an `animation-delay` keeps the shape `visibility: hidden` until the delay runs out. Space stays reserved, and it needs no JavaScript.
- **Outline:** a transparent 1px outline, inset, rather than a border, so a skeleton is exactly the size of what it replaces. It shows in high contrast and forced colours.
- **Wrapping children (`loading`, default true or the Group's value):**
  - The wrapper is `inert` and `aria-hidden`, its text is transparent and its descendants `invisible`, and it takes the children's size (`w-fit`).
  - When loaded, it renders the children only, with no wrapper. A single element child fades in over `--sp-duration-normal`, which is instant under reduced motion. Other children appear without a fade, since there's no element to animate.
  - Without children, nothing renders once loaded.
- **`shape="text"` with children** draws one bar per wrapped line. An outer block box holds the layout and an inner inline `skeleton-bars` span draws the bars with `box-decoration-break: clone`. See the bug below for why there are two elements. Wrap the whole heading or paragraph, so it stays hidden until it loads.

**Skeleton.Text:** `lines` (default 3), the last line `lastLineWidth` (default 60%), and per-line `widths`. Widths are fixed, so server output is stable. It's plain spans, with no list or paragraph roles.

**Presets**

- `Avatar`: Avatar's sizes (32, 40 and 56px) and shapes.
- `Button`: control heights, so it follows density. Widths are 80, 96 and 128px, or `block`.
- `Input`: control heights, full width.
- `Image`: `aspectRatio` (default 16 / 9) and an optional decorative icon. The icon is drawn inside the shape, not treated as wrapped content.

**Skeleton.Group**

- A `div` with `aria-busy` while loading, and the control gap.
- It passes `loading`, `animation` and `delay` to every Skeleton inside. A Skeleton's own prop wins.
- It announces `label` (default "Loading") once per loading cycle, after the delay, then `loadedLabel` when loading ends. If loading ends before the delay, it says nothing.

**Bugs found while building**

- **A wrapped paragraph rendered as one solid block.** The inline wrapper sat in a flex parent (the Group), which turns its children into blocks, so `box-decoration-break` had no lines to clone. Fixed with the outer block box and inner inline bars span. Regression test: a flex parent.
- **The first Card story put the skeleton inside the heading (`<h3><Skeleton shape="text">…`).** Verify flagged an empty heading, since the skeleton is hidden from screen readers. The right pattern is to wrap the whole heading, but an inline span around a block element has no line boxes, so it drew no bars. Fixed: inside the bars span, descendants are forced `inline`. Now `<Skeleton shape="text"><h3>…</h3></Skeleton>` draws a bar per line, and the heading stays hidden until it loads. Regression test added.

**Checked in Chromium (Playwright)**

- Wave: the animation is `sp-skeleton-wave` with the gradient in LTR, and `sp-skeleton-wave-rtl` in RTL.
- Reduced motion: `sp-skeleton-pulse-reduced` over 3s, with the gradient removed.
- Forced colours: a 1px solid outline in a system colour, and a Canvas fill.
- High contrast: a black outline.
- Delay: `visibility: hidden` while the 16px of space stays reserved.

**Tests:** `Skeleton.test.tsx` (26) and `lib/announce.test.ts` (9, covering reuse, de-duplication, clearing, cleanup, recreation and `delayMs`). The SSR test hydrates server output and checks that nothing reports a mismatch.

**Stories:** Default, Shapes, Animation, Text, Presets, WrappingContent, Group, Delay, CardLoading, States, RightToLeft, Density and Themes.

- Themes shows every shape, animation and preset, on all four surfaces, in each theme.
- States includes loading, loaded, delayed, each animation, and a static reduced-motion preview. Storybook can't force the media query, so the preview is static.
- Valid, error and disabled don't apply to a skeleton.

**Deferred:** Combobox's optional, always-silent skeleton rows. George chose (a) on 2026-11-23: they go in a separate Combobox follow-up ticket, not this branch.
