# Tooltip — Change Log

## 2026-11-13 — /improve fixes (GEO-919)

George asked for all six findings to be fixed.

### What changed

1. **Shortcut kept out of the accessible name.**
   - `Tooltip.Shortcut` is now `aria-hidden`. Before, `type="label"` + Shortcut named an icon button "Save ⌘S".
   - New optional `keys` prop (aria-keyshortcuts syntax, e.g. `"Meta+S"`), which Root sets as `aria-keyshortcuts` on the trigger.
   - The children API is unchanged, so the planned swap to Kbd (GEO-940) is still drop-in.
2. **Detached triggers** (outside Root, linked by `handle`) now get ARIA wiring and touch long-press.
   - Root publishes its context against its handle in a `WeakMap` registry, which detached triggers read with `useSyncExternalStore`.
   - Because a shared popup's text changes per trigger, a detached trigger references the popup (`aria-describedby`) only while it is the trigger that opened it.
   - Detached triggers never take their name from the popup (`type="label"` is ignored for them), so they must keep their own `aria-label`.
   - Detached triggers outside any Provider now apply Southpaw's 300ms / 0ms delays themselves. Before this, they fell back to Base UI's 600ms.
3. **Stable trigger ref.** The merged ref is memoised, so Base UI no longer unregisters and re-registers the trigger on every re-render.
4. **ARIA merging.**
   - A consumer's `aria-describedby` / `aria-labelledby` is merged with the tooltip id instead of replacing it.
   - A custom `id` on `Popup` is registered back to Root so the trigger references it.
5. **Generic Root.** `Tooltip.Root<Payload>` is typed through the handle, so render-function `payload` is typed. The SharedTooltip story no longer casts.
6. **Tests: 18 → 28.** Added coverage for:
   - `onOpenChange` forwarding
   - controlled `open`
   - ref forwarding and stability
   - aria-describedby merge
   - custom popup id
   - shortcut name + `aria-keyshortcuts`
   - detached ARIA scoping
   - detached touch
   - detached hover delay (mutation-checked: it fails without the fix)
   - consumer handle + touch

### Considered and rejected

- **Rejected: static ARIA references on detached triggers.** With handle + payload, one popup serves several triggers. Permanently pointing every trigger at it would give the inactive triggers the wrong description, or the wrong name.
- **Not fixed (by design): touch long-press while Root is `disabled`.** Base UI forces the tooltip closed, so nothing shows.
- **Not fixed (by design): keepMounted cost.** Base UI runs no positioning listeners for a closed keepMounted positioner, so the cost is DOM nodes only.

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
