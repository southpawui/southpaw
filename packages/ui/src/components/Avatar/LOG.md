# Avatar — Change Log

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
- **Tooltip component for name**: We haven't enhanced Tooltip yet (Wave 4). Using native `title` for now — will upgrade when Tooltip is ready.
