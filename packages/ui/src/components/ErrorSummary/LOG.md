# Error Summary — Change Log

## 2026-11-18 — Signed off by George; /improve findings fixed

The read-only audit found 9 issues. All of them checked out against the code, and each is fixed with a regression test (11 new tests).

- **An error given by `name` focused Base UI's hidden native input.** RadioGroup, Checkbox, Switch, Select and Combobox all keep one, aria-hidden. Such inputs are now skipped: the target becomes the visible control in the same Field (the first radio, the Select trigger, the Combobox input). For a Select, the link also gets the trigger's id. This is the path Form (GEO-935) will use.
- **Collect mode dropped an invalid field with no label.** The label now falls back to the placeholder, then to "an answer", so every error is listed.
- **Two summaries stacked the title prefix and left a stale one behind.** The title is now shared across the page: one prefix, the total count, and one restore once the last summary clears.
- **A title the app changed while errors showed got overwritten.** The new title becomes the base.
- **DOM reads during render** crashed server rendering when `form` was an id, and could leave `href="#"`. Links now resolve after mount, `getForm` checks for `document`, and a `renderToString` test covers it.
- **Controlled mode missed changed JSX messages** (e.g. a new translation). The comparison key now uses the text inside JSX, and gives element targets a stable key.
- **Template wording:**
  - Time fields use "the same as or after/before".
  - Date limits read as dates ("1 January 2026"), in the user's locale.
  - "Whole number" is only used when the step allows whole numbers. Otherwise: "in steps of 1, starting from 0.5".
  - `invalid` says "Select …" for choices.
  - Combobox fields say "Select …"; Autocomplete stays "Enter …".
- **The temporary tabindex could get stuck** if the summary was hidden while it had focus. It's now removed when the summary hides.
- **Form reset didn't call `onErrorsChange([])`.** It now does, and it also cancels a pending collect.

**Also confirmed by the audit:**

- Event order is correct: the document listener runs after Base UI's validation and focus.
- A pending collect timer is cleared on unmount.
- Each summary only listens to its own form.
- An inline `messages` object causes no effect loop.

**Checks:**

- 35 ErrorSummary tests; `pnpm test` 523 passing.
- `verify errorsummary` passes with no inconclusives.
- Lint is clean, and the scratch type-check (GEO-951) is clean.
- Chromium re-run: all 8 demo links land on visible controls, and server errors link to the real ids.

## 2026-11-18 — Implementation

**George's decisions (relayed by the coordinator):** option (a) on all 10, plus the error count in the page title (#4b).

- **Anatomy:** `ErrorSummary.Root`, `Title`, `Description`, `List` and `Item`.
  - Root renders Title, Description and List by default. `title` and `description` are shorthands for those parts.
  - `List` takes a render function. `Item` takes `render`, to use a router's link.
- **Where errors come from:**
  - **`errors`:** a list of `{ message, target | name }`. `target` is an element id or the element itself. `name` is looked up in the form, so a server's errors keyed by field name, like Base UI Form's `errors`, can feed it as they are. This is the API Form (GEO-935) will use.
  - **Collect mode (no `errors`):** listens for the form's `submit` on the document, so it runs after Base UI has validated. It then reads each invalid Field: the control, the label, and the `Field.Error` text. GOV.UK says to use the same wording in both places, so the inline text wins. Otherwise the message comes from the templates.
  - Collect mode resets on resubmit and on form `reset`. `form` (an id, the element or a ref) lets the summary sit outside the form, and `onErrorsChange` reports what was collected.
- **Focus:**
  - The summary takes focus when errors appear, using a `tabindex="-1"` that is removed on blur (GOV.UK). This runs after Base UI focuses the first invalid field, so the summary wins.
  - `focusTarget="auto"` follows Primer: with fewer than 3 errors it focuses the first field instead.
  - **Changed from the approved scope:** `focusTarget="none"` replaces the `autoFocus={false}` I proposed. jsx-a11y's `no-autofocus` rule flags any prop named `autoFocus`, even on our own component, and changing the lint config would mean editing a shared file. One prop now covers all three cases.
  - In controlled mode, focus moves again only when the content of the errors changes, not each time a new array is passed in.
  - Uses `:focus` rather than `:focus-visible`, because focus moved by script after a click doesn't match `:focus-visible`. Checked in Chromium: the 2px ring shows.
