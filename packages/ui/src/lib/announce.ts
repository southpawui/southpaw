/* ============================================================
 * Shared screen-reader announcer (GEO-963)
 *
 * One polite live region for the whole page, created the first time
 * something is announced and reused after that. Components call
 * `announce("Loading orders")` instead of each mounting its own
 * `aria-live` region: a region that appears at the same moment as its
 * message is often missed, and several regions talk over each other.
 *
 * Skeleton.Group uses it first. Spinner, Button (loading) and Toast adopt
 * it at their GEO-939 rebuilds.
 *
 * SSR-safe: nothing touches `document` until `announce` runs in a browser.
 * ============================================================ */

/** How long a message stays in the region before it's cleared, so a screen
 *  reader's virtual cursor doesn't find stale text later. */
export const ANNOUNCE_CLEAR_MS = 7000;
/** The gap between creating/emptying the region and writing the message, so
 *  screen readers see a change in a region they already know about. */
export const ANNOUNCE_WRITE_DELAY_MS = 100;

let region: HTMLElement | null = null;
let lastMessage = "";
let writeTimer: ReturnType<typeof setTimeout> | undefined;
let clearTimer: ReturnType<typeof setTimeout> | undefined;

function getRegion(): HTMLElement {
  if (region && region.isConnected) return region;
  const el = document.createElement("div");
  el.setAttribute("data-slot", "announcer");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-atomic", "true");
  // Visually hidden. Inline so it works without the app's Tailwind build.
  Object.assign(el.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0",
  });
  document.body.appendChild(el);
  region = el;
  return el;
}

/**
 * Announce a message politely. An identical message to the one still in the
 * region is skipped, so ten skeletons starting at once say "Loading" once.
 * No-op on the server.
 */
export function announce(message: string) {
  if (typeof document === "undefined") return;
  // The app removed the region: a new one has heard nothing yet, so don't skip
  if (region && !region.isConnected) lastMessage = "";
  const text = message.trim();
  if (!text || text === lastMessage) return;
  lastMessage = text;
  const el = getRegion();
  clearTimeout(writeTimer);
  clearTimeout(clearTimer);
  el.textContent = "";
  writeTimer = setTimeout(() => {
    el.textContent = text;
    clearTimer = setTimeout(() => {
      el.textContent = "";
      lastMessage = "";
    }, ANNOUNCE_CLEAR_MS);
  }, ANNOUNCE_WRITE_DELAY_MS);
}

/** Remove the region and cancel pending messages (tests, micro-frontend teardown). */
export function destroyAnnouncer() {
  clearTimeout(writeTimer);
  clearTimeout(clearTimer);
  region?.remove();
  region = null;
  lastMessage = "";
}
