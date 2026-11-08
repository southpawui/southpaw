# Input — Change Log

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
