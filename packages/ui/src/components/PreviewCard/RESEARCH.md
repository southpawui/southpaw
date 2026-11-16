# PreviewCard — Competitive Research

Researched: 2026-11-08. Redone in full across all 9 libraries + Base UI on 2026-11-16 (GEO-921).

## Baseline: what Base UI 1.9 gives us

- **Parts**:
  - Root
  - Trigger (renders an `<a>`)
  - Portal (`keepMounted`, `container`)
  - Backdrop
  - Positioner (side/align/offsets/collision/sticky/`positionMethod`)
  - Popup
  - Viewport (animated content switching between triggers)
  - Arrow
  - `createHandle()` (detached triggers; `open(triggerId)` / `close()`)
- **Delays** live on the Trigger: `delay` (default 600ms) and `closeDelay` (default 300ms). There is no Provider or warm group.
- **Opening**: hover and keyboard focus on the trigger. It stays open while the pointer moves into the popup (safe polygon, WCAG 1.4.13). Escape closes it.
- **Payload**: a detached trigger passes `payload`, and Root children can be a render function of it. One card can serve a list of links.
- **Change reasons**: `trigger-hover`, `trigger-focus`, `trigger-press`, `outside-press`, `escape-key`, `imperative-action`.
- **CSS vars**: `--transform-origin`, `--anchor-width/height`, `--available-width/height`.
- **Data attributes**: `data-side`, `data-align`, `data-anchor-hidden`, `data-starting-style`, `data-ending-style`, plus `data-instant` / `data-activation-direction` on Viewport.
- **A11y position (Base UI docs)**: "The link is the only accessible interface." The popup isn't reachable by touch, keyboard or screen-reader navigation. It is a visual enhancement, so essential information must live on the linked page.

## Feature comparison

| Feature                                   | shadcn (Base/Radix)         | Mantine                                             | Chakra                             | MUI                        | Ant                           | GOV.UK | Carbon                | Spectrum | Primer                                     | Ours (now)                              |
| ----------------------------------------- | --------------------------- | --------------------------------------------------- | ---------------------------------- | -------------------------- | ----------------------------- | ------ | --------------------- | -------- | ------------------------------------------ | --------------------------------------- |
| Dedicated hover card                      | HoverCard                   | HoverCard                                           | HoverCard                          | — (Popover + mouse events) | Popover `trigger="hover"`     | —      | Popover open-on-hover | —        | — (GitHub hovercards, not in Primer React) | Yes (unstyled)                          |
| Open / close delay                        | Yes (`delay`, `closeDelay`) | Yes                                                 | Yes (600 / 300)                    | manual                     | Yes (100 / 100ms)             | —      | —                     | —        | —                                          | Base defaults, not styled or documented |
| Shared delays across cards (group)        | —                           | `HoverCard.Group`                                   | —                                  | —                          | —                             | —      | —                     | —        | —                                          | No                                      |
| Multiple triggers → one card              | —                           | —                                                   | Yes (`value` on Trigger)           | —                          | —                             | —      | —                     | —        | —                                          | Base only (handle + payload)            |
| Open on focus                             | Yes                         | Yes (`events.focus`)                                | No (docs: not keyboard accessible) | —                          | `trigger="focus"`             | —      | Enter/Space           | —        | —                                          | Base                                    |
| Open on touch                             | —                           | Opt-in (`events.touch`)                             | —                                  | —                          | `click`                       | —      | —                     | —        | —                                          | No                                      |
| Trigger modes (hover/focus/click/context) | —                           | hover/focus/touch                                   | —                                  | —                          | hover/focus/click/contextMenu | —      | hover/click           | —        | —                                          | hover+focus                             |
| Disabled                                  | —                           | Yes                                                 | `disabled`                         | —                          | —                             | —      | —                     | —        | —                                          | No                                      |
| Arrow                                     | Yes                         | `withArrow`                                         | Arrow + ArrowTip                   | —                          | `arrow`, `pointAtCenter`      | —      | caret                 | —        | —                                          | Unstyled                                |
| Placement + collision                     | side/align                  | `position`, `offset`                                | `positioning`                      | anchorOrigin               | 12 placements                 | —      | auto-align            | —        | —                                          | Base                                    |
| Sizes / width                             | fixed                       | `width`                                             | `size` xs–lg                       | —                          | —                             | —      | —                     | —        | —                                          | Fixed `w-64`                            |
| Lazy mount / unmount on exit              | —                           | `keepMounted`                                       | `lazyMount`, `unmountOnExit`       | —                          | `destroyOnHidden`             | —      | —                     | —        | —                                          | Base (`keepMounted`)                    |
| Hide when trigger scrolled away           | —                           | `hideDetached`                                      | —                                  | —                          | —                             | —      | —                     | —        | —                                          | No                                      |
| Animated content switch between triggers  | —                           | —                                                   | —                                  | —                          | —                             | —      | —                     | —        | —                                          | Base Viewport, unstyled                 |
| Role / ARIA wiring                        | none                        | `role="dialog"` (aria-haspopup/expanded/controls)   | none                               | —                          | —                             | —      | —                     | —        | —                                          | none                                    |
| Focus trap                                | —                           | Docs say don't use                                  | —                                  | —                          | —                             | —      | —                     | —        | —                                          | No                                      |
| Interactive content                       | yes (hoverable)             | `interactive`                                       | yes                                | —                          | yes                           | —      | yes (links, buttons)  | —        | —                                          | Base (hoverable)                        |
| Dismiss: Escape / outside press           | Yes                         | `closeOnEscape`, `closeOnClickOutside`, `onDismiss` | outside callbacks                  | —                          | —                             | —      | outside click         | —        | —                                          | Base                                    |
| RTL                                       | Yes                         | Yes                                                 | Yes                                | Yes                        | Yes                           | —      | Yes                   | —        | —                                          | Base (logical sides)                    |
| Themed colours                            | tokens                      | tokens                                              | tokens                             | elevation                  | `color`                       | —      | layer / inverse       | —        | —                                          | **hard-coded `neutral-*` / `bg-white`** |

