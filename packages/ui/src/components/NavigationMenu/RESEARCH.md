# NavigationMenu — Competitive Research

Researched: 2026-11-16. Replaces the thin 2026-11-08 version, which covered 6 libraries with no Mantine, Ant, GOV.UK, Carbon or Spectrum.

Libraries checked: shadcn (Base UI + Radix), Mantine, Chakra v3 (and Zag.js underneath), MUI, Ant Design Menu, GOV.UK (Service navigation + Header), Carbon UI Shell, Spectrum 2 / React Aria, Primer. Where the docs were silent, I read the source.

## Base UI 1.9 baseline

- Parts: Root, List, Item, Trigger, Icon, Content, Link, Portal, Positioner, Popup, Viewport, Arrow, Backdrop.
- Root:
  - Props: `value` / `defaultValue` / `onValueChange`, `delay` (50), `closeDelay` (50), `orientation`, `actionsRef`, `onOpenChangeComplete`.
  - Renders `<nav>`, or `<div>` when nested.
  - Nested Roots give submenus, either inline or portalled.
- Link: `active` sets `data-active` and `aria-current="page"`; `closeOnClick`.
- Popup also renders a `<nav>`, which means a second, unnamed landmark.
- Motion: one shared Popup/Viewport resizes between panels (`--popup-width/height`, `--positioner-width/height`). Content gets `data-activation-direction` for direction-aware slides.
- Keyboard:
  - Arrow keys move between triggers, RTL-aware.
  - ArrowDown opens a panel (ArrowRight when vertical).
  - Esc closes.
  - Tab works throughout.
  - Safe-polygon hover.
- **No** accessible name, mobile collapse, overflow handling or follow indicator.
- **Current Southpaw state:** a bare wrapper with hardcoded `neutral-*` / `bg-white` colours, no styled chevron, no active styling, no Viewport sizing or animation, no density and no stories beyond Default.

## Feature matrix

