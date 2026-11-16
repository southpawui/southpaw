# Toast — Change Log

## 2026-11-16 — Sign-off + /improve fixes (GEO-920)

George signed off (relayed by the coordinator). /improve was run on `Toast/` and the token additions. Every valid finding is fixed, each with a regression test.

### Fixed

1. **Promise results ignored a custom Toaster timeout.**
   - `toast.promise` forced a 5000ms timeout on settled toasts.
   - Base UI already passes `timeout` through explicitly, so an unset timeout now falls back to the Provider's.
2. **Some action buttons didn't close their toast.**
   - Actions on settled promise toasts, or on toasts added through the raw manager, stayed open, because closing relied on an id generated only by `toast.*()`.
   - `Toast.Action` now closes its own toast from context. The check runs after every click handler, so `event.preventDefault()` still keeps the toast open.
   - The random-id workaround is gone.
3. **Toasts fired before the Toaster mounted were dropped.**
   - Base UI's manager is a plain event emitter with no queue.
   - `toastManager`, `createToaster()` and `Toast.createToastManager` now queue calls until a Provider subscribes, then replay them (Sonner keeps early toasts too). Queued `promise()` calls return the caller's promise, so there's no double unhandled rejection.
4. **`toast.update` skipped the safe defaults.**
   - Changing the type to danger or loading, or adding an `action`, now makes the toast persistent. Danger becomes high priority.
   - Leaving a persistent type (for example loading → success) resets to the Provider timeout.
   - `update` now also accepts `action`, `onClose` and `onRemove`.
   - An explicit `timeout` or `priority` still wins.
5. **Content reserved room for the × even without one.** The end padding now applies only when a `CloseButton` is a direct child (`has-[>…]`). Computed: 40px with the ×, 12px without (anchored toast).

### Rejected / by design

- **Close buttons' `aria-hidden-focus` inconclusive.** This is Base UI's behaviour, already accepted by George (see below). Not changed.
- **Naming toast intent `type` rather than `variant` (Tooltip) or `color` (Button).** It matches Base UI's `type` and Sonner's API, and the value is per toast object, not a component prop. Kept.

### Checks

- Tests: 45 for Toast (36 → 45), 364 across the suite.
- `pnpm verify toast`: all checks passed.
- eslint and prettier are clean.
- Mutation-checked: the queue test fails without the queue.

## 2026-11-16 — Full enhancement (GEO-920)

Research: see RESEARCH.md (all 9 libraries + Base UI source + Sonner/Emil). Branch `geo-920-enhance-toast`, off `geo-941-avatar-tooltip` @ `a9419f6`.

### What changed

- **Types**: `neutral` (default), `info`, `success`, `warning`, `danger` (`error` is accepted as an alias) and `loading`.
  - Each type gets a Phosphor intent icon. Loading uses the Southpaw Spinner. Neutral has no icon.
  - `icon` accepts a custom node, or `false` to hide the icon.
- **Appearance**:
  - `subtle` (default) is George's hybrid: a 1px intent-colour border on a pale `-subtle` fill, with an intent-coloured icon and default text colours.
  - `solid` is an intent fill with `fg-on-*` text. Neutral solid is the inverse surface, like Tooltip.
  - Set per Toaster/Viewport (`appearance`) or per toast. Colours are exposed as `--sp-toast-bg/border/fg/muted/icon`, so every part follows them.
- **`<Toast.Toaster />`** bundles Provider + Portal + Viewport + default rendering (`Toast.Item`).
  - Props: `position`, `expand`, `limit` (3), `timeout` (5000), `appearance`, `showProgress`, `density`, `closeLabel`, `container` and `toastManager`.
- **`toast()` helpers** (global manager):
  - `toast()`, `.info`, `.success`, `.warning`, `.error`/`.danger`, `.loading`
  - `.promise` (loading, then success or danger; each state is a string, an options object or a function of the result)
  - `.dismiss(id?)` and `.update(id, …)`
  - `createToaster()` gives an isolated manager + helpers. Every story uses one, so stories don't share toasts.
