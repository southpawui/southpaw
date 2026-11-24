# Toolbar — Change Log

## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `Toolbar.parts.tsx` (`"use client"`, one named export per part), including the overflow menu, tooltips, Home/End and the toolbar defaults from GEO-928. `Toolbar.tsx` is now a server-safe entry that rebuilds the `Toolbar` namespace and re-exports its types and helpers (`defaultToolbarLabels`, `markLineEdges`, `toAriaKeyShortcut`), so `<Toolbar.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- `lib/use-overflow.ts` (a hook) now has `"use client"` too.
- See `packages/ui/LOG.md`.

## 2026-11-23 — Sign-off (GEO-928)

George signed off Toolbar after the coordinator's review fixes (below).

**/improve findings** (scoped to Toolbar and `lib/use-overflow`)

1. **Fixed (bug):** overflow didn't re-measure when an item's own width changed: a web font loading late, a label changing, an icon swapping.
   - The ResizeObserver watched the container and the measuring row, and the row is 0×0, so its size never changes.
   - It now also observes every measured item, and re-runs when `document.fonts.ready` resolves.
   - Test: each measured item is observed.
2. **Fixed (bug):** `markLineEdges` counted Base UI's focus-guard spans and hidden inputs as neighbours. With a menu open, the 0-size guard beside a trigger could hide a separator that was mid-line.
   - It now skips guards, empty `aria-owns` spans, hidden inputs and anything without a box.
   - Test added.
3. **Fixed (efficiency):** the measuring copy rendered every item's Tooltip. Tooltip popups are portalled and kept mounted, so each tooltip existed twice in `<body>`.
   - Items inside the copy skip their tooltip (`MeasuringContext`). Widths are unchanged, since the tooltip adds no box.
   - Test: no tooltip triggers in the copy, and one popup per visible icon-only item.
4. **Fixed (stories):** an RTL story. Items run right to left, the More menu opens from the end, and `labels.more` is translated.
5. **Rejected:** the More menu passes a menu-item click event to a Button's `onClick`. That's what activating a menu item is, and the signature is unchanged. Noted here, not changed.

**Also fixed during sign-off, outside Toolbar:** a race in DescriptionList's copy tests ("multiple elements with the text: Copied"). It has its own `test(descriptionlist)` commit and LOG entry.

**Checks**

- `pnpm test`: 1245 pass (39 Toolbar).
- `pnpm lint` and `pnpm typecheck` are clean.
- `pnpm verify toolbar` passes. The single inconclusive (Sticky filler paragraphs) is explained in the enhancement entry.
- Re-read: RTL, plus the stories from the review round.

**Open:** none for George.

- The coordinator tracks two follow-ups: moving NavigationMenu and Tabs onto `lib/use-overflow`, and possibly a Menu-level prop for reserving the indicator column.

## 2026-11-23 — Coordinator review fixes (GEO-928)

1. **ToggleGroup items now take the toolbar's size.**
   - A ToggleGroup supplies its own ButtonGroupContext, which reset its items to md. The toolbar's ToggleGroup defaults now include `size` (the group's own `size` still wins).
   - Icon-only Buttons and Toggles also get the toolbar height as well as the width.
   - Measured in default density (width × height):

     | Size | Item             | Before    | After |
     | ---- | ---------------- | --------- | ----- |
     | sm   | Button / Toggle  | 32×32     | 32×32 |
     | sm   | ToggleGroup item | 32×**40** | 32×32 |
     | md   | all              | 40×40     | 40×40 |
     | lg   | Button / Toggle  | 48×48     | 48×48 |
     | lg   | ToggleGroup item | 48×**40** | 48×48 |

   - Test: for each size, every Button, Toggle and ToggleGroup item (both `Toolbar.Toggle` children and data `items`) carries exactly one height token, the toolbar's.
2. **Separators at the edge of a wrapped line hide.**
   - With `overflow="wrap"`, the Root marks a separator that starts or ends a line (`data-line-edge`, from the neighbours' boxes) and it becomes `invisible`.
   - Visibility only, so the layout can't change and loop. ResizeObserver re-runs it.
   - The Wrap example uses `size="sm"`, which reproduces the reviewed case: the separator after Strikethrough is now hidden. Unit test on `markLineEdges`.
3. **More menu rows line up.**
   - Every row is built from the same columns: indicator, then icon, then label. Plain rows reserve the checkbox/radio indicator's `size-4` column (plus Menu's item gap) whenever the menu has a checkbox or radio row. Every row reserves the icon column whenever any row has an icon.
   - Measured: all 11 icons in the 240px menu start at the same x. Test added.
   - Menu's own convention only covers icon-less rows (`inset`), so this lives in Toolbar. A Menu-level prop for it would be a follow-up for the Menu lane.
