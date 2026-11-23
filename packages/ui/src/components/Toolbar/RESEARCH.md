# Toolbar — Competitive Research

Researched: 2026-11-21 (GEO-928, all 9 libraries plus the WAI-ARIA APG). This replaces the 2026-11-08 notes, which covered 5 libraries, Radix and MUI.

## Primitive — Base UI 1.9 Toolbar (docs and installed source)

- **Root** (`role="toolbar"`, `aria-orientation`): `orientation` (default horizontal), `loopFocus` (default true), `disabled` (cascades). Data attributes: `data-orientation`, `data-disabled`.
- **Button:** `disabled`, `focusableWhenDisabled` (default **true**), `nativeButton`. Data attributes: `data-disabled`, `data-focusable`.
- **Link**, **Input** (`focusableWhenDisabled`), **Group** (`role="group"`, `disabled` cascades), **Separator** (perpendicular to the toolbar by default).
- **Focus model:** roving tabindex, remembers the last focused item, and flips for RTL. In a horizontal toolbar only Left/Right navigate; Up/Down are left alone, so spin buttons keep working.
- **No Home/End in 1.9:** `ToolbarRoot` doesn't pass `enableHomeAndEndKeys` to CompositeRoot, and the composite defaults it to false. Verified in `node_modules`.
- **`Toolbar.Input` is caret-aware:** arrow keys leave the input only when the caret is at the start or end of the text, nothing is selected, and Shift isn't held.
- **Composition through `render`:**
  - Menu: `<Toolbar.Button render={<Menu.Trigger/>}/>`.
  - Select trigger, the same way.
  - Toggle: `<ToggleGroup><Toolbar.Button render={<Toggle/>}/></ToggleGroup>`. ToggleGroup uses the toolbar's composite.
  - NumberField: `<Toolbar.Input render={<NumberField.Input/>}/>`.
  - Tooltip: `<Tooltip.Trigger render={<Toolbar.Button/>}/>`.

## Feature comparison

