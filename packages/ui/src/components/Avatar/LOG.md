# Avatar — Change Log

## 2026-11-13 — Name tooltip replaces native `title` (GEO-941)

### What changed

- `name` no longer sets the native `title`. It now:
  - wraps the avatar in a Southpaw `Tooltip` (`type="label"`), with the avatar element itself as the trigger, so it shows on hover and on touch long-press;
  - gives the avatar `role="group"`, named by the tooltip (`aria-labelledby`).
- `tooltip={false}` keeps the accessible name (`aria-label`) without the tooltip (Carbon's separate `tooltipText`).
- `Avatar.Group`:
  - wraps its children in a `Tooltip.Provider`, so once one name shows, neighbours open instantly (Mantine `Tooltip.Group`);
  - the `+N` overflow gets a tooltip listing the hidden avatars' names (Mantine), linked as its `aria-describedby`.
- **Stories**: new `WithName` story; Group and Themes examples now have names.
- **Tests**: 8 → 17.
- **Research**: added a 9-library section to RESEARCH.md.

### Why

- **Native `title`**: invisible on touch, unreliable for assistive tech, and unstyled.
- **`role="group"` rather than `role="img"`**: `img` makes children presentational, which would hide `Avatar.Status`'s "Status: online" label. A named group announces the name and keeps the image and status reachable. Without `name`, Root gets no role (unchanged).
- **Option 1, approved by George 2026-11-13**: static avatars stay non-focusable. No library makes a static avatar a tab stop just for a tooltip, and Primer and Spectrum say tooltips belong on interactive elements. Keyboard and screen-reader users get the name from the accessible name. To make the tooltip keyboard-reachable, render the avatar as a link or button via `render` (the group role is skipped when `render` or `role` is passed).

### /improve fixes (same day, George asked for all five)

1. **`+N` is now named, not just described.** Screen readers in browse mode don't announce descriptions on static text.
   - It is `role="img"` with the tooltip as its label, using a visually hidden prefix plus commas: "2 more: Cy, Di".
   - Without names it is `aria-label="N more"`.
   - Chromium inserts a space before each hidden comma ("Cy , Di"). Screen readers ignore that whitespace, so it was left.
2. **Link/button rendering is now tested.** `render={<a href>}` gives a focusable link named by the tooltip, and the tooltip opens on keyboard focus. The LOG claim is no longer unverified.
3. **`+N` tooltip and name** add "and K more" for hidden avatars without a `name`.
4. **Consumer ARIA:**
   - `aria-label` wins as the name, and the tooltip becomes the description.
   - `aria-labelledby` / `aria-describedby` go on the trigger, so they merge with the tooltip's.
5. **JSDoc** says to use `alt=""` on `Avatar.Image` when `name` is set, to avoid announcing the name twice. The story helper `DemoAvatar` does this.

- **Tests**: 17 → 21. Full suite 319 passing; `pnpm verify avatar` passes.

**Status 2026-11-13 (end of day):** implementation and fixes done, uncommitted on `geo-941-avatar-tooltip`. Awaiting George's Storybook review and sign-off.

### Considered and rejected

- **Making named avatars focusable** (option 2): it adds tab stops with nothing to activate. George chose option 1.
- **Ant's `+N` popover**: we used a tooltip listing the names instead. Ant's popover renders the hidden avatars themselves, which is interactive content and belongs in a Popover, not a Tooltip.

## 2026-11-09 — Full enhancement

### What changed

- Added `shape` prop: circle (default) / square with rounded-lg (Chakra, MUI, Ant — 3/8)
- Added `name` prop on Root — native `title` tooltip on hover (will upgrade to Tooltip component in Wave 4)
- Added `Avatar.Status` sub-component — online/offline/busy/away dot indicator (MUI, Chakra, Ant — 3/8)
- Added `Avatar.Group` sub-component — overlapping stack with `max` prop and "+N" overflow counter
- Group hover animation: `scale-110` from centre + `z-20` pop (125ms press duration, ease-out)
- Group stacking: last-on-top (natural DOM order) — matches MUI, shadcn, Ant majority pattern
- "+N" counter: `position: relative` for correct stacking, same hover animation as avatars
- Removed `overflow-hidden` from Root — was clipping Status dots. Image/Fallback now clip via `rounded-[inherit]`
- Image: `pointer-events-none select-none draggable={false}` — prevents drag
- Fallback: `select-none` — prevents text selection
- Switched from hardcoded `neutral-200`/`neutral-600` to semantic tokens (`bg-surface-alternate`, `text-fg-muted`)
- Added `data-size` and `data-shape` attributes on Root for external styling hooks
- Status dot scales with parent avatar size via `[[data-size=*]_&]` selectors
- 8 unit tests, 6 stories (Default, Sizes, Shapes, WithStatus, Group, Themes)
- 0 a11y violations

### Why

- **Shape variants**: 3/8 competitors offer square avatars. Common for workspace/org avatars vs user avatars.
- **Avatar.Group**: Essential for showing team members, collaborators, assignees. The overlap pattern is universally recognised.
- **Last-on-top stacking**: MUI, shadcn, and Ant all use this — it's more intuitive because the most recent avatar is visually prominent.
- **Hover animation**: GitHub Primer does z-index bump on hover. We added scale from centre for a clean pop effect. 125ms (press duration) keeps it snappy.
- **No overflow-hidden on Root**: Status dots need to overflow the avatar bounds. Clipping moved to Image/Fallback via `rounded-[inherit]` — same visual result, dots visible.
- **Drag/select prevention**: Avatars are display elements — dragging the image or selecting the fallback text is never intended behaviour.

### Considered and rejected

- **First-on-top stacking**: GitHub Primer does this, but the majority (MUI, shadcn, Ant) use last-on-top. We followed the majority.
- **Explicit z-index on each avatar**: Unnecessary — natural DOM order handles stacking. Only hover gets explicit z-index.
- **Loading/skeleton state**: 0/8 competitors have this built into Avatar. Deferred.
- **Tooltip component for name**: We haven't enhanced Tooltip yet (Wave 4). Using native `title` for now — will upgrade when Tooltip is ready. _(Done 2026-11-13, GEO-941.)_
