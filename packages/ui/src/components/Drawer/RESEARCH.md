# Drawer — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                           | shadcn     | Mantine | Chakra | MUI | Carbon | Spectrum | Ours |
| --------------------------------- | ---------- | ------- | ------ | --- | ------ | -------- | ---- |
| Direction (left/right/top/bottom) | Yes        | Yes     | Yes    | Yes | No     | No       | No   |
| Size variants                     | No         | Yes     | Yes    | Yes | No     | No       | No   |
| Gesture dismiss (swipe)           | Yes (vaul) | No      | No     | Yes | No     | No       | No   |
| Snap points                       | Yes (vaul) | No      | No     | No  | No     | No       | No   |
| Nested drawers                    | Yes (vaul) | No      | No     | No  | No     | No       | No   |
| Scale behind (background dim)     | Yes (vaul) | No      | No     | No  | No     | No       | No   |
| Animations                        | Yes        | Yes     | Yes    | Yes | No     | No       | No   |

## Must-add features

- **Direction** — left/right/top/bottom positioning (shadcn, Mantine, MUI — all have this)
- **Size variants** — sm/md/lg/full (Mantine, MUI)
- **Entry/exit animation** — slide in/out from edge (all libraries)
- **Gesture dismiss** — swipe to close on mobile (shadcn uses vaul for this)

## Accessibility

- Same as Dialog: focus trap, Escape to close, return focus, `role="dialog"`
- Backdrop click to close (optional)
- Announce direction to screen readers if relevant

## Sources

- [shadcn Drawer (vaul)](https://ui.shadcn.com/docs/components/drawer)
- [MUI Drawer](https://mui.com/material-ui/react-drawer/)
- [Mantine Drawer](https://mantine.dev/core/drawer/)
