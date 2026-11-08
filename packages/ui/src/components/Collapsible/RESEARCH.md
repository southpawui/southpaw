# Collapsible — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature          | shadcn | Radix | Chakra | MUI | Ours |
| ---------------- | ------ | ----- | ------ | --- | ---- |
| Simple toggle    | Yes    | Yes   | Yes    | Yes | Yes  |
| Controlled state | Yes    | Yes   | Yes    | Yes | Yes  |
| Height animation | Yes    | Yes   | Yes    | Yes | Yes  |
| Icon rotation    | Yes    | Yes   | Yes    | No  | No   |
| Lazy loading     | No     | No    | Yes    | No  | No   |
| Nested support   | No     | No    | No     | Yes | No   |

## Must-add features

- **Icon rotation helper** — auto-rotate disclosure chevron on toggle
- **Lazy content loading** — only render content when open (Chakra)

## Accessibility

- `aria-expanded` on trigger button
- `aria-controls` linking trigger to content
- Keyboard: Space/Enter to toggle
- Simpler than Accordion — no special nav keys

## Sources

- [shadcn/ui Collapsible](https://ui.shadcn.com/docs/components/radix/collapsible)
- [Radix Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible)
