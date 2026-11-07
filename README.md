# Southpaw UI

> Lead with the other hand.

An open-source React component library built on [Base UI](https://base-ui.com) and Tailwind v4. Every component ships with full states, usage guidance, accessibility evidence, and a token-first theming system.

## Quick start

```bash
# Clone
git clone https://github.com/southpawui/southpaw.git
cd southpaw

# Install (requires pnpm 11.9+)
pnpm install

# Run Storybook
pnpm --filter @southpawui/storybook dev

# Run docs site
pnpm --filter @southpawui/docs dev

# Verify everything
pnpm verify
```

## Architecture

```
apps/
  docs/              Next.js 15 docs site
  storybook/         Storybook 10

packages/
  tokens/            Design tokens (primitives, semantic, density, motion)
  ui/                Component source (38 Base UI wrappers)
  registry/          Component registry JSON build (planned)
```

## Stack

- **Primitives**: Base UI v1.9
- **Styling**: Tailwind v4, CSS custom properties
- **Variants**: clsx + tailwind-merge
- **Framework**: React 19, TypeScript strict
- **Testing**: Vitest, Playwright, axe-core
- **CI**: GitHub Actions, CodeRabbit

## Token system

Two-tier architecture: **primitives** (raw palette) and **semantic** (purpose-driven mappings).

- Surfaces: base, sunken, raised, overlay, alternate
- Intents: brand (CTAs only), accent (UI controls), danger, success
- Density: compact / default / comfortable via `data-density`
- Themes: light / dark / high-contrast via `data-theme`
- Motion: productive + expressive, with `prefers-reduced-motion` support

## License

[MIT](LICENSE) — see [NOTICE](NOTICE) for credits and influences.
