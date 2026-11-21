# Field — Change Log

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
