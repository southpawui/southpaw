import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "../../lib/cn";

/* ============================================================
 * Types
 * ============================================================ */

export type KbdVariant = "outline" | "raised" | "subtle" | "plain";
export type KbdSize = "sm" | "md" | "lg";
export type KbdFormat = "condensed" | "full";
export type KbdPlatform = "apple" | "windows" | "other";

/* ============================================================
 * Platform detection (SSR-safe)
 * ============================================================ */

function detectPlatform(): KbdPlatform {
  if (typeof navigator === "undefined") return "other";
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const source = nav.userAgentData?.platform || nav.platform || nav.userAgent || "";
  if (/mac|iphone|ipad|ipod/i.test(source)) return "apple";
  if (/win/i.test(source)) return "windows";
  return "other";
}

const noopSubscribe = () => () => {};

/**
 * Returns the user's platform. Renders `"other"` on the server and during
 * hydration, then switches to the detected platform on the client.
 */
export function usePlatform(override?: KbdPlatform | "auto"): KbdPlatform {
  const detected = React.useSyncExternalStore(
    noopSubscribe,
    detectPlatform,
    () => "other" as KbdPlatform,
  );
  return override && override !== "auto" ? override : detected;
}

/* ============================================================
 * Key names
 * ============================================================ */

/** Normalises the many ways people spell a key into one canonical name. */
const ALIASES: Record<string, string> = {
  cmd: "meta",
  command: "meta",
  win: "meta",
  windows: "meta",
  super: "meta",
  control: "ctrl",
  option: "alt",
  opt: "alt",
  return: "enter",
  esc: "escape",
  del: "delete",
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  pgup: "pageup",
  pgdn: "pagedown",
  pagedn: "pagedown",
  caps: "capslock",
  plus: "+",
  " ": "space",
};

type NameFn = (platform: KbdPlatform) => string;
interface KeyNames {
  condensed: NameFn;
  full: NameFn;
  spoken: NameFn;
}

const isApple = (p: KbdPlatform) => p === "apple";

const KEYS: Record<string, KeyNames> = {
  mod: {
    condensed: (p) => (isApple(p) ? "⌘" : "Ctrl"),
    full: (p) => (isApple(p) ? "Command" : "Control"),
    spoken: (p) => (isApple(p) ? "command" : "control"),
  },
  meta: {
    condensed: (p) => (isApple(p) ? "⌘" : p === "windows" ? "Win" : "Meta"),
    full: (p) => (isApple(p) ? "Command" : p === "windows" ? "Windows" : "Meta"),
    spoken: (p) => (isApple(p) ? "command" : p === "windows" ? "windows" : "meta"),
  },
  ctrl: {
    condensed: (p) => (isApple(p) ? "⌃" : "Ctrl"),
    full: () => "Control",
    spoken: () => "control",
  },
  alt: {
    condensed: (p) => (isApple(p) ? "⌥" : "Alt"),
    full: (p) => (isApple(p) ? "Option" : "Alt"),
    spoken: (p) => (isApple(p) ? "option" : "alt"),
  },
  shift: {
    condensed: (p) => (isApple(p) ? "⇧" : "Shift"),
    full: () => "Shift",
    spoken: () => "shift",
  },
  enter: {
    condensed: (p) => (isApple(p) ? "⏎" : "Enter"),
    full: (p) => (isApple(p) ? "Return" : "Enter"),
    spoken: (p) => (isApple(p) ? "return" : "enter"),
  },
  escape: { condensed: () => "Esc", full: () => "Escape", spoken: () => "escape" },
  backspace: {
    condensed: (p) => (isApple(p) ? "⌫" : "Backspace"),
    full: (p) => (isApple(p) ? "Delete" : "Backspace"),
    spoken: (p) => (isApple(p) ? "delete" : "backspace"),
  },
  delete: {
    condensed: (p) => (isApple(p) ? "⌦" : "Del"),
    full: (p) => (isApple(p) ? "Forward Delete" : "Delete"),
    spoken: (p) => (isApple(p) ? "forward delete" : "delete"),
  },
  tab: {
    condensed: (p) => (isApple(p) ? "⇥" : "Tab"),
    full: () => "Tab",
    spoken: () => "tab",
  },
  capslock: {
    condensed: (p) => (isApple(p) ? "⇪" : "Caps"),
    full: () => "Caps Lock",
    spoken: () => "caps lock",
  },
  space: { condensed: () => "Space", full: () => "Space", spoken: () => "space" },
  up: { condensed: () => "↑", full: () => "Up Arrow", spoken: () => "up arrow" },
  down: { condensed: () => "↓", full: () => "Down Arrow", spoken: () => "down arrow" },
  left: { condensed: () => "←", full: () => "Left Arrow", spoken: () => "left arrow" },
  right: { condensed: () => "→", full: () => "Right Arrow", spoken: () => "right arrow" },
  pageup: { condensed: () => "PgUp", full: () => "Page Up", spoken: () => "page up" },
  pagedown: { condensed: () => "PgDn", full: () => "Page Down", spoken: () => "page down" },
  home: { condensed: () => "Home", full: () => "Home", spoken: () => "home" },
  end: { condensed: () => "End", full: () => "End", spoken: () => "end" },
  "+": { condensed: () => "+", full: () => "Plus", spoken: () => "plus" },
  "-": { condensed: () => "-", full: () => "Minus", spoken: () => "minus" },
  ".": { condensed: () => ".", full: () => "Period", spoken: () => "period" },
  ",": { condensed: () => ",", full: () => "Comma", spoken: () => "comma" },
  "/": { condensed: () => "/", full: () => "Slash", spoken: () => "slash" },
  "\\": { condensed: () => "\\", full: () => "Backslash", spoken: () => "backslash" },
  "?": { condensed: () => "?", full: () => "Question Mark", spoken: () => "question mark" },
  "[": { condensed: () => "[", full: () => "Left Bracket", spoken: () => "left bracket" },
  "]": { condensed: () => "]", full: () => "Right Bracket", spoken: () => "right bracket" },
  "`": { condensed: () => "`", full: () => "Backtick", spoken: () => "backtick" },
};

