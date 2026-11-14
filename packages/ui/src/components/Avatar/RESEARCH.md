# Avatar — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                        | shadcn | Mantine | Chakra | MUI | Ant | Spectrum | Ours    |
| ------------------------------ | ------ | ------- | ------ | --- | --- | -------- | ------- |
| Image + fallback               | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes     |
| Initials fallback              | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes     |
| Size variants                  | Yes    | Yes     | Yes    | Yes | Yes | Yes      | Yes (3) |
| Badge/status overlay           | No     | No      | Yes    | Yes | Yes | No       | No      |
| Avatar group/stack             | No     | No      | Yes    | Yes | Yes | No       | No      |
| Shape variants (circle/square) | No     | No      | Yes    | Yes | Yes | No       | No      |
| Loading/skeleton state         | No     | No      | No     | No  | No  | No       | No      |

## Must-add features

- **Avatar group/stack** — overlapping avatars for showing multiple users (Chakra, MUI, Ant)
- **Badge/status overlay** — online/offline/busy indicator (MUI, Chakra)
- **Shape variants** — circle (default) vs rounded square (Ant, Chakra)

## Accessibility

- `alt` text on Image for screen readers
- Fallback text provides accessible name automatically
- Badge status should not rely on colour alone — use icon + colour

## Sources

- [shadcn/ui Avatar](https://ui.shadcn.com/docs/components/radix/avatar)
- [Chakra Avatar](https://chakra-ui.com/docs/components/avatar)
- [MUI Avatar](https://mui.com/material-ui/react-avatar/)

## Name tooltip (GEO-941) — researched 2026-11-13

How each library exposes a person's name on an avatar:

| Library  | Name on hover                                                                                    | Accessible name                          | Focusable                          |
| -------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------- | ---------------------------------- |
| shadcn   | No                                                                                               | `alt` on image                           | No                                 |
| Mantine  | Wraps each Avatar in `Tooltip`; `+N` overflow tooltip lists hidden names; `Tooltip.Group` delays | `alt` (also used as placeholder `title`) | Only with `component="button"`/`a` |
| Chakra   | No (overflow uses Menu)                                                                          | `name` on Fallback derives initials      | No                                 |
| MUI      | No                                                                                               | `alt`                                    | No                                 |
| Ant      | No per-avatar; `max.popover` on the `+N` overflow                                                | `alt`                                    | No                                 |
| GOV.UK   | No avatar component                                                                              | —                                        | —                                  |
| Carbon   | `UserProfileImage` (ibm-products): `tooltipText` + `tooltipAlignment`                            | `imageDescription`                       | No                                 |
| Spectrum | No                                                                                               | `alt`; decorative by default             | No                                 |
| Primer   | No (AvatarStack expands on hover)                                                                | `alt`                                    | Via wrapping link                  |

Takeaways:

- Name tooltips appear in Mantine (per avatar + `+N` list) and Carbon (`tooltipText`), so both are in scope. Ant's `+N` overflow popover is also in scope.
- No library makes a static avatar focusable just to show a tooltip. Primer/Spectrum tooltip guidance says tooltips belong on interactive elements.
- The name must not live only in the tooltip: every library also puts it in `alt` / an accessible name.

Sources: mantine.dev/core/avatar, mui.com/material-ui/react-avatar, ant.design/components/avatar, chakra-ui.com/docs/components/avatar, react-spectrum.adobe.com/react-spectrum/Avatar.html, primer.style/product/components/avatar-stack, ui.shadcn.com/docs/components/avatar, @carbon/ibm-products UserProfileImage.d.ts, design-system.service.gov.uk/components.
