# Autocomplete — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                   | shadcn | Mantine | Chakra | MUI | Spectrum | React Select | Ours |
| ------------------------- | ------ | ------- | ------ | --- | -------- | ------------ | ---- |
| Searchable/filterable     | Yes    | Yes     | Yes    | Yes | Yes      | Yes          | Yes  |
| Async data loading        | No     | No      | No     | Yes | Yes      | Yes          | No   |
| Multi-select              | No     | Yes     | Yes    | Yes | Yes      | Yes          | No   |
| Grouped options           | Yes    | Yes     | No     | Yes | Yes      | Yes          | Yes  |
| Free-solo (custom values) | No     | No      | No     | Yes | No       | Yes          | No   |
| Clear button              | Yes    | Yes     | Yes    | Yes | Yes      | Yes          | Yes  |
| Empty state message       | Yes    | Yes     | Yes    | Yes | Yes      | Yes          | Yes  |
| Debounced search          | No     | No      | No     | No  | Yes      | Yes          | No   |
| Virtual scrolling         | No     | Yes     | No     | Yes | No       | Yes          | No   |

## Must-add features

- **Async data loading** with loading state (MUI, Spectrum, React Select)
- **Multi-select** mode (MUI, Mantine — multiple libraries offer this)
- **Free-solo mode** — allow custom values not in list (MUI)
- **Virtual scrolling** for large lists (MUI, React Select — 2+ libraries)
- **Debounced search** for async use cases (Spectrum)

## Accessibility

- Input has `role="combobox"`, `aria-expanded`, `aria-controls`
- Listbox: `role="listbox"` on popup, `role="option"` on items
- Keyboard: Arrow Up/Down to navigate, Enter to select, Escape to close
- Empty state: announce "No results" to screen readers
- `aria-selected` on highlighted/selected item

## Sources

- [MUI Autocomplete](https://mui.com/material-ui/react-autocomplete/)
- [Spectrum ComboBox](https://react-spectrum.adobe.com/react-spectrum/ComboBox.html)
- [React Select](https://react-select.com/)
