# Menubar — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature             | shadcn | Mantine | MUI | Carbon | Ours |
| ------------------- | ------ | ------- | --- | ------ | ---- |
| Horizontal menu bar | Yes    | No      | No  | No     | Yes  |
| Submenus            | Yes    | No      | Yes | No     | Yes  |
| Checkbox items      | Yes    | No      | No  | No     | Yes  |
| Radio items         | Yes    | No      | No  | No     | Yes  |
| Keyboard nav        | Yes    | No      | Yes | No     | Yes  |
| Shortcut display    | Yes    | No      | No  | No     | No   |

## Must-add features

- **Shortcut display** — right-aligned keyboard shortcut text (shadcn)
- **Entry/exit animation** on dropdowns
- **Icon support** on menu items

## Accessibility

- `role="menubar"` on container
- `role="menuitem"` on top-level items
- Keyboard: Arrow Left/Right between top-level, Arrow Down to open, Escape to close
- Focus follows ARIA menubar pattern

## Sources

- [shadcn Menubar](https://ui.shadcn.com/docs/components/menubar)
- [WAI-ARIA Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
