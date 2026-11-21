# Accordion — Competitive Research

Researched: 2026-11-14. Replaces the thin 2026-11-08 version, which covered 6 libraries with no GOV.UK, Carbon or Primer.

Libraries checked: shadcn (Base UI), Mantine, Chakra v3, MUI, Ant Design (Collapse), GOV.UK, Carbon, Spectrum 2 / React Aria (Accordion, DisclosureGroup), Primer.

## Base UI 1.9 baseline

- Root: `value` / `defaultValue` (arrays), `onValueChange`, `multiple`, `disabled`, `hiddenUntilFound`, `keepMounted`.
- Item: `value`, `disabled`, `onOpenChange`.
- Header renders `<h3>`.
- Panel exposes `--accordion-panel-height` / `--accordion-panel-width`.
- Data attributes: `data-open`, `data-disabled`, `data-index`, and `data-panel-open` on the Trigger.
- `orientation` and `loopFocus` are **deprecated**: arrow-key roving focus was removed following [APG PR #3434](https://github.com/w3c/aria-practices/pull/3434), merged 2026-04-29.
- **Current Southpaw bug:** like Collapsible had, the Panel only transitions to `h-0` and never to `--accordion-panel-height`, so it snaps open. Colours are hardcoded `neutral-*`.

## Feature matrix

| Feature                                            | shadcn                 | Mantine                                     | Chakra                                   | MUI                       | AntD                             | GOV.UK                                 | Carbon                  | Spectrum                        | Primer                         | Ours (before)     |
| -------------------------------------------------- | ---------------------- | ------------------------------------------- | ---------------------------------------- | ------------------------- | -------------------------------- | -------------------------------------- | ----------------------- | ------------------------------- | ------------------------------ | ----------------- |
| Single / multiple                                  | Yes                    | Yes                                         | Yes                                      | Manual                    | `accordion`                      | Multiple only                          | Multiple only           | `allowsMultipleExpanded`        | –                              | Yes               |
| Prevent closing last open (single)                 | No                     | `disableCollapse`                           | `collapsible` (default false)            | –                         | No                               | –                                      | –                       | No                              | –                              | No                |
| Expand / collapse all                              | No                     | No                                          | No                                       | No                        | No                               | **"Show all sections"**                | No                      | No                              | –                              | No                |
| Per-item / root disabled                           | Yes / Yes              | Yes / No                                    | Yes / Yes                                | Yes / –                   | Yes / No                         | No                                     | Yes / Yes               | Yes / Yes                       | –                              | Unstyled          |
| Variants                                           | Borders, Card examples | default/contained/filled/separated          | outline/subtle/enclosed/plain            | gutters, square           | bordered, ghost                  | –                                      | flush                   | quiet                           | –                              | Divider only      |
| Sizes / density                                    | No                     | radius                                      | sm/md/lg                                 | –                         | small/medium/large               | –                                      | sm/md/lg                | S–XL + compact/regular/spacious | –                              | No                |
| Chevron position                                   | No                     | `chevronPosition`                           | No                                       | No                        | `expandIconPlacement`            | –                                      | `align`                 | No                              | –                              | No                |
| Custom icon / no rotation / hide                   | Composition            | `chevron`, `disableChevronRotation`, `null` | ItemIndicator                            | `expandIcon`              | `expandIcon`, `showArrow`        | Fixed                                  | `renderToggle`          | Composition                     | –                              | No                |
| Leading icon per item                              | No                     | `Control icon`                              | Icon/Avatar examples                     | No                        | No                               | No                                     | No                      | No                              | RiverAccordion `leadingVisual` | No                |
| Heading level                                      | Fixed h3               | `order` 2–6                                 | ?                                        | `slotProps.heading` (h3)  | No                               | `headingLevel` (h2)                    | None (div)              | `level` (h3)                    | –                              | Fixed h3          |
| Summary / subtitle line                            | No                     | No                                          | "With Subtext"                           | No                        | No                               | **`summary`**                          | No                      | No                              | –                              | No                |
| Header actions                                     | No                     | Beside control                              | "With Actions"                           | `AccordionActions` (body) | `extra`                          | No                                     | No                      | ActionButton in header          | –                              | No                |
| Lazy / unmount / keepMounted                       | `keepMounted`          | `keepMounted`, mode                         | `lazyMount`, `unmountOnExit`, `hideMode` | `unmountOnExit`           | `destroyOnHidden`, `forceRender` | –                                      | No                      | ?                               | –                              | Base              |
| Find-in-page (`until-found`)                       | Yes                    | No                                          | ?                                        | No                        | No                               | Yes                                    | No                      | ?                               | –                              | Off               |
| Remember open state                                | No                     | No                                          | No                                       | No                        | No                               | **sessionStorage, `rememberExpanded`** | No                      | No                              | –                              | No                |
| Arrow / Home / End keys                            | Removed                | `loop`                                      | ?                                        | No                        | ?                                | No                                     | No (Tab)                | ?                               | –                              | Base (deprecated) |
| Transition / reduced motion                        | CSS var                | `transitionDuration`                        | ?                                        | `slots.transition`        | ?                                | –                                      | `handleAnimationEnd`    | CSS example                     | –                              | Broken            |
| Numbered (ordered)                                 | No                     | No                                          | No                                       | No                        | No                               | No                                     | **`ordered` → `<ol>`**  | No                              | –                              | No                |
| Skeleton                                           | No                     | No                                          | No                                       | No                        | No                               | No                                     | **`AccordionSkeleton`** | No                              | –                              | No                |
| Show/Hide text beside chevron, localisable strings | –                      | –                                           | –                                        | –                         | –                                | **Yes**                                | No                      | –                               | –                              | No                |
| RTL                                                | Example                | ?                                           | ?                                        | ?                         | ?                                | –                                      | ?                       | ?                               | –                              | Untested          |
| Forced colours                                     | Unverified everywhere  |                                             |                                          |                           |                                  |                                        |                         |                                 |                                | No                |

## Accessibility guidance

- **[APG Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)**:
  - The trigger is a button and the only content of a heading at the right `aria-level`, with `aria-expanded` and `aria-controls`.
  - A panel that is not allowed to collapse gets `aria-disabled="true"` on its trigger. That applies to Mantine `disableCollapse` and Chakra's default.
  - Enter and Space toggle. **Tab and Shift+Tab move between headers.**
- **APG change ([#3434](https://github.com/w3c/aria-practices/pull/3434)):** the optional arrow, Home and End keys were removed and headers are no longer a roving focus group. Base UI deprecated its roving focus for this reason. Mantine's `loop` now goes against APG.
- **Region role:** panels _may_ be `role="region"` labelled by the trigger. APG advises against it when many panels could be open at once (more than about 6), because it floods the landmark list.
- **GOV.UK research:**
  - Don't use an accordion for content everyone needs; try headings and anchor links first.
  - Don't nest accordions or use them for a series of questions.
  - Keep summary lines short, since they lengthen the button name.
  - Visually hidden "Show this section" / "Hide this section" text joins the button's name.
  - Without JavaScript, every section shows.
- **Heading level defaults differ:** GOV.UK uses h2; Base UI, MUI and Spectrum use h3. Carbon's React component renders no heading at all, despite its own guidance.
- **Carbon guidance:**
  - Chevron at the end by default; at the start for tree-like content.
  - Flush suits side panels.
  - Panels shouldn't scroll internally.
  - Use a TreeView for deep nesting.

## Proposed scope (rule: if 1 library has it, we do it)

| Feature                                                                                            | Source                                  |
| -------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Fix open animation; motion tokens; reduced motion; duration/easing overrides; completion callback  | All; Mantine, MUI, Carbon               |
| Reuse Collapsible's trigger, chevron, sizes and content padding (`collapsibleStyles`)              | Lane plan                               |
| Variants: `default` (dividers), `bordered`/contained, `separated` (cards), `filled`, `ghost`/flush | Mantine, Chakra, AntD, Carbon, Spectrum |
| `size` sm/md/lg + density                                                                          | Chakra, AntD, Carbon, Spectrum          |
| Chevron position start/end; custom, stateful or hidden icon; leading icon per item                 | Mantine, AntD, Carbon, Chakra           |
| `headingLevel` (Root default + per item)                                                           | Mantine, MUI, GOV.UK, Spectrum          |
| Summary / subtitle line under the title                                                            | GOV.UK, Chakra                          |
| Header actions beside the trigger                                                                  | AntD, Chakra, Spectrum                  |
| Expand / collapse all toggle with localisable labels                                               | GOV.UK                                  |
| Remember open state (sessionStorage, opt-in key)                                                   | GOV.UK                                  |
| Prevent closing the last open item in single mode (`aria-disabled`)                                | Mantine, Chakra                         |
| `hiddenUntilFound` default on; `keepMounted` / unmount opt-outs                                    | Base UI, GOV.UK, Chakra, AntD           |
| Optional panel `role="region"` (off by default, per APG)                                           | APG, Spectrum                           |
| Numbered items (`<ol>` semantics)                                                                  | Carbon                                  |
| Skeleton loading state                                                                             | Carbon                                  |
| Optional "Show / Hide" text beside the chevron                                                     | GOV.UK                                  |
| Per-item & root disabled styling; RTL; forced-colours                                              | All                                     |

**Not proposed:**

- Arrow, Home and End navigation between headers (Mantine `loop`): removed from APG in 2026 and deprecated in Base UI.
- Opening an item from the URL hash: no library verifiably does it.

## Sources

- [shadcn Accordion (Base UI)](https://ui.shadcn.com/docs/components/base/accordion), [Base UI Accordion](https://base-ui.com/react/components/accordion)
- [Mantine Accordion](https://mantine.dev/core/accordion/)
- [Chakra Accordion](https://chakra-ui.com/docs/components/accordion)
- [MUI Accordion](https://mui.com/material-ui/react-accordion/), [MUI Accordion API](https://mui.com/material-ui/api/accordion/)
- [AntD Collapse](https://ant.design/components/collapse)
- [GOV.UK Accordion](https://design-system.service.gov.uk/components/accordion/)
- [Carbon Accordion usage](https://carbondesignsystem.com/components/accordion/usage/)
- [Spectrum 2 Accordion](https://react-spectrum.adobe.com/Accordion), [React Aria DisclosureGroup](https://react-aria.adobe.com/DisclosureGroup)
- [Primer Details](https://primer.style/product/components/details/)
- [APG Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/), [APG PR #3434](https://github.com/w3c/aria-practices/pull/3434)
