# Combobox & Autocomplete — Competitive Research

Researched: 2026-11-08 (thin first pass, 6 libraries). Redone 2026-11-16 across all 9 libraries (GEO-934).

This file covers **both** components. Combobox (pick from a fixed list, with filtering) and Autocomplete (free text with suggestions) share their anatomy, styling and most behaviour, so they are researched and built together. `Autocomplete/RESEARCH.md` points here.

Base UI v1.9 is the primitive under both. Where a feature is "Base UI" below, the primitive already supports it and we only need styling, defaults or a story.

## Who has what

| Library               | Components                                                                                                      | Distinctive features                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| shadcn/ui             | `Combobox` (Base UI by default) with Input, Content, List, Item, Empty, Chips/Chip/ChipsInput, Group, Separator | Thin layer over Base UI. `showClear`, `multiple` with chips, `autoHighlight`, input-group addons, `aria-invalid`, RTL.                                                                                                                                                                                                                                                                                                         |
| Mantine               | `Combobox` (headless + `useCombobox`), `Select` (searchable), `MultiSelect`, `Autocomplete`, `TagsInput`        | `useVirtualizedCombobox`, `Combobox.Header`/`Footer`, `limit`, `maxValues`, `hidePickedOptions`, `withPillsReorder`, `renderPill`, `checkIconPosition`, `clearSectionMode`, `floatingHeight="viewport"`, `loading` + `loadingPosition`, `success` state. TagsInput: `splitChars`, paste split, `acceptValueOnBlur`, `allowDuplicates`, `maxTags`.                                                                              |
| Chakra v3 / Ark       | `Combobox`, `TagsInput`                                                                                         | `inputBehavior` (`autohighlight`/`autocomplete`), `selectionBehavior` (`replace`/`clear`/`preserve`), `openOnClick`, `openOnChange` (function → minimum characters), `alwaysSubmitOnEnter`, `scrollToIndexFn`, `translations` (`resultsCount`, `noResults`, `loading`), `Highlight`, link items, `useFilter` (`Intl.Collator`).                                                                                                |
| MUI                   | `Autocomplete`, `useAutocomplete`                                                                               | `freeSolo`, `autoComplete` (inline), `autoHighlight`, `autoSelect`, `blurOnSelect` (`touch`/`mouse`), `clearOnBlur`, `clearOnEscape`, `selectOnFocus`, `includeInputInList`, `handleHomeEndKeys`, `disableCloseOnSelect`, `limitTags` + `getLimitTagsText`, `groupBy`, `createFilterOptions` (`ignoreAccents`, `ignoreCase`, `limit`, `matchFrom`), fixed chips, checkbox options, infinite load, react-window virtualization. |
| Ant Design            | `AutoComplete` (free text), `Select` (`showSearch`, `mode="multiple"\|"tags"`)                                  | `tokenSeparators`, `maxTagCount` (number or `"responsive"`), `maxTagPlaceholder`, `maxTagTextLength`, `maxCount`, `filterSort`, `autoClearSearchValue`, `backfill`, `defaultActiveFirstOption`, built-in `virtual`, `popupRender`, `onPopupScroll`, `status` (`error`/`warning`), variants (`outlined`/`filled`/`borderless`/`underlined`).                                                                                    |
| GOV.UK                | `accessible-autocomplete` (outside the core system). Core guidance calls `<select>` a "last resort".            | `enhanceSelectElement`, `minLength`, `showAllValues` + `dropdownArrow`, `autoselect`, `confirmOnBlur`, `displayMenu` (`inline`/`overlay`), `showNoOptionsFound`, `t*` i18n functions. Two alternating `role=status` regions, debounced 1400 ms.                                                                                                                                                                                |
| Carbon                | `ComboBox`, `MultiSelect`, `FilterableMultiSelect`, Fluid variants                                              | `allowCustomValue`, `typeahead` (inline, experimental), `shouldFilterItem`, `warn`/`warnText`, `invalid`/`invalidText`, `helperText`, sizes xs–lg. Multi: selected-count tag that clears all, `selectionFeedback` (`top`/`fixed`/`top-after-reopen`), "All" with indeterminate state, `clearSelectionText` screen-reader hint.                                                                                                 |
| Spectrum / React Aria | `ComboBox`, `Autocomplete`, `ListBox`, `TagGroup`, `Virtualizer`                                                | `menuTrigger` (`input`/`focus`/`manual`), `allowsCustomValue`, `allowsEmptyCollection`, multiple with TagGroup, `formValue` (`key`/`text`), `validationBehavior`, `loadingState` + `onLoadMore`, `renderEmptyState`, `Virtualizer`, `necessityIndicator`, `isQuiet`, mobile tray.                                                                                                                                              |
| Primer                | `Autocomplete`, `TextInputWithTokens`, `SelectPanel`                                                            | `addNewItem` (creatable), `sortOnCloseFn` (selected to top after close), `emptyStateText`, `loading`. SelectPanel: footer `secondaryAction`, `variant="modal"` (apply on confirm), `onCancel`, `showSelectAll`, `showSelectedOptionsFirst`, `notice`, `message` (empty/error/warning), `virtualized` (>100 items), fullscreen on narrow.                                                                                       |

