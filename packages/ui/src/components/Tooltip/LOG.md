# Tooltip — Change Log

## 2026-11-13 — Full enhancement (GEO-919)

Research: see RESEARCH.md (all 9 libraries + Base UI source + Emil Kowalski's motion guidance).

### What changed

- **Inverse semantic styling**: neutral = `fg-default` background on `surface-base` text, so it is dark on light, light on dark, and black on white in high-contrast. This replaces `bg-accent`, which is reserved for UI controls. Variant colours are exposed as `--sp-tooltip-bg` / `--sp-tooltip-fg` so the arrow inherits them.
- **Variants**: `neutral` (default), `info`, `success`, `danger` (Spectrum, Ant, Mantine). `showIcon` adds a Phosphor intent icon (Spectrum `showIcon`).
- **Arrow**: a rotated square in the popup's colour, hidden in forced-colours. On by default in `Tooltip.Content` (Ant, Carbon caret). `arrow={false}` hides it.
- **Motion (Emil Kowalski)**:
  - 125ms (`--sp-duration-press`) on opacity + scale, starting from `scale(0.97)` + `opacity: 0`.
  - Scales from `--transform-origin` (the trigger), using strong ease-out.
  - `data-[instant]:duration-0` means no animation when a neighbour opens in a warm group, on keyboard focus, or on dismiss.
- **Delays**: `Tooltip.Provider` defaults to delay 300ms / closeDelay 0 / timeout 400ms. `Tooltip.Root` wraps itself in a Provider when none exists, so standalone tooltips get the same defaults (unlike shadcn, an app-level provider is not required). Keyboard focus opens instantly (Base UI `useFocus`, matching Spectrum).
- **A11y wiring** (Base UI ships none):
  - Popup gets `role="tooltip"` and a `useId` id.
  - Trigger gets `aria-describedby` (default) or `aria-labelledby` (`type="label"`, for icon-only buttons; Primer, Carbon, MUI `describeChild`).
  - Portal defaults to `keepMounted` so those references always resolve. The popup is `hidden` when closed.
- **Touch long-press** (MUI): on by default.
  - 700ms press shows the tooltip; it hides 1500ms after release.
  - Moving more than 10px cancels the press (scrolling).
  - The synthetic click after a long-press is swallowed, and the Android context menu is suppressed.
  - Props: `touch`, `touchDelay`, `touchCloseDelay`.
- **`Tooltip.Content`**: convenience part combining Portal + Positioner + Popup + Arrow, with `side`, `align`, `sideOffset`, `alignOffset`, `collisionPadding`, `arrow`, `keepMounted`, `container` and `positionerProps`. Raw parts stay exported.
- **`Tooltip.Shortcut`**: `<kbd>` keyboard hint (Primer `keybindingHint`, shadcn).
- **Density**: portalled content can't inherit `data-density`, so Root reads the nearest `[data-density]` from the active trigger on open and forwards it to the popup. Padding and text size scale (compact `text-xs`, default/comfortable `text-sm`).
- **Hide detached** (Mantine `hideDetached`): the positioner is `invisible` when Base UI reports `data-anchor-hidden`.
- **Width**: `max-w-xs` (320px) with wrapping (MUI ~300px, Ant 250px).
- Exposes `Viewport` and `createHandle` for shared or detached triggers.
- **Stories**: Default, States, Placements (12), Toolbar (warm group + `type="label"`), KeyboardShortcut, LongContent, WithoutArrow, FollowCursor, Controlled (+ `closeOnClick={false}`), SharedTooltip (handle + payload), Definition, Density, Themes (every variant ± icon × 3 themes).
- **Tests**: 18 unit tests.

### Shared changes outside `Tooltip/` (approved by George 2026-11-13)

- `packages/tokens/src/primitives.css`: `--sp-info-700` (#0b57d0), `--sp-info-300` (#a8c7fa).
- `packages/tokens/src/semantic.css`: `--sp-info`, `--sp-fg-on-info` and `--sp-fg-on-success` for light, dark and high-contrast.
  - `fg-on-success` wasn't explicitly requested. Without it, success tooltips in dark mode would need white text on a light green.
- `packages/tokens/src/theme.css`: `--color-info`, `--color-fg-on-info`, `--color-fg-on-success` Tailwind mappings.

### Why

- **Inverse colours**: every library except Spectrum uses a high-contrast inverse surface for neutral tooltips. Accent is semantically for controls.
- **ARIA wiring**: Base UI treats tooltips as visual-only and leaves the trigger's name to the consumer. Primer, Carbon, MUI and the APG pattern link them programmatically. `keepMounted` avoids dangling ID references (an axe inconclusive risk) when the tooltip is closed.
- **Auto-Provider in Root**: without it, a standalone tooltip uses Base UI's 600ms default instead of our 300ms.
- **Touch on by default**: George chose the MUI behaviour. Base UI and Primer avoid touch tooltips because they're hard to discover. The docs must still say: never put essential information in a tooltip (GOV.UK, Primer).

### Considered and rejected

- **Carbon DefinitionTooltip as a separate part**: Primer and Spectrum both say tooltips must sit on interactive elements. Shown as a story with a button trigger styled as a dotted-underline term instead.
- **Toggletip / interactive tooltip content**: this belongs to Popover (`openOnHover`). Mantine and Carbon both say no interactive content in tooltips.
- **Mantine's 24 transition presets**: a single tuned motion keeps the library consistent (Emil).
- **`disableHoverablePopup` default**: kept Base UI's hoverable default (WCAG 1.4.13). MUI documents disabling it as an AA failure.

### Known follow-ups (not in this lane)

- **Reduced motion**: shared motion tokens zero all durations, which also removes the opacity fade. Emil says to keep opacity. This is a library-wide token decision, flagged to George.
- **Button + `focusableWhenDisabled`**: Button's disabled styles target the `:disabled` attribute, so `focusableWhenDisabled` (which uses `aria-disabled`/`data-disabled`) loses the dimmed look. The States story adds `data-[disabled]:` classes locally. This belongs in Button.
- **`Tooltip.Shortcut`**: switch to the Kbd component once GEO-940 (Lane 2) lands.
