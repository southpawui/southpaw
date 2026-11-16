# Menu — Change Log

## 2026-11-16 — Menu.Trigger shows its open state (George, ContextMenu review)

Lands in the ContextMenu PR (GEO-926).

### What changed

- **`Menu.Trigger` styles its open state** with the exported `menuTriggerOpenClasses`. Before, it was fully unstyled. Its resting look still comes from the Button passed as `render`.
- **The look follows the semantics.** The styling keys off `data-popup-open`, which Base UI sets together with `aria-expanded="true"`. So a trigger only looks pressed when the accessibility tree says it is expanded.
- **Pressed fill:** a `--sp-state-pressed` overlay drawn as a `background-image` layer. It darkens any Button variant (ghost, outline, solid) without replacing a solid button's colour.
- **Non-colour cue:** a 1.5px inset ring in `currentColor`. The fill alone measures only 1.30–1.69:1 against a tinted row, below WCAG 1.4.11's 3:1, so the ring carries the state. Because it uses the trigger's text colour, it contrasts as much as the label does.
- **Forced colours:** backgrounds and box-shadows are dropped there, so the trigger gets a 2px `Highlight` outline instead.
- **Tests:**
  - the trigger has open styling only after it opens (`data-popup-open` and `aria-expanded="true"`);
  - a consumer `className` is kept;
  - the "unstyled" test now checks that there are no resting styles.

### Measured (Chromium, ghost "…" button on a tinted ListRows row)

| Theme         | Ring vs tinted row | Ring vs button fill | Fill vs row (colour only) |
| ------------- | ------------------ | ------------------- | ------------------------- |
| light         | 14.51:1            | 11.16:1             | 1.30:1                    |
| dark          | 13.25:1            | 8.09:1              | 1.64:1                    |
| high contrast | 14.48:1            | 8.58:1              | 1.69:1                    |

