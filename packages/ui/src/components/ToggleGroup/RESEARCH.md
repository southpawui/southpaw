# ToggleGroup — Competitive Research

Researched: 2026-11-18 (GEO-933, all 9 libraries). This replaces the 2026-11-08 notes, which covered 6 libraries with one source.

## Primitive

Base UI 1.9 `ToggleGroup`:

- **Props:** `value` / `defaultValue` (`string[]`, single mode included), `onValueChange(value, eventDetails)` (`eventDetails.cancel()` blocks a change), `multiple` (default false), `loopFocus` (default true), `orientation`, `disabled`, `render`.
- **Markup:** `role="group"` with Toggle items (`aria-pressed`).
- **Keyboard:** roving tabindex via CompositeRoot. Arrows follow the orientation, Home/End are enabled, and focus loops.
- **Data attributes:** `data-orientation`, `data-disabled`, `data-multiple`.
- **Items:** Toggle requires `value` inside a group. Its `onPressedChange` runs before the group commits, so cancelling it also blocks the group change.
- **Inside a Toolbar:** it uses the Toolbar's composite.
- **Not provided:** form `name`, required, invalid, read-only, deselection control.

## Feature comparison

| Feature                        | shadcn                 | Mantine (SegmentedControl / Chip.Group) | Chakra v3 (SegmentGroup)     | MUI                    | Ant (Segmented / CheckableTagGroup) | GOV.UK             | Carbon ContentSwitcher       | Spectrum (ToggleButtonGroup / SegmentedControl / ActionGroup)               | Primer SegmentedControl                  |
| ------------------------------ | ---------------------- | --------------------------------------- | ---------------------------- | ---------------------- | ----------------------------------- | ------------------ | ---------------------------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| Single                         | Y                      | Y / Y                                   | Y                            | Y (`exclusive`)        | Y / Y                               | radios instead     | Y                            | Y                                                                           | Y                                        |
| Multiple                       | Y                      | N / Y                                   | N                            | Y                      | N / Y                               | checkboxes instead | N                            | Y                                                                           | N                                        |
| Can deselect to empty          | Y                      | N / ~                                   | N                            | Y                      | N / Y                               | can't unselect     | N                            | Y unless `disallowEmptySelection`                                           | N                                        |
| Force one selected             | N                      | always                                  | always                       | doc pattern            | always                              | —                  | always                       | `disallowEmptySelection`                                                    | always                                   |
| Orientation                    | Y                      | Y                                       | Y                            | Y                      | Y                                   | —                  | N                            | Y                                                                           | N                                        |
| Attached vs spaced             | `spacing`              | `withItemsBorders` / spaced chips       | attached                     | attached               | attached / spaced                   | —                  | attached                     | `density`                                                                   | attached                                 |
| Sizes                          | 3                      | 5                                       | 4                            | 3                      | 3                                   | —                  | 3                            | 5                                                                           | 2                                        |
| Variants / colour              | default, outline       | `color`, variants                       | `colorPalette`               | `color`                | `shape`                             | —                  | low contrast                 | quiet, emphasized, staticColor                                              | default, subtle                          |
| Full width / equal split       | N                      | `fullWidth`                             | ?                            | `fullWidth`            | `block`                             | —                  | equal widths                 | `isJustified`                                                               | `fullWidth`                              |
| Icon-only items                | aria-label             | VisuallyHidden                          | Y                            | aria-label             | `icon`                              | —                  | IconSwitch (tooltip)         | aria-label                                                                  | IconButton (tooltip)                     |
| Per-item tooltip               | N                      | via Tooltip                             | N                            | N                      | `tooltip`                           | —                  | IconSwitch                   | v3 hide labels                                                              | `description`                            |
| Responsive collapse / overflow | N                      | N                                       | N                            | N                      | N                                   | —                  | ellipsis                     | v3 overflow menu, collapse labels                                           | `hideLabels` / `dropdown` per breakpoint |
| Sliding indicator              | N                      | Y                                       | Y                            | N                      | Y                                   | —                  | N                            | ?                                                                           | N                                        |
| Disabled group / item          | Y / Y                  | Y / Y                                   | Y / Y                        | Y / Y                  | Y / Y                               | —                  | ? / Y                        | Y / Y                                                                       | N / aria-disabled                        |
| Read-only                      | N                      | Y                                       | Y                            | N                      | N                                   | —                  | N                            | N                                                                           | N                                        |
| Form `name`                    | N                      | Y                                       | Y (+ `form`)                 | N                      | Y                                   | native             | N                            | N                                                                           | N                                        |
| Required / invalid             | N                      | N                                       | Y                            | N                      | N                                   | error message      | N                            | N                                                                           | N                                        |
| Counts                         | N                      | N                                       | N                            | N                      | N                                   | —                  | N                            | N                                                                           | `count`                                  |
| Inline action / divider        | N                      | N                                       | N                            | N                      | N                                   | —                  | N                            | N                                                                           | Y                                        |
| Data-driven items              | N                      | `data`                                  | `items`                      | N                      | `options`                           | —                  | N                            | N                                                                           | N                                        |
| Keyboard                       | roving, Home/End, loop | native radio                            | Tab to checked, arrows check | roving, Home/End, wrap | native radio                        | native             | roving, wrap; auto or manual | roving                                                                      | Tab per item, no arrows                  |
| Role                           | group + aria-pressed   | radiogroup + radio                      | radiogroup + radio           | group + aria-pressed   | radiogroup + radio                  | native             | tablist                      | single: radiogroup + radio + aria-checked; multiple: toolbar + aria-pressed | ul/li + aria-pressed                     |

