# Menubar — Change Log

## 2026-11-18 — Sign-off (George), /improve fixes

### /improve findings, fixed

1. **ArrowUp's delayed End could hit the wrong element.** `openAtLastItem` pressed End on whatever had focus two frames later. If focus had moved, for example to a trigger, End jumped the bar to its last menu. That was found because a test polluted the next one. End now goes only to an element inside the popup the trigger controls (`aria-controls`), and only while the trigger is still in the document.
2. **Left/Right in a text field inside a menu switched menus.** The bar now leaves ArrowLeft/ArrowRight alone in `input`, `textarea` and contenteditable content. Test added.
3. **`Backdrop` was missing** from Menubar's parts. Menu and ContextMenu both have it, so Menubar now re-exports `Menu.Backdrop`.
4. **Test gaps** filled:
   - typing inside an open menu doesn't move the bar;
   - a trigger still calls the consumer's `onKeyDown`;
   - ArrowUp in a vertical bar moves between triggers and opens nothing.

### Considered and rejected

- **Filter parts** (`FilterProvider`, `Search`, `List`, `Empty`), which ContextMenu re-exports. Not added. A filterable menubar menu isn't in any library's menubar, and a search field interacts with the bar's Left/Right and typeahead handling, which needs its own design and review. **Open question for George** if he wants it.

### Checks

- `pnpm test`: 406 pass. `eslint` on Menu, ContextMenu and Menubar: clean. `pnpm typecheck` (turbo) passes.
  - Turbo only typechecks the docs package. Running `tsc` directly in `packages/ui` fails repo-wide because it can't find React's types (an environment issue that predates this work).
- `pnpm verify menu`, `contextmenu` and `menubar`: all pass.
- No visual changes, so no new screenshots.

## 2026-11-16 — Open on hover: the story now matches Base UI (George review)

- **Problem:** "Open On Hover doesn't seem to be working." Reproduced in Chromium with real mouse moves: with no menu open, hovering File and then Edit opened nothing.
- **Why:** this is Base UI's design. In `menu/trigger/MenuTrigger.js`, hover-to-open is enabled only when `!isInMenubar || parentMenubarHasSubmenuOpen`. Inside a menubar, `openOnHover` never opens a menu from cold; hover only switches between menus once one is open. (A plain Menu trigger outside a bar does open on hover; checked.)
- **Fix:** the OpenOnHover story became **HoverToSwitch**. The bar is non-modal and File starts open, and the description explains the behaviour. Checked with real pointer moves: hovering Edit, View, then Help opens each in turn.
- **Open question for George:** opening from cold on hover (Mantine `trigger="hover"`) would mean overriding Base UI's gate, for example by driving each menu's `open` from pointer enter and leave on the bar. Not built.
- **George, 2026-11-18:** "this is good". He accepted the HoverToSwitch story and the disabled-item fix. Cold hover-open stays unbuilt, following Base UI's gate.
- **Disabled items** in Menubar menus inherit Menu's fix (Menu/LOG.md): no hover look; the keyboard highlight is faded.

## 2026-11-16 — Left/Right between open menus lands on the first item (APG)

### Problem (found by the coordinator)

With a menu open, ArrowRight opened the next menu, but focus went to the popup itself (`role="menu"`) with no item highlighted. APG says Right/Left open the adjacent menu and move focus to its first item.

### Why (Base UI 1.9, read in source)

- Base UI switches menus by focusing the neighbouring trigger, which opens its menu from that focus (`trigger-focus`).
- `isKeyboardOpen` (`menu/utils/isKeyboardOpen.js`) only treats `list-navigation` and a `detail === 0` click as keyboard opens, so no item gets focus on open.
- The menubar's `menuopenchange` handler (`menubar/Menubar.js`) handles `sibling-open`/`list-navigation` only to track `hasSubmenuOpen`.
- No comment or doc says the popup-focus result is intended. APG wins.
- Behaviour also varied by timing: sometimes focus stayed on the trigger, sometimes on the popup. In jsdom, Base UI highlighted the first item even when it was disabled.

### Fix

