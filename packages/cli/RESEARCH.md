# southpawui CLI — Research (GEO-973)

Researched 2026-11-21 and 2026-11-22. Branch `geo-973-southpawui-cli`, cut from `geo-894-docs-site` @ `724c4e0`. Nothing is implemented, committed or published.

**Method:**

- shadcn 3.8.5 and 4.23.0 were installed in a scratch directory, and their bundles and `--help` output read directly.
- Every claim marked **(tested)** was run end to end. Each run used a scratch Next 16 app outside the repo (`create-next-app`), the Southpaw registry served locally on :4100, and items renamed to `@southpaw/*`.
- Documentation and ecosystem facts come from a research pass over the shadcn docs and published npm tarballs. Their sources are listed inline.

## 1. shadcn versions

|                                                                         | 3.x                                                        | 4.x                                                                                                                                                                                |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Latest                                                                  | 3.8.5 (2026-02-16), no release for ~9 months               | 4.23.0 (2026-10-27); 4.0.0 shipped 2026-03-06                                                                                                                                      |
| Install footprint (`npm i shadcn@x`)                                    | 292 packages, 107 MB                                       | 164 packages, 70 MB                                                                                                                                                                |
| Node                                                                    | not stated                                                 | `>=20.18.1`                                                                                                                                                                        |
| Stable programmatic API (`shadcn/registry`)                             | no `addRegistryItems`                                      | `addRegistryItems`, `getRegistriesConfig`, `resolveRegistryItems`, `searchRegistries`, … documented as stable ([api-reference](https://ui.shadcn.com/docs/registry/api-reference)) |
| `init` with Base UI                                                     | no                                                         | `-b/--base base\|radix\|aria`                                                                                                                                                      |
| `add` extras                                                            | none                                                       | `--dry-run`, `--diff [path]`, `--view [path]`                                                                                                                                      |
| `init <southpaw base item>` non-interactive **(tested)**                | stalls at "Preflight checks", writes nothing (2 of 2 runs) | works (see §3)                                                                                                                                                                     |
| `add @southpaw/dialog` with a configured `components.json` **(tested)** | works                                                      | works                                                                                                                                                                              |

The ticket says to pin `shadcn@3`. The evidence points to 4.x (see Decision D1).

## 2. Namespaced registries

- **`components.json` `registries`.** The schema is identical in 3.8.5 and 4.23.0 (read from the bundles). Each key must start with `@`, and maps to either:
  - a URL string containing `{name}` (and optionally `{style}`), or
  - `{ url, params?, headers? }`.

  `${VAR}` is expanded from `process.env` ([namespace docs](https://ui.shadcn.com/docs/registry/namespace), [components-json](https://ui.shadcn.com/docs/components-json)).

- **Resolution.** In the bundle, `{...builtIn, ...config.registries}[namespace]`, where the built-ins hold `@shadcn`. An unconfigured namespace throws `RegistryNotConfiguredError`.
- **`registryDependencies`** may use `@southpaw/<name>`. They resolve recursively through the same config **(tested:** `dialog` pulled `@southpaw/lib-cn` and `@southpaw/southpaw-tokens`).
- **Registry index.**
  - The index is `https://ui.shadcn.com/r/registries.json`, with 593 entries on 2026-11-22. Each entry has `name`, `homepage`, `url`, `description` and health and ranking data. `@southpaw` is **not** taken.
  - To get listed: open a PR adding an entry to `apps/v4/registry/directory.json` in shadcn-ui/ui and run `pnpm validate:registries`. The registry must be public, valid and flat ([registry-index](https://ui.shadcn.com/docs/registry/registry-index)).
  - Listed namespaces work **without** a `registries` entry and are auto-added to `components.json` ([changelog 2025-09](https://ui.shadcn.com/docs/changelog/2025-09-registry-index)). The namespace page says unlisted ones must be configured. Not tested, because we can't list yet.
- **`registry:base` (v4).**
  - This item type carries a `config` field: a partial `components.json` that can include `registries`.
  - `extends: "none"` stops it from layering onto shadcn's stock base ([examples](https://ui.shadcn.com/docs/registry/examples), [cli v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4)).
  - Prior art: coss ui (`shadcn init @coss/style`) and Singapore's OUI (`shadcn init https://oui.open.gov.sg/r/oui.json`).

## 3. What `shadcn init <@southpaw base item>` does (v4.23.0, tested)

| Base item              | Result                                                                                                                                                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Without `extends`      | Writes `components.json` **with** `registries["@southpaw"]`, the tokens and `cn`. **But** it also installs the stock shadcn base: `radix-ui`, `lucide-react`, `class-variance-authority`, `tw-animate-css`, `lib/utils.ts`, and shadcn's theme in `globals.css`. |
| With `extends: "none"` | Clean. Only Southpaw's dependencies (`@base-ui/react`, `@phosphor-icons/react`, `clsx`, `tailwind-merge`), the tokens and `cn`, plus the `registries` entry.                                                                                                     |

**Problems found:**

1. **The CSS import path is wrong.** The item's `css` key is written verbatim (`@import "./components/southpaw/tokens/index.css"`) into `app/globals.css`, so it resolves to `app/components/...`. **`next build` fails** with "Can't resolve". Changing it to `../components/...` builds. A registry item can't know the consumer's CSS location, so whatever writes the import must compute the relative path.
2. **The first non-TTY run in a fresh project exits 0 and writes nothing.** This happened on 2 separate apps, and the second run worked. A wrapper or CI script that trusts the exit code would report success for a no-op.
3. **A hand-written minimal `components.json`** (missing `iconLibrary` and `rtl`) made `add` hang on a prompt it couldn't show without a TTY. A complete `components.json`, matching what v4 `init` writes, works.
4. **Server Components (already being ticketed).** A default App Router page that renders installed Southpaw components fails `next build` with `createContext is not a function`. It builds once the page is `"use client"`. This confirms the consumer-facing impact.

After `add @southpaw/dialog @southpaw/button`, the CSS fix and a `"use client"` page, the scratch app builds and its CSS contains the token utilities (`bg-surface-overlay`, `sp-focus-ring`, `--sp-duration-entrance`).

## 4. Existing branded CLIs

| CLI                                                                  | How it installs                                                                                 | shadcn pinned?        |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------- |
| Kibo UI (`kibo-ui` 1.1.5)                                            | `add` only; `spawnSync("npx -y shadcn@latest add <url>")`, `shell: true`                        | No (`@latest`)        |
| 21st.dev (`@21st-dev/cli` 1.18.0)                                    | writes the item to a temp file, runs `npx shadcn@latest add <file>`                             | No                    |
| Animate UI (`@animate-ui/cli` 2.4.0)                                 | doesn't wrap shadcn; its docs say `shadcn@latest add @animate-ui/<item>`                        | n/a                   |
| Magic UI (`magicui-cli`), Aceternity (`aceternity-ui`), shadcnblocks | **forks** of the old shadcn CLI; Magic UI's current docs use `shadcn add @magicui/...` directly | n/a (abandoned forks) |
| coss ui                                                              | no CLI; `shadcn init @coss/style` plus `@coss/...`                                              | n/a                   |

Nobody pins shadcn. Every live wrapper calls `npx shadcn@latest`, so a breaking shadcn major breaks the wrapper. Pinning is where we can be more reliable than the competition.

## 5. Invoking shadcn from `southpawui`

- **Make `shadcn` a dependency pinned to an exact version.**
  - The version is locked: `npx southpawui@x` always runs the shadcn version it was tested with.
  - There's no second npm download at run time (`npx shadcn@4` fetches on every cold cache).
  - "Offline" only covers the CLI itself: registry items are still fetched from the docs domain over HTTP.
- **Resolving the binary.** shadcn doesn't export `./package.json` (`ERR_PACKAGE_PATH_NOT_EXPORTED`), so `require.resolve("shadcn/package.json")` fails. Resolve the package entry with `import.meta.resolve("shadcn")` instead, then spawn `node <entry>`. Its `bin` and its `.` export are both `dist/index.js`.
- **Programmatic alternative.** `addRegistryItems(names, { cwd, config, overwrite, silent })` in `shadcn/registry` (v4) is documented as stable and never prompts. There's no `init` API.
- **southpawui on npm.** Versions `0.0.0-stage` and `0.0.0` exist under George's account. The org `@southpawui` is his. We don't publish.

## 6. Southpaw registry today (GEO-894)

- Items have bare names (`dialog`, `lib-cn`, `southpaw-tokens`), and `registryDependencies` are full URLs built from `NEXT_PUBLIC_SITE_URL`, falling back to `http://localhost:3001`.
- Files install under `components/southpaw/`, mirroring `packages/ui`, so the relative imports need no rewrite. This worked unchanged in the scratch app.

## 7. Decision E (George, 2026-11-23): our own installer, with no shadcn dependency

`southpawui` installs on its own. shadcn is credited in NOTICE only for the registry format, which we keep compatible, so the shadcn CLI also works against our registry as an undocumented bonus. Sections 1, 3 and 5 above are background, not the plan.

What this changes:

- No hand-off to `shadcn init`, so the four problems in §3 don't apply to us. The CSS import path is still something we must compute ourselves.
- Import rewriting is small:
  - All 88 internal imports in `packages/ui` are relative, with no `@/` aliases.
  - Installing each item as a mirrored subtree under the user's components folder (`<components>/southpaw/...`) keeps them valid unchanged.
  - Rewriting is only needed for alias-style imports, which appear in example and block items (`@/components/southpaw/...` → the user's alias).

### Dependency survey (npm, 2026-11-23)

| Need                                          | Package                     | Version / last release             | Own deps | Weekly downloads             |
| --------------------------------------------- | --------------------------- | ---------------------------------- | -------- | ---------------------------- |
| Commands and flags                            | `cac`                       | 7.1.1 / 2026-11-20                 | 0        | 73M                          |
| Prompts and spinners                          | `@clack/prompts`            | 1.9.0 / 2026-11-09                 | 4        | 49M                          |
| Colours                                       | `picocolors`                | 1.1.1 / 2024-10 (stable, finished) | 0        | 358M                         |
| Package manager detection and commands        | `package-manager-detector`  | 1.9.0 / 2026-10-05                 | 0        | 73M                          |
| Running the install without a shell           | `tinyexec`                  | 1.3.1 / 2026-09-03                 | 0        | 244M                         |
| tsconfig/jsconfig with `extends`              | `get-tsconfig`              | 4.14.3 / 2026-08-17                | 1        | 173M                         |
| Validating registry items and `southpaw.json` | `zod` (`zod/mini`)          | 4.6.7 / 2026-10-12                 | 0        | already used in the monorepo |
| Fetching                                      | native `fetch` (Node >= 20) | —                                  | —        | —                            |

Considered and rejected:

- `commander` (heavier, no benefit over cac) and `citty` (pre-1.0).
- `node:util parseArgs`: no subcommand help.
- `undici` for proxy support (1.5 MB). Proxies are deferred; native fetch only.
- `valibot`: zod is already in the repo.

## Sources checked

- **Read from the bundles or run:** shadcn 3.8.5 and 4.23.0 `--help`, the bundle schemas (`registries`, `registry:base`, `extends`, `config`), and the `shadcn/registry` exports.
- **Tested end to end:** v4 `init` with and without `extends: "none"`, v3 `init`, v3 and v4 `add @southpaw/...`, `next build`, and the generated CSS.
- `https://ui.shadcn.com/r/registries.json`: fetched; `@southpaw` is free.
- Docs: [namespace](https://ui.shadcn.com/docs/registry/namespace), [components-json](https://ui.shadcn.com/docs/components-json), [registry-index](https://ui.shadcn.com/docs/registry/registry-index), [api-reference](https://ui.shadcn.com/docs/registry/api-reference), [examples](https://ui.shadcn.com/docs/registry/examples), [cli](https://ui.shadcn.com/docs/cli), and the changelogs for [CLI 3](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp), [the registry index](https://ui.shadcn.com/docs/changelog/2025-09-registry-index) and [CLI 4](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4).
- Wrapper CLIs: published npm tarballs of `kibo-ui`, `@21st-dev/cli`, `@animate-ui/cli`, `magicui-cli`, `aceternity-ui` and `shadcnblocks`, plus coss ui's and OUI's docs.

**Not verified:**

- Index-listed namespaces working without config. We're not listed yet, and the docs contradict each other.
- The cause of the first-run silent no-op.
- Whether `addRegistryItems` installs npm dependencies itself.
