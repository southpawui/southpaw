# Popover — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                 | shadcn | Mantine | Chakra | MUI | Carbon | Spectrum | Ours |
| ----------------------- | ------ | ------- | ------ | --- | ------ | -------- | ---- |
| Arrow pointer           | Yes    | Yes     | Yes    | No  | No     | No       | Yes  |
| Controlled/uncontrolled | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Portal rendering        | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Click outside dismiss   | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Focus trap (optional)   | No     | Yes     | Yes    | No  | No     | Yes      | No   |
| Animations              | Yes    | Yes     | Yes    | Yes | No     | Yes      | No   |

## Must-add features

- **Entry/exit animation** — fade + scale (shadcn, Mantine)
- **Focus trap** — optional, for popover forms (Mantine, Spectrum)

## Accessibility

- `aria-haspopup` on trigger
- `aria-expanded` on trigger when open
- `aria-controls` linking trigger to popover content
- Escape to close
- Focus management: return focus to trigger on close

## Sources

- [shadcn Popover](https://ui.shadcn.com/docs/components/popover)
- [Spectrum Popover](https://react-spectrum.adobe.com/react-spectrum/Dialog.html)