## Guidance worth carrying into the docs

- **Base UI, Chakra, Mantine**: hover cards are for supplementary information only. The popup isn't reliably reachable by keyboard, screen reader or touch, so the trigger must work on its own (it's a real link).
- **Mantine**: focus can't move into a portalled card. Don't use `trapFocus`. Any interactive content must also be available elsewhere.
- **Carbon**: hover popovers may contain links, buttons and rich media. Avoid nesting popovers.
- **GOV.UK, Spectrum**: no hover cards. GOV.UK uses Details (click to reveal) for extra information, and Spectrum's ContextualHelp is click-triggered. Both point to explicit, click-based disclosure when the content matters.
- **Primer**: no hover card in Primer React. GitHub's user/repo hovercards are product-level enhancements on top of real links.

Conclusion: the PreviewCard is a supplementary preview on a real link. It has no focus trap, its essential content is duplicated on the destination, and the click/tap behaviour of the link always wins.

## About the ticket title ("focus trap, trigger modes")

- **Focus trap: not proposed.** No library ships one for hover cards, and Mantine explicitly says not to. Trapping focus inside a hover-opened card would steal focus from a user who only moved the mouse. Click-triggered, focus-managed content is our Popover; a modal one is Dialog.
- **Trigger modes**:
  - hover and focus come from Base UI;
  - touch is proposed as opt-in (question 1);
  - click and context-menu modes are Popover's job (`openOnHover` on Popover gives hover + click).

## Proposed scope

1. **Token styling, matching Popover**:
   - `surface-overlay`, `border-default`, `--radius-DEFAULT` and `shadow-lg` replace the hard-coded `bg-white` / `neutral-*`.
   - Forced-colours border.
   - The popup is capped at `--available-width` so it never overflows on mobile.
2. **Trigger styled as a link**:
   - `fg-default` with an underline offset and a muted underline that turns solid on hover/open (`data-popup-open`).
   - `sp-focus-ring`.
   - Keeps `render` for router links.
3. **Sizes**: `size="sm" | "md" | "lg"` (256 / 320 / 384px) on Popup/Content (Chakra `size`, Mantine `width`). Consumers can also use `w-[var(--anchor-width)]` as in Popover.
4. **Delays**:
   - Southpaw defaults on the Trigger (question 2).
   - `PreviewCard.Group` shares delays, and makes neighbours open instantly once one card is warm (Mantine `HoverCard.Group`, Tooltip-style warm group).
