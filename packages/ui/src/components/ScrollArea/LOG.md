# ScrollArea — Change Log

## 2026-11-13 — Full enhancement (GEO-936, Lane 3)

Research redone across all 9 libraries (see RESEARCH.md). Scope approved by George 2026-11-13.

### What changed

- **Auto-rendering Root.** `<ScrollArea.Root>` renders Viewport → Content → children, the scrollbars and the Corner itself (Checkbox/Switch pattern). If a `<ScrollArea.Viewport>` is among its children it switches to composed mode and renders only what the consumer supplies. Parts stay exported. Scrollbar auto-renders its Thumb.
- **Visibility `type`**: `auto` (default), `always`, `hover`, `scroll`, `never` (Mantine, Chakra). Driven by Base UI's `data-hovering` / `data-scrolling`. `hover` and `scroll` also show on keyboard focus of the viewport.
- **`scrollHideDelay`** (default 600ms, Mantine). Set as `--sp-scroll-hide-delay`, used as the fade-out `transition-delay`; fade-in has no delay.
- **`size`** sm/md/lg = 8/10/14px, adjusted ±2px by density (compact/comfortable). Exposed as `--sp-scrollbar-size`.
- **`scrollbars`** `x` | `y` | `xy` (Mantine). Also locks scrolling on the other axis (`overflow-x/y: hidden`).
- **`offsetScrollbars`** `true` | `x` | `y` | `present` (Mantine). Padding the size of the scrollbar so it doesn't cover content.
- **Autosize**: `maxHeight` / `maxWidth` (Mantine `ScrollArea.Autosize`, AntD Table `scroll.y`), plus `onOverflowChange`.
- **`edgeIndicator`** `none` | `fade` | `shadow` (default changed to `fade`, see entry below) (Chakra example, Joy Table shadows, GOV.UK publishing wide-table indicator).
  - Fade is a `mask-image` driven by Base UI's `--scroll-area-overflow-*` distance vars, so each edge fades in proportionally as content appears past it. Capped at `--sp-scroll-area-fade-size` (2rem). The horizontal mask flips in RTL.
  - Shadow is 4 `aria-hidden` gradient spans keyed off Root `data-overflow-*`, using `color-mix` on `--sp-fg-default`. They are hidden in forced-colors.
- **Scroll callbacks**: `onScrollPositionChange` and `onTop/Bottom/Left/RightReached` (Mantine). They fire on arrival at an edge, not on every scroll event, use a 1px tolerance, and work in RTL.
- **`startScrollPosition`** (Mantine). Applied in a layout effect, before paint.
- **`overscrollBehavior`** prop (Mantine). Default changed from hardcoded `contain` to `auto` (see below).
- **`stickToBottom`** (Chakra example, Spectrum `anchorTo:'end'`). A ResizeObserver keeps the view pinned while the user is at the bottom. Scrolling up pauses it; returning to the bottom resumes it.
- **Imperative `actionsRef`**: `getViewport`, `scrollTo`, `scrollToTop`, `scrollToBottom`, `scrollIntoView(el | selector, { block, inline, behavior, offset })`. This is the ticket's "scroll-to-element".
  - `scrollIntoView` moves **only this viewport**, never the page or outer scroll containers. Native `Element.scrollIntoView` scrolls every ancestor, which breaks Combobox popups.
  - `smooth` falls back to `auto` under `prefers-reduced-motion`. None of the 9 libraries do this.
- **`viewportRef`, `viewportProps`, `contentProps`** for virtualizers (TanStack Virtual story) and custom viewport attributes.
- **Accessibility**
  - While content overflows, the viewport gets `role="region"` plus `aria-label`/`aria-labelledby` (Primer ScrollableRegion, Carbon Modal, MoJ scrollable pane). When nothing overflows: no role and no name, and Base UI's `tabIndex` is -1.
  - Implemented through Base UI's `render` prop so it reads live overflow state. In development, a one-time `console.warn` fires if a scrollable region has no name.
  - Focus ring: the two-tone `sp-focus-ring` is applied to the **Root** through `has-[>viewport:focus-visible]`, because the Root's `overflow:hidden` would clip an outset ring on the viewport. An inset ring was rejected because content paints over inset shadows.
  - Thumb uses `--sp-border-control` (≥3:1, WCAG 1.4.11), and `--sp-fg-muted` on hover, drag and scroll.
  - Forced-colors thumb: `CanvasText` with `forced-color-adjust: none`. Custom backgrounds are otherwise stripped in Windows High Contrast and the thumb disappears. None of the 9 libraries handle this.
- **Tokens**: all `neutral-*` replaced with semantic tokens. Track is transparent, shows `surface-sunken` on direct hover, and stays `surface-sunken` for `type="always"`. Motion uses `--sp-duration-*` / `--sp-easing-default`, with `motion-reduce:transition-none`.
- `type="always"` keeps scrollbars mounted. On an axis that doesn't overflow, the thumb is hidden rather than drawn as a short stub.
- **Tests**: 27 unit tests (structure, composed mode, every styling prop, region/name gating, dev warning, overflow callback, edge callbacks, start position, all imperative actions including reduced motion and page-scroll isolation).
- **Stories**: Default, States, Horizontal, BothAxes, Sizes, OffsetScrollbars, Autosize, EdgeIndicators, ScrollToElement, InfiniteScroll, StickToBottom, StickyHeader, Virtualized, RTL, Density, Themes.

