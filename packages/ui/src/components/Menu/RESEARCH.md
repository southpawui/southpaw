# Menu — Competitive Research

Researched: 2026-11-08 (thin first pass). Redone 2026-11-13 across all 9 libraries (GEO-925).

The previous version covered 6 libraries and 8 features, and was written before the "research all 9" rule. This version replaces it.

## Who has what

| Library               | Component(s)                                              | Distinctive features                                                                                                                                                                |
| --------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| shadcn                | DropdownMenu (+ Sub, Shortcut, Checkbox/Radio)            | Thin layer over Base UI. `variant="destructive"`, `inset` to align labels, shortcut as a `<span>`, submenu chevron flips in RTL.                                                    |
| Mantine               | Menu, Menu.Sub, Menu.Search, Checkbox/Radio groups        | Built-in search, `trigger="click-hover"`, `alignItemsLabels`, `safeAreaPolygon` for submenus, `closeOnItemClick` per item.                                                          |
| Chakra v3             | Menu.* (ItemCommand, TriggerItem, ItemIndicator)          | Several triggers can share one menu, `anchorPoint`, `hideWhenDetached`, `sm`/`md` sizes, `subtle`/`solid` + colour palette, router `navigate`.                                      |
| MUI                   | Menu / MenuItem / MenuList (+ Menubar `hint`)             | `dense`, `disabledItemsFocusable`, `selectedMenu` focuses the selected item, `onClose` reason, secondary text. No nested menus in core.                                             |
| Ant                   | Dropdown + Menu, Dropdown.Button (deprecated in v6)       | Opens on hover by default, `extra` slot for shortcuts, `danger`, dashed dividers, `expandIcon`, submenu delays, `popupRender` header/footer.                                        |
| GOV.UK                | None                                                      | No menu component. Guidance prefers button groups and simpler pages. MOJ (GOV.UK family) Button menu: never use it for navigation, avoid vague titles like "Actions".               |
| Carbon                | Menu, MenuButton, ComboButton, OverflowMenu               | Sizes xs–lg matched to trigger height, width 160–288px, `dangerDescription` (screen-reader text), item-count guidance, shortcuts mirror in RTL, disabled items stay focusable.      |
| Spectrum / React Aria | Menu, MenuTrigger, SubmenuTrigger, Keyboard, Autocomplete | `label`/`description`/`value` slots, `<kbd dir="ltr">` shortcuts, filtering, `renderEmptyState`, load-more items, virtualization, unavailable items that open help, sizes S–XL.     |
| Primer                | ActionMenu over ActionList                                | `inactiveText` (focusable, explains why), loading items, inline/block descriptions, group `auxiliaryText`, LinkItem, platform-aware `Mod` shortcuts, `active` item, `showDividers`. |

## Feature matrix

Cells are Yes / No / Partial / Unconf. GOV.UK has no menu component, so it is N/A in every row and left out.

