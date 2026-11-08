# NavigationMenu — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                      | shadcn | Radix | Chakra | MUI | Primer | Ours |
| ---------------------------- | ------ | ----- | ------ | --- | ------ | ---- |
| Mega menu support            | Yes    | Yes   | No     | No  | No     | Yes  |
| Submenus                     | Yes    | Yes   | No     | No  | Yes    | Yes  |
| Keyboard navigation          | Yes    | Yes   | Yes    | Yes | Yes    | Yes  |
| Mobile hamburger integration | No     | No    | Yes    | Yes | No     | No   |
| Active link indication       | No     | No    | No     | No  | Yes    | No   |
| Portal positioning           | Yes    | Yes   | No     | No  | No     | Yes  |

## Must-add features

- **Mobile integration** — hamburger/drawer fallback on small screens (Chakra, MUI)
- **Active link styling** — highlight current page with `aria-current="page"` (Primer)

## Accessibility

- `role="navigation"` on Root
- `aria-expanded` on trigger buttons
- `aria-haspopup="menu"` on parent items
- Keyboard: Arrow Left/Right navigates, Arrow Down for submenus, Escape closes

## Sources

- [shadcn/ui NavigationMenu](https://ui.shadcn.com/docs/components/radix/navigation-menu)
- [Radix NavigationMenu](https://www.radix-ui.com/primitives/docs/components/navigation-menu)
- [Primer Navigation](https://primer.style/product/components/navigation)
