# Meter — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                                   | shadcn | Mantine | Chakra | MUI | Spectrum | Ours |
| ----------------------------------------- | ------ | ------- | ------ | --- | -------- | ---- |
| Value range (min/max)                     | N/A    | N/A     | Yes    | N/A | Yes      | Yes  |
| Colour by range (optimum/suboptimum/poor) | N/A    | N/A     | Yes    | N/A | Yes      | No   |
| Native `<meter>` element                  | N/A    | N/A     | No     | N/A | No       | No   |
| Label/value display                       | N/A    | N/A     | Yes    | N/A | Yes      | Yes  |
| Low/high/optimum thresholds               | N/A    | N/A     | No     | N/A | Yes      | No   |

## Must-add features

- **Native `<meter>` element** — use HTML `<meter>` for semantics (CSS spec)
- **Colour-coded ranges** — green/yellow/red based on thresholds (Chakra, Spectrum)
- **Low/high/optimum attributes** — HTML meter spec supports this natively

## Accessibility

- Native `<meter>` has excellent built-in a11y
- `aria-label` or `aria-labelledby` for accessible name
- Screen readers announce range and current value automatically

## Sources

- [HTML meter element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter)
- [Chakra Stat](https://chakra-ui.com/docs/components/stat)
- [Spectrum Meter](https://spectrum.adobe.com/page/meter/)