- **Detect the switch early.** The Menubar root watches ArrowRight/ArrowLeft from inside one of its open menus in the capture phase (before Base UI handles it) and marks the switch. It skips vertical bars.
- **New `Menubar.Menu`.** A wrapper around Menu.Root that counts a marked open as a keyboard open, so there's no open animation. It provides `KeyboardOpenContext` to its popup.
- **Focus the first enabled item.** Once the new menu is open, found through the expanded trigger's `aria-controls`, the root focuses its first enabled item (`[role^=menuitem]` without `data-disabled` / `aria-disabled`). Base UI highlights it on focus.
  - It does nothing if focus is already on an enabled, highlighted item, for example when Right/Left opened or closed a submenu.
- `Menubar.Menu` is no longer the same object as `Menu.Root` (test updated).
- **Stories:** Edit now starts with a disabled **Undo** (nothing to undo yet), so keyboard entry visibly skips to Redo.
- **Tests:** 3 new.
  - Right from an open File opens Edit at its first enabled item, with `data-keyboard-open`.
  - Left from File wraps to Help.
  - A disabled Edit menu is skipped.

### Checks (Chromium, real keys)

- File open → Right → **Edit, Redo focused and highlighted** (Undo skipped).
- → View (Toolbar) → Help (Documentation) → Right wraps to **File** (New file).
- Left wraps File → **Help**, then View, then Edit (Redo).
- On each switched-to popup: `data-keyboard-open` and `transition-property: none`.
- **Submenus:** Right on "Open recent" opens the submenu (report.pdf); Left closes it back to "Open recent".
- **Disabled menu:** with Edit disabled, File → Right goes to **View** (Toolbar).
- `pnpm verify menubar` / `menu` / `contextmenu`: pass. Full suite: 400 tests.

## 2026-11-16 — Implementation (GEO-927), ready for George's review

### George's decisions (scope approved 2026-11-16; all 5 as recommended)

1. **Top-level typeahead: yes.** Built on the Menubar root.
2. **ArrowUp opens the menu at its last item: yes.** Base UI doesn't do it (checked in the browser: ArrowUp did nothing), so Menubar.Trigger adds it.
3. **Narrow screens:** a story pattern (NarrowScreens), where the bar collapses into one "Menu" button with a submenu per bar menu, using a container query.
4. **No current-item style on the bar** (approved exception; see "Considered and rejected").
5. **Controlled open:** a story pattern (Controlled) using each menu's own `open` / `onOpenChange`. No index prop.

### What changed

- **`Menubar` root** wraps Base UI's Menubar:
  - semantic tokens: `bg-surface-raised`, `border-border-default`, radius, `p-1`, `[--sp-nested-radius:6px]`;
  - vertical layout through `data-orientation`;
  - JSDoc: name the bar, and use it for commands, never site navigation.
  - `orientation`, `loopFocus`, `modal` and `disabled` pass through.
  - Base UI disables every trigger rather than marking the root, so the triggers fade.
- **Typeahead:** a letter typed on a top-level trigger focuses the next trigger that starts with it, wrapping and skipping disabled triggers.
  - Only from triggers in this bar, never from items in its (portalled) menus.
  - Base UI's roving focus stays in sync: Left after typeahead goes to the right neighbour.
- **`Menubar.Trigger`:** a styled `Menu.Trigger`.
  - Height `--sp-control-height-sm`, so it follows density: compact 28, default 32, comfortable 40px.
  - `px-3`, `text-sm`, `font-medium`; hover tint, focus ring, disabled fade.
  - Open state: Menu's shared `menuTriggerOpenClasses`.
  - **ArrowUp** in a horizontal bar opens the menu at its last item. It uses Base UI's own keyboard behaviour: ArrowDown to open, then End in the menu. So the open is still a keyboard open, with no animation.
- **Menus are Menu's parts,** re-exported (`Menubar.Menu` is `Menu.Root`, plus Item, Popup, Submenu…). They inherit icons, Kbd shortcuts, danger, checkbox/radio, groups, the accent bar and the keyboard-open behaviour.
- **Removed** the old raw-colour styling.
- **Stories:** Default, Vertical, Disabled (whole bar, one menu), NonModal, HoverToSwitch, Controlled, NarrowScreens, RightToLeft, States, Density, Themes.
- **Tests:** 11.

