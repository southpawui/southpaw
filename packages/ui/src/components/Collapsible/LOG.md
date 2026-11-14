# Collapsible — Change Log

## 2026-11-14 — Signed off; /improve fixes before commit

George signed off on 2026-11-14 (relayed by the coordinator) and asked for /improve, fixes, a re-check, then commit and push.

/improve (quick, scoped to this folder) found four clear bugs. All are fixed, each with a regression test (6 new tests):

1. **A consumer `onFocus` on a show-more Panel switched off focus-to-expand.** `{...rest}` was spread after our handler and replaced it, so keyboard focus could land in clipped, invisible content. Focus-to-expand is now a native `focusin` listener added in an effect. It can't be overridden, and the consumer's `onFocus` passes through untouched. This also satisfies `jsx-a11y/no-static-element-interactions`, which the pre-commit lint flagged on the JSX handler.
2. **A custom Trigger `id` broke Panel labelling.** `role` panels used `aria-labelledby` with the _default_ trigger id. The Trigger now registers the id it actually renders with (`labelTriggerId` in context), and the Panel uses that.
3. **Duplicate IDs when Trigger and ShowMore shared a Root.** Both rendered the same id. ShowMore now has its own id (`<panelId>-show-more`).
4. **An icon-only Trigger could have no accessible name, with no warning.** There's now a one-time development `console.warn` (same pattern as ScrollArea). `closedLabel`/`openLabel` now take precedence over a static `aria-label`; previously the spread order let `aria-label` win silently.

**Lint fix at commit:** the `Panel` dispatcher now routes props explicitly. Base-only props (`hiddenUntilFound`, `keepMounted`, `render`) go only to the Base UI panel, and show-more props (`collapsedHeight`, `fade`) go only to the show-more panel. This replaces the unused `_x` placeholder destructures that ESLint rejected.

**Rejected after tracing it:** "`onOpenChangeComplete` never fires with `hiddenUntilFound={false}`". The hook lives in our wrapper, which stays mounted when Base UI unmounts the inner panel, and the timer fallback still fires.

**Flagged to George and the coordinator, not decided here.**

- In show-more mode a panel with `role` used to be named by the ShowMore button, so it was announced as "Show more". After fix 3 it is labelled only by a real Trigger, if one exists.
- So a show-more panel with `role="region"` and no Trigger now has no automatic name. Should it require `aria-label` and warn in development, as ScrollArea does? That's a behaviour/API decision.

## 2026-11-13 — Full enhancement (GEO-923, Lane 3)

I redid the research across all 9 libraries (see RESEARCH.md). George approved the scope and my recommendations on 2026-11-13.

### Bug fixed

- **The panel never animated open.** It only had `data-[starting-style]:h-0` / `data-[ending-style]:h-0` and no target height, so it snapped open. It now animates `height` to Base UI's `--collapsible-panel-height`, or `width` to `--collapsible-panel-width` when horizontal. Checked in Chromium: 0 → 25 → 36px over 250ms on open, and the reverse on close.

### What changed

- **Root:**
  - `size` (sm/md/lg; trigger heights use the density-aware `--sp-control-height-*`).
  - `variant` (`default`, `bordered`, `ghost`).
  - `orientation` (vertical/horizontal).
  - `animateOpacity`, `transitionDuration`, `transitionEasing` (exposed as `--sp-collapsible-duration` / `--sp-collapsible-easing`).
  - `onOpenChangeComplete(open)`. It fires after the size transition, or immediately when there is none, such as under reduced motion.
  - Root mirrors the open state (controlled or uncontrolled) in context, so every part can read it.
- **Trigger:**
  - Styled, with a built-in chevron that rotates when open.
  - `icon` accepts a node, a function of open state (swap icons such as plus/minus, no rotation), or `null` to hide it.
  - `iconPosition` start/end. A start chevron points to the inline end and turns down when open, which is Carbon's tree guidance; it flips in RTL.
  - `headingLevel` wraps the trigger in `h1`–`h6`.
  - Icon-only mode (no children) uses `closedLabel` / `openLabel` for state-specific accessible names.
  - Two-tone focus ring, disabled styling, and a forced-colours border.
  - Ghost underlines the label on hover so it still reads as a control. This follows GOV.UK's research that users skip triggers that look like links.
- **Header** (new): a row holding the trigger plus extra actions, or a title plus an icon-only trigger. Covers AntD `collapsible="icon"` + `extra`, and Spectrum DisclosureHeader.
- **Panel:**
  - Padding lives on an inner `data-slot="collapsible-content"` element so the height animation doesn't jump.
  - `hiddenUntilFound` is now **on by default**, so browser find-in-page and text-fragment links open the panel. Checked in Chromium with a `#:~:text=` link.
  - `role` `group`/`region`, labelled by the trigger.
  - `contentProps` for the inner element.
  - The bordered variant draws its divider on the content element, so it's clipped with the content and no 1px line shows when closed.
