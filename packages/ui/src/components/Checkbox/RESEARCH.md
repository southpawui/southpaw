# Checkbox — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| ---------------------- | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| Indeterminate state    | Yes    | Yes     | Yes    | Yes | No     | Yes    | Yes      | Yes  |
| Size variants          | No     | Yes     | Yes    | Yes | No     | No     | Yes      | No   |
| 44px touch target      | No     | No      | No     | No  | Yes    | No     | No       | No   |
| Label binding enforced | No     | Yes     | No     | No  | Yes    | Yes    | Yes      | No   |
| Disable reason tooltip | No     | Yes     | No     | No  | No     | No     | No       | No   |
| Density modes          | No     | No      | No     | No  | No     | No     | No       | Yes  |

## Must-add features

- **44px minimum touch target** on coarse pointers (GOV.UK, WCAG 2.5.8)
- **Label binding** — enforce that checkbox always has an associated label (Carbon, Spectrum pattern)

## Accessibility

- `role="checkbox"`, `aria-checked` (true/false/mixed)
- Keyboard: Space/Enter to toggle, Tab to focus
- Indeterminate state must announce "mixed"
- Focus visible: 2px+ outline

## Sources

- [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)
- [Radix Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)
- [Chakra Checkbox](https://chakra-ui.com/docs/components/checkbox)