## Accessibility notes

- **Roles vary.**
  - `group` + `aria-pressed`: Base UI, shadcn, MUI.
  - Native `radiogroup`: Mantine, Chakra, Ant.
  - Per mode: React Aria uses radiogroup + `aria-checked` for single and toolbar + `aria-pressed` for multiple.
  - `tablist`: Carbon, which switches views.
  - Plain buttons with Tab between them and no arrows: Primer. It says radiogroup implies a save step.
- **GOV.UK** has no toggle group. It uses Radios for one choice and Checkboxes for several, never preselects, and shows a specific error when nothing is chosen.
- **Icon-only items** need an `aria-label` everywhere. Primer and Carbon tie a tooltip to it (our GEO-959 rule).
- **Keyboard:** a single tab stop with arrows, Home/End and loop (Base UI, MUI, Ark). Moving focus never changes the selection (MUI). Carbon offers automatic activation, but that's tab semantics.
- **Primer:** segment names start with the visible label, which helps speech recognition, and icons need 3:1 contrast.

## Sources

- shadcn: https://ui.shadcn.com/docs/components/toggle-group; GitHub `shadcn-ui/ui` `apps/v4/registry/bases/base/ui/toggle-group.tsx`
- Mantine: https://mantine.dev/core/segmented-control/, https://mantine.dev/core/chip/; GitHub `SegmentedControl.tsx`
- Chakra / Ark: https://chakra-ui.com/docs/components/segmented-control, https://ark-ui.com/docs/components/segment-group, https://ark-ui.com/docs/components/toggle-group
- MUI: https://mui.com/material-ui/react-toggle-button/, https://mui.com/material-ui/api/toggle-button-group/
- Ant: https://ant.design/components/segmented, https://ant.design/components/tag; GitHub `react-component/segmented`
- GOV.UK: https://design-system.service.gov.uk/components/radios/; govuk-design-system issues #5843 and #5306
- Carbon: https://carbondesignsystem.com/components/content-switcher/usage/ and its accessibility page; GitHub `ContentSwitcher.tsx`, `IconSwitch.tsx`
- Spectrum / React Aria: https://react-aria.adobe.com/ToggleButtonGroup, https://react-spectrum.adobe.com/SegmentedControl, https://react-spectrum.adobe.com/react-spectrum/ActionGroup.html; GitHub `useToggleButtonGroup.ts`
- Primer: https://primer.style/product/components/segmented-control/ and its accessibility and guidelines pages; GitHub `SegmentedControl.tsx`
- Base UI: https://base-ui.com/react/components/toggle-group; installed 1.9.0 source

## Considered and rejected (George approved these exceptions, 2026-11-21)

- **Count prop (Primer `count`):** no prop. Compose a `<Badge>` inside the item.
- **Automatic activation (Carbon ContentSwitcher `selectionMode="automatic"`):** that's tab semantics. Toggles act on Space and Enter only, and arrows move focus (MUI).
- **Responsive dropdown / overflow menu (Primer `dropdown`, Spectrum `overflowMode="collapse"`):** deferred to Toolbar (GEO-928), which has Menu. `hideLabelsBelow` ships now.
- **Per-item tooltip (Ant, Primer, Carbon):** deferred to GEO-959, Tooltip.
