# OTPField — Competitive Research

Researched: 2026-11-08, rewritten 2026-11-16 (GEO-930, all 9 libraries)

## Baseline: what Base UI 1.9 already gives us

`@base-ui/react/otp-field` (marked **preview** upstream, so its API may still change):

- `length` (required). It warns in development if the number of rendered `<OTPField.Input>`s doesn't match.
- `validationType`: `numeric` (default) | `alpha` | `alphanumeric` | `none`. Plus `normalizeValue(value)` for custom sanitising (e.g. strip dashes, uppercase), and `inputMode` override.
- `mask`: slots render as `type="password"`.
- `autoComplete="one-time-code"` by default, on the first slot only. Only slot 1 has `maxLength={length}`, so iOS/Android SMS autofill and password managers fill the whole code.
- `autoSubmit`: calls `form.requestSubmit()` when complete.
- Paste spreads across the slots, and IME composition is buffered.
- Backspace/Delete clear and move focus; arrow keys move between slots.
- **Roving tabindex:** only the active slot is tabbable, so the field is one tab stop.
- `enterKeyHint` is `next` on each slot and `done` on the last.
- `onValueChange`, `onValueComplete`, `onValueInvalid` (fires when rejected characters were typed or pasted).
- `name`/`form`, plus a hidden input for native form submit. `required`, `disabled`, `readOnly`.
- Field integration: `aria-invalid` and the `data-invalid`/`data-filled`/`data-complete` state attributes.
- `OTPField.Separator` (Base UI Separator, `role="separator"`).
- **Labelling:** slot 1 is labelled by the Field label (`aria-labelledby`). Slots 2..N inherit the same label unless given their own `aria-label`. Out of the box, a screen reader hears "Verification code" N times with no position.

## Feature comparison

| Feature                                  | shadcn¹                           | Mantine               | Chakra                 | MUI² | Ant                                   | GOV.UK³               | Carbon | Spectrum | Primer⁴          | Base UI             | Ours (current)     |
| ---------------------------------------- | --------------------------------- | --------------------- | ---------------------- | ---- | ------------------------------------- | --------------------- | ------ | -------- | ---------------- | ------------------- | ------------------ |
| Segmented slots                          | Yes                               | Yes                   | Yes                    | Demo | Yes                                   | **No — one input**    | —      | —        | No — one input   | Yes                 | Yes                |
| Single-input pattern                     | Yes (hidden input + visual slots) | No                    | No                     | No   | No                                    | **Yes (recommended)** | —      | —        | Yes              | No                  | No                 |
| Custom length                            | Yes                               | Yes                   | Yes                    | Demo | Yes (default 6)                       | Any                   | —      | —        | Any              | Yes                 | Yes                |
| Auto-render slots from length            | No                                | Yes                   | Closed component       | No   | Yes                                   | —                     | —      | —        | —                | No                  | No                 |
| Groups / separator                       | Groups + Separator                | No                    | Group + separator      | Demo | `separator` node or `fn(index)`       | —                     | —      | —        | —                | Separator           | Manual `-`         |
| Character type (numeric/alpha/alnum)     | `pattern` regex                   | `type` incl. RegExp   | `type`                 | Demo | No                                    | Numeric               | —      | —        | —                | `validationType`    | Not exposed        |
| Sanitise / format input                  | No                                | No                    | `sanitizeValue`        | No   | `formatter`                           | —                     | —      | —        | —                | `normalizeValue`    | Not exposed        |
| Mask                                     | No                                | `mask`                | `mask`                 | No   | `mask` (bool or custom char)          | —                     | —      | —        | —                | `mask` (bool)       | Not exposed        |
| Placeholder per slot                     | No                                | `placeholder` (○)     | `placeholder` (○)      | No   | No                                    | —                     | —      | —        | —                | Native attr         | No                 |
| One-time-code autocomplete               | Yes                               | `oneTimeCode`         | `otp`                  | No   | No                                    | Yes                   | —      | —        | Yes              | Default on          | Default (unstyled) |
| Auto-submit on complete                  | No                                | No                    | `autoSubmit`           | No   | No                                    | —                     | —      | —        | —                | `autoSubmit`        | Not exposed        |
| Blur on complete                         | No                                | No                    | `blurOnComplete`       | No   | No                                    | —                     | —      | —        | —                | No                  | No                 |
| Select on focus                          | No                                | No                    | `selectOnFocus`        | No   | No                                    | —                     | —      | —        | —                | No                  | No                 |
| Fake caret / active-slot highlight       | Yes                               | No                    | No                     | No   | No                                    | —                     | —      | —        | —                | `data-*` only       | No                 |
| Sizes                                    | No                                | xs–xl                 | 2xs–2xl                | No   | sm/md/lg                              | —                     | —      | —        | —                | —                   | No (fixed h-12)    |
| Visual variants                          | No                                | No                    | outline/subtle/flushed | No   | outlined/filled/borderless/underlined | —                     | —      | —        | —                | —                   | No                 |
| Attached (connected) slots               | Yes (grouped slots share borders) | No                    | `attached`             | No   | No                                    | —                     | —      | —        | —                | —                   | No                 |
| Error / invalid                          | `aria-invalid`                    | `error`               | `invalid`              | —    | `status="error"`                      | Yes                   | —      | —        | Yes              | Via Field           | No styling         |
| Valid / success                          | No                                | `success`             | No                     | No   | No                                    | No                    | —      | —        | —                | —                   | No                 |
| Warning                                  | No                                | No                    | No                     | No   | `status="warning"`                    | No                    | —      | —        | —                | No                  | No                 |
| Disabled / read-only                     | Yes                               | Yes                   | Yes                    | —    | Yes                                   | —                     | —      | —        | —                | Yes                 | Disabled only      |
| Per-slot labels / translations           | Single input                      | `aria-label` (manual) | `translations`         | —    | No                                    | Single input          | —      | —        | Single input     | Manual `aria-label` | No                 |
| Resend / "Not received a code?" guidance | No                                | No                    | No                     | No   | No                                    | **Yes** (pattern)     | —      | —        | Yes (GitHub 2FA) | —                   | No                 |
| Density modes                            | No                                | No                    | No                     | No   | No                                    | No                    | No     | No       | No               | —                   | No                 |