## Ours now (before this ticket)

Both files are 2026-11-07 wrappers: raw `neutral-*`/`white` colours, a 40px input that ignores density, no Field integration, no valid/invalid/readOnly styling, no tests, no LOG.md, no auto-rendered parts. Combobox and Autocomplete repeat 13 of their 19 class strings. Option rows don't match Menu. No ScrollArea, no loading, no virtualization.

## Feature matrix

Key: **shad** shadcn, **Man** Mantine, **Chak** Chakra/Ark, **Ant** Ant Design, **GOV** GOV.UK, **Carb** Carbon, **RA** React Aria/Spectrum, **Prim** Primer. "Unconf." = not confirmed from the docs fetched.

### Selection and values

| Feature                     | shad                 | Man     | Chak    | MUI               | Ant                        | GOV     | Carb      | RA      | Prim    |
| --------------------------- | -------------------- | ------- | ------- | ----------------- | -------------------------- | ------- | --------- | ------- | ------- |
| Single select               | Yes                  | Yes     | Yes     | Yes               | Yes                        | Yes     | Yes       | Yes     | Yes     |
| Multi-select with chips     | Yes                  | Yes     | Partial | Yes               | Yes                        | No      | Count tag | Yes     | Yes     |
| Chip overflow "+N"          | Unconf.              | Unconf. | No      | Yes (`limitTags`) | Yes (incl. `"responsive"`) | No      | N/A       | Unconf. | Unconf. |
| Backspace removes last chip | Base UI              | Yes     | Unconf. | Unconf.           | Unconf.                    | No      | Partial   | Unconf. | Unconf. |
| Fixed (undeletable) chips   | No                   | Unconf. | No      | Yes               | Unconf.                    | No      | No        | Unconf. | No      |
| Chip reorder                | No                   | Yes     | No      | No                | No                         | No      | No        | No      | No      |
| Max selections              | Unconf.              | Yes     | Yes     | No                | Yes                        | No      | No        | No      | No      |
| Free text / custom value    | Base UI Autocomplete | Yes     | Yes     | Yes (`freeSolo`)  | Yes                        | Partial | Yes       | Yes     | Unconf. |
| Creatable "Create 'x'"      | Base UI example      | Yes     | Yes     | Yes               | Partial                    | No      | No        | Yes     | Yes     |
| Tags input (Enter / comma)  | No                   | Yes     | Yes     | Partial           | Yes                        | No      | No        | No      | Partial |
| Paste split                 | No                   | Yes     | Yes     | No                | Yes                        | No      | No        | No      | No      |
| Duplicate control           | No                   | Yes     | Yes     | No                | Unconf.                    | No      | No        | No      | No      |
| Hide picked options         | Unconf.              | Yes     | No      | Partial           | Unconf.                    | No      | No        | No      | No      |
| Selected sorted to top      | No                   | No      | No      | No                | No                         | No      | Yes       | No      | Yes     |
| Select all                  | No                   | No      | No      | No                | No                         | No      | Yes       | No      | Yes     |
| Selected count              | No                   | No      | No      | Partial           | Partial                    | No      | Yes       | No      | No      |

