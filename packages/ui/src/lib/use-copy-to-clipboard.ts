import * as React from "react";
import { announce as announceMessage } from "./announce";

/* ============================================================
 * useCopyToClipboard (GEO-966)
 *
 * Copies text and reports what happened (the Primer / GitHub / Mantine
 * pattern): the status is "copied" or "failed" for `timeout` ms (2s), then
 * back to "idle", so a button can swap to a check and "Copied" and back.
 * The result is also announced politely through the shared announcer
 * (`lib/announce`), not a live region of its own. No toast: too heavy for
 * an inline copy.
 *
 * Uses the async Clipboard API, falling back to `execCommand("copy")` where
 * it's missing (insecure origins, old WebViews).
 *
 * Shared on purpose: DescriptionList's copy button uses it today, and the
 * public CopyButton (GEO-978) will too.
 * ============================================================ */

export type CopyStatus = "idle" | "copied" | "failed";

export interface UseCopyToClipboardOptions {
  /** How long "copied" / "failed" lasts before going back to "idle", in ms. Default 2000. */
  timeout?: number;
  /** Called after each attempt. */
  onCopy?: (text: string, ok: boolean) => void;
  /**
   * What screen readers hear after a copy, or `false` to stay quiet (when the
   * caller announces it some other way). Default "Copied" / "Copy failed".
   */
  announce?: { copied: string; failed: string } | false;
}

export const defaultCopyMessages = { copied: "Copied", failed: "Copy failed" };

function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(el);
  return ok;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or not focused: try the fallback.
  }
  return legacyCopy(text);
}

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
  announce = defaultCopyMessages,
}: UseCopyToClipboardOptions = {}) {
  const [status, setStatus] = React.useState<CopyStatus>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onCopyRef = React.useRef(onCopy);
  onCopyRef.current = onCopy;
  const announceRef = React.useRef(announce);
  announceRef.current = announce;

  const mounted = React.useRef(true);
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const copy = React.useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      onCopyRef.current?.(text, ok);
      // Unmounted while the clipboard was busy: no state, timer or announcement.
      if (!mounted.current) return ok;
      clearTimeout(timer.current);
      setStatus(ok ? "copied" : "failed");
      const messages = announceRef.current;
      // Forced: a second copy within the announcer's 7s window must be heard too.
      if (messages) announceMessage(ok ? messages.copied : messages.failed, { force: true });
      timer.current = setTimeout(() => setStatus("idle"), timeout);
      return ok;
    },
    [timeout],
  );

  return { copy, status };
}
