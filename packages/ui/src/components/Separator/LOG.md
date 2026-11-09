# Separator — Change Log

## 2026-11-09 — Full enhancement

### What changed

- Added `label` prop — text centred on the separator line (e.g. "OR", "Section 2")
- Added `labelPosition` prop: start/center (default)/end — controls where the label sits along the line
- Switched from hardcoded `bg-neutral-200` to semantic token `bg-border-default` (theme-aware)
- Label variant renders as a flex container with two line segments and text between them
- Label text uses `text-fg-muted` for visual hierarchy
- 6 unit tests, 4 stories (Default, Vertical, WithLabel, Themes)
- 0 a11y violations

### Why

- **Label support**: Common pattern for "OR" dividers in auth flows, section titles, "Read more" links. shadcn's Field.Separator had this but the standalone Separator didn't.
- **Label position**: Start/end positions are useful for section headers (label at the start with a long line) and "read more" patterns (label at the end). Only needs different `flex-1` vs fixed width on each line segment.
- **Semantic tokens**: The hardcoded `neutral-200` didn't adapt to dark/high-contrast themes.

### Considered and rejected

- **Style variants (dashed/dotted)** — only Chakra (1/8). Doesn't meet 2+ threshold. Consumers can override with `className="border-dashed"` if needed.
- **Spacing prop** — only MUI (1/8). Tailwind's `my-*` / `mx-*` utilities handle this already.
