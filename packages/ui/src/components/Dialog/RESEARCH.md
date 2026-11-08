# Dialog — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature               | shadcn | Mantine | Chakra | MUI | GOV.UK | Carbon | Spectrum | Ours |
| --------------------- | ------ | ------- | ------ | --- | ------ | ------ | -------- | ---- |
| Focus trap            | Yes    | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |
| Backdrop click close  | Yes    | Yes     | Yes    | Yes | No     | Yes    | Yes      | Yes  |
| Escape to close       | Yes    | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |
| Size variants         | No     | Yes     | Yes    | Yes | No     | Yes    | Yes      | No   |
| Scroll locking        | Yes    | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |
| Nested dialogs        | No     | Yes     | No     | No  | No     | No     | No       | No   |
| Return focus on close | Yes    | Yes     | Yes    | Yes | Yes    | Yes    | Yes      | Yes  |
| Animations            | Yes    | Yes     | Yes    | Yes | No     | Yes    | Yes      | No   |

## Must-add features

- **Size variants** — sm/md/lg/full for different content types (Mantine, MUI, Spectrum)
- **Entry/exit animation** — fade + scale with reduced-motion fallback (shadcn, Mantine)
- **Scroll behaviour** — scrollable content area for long forms (MUI has `scroll="paper"` vs `scroll="body"`)

## Accessibility

- Focus trap: Tab cycles within dialog, never escapes to page behind
- First focusable element receives focus on open
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (Title), `aria-describedby` (Description)
- Escape key closes dialog
- Return focus to trigger element on close
- Backdrop click should close (but GOV.UK discourages — data loss risk)

## Sources

- [GOV.UK Modal Dialog](https://design-system.service.gov.uk/)
- [MUI Dialog](https://mui.com/material-ui/react-dialog/)
- [Spectrum Dialog](https://react-spectrum.adobe.com/react-spectrum/Dialog.html)
