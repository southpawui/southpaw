# PreviewCard — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature              | shadcn | Radix | Chakra | MUI | Ours |
| -------------------- | ------ | ----- | ------ | --- | ---- |
| Hover/focus trigger  | Yes    | Yes   | Yes    | Yes | Yes  |
| Smart positioning    | Yes    | Yes   | No     | Yes | Yes  |
| Entry/exit animation | Yes    | Yes   | Yes    | Yes | Yes  |
| Open/close delay     | No     | No    | Yes    | Yes | No   |
| Arrow pointer        | Yes    | Yes   | No     | No  | Yes  |
| Portal rendering     | Yes    | Yes   | No     | Yes | Yes  |
| Focus trap           | No     | No    | Yes    | No  | No   |

## Must-add features

- **Open/close delay** — prevent flashing on quick mouse movement (Chakra, MUI)
- **Focus trap** — keep focus within preview when keyboard navigating (Chakra)

## Accessibility

- `aria-describedby` on trigger
- Escape closes popup
- Keyboard accessible: trigger must be focusable
- Content in preview must be accessible to screen readers

## Sources

- [Radix HoverCard](https://www.radix-ui.com/primitives/docs/components/hover-card)
- [shadcn/ui HoverCard](https://ui.shadcn.com/docs/components/radix/hover-card)
