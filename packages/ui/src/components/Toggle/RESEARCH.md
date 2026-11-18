# Toggle — Competitive Research

Researched: 2026-11-18 (GEO-932, all 9 libraries). This replaces the 2026-11-08 notes, which skipped Ant and Primer and had no sources for most libraries.

## Primitive

Base UI 1.9 `Toggle`: a native `<button>` with `aria-pressed`.

- **Props:** `pressed` / `defaultPressed` / `onPressedChange(pressed, eventDetails)`, where `eventDetails.cancel()` can veto a change. Also `value` (identity inside ToggleGroup), `disabled`, `nativeButton`, `render`, and `className`/`style` as a value or a function of state.
- **State:** `{ pressed, disabled }`.
- **Data attributes:** `data-pressed` and `data-disabled` (there is no `data-state`).
- **Not provided:** form `name`, read-only, loading.
- **Icon swap:** the docs example swaps the icon by reading `state.pressed` in `render` and keeps one `aria-label`.

## Feature comparison

| Feature                   | shadcn             | Mantine                  | Chakra v3                                           | MUI                | Ant          | GOV.UK | Carbon                                 | Spectrum                   | Primer                                |
| ------------------------- | ------------------ | ------------------------ | --------------------------------------------------- | ------------------ | ------------ | ------ | -------------------------------------- | -------------------------- | ------------------------------------- |
| Dedicated toggle button   | Toggle             | No (ActionIcon, Chip)    | Toggle (on Button)                                  | ToggleButton       | CheckableTag | No     | IconButton `isSelected`, SelectableTag | ToggleButton               | No (ToggleSwitch is a pressed button) |
| Variants                  | default, outline   | 8 (ActionIcon), 3 (Chip) | solid/surface/subtle/ghost (an on/off variant pair) | one                | —            | —      | ghost only                             | default, quiet, emphasized | IconButton variants                   |
| Colour/intent             | No                 | Yes                      | Yes (can change when pressed)                       | 7 intents          | No           | —      | No                                     | `staticColor` white/black  | No                                    |
| Sizes                     | sm/default/lg      | xs–xl                    | Button sizes                                        | s/m/l              | No           | —      | xs–lg                                  | XS–XL (S2)                 | s/m/l                                 |
| Square icon-only          | Yes (min-w = h)    | Yes                      | Yes                                                 | Yes                | —            | —      | Yes                                    | Yes                        | Yes                                   |
| Icon-only name enforced   | —                  | Docs                     | —                                                   | Docs               | —            | —      | `label` required (tooltip)             | Docs                       | `aria-label` required                 |
| Icon + text               | Yes                | Chip                     | Yes                                                 | Yes                | `icon`       | —      | Tag                                    | Yes                        | —                                     |
| Icon swap when pressed    | Via Base UI        | Chip `icon`              | `Toggle.Indicator`                                  | Manual             | No           | —      | No                                     | Says don't                 | —                                     |
| Pressed indicator (check) | No                 | Chip check               | `Toggle.Indicator`                                  | No                 | No           | —      | No                                     | No                         | Switch knob + On/Off                  |
| Pressed visual            | Fill (colour only) | Fill / check             | Variant swap                                        | Tint (colour only) | Fill         | —      | Selected fill, high contrast           | Fill                       | Position + text                       |
| Loading                   | No                 | ActionIcon               | Via Button                                          | No                 | No           | —      | No                                     | No                         | Yes (+ delayed live label)            |
| Read-only                 | No                 | Chip `readOnly`          | No                                                  | No                 | No           | —      | No                                     | No                         | No                                    |
| Focusable "inactive"      | No                 | `data-disabled`          | No                                                  | No                 | No           | —      | No                                     | No                         | IconButton `inactive`                 |
| Full width                | No                 | No                       | Style props                                         | `fullWidth`        | No           | —      | No                                     | Layout width               | No                                    |
| Built-in tooltip          | No                 | Ref support              | No                                                  | No                 | No           | —      | Yes                                    | No                         | Yes (+ keybinding hint)               |
| Badge/count               | No                 | No                       | No                                                  | No                 | No           | —      | `badgeCount`                           | No                         | No                                    |
| Form name/value           | No                 | Native input             | No                                                  | `value`            | No           | —      | No                                     | No                         | `buttonType`                          |
| Invalid style             | `aria-invalid`     | No                       | No                                                  | No                 | No           | —      | No                                     | No                         | No                                    |

## Accessibility notes

- **Don't change the label when pressed.** Spectrum says if the label changes meaning (Mute/Unmute, Play/Pause), use a Button instead. Chakra's Mute/Unmute indicator example is the anti-pattern. An icon swap is fine if the accessible name stays the same.
- **Icon-only toggles need an accessible name.** MUI, Spectrum, Mantine, Carbon and Primer all require one. Carbon and Primer render the name as a tooltip (our GEO-959 rule).
- **Don't signal pressed by colour alone** (WCAG 1.4.1). Carbon says the selected state must stay high-contrast; Primer says to differentiate by icon, not colour. shadcn and MUI signal it with a fill or tint only, which is a gap for us to beat.
- **Toggle vs Switch vs Checkbox.**
  - Toggle: a pressed/unpressed action in a toolbar or group.
  - Switch: a setting that takes effect immediately.
  - Checkbox: form data.
  - GOV.UK has no toggle; its `aria-pressed` vs `role="switch"` spike (govuk-frontend #4857) is still open.
- **Keyboard:** a native button, so Space and Enter toggle and Tab moves focus. Arrow keys belong to ToggleGroup and Toolbar.
- **Loading:** Primer announces a loading label through a live region after a delay.

## Sources

- shadcn: https://ui.shadcn.com/docs/components/toggle and the new-york-v4 / base `toggle.tsx` source on GitHub
- Mantine: https://mantine.dev/core/action-icon/, https://mantine.dev/core/chip/
- Chakra v3: the docs page returns 404. Source: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/toggle, plus `apps/compositions/src/ui/toggle.tsx` and the toggle examples
- MUI: https://mui.com/material-ui/react-toggle-button/, https://mui.com/material-ui/api/toggle-button/
- Ant: https://ant.design/components/tag (CheckableTag), https://ant.design/components/button
- GOV.UK: https://design-system.service.gov.uk/components/, https://design-system.service.gov.uk/components/password-input/, https://github.com/alphagov/govuk-frontend/issues/4857
- Carbon: GitHub `packages/react/src/components/IconButton/index.tsx`, `Button/ButtonBase.tsx`, `Tag/SelectableTag.tsx`; https://carbondesignsystem.com/components/tag/usage/
- Spectrum: https://react-spectrum.adobe.com/react-spectrum/ToggleButton.html; `@react-spectrum/s2/src/ToggleButton.tsx`
- Primer: https://primer.style/product/components/icon-button/ and its accessibility page, https://primer.style/product/components/toggle-switch/
- Base UI: https://base-ui.com/react/components/toggle

## Considered and rejected (George approved these exceptions, 2026-11-18)

- **`fullWidth` (MUI):** no prop. Toggles are inline controls; ButtonGroup `grow` or `className="w-full"` covers it, matching Button.
- **Badge/count prop (Carbon `badgeCount`):** no prop. Compose a `<Badge>` as children (WithBadge story).
- **Keybinding hint in the tooltip (Primer):** deferred to GEO-959, Tooltip.
- **Label swap when pressed (Chakra's Mute/Unmute example):** documented as an anti-pattern (Spectrum). Use `pressedIcon` with a fixed name, or a Button.
