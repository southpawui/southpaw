# RadioGroup — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                    | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| -------------------------- | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| Fieldset + Legend          | No     | Yes     | No     | No  | Yes    | Yes    | No       | No   |
| Description/hint slot      | No     | Yes     | No     | No  | Yes    | No     | No       | No   |
| Error message slot         | No     | Yes     | Yes    | Yes | Yes    | No     | No       | No   |
| Orientation (h/v)          | No     | No      | Yes    | No  | No     | Yes    | No       | No   |
| Arrow key focus management | Yes    | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |

## Must-add features

- **Fieldset + Legend** — semantic grouping (GOV.UK, Carbon)
- **Description/hint text** slot below legend (GOV.UK, Mantine)
- **Error message slot** with `aria-describedby` (Mantine, GOV.UK)
- **Orientation** — vertical (default) and horizontal

## Accessibility

- Must use `<fieldset>` + `<legend>` or `role="radiogroup"` + `aria-labelledby`
- Arrow Up/Down/Left/Right to navigate, Space/Enter to select
- Focus management: arrow keys move focus AND selection
- `aria-describedby` for error/hint association

## Sources

- [GOV.UK Radios](https://design-system.service.gov.uk/components/radios/)
- [Mantine Radio.Group](https://mantine.dev/core/radio/)
