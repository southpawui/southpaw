# Input — Competitive Research

Researched: 2026-11-08 (during Phase 2 enhancement)

## Status: Enhanced ✓

Input has been through full BRIEF compliance. Research was conducted during GEO-897.

## What we implemented from research

- **Purpose system** — 14 semantic types auto-setting width/type/autocomplete/inputMode/placeholder (Baymard Institute field-width principle)
- **Compound sub-components** — Input.Phone, Input.Card, Input.Password (shadcn compound pattern)
- **Phone formatting** — react-phone-number-input + libphonenumber-js (battle-tested libraries)
- **Card formatting** — imask for number/expiry/CVV + brand detection (Stripe pattern)
- **Password toggle** — show/hide with Phosphor Eye/EyeSlash icons (all major libraries)
- **Prepend/append addons** — content-aware padding (3 tiers: string/icon/button) (shadcn InputGroup parity)
- **Valid state** — green border + checkmark (Ant Design, Carbon pattern)
- **Density-responsive** via `--sp-control-height` token
- **Nested radius** support

## Sources consulted

- shadcn, Mantine, Chakra, MUI, Ant Design, GOV.UK, Carbon, Spectrum, Primer, Stripe
