# Tooltip — Competitive Research

Researched: 2026-11-08. Redone in full across all 9 libraries + Base UI on 2026-11-13 (GEO-919).

## Baseline: what Base UI 1.9 gives us

- Parts: Provider, Root, Trigger, Portal, Positioner, Popup, Arrow, Viewport, `createHandle()`.
- Provider: shared `delay`, `closeDelay`, `timeout` (400ms). Once one tooltip is open, neighbours open instantly (warm-up / cool-down).
- Trigger: `delay` (600ms), `closeDelay` (0), `closeOnClick` (true), `disabled`, `payload`, `handle`.
- Root: `open` / `defaultOpen` / `onOpenChange`, `disabled`, `trackCursorAxis` (follow cursor), `disableHoverablePopup` (hoverable by default, which meets WCAG 1.4.13), `actionsRef`, detached and multiple triggers.
- Positioner: `side` × `align` (12 placements), offsets, collision flip/shift, `data-anchor-hidden`.
- Popup: `data-instant` (skip the transition when the group is warm), `data-starting-style` / `data-ending-style`, `--transform-origin`.
- Escape closes. Opens on hover and on keyboard focus.
- **Touch: deliberately disabled.** Tooltips never open on touch.
- **A11y: visual-only.** I verified in the source: there is no `role="tooltip"` and no `aria-describedby` / `aria-labelledby` wiring. Base UI tells you to put an `aria-label` on the trigger that matches the tooltip text.

## Feature comparison

| Feature                                        | shadcn | Mantine | Chakra  | MUI                             | Ant            | GOV.UK | Carbon   | Spectrum                             | Primer                | Ours (now) |
| ---------------------------------------------- | ------ | ------- | ------- | ------------------------------- | -------------- | ------ | -------- | ------------------------------------ | --------------------- | ---------- |
| Open/close delay                               | Base   | Yes     | Yes     | Yes                             | Yes            | —      | Yes      | Yes                                  | Yes                   | Base only  |
| Group warm-up (neighbours open instantly)      | Yes    | Yes     | —       | Yes                             | Yes            | —      | —        | Yes                                  | —                     | Base only  |
| Instant open on keyboard focus                 | —      | —       | —       | —                               | —              | —      | —        | Yes                                  | —                     | No         |
| Entry/exit animation                           | Yes    | Yes     | Yes     | Yes                             | Yes            | —      | —        | Yes                                  | —                     | Fade only  |
| Skip animation when group is warm              | Yes    | —       | —       | —                               | —              | —      | —        | Yes                                  | —                     | No         |
| Arrow                                          | Yes    | Yes     | Yes     | Yes                             | Yes            | —      | Yes      | Yes                                  | Yes                   | Unstyled   |
| Arrow configuration (size/offset/point-centre) | —      | Yes     | —       | —                               | Yes            | —      | —        | —                                    | —                     | No         |
| 12 placements + collision flip                 | Yes    | Yes     | Yes     | Yes                             | Yes            | —      | Yes      | Yes                                  | Yes                   | Yes        |
| Hide when trigger scrolls out of view          | —      | Yes     | —       | —                               | —              | —      | —        | —                                    | —                     | No         |
| Colour variants                                | —      | Yes     | CSS var | —                               | Yes            | —      | HC/light | Yes (neutral/positive/negative/info) | —                     | No         |
| Leading icon                                   | —      | —       | —       | —                               | —              | —      | —        | Yes                                  | —                     | No         |
| Max width + multiline wrap                     | —      | Yes     | —       | Yes (300)                       | Yes (250)      | —      | Yes      | —                                    | Yes                   | No         |
| Keyboard shortcut hint                         | Yes    | —       | —       | —                               | —              | —      | —        | —                                    | Yes                   | No         |
| Label vs description semantics                 | —      | —       | —       | Yes                             | —              | —      | Yes      | Yes                                  | Yes                   | No         |
| `role="tooltip"` + ARIA wiring                 | —      | Yes     | Yes     | Yes                             | Yes            | —      | Yes      | Yes                                  | Yes                   | **No**     |
| Hoverable popup (WCAG 1.4.13)                  | Base   | Opt-in  | Opt-in  | Yes                             | Yes            | —      | Yes      | —                                    | Yes                   | Base only  |
| Follow cursor                                  | —      | Yes     | —       | Yes                             | —              | —      | —        | —                                    | —                     | Base only  |
| Close on trigger click                         | Base   | —       | Yes     | —                               | —              | —      | Yes      | Yes                                  | —                     | Base only  |
| Touch: long-press to show                      | —      | Opt-in  | —       | Yes (700ms, hides after 1500ms) | —              | —      | —        | —                                    | —                     | No         |
| Disabled-trigger pattern                       | Yes    | —       | —       | Yes                             | —              | —      | —        | Says don't                           | Yes (`aria-disabled`) | No         |
| Controlled / detached / multiple triggers      | Base   | Yes     | Yes     | Yes                             | Yes            | —      | Yes      | Yes                                  | —                     | Base only  |
| Animate between triggers (one shared tooltip)  | Base   | —       | —       | —                               | Yes (`unique`) | —      | —        | Yes (one at a time)                  | —                     | No story   |
| Simple one-line API (`label` / `content`)      | —      | Yes     | Yes     | Yes                             | Yes            | —      | Yes      | —                                    | Yes                   | No         |
| Definition tooltip (dotted-underline term)     | —      | —       | —       | —                               | —              | —      | Yes      | —                                    | —                     | No         |
| RTL                                            | Yes    | Yes     | Yes     | Yes                             | Yes            | —      | Yes      | Yes                                  | Yes                   | Base       |

