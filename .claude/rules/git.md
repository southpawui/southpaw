---
paths:
  - "**/*"
---

# Git Workflow Rules

## Branching

- Phase PRs use trunk branch with sub-PRs chained off each other
- Sub-PRs MUST be chained: each branches off the previous one, NOT independently off trunk
- Each sub-PR targets the previous branch, trunk PR targets main
- Branch naming: `geo-###-slug`

## Committing

- Never commit without explicit user sign-off — ask them to review in Storybook first
- Never batch "commit and push" — they are separate decisions the user makes
- Commit messages follow conventional commits: `feat(scope):`, `fix(scope):`, `perf(scope):`, `test(scope):`, `refactor(scope):`
- Scope is the component name in lowercase (e.g. `feat(textarea): add autosize prop`)
- NEVER use `--no-verify` (enforced by hook)

## Releases

- After every feature PR merged: create patch/pre-release tag with GitHub Release
- After a phase completes: create minor version release with full changelog
- Use `gh release create`. Keep notes concise — group by component, breaking changes first.