4. **Toolbar.Input** gets `mx-1`, so a bordered input doesn't sit 4px from a solid button. Measured: Publish to Find is now 8px (was 4px).
5. **Default size is now `md`.** The research decided "sizes" but not a default. `sm` was my choice, not a recorded decision, so it now matches Button, Toggle and ButtonGroup (md).

## 2026-11-23 — Enhancement (GEO-928)

Built from the approved RESEARCH.md (George, 2026-11-21: decisions 1–15, all option (a)). Branch `geo-928-enhance-toolbar`, based on `geo-965-loadingoverlay` @ 950a8e6.

**Parts**

- **Root** (`role="toolbar"`):
  - `size` sm / md (default since the review) / lg, passed to every item through ButtonGroupContext. Items are ghost by default.
  - `variant` bordered (default) / flush, and `gap` default / condensed.
  - `overflow` menu (default) / wrap / none.
  - `hideLabelsBelow` sm / md.
  - `sticky` + `stickyOffset`.
  - `labels.more` (translatable).
  - It wraps `Tooltip.Provider`, so item tooltips share a warm delay.
- **Button / Toggle:** our Button and Toggle, rendered by Base UI's Toolbar.Button, with `iconOnly`, `shortcut`, `tooltip` and `overflow`.
- **Group:** `attached` joins the items, which become outline (lib/connected). `disabled` cascades to its items.
- **Link:** button-like, on the tokens, at the toolbar's size, with an optional `icon`. It keeps the shared new-tab behaviour.
- **Input:** on the tokens, at the toolbar's size. It's never moved into the More menu.
- **Separator:** perpendicular to the toolbar, on the tokens, and drawn with a border in forced colours.
- **Nested Root:** renders `role="group"` in the same Tab stop. A dev warning fires when a toolbar has no label.

**Keyboard**

- **Home/End:** Southpaw adds them, because Base UI 1.9 has none.
  - The handler runs in the capture phase, because a disabled (aria-disabled) item swallows its own keydown.
  - It covers every item, links included.
  - A text field keeps Home/End for its caret.
- **Arrows, loop and orientation:** from Base UI. Disabled items stay focusable (Base UI default, APG).

**Icon-only items and tooltips (GEO-959)**

- **Icon-only items** (`iconOnly`, or an icon without text) are named by their tooltip (`type="label"`), so the name and the tooltip can't disagree.
- **`shortcut`:** takes Kbd syntax (`"Mod+B"`).
  - The tooltip shows it per platform: ⌘B on Apple, Ctrl+B elsewhere.
  - The trigger gets real `aria-keyshortcuts` (`Meta+B` / `Control+B`) through `toAriaKeyShortcut`.
  - A key sequence ("g i") can't be expressed in `aria-keyshortcuts`, so it's left out.
- **Hidden labels:** with `hideLabelsBelow`, a labelled item below the breakpoint becomes a square whose label is screen-reader-only, and its tooltip turns on (Spectrum `buttonLabelBehavior`). `useMediaQuery` decides when.

**Disabled items**

- Base UI's Toolbar.Button forwards a React `disabled` prop to a custom `render` element. That sent our Button and Toggle down their native-disabled path, which keeps hover.
- Small adapters (`ItemButton`, `ItemToggle`) map it to their `inactive` state instead: focusable, `aria-disabled`, no hover, activation swallowed (GEO-932). Their tooltip still opens.
- **Checked in Chromium:** a disabled item keeps a transparent background on hover, opacity 0.38 and a not-allowed cursor.

**Overflow menu (`overflow="menu"`)**

- **Shared hook:** `lib/use-overflow.ts` is the measuring that NavigationMenu wrote inline, extracted as decided. The pure part is `computeOverflow`. NavigationMenu and Tabs move onto it in their restack follow-ups (the coordinator tracks those). NavigationMenu isn't changed here.
- **How it measures:** an invisible, inert, aria-hidden copy of the items is rendered at natural width in its own BaseToolbar.Root, so it stays out of the arrow-key order. ResizeObserver re-runs it.
  - Margins count, so a separator's `mx-1` is included.
  - The copy's children get `max-w-none`. Without it, ToggleGroup's `max-w-full` measured 0 inside the zero-width copy, the estimate came out short, and the "More" trigger was pushed off the edge (caught in screenshots).
- **What overflows:** trailing items move into the "More" menu in order. Pinned items, `overflow={false}`, inputs and custom content stay put. Separators next to a gap are dropped. A group moves as a unit.
- **Menu items:**
  - Toggles become checkbox items.
  - A single-select ToggleGroup becomes a radio group; a multiple one becomes checkbox items.
  - Links become link items.
  - Buttons become items with their icon and shortcut.