"Base" means the primitive supports it but we neither style it nor show it in a story.

## Library notes

- **shadcn**: a thin wrapper over Base UI. `TooltipContent` bundles Portal + Positioner + Popup + Arrow. Has a keyboard-shortcut example (uses Kbd). Wraps a disabled button in a `span`.
- **Mantine**: `label` prop API. `withArrow`, `arrowSize`, `arrowOffset`, `arrowPosition` (center/side/merge), `arrowRadius`. `multiline` + `w`. `color`. `events: {hover, focus, touch}`. `Tooltip.Floating` (follows the cursor). `Tooltip.Group` (shared delays). `hideDetached`. `interactive` is opt-in.
- **Chakra**: `openDelay` 400 / `closeDelay` 150. `closeOnClick`, `closeOnPointerDown`, `closeOnScroll`, `closeOnEscape`. `interactive`. `showArrow`. `--tooltip-bg` var.
- **MUI**: `enterDelay` 100, `enterNextDelay`, `leaveDelay`. Touch long-press: `enterTouchDelay` 700, `leaveTouchDelay` 1500. `describeChild` switches label to description. `followCursor`. Interactive by default (WCAG 1.4.13), and `disableInteractive` is documented as failing AA. Max width ~300px.
- **Ant Design**: 12 placements. `arrow` is on by default, with `{ pointAtCenter }`. Preset and custom `color`. Delays 100ms / 100ms. `trigger` hover/focus/click/contextMenu. `fresh`, `destroyOnHidden`. Max width 250. `ConfigProvider tooltip.unique` (one tooltip that moves between triggers).
- **GOV.UK**: no tooltip component. Uses Details, Inset text and Hint text so that information is always visible. This informs our docs guidance: never put essential information in a tooltip.
- **Carbon**: `label` → `aria-labelledby`, otherwise `aria-describedby`. Delays 100 / 300. `closeOnActivation`. `highContrast` (default true) vs light. `dropShadow`. Separate **DefinitionTooltip** (dotted-underline term, opens on hover or click). **Toggletip** for interactive content (click-to-open = our Popover).
- **Spectrum**: `variant` neutral / positive / negative / info, plus `showIcon`. Delay 1500, but **instant on keyboard focus**. Warm-up / cool-down, one open at a time. `shouldCloseOnPress`. `isDisabled`. Says not to put tooltips on plain text or disabled elements; use ContextualHelp instead.
- **Primer**: `type="label" | "description"` (aria-labelledby vs aria-describedby, tooltip text `aria-hidden`). `keybindingHint`. `delay` short 50 / medium 400 / long 1200. 8 directions. Guidance: last resort, interactive triggers only, use `aria-disabled` rather than `disabled` if a tooltip must sit on a disabled control, 4.5:1 contrast, readable at 320px / 400% zoom.

## Motion guidance: Emil Kowalski (`emil-design-eng` skill)

Source: https://github.com/emilkowalski/skills (`skills/emil-design-eng/SKILL.md`)