| Feature                                     | shadcn                      | Mantine                           | Chakra/Zag                  | MUI                      | AntD                      | GOV.UK                         | Carbon              | Spectrum/RA        | Primer            | Ours                |
| ------------------------------------------- | --------------------------- | --------------------------------- | --------------------------- | ------------------------ | ------------------------- | ------------------------------ | ------------------- | ------------------ | ----------------- | ------------------- |
| Dropdown / mega panel                       | Yes (grid + descriptions)   | HeaderMegaMenu (cols, footer CTA) | Zag only                    | No                       | SubMenu popups, groups    | No                             | Single-column       | No                 | No                | Unstyled            |
| Morphing viewport + direction slide         | Yes                         | No                                | Zag                         | No                       | No                        | No                             | No                  | No                 | No                | Unstyled            |
| Per-item dropdown (no shared viewport)      | Radix `viewport={false}`    | Yes                               | Zag basic                   | —                        | Yes                       | —                              | Yes                 | —                  | —                 | No                  |
| Nested submenus                             | Yes                         | `Menu.Sub`                        | Yes                         | ?                        | Unlimited                 | No                             | 1 level             | NavigationTree     | `SubNav` (4)      | Unstyled            |
| Hover / click / both + delays               | Yes (+ `skipDelayDuration`) | `trigger`, delays                 | `disableHover/ClickTrigger` | Click                    | `triggerSubMenuAction`    | —                              | Click only          | —                  | —                 | Base defaults       |
| `aria-current="page"` from a prop           | `active`                    | `active`                          | `current`                   | NavTabs                  | `selectedKeys`            | `current`                      | `isActive`          | `selectedRoute`    | `aria-current`    | Base only, unstyled |
| Current _section_ (`aria-current="true"`)   | No                          | No                                | No                          | No                       | No                        | **`active`**                   | `isActive`          | ancestor           | `"location"`      | No                  |
| Parent shows active when a child is current | No                          | No                                | No                          | No                       | Yes                       | —                              | **Yes**             | **Yes**            | —                 | No                  |
| No-CSS fallback for current (`<strong>`)    | No                          | No                                | No                          | No                       | No                        | **Yes**                        | No                  | No                 | No                | No                  |
| Mobile: toggle + drawer / side nav          | No                          | Burger + Drawer + Collapse        | recipes                     | Drawer                   | —                         | **In-place "Menu" disclosure** | Hamburger → SideNav | Icon rail          | —                 | No                  |
| Overflow into "More" menu                   | No                          | No                                | No                          | No                       | **`overflowedIndicator`** | No                             | No                  | No                 | **UnderlineNav**  | No                  |
| Scroll arrows                               | No                          | No                                | No                          | **Tabs `scrollButtons`** | No                        | No                             | No                  | No                 | Coarse pointer    | No                  |
| Sliding indicator                           | Radix `Indicator`           | No                                | Zag `indicator`             | Tabs                     | Static bar                | Static                         | Static              | SelectionIndicator | Static            | No                  |
| Arrow (pointer)                             | Base `Arrow`                | —                                 | —                           | —                        | —                         | —                              | —                   | —                  | —                 | Unstyled            |
| Vertical / sidebar                          | Radix                       | NavLink                           | Zag                         | Tabs                     | `inline`/`vertical`       | No                             | SideNav             | NavigationTree     | NavList           | Base                |
| Icons, descriptions, counters               | Yes                         | Yes                               | —                           | Icons                    | `icon`, `extra`           | No                             | No                  | Yes                | counters, visuals | No                  |
| Groups with headings                        | —                           | —                                 | —                           | —                        | `group`                   | —                              | —                   | Section            | `NavList.Group`   | No                  |
| Backdrop                                    | Base                        | —                                 | —                           | —                        | —                         | —                              | —                   | —                  | —                 | No                  |
| Nav landmark label                          | consumer                    | —                                 | —                           | —                        | —                         | `navigationLabel`              | `aria-label`        | required           | **dev invariant** | No                  |
| Skip link                                   | —                           | —                                 | —                           | —                        | —                         | Separate component             | `SkipToContent`     | F6 landmarks       | —                 | No                  |
| RTL                                         | Yes                         | ?                                 | `dir`                       | ?                        | Yes                       | —                              | ?                   | ?                  | ?                 | Base keys           |

## Accessibility guidance

- **APG disclosure navigation:**
  - Site nav must **not** use `role="menu"` / `menubar`. Each top-level button is a disclosure (`aria-expanded`, `aria-controls`) over a list of links.
  - Tab and Shift+Tab are required. Arrow keys and Home/End are optional and "supplement, but do not replace, tabbing".
  - Esc closes and returns focus to the button (WCAG 1.4.13).
  - Focus leaving the nav closes open panels.
- **Who breaks it:** Carbon (`aria-haspopup="menu"`), AntD and Mantine Menu (`role="menu"`). Mantine says its `trigger="hover"` is keyboard-inaccessible, so its mega-menu recipe fails for keyboard users. Base UI follows the disclosure model.
- **GOV.UK:**
  - `aria-current="page"` for the page, `"true"` for the section.
  - Current item wrapped in `<strong>` for no-CSS and colour-override users.
  - Mobile "Menu" toggle is hidden until JavaScript runs, then uses `aria-expanded`. There is no collapse with a single item.
  - `<nav aria-label>` is required, and a skip link should come first.
- **Landmarks:**
  - Primer enforces `aria-label` on the nav.
  - Base UI's Popup is a second `<nav>`, which would add an unnamed duplicate landmark on every open panel. It should render a `div`.

## Proposed scope (rule: if 1 library has it, we do it)

