# Form — Competitive Research

Researched: 2026-11-21 (GEO-935): all 9 libraries, plus Base UI Form, React Hook Form, TanStack Form, Conform, Standard Schema / Zod, and React 19 server actions. This replaces the 2026-11-08 notes, which covered 6 libraries.

## Primitive — Base UI 1.9 Form (docs + installed `form/Form.js`, verified)

- **`noValidate` is always set** (line 95), so the browser's validation UI never shows. That matches GOV.UK's "turn off HTML5 validation".
- **An invalid submit never reaches your code.** `onSubmit` validates every Field, then `focusFirstInvalid()` focuses the first invalid control (by DOM order) and calls `.select()` on text inputs. If anything is invalid, it calls `preventDefault()` and returns before `onSubmit` or `onFormSubmit` (lines 103–108). There is no `onInvalid` callback and no "all current errors" API.
- **`onFormSubmit(values)` always calls `preventDefault()`** (lines 109–110), so it can't be combined with `action={serverAction}`. For `useActionState`, use `action` plus `errors={state.errors}`.
- **`errors`:** `Record<name, string | string[]>`, merged into Field state. A field's error clears when its value changes. When `errors` changes, the first invalid field gets focus again (line 79).
- **`validationMode`:** `onSubmit` (default; re-validates on change after the first submit), `onBlur` or `onChange`. A Field's own `validationMode` wins.
- **`actionsRef`:** `{ validate(name?) }`. Async validators don't block submit (noted in the source).
- **Field:** `name`, `validate` (sync or async, returns a string or string[]), `validationDebounceTime`, and `invalid` / `dirty` / `touched` props so external libraries can drive it.
  - Data attributes: `data-dirty`, `data-touched`, `data-filled`, `data-focused`, `data-valid`, `data-invalid`.
  - `Field.Error match`: a ValidityState key, or `true`.
  - `Field.Validity`: a render function.

## Feature comparison

Key: ✓ built in · ~ partial or by recipe · ✗ none · G guidance only

