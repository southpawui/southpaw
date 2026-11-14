# Popover — Competitive Research

Researched: 2026-11-08, updated 2026-11-12

## Feature comparison

| Feature                 | shadcn | Mantine | Chakra | MUI | Ant | GOV.UK | Carbon | Spectrum | Primer | Ours |
| ----------------------- | ------ | ------- | ------ | --- | --- | ------ | ------ | -------- | ------ | ---- |
| Arrow pointer           | No     | Yes     | Yes    | No  | Yes | N/A    | Yes    | No       | Yes    | Yes  |
| Controlled/uncontrolled | Yes    | Yes     | Yes    | Yes | Yes | N/A    | Yes    | Yes      | Yes    | Yes  |
| Portal rendering        | Yes    | Yes     | Yes    | Yes | Yes | N/A    | Yes    | Yes      | Yes    | Yes  |
| Click outside dismiss   | Yes    | Yes     | Yes    | Yes | Yes | N/A    | Yes    | Yes      | Yes    | Yes  |
| Animations              | Yes    | Yes     | Yes    | Yes | Yes | N/A    | No     | Yes      | No     | Yes  |
| Close button built-in   | No     | No      | No     | No  | No  | N/A    | No     | No       | No     | No   |
| Width variants          | No     | Yes     | No     | No  | No  | N/A    | No     | No       | Yes    | Yes  |

## Features added

- **Arrow** with semantic token styling (5/9 competitors)
- **Animation** — scale + opacity using motion tokens (5/9)
- **Unstyled Trigger/Close** — consumer wraps with Button
- **Semantic tokens** — adapts to all themes
- **Match trigger width** — via `w-[var(--anchor-width)]` on Popup (Mantine, Primer)

## GOV.UK note

GOV.UK does not have a Popover component. They use Details/Accordion patterns for progressive disclosure instead.

## Accessibility

- `aria-haspopup` on trigger (handled by Base UI)
- `aria-expanded` on trigger when open
- `aria-controls` linking trigger to popover content
- Escape to close
- Click outside to close
- Return focus to trigger on close

## Sources

- [shadcn Popover](https://ui.shadcn.com/docs/components/popover)
- [Mantine Popover](https://mantine.dev/core/popover/)
- [Base UI Popover](https://base-ui.com/react/components/popover)
- [Ant Design Popover](https://ant.design/components/popover/)
- [Primer Overlay](https://primer.style/components/overlay)
