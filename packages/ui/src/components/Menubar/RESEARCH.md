# Menubar — Competitive Research

Researched: 2026-11-08 (first pass, 4 libraries). Redone 2026-11-16 across all 9 libraries (GEO-927).

Base UI's `Menubar` is only the bar. It renders `role="menubar"` with roving focus, `aria-orientation` and Home/End. Each menu in it is an ordinary `Menu.Root` / `Menu.Trigger` / `Menu.Popup`. Triggers become `role="menuitem"` with `aria-haspopup="menu"`, and once one menu is open, hovering or focusing another trigger switches to it.

So items, shortcuts (Kbd), submenus, checkbox/radio, danger, groups, sizes, highlight styles, the accent bar and the keyboard-open handling all come from Menu (GEO-925/926). This research covers what is specific to the bar.

Base UI props: `orientation` (horizontal), `loopFocus` (true), `modal` (true), `disabled` (whole bar). Data attributes: `data-orientation`, `data-modal`, `data-has-submenu-open`.

## Who has what

| Library               | Menubar?                                                                       | Notes                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| shadcn                | Yes (Radix and Base UI variants)                                               | `MenubarShortcut`, `inset`, `variant="destructive"`, RTL demo. The trigger gets an accent fill while open.                               |
| Mantine               | **Yes, new** (`Menubar`, `.Menu`, `.Target`, `.Dropdown`; verified 2026-11-16) | `trigger="click"                                                                                                                         | "hover"`, `loop`, controlled `openIndex`/`onOpenChange(index | null)`. **Top-level typeahead**, **ArrowUp opens at the last item**, Home/End, RTL-aware arrows. Horizontal only; disabled targets are skipped. |
| Chakra / Ark          | No (stable); Ark v6 / Zag `@zag-js/menubar` pre-release                        | Pre-release: `orientation`, `loopFocus`, `disabled`, typeahead, `data-has-open-menu`.                                                    |
| MUI                   | Copy-paste demos on Base UI                                                    | `hint` shortcut on items, submenu, checkbox and radio rows; `icon`; `secondary` description; vertical styles. No accessibility guidance. |
| Ant                   | No (horizontal `Menu` is navigation, `role="menu"`)                            | Overflow collapses into an ellipsis submenu; selected/current underline; opens on hover by default.                                      |
| GOV.UK / MOJ          | No                                                                             | Service navigation (flat links, `aria-current`, mobile "Menu" toggle). MOJ: using a button menu for navigation is a WCAG failure.        |
| Carbon                | No (UI Shell `HeaderMenu` is a disclosure inside `<nav>`)                      | Collapses to a hamburger panel at narrow widths. `MenuItem shortcut` "only renders a hint".                                              |
| Spectrum / React Aria | No                                                                             | APG menubar keyboard model described in an internal spec only. "…" on items that open dialogs.                                           |
| Primer                | No                                                                             | ActionMenu, ActionBar (toolbar), KeybindingHint.                                                                                         |

## Feature matrix

| Feature                                                    | shadcn / Base UI              | Mantine  | Ark (pre-release) | MUI           | Ant           | GOV.UK        | Carbon    | Spectrum    | Primer      | Ours (now)    |
| ---------------------------------------------------------- | ----------------------------- | -------- | ----------------- | ------------- | ------------- | ------------- | --------- | ----------- | ----------- | ------------- |
| `role="menubar"`, menuitem triggers                        | Yes                           | Yes      | Yes               | Yes           | No            | N/A           | No        | N/A         | N/A         | Yes (Base UI) |
| Left/Right, Home/End, roving focus                         | Yes                           | Yes      | Yes               | Yes           | Yes           | N/A           | Unconf.   | N/A         | N/A         | Yes (Base UI) |
| Hover switches once a menu is open                         | Yes                           | Yes      | Yes               | Yes           | Partial       | N/A           | Unconf.   | N/A         | N/A         | Yes (Base UI) |
| Open on hover from cold                                    | Per trigger                   | Yes      | Unconf.           | Unconf.       | Yes           | N/A           | No        | N/A         | N/A         | Not shown     |
| Top-level typeahead                                        | No                            | Yes      | Yes               | No            | Unconf.       | N/A           | Unconf.   | N/A         | N/A         | No            |
| ArrowUp opens at last item                                 | Unconf.                       | Yes      | Unconf.           | Unconf.       | No            | N/A           | Unconf.   | N/A         | N/A         | Untested      |
| Loop focus                                                 | Yes                           | Yes      | Yes               | Yes           | Unconf.       | N/A           | No        | N/A         | N/A         | Not exposed   |
| Vertical orientation                                       | Yes                           | No       | Yes               | Yes           | Yes           | N/A           | No        | N/A         | N/A         | Not styled    |
| Disable whole bar / one menu                               | Yes / Yes                     | No / Yes | Yes / Unconf.     | Yes / Unconf. | Unconf. / Yes | N/A           | No        | N/A         | N/A         | Not shown     |
| Modal / non-modal                                          | Yes                           | Unconf.  | Unconf.           | Yes           | No            | N/A           | No        | N/A         | N/A         | Not shown     |
| Controlled open menu                                       | Per menu                      | By index | Unconf.           | Per menu      | `openKeys`    | N/A           | No        | N/A         | N/A         | Per menu      |
| Open-trigger styling hook                                  | Yes                           | Yes      | Yes               | Yes           | Yes           | N/A           | Yes       | N/A         | N/A         | Raw colours   |
| Bar-level "a menu is open" hook                            | Yes (`data-has-submenu-open`) | No       | Yes               | No            | No            | N/A           | No        | N/A         | N/A         | Not used      |
| Current/selected top-level item                            | No                            | No       | No                | No            | Yes           | Yes           | Yes       | N/A         | N/A         | No            |
| Icons, shortcuts, submenus, checkbox/radio, danger, groups | Yes                           | Mostly   | Yes               | Mostly        | Partial       | N/A           | Yes       | Yes         | Yes         | From Menu     |
| Item description, inset                                    | Inset                         | No       | No                | Description   | No            | N/A           | No        | Description | Description | From Menu     |
| RTL                                                        | Yes                           | Yes      | Yes               | Unconf.       | Yes           | N/A           | Unconf.   | Yes         | Unconf.     | Base UI       |
| Overflow on narrow screens                                 | No                            | No       | No                | No            | Ellipsis menu | Mobile toggle | Hamburger | N/A         | N/A         | No            |
| Accessibility guidance                                     | Partial                       | Yes      | Partial           | No            | No            | Yes           | Partial   | Spec        | Menu only   | No            |

