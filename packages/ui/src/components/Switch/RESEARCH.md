# Switch — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature            | shadcn | Mantine     | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| ------------------ | ------ | ----------- | ------ | --- | ------ | ------ | -------- | ---- |
| Size variants      | No     | Yes (xs-xl) | Yes    | Yes | No     | Yes    | Yes      | No   |
| On/Off text labels | No     | Yes         | No     | No  | Yes    | Yes    | No       | No   |
| Label position     | No     | Yes         | No     | No  | No     | Yes    | Yes      | No   |
| Reduced motion     | No     | No          | No     | No  | No     | No     | No       | No   |
| Density modes      | No     | No          | No     | No  | No     | No     | No       | Yes  |

## Must-add features

- **On/Off or Yes/No text** inside switch for clarity (GOV.UK, Carbon)
- **Reduced motion** — fade instead of slide under `prefers-reduced-motion`
- **Label positioning** — start/end placement flexibility

## Accessibility

- `role="switch"`, `aria-checked` (true/false)
- Keyboard: Space/Enter to toggle
- Must have associated label via `aria-label` or `aria-labelledby`
- GOV.UK uses explicit "On/Off" text for clarity

## Sources

- [GOV.UK Toggle](https://design-system.service.gov.uk/components/)
- [Mantine Switch](https://mantine.dev/core/switch/)
- [Carbon Toggle](https://carbondesignsystem.com/components/toggle/usage/)
