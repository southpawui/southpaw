# DescriptionList — Change Log

## 2026-11-23 — Sign-off (GEO-966)

George signed off DescriptionList: "copy: tooltip, fix 1 and 2". The copy feedback stays as a tooltip, not a toast.

**Fixes from George's review**

1. **Spacing:** the copy button and the Term's info button sit 1.5 × `--sp-control-gap` from their text (12px by default, scaling with density), so they're spaced the same.
   - Before: the copy button was 8px away, and its focus ring (5px outside the button) came within 3px of the value. The info button was 4px away.
   - Measured after the change: 12px to both buttons, with 7px of clear space before the ring.
2. **Repeat announcements:** `lib/announce` gains `announce(message, { force: true })`.
   - A forced message is written even when it's identical to the one still in the region. The region is emptied, then the message is written again after the usual 100ms gap, so screen readers hear a change.
   - The default de-duplication is unchanged, so Skeleton.Group still says "Loading" once.
   - `useCopyToClipboard` forces "Copied" and "Copy failed", so copying a second value within 7s is heard. This replaces the "known limit" in the entry below.
   - There are 3 new tests in `announce.test.ts`. The gap is the announcer's existing 100ms rather than a single animation frame: it's the same clear-then-write path, and the announcer's own notes say screen readers need that gap.

**/improve findings** (scoped to the component, the copy hook and `announce` `force`)

1. **Fixed (a11y, WCAG 1.4.13):** the 2s hold kept "Copied" open even after Escape, so it couldn't be dismissed. Escape (Base UI reason `escape-key`) now dismisses it until the next copy. The copied state itself is unchanged. Test added, and checked in Chromium.
2. **Fixed:** the Root memo keyed `labels.info` by its source text. A new function with the same text (for example, a translation closure) kept the old one. The function itself is now a dependency. Test added.
3. **Fixed:** a copy that resolved after unmount still set state and started a timer. It now only calls `onCopy`.
4. **Fixed (test gaps):** tests for a second copy being announced again, translated copy labels, SummaryCard `context`, and date-range formatting.
5. **Rejected:** the copy button's name changing to "Copied" while it shows. The tooltip is its label on purpose (see Considered and rejected), and the announcer covers the change.
6. **Rejected:** ranges that mix numbers and dates. That isn't a supported value type.

**Checks**

- `pnpm test`: 1185 pass, including 44 DescriptionList tests and 13 announce tests.
- `pnpm lint` and `pnpm typecheck` are clean.
- `pnpm verify descriptionlist` passes with no a11y violations and no inconclusives.
- I re-took the Copyable "Copied" screenshot and the States screenshot and looked at both.

**Base:** `geo-964-indicator` @ d117eda (it contains Skeleton), with the coordinator's agreement. Item `loading` follows as its own commit.

**Open, for a manual check:** VoiceOver and NVDA reading the grid `dl`.

## 2026-11-23 — Review fixes before sign-off (GEO-966)

George's review asked for three changes before sign-off.

1. **SummaryList story:** the two "Contact details" actions now read "Change phone" and "Change email". Hidden context still completes them: "Change phone number", "Change email address".
2. **Multi-line values:** no gap between lines. Each `<p>` in a value is a line of one block, like an address (GOV.UK spacing), not a separate paragraph. The `mb-2` between paragraphs is gone.
3. **Copy feedback** (George: "a check icon and 'Copied' after the button has been clicked"). This is the Primer / GitHub / Mantine pattern, built into the shared `useCopyToClipboard` hook and the internal button, so GEO-978 inherits it:
   - **On a successful copy:** the icon swaps to a check, and the tooltip says "Copied" and stays open for 2s. Then both go back.
   - **On failure:** the same, with "Copy failed" (was "Couldn't copy") and a danger tooltip.
   - **Screen readers:** the hook announces "Copied" / "Copy failed" through the shared `lib/announce`. The button's own `role="status"` region is gone.
   - **No toast:** too heavy for an inline copy.
   - **Reduced motion:** the icon swap is instant. The tooltip fade and the colour change use the `--sp-duration` tokens, which are 0 under reduced motion.

**Base:** the branch was fast-forwarded onto `geo-963-skeleton` @ 7dc6636 (Skeleton, plus `lib/announce`). No commits of mine were moved.

**Known limit (fixed at sign-off, see above), in `lib/announce`, owned by Skeleton:** the announcer skips a message identical to the one still in its region (7s). Copying a second value within 7s says nothing to screen readers, though the tooltip still shows "Copied". This is flagged to the coordinator. A fix belongs in `lib/announce`, for example a way to force a repeat.

## 2026-11-23 — New component (GEO-966)

Built on `geo-966-descriptionlist`, off `geo-967-link`. Research is in RESEARCH.md. George approved the decisions on 2026-11-21 (scope) and 2026-11-23 (detail).

**Parts**

- **Root** (`dl`). Options:
  - `orientation`: `responsive` (default) stacks, then goes side by side from `sm`; or `horizontal` / `vertical`.
  - `columns`: a number, or per breakpoint.
  - `variant`: `divided` (default), `plain`, `bordered`, `striped`.
  - `size`: `sm` / `md` / `lg`.
  - `labelStyle`: `muted` (default) or `strong`.
  - `labelWidth` (default 30%) and `labelAlign` (`start` / `end`).
  - `hideEmpty`: leave out rows with no value.
  - `items` shorthand, `labels` (translations) and `locale`.
