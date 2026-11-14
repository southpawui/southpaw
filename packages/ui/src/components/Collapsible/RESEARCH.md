# Collapsible — Competitive Research

Researched: 2026-11-13. This replaces the thin 2026-11-08 version, which covered only shadcn, Radix, Chakra and MUI.

Libraries checked: shadcn, Mantine (Collapse + Spoiler), Chakra v3, MUI (Collapse), Ant Design (Collapse + Typography ellipsis), GOV.UK (Details), Carbon (Accordion item + ExpandableTile), React Aria / Spectrum 2 (Disclosure), Primer (Details + progressive disclosure guidance).

## Base UI 1.9 baseline

- Parts: Root (`open`, `defaultOpen`, `onOpenChange`, `disabled`), Trigger, Panel (`keepMounted`, `hiddenUntilFound`).
- Attributes:
  - Panel: `data-open`, `data-closed`, `data-starting-style`, `data-ending-style`.
  - Trigger: `data-panel-open`.
- CSS vars: `--collapsible-panel-height`, `--collapsible-panel-width`.
- Trigger gets `aria-expanded` + `aria-controls` automatically (APG disclosure pattern).
- **Current Southpaw bug:** Panel only transitions to `h-0`, never to `var(--collapsible-panel-height)`, so opening snaps instead of animating.

## Feature matrix

| Feature                                        | shadcn                | Mantine                                          | Chakra                                   | MUI                                | AntD                                | GOV.UK         | Carbon                                           | Spectrum                            | Primer       | Ours (before)       |
| ---------------------------------------------- | --------------------- | ------------------------------------------------ | ---------------------------------------- | ---------------------------------- | ----------------------------------- | -------------- | ------------------------------------------------ | ----------------------------------- | ------------ | ------------------- |
| Controlled + uncontrolled                      | Yes                   | Spoiler both                                     | Yes                                      | `in` only                          | Yes                                 | Native         | `open`                                           | Yes                                 | `useDetails` | Yes                 |
| Disabled                                       | Yes                   | No                                               | Yes                                      | No                                 | `collapsible="disabled"`            | No             | Yes                                              | Yes                                 | No           | Unstyled            |
| Height animation                               | Primitive             | Yes                                              | Yes                                      | Yes                                | Yes                                 | No             | Yes                                              | CSS var                             | No           | **Broken on open**  |
| Horizontal / width                             | No                    | `orientation`                                    | `collapsedWidth`                         | `orientation`                      | No                                  | No             | No                                               | Partial                             | No           | No                  |
| Duration / easing props                        | No                    | `transitionDuration`, `transitionTimingFunction` | No                                       | `timeout` (incl. `auto`), `easing` | No                                  | No             | No                                               | CSS                                 | No           | No                  |
| Reduced motion                                 | –                     | ?                                                | ?                                        | `disablePrefersReducedMotion`      | ?                                   | n/a            | ?                                                | Example CSS                         | n/a          | No                  |
| Animate opacity                                | No                    | `animateOpacity`                                 | No                                       | No                                 | No                                  | No             | No                                               | No                                  | No           | No                  |
| Partial collapse ("show more")                 | No                    | Spoiler `maxHeight`                              | `collapsedHeight`                        | `collapsedSize`                    | Typography `ellipsis.rows`          | No             | ExpandableTile                                   | No                                  | No           | No                  |
| Dynamic show/hide labels                       | No                    | `showLabel` / `hideLabel`                        | No                                       | No                                 | `symbol(expanded)`                  | No             | `tileCollapsedLabel` / `tileExpandedLabel`       | No                                  | Guidance     | No                  |
| Hide toggle when content fits                  | No                    | Spoiler yes                                      | No                                       | No                                 | Yes                                 | –              | –                                                | –                                   | –            | No                  |
| Keep mounted / lazy / unmount                  | Primitive             | `keepMounted`, `keepMountedMode`                 | `lazyMount`, `unmountOnExit`, `hideMode` | `unmountOnExit`, `mountOnEnter`    | `destroyOnHidden`, `forceRender`    | No             | ?                                                | ?                                   | No           | Primitive           |
| `hidden="until-found"`                         | Primitive             | No                                               | No                                       | No                                 | No                                  | Native details | No                                               | Automatic                           | Native       | Not enabled         |
| Custom icon / position                         | Manual                | –                                                | `Indicator`                              | –                                  | `expandIcon`, `expandIconPlacement` | Fixed          | `renderToggle`, start/end guidance               | Manual                              | Manual       | Inline SVG in story |
| Icon-only vs whole-header trigger              | Manual                | –                                                | –                                        | –                                  | `collapsible="header"\|"icon"`      | Whole summary  | Tile corner button                               | Header + ActionButton               | –            | No                  |
| Heading-wrapped trigger                        | No                    | No                                               | No                                       | No                                 | No                                  | No             | Recommended                                      | `DisclosureTitle level` (default 3) | No           | No                  |
| Panel role                                     | Primitive             | Spoiler `region`                                 | ?                                        | No                                 | ?                                   | Native         | –                                                | `group` / `region`                  | Native       | None                |
| Variants / size / density                      | No                    | No                                               | No                                       | No                                 | `size`, `ghost`, `bordered`         | No             | flush                                            | `size`, `density`, `isQuiet`        | No           | No                  |
| Nested                                         | Demo                  | Yes                                              | ?                                        | –                                  | Yes                                 | No             | Discouraged                                      | Yes                                 | No           | Untested            |
| Transition callbacks                           | No                    | `onTransitionStart` / `onTransitionEnd`          | `onExitComplete`                         | Transition callbacks               | No                                  | No             | `handleAnimationEnd`                             | DOM                                 | No           | No                  |
| Separate screen-reader labels for icon toggles | –                     | `showAriaLabel` / `hideAriaLabel`                | –                                        | –                                  | –                                   | –              | `tileCollapsedIconText` / `tileExpandedIconText` | –                                   | –            | No                  |
| RTL                                            | Demo                  | ?                                                | ?                                        | ?                                  | ?                                   | –              | ?                                                | `dir`                               | ?            | Untested            |
| Forced colours                                 | Unverified everywhere |                                                  |                                          |                                    |                                     |                |                                                  |                                     |              | No                  |

