import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { announce } from "../../lib/announce";
import { delayMs, type LoadingDelay } from "../../lib/delay";
import { Spinner } from "../Spinner/Spinner";
import { Progress } from "../Progress/Progress";

/* ============================================================
 * LoadingOverlay (GEO-965)
 *
 * Covers a busy region (a card, a table, a form section) with a backdrop
 * and a Spinner while it reloads, filters or saves. Wrap the region:
 *
 *   <LoadingOverlay loading={isPending} label="Loading orders">
 *     <OrdersTable />
 *   </LoadingOverlay>
 *
 * - The content gets aria-busy at once, and `inert` once the overlay shows,
 *   so nobody can click, type or tab into stale content. The overlay sits
 *   outside the busy subtree, so its text and Cancel stay reachable.
 * - Focus inside the region moves to Cancel (if any) or the overlay panel,
 *   and comes back when loading ends. It never falls to <body>.
 * - A delay (default "short") stops fast responses flashing, and a minimum
 *   display time stops a shown overlay flickering off.
 * - Start and finish are announced once each through lib/announce; the
 *   Spinner is a picture only.
 * - `fullscreen` blocks the whole page through a Base UI modal Dialog.
 *
 * For a first load with nothing to show yet, use Skeleton instead.
 * ============================================================ */

export interface LoadingOverlayProps extends React.ComponentPropsWithRef<"div"> {
  /** Show the overlay (after `delay`). */
  loading?: boolean;
  /** Visible text in the panel, its accessible name, and the start announcement. Default "Loading". */
  label?: string;
  /** More detail under the label: "This can take a minute". */
  description?: React.ReactNode;
  /** Announced when loading ends, if the overlay was shown. Default none: set it, or move focus to the new content. */
  doneLabel?: string | null;
  /** Wait before showing: `true` 1000ms, `"short"` 300ms (default), a number, or `false`. If loading ends first, nothing shows or is said. */
  delay?: LoadingDelay;
  /** Once shown, stay at least this long (ms), so it doesn't flicker off. Default 500. */
  minDuration?: number;
  /** 0–100 shows a determinate progress bar instead of the Spinner; `null` an indeterminate bar. */
  value?: number | null;
  /** An action that stays usable while loading, such as a Cancel Button. It should abort the work, not just hide the overlay. */
  action?: React.ReactNode;
  /** Blur the content behind the backdrop (where supported). Off under reduced transparency. */
  blur?: boolean;
  /** Block the whole page through a modal dialog, instead of the region. */
  fullscreen?: boolean;
  /** Replace the root element. */
  render?: useRender.RenderProp;
}

const EXIT_MS = 250; // a little over --sp-duration-exit (200ms), before unmounting

/* ---- Classes ---- */

const backdropClasses = cn(
  "bg-backdrop-loading",
  "animate-[sp-loading-overlay-in_var(--sp-duration-fast)_var(--sp-easing-default)]",
  "transition-opacity duration-[var(--sp-duration-exit)] ease-[var(--sp-easing-default)] data-[closing]:opacity-0",
  // While it fades out the content is usable again: don't swallow its clicks
  "data-[closing]:pointer-events-none",
);
const blurClasses =
  "supports-[backdrop-filter]:backdrop-blur-sm [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none";

const panelClasses = cn(
  "bg-surface-overlay text-fg-default border-border-default flex max-w-xs flex-col items-center gap-3 rounded-[var(--radius-lg)] border px-6 py-5 text-center shadow-md",
  "outline-none focus-visible:sp-focus-ring",
  // The backdrop is forced to Canvas: the panel keeps a visible edge
  "forced-colors:border-[CanvasText]",
);

/* ---- Focus helpers ---- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function canFocus(el: Element | null): el is HTMLElement {
  return (
    el instanceof HTMLElement &&
    el.isConnected &&
    !el.closest("[inert]") &&
    !(el as HTMLButtonElement).disabled
  );
}

/** Where focus goes when the overlay shows: the action's first control, else the panel. */
function overlayFocusTarget(panel: HTMLElement | null) {
  const action = panel?.querySelector<HTMLElement>(
    `[data-slot=loading-overlay-action] :is(${FOCUSABLE})`,
  );
  return action ?? panel;
}

/* ============================================================
 * Timing: delay before showing, minimum time once shown
 * ============================================================ */

function useShown(loading: boolean, delay: LoadingDelay | undefined, minDuration: number) {
  const [shown, setShown] = React.useState(false);
  const shownAt = React.useRef(0);
  const ms = delayMs(delay);

  React.useEffect(() => {
    if (loading && !shown) {
      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setShown(true);
      }, ms);
      return () => clearTimeout(timer);
    }
    if (!loading && shown) {
      const left = Math.max(0, minDuration - (Date.now() - shownAt.current));
      const timer = setTimeout(() => setShown(false), left);
      return () => clearTimeout(timer);
    }
  }, [loading, shown, ms, minDuration]);

  return shown;
}

