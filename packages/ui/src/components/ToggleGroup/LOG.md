# ToggleGroup — Change Log

## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `ToggleGroup.parts.tsx` (`"use client"`, one named export per part). `ToggleGroup.tsx` is now a server-safe entry that rebuilds the `ToggleGroup` namespace and re-exports its types and helpers, so `<ToggleGroup.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- See `packages/ui/LOG.md` for the whole change and the guard that enforces it.

## 2026-11-21 — Enhancement (GEO-933)

George agreed to all 17 recommendations via the coordinator; the research is in RESEARCH.md. **API change:** `ToggleGroup` is now a compound, `ToggleGroup.Root` plus `ToggleGroup.Separator`. Nothing else in the repo imported the old single component.

1. **Root plus Toggle items.** Root is Base UI ToggleGroup, and the items are our Toggle (`value` required). Root provides ButtonGroupContext, so `size`, `variant`, `color` and `disabled` reach the items and an item's own prop wins. A new `ToggleGroup/context.ts` passes `readOnly`, `invalid`, `orientation` and `attached`.
2. **`string[]` in both modes**, as in Base UI.
3. **`disallowEmptySelection`** (Spectrum), default false. Releasing the last pressed item is cancelled through `eventDetails.cancel()`.
4. **Roles:** Base UI's `role="group"` with `aria-pressed` items. A single tab stop, arrows follow the orientation, Home/End and looping work, arrows move focus without changing the selection (MUI), and disabled items are skipped. A dev warning fires when the group has no `aria-label` or `aria-labelledby`.
5. **`attached` default true** reuses `lib/connected.tsx` and adds solid dividers like ButtonGroup. `attached={false}` spaces the items with the control gap.
6. **`orientation`** and `loopFocus` come from Base UI.
7. **`grow`:** items share the full width equally.
8. **Form `name`:** one hidden input per selected value. None are rendered when the group is disabled.
9. **`required` + `invalid`:**
   - **Invalid:** sets `data-invalid`, and every item gets `aria-invalid` (danger border).
   - **Required:** a hidden input can't be constraint-validated, so a visually hidden `required` text input (`aria-hidden`, `tabIndex=-1`) blocks submission while nothing is selected. Focusing it moves focus to the first item.
   - **Connected styling:** `lib/connected.tsx` gained a generic `[data-connected-ignore]` exclusion so this input doesn't count as a segment.
   - **Story:** InField with `Field.Error match` (GEO-957).
10. **`readOnly`:** every item is focusable but nothing changes. It reaches the Toggles through context, and the root cancels changes too.
11. **Sliding indicator** (Mantine, Chakra, Ant). It's on by default for single-select attached groups; `slidingIndicator={false}` turns it off.
    - **How:** it's the root's `::before`. A pseudo-element isn't a child, so it can't disturb the connected first/last/adjacency selectors. Its position and size come from CSS variables measured from the pressed item (`offsetLeft`/`Top`/`Width`/`Height` and its border radius).
    - **Re-measured** by a MutationObserver (`data-pressed`, controlled or not) and a ResizeObserver (density, resize, font load).
    - **First placement** doesn't animate. The transition only starts once `data-indicator="ready"` is set.
    - **Pressed item:** it goes transparent, so the indicator is the fill.
    - **Reduced motion:** the transition is off.
    - **Forced colours:** the indicator is hidden and the pressed item uses `Highlight`.
    - **Checked in Playwright:**
      - it sits under the pressed item and slides when another is pressed (caught mid-slide at 169 → 175px);
      - it follows a density change (40 → 48px tall);
      - in RTL it lines up with the pressed item (physical offsets with physical left and translate);
      - the transition is 0.2s, or 0s with reduced motion.