function capitalise(key: string) {
  return key.length === 1 ? key.toUpperCase() : key.charAt(0).toUpperCase() + key.slice(1);
}

export interface ResolvedKey {
  /** What is drawn on the key cap */
  label: string;
  /** What a screen reader announces */
  spoken: string;
}

/** Resolves a single key token (e.g. `"Mod"`, `"k"`, `"ArrowUp"`) for display. */
export function resolveKey(token: string, platform: KbdPlatform, format: KbdFormat): ResolvedKey {
  const lower = token.toLowerCase();
  const canonical = ALIASES[lower] ?? lower;
  const names = KEYS[canonical];
  if (names) {
    return { label: names[format](platform), spoken: names.spoken(platform) };
  }
  return { label: capitalise(token), spoken: token.toLowerCase() };
}

/**
 * Parses a shortcut string into a sequence of chords.
 * `+` joins keys pressed together; whitespace separates steps pressed in turn.
 * A literal plus is written as `Plus` or as a trailing `+` (e.g. `"Mod++"`).
 */
export function parseKeys(keys: string): string[][] {
  return keys
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((chord) => chord.split(/\+(?=.)/).filter(Boolean));
}

/* ============================================================
 * Styles
 * ============================================================ */

/*
 * Colours are mixed from currentColor so a key adapts to whatever surface it
 * sits on (dark tooltip, solid button, danger section) without extra props.
 */
const variantClasses: Record<KbdVariant, string> = {
  raised: "border border-current/20 border-b-2 border-b-current/30 bg-current/5",
  outline: "border border-current/30",
  subtle: "border border-transparent bg-current/10",
  plain: "border border-transparent",
};

/*
 * Height follows density by halving the control-height tokens:
 *   sm: 14 / 16 / 20px   md: 16 / 20 / 24px   lg: 20 / 24 / 28px  (compact / default / comfortable)
 */