### Filtering

| Feature                      | shad            | Man     | Chak           | MUI               | Ant     | GOV               | Carb    | RA      | Prim    |
| ---------------------------- | --------------- | ------- | -------------- | ----------------- | ------- | ----------------- | ------- | ------- | ------- |
| Custom filter                | Yes             | Yes     | Yes            | Yes               | Yes     | Yes               | Yes     | Yes     | Yes     |
| startsWith vs contains       | Yes             | Partial | Yes            | Yes (`matchFrom`) | Partial | Partial           | Partial | Partial | Partial |
| Case / diacritic insensitive | Yes (Intl)      | Unconf. | Yes (Collator) | Yes               | Partial | Unconf.           | Partial | Yes     | Yes     |
| Limit results                | Base UI `limit` | Yes     | Yes            | Yes               | No      | No                | No      | No      | No      |
| Match highlighting           | No              | Unconf. | Yes            | Yes (demo)        | No      | No                | No      | No      | No      |
| Minimum characters           | No              | No      | Yes            | No                | No      | Yes (`minLength`) | No      | No      | No      |

### Input behaviour

| Feature                                     | shad                          | Man     | Chak    | MUI                | Ant                  | GOV           | Carb               | RA           | Prim    |
| ------------------------------------------- | ----------------------------- | ------- | ------- | ------------------ | -------------------- | ------------- | ------------------ | ------------ | ------- |
| Inline completion                           | Base UI `autoComplete="both"` | No      | Yes     | Yes                | Partial (`backfill`) | Partial       | Yes (experimental) | No           | No      |
| Auto-highlight first                        | Yes                           | Yes     | Yes     | Yes                | Yes                  | Yes           | Partial            | Yes          | Unconf. |
| Commit on blur                              | Unconf.                       | Yes     | No      | Yes (`autoSelect`) | No                   | Yes (default) | Yes                | No (reverts) | Unconf. |
| Open on focus / click                       | Base UI                       | Yes     | Yes     | Yes                | Yes                  | Yes           | Yes                | Yes          | Yes     |
| Manual-only open                            | Unconf.                       | Yes     | Partial | No                 | No                   | No            | No                 | Yes          | No      |
| Revert / clear on blur                      | Base UI                       | Unconf. | Unconf. | Yes                | Partial              | No            | Unconf.            | Yes          | Unconf. |
| `selectOnFocus`                             | No                            | No      | No      | Yes                | No                   | No            | No                 | No           | No      |
| `blurOnSelect` (touch)                      | No                            | No      | No      | Yes                | No                   | No            | No                 | No           | No      |
| `clearOnEscape`                             | Unconf.                       | No      | No      | Yes                | No                   | No            | No                 | Unconf.      | No      |
| Keep open after select                      | Partial                       | Yes     | Yes     | Yes                | Partial              | No            | Yes                | Unconf.      | Yes     |
| Input after select (replace/clear/preserve) | Unconf.                       | No      | Yes     | No                 | Yes                  | No            | No                 | No           | No      |
| Loop focus                                  | Base UI                       | Yes     | Yes     | Yes                | Unconf.              | Unconf.       | Unconf.            | Yes          | Yes     |

### Async and performance

| Feature              | shad                  | Man     | Chak              | MUI | Ant            | GOV         | Carb    | RA  | Prim |
| -------------------- | --------------------- | ------- | ----------------- | --- | -------------- | ----------- | ------- | --- | ---- |
| Async search         | Base UI examples      | Yes     | Yes               | Yes | Yes            | Yes         | Unconf. | Yes | Yes  |
| Loading state        | No                    | Yes     | Yes (`aria-busy`) | Yes | Yes            | No          | No      | Yes | Yes  |
| Error state in popup | No                    | No      | No                | No  | No             | No          | No      | No  | Yes  |
| Load more / infinite | No                    | Unconf. | Unconf.           | Yes | Partial        | No          | No      | Yes | No   |
| Debounce built in    | No                    | No      | No                | No  | No             | Status only | No      | No  | No   |
| Virtualization       | Base UI `virtualized` | Yes     | Yes               | Yes | Yes (built in) | No          | No      | Yes | Yes  |

