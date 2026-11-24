# Select — Change Log

## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `Select.parts.tsx` (`"use client"`, one named export per part). `Select.tsx` is now a server-safe entry that rebuilds the `Select` namespace and re-exports its types and helpers, so `<Select.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- See `packages/ui/LOG.md` for the whole change and the guard that enforces it.

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

## 2026-11-21 — Type errors found by the new packages/ui typecheck (GEO-951, GEO-970 Part A)

- Ref types now match what Base UI renders: `Select.Trigger` is `HTMLButtonElement` (it was `HTMLDivElement`, but it renders a `<button>`), and `Select.ItemText` is `HTMLDivElement` (it was `HTMLSpanElement`).

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Open styling keys off `aria-expanded`, not `data-popup-open` (GEO-970 Part A)

- **Why:** Base UI sets `data-popup-open` on a **Tooltip** trigger while its tooltip shows. A tooltip on a disclosure trigger therefore faked the open look. Combobox had worked around it with its own `data-list-open`.
- **One convention now:** a trigger's open state is styled from `aria-expanded="true"`. Disclosures set it (Menu, Select, NavigationMenu and Combobox, checked in Chromium); Tooltip triggers never do.
- The trigger's accent border and the icon rotation use `aria-expanded` (`aria-expanded:border-accent`, `[[aria-expanded=true]_&]:rotate-180`). Checked: the border goes from control to accent only when open.
- `pnpm verify` passes all checks.
