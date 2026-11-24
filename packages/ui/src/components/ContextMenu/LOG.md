# ContextMenu — Change Log

## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `ContextMenu.parts.tsx` (`"use client"`, one named export per part). `ContextMenu.tsx` is now a server-safe entry that rebuilds the `ContextMenu` namespace and re-exports its types and helpers, so `<ContextMenu.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- See `packages/ui/LOG.md` for the whole change and the guard that enforces it.

## 2026-11-18 — Test updated for Menu's disabled-item fix

- One expectation in ContextMenu.test.tsx now uses Menu's gated highlight variant. Hovering a disabled item shows nothing, and keyboard focus keeps a faded highlight; see Menu/LOG.md. No ContextMenu code changes.

## 2026-11-16 — Signed off by George (GEO-926)

### /improve findings

1. **Fixed (bug):** on a disabled `ContextMenu.Root`, the Trigger still called `preventDefault` on Shift+F10 and the Menu key, then dispatched its own event, which Base UI ignores when disabled. So keyboard users lost the browser's own context menu.
   - Root now passes `disabled` to Trigger through `ContextMenuRootContext`.
   - With `disabled`, Trigger leaves those keys and the 0,0 keyboard `contextmenu` event to the browser.
   - Regression test: `keyDown` is not prevented when disabled.
2. **Fixed (docs):** the Trigger JSDoc described the old rows pattern (`data-popup-open` on the row). It now describes the final ListRows pattern: the area opts out of its tint, the row gets `data-menu-open`, and the item acted on gets `data-popup-open`.
3. **Fixed (types):** `React.MutableRefObject` (deprecated in React 19) became `React.RefObject<boolean>`, inside the new `ContextMenuRootContext`.

_Rejected:_ none. No other findings held up after checking them against the code and this log.

### Checks

- `pnpm test`: 385 passed. ContextMenu: 24.
- `pnpm verify contextmenu` and `pnpm verify menu`: pass.
- Lint and typecheck: clean.

### Commits

The Menu changes are a separate `feat(menu)` commit before the ContextMenu commit, so each scope stays clean:

- keyboard-open tracking on `Root`/`SubmenuRoot`;
- `data-keyboard-open` on Popup;
- `menuTriggerOpenClasses` on Trigger.

## 2026-11-16 — George's final ListRows rule: row background plus the item acted on

### What changed (ListRows story)

- **Right-click / Ctrl+click on ⋮ opens ⋮'s own menu**, not the row's context menu. George opens menus with a two-finger tap. The ⋮ Menu is now controlled (`menuFor`), and its `onContextMenu` stops the event and opens it. Shift+F10 on a focused ⋮ does the same.
- **While any menu for a row is open, the row shows its hover background**, from state rather than `:hover`.
  - The `li` gets `data-menu-open` while either its ⋮ menu or its context menu is open: `data-[menu-open]:bg-[var(--sp-state-hover)]`.
  - It persists when the pointer moves into the menu or off the row, and clears on close.
- **The item acted on is marked on top:**
  - ⋮ (any entry point): the pressed fill and ring from Menu.Trigger.
  - Name or row (right-click, long press, Shift+F10, Menu key): the name pill.
- **Forced colours:** the row has no outline. The item keeps its outline.

### Checks (Chromium, real mouse / keyboard, pointer moved off the row so `:hover` is false)

| Entry point                                              | Menu             | Row bg (light / dark / HC) | Item                                                      |
| -------------------------------------------------------- | ---------------- | -------------------------- | --------------------------------------------------------- |
| ⋮ left-click, right-click, Ctrl+click, Enter             | ⋮ menu           | 4% / 6% / 8%               | ⋮ fill 8% / 10% / 16%, `aria-expanded=true`, no name pill |
| Right-click name, right-click row gap, Shift+F10 on name | row context menu | 4% / 6% / 8% (identical)   | name pill 8% / 10% / 16%, ⋮ `aria-expanded=false`         |
| Escape                                                   | —                | transparent                | none                                                      |

