# Accordion — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                 | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours |
| ----------------------- | ------ | ------- | ------ | --- | --- | -------- | ---- |
| Single/multi expand     | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Controlled/uncontrolled | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Animated height         | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Icon rotation           | Yes    | No      | Yes    | Yes | Yes | Yes      | Yes  |
| Disabled items          | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Lazy content loading    | No     | No      | Yes    | No  | No  | No       | No   |
| Rich description text   | No     | No      | No     | No  | No  | Yes      | No   |
| Reduced motion          | No     | No      | Yes    | No  | No  | No       | No   |
| Dense variant           | No     | No      | No     | Yes | No  | No       | No   |

## Must-add features

- **Lazy content loading** — only render panel content when open (Chakra pattern)
- **`prefers-reduced-motion`** — respect user preference (Chakra pattern)

## Accessibility

- `role="region"` with `aria-labelledby` for each panel
- `aria-expanded` on triggers
- `aria-controls` linking trigger to panel
- Keyboard: Arrow Up/Down to navigate, Enter/Space to toggle

## Sources

- [shadcn/ui Accordion](https://ui.shadcn.com/docs/components/radix/accordion)
- [Radix Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)
- [Chakra Accordion](https://chakra-ui.com/docs/components/accordion)
- [MUI Accordion](https://mui.com/material-ui/react-accordion/)
