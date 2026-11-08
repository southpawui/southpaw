# Card — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                             | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours |
| ----------------------------------- | ------ | ------- | ------ | --- | --- | -------- | ---- |
| Composition (Header/Content/Footer) | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Interactive/clickable variant       | No     | No      | Yes    | Yes | No  | Yes      | No   |
| Elevation/shadow levels             | No     | No      | No     | Yes | No  | No       | No   |
| Variant (outline/solid/elevated)    | No     | No      | Yes    | Yes | No  | No       | No   |
| Density modes                       | No     | No      | No     | Yes | No  | No       | No   |
| Divider between sections            | No     | No      | No     | Yes | No  | No       | No   |
| Image slot                          | No     | Yes     | Yes    | Yes | Yes | No       | No   |

## Must-add features

- **Interactive/clickable variant** — hover effect for linked cards (Chakra, MUI, Spectrum)
- **Variant prop** — outline vs elevated vs filled (Chakra, MUI)
- **Image slot** — Card.Image for media cards (Mantine, MUI, Ant)

## Accessibility

- Use `<article>` or `<section>` based on content, not generic `<div>`
- If clickable, use `<a>` or `<button>` wrapper
- Heading hierarchy: Title should use configurable heading level
- Links/buttons inside card must be keyboard accessible

## Sources

- [shadcn/ui Card](https://ui.shadcn.com/docs/components/card)
- [MUI Card](https://mui.com/material-ui/react-card/)
- [Chakra Card](https://chakra-ui.com/docs/components/card)
