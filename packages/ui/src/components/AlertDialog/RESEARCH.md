# AlertDialog — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                  | shadcn | Mantine | Chakra | MUI | Carbon | Spectrum | Ours |
| ------------------------ | ------ | ------- | ------ | --- | ------ | -------- | ---- |
| No backdrop dismiss      | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Destructive variant      | Yes    | No      | Yes    | No  | Yes    | Yes      | No   |
| Focus on confirm button  | Yes    | Yes     | Yes    | No  | Yes    | Yes      | No   |
| Cancel + Confirm actions | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | Yes  |
| Animation                | Yes    | Yes     | Yes    | Yes | Yes    | Yes      | No   |

## Must-add features

- **Destructive variant** — danger-coloured confirm button for irreversible actions (shadcn, Chakra)
- **Entry/exit animation** — inherit from Dialog
- **Focus on cancel button** by default (safer UX — user must actively choose danger)

## Accessibility

- `role="alertdialog"` (NOT `role="dialog"`)
- Cannot be dismissed via backdrop click or Escape (per WAI-ARIA spec)
- Focus trapped within dialog
- First focusable element (cancel button) receives focus
- `aria-labelledby` + `aria-describedby` required

## Sources

- [WAI-ARIA AlertDialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
- [shadcn AlertDialog](https://ui.shadcn.com/docs/components/alert-dialog)
