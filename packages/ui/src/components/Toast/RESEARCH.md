# Toast — Competitive Research

Researched: 2026-11-08. Redone in full across all 9 libraries + Base UI on 2026-11-14 (GEO-920).

## Baseline: what Base UI 1.9 gives us

- **Parts**: Provider, Portal, Viewport, Root, Content, Title (h2), Description (p), Action, Close, Positioner + Arrow (anchored toasts), `useToastManager`, `createToastManager` (global, outside React).
- **Manager**: `add` (returns id; re-using an id updates in place and restarts the timer), `update`, `close(id?)` (no id = all), and `promise` (loading → success/error, each a string or full options).
- **Timing**: `timeout` (default 5000ms; `0` = persistent).
  - Timers pause on viewport hover, focus, window blur, and when F6 is pressed.
- **Stacking**:
  - `limit` (default 3). Extra toasts stay mounted with `data-limited`.
  - The viewport expands on hover/focus (`data-expanded`); `data-behind` marks content behind the front toast.
  - CSS vars: `--toast-index`, `--toast-offset-y`, `--toast-height`, `--toast-frontmost-height`.
- **Swipe to dismiss**: `swipeDirection` (default down + right). Exposes `--toast-swipe-movement-x/y`, `data-swiping` and `data-swipe-direction`. Interactive children are ignored.
- **A11y**:
  - Viewport is `role="region"`, `aria-label="Notifications"`, `aria-live="polite"`.
  - Each toast is `role="dialog"`, or `alertdialog` when `priority: "high"` (announced assertively), and is `aria-labelledby` its title.
  - Escape closes the focused toast. F6 jumps into the viewport and back.
- **Styling hooks**: `type` → `data-type` on Root, Title, Description, Action and Close. `data` carries custom typed payloads.
- **Positioning**: none built in. Position is pure CSS (we add `data-position`).

## Feature comparison

| Feature                                 | shadcn (Sonner)        | Mantine                 | Chakra            | MUI             | Ant                 | GOV.UK                | Carbon              | Spectrum                       | Primer | Ours (now)        |
| --------------------------------------- | ---------------------- | ----------------------- | ----------------- | --------------- | ------------------- | --------------------- | ------------------- | ------------------------------ | ------ | ----------------- |
| Types: success / error / info / warning | Yes                    | Yes (colour)            | Yes               | Yes (Alert)     | Yes                 | Success banner        | Yes                 | positive/negative/info/neutral | —      | No                |
| Loading type (persistent, spinner)      | Yes                    | Yes                     | Yes               | —               | —                   | —                     | —                   | —                              | —      | No                |
| Promise helper                          | Yes                    | Yes                     | Yes               | —               | —                   | —                     | —                   | —                              | —      | Base only         |
| Intent icon + custom icon               | Yes                    | Yes                     | Yes               | Yes             | Yes                 | —                     | Yes                 | Yes                            | —      | No                |
| Rich/solid colours vs subtle            | `richColors`, `invert` | `color`                 | —                 | filled/outlined | —                   | —                     | high / low contrast | —                              | —      | No                |
| Positions (6)                           | Yes                    | Yes                     | 4 corners         | Yes             | Yes                 | —                     | top-right           | 4                              | —      | bottom-right only |
| Collapsed stack, expands on hover/focus | Yes                    | `layout="stacked"`      | overlap           | — (notistack)   | `stack`             | —                     | —                   | —                              | —      | Base only         |
| Always-expanded option                  | `expand`               | default                 | default           | —               | `stack={false}`     | —                     | default             | default                        | —      | No                |
| Visible limit + queue                   | `visibleToasts`        | `limit` + queue         | `max` + queue     | one at a time   | `maxCount`          | —                     | —                   | —                              | —      | Base only         |
| Auto-dismiss, configurable              | 4000                   | Yes                     | Yes               | Yes             | 4.5s                | —                     | ~5s                 | ≥5000                          | —      | Base only         |
| Persistent for errors / actionable      | —                      | —                       | loading           | —               | —                   | Yes (no auto-dismiss) | actionable persists | actionable persists            | —      | No                |
| Pause on hover / focus / page hidden    | Yes                    | Yes                     | `pauseOnPageIdle` | Yes             | Yes                 | —                     | —                   | Yes                            | —      | Base only         |
| Remaining-time progress bar             | —                      | `withAutoCloseProgress` | —                 | —               | `showProgress`      | —                     | —                   | —                              | —      | No                |
| Action button                           | Yes                    | (content)               | Yes               | Yes             | `actions`           | —                     | 1 max               | Yes                            | —      | Unstyled          |
| Cancel / secondary button               | Yes                    | —                       | —                 | —               | Yes (group)         | —                     | —                   | —                              | —      | No                |
| Close button                            | opt-in                 | Yes                     | `closable`        | Yes             | Yes                 | —                     | Yes (recommended)   | Yes                            | —      | Yes               |
| Swipe to dismiss                        | Yes                    | Yes                     | —                 | —               | —                   | —                     | —                   | —                              | —      | Base only         |
| Update / dedupe by id                   | Yes                    | Yes                     | Yes               | key             | key                 | —                     | —                   | close fn                       | —      | Base only         |
| Imperative API outside React            | `toast()`              | `notifications.show`    | `toaster`         | —               | static (deprecated) | —                     | —                   | `ToastQueue`                   | —      | Base only         |
| Timestamp / caption                     | —                      | —                       | —                 | —               | —                   | —                     | Yes                 | —                              | —      | No                |
| Anchored toast (next to trigger)        | —                      | —                       | —                 | —               | —                   | —                     | —                   | —                              | —      | Base only         |
| Keyboard jump to region                 | Alt+T                  | —                       | —                 | —               | —                   | —                     | —                   | F6                             | —      | Base (F6)         |
| Region label                            | `containerAriaLabel`   | —                       | —                 | —               | —                   | —                     | —                   | `aria-label`                   | —      | Base              |
| Assertive priority for errors           | —                      | —                       | —                 | role=alert      | `role`              | role=alert            | —                   | —                              | —      | Base only         |
| Mobile offset / full width              | `mobileOffset`         | —                       | —                 | —               | —                   | —                     | —                   | —                              | —      | Partial           |
| RTL                                     | `dir`                  | Yes                     | Yes               | Yes             | Yes                 | —                     | Yes                 | Yes                            | —      | No                |