const sizeClasses: Record<KbdSize, string> = {
  sm: "h-[calc(var(--sp-control-height-sm)/2)] min-w-[calc(var(--sp-control-height-sm)/2)] px-1 text-[0.6875rem]/none rounded-[3px]",
  md: "h-[calc(var(--sp-control-height)/2)] min-w-[calc(var(--sp-control-height)/2)] px-1.5 text-xs/none rounded-[4px]",
  lg: "h-[calc(var(--sp-control-height-lg)/2)] min-w-[calc(var(--sp-control-height-lg)/2)] px-2 text-sm/none rounded-[6px]",
};

const groupGapClasses: Record<KbdSize, string> = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1.5",
};

/* ============================================================
 * Context (Group → Kbd)
 * ============================================================ */

interface KbdContextValue {
  variant?: KbdVariant;
  size?: KbdSize;
}

const KbdContext = React.createContext<KbdContextValue>({});

/* ============================================================
 * Kbd.Group
 * ============================================================ */

export interface KbdGroupProps extends useRender.ComponentProps<"kbd"> {
  /** Visual style applied to every key in the group */
  variant?: KbdVariant;
  /** Size applied to every key in the group */
  size?: KbdSize;
  /**
   * Visual separator drawn between keys (e.g. `"+"`).
   * Hidden from screen readers, which announce the keys on their own.
   */
  separator?: React.ReactNode;
}

const Group = React.forwardRef<HTMLElement, KbdGroupProps>(
  ({ className, variant, size, separator, render, children, ...props }, ref) => {
    const parent = React.useContext(KbdContext);
    const resolvedSize = size ?? parent.size ?? "md";
    const resolvedVariant = variant ?? parent.variant;

    const items =
      separator == null
        ? children
        : React.Children.toArray(children).flatMap((child, i) =>
            i === 0
              ? [child]
              : [
                  <span
                    key={`sep-${i}`}
                    data-slot="kbd-separator"
                    aria-hidden="true"
                    className="text-[0.75em] opacity-70"
                  >
                    {separator}
                  </span>,
                  child,
                ],
          );

    const element = useRender({
      defaultTagName: "kbd",
      render,
      ref,
      props: mergeProps<"kbd">(
        {
          "data-slot": "kbd-group",
          dir: "ltr",
          className: cn(
            "inline-flex items-center whitespace-nowrap align-middle font-sans",
            groupGapClasses[resolvedSize],
            className,
          ),
          children: items,
        } as React.ComponentProps<"kbd">,
        props,
      ),
    });

    return (
      <KbdContext.Provider value={{ variant: resolvedVariant, size: resolvedSize }}>
        {element}
      </KbdContext.Provider>
    );
  },
);
Group.displayName = "Kbd.Group";

/* ============================================================
 * Kbd
 * ============================================================ */

export interface KbdProps extends useRender.ComponentProps<"kbd"> {
  /**
   * Content of a single key, used when `keys` is not set.
   * Children are rendered as-is: symbols like ⌘ or an icon are NOT given a
   * spoken name. Prefer `keys`, or add hidden text yourself
   * (e.g. `<CommandIcon aria-hidden /><span className="sr-only">command</span>`).
   */
  children?: React.ReactNode;
  /**
   * Shortcut string. Renders platform-aware keys and screen-reader names.
   * `+` joins keys pressed together, a space separates steps pressed in turn.
   * `Mod` shows ⌘ on Apple devices and Ctrl elsewhere.
   * @example "Mod+K", "Mod+Shift+P", "g i"
   */
  keys?: string;
  /**
   * How `keys` is drawn.
   * `condensed`: one cap per step with symbols (⌘⇧P), for menus and tooltips.
   * `full`: one cap per key, joined with +, spelled out (Control + Shift + P), for prose.
   */
  format?: KbdFormat;
  /** Platform used to label `keys`. `auto` detects it on the client. */
  platform?: KbdPlatform | "auto";
  /** Visual style. Default `outline`. */
  variant?: KbdVariant;
  /** Size. Height also follows `data-density`. */
  size?: KbdSize;
}