- **WebKit (installed for this check):** the ⋮ pressed fill and ring render the same as in Chromium.
- **⋮ computed `backgroundColor` is `transparent` by design.** The fill is a `background-image` layer, so it also works on solid triggers. Sampled pixel inside ⋮ in light: `rgb(235,235,235)`, the 8% fill on white.
- **`pnpm verify contextmenu` / `menu`:** both pass.

## 2026-11-16 — George's review: only the control that opened the menu is marked

### What changed

- **George's rule:** only the specific item that opened the menu is highlighted. The previous pass also put the name pill on rows opened from ⋮; that's now removed.
- **ListRows:**
  - The name pill follows the context menu only: right-click, long press or keyboard (`contextRow`).
  - The ⋮ button marks itself through Menu.Trigger's own open state (pressed overlay, inset ring, forced-colours outline), keyed to its `data-popup-open` / `aria-expanded`.
  - The `buttonMenuFor` state and the ⋮ `Menu.Root onOpenChange` are removed.
- **George saw no ⋮ open state at all in his browser.** I couldn't reproduce that.
  - In Chromium with a real `page.mouse` press, ⋮ has `aria-expanded="true"`, the 8% overlay and the ring, and is **not** `:focus-visible` (focus is in the menu). The style doesn't depend on focus-visible.
  - Likely cause: stale CSS in his open tab. The ⋮ classes were new in the previous change, while the pill's class already existed.
  - A hard reload should fix it. If not, the browser and version are needed (WebKit isn't installed here to test Safari).

### Checks (Chromium, real mouse down/up and keyboard)

| Opened by      | Name pill      | ⋮ button                                                               | `li`        |
| -------------- | -------------- | ---------------------------------------------------------------------- | ----------- |
| ⋮ mouse click  | none           | `aria-expanded=true`, overlay 8% / 10% / 16% (light / dark / HC), ring | transparent |
| ⋮ Enter        | none           | same as mouse                                                          | transparent |
| Right-click    | 8% / 10% / 16% | `aria-expanded=false`, plain                                           | transparent |
| Escape (close) | none           | plain; focus back on ⋮ with its normal focus ring                      | transparent |

- **Forced colours, ⋮ open:** solid outline. Screenshots taken in light, dark, high contrast and forced colours.
- **`pnpm verify contextmenu` / `menu`:** both pass. Full suite passes.

## 2026-11-16 — George's review: the item's hover pill stays while its menu is open

### What changed

- **George meant the item's hover pill, not a row tint** (his screenshot of a hovered row: the rounded grey pill around the file icon and name, stopping short of the ⋮ button).
- **ListRows story:**
  - The edge-to-edge `<li>` tint is gone.
  - The file-name Button gets `data-popup-open` while its row's menu is open, and keeps a hover-like pill: `data-[popup-open]:bg-[var(--sp-state-pressed)]`.
  - `--sp-state-pressed` was chosen to match the hovered look, which is the button's 4% hover over the row's 4% hover, about 8% on white.
- **Opening from the ⋮ button:** the same pill on the name, plus option B unchanged (inset ring on the ⋮ button, `aria-expanded="true"`). Only the item and the control that opened the menu are marked, never the whole row.
- **Right-click:** the pill only. The ⋮ button stays `aria-expanded="false"` with no ring.
- **Forced colours:** backgrounds are dropped, so the pill gets a 2px outline (`-outline-offset-2`). The ⋮ button keeps its `Highlight` outline.
- **Close:** everything resets.

### Checks (Chromium, pointer moved away so hover doesn't count)

| Theme         | Pill (name button)     | Row (`li`)  |
| ------------- | ---------------------- | ----------- |
| light         | `rgba(0,0,0,.08)`      | transparent |
| dark          | `rgba(255,255,255,.1)` | transparent |
| high contrast | `rgba(0,0,0,.16)`      | transparent |

- **⋮ open:** the button is `aria-expanded="true"` with the inset ring. **Right-click:** `"false"`, no ring.
- **After Escape:** no `data-popup-open`, and the pill is transparent in every theme.
- **Forced colours (emulated):** the pill has a `solid 2px` outline, and the ⋮ button has a `Highlight` outline.
- **`pnpm verify contextmenu` / `menu`:** both pass. Full suite passes.

## 2026-11-16 — George's review: the control that opened the menu shows it (option B)

### What changed

- **Built B: the row tint, plus the "…" button's own open state.** George's accessibility checks all pass, so the fallback (A, highlighting only the file name) wasn't needed.
- **ListRows:**
  - When a row's "…" button opens its Menu, the row stays tinted. The button itself shows Menu's shared open state (`menuTriggerOpenClasses` on `Menu.Trigger`): a pressed overlay plus a 1.5px inset ring in its text colour, and a `Highlight` outline in forced colours.
  - On a right-click the button isn't expanded (`aria-expanded="false"`, no `data-popup-open`), so it doesn't look pressed. Only the row tint shows.
- **George's checks:**
  1. **Semantics:** the look is driven by `data-popup-open`, which Base UI sets with `aria-expanded`. Tested in both components; checked in Chromium (right-click gives `expanded: false`, no ring).
  2. **Contrast against the tinted row:** light 14.51:1, dark 13.25:1, high contrast 14.48:1. Against the button's own fill: 11.16, 8.09 and 8.58:1. All above 3:1.
  3. **Forced colours:** the button gets a 2px `Highlight` outline, inside and separate from the row's 2px CanvasText outline.
  4. **Not colour alone:** the fill differs from the row by only 1.30–1.69:1, so the inset ring is the cue.
  5. **Menu's trigger styling is reused,** not ContextMenu-specific. Menu's LOG.md has the entry.
- **Tests:** a right-click doesn't mark a Menu trigger inside the area as open.

## 2026-11-16 — George's review: open-area highlight, no animation on keyboard opens

### What changed

- **The area whose menu is open is highlighted** (Finder, Gmail, VS Code).
  - On by default on `ContextMenu.Trigger`: `data-[popup-open]:bg-[var(--sp-state-pressed)]`, the same tint as Menu's subtle item highlight.
  - Forced colours drops backgrounds, so there the area gets a 2px solid outline instead (`-outline-offset-2`). It doesn't clash with the focus ring, which is a box-shadow.
- **ListRows highlights the row, not the list.**
  - The story sets `data-popup-open` on the row whose menu is open, from the context menu (`onOpenChange` plus the right-clicked or focused row) or from that row's "…" Menu.
  - The list-wide area opts out with `data-[popup-open]:bg-transparent`.
  - The Trigger JSDoc describes this row pattern.
- **No open animation when opened from the keyboard** (Emil Kowalski: never animate keyboard-initiated actions).
  - `ContextMenu.Root` wraps Base UI's Root. The Trigger marks its Shift+F10, Menu key and Ctrl+Enter opens. Root records it through `useKeyboardOpenTracking` from Menu, and Menu's Popup gets `data-keyboard-open`.
  - A right-click and a keyboard open both reach Base UI as `contextmenu` events, so the trigger's mark is how they are told apart.
  - Pointer and long-press opens still animate. The close animation is unchanged.
  - This replaces the "considered and rejected" entry below: George asked for it at review.
- **Tests:** 5 more (22). The area gets `data-popup-open` and the tint and forced-colours classes. Right-click is animated; Shift+F10 and the Menu key are not. A right-click after a keyboard open animates again.

### Checks (Chromium, Playwright, computed styles)

- **Popup `transition-property`:**
  - right-click: `transform, scale, opacity`;
  - Shift+F10 and the Menu key: `none`;
  - the close after a keyboard open: back to `transform, scale, opacity`.
- **Area tint while open:**
  - light `rgba(0,0,0,0.08)` on white;
  - dark `rgba(255,255,255,0.1)` on `rgb(10,18,32)`;
  - high contrast `rgba(0,0,0,0.16)`;
  - forced colours (emulated): `outline: solid 2px`, offset `-2px`.
- **ListRows:** right-click on notes.md tints only that row (the list stays transparent). The "…" button on logo.svg tints logo.svg.
- **`pnpm verify contextmenu` and `pnpm verify menu`:** both pass. Full suite: 381 tests.

## 2026-11-16 — Implementation (GEO-926), ready for George's review

### George's decisions (scope approved 2026-11-16)

1. **Keyboard:** the trigger is focusable and opens on Shift+F10, the Menu key and Ctrl+Enter (macOS). Yes.
2. **Long-press delay:** check Emil Kowalski's guidance first. Result: **500ms, Base UI's built-in handling, unchanged.**
   - None of Emil's articles gives a long-press duration. Checked: "You Don't Need Animations", "7 Practical Animation Tips", "The Magic of Clip Path", and the article list on emilkowal.ski.
   - What his guidance does say: give feedback as soon as possible, keep UI animations under 300ms, and never animate frequent or keyboard-initiated actions.
   - His code: Vaul's `LONG_HANDLE_PRESS_TIMEOUT = 250` (`vaul/src/index.tsx`) decides whether a press on the drawer handle still counts as a tap. It is not an open delay, so it doesn't apply.
   - Vaul's touch movement threshold (`swipeStartThreshold = 10` px for touch) matches Base UI's 10px long-press cancel.
   - Sonner has no hold timing (only `SWIPE_THRESHOLD = 45` px).
   - With no guidance pointing elsewhere, 500ms stays. That matches Mantine's default and the native platform conventions.
   - Base UI doesn't expose the delay anyway (`LONG_PRESS_DELAY = 500` is a constant in `ContextMenuTrigger.js`).
   - Gap logged: a configurable delay (Mantine `longPressDelay`) would need Base UI to expose it.
3. **`cursor: context-menu` / `user-select: none`:** not on by default. Shown in the CursorAndSelection story as classes.
4. **One menu for many rows:** a story pattern (ListRows), not new API.
5. **A "…" button that opens the same items:** yes, in ListRows. Each row has a Menu button sharing one `FileActions` list with the context menu.

### What changed

- **Menu's parts are shared, not copied.**
  - `ContextMenu.Popup`, `Item`, `LinkItem`, `SubmenuRoot`/`SubmenuTrigger`, `CheckboxItem`, `RadioGroup`/`RadioItem`, `Group`/`GroupLabel`, `Separator`, `Arrow`, `Backdrop` and `Portal` are the same components as `Menu.*`. A test checks they're identical.
  - They keep Menu's `data-slot`s (`menu-item`, `menu-popup`). To style only context menus, scope under `[data-slot=context-menu-positioner]`.
- **Search:** `FilterProvider`, `Search`, `List` and `Empty` are exported too. `Menu.FilterProvider` works around `ContextMenu.Root` (tested).
- **Trigger:**
  - `tabIndex={0}` by default (override with `-1` when the area holds focusable rows) and a `focus-visible:sp-focus-ring`.
  - Shift+F10, the Menu key and Ctrl+Enter (macOS only, through Kbd's `usePlatform`) open the menu at the focused element's bottom-left.
  - Works from a focused child too: the ListRows story opens the menu for the focused file.
  - A trusted `contextmenu` at 0,0 (a keyboard-generated event that slipped through) is moved to the focused element as well.
- **Trigger semantics:** no `aria-haspopup`/`aria-expanded`, matching React Aria (Base UI already omits them; tested). JSDoc notes:
  - the area is a role-less `<div>` named by its text, so `aria-label` needs a role;
  - always offer the same actions somewhere visible.
- **Positioner:** `z-50`, data-slot, Base UI defaults (pointer, or `anchor`).
- **Removed:** the old raw-colour styling, and the `CheckboxItemIndicator`/`RadioItemIndicator` exports. Indicators now render automatically, as in Menu.
- **Stories:** Default, SubmenusAndSelection, Nested, Disabled, ListRows, PageWide, CursorAndSelection, Search, States, Density, Themes.
  - The open showcases anchor below the area and pass `modal: false`. That isn't in ContextMenu.Root's types; Base UI forwards it to Menu.Root. Non-modal lets several menus be open without locking scroll.
- **Tests:** 17.

### Checks

- **Chromium (Playwright):**
  - Right-click opens at the pointer.
  - Shift+F10, the Menu key and Ctrl+Enter open at the area's bottom-left (not 0,0).
  - Focus moves into the menu, ArrowDown highlights the first item, and Escape returns focus to the area.
  - Long press via CDP touch: closed at 300ms, open by 700ms.
  - ListRows: Shift+F10 on "budget.xlsx" opens the menu for budget.xlsx.
- **`pnpm verify contextmenu`:** passes. Remaining inconclusive: `aria-hidden-focus` on `div[aria-hidden][data-base-ui-inert]` in the open showcases. That is Base UI hiding the content outside an open menu, not a ContextMenu node.
- **Fixed during checks:** stories had `aria-label` on role-less trigger `<div>`s (axe `aria-prohibited-attr`). Removed; PageWide uses `role="region"` with its label.

### Considered and rejected

- **Highlighting the first item when opened from the keyboard.** Base UI focuses the popup; the first ArrowDown highlights the first item. Left as Base UI does it.
- **Skipping the open animation for keyboard-opened menus** (Emil: never animate keyboard-initiated actions). Not done at first because it changes Menu's shared Popup. _Reversed 2026-11-16: George asked for it at review (entry above)._

## 2026-11-16 — Research redone (GEO-926)

### What changed

- RESEARCH.md rewritten across all 9 libraries. The 2026-11-08 version covered 4.
- No code changes yet. ContextMenu.tsx still has raw `neutral-*`/`white` colours, its own copy of item styling, and no tests.

### Proposed scope

- **Share Menu's parts, don't copy them.** Base UI's ContextMenu parts are the Menu parts. So `ContextMenu.Popup`, `Item`, `LinkItem`, `SubmenuRoot`/`SubmenuTrigger`, `CheckboxItem`, `RadioGroup`/`RadioItem`, `Group`/`GroupLabel`, `Separator`, `Arrow`, `Backdrop` and `Portal` are re-exported from `../Menu/Menu`. That brings everything Menu has: icons, descriptions, Kbd shortcuts, danger, inactive, loading, sizes, solid highlight, dividers.
- **Own parts:** `Root` (pass-through: `disabled` restores the native menu), `Trigger`, `Positioner` (pointer by default; `anchor` to open against an element).
- **Keyboard access** (React Aria): the trigger is focusable with a focus ring. Shift+F10 and the Menu key open the menu at the trigger, not at the 0,0 corner; Ctrl+Enter does the same on macOS.
- **Trigger styling hooks:** `data-popup-open` for "this area's menu is open" (Base UI already sets it). Optional `cursor: context-menu` / `user-select: none` (see question 3).
- **Stories:**
  - right-click area, long press, keyboard;
  - nested areas (inner wins);
  - disabled (native menu returns);
  - page-wide area;
  - one menu for a list of rows;
  - the same items also opened from a visible "…" button (the accessible alternative);
  - submenus, selection, shortcuts, States, Density, Themes.
- **Search in the menu** (Mantine), if `Menu.FilterProvider` works around `ContextMenu.Root`. If not, logged as a Base UI limitation.

### Open questions for George

1. **Keyboard opening:** make the trigger focusable by default (`tabIndex=0`, focus ring) and open on Shift+F10, the Menu key and Ctrl+Enter (macOS) at the trigger's position? _Recommended: yes._
2. **Configurable long-press delay** (Mantine `longPressDelay`): Base UI hard-codes 500ms. Making it configurable means replacing Base UI's touch handling with our own. _Recommended: keep Base UI's 500ms (same as Mantine's default) and log it._
3. **Area cursor and text selection:** add opt-in `cursor: context-menu` (MUI) and `user-select: none` (Mantine) on the trigger? _Recommended: neither by default (blocking text selection hurts content areas); show them in a story as classes._
4. **One menu for many rows** (Chakra): a documented story pattern (one trigger around the list, reading which row was right-clicked), not a new API? _Recommended: story pattern._
5. **Same menu from a visible button** (Primer): a story showing the items shared between a "…" `Menu` and the `ContextMenu`, as the accessible alternative? _Recommended: yes._

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
