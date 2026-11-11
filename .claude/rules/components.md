---
paths:
  - "packages/ui/src/components/**/*.tsx"
  - "packages/ui/src/components/**/*.ts"
---

# Component Rules (loaded when editing component files)

- Every component wraps a Base UI primitive from `@base-ui/react`
- All sub-elements get `data-slot="<name>"` attributes
- Use semantic tokens from `packages/tokens/` — never raw colour values
- No runtime CSS-in-JS — only Tailwind classes and CSS variables
- Use `cn()` from `packages/ui/src/lib/cn.ts` for className merging
- NEVER use raw HTML elements for interactive elements — use Base UI or Southpaw components
- Brand colour is reserved for CTAs (`color="brand"`), accent for UI controls
- Components are full-width by default, responsive by default
- Every component needs: RESEARCH.md, LOG.md, tests, stories (Default, States, Density, Themes)
- States story must show: default, valid, error, disabled
- Themes story must show: all variants, all colour options, across light/dark/high-contrast
