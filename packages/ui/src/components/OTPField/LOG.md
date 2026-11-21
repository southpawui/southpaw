# OTPField — Change Log

## 2026-11-21 — Forced-colours focus workaround removed (GEO-950, GEO-970)

`sp-focus-ring` now covers forced colours itself. Windows High Contrast strips the box-shadow ring, so the utility now adds a transparent 2px outline there, which the system paints in its own colour. So each slot's `forced-colors:focus-visible:outline-*` fallback is gone. The outline only applies in forced colours, so normal mode is unchanged. Checked with Playwright forced-colours emulation: the outline is solid 2px at offset 2px, and normal mode matches what it was before.

## 2026-11-16 — Sign-off (GEO-930)

George signed off ("signed off"). I ran `/improve` on this folder myself, since it's a single component. It found three issues, all fixed, each with a regression test:

1. **The groups/length mismatch warning ran on every render.** `console.warn` sat in the render body, so it repeated on each re-render. Fix: moved it into an effect keyed on the mismatch, so it fires once. The test re-renders and asserts a single warning.
2. **Mismatched groups produced a broken field.** `groups={[3, 2]}` with `length={6}` rendered 5 slots against `length` 6, and Base UI needs those to match (it skips the hidden form input when they don't). Fix: `length` is authoritative. Groups that don't add up are ignored, and the field renders one run of `length` slots and says so in the warning. Tested.
3. **Fixed-size slots overflowed phones.** 6 ungrouped slots at comfortable density need 348px, more than a 375px screen has after gutters; 8 ungrouped at default need 376px. A grouped field wrapped instead, leaving a separator dangling at the end of a line. Fix:
   - Slots are `w-[--sp-otp-size]` but `shrink`, with a `min-w-6` floor (24px, WCAG 2.5.8).
   - The input is `aspect-square min-h-0 w-full`. `min-h-0` stops the input's content height from overriding the square (it rendered 29×32).
   - Groups are `min-w-0`, and the root no longer wraps, so the code stays on one row.

   Measured in Playwright:
   - Desktop slots are unchanged (40×40).
   - At 375px, 8 slots are 35.9px.
   - At 320px, 8 slots are 29×29 and 4+4 are 33px.
   - No page scroll at any width.

   Added the story "8 characters, no groups" to LengthsAndGroups. A test pins the classes.

**Checks:**

- `pnpm test`: 344 passed (26 files), 31 of them OTPField.
- `STORYBOOK_PORT=6009 pnpm verify otpfield`: ALL CHECKS PASSED. 13 stories, 0 a11y violations, 0 inconclusives.
- eslint and `pnpm lint` are clean.
- Scratch-tsconfig type-check (GEO-951) is clean for OTPField.
- I re-checked the screenshots at 1280 and 320px.

No open questions.

## 2026-11-16 — Full enhancement (GEO-930)

Scope approved by George (all 11 recommendations) on 2026-11-16, relayed by the coordinator. The research is in RESEARCH.md. Base UI's OTPField is marked **preview** upstream, so its API may still change; re-check this wrapper on Base UI upgrades.

### What changed

- **Semantic tokens + density.** Slots are square at `--sp-otp-size`, which maps to `--sp-control-height(-sm|-lg)`. The gaps use `--sp-control-gap`. Hardcoded `neutral-*` classes, `h-12 w-10` and `focus:ring` are gone.
- **Auto-render (decision 1).** `<OTPField.Root length={6} />` renders the slots. `groups={[3, 3]}` derives the length and puts an `OTPField.Separator` between groups. `separator` takes a node (wrapped in a separator so `role="separator"` stays) or `fn(index)`; `null` leaves a gap only. Children switch to manual composition. A dev warning fires if `groups` don't add up to `length`.
- **Slot names (decision 2).** Slots 2..N get `aria-label="Character n of N"`, which `getSlotLabel(index, length)` can override (e.g. to translate). Slot 1 keeps the Field label, because Base UI ignores (and warns about) `aria-label` on the first slot. The root is Base UI's `role="group"` labelled by the Field label, so screen readers hear "Verification code, group" and then "Character 2 of 6" and so on. In manual composition, consumers pass `aria-label` themselves (the Composition story shows this).
- **Mask (decision 3):** Base UI's boolean `mask` (`type="password"`), surfaced in the stories.
- **Placeholder (decision 4):** one glyph on every empty slot, `fg-muted`, hidden while the slot has focus so it doesn't clash with the caret.
- **Sizes (decision 5).** sm, md and lg map to the control-height tokens. Text is `text-sm` / `text-lg` / `text-xl`.
- **Attached (decision 6).** Slots in a group overlap their 2px borders (`-ms-0.5`). Only the group's first and last slot are rounded, and the focused slot is lifted (`focus-within:z-10`) so its focus ring and border sit on top.
- **Valid + warning (decision 8).** Valid is a green border with no icon (matching NumberField). Warning uses `border-[var(--sp-warning,var(--sp-fg-default))]` and overrides valid. Field `invalid` overrides both (`aria-invalid:!border-danger`). Hover is suppressed when valid or warning is set, so the state colour doesn't flicker.
- **blurOnComplete (decision 9).** Opt-in. It wraps `onValueComplete`: the consumer's callback runs first, then the focused slot is blurred. The story warns that this moves focus (WCAG 3.2.2).
- **Fake caret (decision 10).** Each slot is wrapped in `<span data-slot="otp-field-slot">`. Its `::after` is a 1px caret, shown only while a slot is focused, empty (`:not([data-filled])`) and not read-only. It pulses with `animate-pulse`, is static under `motion-reduce`, and is hidden in forced colours, where the native caret comes back (`forced-colors:[caret-color:auto]`). Elsewhere the native caret is `caret-transparent`, so there's only one caret.
- **Single input (GOV.UK) story (decision 11).** Our `Input` with `autoComplete="one-time-code"`, `inputMode="numeric"`, `spellCheck={false}`, `maxLength`, a narrow width and letter-spacing. The hint says where the code was sent and when it expires, followed by a "Not received a code?" + "Send a new code" Button. Use it when the code length varies, when users may type it by hand from another device, or when you want the most robust autofill (GOV.UK's choice). Use OTPField when the length is fixed and the segmented look helps.
- **Separator.** A Phosphor `Minus` icon in `fg-muted` replaces the raw `-` in `neutral-300` (which failed contrast).
- **States:** default, filled, valid, warning, error, disabled, read-only. The focus ring is `sp-focus-ring` per slot, with the GEO-950 forced-colours outline workaround.
- **Function `className`** is honoured through `mergeClassName` on Root, Input and Separator (the NumberField sign-off finding).
- `OTPField.Group` is exported for manual composition.
- **Stories:** Default, States, LengthsAndGroups, Sizes, Attached, Density, Themes, CharacterTypes, MaskAndPlaceholder, Behaviour, SlotLabels, SingleInputGovUK, Composition.
- **30 unit tests.**

### Correction to decision 9: no `selectOnFocus` prop

The plan was an opt-in `selectOnFocus` (Chakra). In the build, Playwright showed that Base UI already selects a filled slot's character on every focus path: click `[0, 1]`, Tab `[0, 1]`, arrow keys `[0, 1]`, with no prop. A prop would have done nothing, so it wasn't added. The Behaviour story shows the native behaviour instead ("Filled slots select on focus (native)"), and a test pins it. Flagged to George via the coordinator.

### Verified

- `STORYBOOK_PORT=6009 pnpm verify otpfield`: all checks pass across 13 stories, with 0 a11y violations and 0 inconclusives.
- **Playwright:**
  - A slot's border darkens on hover, and Tab gives the two-tone focus ring.
  - The fake caret is 1px × 18px and pulses in the focused empty slot. It moves to the next slot after typing, isn't drawn on filled slots, has no animation under reduced motion, and isn't drawn in forced colours (where the focus outline is solid and the native caret colour returns).
  - Pasting "123-456" into the strip-dashes story gives "123456".
  - autoSubmit submits the form with `code=123456`.
  - With `--sp-warning: #b45309` set, the warning border computes to `rgb(180, 83, 9)`.
- I screenshotted and looked at every story, plus 2× zooms of the focused slot and attached focus.

### Considered and rejected

- **Custom mask character** (Ant `mask="*"`). An approved exception (George, decision 3). Base UI masks with `type="password"`, the browser's own bullets. A custom glyph needs transparent input text with an overlay, which fights the native password-manager and SMS-autofill behaviour Base UI relies on (slot 1's `autocomplete="one-time-code"` and `maxLength`). Boolean `mask` only.
- **`layout="single"` on OTPField** (option 11b). Base UI's OTPField requires N inputs, so a single-input mode would bypass the primitive. The GOV.UK pattern is covered by a story using `Input` instead (decision 11a).

### Deferred (George's decision, not rejected)

- **Visual variants** (Chakra outline/subtle/flushed, Ant filled/borderless/underlined) go to **GEO-956**, the library-wide input variants ticket. OTPField has been added to it.

### Notes for other tickets

- **GEO-959** (Tooltip on icon-only buttons): OTPField has **no icon-only buttons**. The separator is decorative (`role="separator"`, icon `aria-hidden`), and the GOV.UK story's "Send a new code" is a text Button. Nothing to retrofit.
- **GEO-957** (Field.Error with `invalid` only): the stories use `<Field.Error match>` until the coordinator's restack fix lands.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- The local `mergeClassName` helper (added in GEO-930) moved to `lib/merge-class-name.ts`, and this file imports it.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Error message shown in stories (GEO-957, GEO-970 Part A)

- Stories: the `Demo` helper's `<Field.Error match>` workaround is removed, so the stories now rely on the GEO-957 fix. The Themes "Attached, error" demo gets a message ("Enter the 6-digit code").
- `pnpm verify` passes all checks.
