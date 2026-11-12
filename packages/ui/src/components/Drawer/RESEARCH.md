# Drawer — Competitive Research

Researched: 2026-11-08, updated 2026-11-12

## Feature comparison

| Feature                           | shadcn     | Mantine | Chakra | MUI | Ant | GOV.UK | Carbon | Spectrum | Primer | Ours |
| --------------------------------- | ---------- | ------- | ------ | --- | --- | ------ | ------ | -------- | ------ | ---- |
| Direction (left/right/top/bottom) | Yes        | Yes     | Yes    | Yes | Yes | No     | No     | No       | No     | Yes  |
| Size variants                     | No         | Yes     | Yes    | Yes | Yes | No     | No     | No       | No     | Yes  |
| Gesture dismiss (swipe)           | Yes (vaul) | No      | No     | Yes | No  | No     | No     | No       | No     | Yes  |
| Snap points                       | Yes (vaul) | No      | No     | No  | No  | No     | No     | No       | No     | No   |
| Drag handle                       | Yes (vaul) | No      | No     | Yes | No  | No     | No     | No       | No     | Yes  |
| Header/Body/Footer                | No         | Yes     | Yes    | No  | Yes | No     | No     | No       | No     | Yes  |
| Animations                        | Yes        | Yes     | Yes    | Yes | Yes | No     | No     | No       | No     | Yes  |
| Responsive width                  | No         | No      | No     | No  | No  | No     | No     | No       | No     | Yes  |

## Features added

- **Direction** (5/9 competitors) — all four edges
- **Size variants** (4/9) — responsive Tailwind widths for left/right, vh heights for top/bottom
- **Drag handle** (2/9) — pill bar for bottom/top sheets, hidden on desktop
- **Header/Body/Footer** (3/9) — matches Dialog structure
- **CloseButton** — styled X, hidden on mobile (swap with Handle)
- **Slide animation** — iOS drawer curve (--sp-easing-drawer, 500ms)
- **Responsive width** — unique to Southpaw, full width on mobile

## Accessibility

- Same as Dialog: focus trap, Escape to close, return focus, `role="dialog"`
- Backdrop click to close
- Swipe to dismiss on touch devices
- Handle visible on mobile as swipe affordance
- CloseButton visible on desktop as click target

## Sources

- [shadcn Drawer (vaul)](https://ui.shadcn.com/docs/components/drawer)
- [MUI Drawer](https://mui.com/material-ui/react-drawer/)
- [Mantine Drawer](https://mantine.dev/core/drawer/)
- [Base UI Drawer](https://base-ui.com/react/components/drawer)
- [Ant Design Drawer](https://ant.design/components/drawer/)
