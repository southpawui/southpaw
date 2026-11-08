# Radio — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                    | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| -------------------------- | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| 44px touch target          | No     | No      | No     | No  | Yes    | No     | No       | No   |
| Size variants              | No     | Yes     | Yes    | Yes | No     | No     | Yes      | No   |
| Label position (start/end) | No     | No      | No     | No  | No     | Yes    | Yes      | No   |
| Density modes              | No     | No      | No     | No  | No     | No     | No       | Yes  |
| Label binding enforced     | No     | Yes     | No     | No  | Yes    | Yes    | Yes      | No   |

## Must-add features

- **44px minimum touch target** on coarse pointers (GOV.UK, WCAG 2.5.8)
- **Label binding** — enforce associated label (Carbon, Spectrum pattern)

## Accessibility

- `role="radio"`, `aria-checked` (true/false)
- Arrow keys navigate within group, Space/Enter to select
- Focus must move with selection in group
- Parent group uses `role="radiogroup"` or `<fieldset>`

## Sources

- [GOV.UK Radios](https://design-system.service.gov.uk/components/radios/)
- [Radix Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group)
