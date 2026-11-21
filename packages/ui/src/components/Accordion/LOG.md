# Accordion — Change Log

## 2026-11-16 — Signed off; /improve fixes before commit

George signed off on 2026-11-16 (relayed by the coordinator), including the hover-divider tweak below. /improve (quick, scoped to this folder plus the Collapsible export) found 5 issues. All are fixed, with 4 new regression tests:

1. **The expand-all toggle ignored Root `disabled`**, so it could open sections of a disabled accordion. The toggle is now `disabled` along with the Root.
2. **"Hide all sections" did nothing with `collapsible={false}`.** The empty value was cancelled by the keep-one-open rule, so the button looked broken. It now leaves the first open section open.
3. **`rememberKey` still wrote to sessionStorage when controlled**, contrary to its docs. Writes now happen only when uncontrolled.
4. **Unnecessary re-renders:**
   - The root context was rebuilt on every render, re-rendering every part. It's now memoised, and so is the resolved state text.
   - Item registration forced a root re-render even when nothing had changed. It now skips unchanged entries.
5. **Test gaps** for 1–3 and for the hover-divider selectors are now covered.

Rejected after tracing:

- **A render loop with object item values:** Item props don't change when Root re-renders, so the registration effect doesn't re-run.
- **Nested accordions catching each other's arrow keys:** both handlers check `closest('[data-slot=accordion]')`.
- **A consumer's `aria-labelledby` being overwritten on panels:** `rest` is spread after our override.

**Forced-colours focus outline:** kept as Accordion's local workaround for now. The shared `sp-focus-ring` fix is tracked as **GEO-950**, which the coordinator will do after the restack. Remove the local outline classes once GEO-950 lands.

**Collapsible export:** `useCollapsibleOpenChangeComplete` (one line at the end of `Collapsible.tsx`) ships in this commit so Accordion can reuse the completion hook.

Checks: full suite 382 tests (33 Accordion), `pnpm verify accordion` with 0 violations and 0 inconclusives, eslint and prettier clean, typecheck clean.

## 2026-11-16 — Review tweak: hide dividers around a hovered header (George)

George's review feedback (relayed by the coordinator): in the `default` variant, the grey rounded hover fill sat between two divider lines. This is the same feedback as Menu's dividers in Lane 2 (Primer-style `showDividers`), so the pattern matches: hide the line on both sides of the highlighted item.

- **Dividers are now top borders** (`border-t first:border-t-0`), not bottom borders. CSS doesn't allow `:has()` inside `:has()`, so making the _previous_ item's bottom border react to a hovered next item isn't possible. With top borders:
  - The line above a hovered header is the item's own top border (`&:has(> … trigger:hover)`).
  - The line below is the next item's top border, reached with a sibling selector (`[item:not([data-open]):has(… trigger:hover) + &]`). This applies only while the hovered item is closed. When it's open, the panel sits between the header and that line, so the line stays.
- **Transparent, not removed**, with a fast border-colour transition, so there's no layout shift. The root height measured 178px both at rest and on hover.
- Disabled and `aria-disabled` (keep-one-open) triggers have no hover fill, so their lines stay.
- Measured in Chromium, Default story:
  - Hovering closed item 2 makes item 2's and item 3's top borders transparent.
  - Hovering open item 1 leaves the line after its panel visible.
  - Hovering the last item hides only the line above it.
  - Hovering a disabled item leaves its lines unchanged.
- **Keyboard focus:** unchanged. `:focus-visible` shows only the two-tone ring, with no fill, so there's nothing to sit between the lines.
- **Other variants checked:**
  - `bordered`'s fill is a square, edge-to-edge cell that the dividers frame like a table row. Hiding them would merge it into its neighbours, so they stay.
  - `separated` fills inside each card's own border.
  - `filled` and `ghost` have no dividers.
- Considered and rejected: dimming the neighbouring lines instead of hiding them. George asked for the Menu pattern, which hides them.

## 2026-11-16 — Full enhancement (GEO-922, Lane 3)

I redid the research across all 9 libraries (see RESEARCH.md). George approved the scope on 2026-11-16 (relayed by the coordinator).

### Decisions (George, 2026-11-16)

