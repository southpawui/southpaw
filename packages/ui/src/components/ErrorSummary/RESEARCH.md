# Error Summary — Research (GEO-887)

A box at the top of a form, shown after a failed submit. It takes focus, lists every error as a link to its field, and puts "Error: " at the start of the page title. It ships default error messages for each kind of validation failure, which apps can override and translate.

Researched on 2026-11-18 across all 9 libraries.

## Who has what

GOV.UK is the only library with a dedicated component. Primer and React Aria/Spectrum document the pattern, and Carbon covers it with a notification. Ant Design is the only one that ships per-rule message templates. The rest show errors only next to each field.

| Feature                                                            | GOV.UK             | Primer                   | React Aria / Spectrum     | Ant Design              | shadcn (RHF)       | Mantine     | Carbon            | MUI                          | Chakra |
| ------------------------------------------------------------------ | ------------------ | ------------------------ | ------------------------- | ----------------------- | ------------------ | ----------- | ----------------- | ---------------------------- | ------ |
| Dedicated summary component                                        | ✅                 | –                        | –                         | –                       | –                  | –           | –                 | –                            | –      |
| Summary guidance or example                                        | ✅                 | ✅                       | ✅ (Form example)         | –                       | –                  | –           | ✅ (notification) | –                            | –      |
| Focuses the summary when shown                                     | ✅                 | ✅                       | ✅ (example), `autoFocus` | –                       | –                  | –           | –                 | ❌ (Alert never takes focus) | –      |
| Opt out of auto-focus                                              | `disableAutoFocus` | –                        | `onInvalid`               | –                       | `shouldFocusError` | –           | –                 | –                            | –      |
| Errors are links to their fields                                   | ✅                 | ✅                       | –                         | –                       | –                  | –           | –                 | –                            | –      |
| Link scrolls the label or legend into view, then focuses the field | ✅                 | –                        | –                         | –                       | –                  | –           | –                 | –                            | –      |
| Focuses the first invalid field instead                            | –                  | ✅ (fewer than 3 errors) | ✅                        | ✅ `scrollToFirstError` | ✅                 | manual      | –                 | –                            | –      |
| "Error: " page-title prefix                                        | ✅                 | –                        | –                         | –                       | –                  | –           | –                 | –                            | –      |
| Description slot                                                   | ✅                 | –                        | ✅                        | –                       | –                  | –           | `subtitle`        | –                            | –      |
| Configurable role (alert/status)                                   | –                  | –                        | –                         | –                       | –                  | –           | ✅                | ✅                           | –      |
| Dismissible                                                        | –                  | –                        | –                         | –                       | –                  | –           | ✅                | –                            | –      |
| Server / form-level errors                                         | –                  | –                        | `validationErrors`        | `setFields`             | `root.*`           | `setErrors` | ✅                | –                            | –      |
| Default message templates per rule                                 | wording guidance   | –                        | browser's own             | ✅ `validateMessages`   | –                  | –           | –                 | –                            | –      |
| Label in the message                                               | `[x]`              | –                        | –                         | `${label}`              | –                  | –           | –                 | –                            | –      |
| Global translation of messages                                     | Welsh              | –                        | browser / OS              | `ConfigProvider`        | –                  | –           | –                 | –                            | –      |

### GOV.UK (primary reference)

- **Markup:** a root `div`, then a `div role="alert"` (an inner child since v4.4.0, to fix a JAWS focus race), then an `h2` ("There is a problem"), an optional description, and a `ul` of `a href="#id"` links. An item without `href` renders as plain text.
- **Focus:** the summary is focused on page load unless `disableAutoFocus` is set. `tabindex="-1"` is added only for that focus and removed on blur.
- **Link click:**
  - It calls `preventDefault`, scrolls the field's legend or label into view, then focuses the input with `preventScroll`.
  - The legend wins for radios and checkboxes inside a fieldset. For other inputs, it wins only when it is less than half a viewport above the input. Otherwise the field's own label is used.
- **Link targets:** radios and checkboxes link to their first option. Date inputs link to the first part that has an error.
- **Rules:**
  - Show the summary even for one error.
  - Put it at the top of `main`, above the h1.
  - Prefix the `<title>` with "Error: ".
  - Use the same wording in the summary and next to the field.
  - Use `novalidate`, and don't validate on blur.
- **Message wording, by error type:**
  - Empty: "Enter [x]", or "Select [x]" for choices.
  - Length: "[x] must be [n] characters or less", "… or more", "… between [n] and [m] characters".
  - Numbers: "[x] must be a number" / "a whole number", "[x] must be [n] or more", "[x] must be [n] or fewer", "[x] must be between [n] and [m]".
  - Format: "Enter [x] in the correct format, like name@example.com".
  - Never use "please", "sorry", "valid"/"invalid", or the generic "This field is required".
- Sources: design-system.service.gov.uk/components/error-summary, /patterns/validation, and the govuk-frontend `error-summary.mjs` source.

### Primer

Its "Interactive summary of errors" guidance:

- With 3 or more errors, put a Banner at the top of the form that lists the invalid fields as links, and focus it when it appears. Each link moves focus to its field.
- With fewer than 3 errors, focus the first invalid field instead.
- Don't use live regions for validation, and don't disable the submit button.

Source: primer.style/product/ui-patterns/forms.

### React Aria / Spectrum

