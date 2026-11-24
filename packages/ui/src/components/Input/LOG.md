# Input — Change Log

## 2026-11-23 — Server Components support (GEO-972)

- The implementation moved to `Input.parts.tsx` (`"use client"`, one named export per part). `Input.tsx` is now a server-safe entry that rebuilds the `Input` namespace and re-exports its types and helpers, so `<Input.…>` works from a Next.js Server Component (Base UI's pattern). Public API and import paths are unchanged.
- See `packages/ui/LOG.md` for the whole change and the guard that enforces it.

## 2026-11-07

### Initial styling (Phase 1) — ff665ba

Styled Input with token system.

## 2026-11-08

### Full enhancement (GEO-897) — 90cc489

**Purpose system (14 types)**: Auto-sets width, type, autocomplete, inputMode, placeholder based on semantic purpose (e.g. `purpose="email"`). Why: Baymard Institute research shows field width should hint at expected input length. Purpose encodes this knowledge so consumers don't need to remember which attributes to set for each input type.

**Compound sub-components (Input.Phone, Input.Card, Input.Password)**: All live in one file with utility functions extracted to `lib/input/`. Why: user preferred the shadcn approach — `import { Input } from "..."` and use `Input.Phone` etc. Keeps the import simple. Initially we had separate files but consolidated after user feedback that it felt fragmented.

**Phone formatting via react-phone-number-input + libphonenumber-js**: We tried building from scratch (failed), then libphonenumber-js directly (edge cases), finally settled on react-phone-number-input. Why: battle-tested library handles the hundreds of country format edge cases we can't.

**Card formatting via imask**: Initially didn't use imask — user asked why and insisted. Why: imask handles cursor positioning during masked input, which is notoriously hard to do correctly.

**Prepend/append addon system**: Three-tier padding based on content type (string=12px, icon=10px, Button=2px). Why: different content types need different visual weight. A text prefix like "https://" needs more breathing room than an icon button.

**Valid state**: Green border + checkmark icon. Why: mirrors error state but for success. Ant Design and Carbon both have this. Gives forms positive feedback.

### Known limitation documented (GEO-902) — 49c1c73

Base UI Field context propagates IDs to nested Select controls, causing duplicate IDs when PhoneCodeSelect is inside a Field. Why: Base UI's Select trigger inherits the Field's control ID automatically. We can't override it. Documented as TODO for Base UI upstream fix.

## 2026-11-21 — Type errors found by the new packages/ui typecheck (GEO-951, GEO-970 Part A)

- Change handlers are typed with Base UI's event (`InputChangeEvent`), not a plain React change event.
- The phone country select adapts Base UI's `onValueChange(value | null, details)` to the `(code)` callback and ignores `null`.
- No behaviour change.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- **Type narrowed:** `InputProps.className` is now `string`. It lands on the outer input group `<div>`, where Base UI's input state doesn't exist, so a function never worked there. Style states with the group's data attributes or `has-[]`.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Command-palette story uses Kbd (GEO-970 Part A)

- The Custom story's hand-styled `<kbd><CommandIcon/>K</kbd>` append is now `<Kbd keys="Mod+K" size="sm" variant="subtle" />`. It's platform-aware (⌘K on Apple, Ctrl+K elsewhere) and has a spoken name ("command k"). The unused `CommandIcon` import is removed.
- `pnpm verify input` fails only on the pre-existing Input.Phone duplicate IDs.
