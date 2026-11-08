# {ComponentName} — Enhancement Checklist

## Research

- [ ] Read RESEARCH.md for this component
- [ ] Identify gaps vs competition
- [ ] Present findings to user and get approval

## Implementation

- [ ] Read existing code before making changes
- [ ] Check patterns from enhanced components (Button, Input, Field, Textarea, Select, Checkbox)
- [ ] Replace inline SVGs with Phosphor icons
- [ ] Add `data-slot` to all sub-elements
- [ ] Add `valid` prop (if applicable)
- [ ] Add `data-[invalid]` border (if applicable)
- [ ] Add disabled styling
- [ ] Add density-responsive spacing/sizing
- [ ] Add nested radius support (if applicable)
- [ ] Add entry/exit animation (if applicable)
- [ ] No raw HTML elements — use Base UI primitives
- [ ] No redundant wrapper divs

## Stories

- [ ] Default story
- [ ] States story (all states: default, checked/selected, valid, error, disabled)
- [ ] Density story (compact, default, comfortable — density toolbar disabled)
- [ ] Themes story (light, dark, high-contrast — ALL states in each theme)
- [ ] Stories wrapped in `sm:max-w-md` or `sm:max-w-lg`

## Verification (run `pnpm verify {component-name}`)

- [ ] Unit tests pass
- [ ] A11y audit — 0 violations
- [ ] No duplicate IDs
- [ ] All interactive elements have accessible names
- [ ] No redundant wrapper divs
- [ ] Screenshots taken and reviewed by user
- [ ] DOM structure inspected (`pnpm dom`)

## Sign-off

- [ ] User reviewed in Storybook
- [ ] User approved commit
- [ ] Linear issue updated
- [ ] PR created (chained off previous branch)