### Options and content

| Feature                           | shad           | Man                   | Chak    | MUI             | Ant     | GOV | Carb    | RA      | Prim    |
| --------------------------------- | -------------- | --------------------- | ------- | --------------- | ------- | --- | ------- | ------- | ------- |
| Groups with headers               | Yes            | Yes (hide when empty) | Yes     | Yes (`groupBy`) | Yes     | No  | No      | Yes     | Yes     |
| Sticky group headers              | Unconf.        | Unconf.               | Unconf. | Unconf.         | Unconf. | No  | No      | Unconf. | Unconf. |
| Separators                        | Yes            | Unconf.               | Unconf. | No              | No      | No  | No      | No      | Yes     |
| Disabled options                  | Yes            | Yes                   | Yes     | Yes             | Yes     | No  | Unconf. | Yes     | Yes     |
| Description / icon / rich content | Yes            | Yes                   | Yes     | Yes             | Yes     | Yes | Yes     | Yes     | Yes     |
| Check position (start / end)      | Unconf.        | Yes                   | Unconf. | Partial         | Yes     | No  | Partial | Unconf. | Unconf. |
| Empty state                       | Yes            | Yes                   | Yes     | Yes             | Yes     | Yes | Unconf. | Yes     | Yes     |
| Options as links                  | No             | No                    | Yes     | No              | No      | No  | No      | Unconf. | No      |
| 2-D grid of options               | Base UI `grid` | No                    | No      | No              | No      | No  | No      | No      | No      |

### Field chrome

| Feature         | shad    | Man            | Chak                   | MUI                      | Ant                                   | GOV      | Carb                 | RA       | Prim    |
| --------------- | ------- | -------------- | ---------------------- | ------------------------ | ------------------------------------- | -------- | -------------------- | -------- | ------- |
| Clear button    | Yes     | Yes            | Yes                    | Yes                      | Yes                                   | No       | Yes                  | Unconf.  | Yes     |
| Dropdown toggle | Yes     | Yes            | Yes                    | Yes                      | Yes                                   | Yes      | Yes                  | Yes      | Unconf. |
| Read-only       | Unconf. | Yes            | Yes                    | Yes                      | No                                    | No       | Yes                  | Unconf.  | Unconf. |
| Disabled        | Yes     | Yes            | Yes                    | Yes                      | Yes                                   | No       | Yes                  | Yes      | Yes     |
| Required        | Unconf. | Unconf.        | Yes                    | Unconf.                  | No                                    | Yes      | Unconf.              | Yes      | Unconf. |
| Invalid         | Yes     | Yes            | Yes                    | Yes                      | Yes                                   | Consumer | Yes                  | Yes      | Yes     |
| Valid / success | No      | Yes            | No                     | No                       | No                                    | No       | No                   | Yes (v3) | Unconf. |
| Warning         | No      | No             | No                     | No                       | Yes                                   | No       | Yes                  | No       | Yes     |
| Helper text     | Field   | Yes            | Yes                    | Yes                      | Form.Item                             | Hint     | Yes                  | Yes      | Yes     |
| Sizes           | Unconf. | xs–xl          | xs–lg                  | sm/md                    | sm/md/lg                              | No       | xs–lg                | Unconf.  | Yes     |
| Variants        | No      | default/filled | outline/subtle/flushed | outlined/filled/standard | outlined/filled/borderless/underlined | No       | default/inline/fluid | quiet    | No      |
| Start icon      | Yes     | Yes            | Yes                    | Yes                      | Yes                                   | No       | No                   | Unconf.  | Yes     |

### Popup

