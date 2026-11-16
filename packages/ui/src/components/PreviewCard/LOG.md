# PreviewCard — Change Log

## 2026-11-16 — Sign-off + /improve fixes (GEO-921)

George signed off (relayed by the coordinator). /improve was run on `PreviewCard/`. The approved delays (500 / 0 grouped / 400 warm / 150 grace) were out of scope and are unchanged.

### Fixed

1. **A Group stayed "warm" forever if the open card unmounted.**
   - The Root never reported a close, so every later card skipped the 500ms first-open delay.
   - Root now notifies the Group when it unmounts.
   - Regression test added; mutation-checked (fails without the fix).
2. **Detached triggers (`handle`) ignored Root's `touch`.**
   - They can't read RootContext, so the long-press never opened the card.
   - Root now publishes its context against its handle, and detached triggers read it with `useSyncExternalStore`. This is Tooltip's registry pattern.
   - Regression test added; mutation-checked.
3. **Stories: every shared/grouped profile showed Ada's bio.** Each person now has their own.
4. **Test gaps filled**: `onOpenChange` forwarding with its reason, controlled `open`, and `disabled` overriding controlled `open`.

### Checks

- Tests: 31 for PreviewCard (26 → 31), 395 across the suite.
- `pnpm verify previewcard`: all checks passed (11 stories, 0 violations, 0 inconclusives).
- eslint and prettier are clean. Typecheck passes via the scratch tsconfig; the turbo typecheck doesn't cover packages/ui.

## 2026-11-16 — Full enhancement (GEO-921)

