# Southpaw UI — Agent Instructions

For project context (stack, conventions, repo layout, tooling), see [context.md](context.md).

## Starting a new phase

When beginning a new phase of work (e.g. "Phase 2: v0.2 Components"):

1. **Create a Linear parent issue** for the phase (e.g. "Phase 2: v0.2 Components") in project "Southpaw UI", team GEO.
2. **Create sub-issues** in Linear for each task/component in the phase.
3. **Create the phase trunk branch** off `main` (e.g. `phase-2`) and push it immediately.
4. **Create the first sub-issue branch** off the trunk (e.g. `geo-900-enhance-select` off `phase-2`).
5. **Chain subsequent branches**: each new sub-issue branch is created off the previous sub-issue branch, NOT off the trunk. This creates a stacked PR chain.
6. **Each sub-PR targets the previous branch**. The trunk PR targets `main`.
7. When the phase is complete, squash and merge the trunk into `main`.

```
main
 └── phase-2 (trunk PR → main)
      └── geo-900-enhance-select (PR → phase-2)
           └── geo-901-enhance-checkbox (PR → geo-900)
                └── geo-902-enhance-dialog (PR → geo-901)
```

## Before actioning anything, follow these steps:

**MANDATORY: Before every task, re-read BOTH of these files and confirm you have done so. Do not skip this. Do not rely on memory. Open them, read them, then proceed. "Every task" means every new component, every new prompt from the user, every time you resume after a break or context compaction. If in doubt, re-read.**

1. This file: `CLAUDE.md` (process instructions)
2. Context file: `context.md` (stack, conventions, references, influences)

**STOP AND CHECK: If you are about to do any of the following, pause and verify you have followed the steps above:**

- Making a claim about what code does → Did you read it? (Step 1)
- Writing new component code → Did you check existing patterns? (Step 2)
- Building/enhancing a component → Did you research the competition? (Step 3)
- Saying "this works" or "looks good" → Did you screenshot and visually verify? (Step 4)
- Saying "tests pass" → Did you actually run them and see the output? (Step 5)
- Typing `git commit` or `git push` → Did the user explicitly approve? (Step 6)
- Finishing a task → Did you update the component LOG.md? (Step 7)
- Finishing a task → Did you update Linear and Notion? (Step 8)

### 1. Read before speaking

- **NEVER** make claims about what code does without reading it first.
- If asked about a file, component, or behaviour — read the source. No guessing, no assumptions.
- If you're unsure about something, check it. Open the file. Run the command. Look at the output.

### 2. Understand existing patterns first

- Before writing new code, read at least one existing component that's already been enhanced (Button, Input, Field, Textarea) to understand the established patterns.
- Match naming conventions, prop patterns, styling approach, and test structure.
- Check how similar components handle density, theming, states, and accessibility.

### 3. Research the competition

- Before enhancing a substantial component (forms, overlays, navigation), research how leading UI libraries implement it (shadcn, Mantine, Chakra, MUI, Ant Design, GOV.UK, Carbon, Spectrum, Primer).
- Identify gaps between our implementation and the best-in-class.
- Present findings and get approval before implementing.
- For simple components (Separator, Badge, Avatar), a quick check of 2–3 libraries is sufficient — use judgement on scope.
- **Do not defer features that multiple competitors offer.** If 2+ libraries have a feature (clear button, read-only state, virtual scroll, etc.), it should be in scope — not "added later." The goal is best-in-class, not minimum viable.
- **Document the research.** Save the competitive analysis as a `.md` file in the component's directory (e.g. `packages/ui/src/components/Select/RESEARCH.md`). Also add a summary to the Linear issue. This is a permanent record, not throwaway context.

### 4. Verify visually — use the E2E tools

These are not optional. Use them as part of every verification flow:

