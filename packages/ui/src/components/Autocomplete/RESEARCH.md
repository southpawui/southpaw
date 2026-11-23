# Autocomplete — Competitive Research

Researched: 2026-11-08 (thin first pass). Redone 2026-11-16 across all 9 libraries (GEO-934).

**The full analysis lives in [Combobox/RESEARCH.md](../Combobox/RESEARCH.md).** Combobox and Autocomplete share their anatomy, styling and most behaviour, so they are researched and built together.

## How Autocomplete differs from Combobox

Base UI's guidance, which matches GOV.UK, Carbon and React Aria:

- **Combobox** restricts the value to the list. It is a filterable Select. Typed text that matches nothing is reverted.
- **Autocomplete** is a text input whose value is whatever the user types. The list only suggests. Use it for search boxes, free-text fields with suggestions, and command palettes.

The library equivalents are:

| Library      | Restricted (Combobox)            | Free text (Autocomplete)                        |
| ------------ | -------------------------------- | ----------------------------------------------- |
| shadcn       | Combobox                         | Base UI Autocomplete                            |
| Mantine      | Select (searchable), MultiSelect | Autocomplete, TagsInput                         |
| Chakra / Ark | Combobox                         | Combobox `allowCustomValue`                     |
| MUI          | Autocomplete                     | Autocomplete `freeSolo`                         |
| Ant          | Select `showSearch`              | AutoComplete                                    |
| GOV.UK       | accessible-autocomplete          | accessible-autocomplete `confirmOnBlur={false}` |
| Carbon       | ComboBox                         | ComboBox `allowCustomValue`                     |
| React Aria   | ComboBox                         | ComboBox `allowsCustomValue`, Autocomplete      |
| Primer       | SelectPanel                      | Autocomplete                                    |

## Autocomplete-specific features

- **Inline completion**: the rest of the highlighted suggestion is filled in and selected in the input (MUI `autoComplete`, Chakra `inputBehavior="autocomplete"`, Carbon `typeahead`, Ant `backfill`). Base UI: `mode="both"` / `"inline"`.
- **Command palette**: a filter input paired with a list inside a dialog (React Aria Autocomplete, Base UI example).
- **Grid of suggestions** (Base UI `grid`), for emoji or icon pickers.
- **Fuzzy matching** (Base UI example), and **limit results** (Mantine, Chakra, MUI).
- **Async search** with loading and error states (MUI, Ant, Mantine, Primer).
- **Submit on Enter** while the list is open (Chakra `alwaysSubmitOnEnter`), for search forms.
