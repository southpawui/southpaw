# Toggle — Change Log

## 2026-11-18 — Enhancement (GEO-932)

George agreed to the scope via the coordinator; the research is in RESEARCH.md. Decisions:

1. **Button's API** (1a): `variant` solid|outline|ghost (default **outline**), `color` default|brand|danger|inverse, `size` sm|md|lg|icon, `icon`, `iconPosition`, `srOnly`, `label`, `loading`.
   - Reads `ButtonGroupContext`, so size, variant, colour and disabled come from a ButtonGroup (later ToggleGroup and Toolbar), and the Toggle's own props win. Icon-only squares follow the group's size.
   - Sets `data-variant`, so attached groups can draw their dividers.
2. **The pressed look isn't colour alone** (2b, WCAG 1.4.1). Each variant has an on/off pair (Chakra):
   - **Outline:** an accent tint and an accent border, plus a **1px outline just inside the 2px border**, so the border reads thicker.
   - **Ghost:** gains a 2px accent border (it keeps a transparent 2px border when off, so nothing shifts).
   - **Solid:** goes from a muted sunken fill to the full fill.
   - **`indicator`** adds a checkmark while pressed. Its space is reserved (opacity 0) so pressing doesn't shift the layout.
   - **Why an outline and not an inset box-shadow:** the first build used a box-shadow, and Playwright showed it **removed the focus ring** from a focused pressed toggle, because `sp-focus-ring` is a box-shadow too. With an outline, a pressed and focused toggle shows the same two-tone ring as Button.
   - **No semibold when pressed (dropped from the proposal):** a weight change resizes the text, so the toggle would change width when pressed.
3. **`pressedIcon`** (3a): swaps the icon through CSS (`group-data-[pressed]/toggle:`), so the accessible name never changes. The docs say not to swap the label (Spectrum): if the meaning changes, use a Button.
4. **Icon-only name** (4a): a dev warning when `size="icon"` has no `srOnly`, `aria-label` or `aria-labelledby`.
   - **GEO-959:** every icon-only Toggle in the stories (B/I/U, Favourite, Notifications, the sizes row) needs a Tooltip once Tooltip lands. Not cherry-picked.
5. **`loading`** (5a): the spinner replaces the icon, with `aria-busy`. It's disabled, as Button is, so toggling is blocked.
6. **`readOnly`** (6a): focusable, but the state can't change.
   - Base UI's `eventDetails.cancel()` vetoes the change; `aria-disabled="true"` is used because `aria-readonly` isn't allowed on a button.
   - It drops all hover effects. Unpressed, it goes sunken like a read-only Input; pressed, it keeps its pressed look.
7. **`inactive`** (7, Primer): looks disabled, but stays focusable and hoverable so a Tooltip can explain why.
   - `aria-disabled` plus the cancelled change; no hover and no press scale.
   - Built for Button too, in its own commit. Base UI's Toggle has no `focusableWhenDisabled`, unlike its Button, so Toggle does it by hand.
8. **`name`/`value`** (8a): a hidden input that submits `value` (default "on") only while pressed, like a checkbox, and follows controlled and uncontrolled state.
   - `lib/connected.tsx` now skips `[type=hidden]` and allows `S+hidden+S` adjacency, so a named Toggle inside an attached ButtonGroup keeps its overlapping borders and rounded ends.
9. **Invalid** (10a): a danger border from `aria-invalid` (shadcn), shown inside an invalid Field in States.

**Considered and rejected (George approved these exceptions to the "one library has it" rule):**

- **`fullWidth` prop (MUI):** toggles are inline controls. ButtonGroup `grow` and `className="w-full"` cover it, matching Button.
- **Badge/count prop (Carbon `badgeCount`):** compose a `<Badge>` as children instead (WithBadge story).
- **Keybinding hint in the tooltip (Primer):** deferred to GEO-959, Tooltip.

**Stories:** Default, Variants, Indicator, Sizes, IconOnly, LoadingReadOnlyInactive, Form (live FormData output), InButtonGroup, WithBadge, States, Density, Themes. Themes shows every variant × default/brand/danger, unpressed and pressed; indicator, read-only, inactive, invalid and disabled; and inverse on a dark surface, in light, dark and high-contrast.

States has no "valid" state: a toggle is an action, not a validated value (the same reasoning as ButtonGroup).

**Seen in review, left as is:**

- **Read-only pressed** looks like normal pressed. Only unpressed read-only toggles go sunken, and the cursor is the default arrow.
- **Unpressed solid in dark mode** is a muted fill close to the surface. The text marks the control, as with ghost.

**Verified:**

- 24 Toggle tests: aria-pressed; controlled and uncontrolled; Space and Enter; variants and colours; sizes; pressedIcon; indicator; the icon-only warning; loading; readOnly; inactive; disabled; invalid; FormData; and ButtonGroup integration.
- `pnpm test`: 417 passed.
- `STORYBOOK_PORT=6009 pnpm verify toggle`: all checks pass. The WithBadge story had a redundant wrapper div, now removed.
- Looked at all 12 screenshots.
- In Playwright, a focused pressed toggle has the two-tone focus ring, with the outline at -3px offset.

## 2026-11-18 — Fits its content by default (George, at sign-off)

- **Change:** Toggle gets `w-fit`. Before, it stretched to full width inside any column flex parent (the States story showed it full width). Toggles are inline controls, which is also why `fullWidth` was rejected. `className="w-full"` (tailwind-merge replaces `w-fit`) or ButtonGroup `grow` still makes one full width.
- **ButtonGroup:** it sets its toggles back to `w-auto` (`[&>[data-slot=toggle]:not([data-icon-only])]:w-auto`), so the group's layout decides, as for Buttons: stretch in vertical and stacked groups, grow with `grow`.
- **Measured in Playwright:**
  - States toggles are 130–209px, fitting their content.
  - A vertical attached group stretches them to an even 130px (new example in InButtonGroup).
- **Icon-only toggles keep their square.** The first version of the group override also widened the joined B/I/U icon toggles (seen in the InButtonGroup screenshot). Toggle now sets `data-icon-only`, and the override skips it.
- **Tests:** the default is `w-fit` and `w-full` overrides it; the group's override class is present; an icon-only toggle in a group keeps its square (regression).

**Signed off** by George, 2026-11-18. /improve was a quick self-review of the diff with no new findings. Before it, Playwright caught and fixed the focus-ring/box-shadow conflict.
