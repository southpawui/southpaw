# Form — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                        | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Ours |
| ------------------------------ | ------ | ------- | ------ | --- | ------ | ------ | ---- |
| React Hook Form integration    | Yes    | No      | No     | No  | N/A    | No     | No   |
| Form context (field awareness) | Yes    | Yes     | Yes    | Yes | N/A    | No     | No   |
| Error Summary component        | No     | No      | No     | No  | Yes    | No     | No   |
| Validation triggers            | Yes    | Yes     | Yes    | No  | N/A    | No     | No   |
| Field array support            | Yes    | Yes     | Yes    | No  | N/A    | No     | No   |

## Must-add features

- **Error Summary** — GOV.UK pattern: summary of all errors at top of form, each linking to the field (WCAG best practice)
- **React Hook Form integration** — optional `useFormContext` bridge (shadcn pattern)
- **Form context** — nested fields aware of form state (Mantine, Chakra)

## Accessibility

- Error summary changes page title to "Error: [original title]" (GOV.UK)
- Error summary links to first invalid field
- `aria-describedby` links inline errors to inputs
- Clear button text ("Submit", not "OK")
- Enter to submit (except in textarea)

## Sources

- [GOV.UK Error Summary](https://design-system.service.gov.uk/components/error-summary/)
- [shadcn Form](https://ui.shadcn.com/docs/components/form)
- [React Hook Form](https://react-hook-form.com/)
