# Toolbar — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                      | shadcn | Radix | Chakra | MUI | Spectrum | Ours |
| ---------------------------- | ------ | ----- | ------ | --- | -------- | ---- |
| Grouped controls             | Yes    | Yes   | No     | Yes | Yes      | Yes  |
| Toggle buttons               | Yes    | Yes   | No     | Yes | Yes      | Yes  |
| Mixed content                | Yes    | Yes   | No     | Yes | Yes      | Yes  |
| Roving tabindex keyboard nav | Yes    | Yes   | No     | No  | No       | No   |
| Vertical orientation         | Yes    | Yes   | No     | No  | No       | No   |
| Overflow handling            | No     | No    | No     | Yes | Yes      | No   |
| Density control              | No     | No    | No     | Yes | No       | No   |

## Must-add features

- **Roving tabindex** — Arrow keys move focus within toolbar, Tab exits (Radix, shadcn)
- **Vertical orientation** — support via prop (Radix, shadcn)
- **Overflow menu** — collapse less-used items into menu on small screens (MUI, Spectrum)

## Accessibility

- `role="toolbar"` on Root
- `aria-label` for icon-only buttons
- `aria-pressed` for toggle buttons
- Keyboard: Arrow Left/Right navigates, Tab exits toolbar

## Sources

- [Radix Toolbar](https://www.radix-ui.com/primitives/docs/components/toolbar)
- [MUI Toolbar](https://mui.com/material-ui/react-toolbar/)
