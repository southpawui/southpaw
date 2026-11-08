# Select — Change Log

## 2026-11-07

### Initial styling (Phase 1) — 701eb6b

Styled Select with token system.

## 2026-11-08

### Full enhancement (GEO-900) — e08b97e

**Clearable with separator**: `onClear` prop on Trigger renders X button + vertical separator + chevron. Why: React Select uses this pattern — the separator visually separates the "clear" action from the "open dropdown" affordance. Without it, the X and chevron looked like one control. User feedback confirmed the separator was needed after initially shipping without it.

**Trigger auto-renders Icon**: Consumers no longer need `<Select.Icon />` — it's built into Trigger. Why: when clearable was added, consumers had to manually position Icon alongside ClearButton. This led to layout bugs (chevron appearing in the middle). Making Trigger own the trailing icon group prevents this class of bug entirely.

**ClearButton uses Button component**: Rendered as `<span role="button">` via `render` prop with `nativeButton={false}`. Why: can't nest `<button>` inside `<button>` (Select.Trigger is a button). Using our Button component instead of raw `<span>` follows the "no raw HTML" rule while avoiding DOM nesting violation.

**Virtual scroll via CSS `content-visibility`**: Applied on List with `virtualized` prop. Why: for 100+ item lists, CSS `content-visibility: auto` lets the browser skip rendering off-screen items. Much simpler than JS virtual scrolling (react-window/react-virtual) and works with keyboard navigation.

**Read-only state**: Sunken background, non-interactive. Why: matches Input/Textarea read-only pattern. 2+ competitors (Spectrum, Mantine) have this.

**`alignItemWithTrigger={false}` default on Positioner**: Why: Base UI's default positions the popup so the selected item overlays the trigger (native `<select>` feel). This caused positioning issues in our layout. Setting to `false` puts the popup below the trigger (dropdown feel), which is what shadcn and most modern libraries do.
