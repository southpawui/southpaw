# Spinner — Change Log

## 2026-11-10 — Polish

### What changed

- Added `label` prop — visible text alongside spinner (e.g. "Loading...")
- Added `variant` prop: circle (default) / dots (three bouncing dots)
- Wrapped in `<span>` with `role="status"` instead of directly on `<svg>` (supports label + dots)
- SVG gets `aria-hidden="true"` since the status role is on the wrapper
- sr-only "Loading" text rendered when no label prop (accessible fallback)
- Label uses `text-fg-default` not `text-current` (contrast safe across themes)
- Dot variant: 3 dots with staggered `animationDelay` (150ms apart) using `animate-bounce`
- Dot sizes scale with size prop (sm: 4px, md: 6px, lg: 8px)
- 7 unit tests, 5 stories (Default, WithLabel, Dots, Colours, Themes)
- 0 a11y violations

### Why

- **Label prop**: Only Chakra (1/8) has this, but it's trivial to add and very useful — consumers often need "Loading..." text next to a spinner. Without it, they manually compose `<Spinner /> Loading...` every time.
- **Dots variant**: Mantine + Ant (2/8) have this — meets the 2+ threshold. Common for chat "typing" indicators, inline loading states, and situations where a spinning circle feels too heavy.
- **Wrapper span**: Moving `role="status"` from the SVG to a wrapper `<span>` allows the label text and dots to sit alongside the spinner icon within the same status region.
- **text-fg-default on label**: `text-current` inherits the spinner's colour (often passed via className like `text-brand`). On dark backgrounds, `text-current` can fail WCAG contrast. `text-fg-default` is always safe.

### Considered and rejected

- **Indeterminate progress bar**: MUI has this as `CircularProgress variant="indeterminate"`. That's a different component (Progress). Spinner stays as a simple loading indicator.
- **Skeleton variant**: Some libraries offer skeleton loading states. Better as a separate Skeleton component, not a Spinner variant.