- **Header:** a heading (default h2) and actions. Root lifts it out above the `dl` and names the list with `aria-labelledby`, because a `dl` can't contain a heading.
- **Item** (`div`): `span` (number or `full`), `divider`, `hideEmpty`. Used on its own, it renders its own `dl`.
- **Term** (`dt`) has `info`: an info button with a tooltip. **Details** (`dd`) has `value` + `format`, `copyable` and `empty`.
- **Actions** (`dd`) and **Action**, a Link with hidden context.
- **SummaryCard:** a Card with a tinted header (title, `headingLevel`, actions) around a list. It names the list and adds its title to every action's hidden context.
- **New helpers:**
  - `formatDescriptionValue`: Intl number, date, list and ranges.
  - `lib/use-copy-to-clipboard.ts`: shared, so the public CopyButton (GEO-978) can use it.

**Decisions (George, 2026-11-23)**

1. **Copy button:** an internal one now (`copy-button.tsx`, not exported). It's an icon Button whose Tooltip is its label ("Copy" plus the term as hidden context), switching to "Copied" / "Couldn't copy", with a polite status message (changed at review: see the entry above). GEO-978 tracks the public CopyButton.
2. **`loading`:** waits for the restack onto Skeleton (GEO-963), then lands as a small follow-up commit.
3. **Layout: a grid.**
   - In one column, the `dl` is `term | value | actions` and each row is a subgrid, so columns line up across rows, including rows without actions.
   - `display: contents` is never used on `dt`/`dd`.
   - In several columns, each Item lays out its own grid (term column 40%).
   - The responsive rows use `gap-y-1`, not `gap-1`. A subgrid's own `column-gap` overrides the one it inherits, which pushed values 6px out of line (caught with Playwright).
4. **Hidden context on actions:**
   - Automatic. It's the term ("Change" reads "Change Name"), plus `(card title)` inside a SummaryCard (GOV.UK v5).
   - Header and card actions get the title.
   - A term that isn't plain text is read from the DOM after render. Plain-text terms are read during render, so server HTML already has the context.
   - `context` overrides it; `context={false}` turns it off. A dev warning fires if no term can be found.
   - Two or more actions become a `ul` with dividers. Fragments are looked through.
5. **Rows without actions keep the actions column empty**, so values line up. With the subgrid, no spacer element is needed.
   - **Plus an option to hide the row** (George, confirmed when asked): `hideEmpty` on the Root, or per Item, leaves out a row when every value in it is empty, instead of showing "Not provided".
   - **How it decides:** the Item checks its direct `Details` children during render, so it works on the server and keeps stripes and dividers right. It only hides a row that has at least one `Details`, all of them empty.
   - **Docs:** the story says not to use it on a check-answers page, where people need to see what they skipped (GOV.UK).
6. **Empty values show "Not provided"** (GOV.UK Check answers). It's translatable through `labels.empty`, and `empty` sets it per value. The States story shows the "Enter X" link alternative.
7. **Per-Item `divider={false}`.** Striped rows become lines in forced colours.
8. **Multiple values:** paragraphs get spacing (none after the last), several `Details` per Term are allowed, and long values wrap (`break-words`).
9. **`headingLevel`** (default 2) on Header and SummaryCard. The card's actions take the card title.
10. **Label style:** `muted` is the default (George), and `strong` (GOV.UK bold) is the variant, so both are available.
11. **Sizes:**
    - `sm` / `md` / `lg` with density-aware row padding (`--sp-control-gap` × 1, 1.5, 2).
    - `labelAlign` uses logical start/end, so it flips in RTL.
    - `span="full"` takes the whole row.

**Still as approved (2026-11-21):** composition first with an `items` shorthand, the header outside the `dl`, responsive orientation, an Intl `format` helper, Term `info`, and a dev warning when an Item has no Term.

**GEO-959:** the copy and info buttons are icon-only, and both have a Tooltip.

**Verification**

- 36 unit tests.
- `pnpm verify descriptionlist` passes: a11y, duplicate IDs, names, DOM, and screenshots of all 19 stories.
- **Playwright:**
  - every row sits on a subgrid, with matching column widths in responsive and horizontal;
  - at 375px the rows stack with no horizontal scroll;
  - the copy button copies, announces "Copied", and is 32px.
- **Not yet checked:** VoiceOver and NVDA reading of the grid `dl` (the ticket asks for it). Flagged for a manual check.

**Considered and rejected**

- **`Item noActions`** (the value runs into the empty actions column): my first reading of "an option to just hide that row". George meant hiding the whole row when it's empty, so it was replaced by `hideEmpty` before review.
- **Hiding empty rows with CSS (`:has([data-empty])`):** it would catch nested Details, but the hidden rows would still count for `odd:` stripes and `not-last:` dividers. The render-time check doesn't have that problem.

- **Carbon's selectable rows, rendering as a table (Ant, Mantine, Carbon), and Ant's colon:** approved exceptions; see RESEARCH.md.
- **A spacer `::after` cell for rows without actions (GOV.UK):** not needed. The subgrid leaves the cell empty and the row's border still spans it.
- **`display: contents` on the row `div`:** subgrid does the same job and keeps the row a box, for borders, stripes and padding.
- **Copy button named by `aria-label` with the tooltip as its description:** a screen reader would read "Copy email, Copy". It uses the tooltip as its label instead, with the term hidden inside it.