¹ shadcn Input OTP wraps `input-otp`: one real `<input>` behind visual slots, `InputOTPGroup`/`InputOTPSeparator`, a blinking fake caret in the active slot, and `pattern` regexes (`REGEXP_ONLY_DIGITS`).
² MUI ships no OTP component. Its docs include a copy-paste OTP demo.
³ GOV.UK "Confirm a phone number": one text input with `autocomplete="one-time-code"`, `inputmode="numeric"`, `spellcheck="false"`, a fixed narrow width and extra letter spacing. The hint says where the code was sent, and there's a "Not received a security code?" link to resend. Errors: "Enter the security code" / "Enter a correct security code".
⁴ Carbon, Spectrum and Primer have no OTP component. Primer/GitHub's own 2FA uses a single TextInput with `autocomplete="one-time-code"`.

## Gaps in the current implementation

1. Hardcoded `neutral-*` colours, a fixed `h-12 w-10`, and `focus:ring` instead of `sp-focus-ring`. No themes, no density.
2. No invalid, valid, warning or read-only styling, and no filled or active-slot styling.
3. Slots 2..N have no position in their accessible name.
4. The consumer must hand-write N `<OTPField.Input />`s plus separators. There's no auto-render from `length`.
5. The separator is a raw text `-` in `neutral-300`, which fails contrast.
6. `mask`, `validationType`, `autoSubmit` and `normalizeValue` aren't shown in stories.
7. No tests, LOG.md, or States/Density/Themes stories.
8. No guidance on the GOV.UK single-input alternative.

## Accessibility notes

- **Segmented vs single input.** GOV.UK and GitHub use one input. Segmented fields are widely used and Base UI mitigates the main risks: a single tab stop, paste, autofill on slot 1, and IME buffering. Each slot still needs its position ("character 2 of 6") in its accessible name, or screen-reader users lose their place.
- **Contrast.** The separator and placeholder glyph are informational, so they need 3:1 (non-text) or 4.5:1 if they read as text.
- **Masking hurts error recovery** (GOV.UK password guidance). Make it opt-in, never the default.
- **Auto-submit and blur-on-complete move context.** WCAG 3.2.2 (On Input) allows it when users are told beforehand; recommend pairing with a description.
- **Target size.** Each slot at default density is ≥ 40px, so WCAG 2.5.8 is fine at every density. Compact is 32px.
- **Forced colours.** The slot border and focus need system colours (GEO-950 workaround: outline on focus).

## Sources

- [Base UI OTP Field](https://base-ui.com/react/components/otp-field)
- [shadcn Input OTP](https://ui.shadcn.com/docs/components/input-otp) / [input-otp](https://npmjs.com/package/input-otp)
- [Mantine PinInput](https://mantine.dev/core/pin-input/)
- [Chakra PinInput](https://chakra-ui.com/docs/components/pin-input)
- [Ant Design Input (Input.OTP section)](https://ant.design/components/input)
- [GOV.UK — Confirm a phone number](https://design-system.service.gov.uk/patterns/confirm-a-phone-number)
- [GOV.UK — Passwords (masking guidance)](https://design-system.service.gov.uk/patterns/passwords)
- [Cloud Four — Simple one-time passcode inputs](https://cloudfour.com/thinks/simple-one-time-passcode-inputs/)

## Scope decided (2026-11-16)

George agreed with all 11 recommendations ("OTP: agree"), relayed by the coordinator:

1. **Auto-render** from `length`, with `groups` and `separator` (a node or `fn(index)`). Manual composition still works.
2. **"Character n of N"** names on slots 2..N, overridable with `getSlotLabel`.
3. **Boolean `mask` only.** A custom mask character (Ant) is an approved exception; see LOG.md "Considered and rejected".
4. **`placeholder`** glyph prop, default none.
5. **`size`** sm/md/lg.
6. **`attached`** now.
7. **Variants deferred** to GEO-956 (library-wide input variants). OTPField is added to it.
8. **`valid` + `warning`.** Warning uses `var(--sp-warning)`, pending PR #44.
9. **`blurOnComplete`** and selectOnFocus, both opt-in. _Correction during the build: Base UI already selects a filled slot on every focus path, so a `selectOnFocus` prop would do nothing and was not added. See LOG.md._
10. **CSS fake caret:** static under reduced motion and hidden in forced colours.
11. **"Single input (GOV.UK)"** story using Input, plus a docs note.