| Feature                                                                                                                                                                          | Source                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Styled trigger with rotating chevron (reuse `CollapsibleChevron`), links, semantic tokens, sizes sm/md/lg + density, focus ring + forced-colours outline (GEO-950 workaround)    | All                                        |
| Shared morphing viewport: sized by `--popup-width/height`, direction-aware content slide, reduced motion                                                                         | Base UI, shadcn, Zag                       |
| `viewport={false}`: per-item dropdowns with no shared popup                                                                                                                      | Radix, Mantine, AntD, Carbon               |
| Mega-menu building blocks: `NavigationMenu.LinkCard` (icon + title + description), `Group` with heading, featured footer                                                         | shadcn, Mantine, AntD, Primer, Spectrum    |
| Nested submenus, inline or flyout                                                                                                                                                | Base UI, Mantine, AntD, Primer             |
| Open mode `hover` (default, with click) or `click` only; `delay` / `closeDelay`; skip the delay when moving between triggers                                                     | Base UI, Radix, Mantine, AntD, Zag, Carbon |
| Active state: Link `active` → `aria-current="page"`; `current="section"` → `aria-current="true"`; parent trigger shows active when a child is current; `<strong>`-style fallback | Base UI, GOV.UK, Carbon, Spectrum, Primer  |
| Sliding indicator that follows the hovered or active trigger (opt-in), plus the optional `Arrow`                                                                                 | Radix, Zag, MUI, Spectrum                  |
| Responsive collapse below a breakpoint: "Menu" toggle → Drawer with Accordion sections (the reason this ticket follows Accordion)                                                | Mantine, MUI, Carbon, GOV.UK               |
| Overflow: items that don't fit move into a "More" menu, which reflects the current item                                                                                          | AntD, Primer                               |
| Scroll arrows for overflowing horizontal nav (opt-in alternative to "More")                                                                                                      | MUI, Primer                                |
| Vertical orientation (sidebar)                                                                                                                                                   | Base UI, Radix, AntD, Carbon, Primer       |
| Icons, descriptions, counters/badges on links                                                                                                                                    | Mantine, Primer, AntD                      |
| `Backdrop` (dims the page behind a mega menu)                                                                                                                                    | Base UI                                    |
| Nav `aria-label` dev warning; Popup renders a `div`, not a second `<nav>`                                                                                                        | Primer, GOV.UK, APG                        |
| `keepMounted` for SSR and crawlers; `closeOnClick`; router `render`                                                                                                              | Base UI, AntD                              |
| RTL, reduced motion, forced colours                                                                                                                                              | All                                        |

**Not proposed:**

- **`role="menu"` semantics** (Carbon, AntD, Mantine): APG says no for site nav.
- **Hover-only opening with no keyboard path** (Mantine HoverCard).
- **F6 landmark cycling** (React Aria): an app-shell concern, not this component's.

## Sources

- [Base UI NavigationMenu](https://base-ui.com/react/components/navigation-menu), plus the `@base-ui/react@1.9.0` source
- [shadcn NavigationMenu (Base)](https://ui.shadcn.com/docs/components/base/navigation-menu), [(Radix)](https://ui.shadcn.com/docs/components/radix/navigation-menu), [Radix](https://www.radix-ui.com/primitives/docs/components/navigation-menu)
- [Mantine Menu](https://mantine.dev/core/menu/), [HoverCard](https://mantine.dev/core/hover-card/), [NavLink](https://mantine.dev/core/nav-link/), [Headers](https://ui.mantine.dev/category/headers/)
- [Chakra Menu](https://chakra-ui.com/docs/components/menu), [Zag NavigationMenu](https://zagjs.com/components/react/navigation-menu)
- [MUI App bar](https://mui.com/material-ui/react-app-bar/), [Tabs](https://mui.com/material-ui/react-tabs/)
- [AntD Menu](https://ant.design/components/menu)
- [GOV.UK Service navigation](https://design-system.service.gov.uk/components/service-navigation/), [Header](https://design-system.service.gov.uk/components/header/)
- [Carbon UI Shell header](https://carbondesignsystem.com/components/UI-shell-header/usage/)
- [React Aria NavigationTree](https://react-aria.adobe.com/NavigationTree.md), [Spectrum SideNav](https://react-spectrum.adobe.com/SideNav.md)
- [Primer UnderlineNav](https://primer.style/product/components/underline-nav/), [NavList](https://primer.style/product/components/nav-list/)
- [APG disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
