# Toast — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature                               | shadcn       | Mantine | Chakra | MUI | Carbon | Spectrum | Ours |
| ------------------------------------- | ------------ | ------- | ------ | --- | ------ | -------- | ---- |
| Variants (success/error/info/warning) | Yes          | Yes     | Yes    | Yes | Yes    | Yes      | No   |
| Auto-dismiss timer                    | Yes          | Yes     | Yes    | Yes | Yes    | Yes      | No   |
| Dismiss button                        | Yes          | Yes     | Yes    | Yes | Yes    | Yes      | No   |
| Action button                         | Yes          | Yes     | Yes    | Yes | No     | Yes      | No   |
| Stack multiple toasts                 | Yes          | Yes     | Yes    | Yes | No     | No       | No   |
| Position control                      | Yes          | Yes     | Yes    | Yes | No     | No       | No   |
| Swipe to dismiss                      | Yes (sonner) | No      | No     | No  | No     | No       | No   |
| Progress bar                          | No           | Yes     | No     | No  | No     | No       | No   |
| Animation                             | Yes          | Yes     | Yes    | Yes | No     | Yes      | No   |

## Must-add features

- **Variants** — success/error/info/warning with semantic colours and icons (all libraries)
- **Auto-dismiss timer** with configurable duration (all libraries)
- **Dismiss button** — accessible close button (all libraries)
- **Action button** — inline CTA ("Undo", "View", etc.) (shadcn, Mantine, MUI)
- **Stack multiple toasts** with proper positioning (shadcn, Mantine)
- **Position control** — top/bottom + left/center/right (shadcn, Mantine)
- **Swipe to dismiss** on touch devices (shadcn uses sonner)

## Accessibility

- `role="status"` or `role="alert"` (for errors)
- `aria-live="polite"` (informational) or `aria-live="assertive"` (errors)
- Must be dismissible via keyboard (Escape or close button)
- Auto-dismiss should pause on hover/focus
- Do NOT auto-dismiss error toasts (user needs time to read)
- Screen readers announce toast content automatically via live region

## Sources

- [shadcn Sonner](https://ui.shadcn.com/docs/components/sonner)
- [GOV.UK Notification Banner](https://design-system.service.gov.uk/components/notification-banner/)
- [MUI Snackbar](https://mui.com/material-ui/react-snackbar/)
