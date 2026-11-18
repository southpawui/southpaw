# ButtonGroup — Competitive Research

Researched: 2026-11-16 (GEO-896, all 9 libraries). New component.

## Primitive

Base UI 1.9 has **no ButtonGroup**. Two neighbours look close but aren't a fit:

- `Toolbar` (`role="toolbar"`, roving tabindex) is GEO-928's job. A toolbar's arrow-key navigation is wrong for a simple group of actions.
- `ToggleGroup` is for pressed/unpressed state.

A button group is a `role="group"` container where every button keeps its own tab stop (shadcn: "Users can Tab between buttons in the group").

## Feature comparison

| Feature                                    | shadcn                 | Mantine               | Chakra              | MUI                              | Ant                                     | GOV.UK               | Carbon         | Spectrum                             | Primer      |
| ------------------------------------------ | ---------------------- | --------------------- | ------------------- | -------------------------------- | --------------------------------------- | -------------------- | -------------- | ------------------------------------ | ----------- |
| Component                                  | ButtonGroup            | Button.Group          | Group / ButtonGroup | ButtonGroup                      | Space.Compact (Button.Group deprecated) | `govuk-button-group` | ButtonSet      | ButtonGroup                          | ButtonGroup |
| Connected (shared borders, end radii)      | Yes                    | Yes                   | `attached`          | Yes                              | Yes                                     | No (spaced)          | Flush (no gap) | No (spaced)                          | Yes         |
| Spaced layout                              | Nested groups          | No                    | Default             | No                               | `Space`                                 | Yes                  | No             | Yes                                  | No          |
| Orientation horizontal/vertical            | Yes                    | Yes                   | Yes                 | Yes                              | `direction`                             | —                    | `stacked`      | Yes                                  | No          |
| Auto-stack when space runs out             | No                     | No                    | No                  | No                               | No                                      | **Stacks on mobile** | No             | **Switches to vertical on overflow** | No          |
| Align start/center/end                     | No                     | No                    | No                  | No                               | No                                      | Row, start           | —              | `align`                              | No          |
| Fill width (grow)                          | No                     | No                    | `grow`              | `fullWidth`                      | `block`                                 | Full-width on mobile | Fluid set      | No                                   | No          |
| Separator part                             | `ButtonGroupSeparator` | No                    | No                  | No                               | No                                      | —                    | —              | —                                    | No          |
| Text / addon part                          | `ButtonGroupText`      | `Button.GroupSection` | No                  | No                               | No                                      | —                    | —              | —                                    | No          |
| Mixed controls (Input, Select)             | Yes                    | No                    | Yes (Group)         | No                               | **Yes** (Space.Compact)                 | Buttons + links      | No             | No                                   | No          |
| Propagate size/variant/color to children   | No                     | No                    | Yes                 | Yes (`size`, `variant`, `color`) | `size`                                  | —                    | `size`         | No                                   | No          |
| Disable all                                | No                     | No                    | No                  | `disabled`                       | No                                      | —                    | —              | `isDisabled`                         | No          |
| Split button (action + menu)               | Yes                    | Yes (docs)            | Yes (docs)          | Yes                              | Yes                                     | No                   | —              | —                                    | Yes         |
| Nested groups                              | Yes                    | No                    | No                  | No                               | No                                      | —                    | —              | —                                    | No          |
| Buttons and links together                 | No                     | No                    | No                  | No                               | No                                      | **Yes**              | No             | No                                   | No          |
| `role="group"` + accessible label guidance | Yes                    | No                    | No                  | `role="group"`                   | No                                      | —                    | —              | —                                    | No          |

## What to build (proposed — see the Linear ticket for decisions)

- Connected styling, defined once and reused by ToggleGroup (GEO-933), Toolbar (GEO-928), and later OTPField's `attached`.
- Orientation, spaced vs attached layout, separator, text section, grow, align, and responsive stacking.
- Prop propagation (size/variant/color/disabled).
- Mixed Input/Select in attached groups.

## Accessibility notes

- `role="group"`, plus an accessible name (`aria-label`/`aria-labelledby`) when the group's purpose isn't obvious from context (shadcn guidance).
- Every button stays in the tab order. No roving focus: that's Toolbar.
- **Attached groups:**
  - The focused button must sit above its neighbours (z-index), or its focus ring is clipped by the overlapping borders.
  - Solid buttons need a visible divider (a separator part) so the boundary between actions meets 3:1 (WCAG 1.4.11).
- **Responsive stacking (GOV.UK)** keeps targets large and avoids horizontal scroll at 320px (WCAG 1.4.10 Reflow).
- **Disabled-all** should disable each button natively, not just look disabled.

## Sources

- [shadcn ButtonGroup](https://ui.shadcn.com/docs/components/button-group)
- [Mantine Button (Button.Group)](https://mantine.dev/core/button)
- [Chakra Button (ButtonGroup / attached)](https://chakra-ui.com/docs/components/button)
- [MUI ButtonGroup](https://mui.com/material-ui/react-button-group/)
- [Ant Design Space (Space.Compact)](https://ant.design/components/space)
- [GOV.UK Button (button group)](https://design-system.service.gov.uk/components/button/), [govuk-frontend `_button-group.scss`](https://cdn.jsdelivr.net/npm/govuk-frontend@6.1.0/dist/govuk/objects/_button-group.scss)
- [Carbon Button (ButtonSet)](https://carbondesignsystem.com/components/button/usage/)
- [React Spectrum ButtonGroup](https://react-spectrum.adobe.com/react-spectrum/ButtonGroup.html)
- [Primer ButtonGroup](https://primer.style/product/components/button-group/)