| Feature                      | shad             | Man                        | Chak    | MUI | Ant                 | GOV                          | Carb | RA  | Prim    |
| ---------------------------- | ---------------- | -------------------------- | ------- | --- | ------------------- | ---------------------------- | ---- | --- | ------- |
| Matches input width          | Yes              | Yes                        | Unconf. | Yes | Yes                 | Yes                          | Yes  | Yes | Yes     |
| Max height + scroll          | Yes              | Yes                        | Yes     | Yes | Yes                 | CSS                          | Yes  | Yes | Yes     |
| Placement / flip             | Yes              | Yes                        | Yes     | Yes | Yes                 | No                           | Yes  | Yes | Unconf. |
| Header / footer slots        | Partial          | Yes                        | No      | No  | Yes (`popupRender`) | No                           | No   | No  | Yes     |
| Inline list (no overlay)     | Base UI `inline` | No                         | No      | No  | No                  | Yes (`displayMenu="inline"`) | No   | No  | No      |
| Full-screen / tray on mobile | No               | Partial (`floatingHeight`) | No      | No  | No                  | No                           | No   | Yes | Yes     |

### Forms and i18n

| Feature               | shad          | Man | Chak    | MUI | Ant     | GOV | Carb    | RA  | Prim    |
| --------------------- | ------------- | --- | ------- | --- | ------- | --- | ------- | --- | ------- |
| `name` / hidden input | Base UI       | Yes | Yes     | No  | No      | Yes | Unconf. | Yes | Unconf. |
| Native validation     | Unconf.       | No  | Unconf. | No  | No      | Yes | No      | Yes | No      |
| Field integration     | Base UI Field | Yes | Yes     | Yes | Yes     | N/A | Yes     | Yes | Yes     |
| Enhance a `<select>`  | No            | No  | No      | No  | No      | Yes | No      | No  | No      |
| Replaceable strings   | Partial       | Yes | Yes     | Yes | Partial | Yes | Yes     | Yes | Partial |

## Easy to miss (only 1–2 libraries, still in scope)

- **Error state inside the popup** with a retry (Primer `message`).
- **Selected sorted to the top after close**, not while open, so the list doesn't move under the pointer (Primer `sortOnCloseFn`, Carbon `top-after-reopen`).
- **Select all** with indeterminate state, and a **selected-count** tag that clears all (Carbon, Primer).
- **Chip overflow "+N more"**, including Ant's `"responsive"` mode that fits as many as the width allows (MUI, Ant).
- **Fixed chips** that can't be removed (MUI).
- **Chip reorder** by drag or keyboard (Mantine).
- **Max selections** (Mantine `maxValues`, Ant `maxCount`).
- **Hide picked options** (Mantine).
- **Tags entry** with delimiters, paste split and duplicate control (Mantine TagsInput, Chakra TagsInput, Ant `mode="tags"`).
- **Minimum characters before searching**, with a status message (GOV.UK `minLength`, Chakra `openOnChange`).
- **Match highlighting** (Chakra `Highlight`, MUI demo).
- **Inline completion** (MUI `autoComplete`, Chakra `inputBehavior`, Carbon `typeahead`).
- **Commit on blur** (GOV.UK `confirmOnBlur`, MUI `autoSelect`, Mantine `autoSelectOnBlur`).
- **`blurOnSelect="touch"`** to dismiss the on-screen keyboard (MUI). **`clearOnEscape`** (MUI).
- **Check position start or end** (Mantine `checkIconPosition`).
- **Header / footer in the popup**, including an apply/cancel footer (Mantine, Ant, Primer SelectPanel).
- **Inline list without an overlay** (GOV.UK `displayMenu="inline"`, Base UI `inline`).
- **Full-screen on narrow screens** (Primer SelectPanel, Spectrum tray).
- **Warning state** (Carbon `warn`, Ant `status="warning"`, Primer).
- **Success state** (Mantine, Spectrum v3).
- **Options as links** (Chakra).
- **Replaceable strings** for every built-in message (Chakra `translations`, GOV.UK `t*`).
- **Progressive enhancement from `<select>`** (GOV.UK only).

## Accessibility guidance

