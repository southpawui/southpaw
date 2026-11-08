# NumberField — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature             | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| ------------------- | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| +/- buttons         | Manual | Yes     | Yes    | No  | No     | Yes    | Yes      | Yes  |
| Scrub area (drag)   | No     | No      | No     | No  | No     | No     | No       | Yes  |
| Step control        | Manual | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |
| Large step (Page)   | No     | No      | No     | No  | No     | Yes    | Yes      | Yes  |
| Min/max enforcement | Manual | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |
| Placeholder         | Manual | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | No   |
| Density modes       | No     | No      | No     | No  | No     | No     | No       | Yes  |

## Must-add features

- **Placeholder support** (Mantine, most libraries)
- **+/- button accessible labels** — "Increment"/"Decrement" `aria-label` (Spectrum)

## Our unique advantage

- **ScrubArea** — click+drag on label to change value (Base UI unique, no other library has this)

## Accessibility

- Input has `role="spinbutton"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Keyboard: Arrow Up/Down to step, PageUp/PageDown for large steps
- +/- buttons need `aria-label` ("Increment"/"Decrement")
- GOV.UK recommends no spinners (semantic input only) — consider as fallback

## Sources

- [Mantine NumberInput](https://mantine.dev/core/number-input/)
- [Spectrum NumberField](https://react-spectrum.adobe.com/react-spectrum/NumberField.html)
- [Base UI NumberField](https://base-ui.com/react/components/number-field)