12. **Tooltips:** deferred to GEO-959. The icon-only items in the stories (Multiple, IconOnly, HideLabels at small widths) need them.
13. **`hideLabelsBelow`** "sm" | "md": below the breakpoint, each Toggle's `[data-slot=toggle-label]` becomes `sr-only`, so the icons stay and the names are kept. At 375px the label is 1px and absolutely positioned, and "Grid" is still found by name. The overflow and dropdown mode is deferred to Toolbar (GEO-928); a note was added there.
14. **Counts:** compose a `<Badge>` (WithBadgeAndAction story).
15. **`ToggleGroup.Separator`:** runs across the group, inset only in spaced groups. The story pairs it with a plain Button action.
16. **`items` prop:** `{ value, label, icon, pressedIcon, srOnly, disabled }`, rendered as Toggles before any children. An item with an icon and no label is icon-only.
17. **Activation:** Space or Enter only, never on arrow focus (see Considered and rejected).

**Toggle changes, made here because ToggleGroup needs them:**

- Toggle reads `ToggleGroupContext`: `readOnly` is OR-ed and `invalid` becomes `aria-invalid`.
- Its visible label is wrapped in `<span data-slot="toggle-label">` (inline-flex, gap-2, so a Badge inside keeps its spacing). That's what `hideLabelsBelow` targets.

**Considered and rejected (George approved these exceptions):**

- **A count prop (Primer `count`):** compose a `<Badge>` instead, as decided for Toggle.
- **Automatic activation on arrow focus (Carbon ContentSwitcher):** that's tab semantics. Toggles act on Space and Enter, and arrows only move focus (MUI).

**Stories:** Default, Multiple, DisallowEmpty, Orientation, AttachedVsSpaced, Grow, IconOnly, HideLabels, Items, Form (live FormData), InField, ReadOnly, WithBadgeAndAction, States, Density, RTL, Themes. Themes shows every variant × default/brand/danger with the indicator; invalid, read-only and disabled; and inverse on a dark surface, in light, dark and high-contrast.

States has no "valid": selecting an option isn't validated as correct.

**Verified:**

- 24 ToggleGroup tests.
- `pnpm test`: 444 passed (29 files).
- `STORYBOOK_PORT=6009 pnpm verify togglegroup`, `toggle` and `buttongroup`: all checks pass.
- Lint is clean.
- Looked at all 17 screenshots, plus the 375px HideLabels view.

## 2026-11-21 — Separator splits an attached group (George picked B, "last of type")

- **Problem (George's review):** in an attached group, a separator read as a heavy seam, a 1px line between two full 2px item borders.
- **Options:**
  - **A:** a lighter line. Prototyped, not chosen.
  - **B:** a split, chosen by George.
- **What B does:** `lib/connected.tsx` treats a separator as a break between runs.
  - The item before it gets the run's end rounding (`:has(+[role=separator])`, or with a hidden form input in between).
  - The item after it gets the start rounding.
  - The separator becomes a `--sp-control-gap` space with no line (`!bg-transparent`, `!m-0`).
  - The result is `[Open | Closed]  [Mine]`. It works in both orientations, and ButtonGroup.Separator gets it too.
- **Checked in Playwright**, light, dark and high contrast (SeparatorSplit story, WithBadgeAndAction, ButtonGroup SeparatorAndText):
  - ArrowRight crosses the split, from Two to Three, and the separator isn't focusable;
  - the sliding indicator follows a press to the far side;
  - the separator measures 8px and transparent;
  - the radii come out as two runs.
- **Story:** SeparatorSplit (outline, solid, vertical, and the badge row, in three themes). Tests cover the connected classes (both orientations) and keyboard focus across the split.

## 2026-11-21 — Sign-off (George: ToggleGroup signed off; separator B)

/improve (a quick review of this diff) found two problems, both fixed:

1. **A Toggle with `name` right before a separator didn't get its end rounding:** its hidden input sat between it and the separator. The split selector now also matches `:has(+[type=hidden]+[role=separator])`.
2. **The sliding indicator missed items added after mount:** the MutationObserver only watched `data-pressed` attributes, and a newly inserted item already has the attribute. It now watches `childList` too and re-observes new children for resize. There's a regression test (controlled value whose item arrives in a later render).

Rejected: none.

Also: "hides when nothing is pressed" asserted synchronously, but MutationObserver callbacks run asynchronously, so it was flaky under full-suite load. It now uses `waitFor`. `pnpm test`: 447 passed twice in a row. verify togglegroup, toggle and buttongroup pass all checks.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
