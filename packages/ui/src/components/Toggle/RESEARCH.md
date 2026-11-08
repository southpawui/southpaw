# Toggle — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature        | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| -------------- | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| Variant system | No     | Yes (4) | Yes    | No  | No     | No     | No       | No   |
| Icon + text    | Yes    | Yes     | Yes    | Yes | No     | Yes    | Yes      | Yes  |
| Size variants  | No     | Yes     | Yes    | Yes | No     | No     | No       | No   |
| Density modes  | No     | No      | No     | No  | No     | No     | No       | Yes  |

## Must-add features

- **Variant system** — default/outline/ghost for different contexts (Mantine has 4 variants)
- **Icon-only with auto aria-label** — enforce accessible name when icon-only

## Accessibility

- `aria-pressed="true|false"` on the button
- If icon-only, must have `aria-label`
- Keyboard: Space/Enter to toggle
- Visual feedback: colour + shape change, never colour alone

## Sources

- [Mantine ActionIcon](https://mantine.dev/core/action-icon/)
- [Radix Toggle](https://www.radix-ui.com/primitives/docs/components/toggle)