| Feature                       | shadcn             | Mantine                       | Chakra v3           | MUI                                                    | Ant            | GOV.UK                 | Carbon                                            | Spectrum / RAC                                   | Primer                              | Base UI            |
| ----------------------------- | ------------------ | ----------------------------- | ------------------- | ------------------------------------------------------ | -------------- | ---------------------- | ------------------------------------------------- | ------------------------------------------------ | ----------------------------------- | ------------------ |
| `role=toolbar` component      | No (ButtonGroup)   | `Toolbar` (9.8)               | No                  | X DataGrid `Toolbar` (Material Toolbar is layout only) | No             | No                     | ibm-products `Toolbar`; TableToolbar `role=group` | RAC `Toolbar`, ActionGroup                       | `ActionBar`                         | Yes                |
| Orientation                   | group              | Y                             | group               | X: H                                                   | Space          | —                      | `vertical`                                        | Y                                                | H                                   | Y                  |
| Roving tabindex               | —                  | Y                             | —                   | Y                                                      | —              | —                      | Y                                                 | focus manager                                    | Y (FocusZone)                       | Y                  |
| Loop                          | —                  | `loop`                        | —                   | ?                                                      | —              | —                      | N                                                 | ActionGroup Y                                    | Y                                   | `loopFocus`        |
| Home/End                      | —                  | Y                             | —                   | Y                                                      | —              | —                      | N                                                 | N                                                | Y                                   | **N**              |
| RTL flip                      | —                  | Y                             | —                   | ?                                                      | —              | —                      | N                                                 | Y                                                | ?                                   | Y                  |
| Groups                        | nested ButtonGroup | `Group`                       | Group               | —                                                      | Space          | button group           | ToolbarGroup                                      | Group (nested toolbar becomes group)             | `Group` (overflows as a unit)       | `Group`            |
| Separators                    | Y                  | `Divider`                     | ActionBar.Separator | —                                                      | `separator`    | —                      | —                                                 | auto-perpendicular                               | `Divider` (kept in overflow)        | auto-perpendicular |
| Overflow into a "More" menu   | —                  | —                             | —                   | —                                                      | —              | —                      | guidance: at most 5                               | ActionGroup `overflowMode="collapse"`            | measured, "More items"              | —                  |
| Responsive label hiding       | —                  | —                             | —                   | —                                                      | —              | —                      | —                                                 | `buttonLabelBehavior` (label moves to a tooltip) | —                                   | —                  |
| Sizes                         | via Button         | xs–xl                         | Y                   | regular/dense                                          | Space          | —                      | sm/lg (row height)                                | `density`                                        | s/m/l + `gap`                       | —                  |
| Variants                      | —                  | filled/light, `withBorder`    | attached            | `disableGutters`                                       | Compact        | —                      | —                                                 | quiet/justified/emphasized/staticColor           | `flush`                             | unstyled           |
| Sticky                        | —                  | RTE `sticky` + `stickyOffset` | util                | AppBar                                                 | —              | —                      | —                                                 | —                                                | —                                   | —                  |
| Icon-only + tooltip           | —                  | aria-label                    | —                   | `label`                                                | —              | —                      | label + tooltip                                   | label as tooltip                                 | **auto-tooltip** + `keybindingHint` | via render         |
| Toggle items                  | ToggleGroup        | ToggleItem, single/multiple   | Toggle              | —                                                      | —              | —                      | —                                                 | ToggleButtonGroup                                | **not allowed**                     | via render         |
| Menu buttons                  | Menubar            | —                             | split button        | recipe                                                 | —              | —                      | `caret`                                           | Menu, Select                                     | `ActionBar.Menu`                    | via render         |
| Inputs / search               | —                  | —                             | —                   | X QuickFilter                                          | ProTable       | —                      | `TableToolbarSearch` (expandable)                 | Select                                           | **not allowed**                     | `Toolbar.Input`    |
| Links                         | —                  | polymorphic                   | —                   | X `href`                                               | —              | links in button groups | —                                                 | —                                                | Y                                   | `Toolbar.Link`     |
| Disabled items stay focusable | —                  | skipped                       | —                   | —                                                      | —              | avoid disabled         | —                                                 | —                                                | Y `aria-disabled`                   | Y (default)        |
| Selection / batch-action bar  | —                  | —                             | `ActionBar`         | —                                                      | ProTable alert | —                      | `TableBatchActions`                               | `ActionBar` (count, clear, Esc)                  | —                                   | —                  |
| Label required                | group label        | icon toggles                  | —                   | Y                                                      | —              | —                      | default label                                     | Y                                                | **required**                        | not enforced       |

## WAI-ARIA APG toolbar checklist

- `role="toolbar"`, used only for 3 or more controls.
- A label: `aria-labelledby` if there's a visible label, otherwise `aria-label`.
- `aria-orientation="vertical"` on vertical toolbars.
- **One Tab stop.** Entering goes to the first enabled control; coming back may return to the last focused one.
- **Arrow keys:**
  - Horizontal: Left/Right move focus, and Up/Down may be left for spin buttons.
  - Vertical: Up/Down move focus.
- **Optional:** wrapping, and Home/End.
- **Controls that need the arrow keys** (a text field, a slider): avoid them. If one is unavoidable, include only one and put it last.
- **Disabled controls** are usually skipped, but may stay focusable so people can discover them. Chrome's guide prefers `aria-disabled` for this.
- **Shortcut:** document a key that jumps into the toolbar (for example from an editor).
- **Menu buttons** inside follow the Menu Button pattern: Enter, Space or Down opens.

## Related Southpaw pieces

- **NavigationMenu** (`origin/geo-924-enhance-navigationmenu`) measures items with a ResizeObserver and moves trailing items that don't fit into a "More" item. The measuring is written **inline** in `DesktopList`, not as a reusable hook, and Tabs will need the same thing. Toolbar is the third user, so this is the moment to extract a shared `lib/` hook.
- **Menu** (`origin/geo-927-enhance-menubar`): `Menu.Trigger`, sizes, item `shortcut`, and keyboard-open tracking. It's the overflow surface.
- **Tooltip** (`origin/geo-931-enhance-slider`): `Tooltip.Provider` (a shared warm delay), `Tooltip.Shortcut` (`aria-keyshortcuts`) and touch support. It covers the icon-only labels (GEO-959) and keyboard hints.
- **ButtonGroup / ToggleGroup / Toggle / Button `inactive`:** connected styling, group context, and the focusable "inactive" state, which matches Base UI's `focusableWhenDisabled` default.

