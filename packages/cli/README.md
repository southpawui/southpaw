# southpawui

Install [Southpaw UI](https://github.com/southpawui/southpaw) components into your React project. The components are copied into your codebase, so you own and can change them.

> Not published yet. `southpawui` ships with Southpaw UI v0.2.0.

## Requirements

- React 19 and TypeScript
- Tailwind CSS v4 (`@import "tailwindcss";` in your global stylesheet)
- Next.js, Vite or React Router 7. Other setups work if they meet the requirements above.

## Usage

```bash
npx southpawui@latest init           # once per project
npx southpawui@latest add dialog     # any number of components
```

### `init`

Detects your framework, package manager, path alias and global stylesheet, then:

1. writes `southpaw.json`;
2. adds the design tokens and the `cn` helper to `<components>/southpaw/`;
3. imports the tokens in your global stylesheet, right after Tailwind;
4. installs `clsx` and `tailwind-merge`.

Re-running is safe. It keeps your `southpaw.json` unless you pass `--force`.

| Option             | Meaning                                                  |
| ------------------ | -------------------------------------------------------- |
| `--cwd <path>`     | Project root (default: current directory)                |
| `--registry <url>` | Registry base URL                                        |
| `--css <path>`     | Your global stylesheet, if detection picks the wrong one |
| `-y, --yes`        | Don't ask; use detected values and keep existing files   |
| `--force`          | Ignore an existing `southpaw.json` and detect again      |

### `add <names…>`

Downloads each component and everything it depends on, copies the files into `<components>/southpaw/`, and installs the npm packages they need with your package manager.

| Option             | Meaning                                            |
| ------------------ | -------------------------------------------------- |
| `--cwd <path>`     | Project root                                       |
| `--overwrite`      | Replace existing files that differ, without asking |
| `-y, --yes`        | Don't ask; keep your version of files that differ  |
| `--dry-run`        | Show what would change without writing anything    |
| `--registry <url>` | Registry base URL for this run                     |

If a file exists and differs, `add` asks first. In a non-interactive run (CI, pipes) with neither `--overwrite` nor `--yes`, it leaves the file alone and exits with code 1.

### Registry URL

The first of these wins: `--registry`, the `SOUTHPAW_REGISTRY_URL` environment variable, `southpaw.json`'s `registry`, then the default.

## Known limits (v1)

- **TypeScript only.** JavaScript projects aren't supported yet.
- **No proxy support.** Corporate HTTP(S) proxies (`HTTPS_PROXY`) aren't used. Run from a network that can reach the registry directly, or mirror the registry and point `--registry` at it.
- **Client Components.** Render Southpaw components from files marked `"use client"` until Server Component support lands.

## Development

```bash
pnpm --filter southpawui build      # compile to dist/
pnpm --filter southpawui test       # unit + registry contract tests
pnpm --filter southpawui e2e        # real installs into fresh apps (needs the network)
node packages/cli/scripts/serve-registry.mjs 4100   # serve the built registry locally
```

The registry format is shadcn's ([MIT](https://github.com/shadcn-ui/ui)), so the shadcn CLI can install from it too.

## Publishing

Not yet. The package is `private` until George publishes it. The release workflow's publish job is disabled.
