# Badge — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature              | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours    |
| -------------------- | ------ | ------- | ------ | --- | --- | -------- | ------- |
| Colour variants      | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes (5) |
| Size variants        | No     | Yes     | Yes    | Yes | No  | Yes      | No      |
| Icon support         | No     | No      | Yes    | Yes | No  | Yes      | No      |
| Dismissible/closable | No     | No      | Yes    | No  | No  | No       | No      |
| Count badge          | No     | No      | No     | Yes | Yes | No       | No      |
| Dot variant          | No     | No      | No     | Yes | Yes | No       | No      |
| Outline variant      | No     | No      | No     | No  | No  | Yes      | No      |
| Pulse animation      | No     | No      | No     | No  | Yes | No       | No      |

## Must-add features

- **Size variants** — xs/sm/md/lg (Mantine, Chakra, MUI)
- **Icon support** — icon + text composition (Chakra, MUI)
- **Dismissible** — close button for removable badges (Chakra)
- **Count badge** — numeric overlay on avatars/icons (MUI, Ant)
- **Dot variant** — minimal indicator (MUI, Ant)

## Accessibility

- Badge is visual enhancement — not required for understanding
- If badge conveys critical info, provide text alternative
- Colour alone should not convey meaning — use icon + colour
- `aria-label` for icon-only badges

## Sources

- [shadcn/ui Badge](https://ui.shadcn.com/docs/components/badge)
- [MUI Badge](https://mui.com/material-ui/react-badge/)
- [Chakra Badge](https://chakra-ui.com/docs/components/badge)
