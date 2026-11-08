# Button — Competitive Research

Researched: 2026-11-07 (during Phase 2 enhancement)

## Status: Enhanced ✓

Button has been through full BRIEF compliance. Research was conducted during GEO-895.

## What we implemented from research

- **Variant × Color** separation (solid/outline/ghost × default/brand/danger/inverse) — shadcn, Chakra pattern
- **Icon support** — `icon` + `iconPosition` props with asymmetric padding (Spectrum, Carbon)
- **Icon-only** size variant with `srOnly` for accessible name (Apple HIG)
- **Loading state** — Spinner replaces icon, `aria-busy` (Chakra, MUI)
- **Nested radius** — `--sp-nested-radius` for concentric curves in containers (Material)
- **Density-responsive** via `--sp-control-height` token (Material Design 3)
- **Touch targets** — 44px minimum on coarse pointers (Apple HIG, WCAG 2.5.8)
- **Motion** — Emil Kowalski's easing for hover/active transitions

## Sources consulted

- shadcn, Mantine, Chakra, MUI, Ant Design, GOV.UK, Carbon, Spectrum, Primer
