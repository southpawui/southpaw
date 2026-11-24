# @southpawui/ui — Package Change Log

Changes that apply across the package, not to one component. Each component's own `LOG.md` records its own changes.

## 2026-11-23 — Server Components support (GEO-972)

**The problem.** Rendering any Southpaw component from a Next.js App Router Server Component crashed. The docs site (GEO-894) found it.

- No module had `"use client"`, so Next treated components that use hooks, context or Base UI as server code. The build failed with `TypeError: (0 , g.createContext) is not a function`.
- Badge imported Phosphor's main entry, which uses React context and can't run on the server.

**The fix**

1. **`"use client"` on every client module, and only those.**
   - It's the first line of every component, part and lib file that uses hooks, context, Base UI or `useRender`: 55 files, now 39 `X.parts.tsx` and 16 others (including `lib/use-overflow.ts` from Toolbar, GEO-928).
   - These stay server-safe with no directive: Badge, Card, Spinner, DescriptionList's `format.ts`, and lib's `announce`, `cn`, `connected`, `delay`, `format-count`, `input/card-utils`, `input/phone-utils`, `link` and `merge-class-name`.
2. **Compound components use Base UI's pattern** (George, option (a)).
   - **Why:** a Server Component can't read a property off a client module, so `Tabs.Root` came through as `undefined`.
   - **How:** each of the 39 compound components now has its implementation in `X.parts.tsx` (`"use client"`, one named export per part, such as `TabsRoot`). `X.tsx` is a server-safe entry that rebuilds the namespace (`export const Tabs = { Root: TabsRoot, … }`), re-exports every type (`export type *`), and lists the other value exports (hooks, constants, helpers) by name.
   - **`Object.assign` components** (Input, Kbd, Menubar, Skeleton and SkipLink, which can be rendered themselves and have parts) get a small server-safe stand-in component that renders the root. React 19 passes `ref` as a prop, so refs still work from client components.
   - The namespace has an explicit `typeof` type, so declarations stay portable.
   - Public API and import paths are unchanged. The `XRoot`-style names live only in the parts files and aren't re-exported.
3. **Phosphor.** Badge, the only server-safe module that imports an icon, uses `XIcon` from `@phosphor-icons/react/ssr`. Client modules keep the main entry. `@phosphor-icons/react` moved from devDependencies to dependencies (same range, `^2.1.10`; George, option (a)), because consumers render the icons and need it installed. The lockfile change is that move, plus pnpm filling in esbuild 0.28.2's optional platform entries and a deprecation note for `tldts`. No installed version changed.
4. **The directive survives.**
   - `packages/ui` has no build step: `exports` point straight at `src/**/*.tsx`, so nothing strips the directive.
   - **Rule for the registry builder** (`packages/registry/build.mjs`, still a placeholder): copy each file's first line as it is, because the `"use client"` line has to stay first.
5. **Guards.**
   - **`lib/use-client.test.ts`** scans every source file. It fails when:
     - a module that uses hooks, context, Base UI or `useRender` doesn't start with `"use client"`;
     - a module without the directive imports Phosphor's main entry;
     - a namespace entry (`X.tsx` next to `X.parts.tsx`) has the directive or any client-only code;
     - a client `X.tsx` exports a namespace object.
   - It also checks that `cn`, `merge-class-name`, `format-count` and `delay` stay directive-free.
   - **`apps/docs/app/rsc-check/page.tsx`** is a Server Component that renders all 51 component entries, compound ones through dotted access, with serialisable props only. `next build` prerenders it, so a regression fails the docs build.

**Proof** (`next build` in apps/docs):

- **Before:** `Error: Failed to collect page data for /rsc-check … TypeError: (0 , g.createContext) is not a function`.
- **With only the directive:**
  - The single-export components build.
  - Compound ones fail: `Error occurred prerendering page "/rsc-check" … Element type is invalid … got: undefined`.
- **After:** `✓ Generating static pages (5/5)` and `○ /rsc-check 636 kB`, prerendered static. The HTML holds the markup of every component.

**Sign-off (2026-11-23).** Rebased onto Toolbar (GEO-928, `419fa86`). Toolbar was split the same way, keeping all of GEO-928's behaviour in `Toolbar.parts.tsx`, and `lib/use-overflow.ts` got `"use client"`. The /improve pass found two things, both fixed: the counts above were stale after the rebase, and `/rsc-check` is now `noindex`, since it's a build check rather than a docs page. The generated entries were also checked: every value export is re-exported, typecheck is clean across stories and tests, and the `Object.assign` stand-ins pass `ref` through.

**Writing a new component**

- **Hooks, context, Base UI or `useRender`:** put `"use client"` on the first line.
- **Compound (a namespace of parts):** put the parts in `X.parts.tsx` with `"use client"` and named exports, and build the namespace in a server-safe `X.tsx`. The guard enforces this.
- **Pure markup:** leave the directive off, and import icons from `@phosphor-icons/react/ssr`.
- **Server Components can't pass functions as props.** Event handlers, `render` functions and `onValueChange` need a client parent.