- **Safe timing defaults (Spectrum, Carbon, MUI/WCAG 2.2.1)**:
  - 5000ms by default.
  - `danger` toasts and any toast with an `action` persist.
  - `loading` toasts persist; Base UI also never times them out.
  - `danger` defaults to `priority: "high"` (alertdialog, assertive).
  - An explicit `timeout` or `priority` always wins.
  - Base UI pauses timers on hover, focus and window blur.
- **Positions**: six, via `position`. Viewport sets `data-position` and `data-side`. The default swipe direction follows the edge (for example bottom-right swipes down or right).
- **Stacking (Emil/Sonner)**:
  - The collapsed stack scales each toast behind the front one by 5% and lets it peek out by 10px.
  - The stack expands on hover/focus with a 12px gap. A hover bridge covers the gaps.
  - `expand` switches to a plain flex list that is always expanded, which is also what the static stories use.
  - Limited toasts are hidden.
- **Action / cancel / close**:
  - The action is a Southpaw `Button` (sm, outline, on-toast colours). It runs `onClick`, then closes the toast unless `preventDefault()` is called.
  - `cancel` is a ghost `Toast.Close`.
  - The × (`Toast.CloseButton`) is always rendered as an icon Button with a density-aware size, labelled "Dismiss notification" (configurable).
- **Caption** (Carbon timestamp) slot.
- **Progress** (Mantine, Ant): an opt-in `showProgress` bar driven by the Web Animations API.
  - It pauses while the stack is expanded (Base UI pauses the timer then) and while the window is blurred.
  - It restarts on update and isn't rendered for persistent toasts.
- **Anchored toasts**: `Toast.Positioner` and `Toast.Arrow` (bordered, intent-coloured). Anchored roots scale and fade from `--transform-origin` like Tooltip, with swipe disabled.
- **Mobile**: under `sm`, the viewport is full width minus 16px gutters; from `sm` up it is 360px wide with 24px offsets. Layout uses logical properties (`pe`, `end`) for RTL.
- **Motion**:
  - The entrance uses `--sp-duration-entrance` (350ms) and slides from the stack's edge.
  - The exit uses `--sp-duration-exit` (200ms), following the swipe direction when swiped.
  - Both use `--sp-easing-default`. Reduced motion is handled by the tokens.
- **Density**: the Viewport `density` prop sets `data-density` on the portalled viewport, so density tokens apply inside it. Padding and control sizes then scale.
- **Forced colours**: borders become `CanvasText` and the progress bar becomes `CanvasText`. The arrow is hidden.
- **Parts**: Toaster, Provider, Portal, Viewport, Root, Item, Content, Body, Icon, Title, Description, Caption, Actions, Action, Close, CloseButton, Progress, Positioner, Arrow, `useToastManager`, `createToastManager`.
- **Stories**: Default, States, Positions, Stacking, Promise, Actions, Progress, Anchored, Density, Themes.
  - States: every type in both appearances, plus action/cancel/caption/title-only.
  - Themes: every type in both appearances in all 3 themes, plus an actionable danger toast.
  - The old stories used raw `<button>`s; they now use `Button`.
- **Tests**: 36 unit tests. Persistence was mutation-checked: the danger and action tests fail without the rule. Loading persists in Base UI regardless.

### Verified

- `pnpm verify toast`: all checks passed (10 stories).
- **Playwright**:

  | Check                  | Result                                                            |
  | ---------------------- | ----------------------------------------------------------------- |
  | Collapsed stack        | `scale(0.95)` / `scale(0.9)`, peeking 10px                        |
  | Hover expand           | 12px gaps                                                         |
  | Warning subtle colours | `#fef3c7` bg, `#b45309` border/icon                               |
  | Auto-dismiss           | Success gone after 5s; danger still open after 6s (`alertdialog`) |
  | Mobile width           | 343px at 375px                                                    |
  | Progress bar           | Paused on hover (identical transforms 1.5s apart)                 |
  | Keyboard               | F6 → viewport, Tab → toast, Tab → action, Enter closes            |