- **Shared state:** uncontrolled Toggles and ToggleGroups keep their state in the Root, so the toolbar and the menu show and change the same state, and it survives an item moving out and back. Test: uncheck Bold in the menu, close, reopen, still unchecked.
- **Direct children only:** the menu reads the Root's direct children (fragments are fine).
  - My first stories wrapped every item in an `<EditorItems />` component, so the Root saw one opaque item and never showed "More".
  - The stories now call the helper as a function.
  - A dev warning fires when the measured item count doesn't match the children (test added).
- **Debugging:** `data-overflowed` on the Root gives the number of items in the menu.

**ToggleGroup inside a toolbar**

- It gets toolbar defaults, which its own props override: ghost items, not attached, the toolbar's gap, and no wrapping.
- Without them it was outline, and its spaced layout wrapped into a column in a narrow toolbar.

**Colours:** accent for controls (the Toggle pressed state uses accent). Danger is for destructive items. Brand appears only on the one call to action in the Themes story.

**Tests:** 31 Toolbar tests (up from 4).

- The overflow-menu test waits up to 3s. A checkbox item keeps the menu open (Base UI), so the test unchecks Bold in the open menu, closes it with Escape, then reopens it. Its first version clicked "More" again to reopen, which closed the open menu instead; that only passed when run on its own.
- The two Link radius tests now expect the item radius (`--sp-nested-radius`, falling back to `--radius-DEFAULT`) instead of `rounded-md`. They still guard against Link's small radius and keep a function `className` (GEO-958).

**Verify:** passes.

- **One inconclusive, explained:** color-contrast on 5 nodes in the Sticky story. They're the story's filler paragraphs below the scroll box's fold: axe can't determine their background because the scroll container clips them. They aren't toolbar elements, and the same `text-fg-default` on `bg-surface-base` passes everywhere else.
- The earlier inconclusives (color-contrast and label-content-name-mismatch on the unenhanced Toolbar) are gone.

**Phone width:** at 375px, no story scrolls sideways. In HideLabels each item becomes a 32px square named by its tooltip.

**Considered and rejected**

- **Registering each item with the Root instead of reading direct children:** it would work through wrapper components, but each item would have to describe its own menu entry and state, which is more machinery. The direct-children rule is documented and warned about.
- **Hiding overflowed items with `hidden` in the real row (as NavigationMenu does):** Base UI's roving focus would still count them, so the arrow keys could land on an invisible item. They're left out of the row, and the inert copy does the measuring.
- **`pointer-events: none` on disabled items:** it would block their tooltip, which explains what they do. Hover is removed through `inactive` instead.

## 2026-11-23 — Toolbar.Link keeps a function `className` (GEO-958, after the restack)

Resolving the GEO-967 conflict against Part A brought back `cn(…, className)` in Toolbar.Link. That silently drops a Base UI state-function `className`, which is the GEO-958 bug Part A fixed. Toolbar.Link now uses `mergeClassName(cn(…), className)` like the rest of Toolbar. Regression test: a function `className` is applied alongside the shared ring and `rounded-md`.

## 2026-11-22 — Toolbar.Link uses the shared link behaviour (GEO-967)

Toolbar hasn't been enhanced yet. This entry covers only what Link (GEO-967) needed from Toolbar.Link, as the Link refactor audit set out:

- **Focus:** the shared focus ring (`focusRingClasses`: `focus-visible:sp-focus-ring`). It replaces the raw `outline-neutral-900` outline. Since GEO-950, the ring also shows in forced colours.
- **New tab:** for `target="_blank"`, the same behaviour as Link. It adds the `ArrowSquareOut` icon (mirrored in RTL), hidden "(opens in new tab)" text through VisuallyHidden, and `rel="noopener noreferrer"` merged into the consumer's `rel`.
- **Tests:** the first `Toolbar.test.tsx`, with 3 tests.

**Sign-off fix (/improve, 2026-11-23):** the first version used `linkFocusClasses`, whose `rounded-sm` overrode the link's own `rounded-md` (tailwind-merge keeps the later radius), so the corners shrank. It now uses `focusRingClasses`, which has no radius. A regression test covers it.

**Not changed:** the raw `neutral-*` colours and the sizing. Those wait for Toolbar's own enhancement.

**Verify inconclusives (pre-existing):**

- Default: color-contrast (3 nodes) and label-content-name-mismatch (6 nodes).
- With input: label-content-name-mismatch (2 nodes).

Running verify on the original Toolbar.tsx gives exactly the same set, so they come from the unenhanced Toolbar, not this change. They belong to Toolbar's own enhancement.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