1. **Arrow / Home / End keys between headers: included, opt-in (`keyboardNavigation`), off by default.**
   - Mantine has them (`loop`), so the one-library rule puts them in scope.
   - Off by default because APG removed these keys from the accordion pattern ([PR #3434](https://github.com/w3c/aria-practices/pull/3434), 2026-04-29), and Base UI 1.9 deprecated its roving focus to match. Tab and Shift+Tab are the expected way to move.
   - Base UI no longer implements the keys at all (`loopFocus` and `orientation` are no-ops), so this is our own handler on Root. It loops, skips disabled items, and ignores triggers of nested accordions.
2. **Default heading level h3**, with `headingLevel` on Root and `level` per `Accordion.Header`.
3. **Remembering open sections is opt-in** via `rememberKey`. It stores the open values in sessionStorage under `sp-accordion:<key>`, and survives blocked storage. GOV.UK remembers by default; we don't, because silently persisted UI state surprises people outside government services.
4. **Panel `role="region"` is opt-in** (`regions`). Base UI always adds `role="region"` + `aria-labelledby`, so by default we strip both. A role-less div with `aria-labelledby` is an axe `aria-prohibited-attr` issue, which the first verify run caught. APG warns that regions on many panels flood the landmark list.
5. **`hiddenUntilFound` on by default**, the same as Collapsible. Find-in-page and `#:~:text=` links open closed panels; checked in Chromium.

### Bug fixed

- **Panels never animated open.** Like Collapsible before, the Panel only had `data-[starting/ending-style]:h-0` and no target height. It now animates `height` to `--accordion-panel-height`. Measured in Chromium: 0 → 38 → 49 → 56px over 250ms.
- **The old story's `defaultValue={[0]}` never opened anything.** Base UI item values default to generated ids, not indexes. The stories now use explicit values.
- **Hardcoded `neutral-*` colours** replaced with semantic tokens.

### What changed

- **Reuses Collapsible's** chevron, icon rotation (end/start, RTL-aware), trigger sizes, content padding and motion classes (`collapsibleStyles`, `CollapsibleChevron`). It also reuses the completion hook, which is now exported as `useCollapsibleOpenChangeComplete`; that is a one-line addition in the Collapsible folder (Lane 3).
- **Root:**
  - `size` sm/md/lg (density-aware heights: 32/40/48 at md across compact/default/comfortable).
  - `variant`: `default` (dividers), `bordered` (one box), `separated` (cards), `filled` (open item tinted), `ghost` (flush).
  - `iconPosition`, `stateText` (GOV.UK "Show"/"Hide", localisable), `expandAll` (a "Show all sections"/"Hide all sections" toggle with localisable labels and `aria-expanded`; it needs `multiple`, otherwise it warns in dev and isn't rendered).
  - `collapsible={false}` keeps the last open item open, and its trigger gets `aria-disabled` (Mantine `disableCollapse`, Chakra `collapsible`).
  - `ordered` renders an `<ol>` of `<li>` items with a visible number. The number is `aria-hidden` because the list already gives the position.
  - `animateOpacity`, `transitionDuration`, `transitionEasing`.
  - Root mirrors the value (controlled or uncontrolled) so expand-all, remembering and keep-one-open can read it.
- **Item:** `onOpenChangeComplete(open)`, fired after the height transition, or immediately under reduced motion. Items register their value (generated if not given) so expand-all knows every enabled item.
- **Header:**
  - Renders `h{level}`.
  - `actions` puts controls beside the heading, not inside it, so the heading holds only the trigger (APG).
  - In boxed variants (bordered/separated/filled) the actions fill flush square end cells that take the container's corner radius. This is the same treatment George asked for on Collapsible's header. Measured: 40×40, flush to the inner border, radius 9px on the outer corner only.
- **Trigger:**
  - `icon` (node, function of open state, or `null`), `iconPosition` override, `leadingIcon` (decorative), `summary` (a secondary line that's part of the button's name, as on GOV.UK).
  - Whitespace text nodes separate the title, summary and state text so the accessible name doesn't run together ("PaymentVisa…"), which a unit test caught.
  - Two-tone focus ring, plus a solid `Highlight` outline in forced colours, because box-shadow rings disappear there. Measured: outline `solid 2px` under `forced-colors: active`.
  - Disabled styling.
- **Panel:** padding on an inner `data-slot="accordion-content"` so the height animation doesn't jump; `contentProps`.
- **Skeleton** (new, Carbon `AccordionSkeleton`): `role="status"` with a localisable sr-only label, decorative pulsing rows in each variant's chrome, no pulse under reduced motion, CanvasText bars in forced colours.
- **Tests:** 29 unit tests.
- **Stories:** Default, States, Variants, Sizes, Icons, SummaryAndStateText, ExpandAll, HeaderActions, Ordered, KeyboardNavigation, RememberOpenSections, HeadingsAndRegions, Skeleton, Motion, FindInPage, Controlled, RTL, Density, Themes.

### Considered and rejected

- **Indenting panel content to line up with the title** when there's a leading icon, a number or a start chevron. The icon width is up to the consumer, and Mantine, Chakra and AntD don't indent either. Revisit if George wants it.
- **Clipping the bordered box with `overflow: hidden`** to round the corner triggers. It would clip the focus ring (a box-shadow). Instead, items set `--sp-accordion-radius-top/bottom` and triggers and actions read them.
- **Skeleton bars in `surface-sunken`**: nearly invisible in dark mode, so they use `fg-default/10`.
- **A `Accordion.ExpandAll` part** that the consumer places anywhere. Inside an `ordered` `<ol>` it would be invalid HTML, so it's a Root prop rendered above the list.
- **Making `stateText` `aria-hidden`.** `aria-expanded` already conveys the state, but hiding visible text that's inside the button breaks WCAG 2.5.3 (label in name) for voice-control users.

### Flagged (shared, not changed)

- `sp-focus-ring` (tokens) is box-shadow only, so focus is invisible in forced-colours mode for every component that uses it. Accordion adds its own forced-colours outline. A shared fix belongs in `packages/tokens/src/focus-ring.css`, which is outside Lane 3. It's tracked as GEO-950.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
