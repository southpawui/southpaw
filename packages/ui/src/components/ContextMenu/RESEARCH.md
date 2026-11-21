# ContextMenu — Competitive Research

Researched: 2026-11-08 (first pass, 4 libraries). Redone 2026-11-16 across all 9 libraries (GEO-926).

Base UI's `ContextMenu` reuses the Menu parts: `Popup`, `Item`, `LinkItem`, `SubmenuRoot`, `SubmenuTrigger`, `CheckboxItem`, `RadioItem`, `Group`, `GroupLabel`, `Separator`, `Arrow`, `Backdrop` and `Portal` are the same components as `Menu.*`. Only `Root`, `Trigger` and `Positioner` are its own. So item styling, sizes, highlight, dividers, shortcuts and states come from `../Menu/Menu` (GEO-925) and are not repeated here.

Two things changed in 2026 and are verified against the docs:

- **Mantine core now has `Menu.ContextMenu`.** The `mantine-contextmenu` package is third-party.
- **React Aria added `MenuTrigger trigger="contextMenu"` and `useContextMenu`** (v1.20). Before that it declined context menus.

## Who has what

| Library               | API                                                   | Notes                                                                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| shadcn                | ContextMenu (Base UI or Radix)                        | Same parts as DropdownMenu. Demos show long press. No guidance of its own.                                                                                                                                                            |
| Mantine               | `Menu.ContextMenu` (replaces `Menu.Target`)           | Configurable `longPressDelay` (default 500ms). `disabled` restores the native menu. Re-right-click moves the menu. Applies `user-select: none` to the area. Full Menu, including `Menu.Search`.                                       |
| Chakra v3 / Ark       | `Menu.ContextTrigger`                                 | Long press 700ms. One menu can be shared by many triggers; right-clicking another trigger while open moves it there. `positioning.anchorPoint` opens at x/y.                                                                          |
| MUI                   | Recipe only                                           | `onContextMenu` plus `anchorReference="anchorPosition"`. Second right-click closes. Restores the text selection after opening. `cursor: context-menu`.                                                                                |
| Ant                   | `Dropdown trigger={['contextMenu']}`                  | `alignPoint` follows the pointer. `disabled`. Full Menu items (icon, `danger`, `extra` shortcuts, submenus).                                                                                                                          |
| GOV.UK / MOJ          | None                                                  | No context menu. MOJ recommends a visible Button menu instead. GDS: respect users opening links from the browser's own right-click menu.                                                                                              |
| Carbon                | `useContextMenu(trigger = document)` + `Menu x/y`     | Page-wide by default. Right-click only. Guidance: context comes from the selection, 12 items or fewer, avoid deep nesting, hide actions the user can never perform.                                                                   |
| Spectrum / React Aria | `MenuTrigger trigger="contextMenu"`, `useContextMenu` | Right-click and Ctrl+click (mac), **Shift+F10** (Win/Linux), **Ctrl+Enter** (mac), VoiceOver's command, iOS long press. Inner trigger wins. Target made focusable (`tabIndex={0}`). No `aria-haspopup`/`aria-expanded` on the target. |
| Primer                | `ActionMenu` story only                               | Opened by right-clicking a list row, anchored to the row (not the pointer). The same menu also opens on left-click.                                                                                                                   |

## Feature matrix

| Feature                                              | shadcn / Base UI                 | Mantine  | Chakra      | MUI         | Ant     | GOV.UK          | Carbon      | Spectrum / RA     | Primer            | Ours (now)        |
| ---------------------------------------------------- | -------------------------------- | -------- | ----------- | ----------- | ------- | --------------- | ----------- | ----------------- | ----------------- | ----------------- |
| Dedicated component                                  | Yes                              | Yes      | Yes         | No          | Partial | No              | Partial     | Yes               | No                | Yes (raw colours) |
| Right-click at pointer                               | Yes                              | Yes      | Yes         | Yes         | Yes     | N/A             | Yes         | Yes               | No (row)          | Yes               |
| Long press (touch)                                   | Yes (500ms, fixed)               | Yes      | Yes (700ms) | No          | Unconf. | N/A             | No          | Yes               | No                | Yes (Base UI)     |
| Configurable long-press delay                        | No                               | Yes      | No          | N/A         | N/A     | N/A             | N/A         | Unconf.           | N/A               | No                |
| Keyboard open (Shift+F10, Menu key, Ctrl+Enter)      | Native event only                | Unconf.  | Native only | Native only | Unconf. | N/A             | Native only | **Yes, explicit** | Enter on a button | Untested          |
| Focusable trigger area                               | No                               | Unconf.  | Unconf.     | No          | No      | N/A             | No          | Yes               | Yes (row)         | No                |
| Open at x/y or anchor to an element                  | Yes (`anchor`)                   | Unconf.  | Yes         | Yes         | No      | N/A             | Yes         | Unconf.           | Yes (element)     | Not exposed       |
| Re-right-click repositions                           | Yes                              | Yes      | Yes         | No (closes) | Unconf. | N/A             | Yes         | Unconf.           | No                | Yes (Base UI)     |
| Disabled (native menu returns)                       | Yes                              | Yes      | Unconf.     | No          | Yes     | N/A             | No          | Unconf.           | No                | Base UI only      |
| Nested triggers (inner wins)                         | Yes                              | Unconf.  | Unconf.     | No          | Unconf. | N/A             | No          | Yes               | No                | Base UI only      |
| Page-wide menu                                       | Free                             | Free     | Free        | Free        | Free    | N/A             | Default     | Free              | No                | Free              |
| One menu for many targets                            | Free (one trigger around a list) | No       | Yes         | No          | No      | N/A             | No          | No                | No                | No                |
| Same menu also opens from a button                   | Manual                           | Manual   | Manual      | Manual      | Manual  | MOJ Button menu | Manual      | Manual            | Yes               | No                |
| Icons, shortcuts, submenus, checkbox, radio, danger  | Yes                              | Mostly   | Yes         | Partial     | Yes     | N/A             | Yes         | Yes               | Partial           | Unstyled          |
| Filter / search in menu                              | No                               | Yes      | No          | No          | No      | N/A             | No          | Unconf.           | No                | No                |
| Trigger open-state attribute                         | Yes                              | Unconf.  | Yes         | No          | Unconf. | N/A             | No          | Unconf.           | No                | Yes (Base UI)     |
| `user-select: none` / `cursor: context-menu` on area | No                               | Yes / No | No          | No / Yes    | No      | N/A             | No          | No                | No                | No                |
| Backdrop                                             | Yes                              | No       | No          | Yes         | No      | N/A             | No          | Unconf.           | No                | Not exported      |
| Focus returns on close                               | Yes                              | Unconf.  | Yes         | Yes         | Unconf. | N/A             | Yes         | Yes               | Yes               | Base UI           |
| Written a11y guidance                                | Yes                              | No       | No          | No          | No      | No              | Partial     | Yes (in code)     | No                | No                |

