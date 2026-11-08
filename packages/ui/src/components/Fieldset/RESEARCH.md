# Fieldset — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                    | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Ours |
| -------------------------- | ------ | ------- | ------ | --- | ------ | ------ | ---- |
| Semantic fieldset + legend | No     | Yes     | No     | No  | Yes    | Yes    | Yes  |
| Description slot           | No     | Yes     | No     | No  | Yes    | No     | No   |
| Error message slot         | No     | Yes     | No     | No  | Yes    | No     | No   |
| Disabled propagation       | No     | Yes     | No     | No  | No     | No     | No   |
| Nested fieldsets           | No     | No      | No     | No  | Yes    | No     | Yes  |

## Must-add features

- **Description slot** — helper text below legend (GOV.UK, Mantine)
- **Error message slot** — red text with icon (GOV.UK, Mantine)

## Accessibility

- `<fieldset>` + `<legend>` is semantic HTML — all screen readers understand
- Legend must be first child of fieldset
- Legend text describes group purpose ("Billing Address", "Contact Preferences")
- Nested fieldsets allowed for complex forms

## Sources

- [GOV.UK Fieldset](https://design-system.service.gov.uk/components/fieldset/)
- [Mantine Fieldset](https://mantine.dev/core/fieldset/)