### Why

- ScrollArea is a leaf other components consume: Combobox/Autocomplete (GEO-934), long menus, dialog bodies. The things they need are `maxHeight` autosize, `scrollIntoView` that doesn't scroll the page, `onBottomReached` for async loading, fades as an overflow cue, and a viewport ref for virtualization.
- A focusable scroll container with no name is announced as nothing useful. A permanently focusable one is a pointless tab stop. Gating both on overflow is the Primer/Carbon consensus.

### Decisions

- **States story** shows no-overflow, overflowing, keyboard-focused and every `type`. Valid, error and disabled don't apply to a scroll container (agreed with George 2026-11-13).
- **`overscrollBehavior` default is `auto`**, not the previous hardcoded `contain`. Most scroll areas sit inside a page, where `contain` traps the wheel at the boundary and stops the page scrolling. Popups (Combobox, Menu) should pass `overscrollBehavior="contain"`.
- **Viewport renders a plain `<div>`** through Base UI's `render` prop. Base UI renders a `<div>` anyway; this only adds the conditional ARIA. No interactive raw element is introduced.

## 2026-11-13 — Default `edgeIndicator` changed to `fade`

- George's call after review: the fade is a clear overflow cue that doesn't need extra chrome, so every ScrollArea gets it unless it opts out.
- **Caveat:** the mask covers everything in the viewport, including sticky headers. The StickyHeader story passes `edgeIndicator="none"`. Consumers with sticky content should do the same, or use `shadow`, which is drawn on the Root above the content.
- The Themes story now shows `none` and `shadow` alongside the default fade.

## 2026-11-13 — /improve fixes (all three approved by George)

`/improve` ran after sign-off, scoped to this folder. George asked for all three findings to be fixed.

1. **Fade obscured focused or scrolled-to items.**
   - Scroll-to-element with its default "nearest" alignment, Tab focus and Combobox keyboard highlight all leave the item flush with the edge, inside the 2rem fade, so it rendered semi-transparent.
   - Fix: when fading, the viewport gets `scroll-padding` equal to `--sp-scroll-area-fade-size` (`scroll-py-*` / `scroll-px-*` per faded axis). Browsers honour it for focus navigation and native `scrollIntoView`.
   - `actions.scrollIntoView` now defaults `offset` to the viewport's computed `scroll-padding`. An explicit `offset` still wins.
   - Checked in Chromium: native nearest-scroll leaves a 32px gap and the page doesn't move.
2. **Composed mode dropped Root-level props.**
   - With a consumer `<ScrollArea.Viewport>`, Root separated out `aria-label`, `maxHeight`, callbacks, `actionsRef` and `viewportRef` and then passed them to nothing.
   - Fix: they now reach the Viewport through context (`viewportDefaults`). Props set on Viewport take precedence.
3. **Viewport no longer accepted Base UI's `render` prop.**
   - It is accepted again, as an element or a function. Element renders go through Base UI's `useRender`, so props and refs merge exactly as in Base UI parts. Function renders receive the merged props plus `ref` and the state.
   - Our conditional `role="region"` and accessible name are applied to whatever is rendered.

Added 8 tests (composed forwarding ×4, render prop ×2, scroll-padding class, scroll-padding default offset) and a **Composed** story.

**Not fixed (investigate only):** the fade mask is recalculated on every scroll frame, because Base UI updates the edge-distance variables as you scroll. The 10,000-row virtualized story scrolls smoothly, so this hasn't been shown to be a problem. Profile it if a consumer reports jank.

**Rejected as not worth fixing:**

- RTL is detected only on mount.
- The hide delay also delays the track's hover colour.
- With `scrollbars="y"`, horizontal overflow still makes the area a focusable region.

### Shared changes outside the component folder (approved by George 2026-11-13)

- `packages/ui/package.json` + `pnpm-lock.yaml`: added `@tanstack/react-virtual` as a **devDependency** for the Virtualized story.
  - It goes in `packages/ui` rather than `apps/storybook` because stories live in `packages/ui` and pnpm resolves imports from the importing file's package (same as `@phosphor-icons/react`).
  - The lockfile may conflict when lanes are restacked; regenerate it with `pnpm install`.

### Considered and rejected

- **Thumb hit area that grows on hover**: no library documents it, and the track is already the pointer target.
- **Inset focus ring on the viewport**: content with its own background (rows, tiles) paints over inset box-shadows and hides the ring. A ring on the Root is always visible.
- **`scrollbars={false}`** (Mantine): redundant with `type="never"`, which hides the bars but keeps scrolling.
- **Inline-style fade masks**: the first version computed masks in JS `style`. Moved to Tailwind arbitrary properties so the horizontal mask can flip with `ltr:`/`rtl:` variants, and so there's no style computation at runtime.
- **`aria-rowcount` on the virtualized list**: not allowed on `role=list` (axe `aria-allowed-attr`). Items use `aria-setsize` / `aria-posinset` instead.
