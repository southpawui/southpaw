# Field — Change Log

## 2026-11-23 — Side labels align with a leading description (GEO-935 review)

In a horizontal Field whose Field.Content starts with a description, the label now aligns with the description's first line (`mt-0`) instead of centring on the input (`mt-2.5`). GOV.UK, Carbon and Spectrum align side labels to the top of the control column.

## 2026-11-23 — Form defaults and a bare Field.Error message (GEO-935)

Small, separate changes for Form. Since the GEO-972 restack they live in `Field.parts.tsx` (`Field.tsx` is the server-safe entry and is unchanged here).

- **`Field.Label` inside a Form follows the Form's `necessity`** (the approved shared change, decision 8):
  - `optional` (default): "(optional)" for labels with `optional`, and no asterisk.
  - `required`: "(required)" for labels with `required`.
  - `none`: no marking.
  - The text is part of the label, so screen readers hear it (GOV.UK), with a real space before it.
  - Outside a Form, the asterisk and "(Optional)" are unchanged (tested).
- **`Field.Root` takes the Form's orientation as its default.** Its own prop wins.
- **Fixed: a bare `<Field.Error />` showed no message.**
  - Our wrapper always passed its own children (icon plus text), which replaced Base UI's default children: the field's `validate` message, or a Form `errors` message.
  - With no `children` and no `errors`, it now uses Base UI's `render` function and wraps the default message in the same icon and "Error:" layout. Several messages become a list.
  - Covered by Form's tests: the server error shows inline, and the schema issue shows inline.
## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `Field.parts.tsx` (`"use client"`, one named export per part). `Field.tsx` is now a server-safe entry that rebuilds the `Field` namespace and re-exports its types and helpers, so `<Field.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- See `packages/ui/LOG.md` for the whole change and the guard that enforces it.

## 2026-11-07

### Initial styling (Phase 1) — 0e141aa

Styled Field system with token system. Basic sub-components: Root, Label, Description, Error.

## 2026-11-08

### Full enhancement (GEO-897) — 90cc489

**CharacterCount sub-component**: Uses `aria-live="polite"` for screen reader announcements and changes colour when over limit. Why: Spectrum and Mantine both offer this. We chose composition (separate sub-component) over baking it into Input/Textarea so any control can use it.

**Optional indicator on Label**: Shows "(Optional)" text after the label. Why: GOV.UK's "mark the minority" pattern — if most fields are required, mark the optional ones instead of adding asterisks everywhere. More inclusive.

**ErrorIcon → Phosphor WarningCircle**: Replaced inline SVG with Phosphor icon. Why: consistency with our icon library choice. All icons should come from one source.

**Hidden "Error:" prefix**: Screen readers hear "Error: You must agree" but sighted users only see "You must agree". Why: GOV.UK pattern — gives screen reader users immediate context that this is an error message.

**Horizontal label width via CSS var**: `--sp-field-label-width` defaults to 8rem but can be overridden per form. Why: horizontal form layouts need consistent label widths. A CSS variable lets consumers adjust without breaking the component.

### Field.Group direction prop (GEO-901) — 41649a3

Added `direction` prop: `"row"` for inline checkbox/radio + label, `"column"` (default) for stacking fields. Why: shadcn's `FieldGroup` handles this inline layout — we were using raw `<div className="flex items-center gap-2">` which violated our "no raw HTML" rule. Adding direction to our existing Group component avoided creating a new sub-component.

## 2026-11-18 — Field.Label dims when its field is disabled (GEO-896 follow-up, George: "fix it now")

- **Change:** `Field.Label` gets `data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]`, the same opacity as the controls. Base UI sets `data-disabled` on the label from `Field.Root`, `Field.Item`, or an ancestor Base UI Fieldset (including a disabled ButtonGroup). This resolves the deferred "Field: disabled propagation" note for labels.
- **Field.Description is not dimmed,** on purpose. Hints often explain _why_ a field is disabled ("This field is managed by your organisation"), so they stay readable.
- **What it doesn't cover:** a label whose _control_ alone is disabled (`<Checkbox.Root disabled>` inside an enabled `Field.Root`) doesn't dim, because Base UI doesn't mark the label then. Put `disabled` on `Field.Root` instead. The Checkbox and Switch States stories still use the control-level form, so their labels are unchanged.
- **Visual check:** before/after screenshots of the States stories for field, input, textarea, checkbox, checkboxgroup, radiogroup, switch, select, numberfield and fieldset, pixel-diffed.
  - Only the disabled labels changed, in field, select, textarea, numberfield, radiogroup, checkboxgroup and fieldset.
  - checkbox, switch and input are identical (see above; Input's States story has no labels).
- **Knock-on:** checkboxgroup's disabled label failed axe contrast, because the group didn't expose `aria-disabled`. That's fixed in CheckboxGroup (separate commit, approved).
- **Known, not changed here:** Fieldset dims its whole container, so labels and controls inside a disabled Fieldset are dimmed twice (about 0.14). Inputs already were. Suggested fix for its own ticket: Fieldset dims only its legend and description.
- **Tests:** the label gets `data-disabled` and the class when its Field is disabled, has no `data-disabled` when enabled, and dims inside a disabled `Fieldset.Root`.
- **Checks:** `pnpm verify field` fails only on the pre-existing Input.Phone duplicate-ID issue (Base UI limitation). It fails the same way with the original Field.tsx, so it isn't caused by this change.

## 2026-11-21 — Type errors found by the new packages/ui typecheck (GEO-951, GEO-970 Part A)

- `Field.Error`'s ref type is now `HTMLDivElement`, matching what Base UI renders (a `<div>`). Before, it was `HTMLSpanElement`.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Field.Error renders when only Root `invalid` is set (GEO-957, GEO-970 Part A)

- **Bug:** Base UI's Field.Error renders only for real constraint validity or `match`. A `<Field.Root invalid>` from app or server validation gave a red field with **no message** (WCAG 3.3.1).
- **Fix:** Field.Root provides `FieldInvalidContext`, and Field.Error defaults `match` to `true` when the Root is `invalid` **and** the Error has content. An explicit `match` and the constraint-validity behaviour are unchanged, and an empty Error stays hidden.
- **Audit (Playwright):** every story with an invalid Field across 13 components now shows its message (23 stories, for example Input Themes 3/3 and Combobox Themes 6/6). Story gaps were fixed in Checkbox, RadioGroup, Switch, NumberField and OTPField.
- **Tests:** Root `invalid` renders the message; it stays hidden without `invalid`; an explicit `match` still wins.
- **Verify:** `pnpm verify field` fails only on the pre-existing Input.Phone duplicate IDs.
