# ScrollArea — Competitive Research

Researched: 2026-11-13 (supersedes the thin 2026-11-08 version, which only covered shadcn/Mantine/Chakra/Radix).

Libraries checked: shadcn, Mantine, Chakra v3, MUI, Ant Design, GOV.UK, Carbon, Spectrum (React Aria), Primer.
Only 3 have a dedicated ScrollArea (shadcn, Mantine, Chakra). Primer has `ScrollableRegion` (a11y wrapper, no custom scrollbar). The rest have scroll features scattered across Table/Tabs/Modal/Virtualizer, which still count toward scope.

## Base UI 1.9 baseline (what we get for free)

- Parts: Root, Viewport, Content, Scrollbar (`orientation`, `keepMounted`), Thumb, Corner.
- Root `overflowEdgeThreshold` (number or per-edge object).
- Data attributes: `data-scrolling`, `data-hovering` (scrollbar), `data-has-overflow-x/y`, `data-overflow-{x,y}-{start,end}`, `data-orientation`.
- CSS vars: `--scroll-area-overflow-{x,y}-{start,end}` (distance to edge, on Viewport), `--scroll-area-thumb-{width,height}`, `--scroll-area-corner-{width,height}`.
- Scrolling state clears 500ms after the last scroll (`SCROLL_TIMEOUT`, not configurable).
- Viewport gets `tabIndex=0` only when it overflows on some axis (`ScrollAreaViewport.js:284`), satisfying axe `scrollable-region-focusable`. **No role, no accessible name.**
- RTL-aware thumb positioning.

## Feature matrix

| Feature                            | shadcn       | Mantine                                                    | Chakra                          | MUI                     | AntD                                             | GOV.UK                                | Carbon              | Spectrum               | Primer                     | Ours (before)            |
| ---------------------------------- | ------------ | ---------------------------------------------------------- | ------------------------------- | ----------------------- | ------------------------------------------------ | ------------------------------------- | ------------------- | ---------------------- | -------------------------- | ------------------------ |
| Dedicated component                | Yes          | Yes + Autosize                                             | Yes                             | No                      | No                                               | No                                    | No                  | No (Virtualizer)       | Partial (ScrollableRegion) | Yes                      |
| Visibility modes                   | No           | `type` hover/scroll/auto/always/never                      | `variant` hover/always          | Tabs `visibleScrollbar` | No                                               | –                                     | No                  | No                     | No                         | No                       |
| Hide delay                         | No           | `scrollHideDelay`                                          | No                              | No                      | No                                               | –                                     | No                  | No                     | No                         | No                       |
| Scrollbar size                     | Fixed        | `scrollbarSize`                                            | `size` xs–lg                    | No                      | No                                               | –                                     | No                  | No                     | No                         | Fixed                    |
| Gutter / offset                    | No           | `offsetScrollbars` true/x/y/present                        | Partial (via size)              | No                      | No                                               | –                                     | No                  | No                     | No                         | No                       |
| Choose axes                        | Manual       | `scrollbars` x/y/xy/false                                  | Manual parts                    | –                       | Table `scroll.x/y`                               | –                                     | –                   | ListLayout orientation | No                         | Manual                   |
| Corner                             | Yes          | Implicit                                                   | Yes                             | –                       | –                                                | –                                     | –                   | –                      | –                          | Yes                      |
| Autosize to max height             | No           | `ScrollArea.Autosize` + `onOverflowChange`                 | No                              | –                       | Table `scroll.y`                                 | –                                     | –                   | –                      | –                          | No                       |
| Scroll shadows / fades             | No           | No                                                         | Example (mask-image)            | Joy Table demo          | No                                               | Wide-table indicator (gov publishing) | Prefers "Show more" | No                     | No                         | No                       |
| Position callbacks                 | No           | `onScrollPositionChange`, `onTop/Bottom/Left/RightReached` | Via store                       | No                      | No                                               | –                                     | –                   | Internal               | No                         | No                       |
| Viewport ref / programmatic scroll | Pass-through | `viewportRef`                                              | Store: scroll to side/position  | No                      | Table `ref.scrollTo`, `scrollToFirstRowOnChange` | –                                     | –                   | –                      | No                         | Pass-through             |
| Initial scroll position            | No           | `startScrollPosition`                                      | –                               | No                      | No                                               | –                                     | –                   | –                      | No                         | No                       |
| Overscroll behaviour               | No           | `overscrollBehavior`                                       | No                              | No                      | No                                               | –                                     | –                   | –                      | No                         | Hardcoded `contain`      |
| Stick to bottom (chat/logs)        | No           | No                                                         | Example (`use-stick-to-bottom`) | No                      | No                                               | –                                     | –                   | `anchorTo:'end'`       | No                         | No                       |
| Virtualization                     | No           | No                                                         | Example (TanStack Virtual)      | No                      | Table `virtual`                                  | –                                     | –                   | Virtualizer            | No                         | No                       |
| Sticky header                      | No           | No                                                         | No                              | Joy `stickyHeader`      | Table `sticky`                                   | –                                     | DataTable           | –                      | No                         | No                       |
| Focusable only when overflowing    | Base UI      | ?                                                          | ?                               | No                      | No                                               | MoJ: always                           | Modal               | ?                      | Yes                        | Base UI                  |
| `role=region` + required name      | No           | No                                                         | No                              | No                      | No                                               | MoJ: MUST                             | Modal               | No                     | Yes (label XOR labelledby) | No                       |
| Visible focus on viewport          | Yes (ring)   | ?                                                          | ?                               | –                       | –                                                | –                                     | Flagged missing     | –                      | –                          | No                       |
| RTL                                | Yes          | `verticalScrollbarPosition`                                | Yes                             | –                       | –                                                | –                                     | –                   | –                      | –                          | Base UI                  |
| Forced colours / HCM               | No           | No                                                         | No                              | No                      | No                                               | –                                     | –                   | –                      | No                         | No                       |
| Reduced-motion smooth scroll       | No           | No                                                         | No                              | No                      | No                                               | –                                     | –                   | –                      | No                         | No                       |
| Themed tokens                      | Yes          | Styles API                                                 | `colorPalette`                  | –                       | –                                                | –                                     | –                   | –                      | –                          | No (hardcoded neutral-*) |

