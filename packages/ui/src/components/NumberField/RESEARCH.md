# NumberField — Competitive Research

Researched: 2026-11-08, rewritten 2026-11-16 (GEO-929, all 9 libraries)

## Baseline: what Base UI 1.9 already gives us

These come from `@base-ui/react/number-field` with no work on our side. We style and document them.

- `role="spinbutton"`-equivalent semantics: `type="text"`, `inputMode` (decimal/numeric), `autoComplete/autoCorrect/spellCheck="off"`. This is GOV.UK's "don't use `type=number`" advice, built in.
- Stepper buttons get `aria-label="Increase"/"Decrease"` and `tabIndex={-1}`. The input is the single tab stop, as Spectrum and Carbon do.
- Keyboard: ↑/↓ step, Shift = `largeStep`, Alt = `smallStep`, PageUp/PageDown, Home/End to min/max.
- Press and hold on the buttons auto-repeats.
- `min`, `max`, `step` (or `'any'`), `snapOnStep`, `allowOutOfRange`, clamp on blur.
- `format` (any `Intl.NumberFormatOptions`, e.g. currency, percent, unit, decimal places, compact) plus `locale`.
- `allowWheelScrub` (opt-in mouse-wheel stepping).
- `ScrubArea` and `ScrubAreaCursor` (drag on the label to change the value).
- `onValueChange` / `onValueCommitted`, `name`/`form` for native form submit, `required`, `readOnly`, `disabled`.
- Field integration: `data-invalid`, `data-valid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused`, `data-scrubbing` on the parts.

## Feature comparison

| Feature                                | shadcn¹ | Mantine                            | Chakra                              | MUI²         | Ant                                   | GOV.UK³                | Carbon          | Spectrum                       | Primer⁴                 | Base UI           | Ours (current)      |
| -------------------------------------- | ------- | ---------------------------------- | ----------------------------------- | ------------ | ------------------------------------- | ---------------------- | --------------- | ------------------------------ | ----------------------- | ----------------- | ------------------- |
| Stepper buttons                        | Yes     | Yes                                | Yes                                 | Yes          | Yes                                   | No                     | Yes             | Yes                            | No                      | Yes               | Yes                 |
| Buttons at end (stacked/side-by-side)  | Yes     | Stacked                            | Stacked                             | Yes          | Stacked                               | —                      | Side-by-side    | Stacked                        | —                       | Unstyled          | No                  |
| Split layout (− value +)               | Yes     | Custom                             | Mobile stepper                      | Spinner      | `mode="spinner"`                      | —                      | No              | Touch (S2)                     | —                       | Unstyled          | Yes                 |
| Hide steppers                          | Yes     | `hideControls`                     | Yes                                 | Yes          | `controls={false}`                    | Default                | `hideSteppers`  | `hideStepper`                  | —                       | Yes               | Manual              |
| Custom stepper icons                   | Yes     | Yes                                | Yes                                 | Yes          | `controls.upIcon`                     | —                      | No              | No                             | —                       | Yes               | Manual              |
| Intl formatting (currency/%/unit)      | No      | Partial (prefix/suffix/separators) | `formatOptions`                     | Base UI      | `formatter`/`parser`                  | —                      | `formatOptions` | `formatOptions`                | —                       | `format`          | Not exposed         |
| Locale                                 | No      | Separators                         | Yes                                 | Yes          | No                                    | —                      | Yes             | Yes                            | —                       | Yes               | Not exposed         |
| Prefix / suffix adornments             | Yes     | `prefix`/`suffix`, sections        | Input Group                         | Adornments   | `prefix`/`suffix`/addons              | Prefix/suffix (£, kg)  | No              | No                             | Leading/trailing visual | No                | No                  |
| Decimal places / fixed decimals        | No      | `decimalScale`/`fixedDecimalScale` | Via Intl                            | Via Intl     | `precision`                           | —                      | Via Intl        | Via Intl                       | —                       | Via Intl          | No                  |
| Allow negative / decimal toggles       | No      | Yes                                | No                                  | No           | No                                    | —                      | No              | No                             | —                       | Via min/step      | No                  |
| Thousand grouping styles (lakh/wan)    | No      | Yes                                | Via Intl locale                     | —            | Via formatter                         | —                      | Via Intl        | Via Intl                       | —                       | Via Intl locale   | No                  |
| Clamp behaviour (blur/strict/none)     | No      | `clampBehavior`                    | `clampValueOnBlur`, `allowOverflow` | Base UI      | No                                    | —                      | No              | Yes                            | —                       | `allowOutOfRange` | No                  |
| Large/small step modifiers             | No      | No                                 | Yes                                 | Yes          | No                                    | —                      | No              | PageUp/Down                    | —                       | Yes               | Yes (unstyled)      |
| Hold-to-repeat                         | Base UI | `stepHoldDelay`/`Interval`         | `spinOnPress`                       | Yes          | Yes                                   | —                      | No              | Yes                            | —                       | Yes               | Yes                 |
| Mouse-wheel stepping                   | No      | No                                 | `allowMouseWheel`                   | Base UI      | `changeOnWheel`                       | —                      | `disableWheel`  | `isWheelDisabled`              | —                       | `allowWheelScrub` | No                  |
| Drag-to-scrub                          | Some    | No                                 | `Scrubber`                          | No           | No                                    | —                      | No              | No                             | —                       | Yes               | Unstyled            |
| Select all on focus                    | No      | `selectAllOnFocus`                 | No                                  | No           | No                                    | —                      | No              | No                             | —                       | No                | No                  |
| Sizes                                  | No      | xs–xl                              | xs–lg                               | small/medium | sm/md/lg                              | —                      | sm/md/lg        | S–XL (S2)                      | —                       | —                 | No                  |
| Visual variants (filled/quiet/flushed) | No      | default/filled/unstyled            | outline/subtle/flushed              | outlined     | outlined/filled/borderless/underlined | —                      | Fluid           | `isQuiet`                      | —                       | —                 | No                  |
| Invalid state                          | Yes     | `error`                            | `invalid`                           | Yes          | `status="error"`                      | Yes                    | `invalid`       | Yes                            | —                       | Via Field         | No                  |
| Valid / success state                  | No      | `success`                          | No                                  | No           | No                                    | No                     | No              | `validationState="valid"` (v1) | —                       | Via Field         | No                  |
| Warning state                          | No      | No                                 | No                                  | No           | `status="warning"`                    | No                     | `warn`          | No                             | —                       | No                | No                  |
| Read-only                              | Yes     | Yes                                | Yes                                 | Yes          | Yes                                   | —                      | Yes             | Yes                            | —                       | Yes               | Unstyled            |
| Loading                                | No      | `loading`                          | No                                  | No           | No                                    | No                     | No              | No                             | —                       | No                | No                  |
| Label / hint / error via Field         | Field   | Built-in                           | Field                               | Built-in     | Form.Item                             | Yes                    | Built-in        | Built-in                       | FormControl             | Field             | Raw `<label>`       |
| Width hints (fixed-width)              | No      | No                                 | No                                  | No           | No                                    | `govuk-input--width-*` | No              | `width`                        | —                       | —                 | No                  |
| BigInt / string mode                   | No      | BigInt                             | String values                       | No           | `stringMode`                          | —                      | No              | No                             | —                       | No                | No                  |
| Density modes                          | No      | No                                 | No                                  | No           | No                                    | No                     | No              | No                             | No                      | —                 | No (hardcoded h-10) |

