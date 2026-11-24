# NumberField — Change Log

## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `NumberField.parts.tsx` (`"use client"`, one named export per part). `NumberField.tsx` is now a server-safe entry that rebuilds the `NumberField` namespace and re-exports its types and helpers, so `<NumberField.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- See `packages/ui/LOG.md` for the whole change and the guard that enforces it.

## 2026-11-21 — Warning state now uses the `--sp-warning` token (GEO-970)

The warning border was written as `border-[var(--sp-warning,var(--sp-fg-default))]`, which fell back to a dark border while the token was still on another branch (PR #44). The token is on the base now, so the state uses the `border-warning` utility and the fallback is gone. The test now checks for `border-warning`, and the warning story's "pending the token" note is replaced with real hint text. Checked with Playwright: the border is `#b45309` in light, `#fcd34d` in dark and `#7a4100` in high contrast, the same as the token.

## 2026-11-21 — Forced-colours focus workaround removed (GEO-950, GEO-970)

`sp-focus-ring` now covers forced colours itself. Windows High Contrast strips the box-shadow ring, so the utility now adds a transparent 2px outline there, which the system paints in its own colour. So the group's `forced-colors:has-[input:focus-visible]:outline-*` fallback is gone. The outline only applies in forced colours, so normal mode is unchanged. Checked with Playwright forced-colours emulation: the outline is solid 2px at offset 2px, and normal mode matches what it was before.

## 2026-11-16 — Sign-off (GEO-929)

George signed off ("looks good"), relayed by the coordinator. I ran `/improve` scoped to this folder; the plans are in the gitignored `plans/` folder. It found three issues, all fixed here, each with a regression test:

1. **Function `className` was silently dropped.** Base UI types `className` as `string | (state) => string`, but every part passed it through `cn()`, and clsx ignores functions. So a state-based className vanished with no error.
   - Fix: a local `mergeClassName(base, className)` helper. A string merges via `cn` as before; a function becomes `(state) => cn(base, className(state))`. It's used on Root, Group, Input (including `inputProps.className`), Increment, Decrement, ScrubArea and ScrubAreaCursor.
   - Tests: three, covering a state function on Root/Group/Input, on the steppers, and plain strings still merging.
   - **This affects the whole library:** Input, Field, Checkbox and the rest use the same `cn(..., className)` pattern. Flagged to the coordinator for a library-wide ticket; only NumberField is fixed here.
2. **Adornments ignored `size="lg"`.** `addonClasses` hard-coded `text-sm`, so with lg the value was `text-base` and its unit `text-sm`.
   - Fix: removed it, so adornments inherit the group's text size. md and sm render identically (Adornments screenshot re-checked).
   - Test: added.
3. **The ResizeObserver re-check was untested,** although this log claims the behaviour (stacked recovering once the group is tall enough, e.g. after first rendering in a hidden panel).
   - Test: stubs ResizeObserver and drives 40 → 48 → 32px. It checks end → stacked → end and that `disconnect` runs on unmount.
   - The `afterEach` now also unstubs globals, so a failing assertion can't leak the stub into later tests.

**Considered and rejected by /improve:**

- Hover overriding the disabled, read-only or valid border: checked in Playwright, the border colour is unchanged on hover in all three.
- Warning/valid carrying no programmatic state: deferred to the Field.Warning ticket by George.
- Prepend/append not `aria-hidden`: kept consistent with Input's addons; the docs say to put units in the label.
- GEO-957: the coordinator fixes it at restack.

**Checks:**

- `pnpm test`: 313 passed (25 files), 35 of them NumberField.
- `STORYBOOK_PORT=6009 pnpm verify numberfield`: ALL CHECKS PASSED. 13 stories, 0 a11y violations, 0 inconclusives.
- `pnpm lint` and eslint on the folder are clean.
- Scratch-tsconfig type-check (GEO-951) is clean for NumberField.

No open questions for George.

## 2026-11-16 — Full enhancement (GEO-929)

Scope approved by George (via the coordinator) on 2026-11-16. The research is in RESEARCH.md: all 9 libraries plus Base UI 1.9.

### What changed

- **Semantic tokens + density.** Hardcoded `neutral-*` classes are replaced with surface/fg/border tokens. Height comes from `--sp-control-height(-sm|-lg)` through a local `--sp-nf-height` var, so every density and theme works.
- **The group is the control.** The 2px border, radius, hover, focus ring (`has-[input:focus-visible]:sp-focus-ring`) and states all sit on `NumberField.Group`, matching Input's `input-group`. Before, the focus ring was on the input alone, so the steppers looked detached.
- **`controls` prop on Root:** `"end"` (default) | `"split"` | `"none"` | `"stacked"`.
  - `end` has both buttons side by side after the value (Carbon). Each is a full-height square (36px at default density).
  - `split` is `− value +` (MUI spinner, Ant `mode="spinner"`, Chakra mobile stepper). The value is centred, unless there are adornments (see below).
  - `none` has no steppers and is keyboard only (GOV.UK).
  - `stacked` has chevrons stacked after the value (Mantine, Chakra, Ant, Spectrum). See the WCAG note below.
- **Auto-compose.** `<NumberField.Group />` with no children renders the parts for the chosen layout. Manual composition (children) still works. `inputProps` reaches the auto-rendered Input, e.g. `aria-label` when there's no Field.
- **Default icons.** Phosphor `Plus`/`Minus` (or `CaretUp`/`CaretDown` when stacked) are auto-rendered, `aria-hidden`. Pass children to override.
- **`prepend` / `append` on Group,** the same API as Input: a string gets `pl-3`/`pr-3`, anything else gets `2.5`. In split, they sit inside the steppers.
- **`size` sm/md/lg** maps to the control-height tokens. lg also bumps the text to `text-base`, matching Button.
- **`valid`** gives a green border only, with no check icon (George's decision 4: an icon crowds the steppers). It sets `data-success`. The name isn't `data-valid`, because Base UI already uses that for Field validity.
- **`warning`** gives an amber border and sets `data-warning`. It overrides `valid`, and Field `invalid` overrides both.
- **`loading`** renders `Spinner` (`role="status"`, `aria-label="Loading"`) after the value, sets `aria-busy` on the input and `data-loading` on the group.
- **`selectOnFocus`** (opt-in, default off) selects the whole value on focus. A consumer's `onFocus` still runs.
- **Read-only + disabled steppers.** Base UI marks read-only steppers with `aria-disabled="true"` but no `disabled` attribute. Our first pass used `disabled:` variants, so read-only steppers looked clickable. They're now styled with `aria-disabled:`, which covers both states. Only the icon fades, because in the stacked layout the button also draws the outer border (fading the whole button would fade that border).
- **ScrubArea / ScrubAreaCursor styled.** `cursor-ew-resize` on the area and any label inside. The cursor shows a Phosphor `ArrowsHorizontal` by default.
- `tabular-nums` on the value, so digits don't jitter while stepping.
- **Stories:** Default, Controls, Sizes, States, Density, Themes, Formatting, Adornments, RangeAndStep, Scrub, Behaviour, Width, Composition. All use Field.Label, Field.Description and Field.Error, with no raw `<label>`.
- **30 unit tests.**

### Why — stacked steppers and WCAG 2.5.8

`stacked` is in scope because four libraries have it. But each half must be at least 24×24px (WCAG 2.5.8, Target Size Minimum). The spacing exception doesn't help here: the two halves touch, so their 24px circles overlap.

- **Measured, not guessed.** The group measures its rendered height (in a layout effect and with a ResizeObserver) and allows stacked only when `height / 2 ≥ 24`. Otherwise it renders `end` and logs one dev warning that names the measured size and the fixes. Measuring covers density, size, coarse-pointer overrides and consumer height overrides alike, where checking a `data-density` ancestor would miss size and custom heights.
- **The buttons carry the outer border.** At comfortable density the control is 48px. With a normal inset layout, the group's 2px border would leave each half 22px, under the limit. So the stacked column overlaps the group's top, end and bottom border (`-my-0.5 -me-0.5`), and each button draws that edge itself (`[border-color:inherit]` from the group, so hover, valid, invalid and warning colours follow). That gives each button a 24px hit area. Measured in Playwright: 24 / 24.
- **Exact halves.** `flex-1` gave 24.5 / 23.5 because the borders are unequal, so the halves use `basis-1/2`.
- **Separators are pseudo-elements.** They're drawn as `::before`/`::after` inside the outer border. Button borders crossed the outer border and notched it (visible at 3× zoom).
- **Where stacked is honoured:** comfortable at md and lg, and default at lg. It falls back at compact (all sizes), at default sm/md, and at comfortable sm (40px, so 20px halves).

### Why — other decisions

- **Default `"end"`.** It's the most common pattern across the libraries, keeps full-height targets, and leaves the value left-aligned like other inputs.
- **Split + adornments are left-aligned.** A centred value drifted away from its `£` / `each` (seen in the screenshot), so the value aligns to the start whenever adornments are present.
- **`format` vs adornments.** `format` (Intl) text is part of the input value, so screen readers read it out. `prepend`/`append` are visual only, so put the unit in the label too (GOV.UK). The Formatting and Adornments stories say this.
- **Warning token: built against a fallback.** `--sp-warning` exists only on Lane 1's Toast branch (PR #44). The border uses `var(--sp-warning, var(--sp-fg-default))`, so it picks up the amber token automatically after the restack, with no change here. Until then it shows a dark border, and the story's description says it's pending. Checked in Playwright: with `--sp-warning: #b45309` set on `:root`, the border computes to `rgb(180, 83, 9)`. No token files were changed.
- **Forced colours (GEO-950 workaround).** `sp-focus-ring` is a box-shadow, which forced-colours mode removes. The group draws a 2px solid `Highlight` outline on `has-[input:focus-visible]` in forced colours (checked in Playwright: `solid 2px`). Separators use `CanvasText`. Remove this once GEO-950 lands the shared fix.
- **Context on Root.** The visual props (`size`, `controls`, `valid`, `warning`, `loading`, `selectOnFocus`) live on Root and reach the parts via context, so both auto-composed and hand-composed parts pick them up. Adornments live on Group, the same as Input.
- **Addon padding is duplicated from Input.** Input's `addonClasses`/`addonPadding` aren't exported, and editing Input is out of this ticket's scope. Extract to `lib/` if a third component needs them.

### Verified

- `pnpm test`: 308 passed (25 files), 30 of them NumberField.
- `STORYBOOK_PORT=6009 pnpm verify numberfield`: all checks pass across 13 stories. 0 a11y violations, 0 inconclusives, no duplicate IDs, every interactive element named, no redundant wrappers. (The first run flagged the story decorator `<div>` as a redundant wrapper, so the width cap now sits on each story's root.)
- **Playwright:**
  - The group border darkens on hover, and the two-tone focus ring shows on Tab.
  - The input is the only tab stop: Tab moves on to the next field, skipping the steppers.
  - ↑ steps the value, Shift+↑ uses largeStep (25 → 75), and snapOnStep takes 7 → 10.
  - Read-only steppers show `not-allowed`, the icon at 0.38 opacity, and a click doesn't change the value.
  - selectOnFocus selects [0, 3], and the mouse wheel (opt-in) steps.
  - The scrub label has an `ew-resize` cursor and dragging changes the value. The custom ScrubAreaCursor didn't render in headless Chromium (pointer lock is denied there), so it still needs checking in a real browser.
- I screenshotted and looked at all 13 stories. The stacked layout was zoomed at 3× in light, dark and high-contrast.

### Considered and rejected

- **BigInt / string mode** (Mantine BigInt mode, Ant `stringMode`). Base UI's NumberField value is `number | null`, and its parsing, stepping and Intl formatting all work on `number`. Supporting arbitrary precision would mean forking the primitive. Rejected by George's decision 10 (2026-11-16). For values beyond `Number.MAX_SAFE_INTEGER`, use an `Input` with `inputMode="numeric"` and validate on the server.

### Deferred (George's decision, not rejected)

- **Visual variants** (Chakra subtle/flushed, Ant filled/borderless/underlined, Spectrum quiet, Carbon fluid). An accepted exception to the "if one library has it, it's in scope" rule. The coordinator is raising a library-wide "input variants" ticket for Input, Textarea, Select and NumberField together, so the API stays consistent.
- **Field.Warning across inputs.** NumberField has `warning` now. The coordinator is raising a cross-input Field.Warning ticket.
- **Input `size`.** NumberField has sm/md/lg now. The coordinator is raising a ticket to add `size` to Input for consistency.

### Found along the way (outside this component)

- **GEO-957:** `<Field.Error>` doesn't render when `Field.Root invalid` is the only signal. In Base UI 1.9, `Field.Error` renders only on real validity failure or `match`. This also affects Input's stories: the Input Themes story has 3 invalid fields and 0 rendered errors. NumberField's stories use `<Field.Error match>`. Logged as GEO-957. The coordinator fixes it at restack, so it is deliberately not fixed in this branch.

## 2026-11-18 — Looks disabled inside a disabled fieldset / ButtonGroup (approved shared change, GEO-896 follow-up)

- **Bug:** inside a disabled ButtonGroup (a native `<fieldset disabled>`), NumberField was functionally disabled (the input and steppers matched `:disabled`, couldn't be focused or clicked) but looked enabled at full opacity. Its styles keyed off Base UI's `data-disabled`/`aria-disabled`, and an ancestor fieldset sets neither.
- **Fix:** the Group also styles from native `:disabled` (`has-[input:disabled]:` gives the sunken background, control border and disabled opacity), and the steppers too (`disabled:` gives the not-allowed cursor, faded icon and no hover/active fill). It's the same look as the Base UI-disabled path.
- **Regression test:** inside `<fieldset disabled>`, the input and Increase are disabled, there's no `data-disabled`, and the native-disabled classes are present. 36 tests.
- **Checked in Playwright:** the ButtonGroup DisabledCascade story shows NumberField dimmed. `pnpm verify numberfield` passes all checks.
- **Approved** by George via the coordinator (2026-11-18).

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- The local `mergeClassName` helper (added in GEO-929) moved to `lib/merge-class-name.ts`, and this file imports it.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Error message shown in stories (GEO-957, GEO-970 Part A)

- Stories: the `Demo` helper's `<Field.Error match>` workaround is removed, so the stories now rely on the GEO-957 fix. The Themes "Split, error" demo gets a message ("Quantity must be 5 or more").
- `pnpm verify` passes all checks.
