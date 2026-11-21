# Combobox — Change Log

Combobox and Autocomplete are built together (GEO-934) and share their styling. Entries here cover both; `Autocomplete/LOG.md` points here.

## 2026-11-21 — Warning state now uses the `--sp-warning` token (GEO-970)

The warning border was written as `border-[var(--sp-warning,var(--sp-fg-default))]`, which fell back to a dark border while the token was still on another branch (PR #44). The token is on the base now, so the state uses the `border-warning` utility and the fallback is gone. This lives in `combobox-shared.tsx`, so Autocomplete gets it too. The test now checks for `border-warning`, and the "Amber arrives at the restack" notes in the stories are gone. Checked with Playwright: the border is `#b45309` in light, `#fcd34d` in dark and `#7a4100` in high contrast, the same as the token.

## 2026-11-18 — Signed off by George; /improve findings fixed

George signed off Combobox and Autocomplete (relayed by the coordinator), including the commit and the push. He kept the keyboard highlight on disabled options as it is.

**/improve (two read-only audits) found these, and all are fixed with regression tests:**

- **`limit` cut off Create and showed one result too many.** Root now caps flat lists itself, so Select all and Create never take a result's place. Grouped lists are still capped by Base UI. Select all now acts only on the results you can see.
- **Sentinel rows reached the consumer's callbacks.** `isItemEqualToValue` never sees Select all, Create or Try again. `onItemHighlighted` gets `undefined` for them.
- **"Try again" wiped the query.** The change is now cancelled (`details.cancel()`), so the typed text stays and an async consumer retries the same search.
- **`maxSelected`:**
  - At the limit, Create is disabled, and `onCreate` never runs for a refused add.
  - Select all now clears when nothing more can be added. Before, it did nothing forever.
  - A refused addition no longer clears the input.
- **`selectedFirst` froze the list.** Only the selection is snapshotted when the list opens, so items that arrive while it is open still show.
- **Full screen dropped the delimiter, paste and `submitOnEnter` handlers, and the consumer's `aria-describedby`.** The sheet's input now gets the same handlers.
- **Hidden chips could be removed blind.** Collapsed chips now expand while the input has focus, not only when a chip has focus. Moving from a chip to the input and then away collapses them again.
- **Responsive chips didn't collapse again after the field got narrower.** Every reset now triggers a fresh measurement.
- **A consumer's `aria-describedby` and `ref` were overridden.** They are now merged on the Input (with the chips hint), on Item (with the description) and on virtual rows (with the measuring ref).
- **`autoSelectOnBlur` could pick a disabled option.** Disabled options register with Root and are skipped, in both components.
- **Fixed chips jumped to the front.** A fixed item that Base UI removes is put back in its place.
- **`filter={null}` was ignored.** It now turns client filtering off, as Base UI documents (server-side search).
- **"Loading more…" showed on every reload.** It now needs `hasMore`.
- **Paste, delimiters and chip reorder worked on read-only fields.** They are off when `readOnly` or `disabled`. Chip remove buttons (and the count's clear) are hidden too, like the clear button. Checked with computed styles: `display: none` on read-only and disabled, `flex` otherwise.
- **An error given as a node was never announced.** The error text announces itself when it appears, using its text content.
- **Composed options (no `items`) ignored `minLength` and `error`.** Content hides them below the minimum and shows "Try again" on error.
- **Autocomplete:**
  - `submitOnEnter` no longer submits when Enter picks "Try again".
  - A consumer's `preventDefault()` on Enter now stops the submit; the consumer's handlers run first.
  - Retry detection no longer depends on a hover first: a pointer press records the item.
- **Smaller fixes:**
  - The announcer's clear timer is reset for each message and cleaned up on unmount.
  - The scroll area's name comes from `labels.options`.
  - Match marks use the component's slot (`autocomplete-match`).
- **Stories:**
  - States (and Themes, through the shared grid) now show multiple-select chips as valid, warning, error, read-only and disabled.
  - Themes shows the popup's error row with "Try again" in each theme, for both components.

**Not changed (for the restack, coordinator):** `size`, `valid` and `warning` live on Root here, while Input and Select take `valid` on the control. That gets reconciled with GEO-954/955 when those land.

**Checks:**

- `pnpm test`: 488 passing (Combobox 52, Autocomplete 18).
- `verify combobox` and `verify autocomplete` pass. The only inconclusives are the known ones: RTL `aria-valid-attr-value` and `<mark>` contrast under the bar.
- Lint is clean, and the scratch type-check (GEO-951) is clean.

## 2026-11-16 — Disabled options show no hover visuals

- **George's check (he flagged the same issue in Menu).** Base UI highlights disabled options on hover, so they drew the subtle tint and the accent bar, or the solid fill.
- **Fixed for pointer hover:** a hovered disabled option now has no tint, no bar, no solid fill (the text keeps `fg-default`) and no forced-colours outline. It stays at the disabled opacity.
  - Measured in Chromium: background transparent, `::after` `display: none`, opacity 0.38, in both subtle and solid.
  - Done with `data-[disabled]:hover:data-[highlighted]:…`, so no JavaScript is needed.
- **Kept for the keyboard (George decided 2026-11-18: keep it as is).** Base UI hard-codes `disabledIndices: []`, so the arrow keys move onto disabled options. This follows the APG pattern: screen-reader users find out an option exists but is unavailable. It can't be configured.
  - If a keyboard highlight on a disabled option showed nothing, the focus position would be invisible (WCAG 2.4.7). So it keeps its usual tint and bar, at the disabled opacity.
- **Stories:** the open States showcases (subtle and solid) now have a disabled "Banana", so hovering it can be reviewed.

## Considered and rejected

- **Hint tooltip on a focused chip** ("Backspace to remove"). George went with the recommendation: no. The visible help text ("Backspace removes the last chip") and the input's `aria-describedby` hint already cover it. The ×, clear and chevron buttons are pointer-only in Base UI, so their tooltips appear on hover only.

## 2026-11-16 — Tooltips on icon buttons, verify decision (awaiting George's review)

### George's answers

1. **aria-hidden-focus: option (a).**
   - `e2e/verify.ts` drops nodes carrying `data-base-ui-inert`, under the `aria-hidden-focus` rule only, next to the focus-guard filter. A comment explains why.
   - It's a shared-file change, so at sign-off it goes in its own `chore(e2e):` commit.
2. **Menu highlight bar: yes.** Lane 2 adds it to Menu on its Menubar branch. Combobox keeps its bar as built, and the classes get shared at the restack if they match.
3. **New: tooltips on icon-only buttons.**

### What changed

- **Tooltip cherry-picked** from Lane 1 (geo-919, PR #38): 0965e77 → 2700a89 and 6d98abb → c00fab8. Both drop out as already applied at the restack. They bring the Tooltip folder and the info tokens (semantic.css, theme.css, primitives.css).
- **Clear (single "Clear", multiple and count "Clear all", new `labels.clearAll`), chip remove ("Remove TypeScript") and the chevron ("Show options") get a Tooltip.** This applies to Combobox and Autocomplete through the shared Input.
  - **Label mode** (`Tooltip.Root type="label"`): the tooltip text is the button's accessible name, through `aria-labelledby`. The buttons no longer carry an `aria-label`, and the tooltip is not also an `aria-describedby`, so nothing is read twice. The chevron's hidden "Show options" span is gone, because the tooltip now overrides Base UI's field-label naming.
  - **One delay group** (`Tooltip.Provider`) per control: the first tooltip waits about 300 ms, and the next ones show at once as the pointer moves along the chips. Measured: nothing at 120 ms, shown by 470 ms, then under 60 ms for the neighbours.
  - Shown **above** the field (`side="top"`), so it never covers the list. The chevron's tooltip is **disabled while the list is open**: it would describe the wrong action.
  - **Touch:** a tap removes or clears with no tooltip (checked on an emulated phone). Tooltip's long-press still works.
  - **Keyboard focus:** these three buttons are pointer-only in Base UI (`tabindex=-1`), so focus never reaches them. The keyboard equivalents are Escape to clear, Backspace or Delete to remove chips, and ↓ to open; the removal hint is on the input. A focused chip shows its focus ring, not a tooltip. **Open question for George:** should a focused chip show a hint tooltip?
- **Open styling keyed to `data-list-open`.** Tooltip triggers set `data-popup-open` while their tooltip shows, so hovering the chevron drew its open ring and the accent border. The control, chevron and full-screen trigger now get our own `data-list-open` from the combobox's open state. Menu keys `menuTriggerOpenClasses` to `data-popup-open`; reconcile at the restack.
- **Announcer portalled to `document.body`.** Base UI keeps `aria-live` elements audible while a popup is open by hiding their siblings one level deeper. A live region inside the field made it hide the input itself (`aria-hidden`, without the `data-base-ui-inert` marker) rather than the field. Portalled, the field is hidden as a whole again, with the marker.

### Checks

- `pnpm verify combobox` and `pnpm verify autocomplete`: **all checks pass.**
- Inconclusives, both explained:
  - `aria-valid-attr-value` in Combobox RightToLeft: `aria-controls` with `aria-haspopup`, the same as Menu.
  - `color-contrast` on the `<mark>` match text in highlighted Autocomplete Themes rows: axe can't compute the background because of the highlight bar's `::after`. The match text is `text-current`, the row's own colour, measured at 10.7–14.6:1.
- Tests: 52 for Combobox and Autocomplete (4 new: tooltip naming, Clear name, the `data-list-open` state, the announcer outside the field). Full suite: 470 passing (30 files).
- Screenshots: hover on a chip remove, the chevron and clear (Combobox and Autocomplete), a focused input and a focused chip.

## 2026-11-16 — Implementation, stories, tests (awaiting George's review)

### Structure

- **`combobox-shared.tsx`** holds every styled part once. Base UI's Autocomplete reuses most Combobox parts (Input, List, Popup, Empty, Status…). Only Root, InputGroup, Trigger, Item and Separator differ, so each part takes a `kind` and gets the matching primitive and `data-slot` prefix (`combobox-*` / `autocomplete-*`). The 13 duplicated class strings are gone.
- **Roots** (`Combobox.Root`, `Autocomplete.Root`) wrap Base UI's and hold value, input text and open state, so they can intercept selections, add our rows and keep state across the full-screen remount.
- **Auto-rendering parts** (Checkbox/Switch pattern):
  - `Input` renders the whole control: start icon, chips (multiple), input, spinner, valid check, clear button, divider and chevron.
  - `Content` renders Portal → Positioner → Popup with the header, error row, max notice, ScrollArea around the list, the load-more row, Empty, the footer and the Status region.
  - `List` with no children renders an `Item` per item, and handles grouped `items` (`{ value, items }`) with labels.
- Base UI parts stay exported, unstyled, for custom anatomy.

### Features (per the approved scope)

- **Control** matches Input/Select/NumberField:
  - 2px `border-control`, hover, two-tone focus ring, accent border while open.
  - Field `invalid` > `warning` > `valid` (NumberField order). `warning` uses `var(--sp-warning, var(--sp-fg-default))` until #44 lands.
  - Disabled, read-only (sunken; the clear button and divider hide).
  - `size` sm/md/lg maps to `--sp-control-height*` (GEO-954).
- **Rows** reuse Menu's `menuItemClasses` (size, subtle/solid highlight):
  - icon, description (announced via `aria-describedby`, not part of the name), trailing.
  - Single select draws a check; multiple draws a checkbox. Either sits at the start or end (`indicatorPosition`).
  - `highlightMatches` bolds the match, ignoring case and accents; exported as `Highlight` too.
- **Groups:** labels, `stickyGroupLabels` (switches the ScrollArea to shadow edges, because the fade would mask a sticky label), separators.
- **Multiple:**
  - Chips with "Remove X" buttons; Backspace removes the last chip (Base UI); the input describes the removal hint.
  - `maxVisibleChips` (number, or `"responsive"`, measured so the "+N" chip and the input stay on line one). Collapses only while idle (MUI).
  - `selectionDisplay="count"` (Carbon), `maxSelected` (disables the rest and says why), `selectAll` (indeterminate checkbox; "1 of 2 selected" description), `hidePicked`, `selectedFirst` (order snapshot taken on open), `isItemFixed`.
  - `reorderable`: Alt+Shift+←/→ (flipped in RTL) or drag, announced ("Rust moved to position 1 of 3").
- **Creatable:** "Create "…"" option; `onCreate` returns the item. Tags: `delimiters` commit on key press; paste is split on the delimiters and on new lines; existing items are reused unless `allowDuplicates`.
- **Async:** `loading` shows the spinner, a "Loading…" empty state (holds back "No results", as Ark does) and `aria-busy`. `error` adds an error row and a "Try again" option (keyboard reachable) that calls `onRetry`. `hasMore` + `onLoadMore` uses ScrollArea's `onBottomReached` plus a "Loading more…" row.
- **Virtualization:** `VirtualList` (@tanstack/react-virtual, now a dependency) uses the popup's ScrollArea viewport as the scroll element. Root scrolls the keyboard highlight into view (Base UI recipe). Rows get `aria-setsize`/`aria-posinset`.
- **Filtering:** Base UI's locale filter, which ignores case and accents ("mexico" finds México); `matchFrom`, `limit`, `minLength` (the hint takes precedence over loading).
- **Announcements:** a Status region with GOV.UK wording, debounced 1400 ms (`statusDelay`), silent straight after a selection; a repeated message is re-read by alternating a trailing no-break space.
  - Empty, loading and too-short states are not announced there, because Base UI's `Empty` is its own polite live region.
  - A separate always-mounted announcer next to the input carries chip moves and load errors, which can happen while the list is closed.
- **Behaviour:** `autoSelectOnBlur`, `blurOnSelect` (`touch`/`mouse`/`true`), `submitOnEnter` (Autocomplete), plus Base UI's `autoHighlight`, `openOnInputClick`, `mode="both"|"inline"` and `grid`.
- **`fullScreenOnMobile`:** below 640px the field becomes a button and the input moves into a full-screen sheet with a title and a Close button (Base UI's input-inside-popup pattern).
- **Lane 2 parity (local until the restack):** `data-keyboard-open` on the popup skips the open animation when the list was opened by typing or a key. The chevron gets the open-trigger look: pressed overlay, inset currentColor ring, and a forced-colours Highlight outline.
- **`labels`** replaces every built-in string.

### Decisions made while building

- **Highlight contrast (needs George's yes/no for Menu).** The option is the keyboard focus (focus stays in the input via `aria-activedescendant`), so WCAG 1.4.11 applies.
  - Menu's subtle tint measured 1.19:1 (light), 1.36:1 (dark) and 1.45:1 (high contrast) against the popup.
  - Combobox adds a 2px accent bar at the start of the highlighted row: 10.7–14.6:1 against the row. In forced colours the row gets a Highlight outline instead.
  - Solid highlight already passes (14.5:1 or more), so it has no bar.
- **Chevron name.** Base UI labels the trigger with the field label ("Fruit", the same as the input). We override it with `aria-labelledby` pointing at a hidden "Show options" span, so voice-control users can say "click Show options".
- **ScrollArea viewport.** Rendered through ScrollArea's `render` prop without its conditional `role="region"`, name or tab stop. Focus stays in the input, and the listbox inside already has the role and name.
- **Full-screen remount.** Base UI decides once whether the input lives inside the popup. When the breakpoint flips, Root re-keys Base UI's Root. Value, input text and open state live in our Root, so nothing is lost. Without this the trigger stayed `tabindex=-1`.
- **Chip drag.** Base UI's Chips container prevents `mousedown` (to keep focus in the input), which also cancels native drag. Reorderable chips set `baseUIHandlerPrevented` on their own mousedown.
- **Commit on blur** runs on the close event (`focus-out` / `outside-press`). Base UI closes the popup before the input's blur fires, so a blur handler saw the list already closed.
- **Placeholder** hides once chips exist (it pushed the input to a second line).
- **Chip and input heights** are computed from the control height (`--sp-cb-height` minus border and row padding), so multiple-select controls match single select at every density.

### Checks

- **Heights (Playwright).** Control at sm/md/lg: 32/40/48px. Rows: 28/32/40px. Density at md: compact 32, default 40, comfortable 48, for single and multiple alike. Clear and chevron: 24×24.
- **Contrast.** Row text 10.7:1 or more, descriptions 6.6:1 or more, the selected check 14.5:1 or more, and checkbox borders 5.2:1 or more, all against the actual popup background in every theme.
- **Popups close and focus returns (Chromium).**
  - Escape closes and focus stays in the input. An outside click closes.
  - Tab closes and moves to the next field; Shift+Tab comes back.
  - The select panel's Apply returns focus to its trigger. The full-screen sheet's Close and a pick both return focus to the field.
  - Keyboard navigation never scrolls the page; the highlight stays inside the scroll area.
- **Async story:** loading → 20 items → scrolling to the end loads 40. The error row plus "Try again" (Enter) retries.
- **Virtualized story:** 10,000 items, about 35 rows rendered, `aria-setsize` 10000.
- **Autocomplete stories:** inline completion, submit on Enter, command palette (Enter follows the link and closes the dialog), 2-D emoji grid navigation, commit on blur.
- **Tests:** 48 unit tests (Combobox 34, Autocomplete 14). Full suite: 438 passing.

### Open

- Resolved in the entry above: the `verify` aria-hidden-focus decision.
- **Inconclusive (explained):** `aria-valid-attr-value` on an open input. axe can't confirm `aria-controls` while `aria-haspopup` is set; Base UI sets the id. This is the same case as Menu.

## Open

- **`verify` fails `aria-hidden-focus` on the open-showcase stories.** Base UI marks everything outside an open popup `aria-hidden` + `data-base-ui-inert` whenever the input is outside the popup (`focusManagerModal = !inputInsidePopup || modal`; it can't be configured). In use, Tab closes the popup before focus can leave, so it's harmless. A decision was sent to George via the coordinator: recommended, a shared `e2e/verify.ts` filter for `data-base-ui-inert` under that rule only, like the Menu focus-guard filter.
- **Inconclusive (explained):** `aria-valid-attr-value` on an open input. axe can't confirm `aria-controls` while `aria-haspopup` is set; Base UI sets the id. This is the same case as Menu.

## 2026-11-16 — George's scope decisions (relayed by the coordinator)

George approved the plan and answered all 12 decisions:

1. **Virtualization: approved.** `@tanstack/react-virtual` moved from devDependencies to dependencies in `packages/ui/package.json` (shared change, approved). The lockfile was regenerated with `pnpm install`. A built-in `VirtualList` ships with both components.
2. **Lane 2 parity: as recommended.** No open animation when the popup opens from the keyboard, plus the open-trigger look. Built locally on the same data attributes and visuals, then switched to Menu's shared exports at the restack.
3. **Tags entry: as recommended.** Props on Combobox `multiple`: `creatable`, `delimiters` (Enter, comma, paste split), `allowDuplicates`. No separate TagsInput component.
4. **Sizes: yes.** sm/md/lg on the control and the rows, mapped to the `--sp-control-height*` tokens so they line up with GEO-954 (Input sizes) and NumberField.
5. **Variants: no visual variants for now.** Follows GEO-956.
6. **Warning: no new tokens.** `warning` uses `var(--sp-warning, var(--sp-fg-default))`. The token arrives from #44 (Toast) at the restack, as it does for NumberField. GEO-955 covers Field.Warning.
7. **Chip overflow: as recommended.** `maxVisibleChips` takes a number or `"responsive"`, and the rest collapse into a "+N more" chip.
8. **Chip reorder: as recommended.** Alt+Shift+←/→ and pointer drag, with each move announced.
9. **Status announcements: as recommended.** Built in, GOV.UK wording, debounced 1400 ms, silent after a selection, replaceable through `labels`.
10. **Commit on blur: as recommended.** Base UI defaults stay. `autoSelectOnBlur` is opt-in.
11. **Full screen on mobile: as recommended.** Opt-in `fullScreenOnMobile`.
12. **Building from a `<select>`: rejected** (see "Considered and rejected").

## Considered and rejected

- **Building from a `<select>` element** (GOV.UK `enhanceSelectElement`). Rejected by George (decision 12).
  - A React component renders its input on the server.
  - Base UI's hidden input already submits with native forms.
  - A no-JavaScript fallback that swaps a server `<select>` for the widget is a page-level progressive-enhancement concern, not something a React component library can own.
  - GOV.UK has this only because accessible-autocomplete is a vanilla-JS enhancer.
- **Visual variants** (filled, flushed, quiet, underlined, Carbon fluid). Not now, per George (decision 5). They follow GEO-956, so every input gets them together.

## 2026-11-16 — Research redone (GEO-934), awaiting George's approval

### What changed

- ScrollArea (Lane 3, 098b417) cherry-picked onto this branch as 7e4b397, because the popup list needs it. It will drop out as already applied at the restack.
- RESEARCH.md rewritten across all 9 libraries. The 2026-11-08 version covered 6 libraries and 9 features.
- No code changes yet. Combobox.tsx and Autocomplete.tsx are unchanged: raw `neutral-*`/`white` colours, a fixed 40px input, no tests, and 13 of 19 class strings duplicated.

### Proposed scope (sent to George via the coordinator, not yet approved)

See the coordinator message of 2026-11-16 and the Linear comment on GEO-934 for the full list and numbered decisions. In short:

- **One shared module** for both components: control, popup, list, option row, chips, status. Option rows reuse Menu's `menuItemClasses`.
- **Field chrome** matching Input and Select: density heights, 2px control border, focus ring, invalid from Field, `valid`, disabled, read-only, start icon, clear button, chevron trigger and loading spinner rendered automatically.
- **Popup** matching Menu, sized to the input, with ScrollArea inside. Header and footer slots, plus empty, loading and error rows.
- **Options:** icon, description and trailing content; an indicator that renders automatically, at the start or end; match highlighting; groups (sticky labels optional); separators; a creatable option.
- **Multiple:** styled chips, an accessible remove button, a removal hint, "+N more", max selections, select-all and count, hide picked, selected-first on reopen, and fixed chips.
- **Behaviour:** a locale-aware filter that ignores accents, `matchFrom`, `limit`, `minLength`, inline completion, auto-highlight, opening on click or focus, `clearOnEscape`, `blurOnSelect`.
- **Async:** `loading`, load more on scroll, virtualization.
- **Announcements:** a built-in status region with GOV.UK-style result counts.
- **Strings:** every built-in string replaceable through a `labels` prop.
- **Pattern stories:** input inside the popup (SelectPanel), command palette, grid, inline list, link options, RTL.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Open styling keys off `aria-expanded`, not `data-popup-open` (GEO-970 Part A)

- **Why:** Base UI sets `data-popup-open` on a **Tooltip** trigger while its tooltip shows. A tooltip on a disclosure trigger therefore faked the open look. Combobox had worked around it with its own `data-list-open`.
- **One convention now:** a trigger's open state is styled from `aria-expanded="true"`. Disclosures set it (Menu, Select, NavigationMenu and Combobox, checked in Chromium); Tooltip triggers never do.
- **Removed** the private `data-list-open` attribute (3 places). The control uses `has-[[aria-expanded=true]]:border-accent` (its input or trigger is expanded), and the trigger's open look and chevron use `aria-expanded:` / `group-aria-expanded/cb-trigger:`.
- Checked in Chromium, hovering the chevron until its tooltip shows (list closed): `data-popup-open` is set and `aria-expanded=false`, there's no inset ring, and the border is only the hover border. With the list open, the inset ring and accent border appear.
- `pnpm verify` passes all checks.