¹ shadcn core has no NumberField. Its Base UI-flavoured registries (coss, ReUI, shadcn.io) wrap Base UI NumberField with Field-based labelling.
² MUI ships no `@mui/material` number field. Its docs give copy-paste Base UI compositions with an "outlined" (buttons at end) and a "spinner" (split) layout.
³ GOV.UK has no number component. Its "Ask users for numbers" pattern says: text input with `inputmode="numeric"`, no `type=number`, no spinners, prefix/suffix for units, fixed widths sized to the expected value.
⁴ Primer has no number component. TextInput with leading/trailing visuals inside FormControl.

## Gaps in the current implementation

1. Hardcoded `neutral-*` colours: no dark or high-contrast theme, no density, no `sp-focus-ring`.
2. No Field integration: stories use raw `<label>` with eslint disables, and there's no invalid/valid/disabled/read-only styling.
3. Focus ring sits on the input only. The group (buttons + input) should read as one control, as Input does with `has-[:focus-visible]`.
4. Stepper buttons need the consumer to pass icons. Inline SVGs in stories, not Phosphor.
5. Only the split layout exists. No "buttons at end" layout (the most common pattern: 7/9) and no way to hide steppers.
6. `format`/`locale` aren't shown, so currency/percent/unit formatting isn't discoverable.
7. No prefix/suffix adornments (Mantine, Ant, GOV.UK, Chakra, MUI, Primer).
8. ScrubArea and its cursor are unstyled.
9. No tests, LOG.md, or States/Density/Themes stories.

## Accessibility notes

- Input is the only tab stop. Buttons are `tabIndex=-1`, and the keyboard covers every button action (Spectrum, Carbon).
- Touch targets: stacked chevrons at default density are 20px tall each, under WCAG 2.5.8's 24px minimum. Side-by-side end buttons or the split layout keep each button at full control height. Chakra and MUI both recommend the split ("mobile stepper"/"spinner") layout on touch.
- Unit/currency context must be in the accessible value, not only visual: Intl `format` puts it in the input text (read out); a visual suffix needs `aria-describedby` or label text (GOV.UK: put the unit in the label too).
- Press-and-hold repeat must not fire on a single tap (Base UI handles this).
- Disabled buttons at min/max: Base UI disables the relevant button. They must still be visibly disabled in high contrast.
- Forced colours: the group border and button separators must use system colours (GEO-950 focus-ring workaround applies).

## Sources

- [Base UI NumberField](https://base-ui.com/react/components/number-field)
- [Mantine NumberInput](https://mantine.dev/core/number-input/)
- [Chakra UI NumberInput](https://chakra-ui.com/docs/components/number-input)
- [MUI Number Field](https://mui.com/material-ui/react-number-field)
- [Ant Design InputNumber](https://ant.design/components/input-number/)
- [GOV.UK — Ask users for numbers](https://design-system.service.gov.uk/patterns/numbers/)
- [GOV.UK — Text input (prefixes, suffixes, widths)](https://design-system.service.gov.uk/components/text-input/)
- [Carbon Number input](https://carbondesignsystem.com/components/number-input/usage/)
- [React Spectrum NumberField](https://react-spectrum.adobe.com/react-spectrum/NumberField.html)
- [Primer TextInput](https://primer.style/components/text-input)
- [coss NumberField (shadcn-style, Base UI)](https://coss.com/ui/docs/components/number-field)
- [ReUI Number Field](https://reui.io/docs/components/base/number-field)

## Outcome (2026-11-16)

George approved the scope. All gaps above are addressed. Built: `controls` (end/split/stacked/none), auto-compose, prepend/append, size, valid, warning, loading, selectOnFocus, styled ScrubArea, and Field integration. Rejected: BigInt/string mode. Deferred to library-wide tickets: visual variants and Field.Warning. Decisions and reasoning are in LOG.md.