5. **`disabled`** on Root (Chakra, Mantine): never opens, and the link still works.
6. **`PreviewCard.Content`**: a convenience part bundling Portal + Positioner + Popup + Arrow, with `side`, `align`, `sideOffset`, `alignOffset`, `collisionPadding`, `arrow`, `size`, `keepMounted`, `container` and `positionerProps`. This is the same pattern as `Tooltip.Content`. Raw parts stay exported.
7. **Arrow**: a bordered caret in the popup colours (same as Popover, Carbon caret, Ant `arrow`). Optional in `Content` via `arrow`.
8. **Shared card for a list of links**:
   - A story using `createHandle` + `payload` (Chakra's multiple triggers).
   - Styled `Viewport` so content cross-fades when moving between triggers (Base `data-activation-direction`).
9. **Hide when the trigger scrolls out of view** (Mantine `hideDetached`): `data-[anchor-hidden]:invisible`, as in Tooltip.
10. **Density**: forward the trigger's `[data-density]` to the portalled popup, as Tooltip does. Padding and gaps scale.
11. **Motion (Emil)**:
    - 200ms (`--sp-duration-normal`) fade + scale from `--transform-origin`, ease-out, with a faster exit.
    - No motion when switching between triggers in a warm group (`data-instant`).
    - Reduced motion via the tokens.
12. **Touch (opt-in)**: long-press opens the card (Mantine `events.touch`) and a normal tap still follows the link. See question 1.
13. **Composition parts**:
    - `PreviewCard.Media` (16:9 image area, rounded, `object-cover`), plus Title and Description text parts. These cover the three canonical layouts: link preview, user profile (with Avatar) and glossary term.
    - These are presentational `div`/`p` parts with `data-slot`. Unlike Popover's Title/Description, Base gives no ARIA labelling here, by design.
14. **Stories**:
    - Default (link preview)
    - Profile (Avatar + name + bio + stats)
    - Definition
    - Placements
    - Sizes
    - Delays / Group
    - SharedCard (handle + payload + Viewport)
    - Disabled
    - Touch
    - Density
    - Themes (all sizes, with and without arrow, × 3 themes)

### Considered, not proposed

- **Focus trap**: see above. Mantine advises against it, and it belongs to Popover/Dialog.
- **ARIA wiring (`aria-describedby` to the card, Mantine `role="dialog"` + `aria-expanded`)**:
  - Rich cards (image, stats, buttons) make poor descriptions.
  - `aria-expanded` on a link that opens on hover advertises a disclosure that keyboard users can't enter.
  - We follow Base UI's documented model: the link is the accessible interface.
- **Click / context-menu trigger modes (Ant)**: this is Popover (`openOnHover` for hover + click). Documented as "use Popover".
- **Backdrop styling**: Base exposes it, but no library dims the page for a hover card. Kept as an unstyled pass-through.

## Delays (decided 2026-11-16, following Emil Kowalski)

George asked for delays based on Emil's guidance rather than Base UI's 600 / 300ms.

**What Emil says (primary sources):**

- Article ["7 practical animation tips"](https://emilkowal.ski/ui/7-practical-animation-tips):
  - "Tooltips should have a delay before appearing to prevent accidental activation."
  - "Once a tooltip is open, hovering over other tooltips should open them with no delay and no animation." In Base UI, target `data-instant` and set the transition to `0ms`.
  - Popovers "should scale in from the trigger" (`--transform-origin`). UI animations stay under 300ms, and ease-out is used for entering and exiting.
- His published skills ([github.com/emilkowalski/skill](https://github.com/emilkowalski/skill)):
  - `review-animations/STANDARDS.md`: "Tooltips, small popovers: 125–200ms".
  - `animate/RECIPES.md`: tooltip recipe with 125ms, `scale(0.97)` + `opacity: 0`, `[data-instant] { transition-duration: 0ms }`, and "The initial delay prevents accidental activation. After that, skipping both the delay and the animation makes the whole toolbar feel faster."
  - `emil-design-eng/SKILL.md`: "Tooltips: skip delay on subsequent hovers".
  - `find-animation-opportunities`: keyboard-initiated actions get no animation.
- Sonner and Vaul have no hover-open delays to copy. Sonner expands its stack on hover immediately, and Vaul is drag-driven.

**What he doesn't say:** no source gives a millisecond value for the initial hover delay or for a close grace. Those two numbers are our call, made within his principle:

| Value                                  | Chosen                                                                                       | Why                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First-open delay                       | **500ms**                                                                                    | Its job (Emil) is to prevent accidental activation. Preview-card triggers are inline links in running text that the pointer sweeps across while reading, and a card covers far more content than a tooltip. So it sits above Tooltip's 300ms and below Base UI/Chakra's 600ms and Radix's 700ms, which feel sluggish once you mean to look. |
| Neighbour open (warm group)            | **0ms, no animation**                                                                        | Emil verbatim. `PreviewCard.Group` sets the trigger delay to 0, and the popup gets `data-instant`, which sets the transition to 0ms.                                                                                                                                                                                                        |
| Warm window after the last card closes | **400ms**                                                                                    | Same as Tooltip's Provider `timeout`, so both components cool down alike.                                                                                                                                                                                                                                                                   |
| Close grace                            | **150ms**                                                                                    | A short grace (George's brief) so a slightly overshooting pointer, or the trip from link to card, doesn't drop it. Base UI's safe polygon already keeps the card open while the pointer travels into it, so the grace only covers jitter. Base UI's 300ms leaves the card hanging after you've clearly left.                                |
| Previous card when a neighbour opens   | **closes instantly**                                                                         | Two cards never overlap, and there's no exit animation (Emil: no animation in a warm group).                                                                                                                                                                                                                                                |
| Enter animation                        | **200ms** (`--sp-duration-normal`), ease-out, `scale(0.97)` + fade from `--transform-origin` | The upper end of his "small popovers 125–200ms", because a card is larger than a tooltip. The 0.97 scale is from his recipe.                                                                                                                                                                                                                |
| Exit animation                         | **150ms** (`--sp-duration-fast`)                                                             | Exits are faster than enters.                                                                                                                                                                                                                                                                                                               |
| Keyboard focus open / Escape close     | **no animation** (`data-instant`)                                                            | Emil: keyboard-initiated actions get no animation.                                                                                                                                                                                                                                                                                          |

## Questions for George (answered 2026-11-16, see LOG.md)

1. **Touch:** long-press to open, opt-in and **off by default**?
   - On mobile, long-pressing a link opens the browser's own link menu (open in new tab, copy link).
   - Suppressing that menu by default would take that away, unlike Tooltip, whose triggers are buttons.
   - Recommend opt-in.
2. **Default delays:** keep Base/Chakra's **600ms open / 300ms close**?
   - Radix is 700ms and Ant 100ms.
   - A card is larger and more disruptive than a tooltip, so a longer open delay than Tooltip's 300ms avoids cards flashing up as the pointer crosses links.
   - Recommend 600 / 300.
3. **Focus trap** (named in the ticket title): drop it, per the reasoning above? Recommend yes.
4. **Click trigger mode** (ticket "trigger modes"): document "use Popover with `openOnHover`" instead of adding a mode? Recommend yes.

## Sources

- Base UI PreviewCard — https://base-ui.com/react/components/preview-card (+ `@base-ui/react@1.9.0` source)
- shadcn HoverCard — https://ui.shadcn.com/docs/components/hover-card
- Mantine HoverCard — https://mantine.dev/core/hover-card/
- Chakra HoverCard — https://chakra-ui.com/docs/components/hover-card
- MUI Popover (mouse hover interaction) — https://mui.com/material-ui/react-popover/
- Ant Design Popover — https://ant.design/components/popover
- GOV.UK Details — https://design-system.service.gov.uk/components/details/
- Carbon Popover — https://carbondesignsystem.com/components/popover/usage/
- Spectrum ContextualHelp — https://react-spectrum.adobe.com/react-spectrum/ContextualHelp.html
- Primer (no hover card component; GitHub hovercards are product-level)