| Feature                           | shadcn                             | Mantine                         | Chakra                         | MUI          | Ant                                                  | GOV.UK                         | Carbon                                              | Spectrum / RAC               | Primer                            | Base UI                |
| --------------------------------- | ---------------------------------- | ------------------------------- | ------------------------------ | ------------ | ---------------------------------------------------- | ------------------------------ | --------------------------------------------------- | ---------------------------- | --------------------------------- | ---------------------- |
| Form component / state            | ~ (RHF / TanStack)                 | `useForm`                       | ✗                              | ✗            | ✓                                                    | G                              | ✓                                                   | `<Form>`                     | ✗                                 | `<Form>`               |
| Validation timing                 | from the library                   | submit; opt-in on change / blur | ✗                              | ✗            | `validateTrigger`                                    | **submit only**                | blur                                                | native commit / aria live    | submit, then inline once invalid  | submit / blur / change |
| Debounce, async                   | library                            | ✓ / ✓ AbortSignal               | ✗                              | ✗            | ✓ / ✓                                                | ✗                              | ✗                                                   | ✗ / ✓                        | G                                 | ✓ / ✓ (doesn't block)  |
| Inline error                      | `FieldError` list                  | ✓                               | `ErrorText`                    | `helperText` | `help`                                               | ✓ hidden "Error:" prefix       | ✓                                                   | `FieldError`                 | `Validation`                      | `Field.Error`          |
| Error summary                     | ✗                                  | ✗                               | ✗                              | ✗            | ✗                                                    | **✓ always**                   | ~ notification                                      | ~ recipe (onInvalid + alert) | ✓ if 3+ errors                    | ✗                      |
| Focus on error                    | RHF                                | manual                          | ✗                              | ✗            | `scrollToFirstError {focus}`                         | **summary**                    | ✗                                                   | first invalid                | first field, or summary (3+)      | first invalid          |
| Page title "Error: "              | ✗                                  | ✗                               | ✗                              | ✗            | ✗                                                    | ✓                              | ✗                                                   | ✗                            | ✗                                 | ✗                      |
| Required / optional marking       | ✗                                  | asterisk                        | `RequiredIndicator` + fallback | asterisk     | `requiredMark` incl. `'optional'`                    | **"(optional)", no asterisks** | (optional) or (required), whichever is the minority | `necessityIndicator`         | asterisk                          | ✗                      |
| Label layout                      | vertical / horizontal / responsive | ✗                               | orientation                    | ✗            | horizontal / vertical / inline, label columns, colon | top                            | top; Fluid (label inside)                           | top / side, align            | vertical                          | ✗                      |
| Pending submit                    | library                            | `submitting`                    | ✗                              | ✗            | ✗                                                    | G                              | disable + spinner                                   | React state                  | keep submit enabled               | ✗ (`useFormStatus`)    |
| Reset                             | ✓                                  | ✓                               | native                         | ✗            | ✓                                                    | ✗                              | ✗                                                   | `onReset`                    | ✗                                 | native                 |
| Dirty / touched / unsaved warning | library                            | ✓ / ✓ / ✗                       | ✗                              | ✗            | touched                                              | ✗                              | ✗                                                   | ✗                            | `beforeunload` (Saving pattern)   | data attributes        |
| Server errors by name             | ✓                                  | `setErrors`                     | ✗                              | ✗            | `setFields`                                          | ✓                              | ✓                                                   | `validationErrors`           | G                                 | `errors`               |
| Form-level / root errors          | RHF root                           | `formRootRule`                  | ✗                              | ✗            | ✗                                                    | ✓ (summary)                    | notification                                        | ✗                            | Banner                            | ✗                      |
| Array fields                      | ✓                                  | ✓ reorder                       | ✗                              | ✗            | `Form.List`                                          | ✗                              | ✗                                                   | ✗                            | ✗                                 | ✗                      |
| Dependent fields / watch          | library                            | ✓                               | ✗                              | ✗            | `dependencies`, `useWatch`                           | ✗                              | G                                                   | ✗                            | ✗                                 | ✗                      |
| Warning (non-blocking)            | ✗                                  | ✗                               | ✗                              | ✗            | `warningOnly`                                        | ✗                              | ✓                                                   | ✗                            | ✗                                 | ✗                      |
| Native vs aria validation         | ✗                                  | ✗                               | ✗                              | ✗            | ✗                                                    | off                            | ✗                                                   | `validationBehavior`         | browser messages "not accessible" | always noValidate      |
| Form-wide disabled / size         | ✗                                  | ✗                               | Fieldset                       | ✗            | ✓                                                    | ✗                              | sizes                                               | ✓                            | ✗                                 | ✗                      |
| Normalise values                  | ✗                                  | `transformValues`               | ✗                              | ✗            | `normalize`                                          | strip spaces / hyphens         | ✗                                                   | ✗                            | ✗                                 | values object          |
| Works without JS                  | ✗                                  | ✗                               | ✗                              | ✗            | ✗                                                    | ✓ server first                 | ✓                                                   | ✓ `action`                   | ✗                                 | ✓ `action`             |

## GOV.UK validation checklist

- Validate on submit only, never on blur. Turn off browser validation. Always validate on the server, and re-show everything the user entered.
- **Error summary:**
  - shown for any number of errors;
  - placed at the top of `main`, above the `h1`;
  - titled "There is a problem";
  - takes focus;
  - links to each input (radios: the first option); clicking a link scrolls the label or legend into view, then focuses the input.
- **Inline messages:** below the hint, with a hidden "Error:" prefix, linked with `aria-describedby`, and the same wording as the summary.
- **Page title** starts with "Error: ".
- **Wording:** empty → an instruction ("Enter …"); rule broken → a description. No "please", "valid" or "invalid".
- **Marking:** "(optional)" on optional fields; never asterisks.
- **Related patterns:**
  - Question pages: one thing per page; a "Continue" button.
  - Check answers: a summary list with "Change" links, which DescriptionList (GEO-966) will provide.
  - Confirmation page.

## Integration requirements (what Southpaw's Form and controls must expose)

- **React Hook Form:** `Controller` with controlled `value`/`onValueChange`, forwarded input refs (for `shouldFocusError`), Field `invalid`/`touched`/`dirty`, external error messages, and an ErrorSummary fed from `formState.errors`.
- **TanStack Form:** the same. Standard Schema directly; `onSubmitInvalid` needs a focus hook; the Next.js adapter uses `useActionState`.
- **Conform:** real named inputs (a hidden input for custom widgets), external ids and `aria-describedby`, and a working no-JS path.
- **React 19 server actions:** `<Form action>` (not `onFormSubmit`) plus `errors={state.errors}`.
  - A SubmitButton that reads `useFormStatus().pending`; it must render inside the form.
  - ErrorSummary rendered on the server from the action's errors.
  - **Risk:** native form reset or restore for Base UI controls backed by hidden inputs. Verify each control.

## Related Southpaw pieces

- **ErrorSummary** (GEO-887, `origin/geo-887-error-summary`) has two modes:
  - **`errors={[{message, name}]}`:** a Base UI `errors` map can feed it by `name`.
  - **Collect mode:** a document-level `submit` listener that runs after Base UI validates, then reads each invalid Field, using the `Field.Error` text first and the templates otherwise.

  It takes focus after Base UI's first-field focus, so the summary wins (GOV.UK). `focusTarget="auto"` follows Primer (focus the field when there are fewer than 3 errors). It prefixes the page title, and exports the GOV.UK message templates (`getErrorMessage`, `ErrorMessagesProvider`).

- **DescriptionList** (GEO-966) will provide the "Check your answers" summary.

## Sources

- Base UI: https://base-ui.com/react/components/form, https://base-ui.com/react/components/field, https://base-ui.com/react/handbook/forms (and installed source)
- shadcn: https://ui.shadcn.com/docs/forms (+ /react-hook-form, /tanstack-form), https://ui.shadcn.com/docs/components/field
- Mantine: https://mantine.dev/form/use-form/, /form/validation/, /form/schema-validation/, /form/status/
- Chakra: https://chakra-ui.com/docs/components/field, https://ark-ui.com/docs/guides/forms
- MUI: https://mui.com/material-ui/react-text-field/
- Ant: https://ant.design/components/form
- GOV.UK: https://design-system.service.gov.uk/patterns/validation/, /components/error-summary/, /components/error-message/, /patterns/question-pages/, /patterns/check-answers/, /patterns/confirmation-pages/
- Carbon: https://carbondesignsystem.com/components/form/usage/, https://carbondesignsystem.com/patterns/forms-pattern/
- React Aria / Spectrum: https://react-aria.adobe.com/Form, https://react-aria.adobe.com/forms, https://react-spectrum.adobe.com/Form
- Primer: https://primer.style/product/ui-patterns/forms/, /components/form-control/, /ui-patterns/saving/
- React Hook Form, TanStack Form (incl. `@tanstack/react-form-nextjs`), Conform (`@conform-to/react`, `@conform-to/zod`), React 19 `useActionState` / `useFormStatus`

**Not verified:** Carbon's FormGroup / FluidForm props; Chakra's Hook Form example source; Conform v1's focus-first-error and `reply()` signature; whether React Aria focuses the first invalid field in `aria` mode.

## Scope decided (George, 2026-11-21)

Decisions 1–16 are all (a):

1. **Base UI Form** with a vertical, density-gap layout.
2. **Error summary built in** by default (collect mode, fed by `errors` and `formErrors`). `errorSummary={false}` turns it off; `<Form.ErrorSummary/>` places it elsewhere.
3. **Focus** goes to the summary by default; `focusTarget` "auto" | "field" are passed through.
4. **`validationMode`** onSubmit, then re-validates on change.
5. **Server errors:** `errors` keyed by name, plus `formErrors` for form-level messages (unlinked in the summary).
6. **`action` + useActionState pattern.** `Form.Submit` reads `useFormStatus` (loading, aria-busy). Form tracks `submitting` when onFormSubmit returns a Promise.
7. **`onInvalid(errors)`**, fired after Base UI validates.
8. **`necessity`:** "optional" (default: "(optional)" text, Field.Label's required asterisk hidden; an **approved shared Field.Label change**) | "required" ("(required)" text) | "none".
9. **`orientation`** vertical | horizontal | responsive, plus `labelWidth` (`--sp-field-label-width`).
10. **Form-wide `disabled`** through the Base UI Fieldset cascade. `size` waits on the Input size ticket.
11. **Reset:** verify every control restores its default on native reset. Gaps get listed as shared fixes.
12. **`warnOnUnsavedChanges`:** beforeunload while any Field is dirty (opt-in).
13. **`transformValues`.**
14. **Optional `schema`** (Standard Schema v1).
15. **Recipes** (React Hook Form, TanStack, server actions) plus a control audit: controlled value/onValueChange, forwarded ref, named input. No adapter packages.
16. **Pattern stories:** Question page, Check answers (DescriptionList, GEO-966) and Confirmation, once GEO-966 lands.

## Considered and rejected (George approved these exceptions, 2026-11-21)

17. **Array/list fields and dependent fields/watch** (Mantine, Ant, TanStack, Conform): left to form libraries; docs recipe with RHF `useFieldArray`. Southpaw stays a UI layer.
18. **Native vs aria validation switch** (RAC): rejected. GOV.UK says turn browser validation off, and Base UI hard-codes `noValidate`.
19. **Multi-form coordination** (Ant Form.Provider) and **intent buttons** (Conform): rejected; they're library-specific.
20. **Non-blocking warnings** (Ant warningOnly, Carbon): deferred to the Field.Warning ticket.
21. **Multistep with progress** (Carbon): deferred to Stepper (GEO-938).
22. **Explicit vs autosave** (Primer): docs guidance only.
