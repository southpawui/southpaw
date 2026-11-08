# ToggleGroup — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                 | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Ours |
| ----------------------- | ------ | ------- | ------ | --- | ------ | ------ | ---- |
| Exclusive/multiple mode | Yes    | Yes     | No     | Yes | No     | No     | No   |
| Orientation (h/v)       | No     | Yes     | No     | Yes | No     | Yes    | No   |
| Size variants           | No     | Yes     | No     | Yes | No     | No     | No   |
| Keyboard nav (arrow)    | Yes    | Yes     | No     | Yes | No     | No     | No   |
| Density modes           | No     | No      | No     | No  | No     | No     | Yes  |

## Must-add features

- **Exclusive vs multiple mode** — single selection (radio-like) vs multi (checkbox-like) (MUI, Mantine)
- **Keyboard navigation** — arrow keys to move focus between toggles
- **Orientation** — horizontal (default) and vertical

## Accessibility

- `role="group"` on container
- Each toggle has `aria-pressed`
- Arrow keys navigate, Space/Enter to toggle
- In exclusive mode, only one can be pressed (radio-like behaviour)

## Sources

- [MUI ToggleButtonGroup](https://mui.com/material-ui/react-toggle-button/)
- [Mantine SegmentedControl](https://mantine.dev/core/segmented-control/)
