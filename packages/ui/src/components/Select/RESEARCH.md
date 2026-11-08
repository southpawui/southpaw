# Select Component — Competitive Research

Researched: 2026-11-08
Linear issue: GEO-900

## Libraries surveyed

| Library        | Component             | Key strengths                                                 |
| -------------- | --------------------- | ------------------------------------------------------------- |
| shadcn/ui      | Select (Radix-based)  | Composition pattern, popup matches trigger width, animation   |
| Mantine        | Select + NativeSelect | Searchable, clearable, section props for icons                |
| Chakra UI v3   | Select (Ark-based)    | Field wrapper, compound pattern, state machines               |
| MUI            | Select                | FormControl integration, native variant, dense mode           |
| Ant Design     | Select                | Searchable, multi-select, tags mode, clear button, allowClear |
| Adobe Spectrum | Picker                | Read-only state, pending state, character count alongside     |
| Radix UI       | Select                | CSS variables for width, item-aligned positioning             |
| GOV.UK         | Select                | Guidance: prefer radios over selects when possible            |
| GitHub Primer  | ActionMenu/Select     | Single + multi select, submenus, keyboard nav                 |
| Base UI        | Select                | Headless, composable, Portal, ScrollArrows                    |

## Feature comparison

| Feature               | shadcn            | Mantine   | Chakra   | MUI          | Ant              | Spectrum | Primer   | Ours                 |
| --------------------- | ----------------- | --------- | -------- | ------------ | ---------------- | -------- | -------- | -------------------- |
| Searchable/filter     | Separate Combobox | Built-in  | Separate | Separate     | Built-in         | Separate | Built-in | Separate (Combobox)  |
| Multi-select          | No                | Yes       | Yes      | Autocomplete | Yes (mode)       | No       | Yes      | No (future)          |
| Clear button          | No                | Yes       | No       | No           | Yes (allowClear) | No       | No       | Yes                  |
| Read-only state       | No                | No        | Yes      | No           | No               | Yes      | No       | Yes                  |
| Virtual scroll        | No                | No        | No       | No           | Yes              | No       | No       | Yes (optional)       |
| Grouped items         | Yes               | Yes       | Yes      | Yes          | Yes              | Yes      | Yes      | Yes                  |
| Custom item render    | Yes               | Yes       | Yes      | Yes          | Yes              | Yes      | Yes      | Yes                  |
| Disabled items        | Yes               | Yes       | Yes      | Yes          | Yes              | Yes      | Yes      | Yes                  |
| Animation             | Yes               | Yes       | Yes      | Yes          | Yes              | Yes      | No       | Yes                  |
| Popup width match     | Yes (CSS var)     | Auto      | Auto     | Auto         | Auto             | Auto     | Auto     | Yes (--anchor-width) |
| Item-aligned position | Yes (default)     | No        | No       | No           | No               | No       | No       | Yes (opt-in)         |
| Valid state           | No                | No        | No       | No           | No               | No       | No       | Yes                  |
| Density responsive    | No                | Size prop | No       | Dense mode   | Size prop        | No       | No       | Yes (tokens)         |

## Key decisions

- **Searchable**: NOT built into Select. Use Combobox (separate component) per shadcn/Radix/MUI pattern.
- **Multi-select**: NOT built into Select. Future component or Combobox with multi mode.
- **Clear button**: Added as `clearable` prop on Trigger. Ant Design's `allowClear` is the precedent.
- **Read-only**: Added as `readOnly` prop. Spectrum's pattern — shows value but not interactive.
- **Virtual scroll**: Optional via prop for lists with 100+ items. Uses CSS `content-visibility: auto` for lightweight approach, or consumer can integrate `@tanstack/react-virtual`.
- **Item-aligned positioning**: Available via `alignItemWithTrigger` on Positioner, defaults to false (dropdown-below pattern).

## Accessibility requirements (WCAG 2.1 AA)

- `role="combobox"` on trigger (Base UI handles this)
- `aria-expanded` on trigger (Base UI handles this)
- `aria-controls` linking trigger to popup (Base UI handles this)
- `aria-invalid` for error state (via Field context)
- `aria-describedby` for hints/errors (via Field context)
- `role="listbox"` on popup, `role="option"` on items (Base UI handles this)
- `aria-selected` on selected item (Base UI handles this)
- `aria-disabled` on disabled items (Base UI handles this)
- Keyboard: Tab, Space/Enter (open), ArrowUp/Down (navigate), Home/End, Escape (close), type-ahead

## Sources

- [shadcn/ui Select](https://ui.shadcn.com/docs/components/base/select)
- [Radix UI Select](https://www.radix-ui.com/primitives/docs/components/select)
- [Base UI Select](https://base-ui.com/react/components/select)
- [Mantine NativeSelect](https://mantine.dev/core/native-select/)
- [Chakra UI v3 Select](https://chakra-ui.com/docs/components/select)
- [MUI Select API](https://mui.com/material-ui/api/select/)
- [Ant Design Select](https://ant.design/components/select/)
- [Adobe Spectrum Picker](https://opensource.adobe.com/spectrum-web-components/components/picker/)
- [GOV.UK Select](https://designsystem.gov.scot/components/select)
- [GitHub Primer ActionMenu](https://primer.style/product/components/action-menu/)
