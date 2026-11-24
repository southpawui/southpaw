# Form — Change Log

## 2026-11-24 — Sign-off (GEO-935)

George signed off Form: "sign off form, a, a".

**Breaking change (for the v0.2.0 release notes):** `<Form>` is now `<Form.Root>`.

- Form is a namespace, `Form = { Root, ErrorSummary, Submit }`. A plain object is what a Server Component can import (GEO-972).
- **Migration:** rename `<Form …>` / `</Form>` to `<Form.Root …>` / `</Form.Root>`. Props are a superset of before.
- George accepted this (answer 1: a).

**Reset gaps:** George is filing one ticket under GEO-971 for Checkbox, Switch, RadioGroup and NumberField not restoring their defaults on a native reset (answer 2: a). It's not in this change set; the `it.fails` tests in `Form.reset.test.tsx` flag it when fixed.

**/improve findings** (scoped to Form, plus the shared Field and ErrorSummary changes)

1. **Fixed (bug):** the summary re-read `formErrors` only when its length changed. Replacing a form-level message with another of the same count left the old wording. It now depends on the array itself. Test added.
2. **Fixed (maintainability):** Field.Label's Form branch duplicated the label's whole class string and element. It's now one render path, where only the marking differs (necessity text inside a Form; asterisk or "(Optional)" outside). Same output, covered by the existing necessity tests.
3. **Fixed (test gap):** `focusTarget="auto"` focuses the field when there are fewer than 3 errors. Test added.
4. **Rejected (by design):** a schema error stays in the summary until the next submit, even after the field is corrected. The field's own error clears as its value changes; the summary updating on submit is GOV.UK's model.
5. **Rejected:** a synchronous throw in `onFormSubmit` surfaces as a rejected Promise from the async submit handler. `submitting` still resets in `finally`.

**Rebased onto GEO-972** (`geo-972-use-client` @ e215537). The Field and ErrorSummary edits now live in `Field.parts.tsx` and `ErrorSummary.parts.tsx` (three-way merged, no conflicts in the code). `Form.tsx` follows the entry pattern, with an explicit namespace type. Form.parts imports `collectErrors` from `ErrorSummary.parts` (client to client), because it isn't on ErrorSummary's server-safe entry.

## 2026-11-23 — `pendingLabel` is shown, not just announced (WCAG 2.5.3)

The coordinator's re-check found that the review fix set `pendingLabel` as `aria-label`. The screen still said "Save" while the name was "Saving", so a voice user saying "click Save" missed it (Label in Name).

- **Fix:** while busy, `pendingLabel` replaces the visible text, which is then the name. No `aria-label`; `aria-busy` stays.
- **Also:** Button's spinner no longer adds "Loading" to the name (see Button's LOG), so the name equals the visible text.
- **Tests:** the visible text and the name are both "Saving" while busy and "Save" after. While a server action is pending, the visible text equals the accessible name.

## 2026-11-23 — Coordinator review fixes (GEO-935)

1. **A busy Form.Submit kept focus.** Pressing Save in AsyncSubmit dropped focus to `<body>`.
   - **Cause:** Button's `loading` set the native `disabled` attribute (see Button's LOG). It's fixed in Button: a loading button stays focused and is `aria-disabled` and `aria-busy`, with clicks blocked.
   - **Tests:** focus stays on Form.Submit through the pending state, for an async `onFormSubmit` and for a server `action` (`useFormStatus`). Neither sets native `disabled`.
   - **Also:** `pendingLabel` is now the busy button's whole name ("Saving"), set as `aria-label`. Before, it was added to the label and read "Loading Saving Save". Test added.
2. **QuestionPage asks for the date of birth the GOV.UK way.**
   - A Fieldset whose legend holds the `h1`, with the hint as Fieldset.Description.
   - Three labelled inputs sized to their content: Day and Month 4.5rem, Year 6rem. `inputMode="numeric"`, with `bday-*` autocomplete.
   - One message, from a `validate` on Day that reads all three values, using GOV.UK's wording: "Enter your date of birth", "must include a month", "must be a real date", "must be in the past". It sits above the inputs (Day's Field is `contents`, so its error spans the grid).
   - Checked in Chromium: the summary link focuses Day; 31/2/1990 gives "must be a real date"; 27/2/1990 clears the summary.
   - **Known difference:** GOV.UK outlines all three inputs in red for a whole-date error; only Day does here. Marking Month and Year invalid would need a message on each, which would list three errors in the summary.
3. **Side labels align to the top of the control column.** In horizontal and responsive layouts, a label next to a field whose control column starts with a description used to sit about 10px below it, centred on the input. The Form's horizontal classes, and Field.Label for responsive, now use `mt-0` in that case. Measured: label and description both start at the same y (350/350 and 544/544).

**Not for this ticket:** the spinner's contrast on the brand Submit is the existing Spinner, covered by GEO-939.

## 2026-11-23 — Enhancement (GEO-935)

Built from the approved RESEARCH.md (George, 2026-11-21: decisions 1–16, all option (a); exceptions 17–22). Branch `geo-935-enhance-form`, off `geo-928-enhance-toolbar` @ 419fa86.