## Sources

- Base UI: https://base-ui.com/react/components/toolbar (and installed 1.9.0 source)
- APG: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/; https://developer.chrome.com/docs/modern-web-guidance/guides/ui-components/toolbar
- shadcn: https://ui.shadcn.com/docs/components/base/button-group
- Mantine: https://mantine.dev/core/toolbar/, https://mantine.dev/x/tiptap/
- Chakra: https://chakra-ui.com/docs/components/action-bar
- MUI: https://mui.com/material-ui/api/toolbar/, https://mui.com/x/react-data-grid/components/toolbar/, https://mui.com/x/api/data-grid/toolbar-button/
- Ant: https://ant.design/components/space, https://ant.design/components/image (ProTable docs couldn't be fetched)
- GOV.UK: https://design-system.service.gov.uk/components/button/
- Carbon: https://carbondesignsystem.com/components/data-table/usage/; `@carbon/react` TableToolbar / TableBatchActions; `@carbon/ibm-products` Toolbar
- Spectrum / RAC: https://react-aria.adobe.com/Toolbar, https://react-spectrum.adobe.com/v3/ActionGroup.html, https://react-spectrum.adobe.com/v3/ActionBar.html; `useToolbar.ts`, S2 `ActionBar.tsx`
- Primer: https://primer.style/product/components/action-bar/ (and its accessibility and guidelines pages); `ActionBar.tsx`

## Scope decided (George, 2026-11-21)

Decisions 1–15 are all (a):

- **Structure:** Root / Group / Separator / Button / Link / Input. Root provides ButtonGroupContext. `Toolbar.Button` renders our Button and `Toolbar.Toggle` our Toggle. ToggleGroup, Menu, Select and NumberField compose through `render`.
- **Keyboard:**
  - Southpaw adds Home/End (Base UI lacks it).
  - `loopFocus` and `orientation` (with `aria-orientation`) pass through.
  - Disabled items stay focusable (Base UI default).
- **Overflow:** `overflow="menu" | "wrap" | "none"`.
  - Measured "More" menu; Toggles become CheckboxItems, and a single ToggleGroup becomes a RadioGroup.
  - Groups overflow as a unit, and `overflow={false}` keeps an item visible.
  - The measuring is extracted to a shared `lib/useOverflow`. NavigationMenu and Tabs move onto it in the restack follow-ups, tracked by the coordinator.
- **Labels and tooltips:**
  - `hideLabelsBelow`; hidden labels go into tooltips.
  - Root wraps `Tooltip.Provider`; icon-only items get an automatic tooltip with an optional `shortcut` (GEO-959).
- **Appearance:** sizes; `variant` bordered | flush; `gap` default | condensed; `sticky` + `stickyOffset`; `Toolbar.Group attached`.
- **Structure rules:** a nested Root renders `role="group"`. A dev warning fires when the toolbar has no label.
- **Docs:** the APG notes (3+ controls; a text input goes last), and a story for a shortcut that jumps into the toolbar.

## Considered and rejected (George approved these exceptions, 2026-11-21)

- **Selection / batch-action bar** (Carbon TableBatchActions, Spectrum and Chakra ActionBar): its own component on a **Phase 3** ticket (the coordinator creates it), next to a future Table component. Every library ships it separately from its toolbar.
- **Expandable search** (Carbon TableToolbarSearch, MUI X QuickFilter): out of scope; it's a data table or search concern. `Toolbar.Input` plus our Input covers search inside a toolbar.
- **A prop to drop the toolbar role** (Primer guidance): no prop. ButtonGroup is the non-roving `role="group"` alternative, and the docs say so.
