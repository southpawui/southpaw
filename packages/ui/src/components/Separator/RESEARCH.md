# Separator — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                        | shadcn | Mantine | Chakra | MUI | Radix | Ours |
| ------------------------------ | ------ | ------- | ------ | --- | ----- | ---- |
| Horizontal/vertical            | Yes    | Yes     | Yes    | Yes | Yes   | Yes  |
| Decorative vs semantic         | Yes    | No      | No     | No  | Yes   | Yes  |
| Label/text support             | No     | No      | No     | No  | No    | No   |
| Style variants (dashed/dotted) | No     | No      | Yes    | No  | No    | No   |
| Spacing control                | No     | No      | No     | Yes | No    | No   |

## Must-add features

- **Label/text support** — centered text on separator (shadcn pattern exists in Field.Separator, bring to standalone)
- **Style variants** — solid/dashed/dotted (Chakra)
- **Spacing prop** — configurable margin (MUI)

## Accessibility

- `role="separator"` for semantic separators
- `role="none"` for purely decorative
- `aria-orientation` should match visual orientation
- Never focusable

## Sources

- [shadcn/ui Separator](https://ui.shadcn.com/docs/components/radix/separator)
- [Radix Separator](https://www.radix-ui.com/primitives/docs/components/separator)
- [Chakra Divider](https://chakra-ui.com/docs/components/divider)
