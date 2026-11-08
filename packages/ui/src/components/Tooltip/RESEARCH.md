# Tooltip — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature             | shadcn | Mantine | Chakra | MUI | Carbon | Spectrum | Ours |
| ------------------- | ------ | ------- | ------ | --- | ------ | -------- | ---- |
| Arrow pointer       | Yes    | Yes     | Yes    | Yes | No     | No       | Yes  |
| Open/close delay    | Yes    | Yes     | Yes    | Yes | No     | Yes      | No   |
| Placement options   | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Rich content (HTML) | No     | Yes     | Yes    | Yes | No     | No       | No   |
| Animation           | Yes    | Yes     | Yes    | Yes | No     | Yes      | No   |
| Touch support       | No     | No      | Yes    | No  | No     | Yes      | No   |

## Must-add features

- **Open/close delay** — prevent flashing on quick mouse movements (shadcn, Mantine)
- **Entry/exit animation** — fade with reduced-motion fallback
- **Touch support** — long-press to show on mobile (Chakra, Spectrum)

## Accessibility

- `role="tooltip"` on content
- `aria-describedby` on trigger, pointing to tooltip
- Tooltip content must be text-only (use Popover for interactive content)
- Must be dismissible via Escape
- Not triggered on focus alone — keyboard + mouse trigger

## Sources

- [shadcn Tooltip](https://ui.shadcn.com/docs/components/tooltip)
- [WCAG Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