- **axe inconclusive (manual review): `aria-hidden-focus` on close buttons in the static stories.**
  - Base UI sets `aria-hidden` on `Toast.Close` until the stack is expanded or the button is focused. This keeps "Dismiss notification" out of the live-region announcement.
  - Playwright confirmed `aria-hidden="false"` once the stack is hovered or focused. Tabbing into the viewport expands it first, so keyboard and screen-reader users never land on a hidden button.
  - Kept as Base UI designed it.

### Considered and rejected

- **Thick left edge (Carbon low-contrast style) for `subtle`.** George preferred a full intent border on a pale fill. Amber read as brown on the thick edge.
- **Overriding Base UI's `aria-hidden` on close buttons.** It would make every polite announcement end with "Dismiss notification, button".
- **Sonner's Alt+T hotkey.** We kept F6, which matches Spectrum and the landmark convention.
- **Expand as absolute positioning (Sonner).** A flex list is simpler, needs no measured heights and renders inline for static examples.
- **Clamping `timeout` to ≥5000ms.** Anchored "Copied" confirmations legitimately use ~1500ms. This is documented as guidance instead.

### Known follow-ups (not this lane)

- Avatar "away" dot → `bg-warning`.
- The reduced-motion tokens zero the opacity fade too (same note as Tooltip).

## 2026-11-14 — Scope decisions (GEO-920)

### Decided so far

- **Amber `warning` token added (George approved 2026-11-14).** A shared change outside `Toast/`:
  - `packages/tokens/src/primitives.css`: `--sp-warning-700` #b45309, `--sp-warning-300` #fcd34d.
  - `packages/tokens/src/semantic.css`: `--sp-warning` and `--sp-fg-on-warning` for light, dark and high-contrast (HC `--sp-warning` #7a4100).
  - `packages/tokens/src/theme.css`: `--color-warning`, `--color-fg-on-warning`.
  - Contrast:

    | Theme         | Colour                        | Contrast |
    | ------------- | ----------------------------- | -------- |
    | Light         | #b45309 with white text       | 5.0:1    |
    | Dark          | #fcd34d with neutral-950 text | 13:1     |
    | High contrast | #7a4100 with white text       | 8.1:1    |

  - Follow-up (not this lane): Avatar's "away" dot still uses a hard-coded `oklch(0.75 0.15 85)` and could switch to `bg-warning`.
- **Tooltip neutral stays on `fg-default`/`surface-base`, not `accent`.** George asked; it renders identically today. Accent is reserved for UI controls, and it maps to `Highlight` in forced-colours.

- **Scope approved by George (2026-11-16)**, directly and again via the coordinator:
  1. **Default appearance: `subtle`, redesigned as a hybrid at George's request.** A full 1px border in the intent colour on a pale intent fill. There is no thick left edge. Amber now reads as amber, not brown. `solid` stays available per toast or per Toaster.
  2. **Convenience API:** `<Toast.Toaster />` and the `toast()` / `toast.success()` / `.error()` / `.warning()` / `.info()` / `.loading()` / `.promise()` / `.dismiss()` / `.update()` helpers, built on `createToastManager`.
  3. **Persistence:** `danger` toasts and toasts with an action stay until dismissed. Loading toasts also persist.
  4. **Inline/notification banner** becomes a separate ticket: GEO-949 ("New component: Banner (inline notification)"), created by the coordinator and blocked by GEO-920 for the `-subtle` tokens.
- **New `-subtle` fill tokens (George approved 2026-11-16).** This is a shared change outside `Toast/`:
  - `primitives.css`: `--sp-{info,warning,danger}-50` and `-950`.
  - `semantic.css`: `--sp-{info,warning,danger}-subtle` for light, dark and high contrast. `success-subtle` already existed.
  - `theme.css`: `--color-{info,warning,danger}-subtle`.
  - Contrast on the fills, minimum across all themes:

    | Element       | Minimum contrast           |
    | ------------- | -------------------------- |
    | Body text     | 7.5:1                      |
    | Icon / border | 4.5:1 (light-mode warning) |
