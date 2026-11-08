# ContextMenu — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature             | shadcn | Mantine | MUI | Carbon | Ours |
| ------------------- | ------ | ------- | --- | ------ | ---- |
| Right-click trigger | Yes    | Yes     | Yes | No     | Yes  |
| Submenus            | Yes    | No      | Yes | No     | Yes  |
| Checkbox items      | Yes    | No      | No  | No     | Yes  |
| Radio items         | Yes    | No      | No  | No     | Yes  |
| Icon support        | Yes    | No      | Yes | No     | No   |
| Shortcut display    | Yes    | No      | No  | No     | No   |
| Animation           | Yes    | Yes     | Yes | No     | No   |

## Must-add features

- **Icon support** — leading icon on items (shadcn)
- **Shortcut display** — right-aligned shortcut text (shadcn)
- **Entry/exit animation** — fade + scale at cursor position

## Accessibility

- Same as Menu: `role="menu"`, `role="menuitem"`, keyboard navigation
- Context menu should also be reachable via keyboard (Shift+F10 or Menu key)
- Return focus to trigger area on close

## Sources

- [shadcn Context Menu](https://ui.shadcn.com/docs/components/context-menu)
- [WAI-ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
