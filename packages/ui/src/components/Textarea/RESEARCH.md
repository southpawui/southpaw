# Textarea — Competitive Research

Researched: 2026-11-08 (during Phase 2 enhancement)

## Status: Enhanced ✓

Textarea has been through full BRIEF compliance. Research was conducted during GEO-899.

## What we implemented from research

- **Autosize** via CSS `field-sizing: content` (no JS library — modern approach)
- **Resize prop** — vertical/horizontal/both/none applied to wrapper div (border resizes with content)
- **Valid state** — green border + checkmark (matches Input pattern)
- **Density-responsive** padding and min-height
- **Read-only + disabled** visual states with sunken background
- **Nested radius** support
- **Character count** — via Field.CharacterCount (composition, not duplication)

## What we deliberately skipped

- Built-in character count — use `Field.CharacterCount` instead (composition over duplication)
- Markdown support — that's an editor, not a textarea

## Sources consulted

- shadcn, Mantine, Chakra, MUI, GOV.UK, Carbon, Spectrum