| Feature                                   | shadcn         | Mantine | Chakra      | MUI       | Ant              | Carbon            | Spectrum              | Primer                 | Ours (now)          |
| ----------------------------------------- | -------------- | ------- | ----------- | --------- | ---------------- | ----------------- | --------------------- | ---------------------- | ------------------- |
| Leading icon                              | Yes            | Yes     | Yes         | Yes       | Yes              | Yes               | Yes                   | Yes                    | No                  |
| Trailing slot (badge, etc.)               | Shortcut only  | Yes     | Partial     | Yes       | Yes              | Shortcut only     | Yes                   | Yes                    | No                  |
| Description / secondary text              | No             | No      | No          | Yes       | No               | No                | Yes                   | Yes (inline/block)     | No                  |
| Shortcut display                          | `<span>`       | Text    | ItemCommand | `hint`    | `extra`          | `<div>`           | `<kbd>`               | KeybindingHint         | No                  |
| Platform-aware shortcut (⌘/Ctrl)          | No             | No      | No          | No        | No               | No                | No                    | Yes                    | No                  |
| `aria-keyshortcuts`                       | No             | No      | Unconf.     | Unconf.   | No               | No                | No                    | Unconf.                | No                  |
| Danger item                               | Yes            | Yes     | Yes         | No        | Yes              | Yes (+ SR text)   | No                    | Yes                    | No                  |
| Disabled item                             | Yes            | Yes     | Yes         | Yes       | Yes              | Yes (focusable)   | Yes                   | Yes                    | Base UI only        |
| Inactive item with visible reason         | No             | No      | No          | No        | No               | No                | Yes                   | Yes                    | No                  |
| Loading item                              | No             | No      | No          | No        | No               | No                | Yes (load more)       | Yes                    | No                  |
| Link item (+ opens-new-tab icon)          | Base UI        | Yes     | Yes         | Yes       | Partial          | Partial           | Yes (+ link-out icon) | Yes                    | Not exported        |
| Active / current item                     | No             | No      | No          | Yes       | Yes              | No                | No                    | Yes                    | No                  |
| Checkbox items                            | Yes            | Yes     | Yes         | Partial   | Yes              | Yes               | Yes                   | Yes                    | Yes (unstyled)      |
| Radio items                               | Yes            | Yes     | Yes         | Partial   | Yes              | Yes               | Yes                   | Yes                    | Yes (unstyled)      |
| Indicator alignment (`inset`)             | Yes            | Yes     | Partial     | No        | No               | Yes               | Yes                   | Unconf.                | No                  |
| Groups with label                         | Yes            | Yes     | Yes         | Yes       | Yes              | Yes               | Yes (+ description)   | Yes (+ aux text)       | Yes (raw colours)   |
| Separators                                | Yes            | Yes     | Yes         | Yes       | Yes (+ dashed)   | Yes               | Yes                   | Yes (+ `showDividers`) | Yes (raw colours)   |
| Submenus                                  | Yes            | Yes     | Yes         | No (core) | Yes              | Yes               | Yes                   | Yes                    | Not exported        |
| Submenu hover delay / safe area           | Base UI        | Yes     | Unconf.     | N/A       | Yes              | Yes               | Yes                   | Unconf.                | No                  |
| Custom submenu chevron / RTL flip         | RTL flip       | No      | No          | N/A       | `expandIcon`     | Mirrors           | Mirrors               | Unconf.                | No                  |
| Search / filter inside menu               | No             | Yes     | No          | No        | Partial          | No                | Yes                   | No (SelectPanel)       | No                  |
| Empty state                               | No             | No      | No          | No        | No               | No                | Yes                   | No                     | No                  |
| Max height + scroll                       | Unconf.        | Unconf. | Yes         | Yes       | Unconf.          | CSS               | Unconf.               | Unconf.                | No                  |
| Virtualization / async load               | No             | No      | No          | No        | No               | No                | Yes                   | No                     | No                  |
| Icon-only ("kebab") trigger               | Yes            | Yes     | Yes         | Yes       | Yes              | Yes               | Yes                   | Yes                    | No                  |
| Split / combo button                      | No             | No      | No          | No        | Yes (deprecated) | Yes               | No                    | No                     | No                  |
| Open on hover                             | Base UI        | Yes     | No          | No        | Yes (default)    | No                | No                    | No                     | No                  |
| Several triggers share one menu           | Base UI handle | No      | Yes         | Yes       | No               | Yes               | No                    | Yes                    | No                  |
| Close-on-select per item                  | Base UI        | Yes     | Yes         | Manual    | Yes              | Toggles stay open | Yes                   | Yes                    | Base UI only        |
| Loop focus / typeahead                    | Base UI        | Yes     | Yes         | Yes       | Unconf.          | Unconf.           | Yes                   | Yes                    | Base UI only        |
| Placement / offset / flip                 | Yes            | Yes     | Yes         | Yes       | Yes              | Partial           | Yes                   | Yes                    | Base UI only        |
| Match trigger width                       | No             | Unconf. | Unconf.     | No        | No               | Guidance          | No                    | Unconf.                | No                  |
| Min / max width spec                      | No             | No      | No          | No        | FAQ              | 160–288px         | No                    | No                     | `min-w-[8rem]` only |
| Sizes / density                           | No             | No      | sm/md       | `dense`   | No               | xs–lg             | S–XL                  | sm/md/lg               | No                  |
| Colour variants (`solid`)                 | No             | No      | Yes         | No        | Dark theme       | No                | No                    | No                     | No                  |
| Arrow                                     | No             | Yes     | Yes         | No        | Yes              | No                | Hidden by default     | No                     | Unstyled            |
| Animation                                 | CSS            | Yes     | Yes         | Yes       | No               | No                | No                    | No                     | Partial (raw)       |
| Header / footer content in popup          | Free           | Free    | Free        | Free      | `popupRender`    | No                | Yes                   | Unconf.                | Free                |
| Context menu / long-press / open at point | Separate       | Yes     | Yes         | Demo      | Yes              | Yes               | Yes                   | Yes                    | → GEO-926           |