"Base only" means the primitive supports it, but we neither style it nor show it in a story.

## Guidance worth carrying into the docs

- **Spectrum**: minimum timeout 5000ms. Toasts with an action never auto-dismiss. Use toasts sparingly, and don't auto-dismiss important information.
- **Carbon**: one action at most, labelled with one or two words. Actionable toasts persist. Always offer a close button. The message must be findable elsewhere after it disappears.
- **GOV.UK**: no toasts. It uses a notification banner before the `h1` (`role="region"`, or `role="alert"` for success) that is never auto-dismissed.
- **Primer**: points away from toasts to Banner, InlineMessage or a message inside a Dialog.
- **MUI**: cites WCAG 2.2.1 (timing adjustable) for `autoHideDuration`.

Conclusion: the toast must be safe by default.

- Errors and toasts with an action persist.
- The timeout never drops below 5000ms.
- A close button is always present.
- Timers pause on hover, focus and blur.
- Toast content is announced via the title/description strings.

## Emil Kowalski (Sonner author; motion tokens are his)

- The stack scales each toast behind the front one (`scale(1 - index * 0.05)`, offset upward). It expands on hover with a strong ease-out.
- Exits are faster than enters. The swipe dismisses past a velocity/distance threshold and otherwise snaps back.
- Toasts are one of his documented exceptions to the "<300ms" rule: entrances can be longer, around 400ms. Our `--sp-duration-entrance` is 350ms and `--sp-duration-exit` is 200ms.

## Proposed scope

1. **Types**: `neutral` (default), `info`, `success`, `warning`, `danger`, `loading`, each with an intent icon (Phosphor) and an optional custom `icon`. `warning` needs a new token (question 1).
2. **Appearance**:
   - `subtle` (default): overlay surface with a coloured icon and a coloured edge (Carbon low contrast).
   - `solid`: intent background (Sonner `richColors`, Carbon high contrast).
   - `inverted` (Sonner `invert`).
3. **Positions**: 6, via Viewport `position`. The swipe direction follows the position.
4. **Stacking**: collapsed stack with depth scale per Emil/Sonner, expanding on hover/focus; `expand` to always expand; `limit` (default 3).
5. **Safe timing defaults**:
   - 5000ms.
   - `danger` and any toast with an action default to persistent (Spectrum, Carbon).
   - `loading` is persistent.
   - `danger` defaults to `priority: "high"`.
6. **Progress bar** (opt-in, `showProgress`): a CSS animation over the toast's timeout, paused while the stack is expanded or focused (Mantine, Ant).
7. **Action + secondary/cancel**: rendered as Southpaw `Button` (size sm). The action uses the accent style, never brand.
8. **Close button**: always rendered, as a Southpaw `Button` (ghost, icon) with an accessible label.
9. **Timestamp/caption** slot (Carbon).
10. **Convenience API**:
    - `<Toast.Toaster position expand limit />`: Provider + Portal + Viewport + default rendering in one part (Sonner/shadcn ergonomics).
    - `toast` helpers built on `createToastManager`: `toast.success()`, `.error()`, `.warning()`, `.info()`, `.loading()`, `.promise()`, `.dismiss()`, `.update()`.
    - Raw parts stay exported.
11. **Anchored toast** story (Positioner + Arrow), e.g. "Copied!" next to a copy button.
12. **Mobile**: full width under `sm`, with a smaller edge offset (Sonner `mobileOffset`). RTL via logical properties.
13. **Motion**: entrance 350ms and exit 200ms using tokens, depth scale in the stack, and swipe following the finger. Reduced motion is handled by the tokens.
14. **Stories**: Default, States (all types × appearances), Positions, Stacking/expand, Promise, Action + cancel, Persistent, Progress, Anchored, Density, Themes (every type × appearance × theme).

### Considered, not proposed for Toast

- **Inline notification / banner** (GOV.UK notification banner, Carbon inline, Primer Banner): a different component, page-anchored and not time-based. Proposed as a separate ticket.
- **Sonner's Alt+T hotkey**: Base UI's F6 matches Spectrum and the landmark convention. Keep F6.

## Sources

- Base UI Toast — https://base-ui.com/react/components/toast (+ `@base-ui/react@1.9.0` source)
- shadcn → Sonner — https://ui.shadcn.com/docs/components/sonner , https://sonner.emilkowal.ski/toast , https://sonner.emilkowal.ski/toaster
- Mantine Notifications — https://mantine.dev/x/notifications/
- Chakra Toast — https://chakra-ui.com/docs/components/toast
- MUI Snackbar — https://mui.com/material-ui/react-snackbar/
- Ant Design Notification — https://ant.design/components/notification
- GOV.UK Notification banner — https://design-system.service.gov.uk/components/notification-banner/
- Carbon Notification — https://carbondesignsystem.com/components/notification/usage/
- Spectrum Toast — https://react-spectrum.adobe.com/react-spectrum/Toast.html
- Primer notification messaging — https://primer.style/product/ui-patterns/notification-messaging/
