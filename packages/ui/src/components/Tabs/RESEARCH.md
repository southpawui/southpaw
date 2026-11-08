# Tabs — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                   | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours |
| ------------------------- | ------ | ------- | ------ | --- | --- | -------- | ---- |
| Horizontal                | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Vertical orientation      | Yes    | Yes     | Yes    | Yes | Yes | Yes      | No   |
| Tab overflow/scroll       | No     | No      | No     | Yes | Yes | No       | No   |
| Indicator animation       | Yes    | No      | Yes    | Yes | Yes | No       | Yes  |
| Lazy loading              | No     | No      | Yes    | No  | No  | No       | No   |
| Disabled tabs             | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Fitted/stretch width      | No     | No      | Yes    | Yes | No  | No       | No   |
| Icon + text               | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes  |
| Segmented control variant | No     | No      | No     | No  | No  | No       | No   |

## Must-add features

- **Vertical orientation** — multiple libraries support this
- **Tab overflow handling** — scrollable tabs for narrow containers (MUI, Ant)
- **Lazy loading** — only render active panel content (Chakra)

## Accessibility

- `role="tablist"` on Tab.List, `role="tab"` on buttons
- `aria-selected` + `aria-controls` on active tab
- `role="tabpanel"` on panel content
- Keyboard: Tab enters tablist, Arrow Left/Right navigates, Home/End jumps

## Sources

- [shadcn/ui Tabs](https://ui.shadcn.com/docs/components/radix/tabs)
- [MUI Tabs](https://mui.com/material-ui/react-tabs/)
- [Chakra Tabs](https://chakra-ui.com/docs/components/tabs)