- **Pattern:** WAI-ARIA 1.2 combobox with `aria-activedescendant`; DOM focus stays in the input (MUI, Ark, GOV.UK, React Aria, Primer). Base UI does this.
- **Keyboard:** ↑/↓ open and move, Home/End, Enter selects, Escape closes (Ark). Multi stays open while selecting (Carbon).
- **Blur and Tab vary:** GOV.UK and MUI `autoSelect` commit the highlighted option; React Aria reverts unless custom values are allowed. We need one documented default.
- **Result-count announcements (GOV.UK):** polite status, debounced 1400 ms, silent when the input isn't focused or a choice was just made. Messages: "N results are available", "No search results", "Type in N or more characters for results". Ark also announces counts and holds "No results" while loading.
- **Chip removal must be discoverable:** `aria-description` on the input and chips (MUI); a hidden "press Delete or Backspace to clear" hint (Carbon).
- **A label is required.** It can be visually hidden but must exist (Primer, React Aria, Carbon). Don't rely on placeholder (GOV.UK).
- **GDS audit (2018):** long options that wrap were read as two by magnifier users; Dragon users couldn't "click" an option; alternative names and synonyms matter ("in" matched Papua New Guinea).
- **When not to use (GOV.UK, Home Office):** if users don't know what they're looking for, use structured questions; for a few multiple choices use checkboxes; don't use it to filter tables.
- **Mobile:** Spectrum swaps to a tray; Primer goes full-screen; MUI `blurOnSelect="touch"` hides the keyboard after choosing.
- **Forced colours:** check custom option templates in Windows High Contrast (GOV.UK). The highlighted row must stay visible there.
- **Contrast:** the highlighted and selected rows need 3:1 against the popup surface (WCAG 1.4.11).

## Sources

- shadcn: https://ui.shadcn.com/docs/components/combobox
- Base UI: https://base-ui.com/react/components/combobox, https://base-ui.com/react/components/autocomplete (v1.9 docs in node_modules)
- Mantine: https://mantine.dev/core/combobox/, /core/multi-select/, /core/tags-input/, /core/autocomplete/
- Chakra / Ark: https://chakra-ui.com/docs/components/combobox, https://chakra-ui.com/docs/components/tags-input, https://ark-ui.com/docs/components/combobox
- MUI: https://mui.com/material-ui/react-autocomplete/, https://mui.com/material-ui/api/autocomplete/
- Ant: https://ant.design/components/select, https://ant.design/components/auto-complete
- GOV.UK: https://github.com/alphagov/accessible-autocomplete (incl. `src/status.js`), https://design-system.service.gov.uk/components/select/, https://accessibility.blog.gov.uk/2018/05/15/what-we-learned-from-getting-our-autocomplete-tested-for-accessibility, https://design.homeoffice.gov.uk/design-system/patterns/help-users-to/long-lists
- Carbon: https://carbondesignsystem.com/components/dropdown/usage/, ComboBox.tsx and FilterableMultiSelect.tsx source (the ComboBox usage page returned 404)
- Spectrum / React Aria: https://react-aria.adobe.com/ComboBox, /Autocomplete, /ListBox, /Virtualizer, https://react-spectrum.adobe.com/react-spectrum/ComboBox.html
- Primer: https://primer.style/product/components/autocomplete/, /autocomplete/guidelines/, /select-panel/

## Decisions (George, 2026-11-16)

Everything in the matrix is in scope, with these exceptions:

- **Variants** (Mantine, Chakra, MUI, Ant, Carbon, Spectrum) are left out for now. They follow GEO-956, so every input gets them together.
- **Building from a `<select>`** (GOV.UK) is rejected. The reasons are in LOG.md.
- **Warning** uses the `--sp-warning` token from #44. No new tokens are added here.
- **Sizes** line up with GEO-954 (Input sizes).

The full list of decisions is in LOG.md.

## Gaps

- Carbon's ComboBox usage page was a 404, so its details come from source and the Dropdown usage page.
- Sticky group headers weren't confirmed for any library.
- Backspace-removes-last-chip is confirmed in Mantine docs and Base UI; others are likely but unconfirmed.
