# Avatar — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                        | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours    |
| ------------------------------ | ------ | ------- | ------ | --- | --- | -------- | ------- |
| Image + fallback               | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes     |
| Initials fallback              | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes     |
| Size variants                  | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes (3) |
| Badge/status overlay           | No     | No      | Yes    | Yes | Yes | No       | No      |
| Avatar group/stack             | No     | No      | Yes    | Yes | Yes | No       | No      |
| Shape variants (circle/square) | No     | No      | Yes    | Yes | Yes | No       | No      |
| Loading/skeleton state         | No     | No      | No     | No  | No  | No       | No      |

## Must-add features

- **Avatar group/stack** — overlapping avatars for showing multiple users (Chakra, MUI, Ant)
- **Badge/status overlay** — online/offline/busy indicator (MUI, Chakra)
- **Shape variants** — circle (default) vs rounded square (Ant, Chakra)

## Accessibility

- `alt` text on Image for screen readers
- Fallback text provides accessible name automatically
- Badge status should not rely on colour alone — use icon + colour

## Sources

- [shadcn/ui Avatar](https://ui.shadcn.com/docs/components/radix/avatar)
- [Chakra Avatar](https://chakra-ui.com/docs/components/avatar)
- [MUI Avatar](https://mui.com/material-ui/react-avatar/)
