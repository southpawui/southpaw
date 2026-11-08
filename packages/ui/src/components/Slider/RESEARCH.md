# Slider — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature              | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| -------------------- | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| Range (two thumbs)   | Yes    | Yes     | Yes    | Yes | No     | Yes    | Yes      | No   |
| Marks/ticks          | No     | Yes     | No     | Yes | No     | No     | Yes      | No   |
| Mark labels          | No     | Yes     | No     | Yes | No     | No     | Yes      | No   |
| Vertical orientation | No     | Yes     | No     | Yes | No     | No     | No       | No   |
| Step control         | Yes    | Yes     | Yes    | Yes | No     | Yes    | Yes      | Yes  |
| Click-on-track       | Yes    | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |
| Density modes        | No     | No      | No     | No  | No     | No     | No       | Yes  |

## Must-add features

- **Marks/ticks on track** with optional labels (MUI, Mantine, Spectrum)
- **Click-on-track** to move nearest thumb (GOV.UK pattern)
- **Range mode** — two thumbs for min/max selection
- **Vertical orientation** support

## Accessibility

- Thumb has `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-label` or `aria-labelledby` for accessible name
- Keyboard: Arrow Up/Down/Left/Right to step, Home/End for min/max, PageUp/PageDown for large steps
- Touch: thumb must be 44x44px minimum on coarse pointers

## Sources

- [MUI Slider](https://mui.com/material-ui/react-slider/)
- [Mantine Slider](https://mantine.dev/core/slider/)
- [Spectrum Slider](https://spectrum.adobe.com/page/slider/)