## Accessibility guidance

- **WCAG 2.1.1 / axe `scrollable-region-focusable`:** a scrollable region must be keyboard-reachable. Base UI handles this (tabIndex 0 only while overflowing). Firefox makes scroll containers focusable natively; Chromium and Safari don't.
- **Gate focusability on overflow** (Primer, Carbon). An always-focusable region is a pointless tab stop.
- **Name the region** (Primer, Carbon Modal, MoJ). Primer and Carbon add `role="region"` + `aria-label`/`aria-labelledby` only while overflowing. A focusable unnamed div announces as nothing useful; a `region` without a name is ignored by screen readers.
- **Visible focus indicator** on the viewport (shadcn). Our two-tone `sp-focus-ring` is an outset box-shadow and would be clipped by the Root's `overflow: hidden`, so it needs an inset variant.
- **Gaps nobody fills:** forced-colours scrollbar thumb (custom thumbs vanish in Windows HCM unless they use system colours), and honouring `prefers-reduced-motion` for programmatic smooth scroll.

## In scope (rule: if 1 library has it, we do it)

| Feature                                                          | Source                      | Notes                                                                   |
| ---------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| `type` visibility modes (auto/always/hover/scroll/never)         | Mantine, Chakra             | via `data-hovering` / `data-scrolling`                                  |
| `scrollHideDelay`                                                | Mantine                     | CSS var as transition-delay on fade-out                                 |
| `size` (sm/md/lg)                                                | Mantine, Chakra             | density-aware thickness                                                 |
| `offsetScrollbars` (true/x/y/present)                            | Mantine                     | gutter so scrollbar doesn't overlap content                             |
| `scrollbars` axes (x/y/xy/false) auto-rendering bars + corner    | Mantine                     | compound parts still exported for custom layouts                        |
| Autosize (`maxHeight`/content-sized) + `onOverflowChange`        | Mantine, AntD               | Combobox/Menu lists need this                                           |
| Edge fades / shadows                                             | Chakra, Joy, gov publishing | mask-image driven by Base UI overflow vars                              |
| `onScrollPositionChange`, `onTop/Bottom/Left/RightReached`       | Mantine                     | infinite loading in Combobox                                            |
| `viewportRef` + imperative `scrollTo` / `scrollIntoView(el)`     | Mantine, Chakra, AntD       | ticket's "scroll-to-element"; Combobox keeps highlighted option visible |
| `startScrollPosition`                                            | Mantine                     |                                                                         |
| `overscrollBehavior`                                             | Mantine                     | currently hardcoded `contain`                                           |
| Stick to bottom (`anchor="end"`)                                 | Chakra, Spectrum            | chat/log use cases                                                      |
| Sticky header support                                            | Joy, AntD, Carbon           | story + verify sticky works inside Content                              |
| Virtualization compatibility                                     | Chakra, AntD, Spectrum      | expose viewport element; demo needs a dependency                        |
| `role=region` + name while overflowing, dev warning when unnamed | Primer, Carbon, MoJ         |                                                                         |
| Inset focus ring on viewport                                     | shadcn                      |                                                                         |
| Forced-colours thumb, reduced-motion smooth scroll               | Gap                         | our differentiator                                                      |
| Semantic tokens + density                                        | All themed libs             | replace neutral-*                                                       |

## Sources

- [shadcn ScrollArea (Base UI)](https://ui.shadcn.com/docs/components/base/scroll-area)
- [Mantine ScrollArea](https://mantine.dev/core/scroll-area/)
- [Chakra ScrollArea](https://chakra-ui.com/docs/components/scroll-area)
- [MUI Tabs](https://mui.com/material-ui/react-tabs/), [MUI Dialog](https://mui.com/material-ui/react-dialog/), [Joy Table](https://v7.mui.com/joy-ui/react-table/)
- [AntD Table](https://ant.design/components/table), [AntD List](https://ant.design/components/list)
- [GOV.UK Table](https://design-system.service.gov.uk/components/table/), [MoJ scrollable pane](https://design-patterns.service.justice.gov.uk/components/scrollable-pane), [govuk_publishing_components #5827](https://github.com/alphagov/govuk_publishing_components/issues/5827)
- [Carbon overflow content](https://carbondesignsystem.com/patterns/overflow-content/), [Carbon Modal.tsx](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Modal/Modal.tsx)
- [React Aria Virtualizer](https://react-aria.adobe.com/Virtualizer)
- [Primer ScrollableRegion](https://github.com/primer/react/tree/main/packages/react/src/ScrollableRegion)
- [Base UI ScrollArea](https://base-ui.com/react/components/scroll-area)
- [axe scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.5/scrollable-region-focusable)
