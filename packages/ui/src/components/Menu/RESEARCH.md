# Menu — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature              | shadcn | Mantine | Chakra | MUI | Carbon | Spectrum | Ours |
| -------------------- | ------ | ------- | ------ | --- | ------ | -------- | ---- |
| Submenus             | Yes    | Yes     | No     | Yes | Yes    | Yes      | Yes  |
| Checkbox items       | Yes    | No      | No     | Yes | Yes    | Yes      | Yes  |
| Radio items          | Yes    | No      | No     | No  | Yes    | Yes      | Yes  |
| Keyboard nav (arrow) | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Icon support         | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | No   |
| Shortcut display     | Yes    | No      | No     | No  | No     | No       | No   |
| Separators           | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Animation            | Yes    | Yes     | Yes    | Yes | No     | Yes      | No   |

## Must-add features

- **Icon support** — leading icon on menu items (shadcn, all major libraries)
- **Shortcut display** — right-aligned keyboard shortcut text (shadcn)
- **Entry/exit animation** — fade + scale (shadcn, Mantine)
- **Danger/destructive items** — red-coloured items for delete actions (shadcn)

## Accessibility

- `role="menu"` on container, `role="menuitem"` on items
- `role="menuitemcheckbox"` / `role="menuitemradio"` for selection items
- Keyboard: Arrow Up/Down to navigate, Enter/Space to select, Escape to close, Arrow Right to open submenu
- Focus management: first item receives focus on open
- Return focus to trigger on close

## Sources

- [shadcn Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu)
- [WAI-ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
