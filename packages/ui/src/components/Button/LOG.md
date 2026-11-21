# Button — Change Log

## 2026-11-07

### Initial styling (Phase 1) — f5b50d1

Styled with token system. Basic unstyled Base UI wrapper.

### Full enhancement (GEO-895) — 178c84c

**Variant × Color separation**: Split visual style into `variant` (solid/outline/ghost) and `color` (default/brand/danger/inverse). Why: shadcn and Chakra both separate these concerns — combining them into a single prop (like "destructive") limits composition. A ghost danger button needs both axes.

**`label` prop**: Shorthand for children text. Why: matches the pattern where a prop is simpler than wrapping children for the common case. Label takes precedence over children so you can't have conflicting content.

**`srOnly` prop**: Screen reader label for icon-only buttons. Why: icon-only buttons need accessible names but shouldn't show visible text. This avoids verbose `aria-label` boilerplate.

**`icon` + `iconPosition`**: Icon as a ReactNode prop, not a child. Why: lets us apply asymmetric padding (less padding on the icon side) and swap the icon for a Spinner during loading without the consumer managing the layout.

**`loading` state**: Spinner replaces icon, button gets `aria-busy`. Why: every major library has this. Without it, consumers build inconsistent loading patterns.

**Nested radius via `--sp-nested-radius`**: When a button is inside a container (card, toolbar), it reads the container's radius variable and adjusts. Why: concentric border radius is a Material Design 3 principle — inner radius = outer radius - padding.

**Brand colour reserved for CTAs**: `color="default"` uses accent (not brand). Brand is only for primary CTAs. Why: user decision — brand should be rare and intentional, accent is for everyday UI controls.

## 2026-11-18 — ButtonGroup integration (GEO-896, approved shared change)

- **Reads `ButtonGroupContext`** (`../ButtonGroup/context.ts`). The group's `size`, `variant` and `color` are defaults, and the Button's own prop wins. The group's `disabled` disables every Button, even one with `disabled={false}` (MUI, Spectrum).
- **Adds `data-variant`**, so an attached ButtonGroup can draw dividers between solid buttons.
- **Icon-only size follows the group.** `size="icon"` takes the sm, md or lg square from the group's size, so it matches its neighbours. It's unchanged outside a group (still the md square).
- **Bug fix:** `disabled` is destructured out of the rest props. Before, `{...props}` came after `disabled={loading || props.disabled}`, so an explicit `disabled={false}` re-enabled a loading Button. A regression test is in ButtonGroup.test.tsx.
- **Pre-existing, not changed:** a loading Button is also `disabled`, so the disabled opacity stacks on top of `opacity-80`, which contradicts the "Loading keeps full opacity" comment. Flagged for its own ticket.
- `pnpm verify button`: all checks pass. The existing Button tests are unchanged and pass.
