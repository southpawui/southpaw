---
paths:
  - "e2e/**/*.ts"
  - "packages/ui/src/components/**/*.stories.tsx"
---

# E2E Tooling Rules (loaded when editing stories or e2e scripts)

- All E2E tools use `localhost:6006` — NEVER `127.0.0.1:6006`
- `pnpm verify <component>` must pass before presenting work to user
- `pnpm screenshot <story-id>` — always read the screenshot image and critically evaluate it
- `pnpm a11y <component>` — check for BOTH violations AND inconclusives
- `pnpm dom <story-id>` — flag redundant wrapper divs
- After visual changes, use Playwright to check computed styles (width, height, opacity, cursor, animation)
- Do not delete screenshots until user confirms they are happy