- **Forced colours (emulated):** the button outline is `Highlight` (Chromium's emulated palette gives dark navy), inside the row's black outline. They are also told apart by position: the button's outline is its own inner box.
- **Other variants:**
  - outline Button ("Edit"): the ring sits inside its 2px border;
  - solid split-button caret: a white inner ring;
  - all screenshotted.

## 2026-11-16 — Keyboard opens skip the open animation (George, ContextMenu review)

Lands in the ContextMenu PR (GEO-926), because ContextMenu shares this Popup.

### What changed

- **`Menu.Root` and `Menu.SubmenuRoot` are thin wrappers** around Base UI's. They pass every prop through and wrap `onOpenChange` to record whether each open came from the keyboard. The consumer's `onOpenChange` is still called.
- **The keyboard test uses only Base UI's public `eventDetails`:**
  - `reason === "list-navigation"` (arrow keys);
  - or `reason === "trigger-press"` with a click whose `detail` is 0 (Enter and Space dispatch a click with no pointer).
  - It's exported as `isKeyboardOpenChange`. ContextMenu and Menubar use `useKeyboardOpenTracking` and `KeyboardOpenContext`.
- **`Menu.Popup` gets `data-keyboard-open`** and `data-[keyboard-open]:data-[open]:transition-none`. A keyboard open appears at once. The close transition is unchanged, because it only applies while `data-open` is set.
- **Why not Base UI's `data-instant`:**
  - Base UI only sets `instant="click"` for Enter/Space keyboard clicks, not for ArrowDown (`list-navigation`).
  - It would also apply to keyboard-activated item closes, which would change the close animation.
- **Tests:** 6 more (49). Click is animated; Enter, Space and ArrowDown are not. `isKeyboardOpenChange` cases. The consumer's `onOpenChange` is still called.

### Checks (Chromium, computed `transition-property` on the popup)

- click: `transform, scale, opacity`;
- Enter, Space, ArrowDown: `none`;
- closing after a keyboard open: `transform, scale, opacity`.

## 2026-11-16 — Signed off by George (GEO-925)

### Focus guards (George chose option 1)

- `e2e/verify.ts` now drops `[data-base-ui-focus-guard]` nodes, and only under the `aria-hidden-focus` rule (violations and inconclusives). Every other rule and node fails as before. This is a separate commit: `chore(e2e): ignore Base UI focus guards in aria-hidden-focus check`.
- The coordinator checked independently:
  - Every Menu violation was exactly these guard spans.
  - The Search inconclusives (`aria-controls` with `aria-haspopup`, contrast on the half-hidden "wontfix" row, the scrollable list) are false positives.
  - The `aria-valid-attr-value` inconclusive on each open showcase trigger is the same `aria-controls` case.

### /improve findings

1. **Fixed:** end-of-row pieces each had their own `ms-auto`. With `trailing` and `shortcut` together, the free space split and the count floated mid-row.
   - They now sit in one `menu-item-end` group (`ms-auto flex gap-2`). The per-piece `ms-auto` logic in LinkItem and SubmenuTrigger is gone.
   - The Items story shows "Archive 3 ⌘E". A test checks there is a single `ms-auto`.
2. **Fixed:** `LinkItem active` now sets `aria-current="page"`; other items keep `"true"`. Test added.
   - Also: the new-tab icon on LinkItem follows the solid highlight colour, like the submenu chevron.
3. **Fixed:** missing tests added:
   - shortcut sequence described as "g then i";
   - one end group;
   - `aria-current="page"`;
   - submenus inherit `size` and `highlight`.
4. **Documented, not fixed:** dividers draw only between items that are siblings. The first item inside a `RadioGroup` or `Group` that follows an item gets no line. Dividers are meant for flat lists, as Primer uses them; a selector fix would be brittle.

_Rejected:_

- Function `className` dropped by `cn()`: this happens in every component in the repo, not specific to Menu.
- Filter matching hidden text for non-string children: prefix typeahead is unaffected, and `label` covers it.

### Checks

- `pnpm test`: 353 passed (26 files). Menu: 43.
- `pnpm verify menu`: passes.
- Lint and typecheck are clean.
- Items and States re-screenshotted after the fixes.

## 2026-11-16 — Implementation, stories, tests

### What changed

- **Menu.tsx built to the approved scope.** Details below.
- **Accessible name and label-in-name (WCAG 2.5.3).** George's choice was: name = the label only; description and shortcut read as the description.
  - The first build used `aria-labelledby` pointing at the label. axe 4.14 runs `label-content-name-mismatch` by default and failed every item with a visible shortcut or description.
  - Now the name comes from content. Description, inactive text and the key cap are `aria-hidden`. `aria-describedby` still reads them, because hidden elements it points at directly are included.
  - The shortcut is described by a `hidden` span with the spoken key names ("command c"), not by the Kbd's text, so the ⌘ glyph is never read out.
  - Same result for users (name "Copy", description "Copies the selection, command c"), and the rule now passes.
  - Tests check names and descriptions with `toHaveAccessibleDescription`.
- **Trailing content is part of the name** ("All mail 24", "Starred New"). Wrap it in `aria-hidden` if it's decorative. The JSDoc says so.
- **Search clear button.** Base UI renders `Menu.Clear` pointer-only (`aria-hidden`, `tabindex="-1"`; Escape clears from the keyboard). So the `clearLabel` prop is removed: it labelled nothing.
- **Arrow goes in the Positioner, after the Popup.** The popup scrolls (`overflow-y: auto`), so an arrow inside it is clipped. The JSDoc says so.
- **Inactive items** mute their label (`text-fg-muted`), as Primer does. Before, they looked identical to default items.
- **Item padding reduced** (sm `py-0.5`, md `py-1`, lg `py-1.5`). Before, padding plus line-height kept compact items at 32px instead of 28px.
- **Stories:**
  - Default, Items, Selection, Groups, Submenus, RightToLeft, Links, Search, Triggers (icon-only, hover, shared handle, split button), Highlight, Dividers, Sizes, Scrolling, Arrow, States, Density, Themes.
  - Showcase stories render menus already open, portaled into a local container so they pick up `data-theme` and `data-density`.
  - Showcases turn collision flipping off, so stacked rows don't flip upward.
  - They pass `data-highlighted` to draw one highlighted row for screenshots.
- **39 unit tests** (new file).

### Checks

- **Heights** (Playwright, md): compact 28, default 32, comfortable 40px. sm/md/lg at default density: 28/32/40px. Width 160px minimum.
- **Text contrast** (Playwright, layered backgrounds, every theme):
  - Everything passes AA. The lowest is 5.21:1: danger label on the subtle danger highlight, light theme.
  - Below AAA: danger labels (6.5–6.9) and one highlighted description in dark (6.6). Those levels come from the theme's danger and muted tokens, not from Menu.
- **Dividers:** checked with a real hover. The hovered item's line and the next item's line hide (`opacity: 0`); the rest stay.
- **RTL:** the chevron is flipped (`scale: -1 1`; checked in a close-up).
- **Search story inconclusives** (all explained):
  - `aria-valid-attr-value`: axe can't confirm `aria-controls` while `aria-haspopup` is set; Base UI sets the id.
  - `color-contrast`: one item is half-hidden at the scroll edge; same colours as the others.
  - `scrollable-region-focusable`: the list is scrolled by arrow-key navigation through its items.

### `verify` failed on `aria-hidden-focus` (resolved: George chose option 1)

- The failing nodes are all Base UI focus guards (`span[data-base-ui-focus-guard]`, `aria-hidden`, `tabindex="0"`). They appear only in the open showcase stories, which use `modal={false}` so several menus can be open at once.
- A menu opened by a click (modal, the default) is clean, and so is Popover. The same showcase with `modal` on is also clean.
- But modal menus lock page scroll and make the rest of the page inert. Themes (12 open menus) couldn't be scrolled or tried out.
- **Options:**
  1. **Recommended.** Shared change in `e2e/verify.ts`: ignore nodes with `data-base-ui-focus-guard`. `pnpm a11y` already filters `aria-hidden` nodes as "Base UI internals".
  2. Showcase stories start closed. Screenshots show only triggers, and review means clicking each one open.
  3. One open (modal) menu per story, splitting Themes, States, Sizes and Density into many stories. Scroll still locks.

## 2026-11-14 — George's answers to the open questions

1. **Shortcut announcement:** (a) approved. The shortcut is read as a description; the name stays "Copy". `aria-keyshortcuts` is set only with `shortcutActive`.
2. **Virtualization and load-more:** moved to Combobox (GEO-934), which will have ScrollArea.
3. **Chakra `solid` and Primer `showDividers`:** both included after George saw mockups. `solid` is an opt-in highlight using accent (not brand). Dividers are opt-in, with George's refinement: the divider on either side of the highlighted or selected item is hidden, so the highlight never sits against a line.
4. **Split button:** a story composing Button and Menu, not a new component.
5. **Right-click menu, long-press, open-at-point:** handled in ContextMenu (GEO-926).

## 2026-11-13 — Research redone (GEO-925), awaiting George's approval

### What changed

- RESEARCH.md rewritten across all 9 libraries. The 2026-11-08 version covered 6 libraries and 8 features, before the "research all 9" rule.
- No code changes yet. Menu.tsx is unchanged: raw `neutral-*`/`white` colours, no tests, and no submenu or link-item exports.

### Proposed scope (sent to George, not yet approved)

- **Items:** leading `icon`, `description` (on the same line or below), `trailing` slot, `shortcut` (renders Kbd), `inset`.
- **States:** `variant="danger"` with optional screen-reader text, `disabled`, `inactiveText` (Primer), `loading`, `active`.
- **New exports:** `Menu.LinkItem` (icon for new-tab links), `Menu.SubmenuRoot` and `Menu.SubmenuTrigger` (chevron flips in RTL, custom chevron, hover delays), `Menu.Search` and `Menu.Empty` (wrapping Base UI's filter parts).
- **Selection:** checkbox and radio items render their indicators automatically.
- **Groups and separators:** group label description; dashed separator.
- **Popup:** semantic tokens, width 160–288px, option to match the trigger width, max height with scroll, animation, arrow, backdrop.
- **Sizes:** sm/md/lg, following density.
- **Triggers:** unstyled, as in Popover. Stories for an icon-only trigger, open on hover, a shared trigger and a split button.

### Open questions for George

1. **Shortcut announcement:** (a) recommended — read as a description, so the name stays "Copy" (Spectrum); or (b) included in the name. In both, `aria-keyshortcuts` is set only when `shortcutActive` is passed.
2. **Virtualization and load-more** (Spectrum only): move them to Combobox (GEO-934), where ScrollArea is available?
3. **Chakra's `solid` variant and Primer's `showDividers`:** include, or reject with reasons?
4. **Split button:** a story composing Button and Menu, not a new component?
5. **Right-click menu, long-press and open-at-point:** handle in ContextMenu (GEO-926)?