## Easy to miss (only 1–2 libraries, still in scope)

- **Top-level typeahead:** typing "E" focuses "Edit" (Mantine, Ark pre-release). Base UI doesn't have it.
- **ArrowUp opens the menu at its last item:** Mantine; optional in APG.
- **Controlled open by index** (Mantine `openIndex`).
- **Bar-level "a menu is open" hook** (Base UI `data-has-submenu-open`, Zag `data-has-open-menu`), for styling the whole bar while active.
- **Disable the whole bar** (Base UI, Zag) and **non-modal** (Base UI).
- **Open on hover from cold** (Mantine `trigger="hover"`; Ant default).
- **Overflow on narrow screens:** Ant's ellipsis "more" menu, Carbon's hamburger, GOV.UK's mobile toggle.
- **Current/selected top-level item** (Ant, Carbon, GOV.UK). These are all navigation patterns; see question 4.
- **"…" on items that open a dialog** (Spectrum accessibility spec).
- **Shortcuts are hints only;** the app must bind them (Carbon, Primer). Ours: `shortcutActive` sets `aria-keyshortcuts` (Menu).

## Decisions (George, 2026-11-16)

- **Built:** top-level typeahead, and ArrowUp opens at the last item (Base UI lacks both).
- **Story patterns:** narrow screens (collapse into one "Menu" button), and controlled open through each menu's `open`.
- **Rejected:** a current-item style on the bar. It belongs to navigation bars, which NavigationMenu covers.

## Accessibility guidance

- **APG menubar:**
  - `role="menubar"` with an accessible name (`aria-label`/`aria-labelledby`) and `aria-orientation`.
  - Triggers are `menuitem` with `aria-haspopup="menu"` and `aria-expanded`.
  - One tab stop with roving focus. Tab leaves the bar and closes any open menu.
  - Left/Right move between triggers; Down/Enter/Space open; Up optionally opens at the last item.
  - Home/End, optional typeahead, Escape returns to the trigger.
  - Inside a menu, Left/Right move to the neighbouring menubar menu.
- **Don't use a menubar for site navigation.** It is for application commands (File, Edit, View). Use links in `<nav>` instead (APG, GOV.UK, MOJ, Carbon's header disclosure). Ant's horizontal `role="menu"` navigation is a known anti-pattern.
- **Name the bar.** Base UI doesn't name it; the consumer must pass `aria-label`.
- **Shortcut hints are visual only;** they are never the only way to an action.
- **Hover-only opening is inaccessible:** hover mode must still open on click and keyboard.

## Sources

- shadcn: https://ui.shadcn.com/docs/components/menubar
- Base UI: https://base-ui.com/react/components/menubar, `@base-ui/react@1.9.0` `menubar/Menubar.js`
- Mantine: https://mantine.dev/core/menubar/ (verified 2026-11-16)
- Ark / Zag: https://ark-ui.com/docs/components/menu, https://newreleases.io/project/github/chakra-ui/zag/release/@zag-js%2Fmenubar@2.0.0-next.1
- MUI: https://mui.com/material-ui/react-menubar/
- Ant: https://ant.design/components/menu
- GOV.UK: https://design-system.service.gov.uk/components/service-navigation/; MOJ https://design-patterns.service.justice.gov.uk/components/button-menu/
- Carbon: https://carbondesignsystem.com/components/UI-shell-header/usage/
- React Aria: https://react-aria.adobe.com/Menu
- Primer: https://primer.style/product/components/action-menu/
- APG: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