- **Links:**
  - A real `<a href="#id">`, through Base UI `useRender` (decision 3a).
  - Following govuk-frontend, a click scrolls the legend or label into view, then focuses the field with `preventScroll`. The legend is used for a radio or checkbox in a fieldset, or for another field less than half a viewport below its legend.
  - Groups link to their first option. An error with no target is plain text.
  - Checked in Chromium on every control in the demo: Input, email, Select trigger, Combobox input, first radio, first checkbox, Textarea and the terms checkbox.
- **Page title:**
  - Reads "Error: (2 errors) Page title" while errors show, and the original title comes back when they clear or on unmount.
  - `labels.titlePrefix` and `labels.titleCount` translate it, and `updateTitle={false}` turns both parts off.
  - **George, 2026-11-18:** the count doesn't get its own switch. An app that wants only the prefix can make `labels.titleCount` return `""`.
- **Messages:**
  - `defaultErrorMessages` follow GOV.UK wording and are keyed by ValidityState: valueMissing, typeMismatch, patternMismatch, tooShort, tooLong, rangeUnderflow, rangeOverflow, stepMismatch and badInput, plus `invalid` for anything else.
  - Each template gets `{ label, lowerLabel, kind, type, minLength, maxLength, min, max, step, pattern }`. `kind` decides between "Enter …" and "Select …". `lowerLabel` keeps acronyms ("NHS number").
  - When several checks fail, the first one listed above is reported, so missing information comes first (GOV.UK).
  - Overrides: `ErrorMessagesProvider` for the whole app (translation), and `messages` on Root.
  - The templates and `getErrorMessage`/`getValidityKey` are exported for Form and Field. Field.Error isn't changed (decision 5a).
  - Numbers say "or less" rather than GOV.UK's "or fewer", which GOV.UK uses for counts. A template override can change it. **George, 2026-11-18:** keep "or less".
- **Role:** a fixed `role="alert"` on an inner wrapper, not on the focused element (GOV.UK v4.4, the JAWS fix).
  - The root has no `aria-labelledby`, because axe flags it as prohibited on a `div` without a role, and GOV.UK doesn't label its root either.
- **Visual:**
  - A danger border with a 4px start edge, surface-base background and rounded-md.
  - WarningCircle and a semibold heading. Underlined `text-danger` links, with the description and list indented to the heading text.
  - Padding is `--sp-control-gap` × 2 (12, 16 or 24px by density). No variants and no sizes.
- **Stories:**
  - Default: a realistic library-card form with a Fieldset, Input, email Input, Select, Combobox, RadioGroup, CheckboxGroup (custom `validate`), Textarea, Switch and a terms Checkbox. NumberField and OTPField will be added at the restack.
  - ServerErrors: a Base UI Form `errors` map feeds both the inline messages and the summary by `name`.
  - FocusFirstField, Messages (default templates, and a French translation with `ErrorMessagesProvider` and `labels`), Anatomy, States, Density and Themes.
- **Browser checks:**
  - An empty submit lists all 8 errors with the inline wording. The summary has focus and the title reads "Error: (8 errors) …".
  - Fixing every field and resubmitting hides the summary, restores the title and the form submits.
  - Server errors take focus and link by name.
  - The templates read correctly in English and French.
- **Limit found:** browsers set `tooShort`/`tooLong` only after the user edits the field, not for a default value. The demos follow that.
- **Checks:** 24 unit tests, 512 in total. `verify errorsummary` passes with no inconclusives. Lint is clean, and the scratch type-check (GEO-951) is clean.

## Considered and rejected

- **Configurable role (#7b; Carbon, MUI):** rejected by George. The summary has to be announced, so a configurable role mostly invites misuse.
- **Close button (#8b; Carbon):** rejected by George. Dismissing the summary hides errors that haven't been fixed.

## 2026-11-18 — Research (GEO-887)

- Researched all 9 libraries; see RESEARCH.md. GOV.UK is the only one with a dedicated component. Primer and React Aria/Spectrum document the pattern, and Ant Design ships message templates.
- Base UI's `Form` focuses the first invalid field and skips `onSubmit` while any field is invalid. The summary has to work around both.
- Decisions sent for approval:
  1. Error sources
  2. Focus target
  3. Link element
  4. Page title
  5. Message templates and Field
  6. When the list updates
  7. Role
  8. Dismissible
  9. High-level summary
  10. Visual design
- No code yet.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
