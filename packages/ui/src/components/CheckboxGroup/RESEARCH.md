# CheckboxGroup — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                  | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| ------------------------ | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| Fieldset + Legend        | No     | Yes     | No     | No  | Yes    | Yes    | No       | No   |
| Description/hint slot    | No     | Yes     | No     | No  | Yes    | No     | No       | No   |
| Error message slot       | No     | Yes     | Yes    | Yes | Yes    | No     | No       | No   |
| Orientation (h/v)        | No     | No      | No     | No  | No     | Yes    | No       | No   |
| Form context integration | No     | Yes     | Yes    | Yes | No     | No     | Yes      | No   |

## Must-add features

- **Fieldset + Legend** — semantic `<fieldset>` with `<legend>` for screen readers (GOV.UK, WCAG requirement)
- **Description/hint text** slot below legend (GOV.UK, Mantine)
- **Error message slot** with `aria-describedby` binding (Mantine, GOV.UK)
- **Orientation** — vertical (default) and horizontal layout

## Accessibility

- Must use `<fieldset>` + `<legend>` (stronger than `role="group"`)
- Legend announced by all screen readers before individual field labels
- `aria-describedby` links error message to group
- Keyboard: Tab between checkboxes, Space to toggle

## Sources

- [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)
- [Mantine Checkbox.Group](https://mantine.dev/core/checkbox/)
- [MUI FormGroup](https://mui.com/material-ui/api/form-group/)