- `pnpm screenshot <story-id>` — take screenshots and visually confirm changes look correct.
- `pnpm interact <actions...>` — test hover, focus, active, disabled states by interacting with the actual rendered component.
- `pnpm a11y <component-name>` — run axe-core audit on all stories for the component. After EVERY story change, also run: (1) duplicate ID check across all stories, (2) check that every interactive element has an accessible name (`aria-label` or `aria-labelledby`). The CLI tool may not catch everything the Storybook addon does. Never present work to the user without having checked for both violations AND inconclusives.
- `pnpm dom <story-id>` — inspect the rendered DOM structure. Check for redundant wrapper divs, unnecessary nesting, and correct data-slot/role attributes. If a `<div>` wraps a single `<div>` with no semantic purpose, remove it.
- Read the screenshot images to verify with your own eyes. Do not skip this.
- **Critically evaluate** what you see — don't just confirm it renders. Ask: does the layout make sense? Is the spacing right? Are elements aligned? Would a user find this intuitive? Compare against how the competition does it. If something looks off, fix it before presenting to the user.
- **Screenshot EVERY story** before presenting to the user, not just one. A fix applied to one story may not have propagated to others. Check them all.
- **Both States AND Themes stories must show ALL states**: default, valid, error, disabled. Every visual state should be visible. No exceptions.
- Do NOT delete screenshots until the user has reviewed and confirmed they're happy. The user needs to see them. Only clean up after explicit user sign-off.

### 5. Run tests and verify

- Run `pnpm test` (Vitest) after every code change.
- Never claim something works without seeing the test output.
- If tests fail, fix them before moving on.
- **Before presenting ANY component to the user, run `pnpm verify <component>`.** This runs tests, a11y, duplicate IDs, accessible names, DOM redundancy, and screenshots in one command. If it fails, fix the issues before presenting. Do NOT skip this.

### 6. Never commit or push without user sign-off

- After making changes, ask the user to review in Storybook first.
- Wait for their explicit confirmation that it looks right.
- Only THEN ask if they're ready to commit.
- Never batch up "commit and push" — they are separate decisions.
- Commit messages follow conventional commits: `feat(scope):`, `fix(scope):`, `perf(scope):`, `test(scope):`, `refactor(scope):`. Scope is the component name in lowercase (e.g. `feat(textarea): add autosize prop`).

### 7. Update the component LOG.md

- Every component has a `LOG.md` in its directory. After every change — enhancement, bug fix, refactor, decision — add an entry with the date, what changed, and why.
- Include "Considered and rejected" entries for decisions that were reversed or features that were built and then removed, with reasoning.
- This is a permanent record that survives context compaction. Future `/improve` runs should read it before suggesting changes that contradict past decisions.

### 8. Keep Linear and Notion in sync

- Update Linear issue status when work starts, progresses, or completes.
- Add notes to Linear issues when scope changes or decisions are made.
- Update Notion project page to reflect current state.
- Do this as you go, not as an afterthought.

### 9. Assess whether /improve is warranted

- After completing a task, consider whether the scale and complexity warrants running `/improve` on the changed files.
- Small, isolated changes (a bug fix, a story tweak) — skip it.
- Substantial component work (new component, major refactor, compound sub-components) — run it.
- When in doubt, ask the user.

### 10. Releases

- **After every feature PR is merged**: create a patch/pre-release tag (e.g. `v0.1.0-alpha.1`, `v0.1.0-alpha.2`) with a GitHub Release summarising what changed. Skip for trivial fix-only PRs.
- **After a phase completes**: create a minor version release (e.g. `v0.1.0`, `v0.2.0`) with a full changelog covering everything in the phase.
- Use `gh release create` for GitHub Releases.
- Keep release notes concise — group changes by component, list breaking changes first.

## Rules

- **NEVER use raw HTML elements for interactive or semantic elements.** Use Base UI primitives (`@base-ui/react`) — not `<button>`, `<input>`, `<select>`, `<dialog>`, etc. If Base UI doesn't have a primitive, use an existing Southpaw component (e.g. `<Button>` not `<button>`). For layout and structure, prefer semantic HTML (`<section>`, `<nav>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<main>`, `<ul>`, `<ol>`, `<li>`) over generic `<div>` and `<span>`. Check how shadcn/ui and other leading libraries structure their markup before defaulting to divs.
- NEVER skip pre-commit hooks (`--no-verify`)
- For complex domain problems (phone, dates, currency), use battle-tested libraries
- Brand colour is reserved for CTAs, accent for UI controls
- Components should be full-width by default, responsive by default. In Storybook stories, wrap examples in a container with `sm:max-w-md` or `sm:max-w-lg` so they're presentable
- Only tokenise what Tailwind doesn't already handle well
