# Spinner — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                  | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours |
| ------------------------ | ------ | ------- | ------ | --- | --- | -------- | ---- |
| SVG-based                | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Size variants            | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| currentColor inheritance | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Reduced motion support   | No     | No      | Yes    | No  | No  | No       | Yes  |
| role="status"            | Yes    | No      | No     | No  | No  | No       | Yes  |
| Loading text/label       | No     | No      | Yes    | No  | No  | No       | No   |
| Dot variant              | No     | Yes     | No     | No  | Yes | No       | No   |

## Status: Already best-in-class

Our Spinner already has:

- SVG-based, `role="status"`, `<title>Loading</title>`
- Size variants (sm/md/lg)
- `currentColor` inheritance
- `prefers-reduced-motion` support (3s instead of 1s)

## Nice-to-have

- **Loading text/label** — optional text alongside spinner (Chakra)
- **Dot variant** — three-dot animation as alternative style (Mantine, Ant)

## Sources

- [Chakra Spinner](https://chakra-ui.com/docs/components/spinner)
- [MUI CircularProgress](https://mui.com/material-ui/react-progress/)