## Easy to miss (only 1–2 libraries, still in scope)

- **Inactive items** that stay focusable and show their reason (Primer `inactiveText`, Spectrum unavailable items).
- **Loading item** (Primer) and **load more** (Spectrum).
- **Platform-aware shortcuts** (Primer). We get this for free from Kbd.
- **Screen-reader text for danger items** (Carbon `dangerDescription`).
- **Active / current item** separate from selection (Primer `active`, MUI `selected`).
- **Group description / auxiliary text** (Spectrum, Primer).
- **Dashed separator** (Ant) and **`showDividers`** between every item (Primer).
- **Opens-new-tab icon on link items** (Spectrum).
- **`click-hover`**: hover on desktop, click on touch (Mantine).
- **Split / combo button** (Carbon, Ant).
- **Size scale tied to the trigger** (Carbon xs–lg, Spectrum, Primer) and **width rules of 160–288px** (Carbon).
- **Empty state** for filtered menus (React Aria).
- **Virtualization** (Spectrum).
- **Colour variant `solid`** (Chakra).

## Accessibility guidance

- **Roles:** `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`. Groups are named by their visible label (Primer, Carbon). Base UI handles all of this.
- **Trigger:** must be a real button with `aria-haspopup="menu"`, `aria-expanded` and `aria-controls` (Mantine). Base UI handles this.
- **Focus:** the first item gets focus on open, and focus returns to the trigger on close. Tab closes the menu (Primer, Carbon).
- **Shortcuts:** none of the checked libraries set `aria-keyshortcuts`, and only React Aria uses `<kbd>`. We should set `aria-keyshortcuts` only when the app has actually wired up the shortcut (Primer: "don't show shortcuts that aren't usable").
- **Inactive items:** keep them focusable, don't use `aria-disabled`, and show the reason as visible text, not a tooltip (Primer).
- **Disabled items:** behaviour varies. React Aria makes them unfocusable, Carbon keeps them focusable, MUI makes it opt-in.
- **Interactive content:** no buttons or inputs inside items (React Aria, Spectrum, Primer).
- **Icons** are decorative; meaning comes from the label (Primer). Don't mix items with and without icons (Primer).
- **Size and nesting:** targets at least 24×24px (Primer). Keep menus to 12 items or fewer and avoid more than one level of nesting (Carbon).
- **Hover-to-open** isn't keyboard or touch friendly on its own (Mantine, Ant), so it must always also open on click and keyboard.
- **Don't use a menu for site navigation** (MOJ Button menu guidance) or for form input; use Select or Combobox instead (Carbon).
- **Use specific trigger labels**, not "Actions" (MOJ).

## Sources

- shadcn: https://ui.shadcn.com/docs/components/dropdown-menu
- Mantine: https://mantine.dev/core/menu/
- Chakra: https://chakra-ui.com/docs/components/menu, https://ark-ui.com/docs/components/menu
- MUI: https://mui.com/material-ui/react-menu/, https://mui.com/material-ui/react-menubar/
- Ant: https://ant.design/components/dropdown, https://ant.design/components/menu
- GOV.UK: https://design-system.service.gov.uk/components/, MOJ https://design-patterns.service.justice.gov.uk/components/button-menu
- Carbon: https://carbondesignsystem.com/components/menu/usage/, https://carbondesignsystem.com/components/menu/accessibility/
- Spectrum / React Aria: https://react-spectrum.adobe.com/Menu, https://react-aria.adobe.com/Menu
- Primer: https://primer.style/product/components/action-menu/, https://primer.style/product/components/action-list/
- WAI-ARIA menu button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
