# Progress — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                         | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours |
| ------------------------------- | ------ | ------- | ------ | --- | --- | -------- | ---- |
| Determinate                     | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Indeterminate (loading)         | No     | No      | Yes    | Yes | Yes | Yes      | No   |
| Label/value display             | No     | Yes     | Yes    | No  | Yes | Yes      | Yes  |
| Colour states (success/warning) | No     | Yes     | Yes    | Yes | Yes | Yes      | No   |
| Striped variant                 | No     | No      | Yes    | No  | Yes | Yes      | No   |
| Size variants                   | No     | Yes     | Yes    | No  | No  | Yes      | No   |
| Circular variant                | No     | No      | Yes    | Yes | Yes | No       | No   |

## Must-add features

- **Indeterminate state** — animated loading bar when progress unknown (MUI, Chakra, Ant)
- **Colour states** — success/warning/danger based on value thresholds (Chakra, MUI)
- **Size variants** — sm/md/lg heights (Mantine, Chakra)

## Accessibility

- `role="progressbar"` on indicator
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-label` for accessible name
- Update attributes dynamically as progress changes

## Sources

- [shadcn/ui Progress](https://ui.shadcn.com/docs/components/radix/progress)
- [MUI Progress](https://mui.com/material-ui/react-progress/)
- [Chakra Progress](https://chakra-ui.com/docs/components/progress)