/** Keeps the overlay mounted for the fade-out after it hides. */
function useMounted(shown: boolean) {
  const [mounted, setMounted] = React.useState(shown);
  if (shown && !mounted) setMounted(true);
  React.useEffect(() => {
    if (shown || !mounted) return;
    const timer = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [shown, mounted]);
  return mounted;
}

/* ============================================================
 * LoadingOverlay
 * ============================================================ */

export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      loading = false,
      label = "Loading",
      description,
      doneLabel = null,
      delay = "short",
      minDuration = 500,
      value,
      action,
      blur = false,
      fullscreen = false,
      render,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const shown = useShown(loading, delay, minDuration);
    const mounted = useMounted(shown);
    const labelId = React.useId();
    const descriptionId = React.useId();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const savedFocus = React.useRef<HTMLElement | null>(null);

    // Before `inert` lands (it would drop focus to <body>), remember focus in the
    // region and move it to the overlay. Restore it when the overlay closes.
    // Fullscreen: Base UI's Dialog does both.
    const wasShown = React.useRef(false);
    React.useLayoutEffect(() => {
      if (fullscreen) return;
      const content = contentRef.current;
      if (shown && !wasShown.current) {
        const active = document.activeElement;
        if (content && active instanceof HTMLElement && content.contains(active)) {
          savedFocus.current = active;
          overlayFocusTarget(panelRef.current)?.focus();
        }
      }
      if (!shown && wasShown.current && savedFocus.current) {
        const saved = savedFocus.current;
        savedFocus.current = null;
        const active = document.activeElement;
        // Only if focus is still ours to move: on the overlay, or lost to <body>
        const ours =
          !active ||
          active === document.body ||
          (panelRef.current?.contains(active) ?? false) ||
          !active.isConnected;
        if (ours && content) {
          const fallback = content.querySelector<HTMLElement>(FOCUSABLE);
          if (canFocus(saved) && content.contains(saved)) saved.focus();
          else if (canFocus(fallback)) fallback.focus();
          else {
            // Focusable only for this one move: drop it again once focus leaves
            content.tabIndex = -1;
            content.addEventListener("blur", () => content.removeAttribute("tabindex"), {
              once: true,
            });
            content.focus();
          }
        }
      }
      wasShown.current = shown;
    }, [shown, fullscreen]);

    // One announcement when shown, one when finished (only if shown). `force`, so a
    // second reload of the same region is heard too.
    const announcedStart = React.useRef(false);
    React.useEffect(() => {
      if (shown && !announcedStart.current) {
        announcedStart.current = true;
        announce(label, { force: true });
      } else if (!shown && announcedStart.current) {
        announcedStart.current = false;
        if (doneLabel) announce(doneLabel, { force: true });
      }
    }, [shown, label, doneLabel]);

    const indicator =
      value !== undefined ? (
        <Progress.Root value={value} aria-labelledby={labelId} className="w-48">
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      ) : (
        // A picture only: the announcement does the talking. (GEO-939's Spinner
        // rebuild adds srLabel={null} and xl; switch to those then.)
        <Spinner size="lg" role="presentation" aria-hidden="true" className="text-fg-default" />
      );

    const panelBody = (
      <>
        {indicator}
        <div className="flex flex-col gap-1">
          <span id={labelId} data-slot="loading-overlay-label" className="text-sm font-semibold">
            {label}
          </span>
          {description && (
            <span
              id={descriptionId}
              data-slot="loading-overlay-description"
              className="text-fg-muted text-sm"
            >
              {description}
            </span>
          )}
        </div>
        {action && <div data-slot="loading-overlay-action">{action}</div>}
      </>
    );

    /* ---- Region mode: a backdrop over the content ---- */
    const regionOverlay = !fullscreen && mounted && (
      <div
        data-slot="loading-overlay-backdrop"
        data-closing={shown ? undefined : ""}
        className={cn("absolute inset-0 z-[1]", backdropClasses, blur && blurClasses)}
      >
        {/* As tall as the viewport at most, and sticky, so the panel stays in view on tall regions */}
        <div className="sticky top-0 flex h-full max-h-[100svh] items-center justify-center p-4">
          <div
            ref={panelRef}
            data-slot="loading-overlay-panel"
            role="group"
            aria-labelledby={labelId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            className={panelClasses}
          >
            {panelBody}
          </div>
        </div>
      </div>
    );

    /* ---- Fullscreen: a modal Dialog (focus trap, page inert, scroll lock, restore) ---- */
    const fullscreenOverlay = fullscreen && (
      <BaseDialog.Root
        open={shown}
        modal
        // Escape and outside clicks don't close it: loading ends it
        onOpenChange={() => {}}
        disablePointerDismissal
      >
        <BaseDialog.Portal>
          <BaseDialog.Backdrop
            data-slot="loading-overlay-backdrop"
            className={cn(
              "fixed inset-0 z-50",
              "bg-backdrop-loading transition-opacity duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
              blur && blurClasses,
            )}
          />
          <BaseDialog.Popup
            ref={panelRef}
            data-slot="loading-overlay-panel"
            aria-labelledby={labelId}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              panelClasses,
              "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "transition-opacity duration-[var(--sp-duration-fast)] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            )}
          >
            {panelBody}
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    );

    return useRender({
      defaultTagName: "div",
      render,
      ref,
      props: {
        ...props,
        "data-slot": "loading-overlay",
        "data-loading": loading ? "" : undefined,
        "data-shown": shown ? "" : undefined,
        // isolate: a sticky header inside can't rise above the overlay, and the
        // overlay never rises above page-level sticky headers or popovers
        className: mergeClassName("relative isolate", className),
        children: (
          <>
            <div
              ref={contentRef}
              data-slot="loading-overlay-content"
              className="isolate"
              aria-busy={loading || shown || undefined}
              inert={shown && !fullscreen ? true : undefined}
            >
              {children}
            </div>
            {regionOverlay}
            {fullscreenOverlay}
          </>
        ),
      },
    });
  },
);
LoadingOverlay.displayName = "LoadingOverlay";