Research: see RESEARCH.md (all 9 libraries + Base UI 1.9 source + Emil Kowalski's delay/motion guidance).

### What changed

- **Token styling (matches Popover)**:
  - `surface-overlay`, `border-default`, `--radius-DEFAULT` and `shadow-lg` replace the hard-coded `bg-white` / `neutral-*`.
  - Forced-colours border.
  - The popup is capped at `--available-width`.
- **Trigger styled as a link**:
  - `fg-default` with a 40% underline that turns solid on hover and while open (`data-popup-open`).
  - `sp-focus-ring`, and `LinkText` in forced colours.
  - It's still a real `<a>` (Base UI) and keeps `render` for router links.
- **Sizes**: `size="sm" | "md" | "lg"` (256 / 320 / 384px, default md) on Popup/Content, exposed as `data-size`.
- **Delays (Emil, see RESEARCH.md "Delays")**:
  - First open 500ms; close grace 150ms.
  - `PreviewCard.Group`: neighbours open with 0ms delay, the popup gets `data-instant` (no animation), the previous card closes instantly, and the group stays warm for 400ms.
  - `delay` / `closeDelay` on Trigger and `delay` / `closeDelay` / `timeout` on Group all override.
- **`disabled`** on Root: never opens (the open is cancelled and `open` is forced false), and the link still navigates.
- **Touch (opt-in, `touch` prop, off by default)**:
  - A 700ms long-press opens the card, matching Tooltip.
  - Moving more than 10px cancels it (scrolling).
  - After a long-press the touchend and the synthetic click are swallowed, so the link isn't followed. A normal tap still navigates.
  - The iOS link callout is suppressed only when `touch` is on.
- **`PreviewCard.Content`**: Portal + Positioner + Popup + Arrow in one part, with `side`, `align`, `sideOffset`, `alignOffset`, `collisionPadding`, `arrow` (default false), `size`, `keepMounted`, `container` and `positionerProps`. Raw parts stay exported.
- **Arrow**: a bordered caret in popup colours (same construction as Popover), hidden in forced colours, with logical `inline-start` / `inline-end` sides.
- **Shared card**: styled `PreviewCard.Viewport` cross-fades content (150ms, instant when Base UI sets `data-instant`), and `createHandle` is re-exported.
- **Hide when detached** (Mantine `hideDetached`): `data-[anchor-hidden]:invisible` on the Positioner.
- **Density**: the trigger reports its nearest `[data-density]` on mount and on open. It's forwarded to the portalled popup, so padding and gaps scale (12 / 16 / 24px padding).
- **Motion (Emil)**:
  - Enter is 200ms and exit 150ms, with ease-out and `scale(0.97)` + fade from `--transform-origin`.
  - No animation in a warm group, on keyboard focus, or on Escape (`data-instant`).
- **Layout parts**: `Media` (16:9), `Title`, `Description`. These are presentational, with `data-slot`.
- **Stories**: Default (link preview), Profile, Definition, Placements, Sizes, Group, SharedCard, Disabled, Touch, Density, Themes (all three sizes, with and without the arrow, in 3 themes).
  - The static stories keep cards visible and unflipped (`STATIC_POSITIONER`). Without it, tall full-page screenshots tripped `hideDetached`.
- **Tests**: 26.
  - Mutation-checked: the warm-group delay and the "close previous" tests fail without their code.
  - The disabled test passes even without the forced `open={false}` because the cancel guard also blocks it. That's two independent guards, which is intended.

### Verified

- `pnpm verify previewcard`: all checks passed (11 stories, 0 violations, 0 inconclusives). Full suite: 390 tests.
- **Playwright**:

  | Check                               | Result                                                                                                   |
  | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
  | Hover open delay (measured in-page) | 511–512ms                                                                                                |
  | Close after leaving                 | ~167ms                                                                                                   |
  | Group neighbour open                | ~50ms, `data-instant`, transition 0s, one card open at a time                                            |
  | Keyboard focus                      | Opens instantly; focus ring is the two-tone box-shadow                                                   |
  | Escape                              | Closes                                                                                                   |
  | Popup styles                        | White / `#d5dce7` border / 10px radius / `shadow-lg` / 0.2s transition / transform-origin at the trigger |
  | Trigger underline                   | 40% at rest, solid when open                                                                             |
  | Mobile (360px)                      | Every size fits (lg 312px)                                                                               |
  | Disabled                            | Never opens                                                                                              |

- The SharedCard story anchors the card to the list rather than each link, so it never covers the other triggers.

## 2026-11-16 — Scope decisions (GEO-921)

- **Branch**: `geo-921-enhance-previewcard`, off `geo-920-enhance-toast` @ `1a10f49`.
- **Research**: RESEARCH.md has all 9 libraries, the Base UI 1.9 API and the guidance.
- **Ticket title vs research**:
  - "Focus trap" is proposed as rejected: no library ships one, and Mantine advises against it.
  - Click "trigger mode" is proposed as Popover's job.
  - Both need George's confirmation.

### Decisions (George, 2026-11-16)

1. **Touch long-press**: yes, opt-in and **off by default** (`touch` prop on Root).
2. **Delays**: follow Emil Kowalski.
   - Values chosen: first open 500ms; neighbours 0ms with no animation (`PreviewCard.Group`); warm window 400ms; close grace 150ms; enter 200ms / exit 150ms; no animation on keyboard focus or Escape.
   - Emil gives the pattern and durations, but no millisecond value for the hover delay or the grace. Those two were chosen as explained in RESEARCH.md "Delays", with sources.
3. **Focus trap**: dropped (see Considered and rejected).
4. **Click mode**: no new mode. Documented as "use Popover with `openOnHover`".
5. The rest of the proposed scope is approved as listed.

### Considered and rejected

- **Focus trap** (named in the ticket title).
  - No library ships one for hover cards, and Mantine's docs explicitly say not to use `trapFocus`.
  - A card opened by hover would steal focus from someone who only moved the mouse.
  - Base UI's model is that the link is the accessible interface. Focus-managed, click-opened content is Popover; modal content is Dialog.
- **Click / context-menu trigger modes (Ant).** These are Popover's job: `Popover` with `openOnHover` gives hover + click. Adding a click mode here would make a link that doesn't navigate on click.
- **ARIA wiring to the card (`aria-describedby`, Mantine `role="dialog"` + `aria-expanded`).** Rich cards make poor descriptions, and `aria-expanded` advertises a disclosure that keyboard users can't enter.
- **Base UI's 600 / 300ms delays.** Replaced by Emil-based values (see above).

### Earlier open questions (now answered)

1. **Touch**: opt-in long-press, off by default? On mobile, long-pressing a link opens the browser's own link menu.
2. **Delays**: keep 600ms open / 300ms close (Base UI, Chakra)?
3. **Focus trap**: drop it?
4. **Click mode**: document "use Popover with `openOnHover`" instead of adding one?
