# southpawui — Change Log

## 2026-11-23 — Sign-off (George): /improve and an independent review, all fixed

### Findings and fixes

Each fix has a regression test. I checked each test by reverting its fix: the test failed every time.

1. **High — a symlink could redirect writes outside the project** (e.g. a cloned repo's `components/southpaw -> /elsewhere`). `assertRealPathInside` now follows symlinks for every planned file before anything is written.
2. **Medium — registry targets could be any project file** (`.npmrc`, `package.json`), right before the CLI runs an install. Targets must now start with `components/southpaw/`.
3. **Medium — full URLs got round the `@southpaw`-only rule,** including URLs inside `registryDependencies` (e.g. `http://169.254.169.254/…`). URLs must now be on the registry's own origin.
4. **Medium — `add --dry-run` with no `southpaw.json`, run interactively, ran `init` for real** (writing files and installing). A dry run never offers to set up.
5. **Medium — in pnpm or yarn monorepos, the install used npm,** because detection stopped at the app folder. It now searches upward to the workspace's lockfile.
6. **Medium — CRLF checkouts (git `autocrlf`) made every re-run a conflict,** and in CI that meant exit 1. Line endings are now ignored when comparing files.
7. **Low — a mistyped command (`southpawui ad`) exited 0 silently.** It now prints "Unknown command", shows help and exits 1 (covered by an e2e check).
8. **Low — an indented `@import "tailwindcss"` put the tokens import at the top of the file.** Insertion now matches detection, allowing leading whitespace.
9. **Low — `have[name]` matched built-in object keys** (`constructor`, `toString`). It now uses `Object.hasOwn`.
10. **Low — `add` wrote files before finding that `package.json` was missing.** It now checks first.
11. **Low (dev tool) — `serve-registry.mjs` could crash on malformed percent-encoding.** It now answers 400.
12. **Low (test hygiene) — the registry contract test wrote into `apps/docs/public/r`,** and could race a docs build. `build.mjs` accepts `REGISTRY_OUT_DIR`, and the test builds into a temp folder.

None rejected.

### Docs (George, same sign-off)

- **On phones the copy button covered the end of single-line commands.** Untitled code blocks now end their scroll area before the button.
- **The inline `@import` in the Manual tab was clipped.** It's now a code block with a copy button, and long inline code wraps.
- **Docs verify:** it now runs at 320px as well, and checks every page, theme and width for no horizontal scroll and no code under a copy button (235 checks).

### Checks

66 CLI tests (6 files), the full e2e, and the docs verify. See the hand-over for the exact results.

## 2026-11-23 — v1: `init` and `add`, Southpaw's own installer (GEO-973)

### What changed

- **New package** `packages/cli`, published later as `southpawui`. It stays `private` until George approves the first publish.
- **Commands:**
  - `init` detects:
    - the framework: Next App or Pages Router, Vite, React Router 7, or other;
    - the package manager;
    - the path alias, from `tsconfig` `paths`, following `extends` and Vite's referenced `tsconfig.app.json`;
    - the global stylesheet: the framework's default first, then any CSS file importing `tailwindcss`, then a prompt.

    It then writes `southpaw.json`, installs the tokens and `cn`, and adds the tokens `@import` after Tailwind using the right relative path.

  - `add` fetches `<registry>/r/<name>.json`, resolves `registryDependencies` recursively (dependencies first, each item once, cycle-safe), writes files and installs npm dependencies with the detected package manager.
- **Mirrored layout.** Registry targets `components/southpaw/...` map to `<paths.components>/southpaw/...`. Southpaw's own imports are all relative (88 of them), so they need no rewriting. Only `@/components/...` alias imports, found in examples, are rewritten: to the project's alias, or to a relative path when there's no alias.
- **Overwrites:**
  - identical files are skipped;
  - differing files get a prompt (yes, no, yes to all, no to all);
  - `--overwrite` replaces them and `--yes` keeps them;
  - a non-interactive run with neither flag leaves them and exits 1 (E7).
- **Safety:**
  - registry targets that are absolute, contain `..` or resolve outside the project are refused;
  - npm package specs are validated, and installs run as argv through tinyexec, never via a shell;
  - registry URLs must be http(s);
  - only `@southpaw/*` items are accepted.
- **Registry build** (`packages/registry/build.mjs):**
  - `registryDependencies` are now `@southpaw/<name>`, so they no longer depend on the base URL;
  - npm dependencies carry version ranges from `packages/ui` (e.g. `@base-ui/react@^1.9.0`);
  - the base URL comes from `SOUTHPAW_REGISTRY_URL`, then `NEXT_PUBLIC_SITE_URL`, then localhost with TODO(domain).
- **Docs:**
  - The install tabs are now "southpawui" and "Manual". They open on Manual, with a "Available with v0.2.0" notice, until `SOUTHPAWUI_PUBLISHED` (in `apps/docs/lib/install.ts`) is set to true.
  - The Installation page is rewritten around `southpawui`, with one line on using the shadcn CLI (E3).
  - The LLM Markdown gives the `southpawui` commands.
- **Tests:**
  - 55 Vitest tests: unit tests plus a registry contract test that builds the real registry.
  - `scripts/e2e.mjs`: fresh Next (npm), Vite (pnpm, no alias) and Next (`src/`, `~/` alias) apps outside the repo, ending in production builds.
  - A CI workflow, `cli-e2e.yml`, runs the e2e when the CLI, registry, components or tokens change.
- **Publishing:** `release-cli.yml` publish job, disabled (`if: false`).

### Why

- **Option E** (George, 2026-11-23): our own installer with no shadcn dependency. The registry stays shadcn-format, so the shadcn CLI works too as an undocumented bonus. shadcn is credited in NOTICE.
- **Decisions E1–E7** (George, 2026-11-23):
  - E1: `southpaw.json`.
  - E2: TypeScript only.
  - E3: no shadcn tab; one line on the Installation page instead.
  - E4: `@southpaw/<name>` dependencies.
  - E5: Next, Vite and React Router 7 are first-class.
  - E6: stop when Tailwind v4 is missing.
  - E7: a non-interactive run with conflicts exits 1.
- **Dependencies:** `cac`, `@clack/prompts`, `picocolors`, `package-manager-detector`, `tinyexec`, `get-tsconfig` and `zod/mini`, plus native fetch. The survey is in RESEARCH.md §7.

### Found while testing (outside this package)

- **The `packages/ui` type errors broke consumers' builds.** Before GEO-970 Part A, installing Input, Field or Select into a Next app failed `next build`'s typecheck. Part A fixed them, and after rebasing onto it the e2e's scenario c installs `dialog-demo` (Dialog, Button, Field, Input) and builds cleanly.
- **The Server Components crash** (its own ticket): consumer pages must be `"use client"` for now. `init` prints this, and so does the Installation page.

### Considered and rejected

- **Wrapping or pinning the shadcn CLI** (D1/D2): replaced by option E.
- **Handing off to `shadcn init` with a `registry:base` item:** this hit four problems in testing (see RESEARCH.md §3).
- **A `$schema` URL in `southpaw.json`:** dropped until the docs have a domain to serve the schema from. Inventing a URL would point users at nothing.
- **Converting TSX to JS for JavaScript projects** (sucrase): deferred (E2).
- **Proxy support** (`undici` `EnvHttpProxyAgent`): deferred; documented in the README.
- **`node:util parseArgs`:** no subcommand help. **`commander`:** heavier, no gain over `cac`.
- **Running the e2e registry server inside the e2e process:** `spawnSync` blocks that process, so the server never answered. It runs in its own process (`scripts/serve-registry.mjs`).
