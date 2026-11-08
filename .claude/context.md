# Southpaw UI — Project Context

## What is this?

Open-source React component library: Base UI + Tailwind v4.
Positioning: "GOV.UK-level rigour with shadcn's ergonomics, on Base UI."

## Stack

- **Monorepo**: pnpm 11.9 workspaces + Turborepo
- **Runtime**: Node 24, React 19, TypeScript strict
- **Primitives**: `@base-ui/react` v1.9
- **Styling**: Tailwind v4 (`@tailwindcss/postcss` for docs, `@tailwindcss/vite` for storybook)
- **Variants**: clsx + tailwind-merge (use `cn()` from `packages/ui/src/lib/cn.ts`)
- **Docs**: Next.js 15 (App Router) in `apps/docs`
- **Storybook**: Storybook 10 in `apps/storybook` (reads stories from `packages/ui`)
- **Tokens**: CSS variables in `packages/tokens`, exported as `@southpawui/tokens/css`
- **Registry**: shadcn-compatible JSON builder in `packages/registry`
- **Tests**: Vitest 4 + Testing Library (unit), Playwright + axe-core (a11y/E2E)
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)

## Repo Layout

```
apps/docs          — Next.js docs site
apps/storybook     — Storybook 10
packages/tokens    — CSS variables (two-tier: primitive, semantic)
packages/ui        — Component source (Base UI + Tailwind)
packages/registry  — Build script for shadcn-compatible JSON
reference/         — BRIEF.md + benchmarks (gitignored, private research)
e2e/               — Playwright tests, screenshot tool, a11y audit, interact tool
```

## Conventions

### Naming

- CSS variable prefix: `--sp-*` for all library-owned vars
- Package scope: `@southpawui/*`
- Components export from `packages/ui/src/components/<Name>/<Name>.tsx`

### Theming

- Theme switching: `data-theme="light|dark|high-contrast"` on `<html>`
- Density: `data-density="compact|default|comfortable"` scoped to any subtree

### Component Patterns

- Every component wraps a Base UI primitive
- All sub-elements get `data-slot="<name>"` attributes
- Use semantic tokens, never raw colour values in components
- No runtime CSS-in-JS — only Tailwind classes and CSS variables
- NEVER use raw HTML elements — always use Southpaw components (Button, Input, etc.)
- For complex domain problems (phone, dates, currency), use battle-tested libraries

### Code Quality

- ESLint 9 flat config with `jsx-a11y` strict mode
- Prettier with `prettier-plugin-tailwindcss`
- Husky + lint-staged on pre-commit
- Never skip hooks (`--no-verify`) or bypass signing

### CI (GitHub Actions)

- Jobs: lint, typecheck, build, test, a11y (axe + Playwright)
- CodeRabbit reviews on PRs (`.coderabbit.yaml`)

## Project Management

- **Linear project**: [Southpaw UI](https://linear.app/georgeyiakoumiwebsite/project/southpaw-ui-22559aa66e7a) (team: GEO)
- **Notion project**: [Southpaw UI](https://app.notion.com/p/411feeb2a07881078efed614b5c4fe57)
- Branch from Linear issues when possible
- Branch naming: `geo-###-slug`

## Git Workflow

- Phase PRs use trunk branch (e.g. `phase-1`) with sub-PRs chained off each other
- Sub-PRs MUST be chained: each branches off the previous one, NOT independently off trunk
- Commit and push each ticket before moving to the next
- Each sub-PR targets the previous branch, trunk PR targets main

## E2E Tooling

- `pnpm screenshot <story-id>` — visual pixel comparison against baseline
- `pnpm a11y <story-id|component>` — axe-core a11y audit (JSON results)
- `pnpm interact <actions...>` — navigate, hover, click, type, tab, screenshot
- `pnpm dom <story-id>` — dump rendered DOM structure, slot/role tree, flag redundant wrappers
- `pnpm verify <component>` — run ALL checks: tests, a11y, duplicate IDs, accessible names, DOM redundancy, screenshots. **Must pass before presenting work to user.**

## References & Influences

These shaped the project's design decisions. Consult them when making UX, a11y, or design token choices.

### UX Research (Tier 1 — essential)

- **Laws of UX** — lawsofux.com (psychological principles)
- **Web Interface Guidelines** — interfaces.rauno.me (Rauno Freiberg, practical implementation)
- **Nielsen Norman Group** — nngroup.com (research-backed usability)
- **Baymard Institute** — baymard.com (form UX, field width ↔ expected input)
- **Apple HIG** — developer.apple.com/design (touch targets, motion, a11y)
- **Material Design 3** — m3.material.io (density, elevation, colour)

### Design System References (Tier 2)

- **GOV.UK Design System** — design-system.service.gov.uk (a11y rigour, error patterns, hint text)
- **IBM Carbon** — carbondesignsystem.com (helper text, validation, status indicators)
- **Shopify Polaris** — polaris.shopify.com
- **Atlassian Design** — atlassian.design (density, spacing)
- **Adobe Spectrum** — spectrum.adobe.com (character count, pending states, required/optional)
- **GitHub Primer** — primer.style (FormControl, validation, label guidelines)

### Token System Influences (credited in NOTICE)

- **Emil Kowalski** (@emilkowalski_) — motion tokens based on his published animation principles
- **Material Design 3** — density system uses the 4dp decrement model
- **Nathan Curtis (EightShapes)** — component sizing and spatial models
- **Atlassian Design System** — compact/default density modes, 8px base unit

### Libraries (credited in NOTICE)

- **Base UI** (MIT) — unstyled React primitives
- **shadcn/ui** (MIT) — registry format, composition patterns
- **libphonenumber-js** — phone formatting
- **react-phone-number-input** — international phone formatting
- **imask** — card number, expiry, CVV masking
- **country-codes-list** — country code data for phone selector
- **react-svg-credit-card-payment-icons** — card brand icons
