# Docs site — Change Log

## 2026-11-23 — Typecheck workaround removed; southpawui install tabs (GEO-973)

### What changed

- **Removed** `typescript.ignoreBuildErrors` from `next.config.mjs` and the scoped `scripts/typecheck.mjs`. `typecheck` is plain `tsc --noEmit` again. This branch now sits on GEO-970 Part A, which fixed the `packages/ui` type errors.
  - Verified: `pnpm typecheck` exits 0 with 0 errors, and `next build` type-checks and builds all 12 routes.
- **Install tabs** are now "southpawui" and "Manual". They open on Manual until `SOUTHPAWUI_PUBLISHED` in `lib/install.ts` is true, with a notice that the CLI is "available with v0.2.0".
  - The Manual tab lists versioned npm dependencies.
  - Its registry links are at least 24px tall, to meet the WCAG 2.2 target size.
- **Installation page** is rewritten around `southpawui`, with one line on installing with the shadcn CLI.
- **LLM Markdown** expands `<InstallTabs>` to the `southpawui` commands.
- **Phone overflow** (George's review):
  - Untitled code blocks now end their scroll area before the floating copy button, so commands never run underneath it.
  - The Manual tab's `@import` line is now a code block with a copy button.
  - Long inline code wraps (`overflow-wrap: anywhere`).
- **Docs verify** runs at 320px too, and checks every page, theme and width for no horizontal page scroll and no code under a copy button. I confirmed the copy-button check catches the old layout: 3 blocks failed with the fix turned off. It's now 235 checks.
- **Docs verify** also has 2 install checks: `dialog.md` shows the `southpawui` commands, and no page or LLM output says `shadcn@latest`.

### Why

- George's GEO-973 decisions: option E, plus E3 (no shadcn tab) and D4 (the tabs plan).
- The workaround was always temporary, marked TODO(GEO-970).

## 2026-11-21 — Sign-off (George), /improve pass (GEO-894)

### /improve findings and fixes

1. **CI breakage (HIGH).** `turbo typecheck` and `turbo build` for the docs failed on 8 pre-existing `packages/ui` type errors, pulled in through the docs' imports. Fixes:
   - `scripts/typecheck.mjs` fails on any `apps/docs` error and reports the `packages/ui` errors without failing. Checked: a planted docs error exits 1.
   - `next.config.mjs` sets `typescript.ignoreBuildErrors`, with TODO(GEO-970) to remove it once `packages/ui` type-checks.
2. **Untested in production (MED).** The checks had only run against the dev server, and the theme script is serialised with `Function.toString()`, which minification could break. Fix: ran the 113 checks against `next build` + `next start` (113/113).
3. **`next-env.d.ts` (MED).** Dev mode had rewritten it to import `.next/dev` types. Fix: committed the version `next build` writes.
4. **Domain TODO (requested by George).** Added `TODO(domain)` in `next.config.mjs` and `lib/shared.ts`. `localhost:3001` stays as the fallback.
5. **Wrong highlighting (LOW).** Manual install highlighted `.ts` registry files as `tsx`. Fix: the language now comes from the file extension.
6. **Stale comment (LOW).** `packages/registry/build.mjs` referred to `_abs` and `pending`. Fix: the comment now explains the import-cycle placeholder.

None rejected.

### Checks

- `pnpm --filter @southpawui/docs verify`: 113/113, against both the dev server and the production server.
- axe: 0 violations; the incompletes are explained (⌘ glyph, aria-hidden behind an open modal, an overlapping sticky header).
- Dialog `pnpm verify dialog`: all checks pass.
- Unit tests: 996/996 across 45 files.
- `pnpm --filter @southpawui/docs lint`, Prettier and `typecheck` pass. `typecheck` reports the 8 known `packages/ui` errors without failing.
- `next build`: 12 routes, all static or SSG.

### Open questions for George

- None new. The `packages/ui` findings (type errors, Dialog mobile margin, Tabs focus-ring clipping, Server Components crash) are with the coordinator and their own tickets.

## 2026-11-21 — Fumadocs site, BRIEF §8 template, Dialog page (GEO-894)

### What changed

- `apps/docs` moved from Next 15 to **Next 16.4** with **Fumadocs** (`fumadocs-core`, `fumadocs-mdx` in macro mode, `fumadocs-typescript`). The UI package is `@fumadocs/base-ui`, installed under the `fumadocs-ui` alias, which is what Fumadocs' own template does and what `fumadocs-typescript/ui` imports.
- **Theming.** `app/global.css` maps every `--color-fd-*` onto a semantic `--sp-*` token, so the sidebar, TOC, search and prose follow `data-theme`. The chrome's "primary" is `accent`; brand is never used.
- **Theme and density.** `components/preferences/`: a blocking script and a provider set `data-theme` (System, Light, Dark, High contrast; System honours `prefers-contrast: more`) and `data-density` on `<html>`, stored in localStorage. The controls are two Southpaw Selects in the sidebar footer, in place of Fumadocs' light/dark switch. next-themes is off.
- **Search.** Static Orama (`/api/search`, `staticGET`).
- **Registry** (`packages/registry/build.mjs`, shadcn apps/v4 pattern). Every `packages/ui` component, each `lib/` file it imports, the tokens and the demos in `packages/registry/examples` become shadcn registry items in `public/r/`, plus `registry/__index__.ts` (server metadata) and `registry/__components__.tsx` (lazy demo map). Installed files mirror `packages/ui` under `components/southpaw/`, so relative imports work unchanged. The output is generated by `pnpm registry` (run by dev and build) and gitignored.
- **BRIEF §8 blocks** (`components/docs/`): `StatusBadge` (frontmatter `status`, Zod-validated), `ComponentPreview`/`ComponentSource` (Preview/Code on Southpaw Tabs), `InstallTabs` (CLI and Manual, generated from the registry item), `Guidance`, `Alternatives`, `ContentRule`, `Anatomy`, `StateTable`, `KeyboardTable` (Southpaw Kbd), `ScreenReaderTable`, `APITable`.
- **API reference.** `APITable` wraps `AutoTypeTable`. It drops props declared by `@types/react` (every HTML attribute), keeps Southpaw and Base UI props with their JSDoc, and prints types of up to 48 characters in full.
- **Machine-readable output.** `/llms.txt`, `/llms-full.txt`, `/docs/<slug>.md` and "Copy Markdown". `lib/llms-markdown.ts` expands previews into source, install tabs into commands and API tables into Markdown tables.
- **Pages.** Introduction, Installation, Components/Dialog.
- **Verification.** `pnpm --filter @southpawui/docs verify` (`scripts/verify-docs.ts`) runs axe (violations fail, incompletes listed with reasons), duplicate IDs, accessible names, console errors, keyboard (focus trap, Escape, tabs), search, the theme and density controls, endpoints, and screenshots for every page in 3 themes × desktop and phone.

### Why

- Everything above is George's stack decision of 2026-11-21 (GEO-894).
- **Code themes:** `github-light-default` and `github-dark-default`. Shiki's default `github-light` red and green fall to about 4.1:1, which fails axe.
- **Code surfaces:** code blocks and cards sit on `surface-base` for the same reason.
- **App root:** an isolated app root (`<div className="isolate">`) is Base UI's documented setup. Without it, Dialog and Select popups rendered under the Fumadocs sidebar. It's also documented on the Installation page.
- **Phone tables:** below `sm`, the template tables render as cards (one DOM shape at a time, so assistive tech meets the content once). Four-column tables at 375px wrapped one word per line.
- **Tabs overflow:** docs tab lists use visible overflow, because `Tabs.List`'s `overflow-x-auto` clipped the focus ring to two side slivers.
- **Type mapping:** `tsconfig.json` maps `react` to the docs app's `@types/react`. `packages/ui` has React as a peer only and can't resolve its own types, so its prop types came out empty.

### Considered and rejected

- **next-themes for the theme switch.** It only resolves "system" to light or dark, and Southpaw needs `prefers-contrast: more` → high-contrast.
- **`fumadocs-mdx` with a `.source/` folder.** Macro mode needs no generated folder. The root ignores for `.source/**` stay, in case a future Fumadocs version brings one back.
- **Rewriting demo imports to a flat `components/ui/*`.** Mirroring `packages/ui` keeps the relative imports valid with zero rewriting.
- **Committing the generated registry output** (as shadcn does). Generated on every dev or build instead, so it can't drift from `packages/ui`.

### Open issues (outside apps/docs)

- `packages/ui` type errors block `next build`'s typecheck: Field, Input ×4, Select ×2, `lib/input/card-utils.ts`.
- Dialog: the mobile `max-w-[calc(100vw-2rem)]` is merged away by `max-w-md` in `cn()`, so dialogs touch the screen edges on phones. Also listed on the Dialog page.
- Tabs: `Tabs.List` `overflow-x-auto` clips the tab focus ring.
- No `packages/ui` file has `"use client"`, and `@phosphor-icons/react` (non-SSR entry) breaks Badge in Server Components.