**Structure (GEO-972 pattern from the start)**

- `Form.tsx` is the server-safe entry. It only builds `Form = { Root, ErrorSummary, Submit }` and re-exports types.
- `Form.parts.tsx` ("use client") holds the implementation.
- `context.ts` ("use client") holds the contexts that Field and ErrorSummary read, so neither imports Form.
- **Breaking:** `<Form>` is now `<Form.Root>`. A plain object namespace is what a Server Component can import. ErrorSummary's and OTPField's tests and stories, the only users, are renamed.

**Decisions**

1. **Layout:** Base UI Form, vertical, with a density gap (`--sp-control-gap` × 3) between fields.
2. **Error summary built in:**
   - Form drives a controlled ErrorSummary. It reads the invalid fields with ErrorSummary's own `collectErrors` (now exported) after Base UI validates a submit, and again whenever `errors` or `formErrors` change.
   - Named errors override the template wording for their field. Named errors whose field isn't on the page are still listed (linked by name).
   - `errorSummary={false}` turns it off. `<Form.ErrorSummary />`, or any ErrorSummary placed inside, replaces it: the summary registers through `FormSummaryRegistryContext`.
3. **`focusTarget`:** `summary` (default), `auto`, or `field`. `field` maps to the summary's `none`, so Base UI's first-field focus stays.
4. **`validationMode`:** Base UI's default (on submit, then on change) passes through.
5. **Server errors:** `errors` by name, merged with `schema` issues and shown inline and in the summary. `formErrors` are listed first, without a link.
   - **Fix in Field:** a bare `<Field.Error />` now shows the message, which it never did before (see Field's LOG).
6. **Submitting:**
   - With `action`, Form doesn't pass `onFormSubmit` to Base UI, because it would `preventDefault()` the native submit that server actions need. Tested.
   - `Form.Submit` is a brand solid Button with `type="submit"`. It's busy while `useFormStatus().pending` is true, or while an async `onFormSubmit` runs (Form tracks the Promise; `data-submitting`, `aria-busy`). `pendingLabel` sets what screen readers hear while it's busy.
7. **`onInvalid(errors)`:** called with the summary's errors after a failed client submit, and with a schema's issues.
8. **`necessity`:** `optional` (default), `required` or `none`, through Field.Label (the approved shared change).
   - The marking is part of the label, so the name is "Nickname (optional)", with a real space. No asterisks inside a Form.
   - Translatable (`labels.optional`, `labels.required`).
9. **`orientation`:**
   - `vertical`.
   - `responsive`: Field's own horizontal layout, which stacks below `sm`.
   - `horizontal`: beside at every width, through descendant classes on the form.
   - `labelWidth` sets `--sp-field-label-width`. A Field's own `orientation` wins.
10. **Form-wide `disabled`:** a Base UI Fieldset with `display: contents` disables every native control and reaches Base UI's own. `size` waits on the Input size ticket.
11. **Reset audit** (`Form.reset.test.tsx`):
    - Input and Textarea restore their defaults.
    - **Gaps** (`it.fails`, kept as shared fixes for the coordinator): Checkbox, Switch, RadioGroup and NumberField keep their changed value. Base UI holds their state in React and doesn't listen for the form's reset event.
    - Form's own reset clears the summary and schema errors.
12. **`warnOnUnsavedChanges`:** `beforeunload` once a field has changed since the last valid submit and a Field is `data-dirty`. Tested both ways.
13. **`transformValues`:** runs before `schema` and `onFormSubmit`.
14. **`schema`:** Standard Schema v1, typed locally (no package). Issues are mapped to fields by the first path key, and `onFormSubmit` isn't called while there are issues. With `action`, validate on the server instead.
15. **Recipes and control audit:**
    - The Recipes story covers React Hook Form, TanStack Form and server actions. No adapter packages.
    - **Control audit (source scan):** every control forwards a ref (Autocomplete through the shared Combobox parts), passes controlled `value`/`onValueChange` through to Base UI, and renders a named input (Base UI's hidden input for custom widgets). Not exercised with RHF or TanStack here: neither is a dependency, and adding one is a shared `package.json` change.
16. **Pattern stories:** Question page, Check answers (DescriptionList, GEO-966) and Confirmation.

**Stories:** Default, States, ServerErrors, SummaryPlacement, FocusTarget, AsyncSubmit, ServerAction, Schema, TransformValues, Necessity, Orientation, UnsavedChanges, QuestionPage, CheckAnswers, Confirmation, Recipes, Density, Themes.

**Tests:** 24, plus 4 expected reset gaps (`Form.test.tsx`, `Form.reset.test.tsx`).

**Shared changes (small, separated):**

- **Field** (`Field.parts.tsx`): `Label` necessity, `Root` default orientation, and the bare `Field.Error` message.
- **ErrorSummary:** `collectErrors` exported, and summaries register with an enclosing Form.
- **ErrorSummary and OTPField tests and stories:** `<Form>` renamed to `<Form.Root>`.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
