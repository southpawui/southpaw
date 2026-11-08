# ScrollArea — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                   | shadcn | Mantine | Chakra | Radix | Ours |
| ------------------------- | ------ | ------- | ------ | ----- | ---- |
| Custom scrollbar styling  | Yes    | Yes     | No     | Yes   | Yes  |
| Auto-hide scrollbar       | No     | Yes     | No     | No    | No   |
| Both axes                 | Yes    | Yes     | Yes    | Yes   | Yes  |
| Corner element            | Yes    | No      | No     | Yes   | Yes  |
| Scroll-to-element API     | No     | No      | No     | No    | No   |
| Touch scrolling preserved | Yes    | Yes     | Yes    | Yes   | Yes  |

## Must-add features

- **Auto-hide scrollbar** — hide when not scrolling, show on hover/scroll (Mantine)
- **Scroll-to-element API** — programmatic scroll to child element

## Accessibility

- Semantically transparent — no ARIA changes needed
- Native touch scrolling preserved
- High contrast: thumb should have 4.5:1 contrast ratio

## Sources

- [shadcn/ui ScrollArea](https://ui.shadcn.com/docs/components/radix/scroll-area)
- [Radix ScrollArea](https://www.radix-ui.com/primitives/docs/components/scroll-area)
- [Mantine ScrollArea](https://mantine.dev/core/scroll-area/)