const capClasses = (variant: KbdVariant, size: KbdSize, className?: string, selectable = false) =>
  cn(
    // Base
    "pointer-events-none relative inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap align-middle",
    // Prose (`full` format) stays copyable; menus, buttons and tooltips do not
    !selectable && "select-none",
    "font-sans font-medium tabular-nums",
    // Icons inside a key scale with the text
    "[&_svg:not([class*='size-'])]:size-[1.1em] [&_svg]:shrink-0",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

/**
 * Content of one cap. All visible glyphs share one aria-hidden span
 * (⌘⇧P, or Ctrl+Shift+P off Apple), so the cap is read as text, not as
 * stand-alone symbols. Screen readers get one hidden phrase instead
 * ("command shift p").
 */
function renderChord(chord: string[], platform: KbdPlatform, format: KbdFormat) {
  const resolved = chord.map((token) => resolveKey(token, platform, format));
  // Off Apple, keys in one cap are joined with + (Ctrl+Shift+P), as Windows and Linux menus show them
  const joiner = platform !== "apple" && format === "condensed" ? "+" : "";
  return (
    <>
      <span data-slot="kbd-glyph" aria-hidden="true">
        {resolved.map((k) => k.label).join(joiner)}
      </span>
      <span data-slot="kbd-spoken" className="sr-only select-none">
        {resolved.map((k) => k.spoken).join(" ")}
      </span>
    </>
  );
}

const KbdRoot = React.forwardRef<HTMLElement, KbdProps>(
  (
    {
      className,
      keys,
      format = "condensed",
      platform = "auto",
      variant,
      size,
      render,
      children,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useContext(KbdContext);
    const resolvedVariant = variant ?? ctx.variant ?? "outline";
    const resolvedSize = size ?? ctx.size ?? "md";
    const resolvedPlatform = usePlatform(platform);
    const parsed = keys ? parseKeys(keys) : [];
    // Empty or whitespace-only `keys` falls back to children
    const chords = parsed.length > 0 ? parsed : null;

    const single = useRender({
      defaultTagName: "kbd",
      render,
      ref,
      enabled: !chords || (chords.length === 1 && format === "condensed"),
      props: mergeProps<"kbd">(
        {
          "data-slot": "kbd",
          "data-variant": resolvedVariant,
          "data-size": resolvedSize,
          ...(chords ? { dir: "ltr" } : {}),
          className: capClasses(resolvedVariant, resolvedSize, className, format === "full"),
          children: chords ? renderChord(chords[0]!, resolvedPlatform, format) : children,
        } as React.ComponentProps<"kbd">,
        props,
      ),
    });

    if (single) return single;

    /* Multiple caps: a sequence, or `full` format (one cap per key). */
    const caps: React.ReactNode[] = [];
    chords!.forEach((chord, step) => {
      if (step > 0) {
        caps.push(
          format === "full" ? (
            <span
              key={`then-${step}`}
              data-slot="kbd-separator"
              className="text-[0.75em] opacity-70"
            >
              then
            </span>
          ) : (
            <span key={`then-${step}`} data-slot="kbd-separator" className="sr-only select-none">
              then
            </span>
          ),
        );
      }
      if (format === "full") {
        chord.forEach((token, i) => {
          if (i > 0) {
            caps.push(
              <span
                key={`plus-${step}-${i}`}
                data-slot="kbd-separator"
                aria-hidden="true"
                className="text-[0.75em] opacity-70"
              >
                +
              </span>,
            );
          }
          caps.push(
            <kbd
              key={`key-${step}-${i}`}
              data-slot="kbd"
              data-variant={resolvedVariant}
              data-size={resolvedSize}
              className={capClasses(resolvedVariant, resolvedSize, undefined, true)}
            >
              {renderChord([token], resolvedPlatform, format)}
            </kbd>,
          );
        });
      } else {
        caps.push(
          <kbd
            key={`chord-${step}`}
            data-slot="kbd"
            data-variant={resolvedVariant}
            data-size={resolvedSize}
            className={capClasses(resolvedVariant, resolvedSize)}
          >
            {renderChord(chord, resolvedPlatform, format)}
          </kbd>,
        );
      }
    });

    return (
      <Group
        ref={ref}
        render={render}
        variant={resolvedVariant}
        size={resolvedSize}
        className={className}
        {...props}
      >
        {caps}
      </Group>
    );
  },
);
KbdRoot.displayName = "Kbd";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Kbd = Object.assign(KbdRoot, { Group });