- `Form` takes `validationBehavior` (native or aria), `validationErrors` (server errors that clear when the field is edited) and `onInvalid`.
- By default it focuses the first invalid field. The docs example cancels that in `onInvalid` and shows a focused `div role="alert" tabIndex={-1}` with the heading "Unable to submit", but without links.
- `FieldError` receives the native `ValidityState`. Default messages come from the browser, translated by the OS.
- Spectrum's `InlineAlert` has `autoFocus`. Its guidance also mentions a high-level summary instead of a per-field list; I couldn't confirm that (the page now redirects).

Source: react-aria.adobe.com/Form.

### Ant Design

- No summary component. Its parts:
  - `scrollToFirstError` (with `focus`) and `scrollToField`.
  - `onFinishFailed({ errorFields })` and `getFieldsError()`, which you would build a summary from yourself.
- **`validateMessages`:** templates per rule, with `${label}`, `${min}`, `${max}`, `${len}` and `${pattern}`. They can be set per form or globally through `ConfigProvider`, and per field with `messageVariables`.
- **Keys:**
  - `required`, `enum`, `whitespace`
  - `types.*` (email, url, number…)
  - `string.{len,min,max,range}`, `number.{len,min,max,range}`, `array.{len,min,max,range}`
  - `pattern.mismatch`, `date.*`

Source: ant.design/components/form.

### Carbon

- No summary component. Its forms pattern puts an `InlineNotification` at the top of the form for server errors, alongside the inline ones.
- The notification takes `role` (alert, log or status; the default is status) and can be closed.
- No guidance on focus.

Source: carbondesignsystem.com/patterns/forms-pattern.

### MUI, Chakra, Mantine, shadcn

- No summary component. Errors appear next to each field.
- MUI's `Alert` renders `role="alert"` and its docs say it "should never affect the keyboard focus", the opposite of GOV.UK.
- **Mantine:** `form.errors` and a validation-failure callback on `onSubmit`, which a summary could be built from.
- **shadcn:** uses react-hook-form, with `shouldFocusError` and `root.*` errors.

### Other references

- **WCAG G139:** an error summary at the top with links, focused on submit (3.3.1, 3.3.3).
- **WCAG G85:** text descriptions of the error.
- **WCAG 4.1.3:** doesn't apply, since a summary that takes focus is not a status message. GOV.UK's `role="alert"` is a bonus.
- **Adam Silver, Form Design Patterns:**
  - `tabindex="-1"` (never 0) and a heading.
  - Every link focuses its field from JavaScript, because a hash link alone doesn't move focus in every browser.
  - Clear the summary, the title and the inline errors on resubmit.
  - Alternative title: "(2 errors) …".

## Our base: what Base UI does

- **`Form`:**
  - Sets `noValidate`.
  - Validates every `Field` on submit.
  - Focuses (and selects) the **first invalid control**, then cancels the submit.
  - `onSubmit` / `onFormSubmit` **don't run while any field is invalid**.
  - Its `errors` prop takes server errors keyed by field `name`, each cleared when its field changes.
  - `FormContext` isn't exported.
- **`Field`:** each control gets `aria-invalid` and `data-invalid`. `Field.Error` shows the browser's `validationMessage`, or its children, and `match` picks one validity key.
- So a summary that works with plain Base UI forms has to:
  1. Hear about a failed submit without `onSubmit`. It can listen to the form's `submit` event, which still fires.
  2. Take focus back after Base UI has focused the first field.
  3. Read the invalid fields from the DOM (control, label, `Field.Error` text), or take them as a prop.

## Proposed scope

The numbered decisions sent for George's approval are in LOG.md. The summary:

- `ErrorSummary` (new folder), with parts `Root`, `Title`, `Description`, `List`, `Item`, plus an `errors` array shorthand. The array shorthand is the API Form (GEO-935) will feed.
- Takes focus when it appears, with a `tabindex="-1"` that is removed on blur. Opt out with `autoFocus={false}`. A `focusTarget` option lets apps use Primer's threshold (fewer than 3 errors focuses the first field).
- Puts `role="alert"` on an inner wrapper and uses "There is a problem" as the default heading.
- Links: GOV.UK click handling (scroll the label or legend into view, focus with `preventScroll`), links to the first option of a radio or checkbox group, and plain text when an error has no target.
- Page title gets "Error: " while the summary shows, translatable, restored when it goes.
- Error sources:
  - **Collect mode:** reads a Base UI `Form`'s invalid fields on submit.
  - **Controlled mode:** `errors` (message plus target).
- Default message templates per validity type, in GOV.UK wording with the field's label, overridable per form and globally (a provider), and translatable. Exported for Form and Field to use.
- Clears on resubmit and keeps its list until the next submit (no live churn while the user types).
- Stories: Default, a realistic form demo (Input, Textarea, Select, Combobox, Checkbox group, Radio group, Switch, Fieldset), Controlled (server errors), Messages (templates and translation), States, Density, Themes. NumberField and OTPField get added at the restack.

## Decisions (George, 2026-11-18)

- He chose option (a) on all 10, and added the error count to the page title ("Error: (2 errors) Page title").
- `focusTarget="none"` replaces the proposed `autoFocus={false}`. The lint rule `no-autofocus` flags any prop with that name.

### Considered and rejected

These are exceptions to the "one library is enough" rule, approved by George.

- **Configurable role (Carbon, MUI):** the summary has to be announced, so a configurable role mostly invites misuse.
- **Close button (Carbon):** dismissing the summary hides errors that haven't been fixed.