- **Delay first, then instant**: "Tooltips should delay before appearing to prevent accidental activation" and "once one tooltip is open, hovering over adjacent tooltips should open them instantly with no animation." This maps directly to Base UI's Provider group and `[data-instant]`.
- **Duration**: 125ms on `transform` + `opacity`. Tooltips and small popovers sit in the 125–200ms band, and all UI animation stays under 300ms. Exits should be faster than entrances.
- **Start values**: never animate from `scale(0)`. Tooltips start at `scale(0.97)` + `opacity: 0`.
- **Origin-aware**: scale from the trigger via `transform-origin: var(--transform-origin)`, not from the centre.
- **Easing**: ease-out for enter and exit, never ease-in. Our `--sp-easing-default` (`cubic-bezier(0.23, 1, 0.32, 1)`) is already his curve.
- **Keyboard**: "Never animate keyboard-initiated actions." Base UI sets `data-instant="focus"` when a tooltip opens from keyboard focus, so the `[data-instant]` → 0ms rule covers this too.
- **Reduced motion**: "fewer and gentler, not zero". Keep opacity, drop movement. Note: our shared motion tokens currently zero **all** durations under `prefers-reduced-motion`, so the fade disappears too. That is a library-wide token question, out of this lane's scope; flagged to George.

Corroborating sources on timing: master.dev "Tooltips need a delay, and then they need to skip it" (200ms delay, 300ms warm window); Close.io `smart-tooltip-delay` (600ms first, instant after, reset after 2.5s idle); SAP Fiori timing guidance.

## Proposed scope (if even 1 library has it, it's in)

1. **Semantic inverse styling**: dark-on-light / light-on-dark using existing tokens (`bg-fg-default text-surface-base`) instead of `bg-accent`, which is reserved for UI controls. Add a border in high-contrast. Use `max-w-xs` with wrapping, and density-aware padding and text size.
2. **Styled Arrow**: matches the popup fill (and border in HC). Configurable via `className` / Base UI arrow props.
3. **Animation**: fade + small scale from `--transform-origin` using motion tokens. Skip it under `data-instant` (warm group, focus, dismiss). Reduced motion is already zeroed by tokens.
4. **Delays**: library defaults on `Tooltip.Provider`, plus instant open on keyboard focus (Spectrum).
5. **A11y wiring** (fills the Base UI gap): `role="tooltip"` and an id on Popup, plus `aria-describedby` (default) or `aria-labelledby` (`type="label"`) on the Trigger. Follows Primer, Carbon and MUI.
6. **`Tooltip.Content` convenience part**: Portal + Positioner + Popup + Arrow, with `side`, `align`, `sideOffset` and `arrow` props (shadcn, Mantine, MUI, Ant). Raw parts stay exported.
7. **Colour variants**: `neutral` (default), `danger`, `success` (Spectrum, Ant, Mantine). `info` needs a new token (see question 2).
8. **Leading icon** slot (Spectrum `showIcon`).
9. **Keyboard shortcut hint** (Primer, shadcn); see question 3.
10. **Hide when anchor is hidden** (Mantine `hideDetached`) via `data-anchor-hidden`.
11. **Touch long-press** (MUI 700ms show / 1500ms hide; Mantine opt-in); see question 1.
12. **Stories** showing: placements (12), group warm-up, follow cursor, close-on-click, controlled, detached / multiple triggers, animated shared tooltip (Viewport), disabled-trigger pattern (`focusableWhenDisabled` / `aria-disabled`), icon-button label, density, themes × variants.

### Considered, not proposed

- **Definition tooltip (Carbon)**: it puts a tooltip on a term in running text. Primer and Spectrum both say never put tooltips on non-interactive elements, and Carbon itself renders the term as a button. Proposed instead as a story: an inline `Button variant="link"`-style trigger with a dotted underline. No new part.
- **Toggletip (Carbon) / interactive content**: this is Popover (`openOnHover`) territory. Docs will point there.
- **Mantine's 24 transition presets**: one well-tuned motion matches the rest of the library (Emil's principles).

## Sources

- Base UI Tooltip — https://base-ui.com/react/components/tooltip (+ `@base-ui/react@1.9.0` source)
- shadcn — https://ui.shadcn.com/docs/components/tooltip
- Mantine — https://mantine.dev/core/tooltip/
- Chakra — https://chakra-ui.com/docs/components/tooltip
- MUI — https://mui.com/material-ui/react-tooltip/ , https://mui.com/material-ui/api/tooltip/
- Ant Design — https://ant.design/components/tooltip
- GOV.UK — https://design-system.service.gov.uk/components/
- Carbon — https://carbondesignsystem.com/components/tooltip/usage/ , `carbon/packages/react/src/components/Tooltip/Tooltip.tsx`
- Spectrum — https://react-spectrum.adobe.com/react-spectrum/Tooltip.html
- Primer — https://primer.style/product/components/tooltip/ (+ /guidelines, /accessibility)
- WAI-ARIA APG Tooltip pattern — https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
