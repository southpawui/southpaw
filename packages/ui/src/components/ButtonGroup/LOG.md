# ButtonGroup — Change Log

## 2026-11-16 — New component (GEO-896)

George approved all 10 recommendations ("go for it"), including the two shared-file changes. The research is in RESEARCH.md.

### What was built

1. **Element.** A `role="group"` `<div>` built with Base UI `useRender`, so `render` works (e.g. `render={<nav />}`). Base UI has no ButtonGroup: Toolbar adds roving focus (GEO-928's job) and ToggleGroup is for pressed state. Every button keeps its own tab stop (tested).
2. **`attached`** (default false). Spaced groups use `--sp-control-gap`; attached groups use the shared connected styling (see 5).
3. **`orientation`** horizontal | vertical, plus **`stackBelow`** ("sm" by default). Spaced horizontal groups stack vertically and go full width below 640px, as GOV.UK does. `stackBelow={false}` keeps a row (it wraps if needed). Attached and vertical groups ignore it.
4. **Group props propagate to Buttons.** `size`, `variant` and `color` reach every Button through `ButtonGroupContext` (`ButtonGroup/context.ts`) as defaults, and a Button's own prop wins. `disabled` disables every Button, even one with `disabled={false}` (MUI, Spectrum). The group also gets `aria-disabled`.
5. **Shared connected styling: `packages/ui/src/lib/connected.tsx`.**
   - `connectedClasses(orientation)` goes on the group container and styles its direct children: outer corners rounded, inner corners square, 2px borders overlapping (so a seam is 2px, not 4px), and hovered/focused children lifted (`z-10`/`z-20`) so their border and focus ring aren't clipped. Separators are excluded.
   - ButtonGroup uses it now; ToggleGroup (GEO-933) and Toolbar (GEO-928) will reuse it, and OTPField's `attached` can switch to it later.
   - **Why `.tsx`:** Storybook's Tailwind `@source` only scans `packages/ui/src/**/*.tsx`, so classes in a `.ts` file would never be generated. **Coordinator:** widen `@source` to `*.{ts,tsx}` at the restack, then rename to `.ts`.
6. **`ButtonGroup.Separator`** (shadcn), Base UI Separator. It runs across the group (vertical in a row, horizontal in a column), `bg-border-control`, `CanvasText` in forced colours. Spaced groups inset it so it doesn't touch the buttons.
   - **Automatic dividers between solid buttons in attached groups.** Solid buttons have no border, so without a divider the boundary between actions disappears (WCAG 1.4.11). It's an inset 1px shadow in `color-mix(currentColor 50%)`.
   - My first try used `--sp-surface-base`, which vanished on `color="inverse"` (white on white, seen in the Themes screenshot). The button's own text colour always contrasts with its fill: about 3.4:1 on white and about 5:1 on navy.
   - Button now sets `data-variant` so the group can target solid buttons.
7. **`ButtonGroup.Text`** (shadcn ButtonGroupText, Mantine GroupSection). A non-interactive segment, sized from the group's `size`, with `render` support (e.g. `<label>`). Shown in pagination ("Page 3 of 9", `aria-live`) and as a group label.
8. **Mixed controls.** In attached horizontal groups, Input (`input-group`) fills the remaining space, and the Select trigger shrinks to its content. Stories: search Input + Button; Select + Input + Button.
9. **`grow`** (children fill the group) and **`align`** start | center | end. On stacking groups, `align` applies from `sm` up.
10. **Split button** with Popover (Menu isn't in this base). Switch to Menu at GEO-928.
    - Checked in Playwright: the trigger opens the popover; Escape closes it; the Close button closes it and focus returns to the trigger ("More save options").

**Logged without asking:**

- Any child is allowed (GOV.UK's buttons + links); there's no Link component yet.
- A Nested story (shadcn).
- A dev warning when an attached group has no `aria-label`/`aria-labelledby`.

**Stories:** Default, Attached, Orientation, Responsive, GroupProps, SeparatorAndText, WithInputAndSelect, GrowAndAlign, SplitButton, Nested, States, Density, Themes (every variant × default/brand/danger; inverse on a dark surface; spaced; disabled; pagination; in light, dark and high-contrast).

States story: valid/error don't apply to a group of actions (each Button carries its own state), so it shows default, one disabled, all disabled, loading and danger.

### Button.tsx changes (approved shared change)

- Reads `ButtonGroupContext` for `size`/`variant`/`color` defaults and OR-s `disabled`.
- Adds `data-variant`.
- **Bug fix found along the way:** `disabled` is now destructured out of the rest props. Before, `{...props}` came after `disabled={loading || props.disabled}`, so an explicit `disabled={false}` re-enabled a loading Button. A regression test covers it.
- `pnpm verify button`: all checks pass across 5 stories. The 19 existing Button tests are unchanged and pass.

### Verified

- `pnpm test`: 368 passed (27 files), 24 of them ButtonGroup. Includes the Button regression test.
- `STORYBOOK_PORT=6009 pnpm verify buttongroup`: all checks pass across 13 stories, with 0 a11y violations and 0 inconclusives.
- `pnpm verify button`: all checks pass.
- I screenshotted and looked at every story, plus zooms of the inverse/solid dividers and the attached focus ring (the focused button sits at z-index 20 with a full two-tone ring).

## 2026-11-18 — Press scale in attached groups (George's review)

- **Question (George):** should the Button press scale apply to the whole group? **No.** Press feedback belongs to the button that was pressed; scaling the group reads as one control, and none of the 9 libraries animate the group.
- **Considered and rejected: cancelling the press scale in attached groups.**
  - **Why it was tried:** in Playwright, a pressed attached button scaled to 0.97 (about 3px narrower) and pulled off its neighbours' overlapping 2px borders, leaving a brief doubled seam mid-press.
  - **What was built:** `[&>:not([role=separator])]:active:scale-100` in `lib/connected.tsx`, plus a test.
  - **Reverted the same day:** George changed his mind and preferred keeping the press animation consistent with standalone Buttons. The seam shift only lasts for the press.
  - Every Button in a group, attached or spaced, keeps the 0.97 press scale. Revisit if the seam gap draws complaints.
- **GroupProps story:** George asked whether these should stack responsively. The spaced groups (danger, own-prop-wins) already stack below 640px through the default `stackBelow="sm"`, as checked at 375px. The attached ones stay joined by design, since `stackBelow` is ignored for attached groups. Also fixed uneven spacing: the last three examples had a 24px heading gap instead of 8px, so each is now wrapped like the size examples.
- `STORYBOOK_PORT=6009 pnpm verify buttongroup`: all checks pass.

## 2026-11-18 — Split button fixes (George: "split button looks wrong")

- **Bug: the trigger lost its rounded end and divider while the menu was open.**
  - **Cause:** opening a Base UI Popover inserts hidden spans next to the trigger, inside our group: one `[data-base-ui-focus-guard]` before it, three after, plus an empty `[aria-owns]` span. The trigger was no longer `:last-child`, so it got `!rounded-none`, and `+` adjacency failed.
  - **Fix (`lib/connected.tsx`):** a "segment" now excludes separators, focus guards and the empty `[aria-owns]` span.
    - First and last use `:nth-child(1 of S)` / `:nth-last-child(1 of S)`.
    - Overlap allows one guard in between (`S+S, S+guard+S`).
    - ButtonGroup's solid divider uses the same adjacency.
    - Menu/Select triggers in ToggleGroup and Toolbar get this for free.
  - Checked in Playwright: the trigger is radius `0 10 10 0` with the 1px divider shadow, both closed and open. Regression test added.
- **Story: removed the explicit `ButtonGroup.Separator`.** Its `border-control` slate line was barely visible between two navy buttons. The automatic solid divider (currentColor 50%) now draws the line, as in the Attached story.
- **Story: the popup looked like a dialog.** It was 288px wide, with centred items, 16px padding and a "Close" item.
  - It's now compact (`w-auto min-w-48 p-1`) with left-aligned, flush items.
  - Each option is a `Popover.Close`: choosing one closes the popup, as a menu does. Escape also closes it.
  - Focus returns to the trigger in both cases (checked).
  - `align="end"` flips to start when there's no room to the left (the story sits at the left edge).
  - Menu replaces Popover at GEO-928.

## 2026-11-18 — Sign-off (George: "signed off") + /improve fixes

/improve (quick, audited directly) plan: `plans/002-buttongroup-signoff-fixes.md`. All findings fixed:

1. **Icon-only Buttons ignored the group's size.**
   - Before: `size="icon"` was always the md square (32px), so in `size="sm"` or `size="lg"` attached groups it didn't match its neighbours.
   - Fix: Button now takes the icon square from `group.size` (sm, md or lg control height). Unchanged outside a group.
   - Two regression tests. GroupProps now shows an icon button in each size row; heights checked in the screenshot.
2. **`ButtonGroup.Separator` dropped a function `className`.** Fixed with a local `mergeClassName` helper (the same as NumberField's). Test added.
3. **The SplitButton story's popup (`role="dialog"`) had no accessible name.** Added `aria-label="Save options"`.
4. **Test gaps:** added tests for stacking `align` (`sm:justify-*`), the vertical solid divider, explicit Separator orientation, the spaced Separator inset, and Text's default height.

**Considered and rejected:**

- **Group `disabled` doesn't reach Input/Select children.** MUI and Spectrum disable only buttons, and extending it is a new cross-component API. **Open question for George:** should a disabled ButtonGroup also disable Inputs and Selects inside it?
- **Cancelling the press scale in attached groups:** reverted by George, as above.

**GEO-959:** the GroupProps story adds icon-only "More options" buttons that will need tooltips.

**Checks:**

- `pnpm test`: 377 passed (27 files).
- `STORYBOOK_PORT=6009 pnpm verify buttongroup` and `pnpm verify button`: all checks pass.
- eslint is clean, and the scratch-tsconfig type-check of the changed files is clean (GEO-951).

## 2026-11-18 — Disabled cascades to every control (George's decision, follow-up to sign-off)

**Decision (George, via the coordinator):** a disabled ButtonGroup disables **everything** inside it, as native `<fieldset disabled>` does. That includes Input, Select, NumberField, Toggle and any other control, not only Buttons. This answers the open question from the sign-off entry.

**How (reused, not a new API):** `ButtonGroup.Root` now renders Base UI **`Fieldset.Root`**, which is a native `<fieldset>`, still with `role="group"`.

- **Native cascade.** Every native control inside is actually disabled: it can't be clicked or focused, and it matches `:disabled`. That covers Button, Toggle, Input, Textarea, the Select trigger, OTPField, and NumberField's input and steppers.
- **Base UI context.** `Fieldset.Root` passes `disabled` to any `Field.Root` inside. So Field-wrapped controls that aren't native (Checkbox and Switch are `<span role=…>`) get `data-disabled` and are blocked too.
- **Button context.** `ButtonGroupContext.disabled` still reaches Buttons, so `render={<nav />}` keeps disabling them. The native cascade needs the default `<fieldset>`, and the `render` prop docs say so.
- **Fieldset reset:** `m-0 min-w-0 border-0 p-0`. `min-w-0` overrides the fieldset's `min-inline-size: min-content`, which would stop wrapping and stacking.
- **Ref and props:** the ref type is now `HTMLFieldSetElement`; the props extend `fieldset`.

**Checked in Playwright (DisabledCascade story):**

- Every control reports `:disabled` or `data-disabled`.
- Tab skips everything inside the disabled groups.
- Clicking the Checkbox and Switch doesn't change them.
- The other stories' layouts are unchanged (Orientation, GrowAndAlign, GroupProps at 375px).

**Gaps that need shared changes (sent to George for approval, not done here):**

1. **NumberField** looks enabled (full opacity) when disabled by a parent fieldset, though it is disabled. Its group and stepper styles key off Base UI's `data-disabled`/`aria-disabled`, which aren't set by an ancestor fieldset. Fix: also style from native `:disabled` (`has-[input:disabled]` on the group, `disabled:` on the steppers).
2. **Field.Label** isn't dimmed when its field is disabled, anywhere in the library. This predates the cascade (the deferred "Field: disabled propagation" note).
3. **Bare Checkbox, Switch, Radio and Slider** (not wrapped in `Field.Root`) aren't native controls, so a fieldset can't disable them. Inside `Field.Root`, which is the library convention, they are. Recommendation: document this rather than change it.

**Tests:** 6 new, 383 in total:

- the group renders a fieldset;
- Input, Toggle, NumberField and Button are disabled;
- a Checkbox in a Field gets `data-disabled` and ignores clicks;
- Tab skips the disabled group;
- an enabled group leaves its controls enabled;
- `render={<nav />}` still disables Buttons.

**Checks:**

- `STORYBOOK_PORT=6009 pnpm verify buttongroup`: all checks pass (14 stories).
- Lint is clean.

## 2026-11-18 — Disabled cascade signed off (George: "signed off")

- **/improve (quick, this follow-up diff only):** one test gap, nesting. A nested ButtonGroup inside a disabled group wasn't covered, so I added a test: the inner fieldset, its Toggle and its Button are all disabled.
- **Considered and rejected:**
  - Dropping `aria-disabled` now that the native fieldset is `disabled`: keeping it is harmless, axe is clean, and it's the only signal when `render={<nav />}` is used.
  - Base UI's `aria-labelledby={legendId}`: there's no Legend, so it's undefined, and the consumer's `aria-label`/`aria-labelledby` wins (covered by the existing label test).
- **Shared changes (approved by George, separate commits before this one):**
  - NumberField styles its disabled look from native `:disabled`.
  - CheckboxGroup exposes `aria-disabled`.
  - Field.Label dims when its field is disabled.
- **Docs:** bare Checkbox, Switch, Radio and Slider need `Field.Root` to be disabled by the group. This is documented on `ButtonGroupContextValue.disabled` (docs only, as George chose).
- **Fieldset double-dimming** (labels and controls inside a disabled Fieldset at about 0.14) is flagged for its own ticket.
- **Checks:** `pnpm test` 387 passed, `STORYBOOK_PORT=6009 pnpm verify buttongroup` all checks pass, eslint clean.

## 2026-11-18 — Connected styling skips hidden form inputs (GEO-932)

- A Toggle with `name` renders a hidden `<input type="hidden">` as its sibling. In an attached group that input counted as a segment, which broke the `:last-child`-style rounding and the `+` overlap and dividers.
- `lib/connected.tsx` now excludes `[type=hidden]` from segments and allows `S+[type=hidden]+S` adjacency. ButtonGroup's solid dividers do the same.
- ButtonGroup's selector tests were updated to match. `pnpm verify buttongroup` passes all checks.
- **Toggles inside a group** are set back to `w-auto` (`[&>[data-slot=toggle]:not([data-icon-only])]:w-auto`). A Toggle is `w-fit` on its own, and the group's layout should decide its width, as for Buttons (George, GEO-932).

## 2026-11-21 — Connected styling: `[data-connected-ignore]` (GEO-933)

- `lib/connected.tsx` now also skips any child marked `data-connected-ignore`. ToggleGroup uses it for its visually hidden `required` input, which has to be a real text input for constraint validation, so `[type=hidden]` doesn't cover it.
- ButtonGroup's selector tests were updated. `pnpm verify buttongroup` passes all checks.

## 2026-11-21 — Separator splits an attached group (GEO-933, George's decision)

- In attached groups, `ButtonGroup.Separator` is now a break between runs rather than a line. The button before it gets the end rounding, the button after it the start rounding, and the separator becomes a control-gap space (`lib/connected.tsx`, both orientations).
- The SeparatorAndText story's "Undo | Redo" now shows as two rounded runs, and its heading is updated. Spaced groups keep their visible inset line.
- Test for the connected classes. `pnpm verify buttongroup` passes all checks.

### Notes for other tickets

- **GEO-959** (Tooltip on icon-only buttons): ButtonGroup itself renders no buttons. The **stories** use icon-only Buttons that need tooltips once GEO-959 lands: Pagination (Previous/Next page), Nested (Undo/Redo) and SplitButton ("More save options"). Not cherry-picked here.
- **Pre-existing Button issue (not changed here):** a loading Button gets `disabled`, so `disabled:opacity-[--sp-state-disabled-opacity]` applies on top of `opacity-80`, contradicting the "Loading keeps full opacity" comment (see the States story). Flagged to the coordinator; needs a Button ticket.
- **GEO-957:** no Field.Error in this component.

## 2026-11-21 — `lib/connected.tsx` renamed to `.ts` (GEO-970 Part A)

- Storybook's Tailwind `@source` now scans `packages/ui/src/**/*.{ts,tsx}` (it was `.tsx` only), so the connected classes can live in a `.ts` file. The comment in the file is updated, and the imports have no extension, so they don't change.
- Checked in Chromium after a Storybook restart: an attached group's radii are still `10px 0 0 10px | 0 | 0 10px 10px 0` with the -2px overlap, and ToggleGroup's separator split still rounds each run.
- `pnpm verify` passes all checks for buttongroup, togglegroup and toggle.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- The local `mergeClassName` helper (added in GEO-896) moved to `lib/merge-class-name.ts`, and this file imports it.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
