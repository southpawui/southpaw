# Southpaw UI — Project Instructions

## What is this?

Open-source React component library: Base UI + Tailwind v4.
Positioning: "GOV.UK-level rigour with shadcn's ergonomics, on Base UI."

## Stack

- **Monorepo**: pnpm 11.9 workspaces + Turborepo
- **Runtime**: Node 24, React 19, TypeScript strict
- **Primitives**: `@base-ui/react` v1.9
- **Styling**: Tailwind v4 (`@tailwindcss/postcss` for docs, `@tailwindcss/vite` for storybook)
- **Variants**: CVA + clsx + tailwind-merge (use `cn()` from `packages/ui/src/lib/cn.ts`)
- **Docs**: Next.js 15 (App Router) in `apps/docs`
- **Storybook**: Storybook 10 in `apps/storybook` (reads stories from `packages/ui`)
- **Tokens**: CSS variables in `packages/tokens`, exported as `@southpawui/tokens/css`
- **Registry**: shadcn-compatible JSON builder in `packages/registry`

## Repo Layout

```
apps/docs          — Next.js docs site
apps/storybook     — Storybook 10
packages/tokens    — CSS variables (three-tier: primitive, semantic, component)
packages/ui        — Component source (Base UI + Tailwind)
packages/registry  — Build script for shadcn-compatible JSON
reference/         — BRIEF.md + benchmarks (gitignored, private research)
```

## Conventions

### Naming

- CSS variable prefix: `--sp-*` for all library-owned vars
- Package scope: `@southpawui/*`
- Components export from `packages/ui/src/components/<Name>/index.tsx`

### Theming

- Theme switching: `data-theme="light|dark|high-contrast"` on `<html>`
- Density: `data-density="compact|default|comfortable"` scoped to any subtree

### Component Patterns

- Every component wraps a Base UI primitive
- All sub-elements get `data-slot="<name>"` attributes
- Use semantic tokens, never raw colour values in components
- No runtime CSS-in-JS — only Tailwind classes and CSS variables

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

## Workflow

- When creating Linear issues, assign to project "Southpaw UI" and team "GEO"
- Use Linear issue branches for feature work
- PRs trigger CodeRabbit review automatically
- CI must pass before merge