## Accessibility guidance

- **[APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/):** the trigger is a button with `aria-expanded`; `aria-controls` is optional; Enter and Space toggle it. Base UI covers this.
- **Heading-wrapped trigger** (Carbon, React Aria): put the button inside an `h1`–`h6` that fits the page outline, so screen-reader users can navigate by heading. The trigger content must not contain other interactive elements.
- **Panel role** (React Aria): `group` by default, `region` (named by the trigger) for landmark-worthy sections. Mantine Spoiler uses `region`.
- **`hidden="until-found"`** (React Aria, enabled automatically): browser find-in-page and fragment links can reach collapsed content, and the panel opens on `beforematch`. Chromium supports it; elsewhere it falls back to normal hidden.
- **GOV.UK Details research:**
  - Some users don't open the summary because it looks like a link that would take them away.
  - Some voice-control users need to say "button" to operate it.
  - So the trigger should look like a control, not a text link, and summary text should be short and descriptive. Don't hide content most users need.
- **Icons** (Carbon): the chevron needs no text alternative because state is in `aria-expanded`. Icon-only toggles need their own accessible name, and Carbon and Mantine provide separate open/closed labels.
- **Chevron position** (Carbon): end by default; start for tree-like content, which is easier for low-vision users to find.
- **Primer progressive disclosure:**
  - The chevron flips down/up and can pair with text like "Show more".
  - Avoid toggles that are text only.

## In scope (rule: if 1 library has it, we do it)

| Feature                                                                                                                            | Source                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Fix open animation (height via `--collapsible-panel-height`), motion tokens, reduced motion                                        | All animated libs; Spectrum example                                  |
| Styled trigger with auto chevron that rotates; custom `icon`; `iconPosition` start/end; hide icon                                  | AntD, Carbon, Chakra Indicator, Primer                               |
| `headingLevel` on trigger (wraps in `h1`–`h6`)                                                                                     | Spectrum, Carbon                                                     |
| Header layout with extra actions; icon-only trigger mode                                                                           | AntD `collapsible="icon"` + `extra`, Spectrum DisclosureHeader       |
| `size` (sm/md/lg) + density; `variant` (default/ghost/bordered)                                                                    | AntD, Spectrum                                                       |
| Partial collapse: `collapsedHeight` with fade, "show more / show less" toggle with dynamic labels, toggle hidden when content fits | Mantine Spoiler, Chakra, MUI, AntD Typography, Carbon ExpandableTile |
| Horizontal orientation (width animation)                                                                                           | Mantine, MUI, Chakra                                                 |
| `animateOpacity`                                                                                                                   | Mantine                                                              |
| Duration / easing overrides                                                                                                        | Mantine, MUI                                                         |
| `keepMounted` / lazy mount / unmount on close; `hiddenUntilFound`                                                                  | Chakra, Mantine, MUI, AntD, Spectrum                                 |
| Panel `role` group/region labelled by the trigger                                                                                  | Spectrum, Mantine Spoiler                                            |
| Transition-complete callback                                                                                                       | Mantine, Chakra, MUI, Carbon                                         |
| Separate screen-reader labels for icon-only open/closed states                                                                     | Mantine Spoiler, Carbon                                              |
| Disabled styling; nested support; RTL; forced-colours chevron                                                                      | AntD, Spectrum, shadcn                                               |

## Sources

- [shadcn Collapsible (Base UI)](https://ui.shadcn.com/docs/components/base/collapsible)
- [Mantine Collapse](https://mantine.dev/core/collapse/), [Mantine Spoiler](https://mantine.dev/core/spoiler/)
- [Chakra Collapsible](https://www.chakra-ui.com/docs/components/collapsible)
- [MUI Collapse API](https://mui.com/material-ui/api/collapse/)
- [AntD Collapse](https://ant.design/components/collapse), [AntD Typography](https://ant.design/components/typography)
- [GOV.UK Details](https://design-system.service.gov.uk/components/details/)
- [Carbon Accordion usage](https://carbondesignsystem.com/components/accordion/usage/), [Carbon Accordion a11y](https://carbondesignsystem.com/components/accordion/accessibility/), [Carbon Tile](https://carbondesignsystem.com/components/tile/usage/)
- [React Aria Disclosure](https://react-aria.adobe.com/Disclosure), [Spectrum 2 Disclosure](https://react-spectrum.adobe.com/Disclosure)
- [Primer Details](https://primer.style/product/components/details/), [Primer progressive disclosure](https://primer.style/product/ui-patterns/progressive-disclosure/)
- [APG Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [Chrome: hidden=until-found](https://developer.chrome.com/articles/hidden-until-found/)