- **Show more** (new): `Panel collapsedHeight` plus `Collapsible.ShowMore` (`showLabel` / `hideLabel`).
  - The panel stays partly visible with a bottom fade (`--sp-collapsible-fade-size`, 3rem) and animates to full height.
  - The toggle and the fade disappear when the content already fits (Mantine Spoiler).
  - Keyboard focus moving into the clipped part expands the panel. `onOpenChange` fires with `reason: "none"`.
  - **It is not a Base UI Panel.** Base UI hides a closed panel with the `hidden` attribute, and Tailwind preflight forces `[hidden]{display:none !important}` in the base layer, which a utility can't override. So this panel is a plain element with measured height. The toggle is still a Base UI Trigger, so `aria-expanded` and `onOpenChange` work normally, with `aria-controls` set to our panel id.
- **Shared exports for Accordion:** `CollapsibleChevron` and `collapsibleStyles` (icon rotation, trigger size/variant classes, content padding, motion). Exported now so Accordion (GEO-922, next branch) can reuse them without editing this folder.
- **Tokens:** semantic tokens only (`fg-*`, `state-hover/pressed`, `border-default`, `surface-base`, `--radius-DEFAULT`, `--sp-nested-radius`); motion uses `--sp-duration-*` / `--sp-easing-*`; all transitions are removed under reduced motion.
- **Tests:** 27 unit tests covering structure, toggle by click and keyboard, controlled/default/disabled, completion callback, CSS vars, until-found default, unmount opt-out, region labelling, content slot, opacity and horizontal classes, icon placement/function/null, heading wrapper, icon-only labels, size/variant classes, the outside-Root error, and show-more (preview + fade, expand, fits → no toggle, focus-expand, custom labels).
- **Stories:** Default, States, Variants, Sizes, Icons, HeaderWithActions, HeadingAndRegion, ShowMore, Horizontal, Motion, Nested, FindInPage, Controlled, RTL, Density, Themes.

### Review change — flush header action (George, 2026-11-13)

- George didn't like the gap between the header action (gear) and the container edge in HeaderWithActions; it should be flush.
- Bordered `Header` no longer has end padding or a gap. Its trailing element, when it isn't a labelled trigger, becomes a square end cell:
  - It's sized to the density-aware control height for the current `size` (`w-[var(--sp-control-height*)]`, `min-h-*`, `h-auto`, `shrink-0`).
  - Its corners are square except the end corners, which take the container's `--sp-nested-radius`.
  - This applies to both an action Button and an icon-only trigger.
- Measured in Chromium: 40×40, 0px from the inner border edge, radius `0 9px 9px 0`.
- `aspect-square` was tried first and rejected: it doesn't resolve on a stretched flex item, so the action collapsed to 20px wide.

### Decisions (George, 2026-11-13: "go with your recommendations")

1. **Styled trigger with a built-in chevron**, rather than an unstyled trigger the consumer wraps in Button. It still accepts `render`.
2. **`headingLevel` is opt-in**, not a default `h3`.
3. **`hiddenUntilFound` defaults to true.** Pass `hiddenUntilFound={false}` to unmount expensive content while closed.
4. **Show more is built into Collapsible** (Chakra/MUI model), not a separate Spoiler component.
5. **States story:** closed, open, disabled, and disabled+open. Valid and error don't apply to a disclosure, the same call as ScrollArea.

### Known a11y-tool noise

- axe reports `color-contrast` as **inconclusive** ("overlapped by another element") for the story caption beneath the long show-more preview.
  - axe measures the clipped paragraph's full box (168px) rather than the 72px the panel shows. `elementsFromPoint` confirms nothing covers the caption.
  - It's a story caption, not part of the component. The same report on the ShowMore toggle went away once I made the toggle `position: relative`.

### Considered and rejected

- **`isolation: isolate` on the show-more panel** to quiet the axe report above: no effect, so I reverted it.
- **Using Base UI Panel for show-more**: impossible without fighting the preflight `[hidden]` `!important` rule (see above).
- **Divider on the panel (`border-t`)**: leaves a visible 1px line under a closed bordered trigger, because the panel collapses to its border width.
- **React `<Activity>` hide mode** (Chakra/Mantine `hideMode="activity"`): `hiddenUntilFound` (always mounted) or `hiddenUntilFound={false}` (unmounted) covers both needs, and Base UI owns mounting.