### Checks

- **Keyboard (Chromium):**
  - Tab enters on File; Right, End and Home work.
  - Typing "v" then "h" focuses View then Help.
  - ArrowDown opens at the first item; ArrowUp opens at the last item (Delete file); Escape returns to the trigger.
  - Right from File skips a disabled Edit.
  - Typing inside an open menu doesn't move the bar.
- **Open trigger text against its fill:** light 14.51:1, dark 10.74:1, high contrast 14.48:1.
- **`pnpm verify menubar`:** passes. Inconclusives in the open showcases:
  - `color-contrast` on the open trigger: axe can't read the gradient overlay (Menu's variant-safe pressed fill). Measured by hand above.
  - `aria-valid-attr-value`: the trigger's `aria-controls` case, the same as in Menu.

### Considered and rejected

- **Current/selected top-level item** (Ant, Carbon, GOV.UK). An approved exception (George, 2026-11-16): those libraries have it only in navigation bars, which NavigationMenu covers. A menubar is for application commands.
- **An `openIndex` prop** (Mantine). Each menu's controlled `open` already does this (Controlled story), and it's Base UI's own model.

## 2026-11-16 — Research redone (GEO-927)

### What changed

- RESEARCH.md rewritten across all 9 libraries. The 2026-11-08 version covered 4.
- No Menubar code changes yet. Menubar.tsx is a bare root with raw `neutral-*`/`white` colours.
- On this branch, Menu has the approved accent bar (uncommitted); see Menu/LOG.md.

### Proposed scope

- **Reuse Menu, don't copy it.** Each menu in the bar is `Menu.Root` / `Menu.Portal` / `Menu.Positioner` / `Menu.Popup` and Menu's items. That brings icons, Kbd shortcuts, descriptions, submenus, checkbox/radio, danger, inactive, loading, sizes, highlight styles, the accent bar and no animation on keyboard opens. Menubar re-exports them, as ContextMenu does.
- **`Menubar` root:**
  - Semantic tokens: a bar surface with a border and nested radius.
  - Passes through `orientation` (horizontal/vertical, styled for both), `loopFocus`, `modal` and `disabled`.
  - `data-has-submenu-open` as a styling hook.
  - A required accessible name, documented and checked in tests.
- **`Menubar.Trigger`:** a styled `Menu.Trigger`.
  - A compact ghost button, with height from `--sp-control-height-sm` so it follows density.
  - Hover tint, focus ring, disabled state.
  - The open state from Menu's shared `menuTriggerOpenClasses` (pressed fill, inset ring, forced-colours Highlight outline).
- **Keyboard:** Base UI already covers the APG basics (roving focus, Left/Right, Home/End, hover-switch). Additions are in questions 1–2.
- **Stories:**
  - Default (File / Edit / View / Help);
  - shortcuts and icons;
  - submenus and selection;
  - vertical;
  - disabled bar and disabled single menu;
  - non-modal;
  - open on hover;
  - keyboard;
  - RTL, States, Density, Themes.
- **Docs:** for application commands only, never site navigation. Name the bar. Shortcuts are hints that the app must bind.

### Open questions for George

1. **Top-level typeahead** (Mantine, Ark pre-release): typing a letter on the bar focuses the trigger starting with it. Base UI doesn't do this. _Recommended: yes, added on our Menubar root._
2. **ArrowUp opens the menu at its last item** (Mantine; optional in APG). _Recommended: yes, if Base UI doesn't already (to be checked in the browser)._
3. **Narrow screens** (Ant ellipsis menu, Carbon hamburger, GOV.UK mobile toggle): _Recommended: a responsive story pattern that collapses the bar into one "Menu" button with submenus under a container width, rather than automatic overflow measuring._
4. **Current/selected top-level item** (Ant, Carbon, GOV.UK): _Recommended: reject._ All three are navigation patterns, and a menubar is for commands; for navigation, use links in `<nav>` (APG, GOV.UK, MOJ).
5. **Controlled open by index** (Mantine `openIndex`): _Recommended: a story pattern using each Menu's controlled `open`, Base UI's own model, rather than a new index API._