## Easy to miss (only 1–2 libraries, still in scope)

- **Explicit keyboard opening:** Shift+F10, the Menu key, Ctrl+Enter on macOS, VoiceOver (React Aria). Everyone else relies on the browser's `contextmenu` event on a focused element, and Base UI's trigger is a `<div>` that can't take focus.
- **Configurable long-press delay** (Mantine). Base UI hard-codes 500ms.
- **One menu shared by many targets**, knowing which target opened it (Chakra).
- **The same menu also opens from a visible button** (Primer). This doubles as the accessible alternative.
- **`user-select: none`** (Mantine) and **`cursor: context-menu`** (MUI) on the area.
- **Restoring the text selection after opening** (MUI).
- **Filtering inside the menu** (Mantine `Menu.Search`).
- **Page-wide context menu** (Carbon defaults to `document`).
- **Release on press** (Base UI): right-click, drag to an item, release.

## Long-press timing (George asked for Emil Kowalski's guidance)

- **Emil's articles** ("You Don't Need Animations", "7 Practical Animation Tips", "The Magic of Clip Path"; emilkowal.ski, checked 2026-11-16) give no long-press duration. They say to give feedback as soon as possible, keep UI animations under 300ms, and not animate keyboard-initiated or frequent actions.
- **Vaul:** `LONG_HANDLE_PRESS_TIMEOUT = 250` (github.com/emilkowalski/vaul `src/index.tsx`) tells a tap from a hold on the drawer handle. It is not an open delay. The touch movement threshold of 10px (`swipeStartThreshold`) matches Base UI's 10px long-press cancel.
- **Sonner:** has no hold timing (`SWIPE_THRESHOLD = 45` px).
- **Base UI:** `LONG_PRESS_DELAY = 500`, fixed (`context-menu/trigger/ContextMenuTrigger.js`). Mantine also defaults to 500ms; Radix and Ark use 700ms.
- **Chosen: 500ms**, Base UI's own handling. Base UI exposes no way to change it.

## Accessibility guidance

- **The same actions must also be available elsewhere** (Base UI: "use context menus as an enhancement; provide visible controls for the same actions"). Touch, keyboard and screen reader users may never find a right-click menu. MOJ only offers a visible button menu.
- **Keyboard:** the area must be focusable, and Shift+F10, the Menu key and (on macOS) Ctrl+Enter should open the menu at the focused element, not at the 0,0 corner (React Aria).
- **Trigger semantics:** no `aria-haspopup`/`aria-expanded` on the area, because it doesn't open on activation (React Aria, w3c/aria#1971). Base UI's trigger already omits them (checked in source).
- **Touch:** iOS Safari never fires `contextmenu`, so long press is needed. Base UI cancels it after 10px of movement and turns off the iOS callout.
- **Focus:** the first item gets focus on open, and focus returns to where it was on close.
- **Content:** 12 items or fewer, shallow nesting, hide actions the user can never perform (Carbon). No interactive elements inside items (React Aria).

## Sources

- shadcn: https://ui.shadcn.com/docs/components/base/context-menu
- Base UI: https://base-ui.com/react/components/context-menu, `@base-ui/react@1.9.0` `context-menu/trigger/ContextMenuTrigger.js`
- Mantine: https://mantine.dev/core/menu/ (`Menu.ContextMenu`, verified 2026-11-16)
- Chakra: https://chakra-ui.com/docs/components/menu (`Menu.ContextTrigger`), Zag `menu.machine.ts`
- MUI: https://mui.com/material-ui/react-menu/ (Context menu demo)
- Ant: https://ant.design/components/dropdown
- GOV.UK: https://design-system.service.gov.uk/components/; MOJ https://design-patterns.service.justice.gov.uk/components/button-menu
- Carbon: https://carbondesignsystem.com/components/menu/usage/, `@carbon/react` `useContextMenu.tsx`
- React Aria: https://react-aria.adobe.com/Menu, https://react-aria.adobe.com/useContextMenu (verified 2026-11-16)
- Primer: https://primer.style/product/components/action-menu (ContextMenu story)
