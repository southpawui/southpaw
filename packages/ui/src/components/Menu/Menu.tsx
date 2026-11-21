import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import {
  ArrowSquareOut,
  CaretRight,
  Check,
  Circle,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import {
  Kbd,
  parseKeys,
  resolveKey,
  usePlatform,
  type KbdPlatform,
  type KbdSize,
} from "../Kbd/Kbd";
import { Spinner } from "../Spinner/Spinner";

/* ============================================================
 * Shared types and context
 *
 * Popup passes size, highlight style and dividers to every item
 * inside it. ContextMenu and Menubar reuse these items, so the
 * styling lives here once.
 * ============================================================ */

export type MenuSize = "sm" | "md" | "lg";
export type MenuHighlight = "subtle" | "solid";

interface MenuStyleContextValue {
  size: MenuSize;
  highlight: MenuHighlight;
  dividers: boolean;
}

const MenuStyleContext = React.createContext<MenuStyleContextValue>({
  size: "md",
  highlight: "subtle",
  dividers: false,
});

export const useMenuStyle = () => React.useContext(MenuStyleContext);

/* ============================================================
 * aria-keyshortcuts
 * ============================================================ */

const ARIA_KEYS: Record<string, string> = {
  cmd: "Meta",
  command: "Meta",
  meta: "Meta",
  win: "Meta",
  windows: "Meta",
  super: "Meta",
  ctrl: "Control",
  control: "Control",
  alt: "Alt",
  option: "Alt",
  opt: "Alt",
  shift: "Shift",
  enter: "Enter",
  return: "Enter",
  esc: "Escape",
  escape: "Escape",
  del: "Delete",
  delete: "Delete",
  backspace: "Backspace",
  tab: "Tab",
  space: "Space",
  up: "ArrowUp",
  arrowup: "ArrowUp",
  down: "ArrowDown",
  arrowdown: "ArrowDown",
  left: "ArrowLeft",
  arrowleft: "ArrowLeft",
  right: "ArrowRight",
  arrowright: "ArrowRight",
  pageup: "PageUp",
  pgup: "PageUp",
  pagedown: "PageDown",
  pgdn: "PageDown",
  home: "Home",
  end: "End",
  "+": "Plus",
  plus: "Plus",
};

/**
 * Converts a Kbd `keys` string to an `aria-keyshortcuts` value.
 * Returns `undefined` for sequences ("g i"): the attribute treats spaces as
 * alternatives, not steps, so a sequence cannot be expressed.
 */
export function toAriaKeyshortcuts(keys: string, platform: KbdPlatform): string | undefined {
  const chords = parseKeys(keys);
  if (chords.length !== 1) return undefined;
  return chords[0]!
    .map((token) => {
      const lower = token.toLowerCase();
      if (lower === "mod") return platform === "apple" ? "Meta" : "Control";
      return ARIA_KEYS[lower] ?? (token.length === 1 ? token.toUpperCase() : token);
    })
    .join("+");
}

/* ============================================================
 * Item styling (shared by every item type)
 * ============================================================ */

const sizeClasses: Record<MenuSize, string> = {
  sm: "min-h-[max(1.5rem,calc(var(--sp-control-height-sm)-0.25rem))] gap-2 py-0.5 text-sm [&_svg:not([class*='size-'])]:size-4",
  md: "min-h-[var(--sp-control-height-sm)] gap-2 py-1 text-sm [&_svg:not([class*='size-'])]:size-4",
  lg: "min-h-[var(--sp-control-height)] gap-3 py-1.5 text-base [&_svg:not([class*='size-'])]:size-5",
};

const kbdSize: Record<MenuSize, KbdSize> = { sm: "sm", md: "sm", lg: "md" };

/** Padding-start for `inset` items: item padding + icon + gap. */
const insetClasses: Record<MenuSize, string> = {
  sm: "ps-8",
  md: "ps-8",
  lg: "ps-10",
};

interface ItemClassOptions extends MenuStyleContextValue {
  danger?: boolean;
  inset?: boolean;
  active?: boolean;
}

/**
 * Classes for a menu row. Exported so ContextMenu and Menubar items match
 * Menu exactly.
 */
export function menuItemClasses({
  size,
  highlight,
  dividers,
  danger,
  inset,
  active,
}: ItemClassOptions) {
  const solid = highlight === "solid";
  return cn(
    "group/menu-item relative flex w-full cursor-default select-none items-center rounded-[var(--sp-nested-radius,6px)] px-2 text-start outline-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    sizeClasses[size],
    inset && insetClasses[size],
    danger ? "text-danger" : "text-fg-default",
    // Highlight (pointer hover, keyboard focus, open submenu)
    !danger &&
      !solid &&
      "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:bg-[var(--sp-state-pressed)] data-[popup-open]:bg-[var(--sp-state-pressed)]",
    !danger &&
      solid &&
      "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:bg-accent [&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:text-fg-on-brand data-[popup-open]:bg-accent data-[popup-open]:text-fg-on-brand",
    danger &&
      !solid &&
      "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:bg-danger/10",
    // Subtle highlight: the tint alone measures 1.2–1.45:1, under the 3:1 a
    // focus indicator needs (WCAG 1.4.11), so a 2px bar marks the start of
    // the highlighted row (matches Combobox/Autocomplete, Lane 5).
    !solid &&
      "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:absolute [&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:inset-y-1 [&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:start-0 [&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:w-0.5 [&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:rounded-full [&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:content-['']",
    !solid &&
      (danger
        ? "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:bg-danger"
        : "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:after:bg-accent"),
    // Forced colours drop backgrounds (both highlight styles): outline instead.
    "forced-colors:[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:outline-solid forced-colors:[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:outline-2 forced-colors:[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:-outline-offset-2 forced-colors:[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:outline-[color:Highlight]",
    danger &&
      solid &&
      "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:bg-danger [&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:text-fg-on-danger",
    // Current item (Primer `active`): bold text plus the selected tint. No
    // bar: the bar marks only the highlight (George, 2026-11-16).
    active && "font-medium",
    active && !solid && "bg-[var(--sp-state-selected)]",
    // Inactive (Primer): still focusable, label muted, reason shown below
    "data-[inactive]:[&_[data-slot=menu-item-label]]:text-fg-muted",
    // Disabled: Base UI keeps it out of activation; we fade the whole row.
    // Base UI keeps disabled items keyboard-focusable on purpose (useMenuItem:
    // focusableWhenDisabled: true; MenuRoot: disabledIndices: []; APG: screen
    // reader users learn they exist). So the highlight styles above apply when
    // the item is enabled OR the keyboard put it there (Popup's
    // data-input-modality): pointer hover on a disabled item shows nothing,
    // keyboard focus keeps the tint and bar at the faded opacity (WCAG 2.4.7).
    // Same split as Combobox/Autocomplete (Lane 5).
    "data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
    // Dividers between items (Primer `showDividers`). The line sits at the top
    // of every item that follows another item, and is hidden on both sides of
    // the highlighted, open or current item so the fill never touches a line.
    dividers && [
      "before:pointer-events-none before:absolute before:inset-x-2 before:top-0 before:hidden before:h-px before:bg-border-default before:content-['']",
      "[[role^=menuitem]+&]:before:block",
      "[&[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)]:before:opacity-0 data-[popup-open]:before:opacity-0",
      "[[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)+&]:before:opacity-0 [[data-popup-open]+&]:before:opacity-0",
      active && "before:opacity-0",
      "[[data-active]+&]:before:opacity-0",
    ],
  );
}

/* ============================================================
 * Item content (icon, label, description, trailing, shortcut)
 * ============================================================ */

export interface MenuItemContentProps {
  /** Leading icon. Decorative: hidden from screen readers. */
  icon?: React.ReactNode;
  /** Secondary text, announced as the item's description. */
  description?: React.ReactNode;
  /** `block` puts the description under the label; `inline` beside it. Default `block`. */
  descriptionLayout?: "block" | "inline";
  /** Content at the end of the row (badge, count). It is part of the accessible name ("All mail 24"); wrap it in `aria-hidden` if it is purely decorative. */
  trailing?: React.ReactNode;
  /**
   * Keyboard shortcut in Kbd `keys` format (`"Mod+C"`, `"Shift+Delete"`).
   * Shown as a key cap and announced as part of the description.
   */
  shortcut?: string;
  /**
   * Set when your app actually handles `shortcut`. Adds `aria-keyshortcuts`.
   * Leave off for hints the app does not wire up.
   */
  shortcutActive?: boolean;
  /** Indent the label to line up with items that have an icon or indicator. */
  inset?: boolean;
  /** Danger styling for destructive actions. */
  variant?: "default" | "danger";
  /**
   * Extra screen-reader text for danger items, e.g. "Deletes the file permanently".
   * Colour alone does not tell a screen reader user the action is destructive.
   */
  dangerDescription?: string;
  /**
   * Makes the item inactive: it stays focusable, does nothing when chosen,
   * and shows this text so the user knows why (Primer `inactiveText`).
   */
  inactiveText?: React.ReactNode;
  /** Shows a spinner and ignores clicks while an action is pending. */
  loading?: boolean;
  /** Marks the current item (the page or view the user is on). */
  active?: boolean;
}

const contentPropNames = [
  "icon",
  "description",
  "descriptionLayout",
  "trailing",
  "shortcut",
  "shortcutActive",
  "inset",
  "variant",
  "dangerDescription",
  "inactiveText",
  "loading",
  "active",
] as const;

function splitContentProps<T extends MenuItemContentProps>(props: T) {
  const content: MenuItemContentProps = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if ((contentPropNames as readonly string[]).includes(key)) {
      (content as Record<string, unknown>)[key] = value;
    } else {
      rest[key] = value;
    }
  }
  return { content, rest: rest as Omit<T, keyof MenuItemContentProps> };
}

/** Spoken form of a shortcut: "command shift p", "g then i". */
function spokenShortcut(keys: string, platform: KbdPlatform) {
  return parseKeys(keys)
    .map((chord) => chord.map((key) => resolveKey(key, platform, "condensed").spoken).join(" "))
    .join(" then ");
}

/**
 * Builds the inside of a menu row and the ARIA attributes that go with it.
 *
 * The accessible name is the label (plus any trailing content). Description,
 * inactive text and the shortcut are `aria-hidden` so they stay out of the
 * name, and are linked with `aria-describedby`, which still reads hidden
 * elements it points at directly. The name comes from content rather than
 * `aria-labelledby`, so axe's label-in-name rule (WCAG 2.5.3) is satisfied:
 * speech users say the visible label ("click Copy") and it matches.
 */
function useItemContent(
  content: MenuItemContentProps,
  children: React.ReactNode,
  options: {
    leading?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    srSuffix?: string;
    current?: "true" | "page";
  } = {},
) {
  const style = useMenuStyle();
  const platform = usePlatform();
  const id = React.useId();
  const descId = `${id}-description`;
  const inactiveId = `${id}-inactive`;
  const shortcutId = `${id}-shortcut`;
  const srId = `${id}-sr`;

  const {
    icon,
    description,
    descriptionLayout = "block",
    trailing,
    shortcut,
    shortcutActive,
    variant,
    dangerDescription,
    inactiveText,
    loading,
  } = content;

  const danger = variant === "danger";
  const solid = style.highlight === "solid";
  const srText = [
    danger ? dangerDescription : undefined,
    loading ? "Loading" : undefined,
    options.srSuffix,
  ]
    .filter(Boolean)
    .join(". ");

  const describedBy =
    [
      description != null && descId,
      inactiveText != null && inactiveId,
      shortcut && shortcutId,
      srText && srId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  // Muted text follows the item's colour when it has a solid fill
  const muted = cn(
    danger ? "text-current/80" : "text-fg-muted",
    solid &&
      "[[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)_&]:text-current/85 group-data-[popup-open]/menu-item:text-current/85",
  );

  const inline = descriptionLayout === "inline";
  const hasEnd = trailing != null || !!shortcut || !!loading || options.trailingIcon != null;

  const body = (
    <>
      {options.leading}
      {icon != null && (
        <span data-slot="menu-item-icon" aria-hidden="true" className="flex items-center">
          {icon}
        </span>
      )}
      <span
        data-slot="menu-item-content"
        className={cn(
          "flex min-w-0 flex-1",
          inline ? "flex-row flex-wrap items-baseline gap-x-2" : "flex-col",
        )}
      >
        <span data-slot="menu-item-label">{children}</span>
        {description != null && (
          <span
            id={descId}
            aria-hidden="true"
            data-slot="menu-item-description"
            className={cn("text-[0.8125rem]/snug", muted)}
          >
            {description}
          </span>
        )}
        {inactiveText != null && (
          <span
            id={inactiveId}
            aria-hidden="true"
            data-slot="menu-item-inactive-text"
            className={cn("text-[0.8125rem]/snug", muted)}
          >
            {inactiveText}
          </span>
        )}
      </span>
      {hasEnd && (
        // One end group, so several end pieces sit together instead of
        // splitting the free space between them.
        <span data-slot="menu-item-end" className="ms-auto flex items-center gap-2">
          {trailing != null && (
            <span data-slot="menu-item-trailing" className={cn("flex items-center", muted)}>
              {trailing}
            </span>
          )}
          {shortcut && (
            <>
              <Kbd
                aria-hidden="true"
                keys={shortcut}
                size={kbdSize[style.size]}
                data-slot="menu-item-shortcut"
                className={muted}
              />
              <span id={shortcutId} data-slot="menu-item-shortcut-text" hidden>
                {spokenShortcut(shortcut, platform)}
              </span>
            </>
          )}
          {loading && (
            <Spinner
              aria-hidden="true"
              role={undefined}
              data-slot="menu-item-spinner"
              className={muted}
            />
          )}
          {options.trailingIcon}
        </span>
      )}
      {srText && (
        <span id={srId} data-slot="menu-item-sr-text" hidden>
          {srText}
        </span>
      )}
    </>
  );

  const ariaProps = {
    "aria-describedby": describedBy,
    "aria-keyshortcuts":
      shortcut && shortcutActive ? toAriaKeyshortcuts(shortcut, platform) : undefined,
    "aria-busy": loading || undefined,
    "aria-current": content.active ? (options.current ?? "true") : undefined,
  };

  const className = menuItemClasses({
    ...style,
    danger,
    inset: content.inset && icon == null && !options.leading,
    active: content.active,
  });

  const dataProps = {
    "data-variant": danger ? "danger" : undefined,
    "data-active": content.active ? "" : undefined,
    "data-inactive": inactiveText != null ? "" : undefined,
    "data-loading": loading ? "" : undefined,
  };

  return { body, ariaProps, dataProps, className };
}

/** Text used for typeahead when the label is a plain string. */
const textLabel = (children: React.ReactNode, label?: string) =>
  label ?? (typeof children === "string" ? children : undefined);

/* ============================================================
 * Root, Portal, SubmenuRoot, FilterProvider (pass-through)
 * ============================================================ */

/*
 * Keyboard opens skip the open animation (Emil Kowalski: never animate
 * keyboard-initiated actions). Base UI reports why a menu opened through the
 * public `onOpenChange(open, eventDetails)`: arrow keys give
 * `list-navigation`; Enter and Space give `trigger-press` with a click whose
 * `detail` is 0 (no pointer). Roots record it and Popup reads it.
 */

/** True while the nearest menu was opened from the keyboard. */
export const KeyboardOpenContext = React.createContext(false);

interface OpenChangeDetails {
  reason?: string;
  event?: Event;
}

/** Whether Base UI's open-change details describe a keyboard open. */
export function isKeyboardOpenChange({ reason, event }: OpenChangeDetails) {
  if (reason === "list-navigation") return true;
  return reason === "trigger-press" && event instanceof MouseEvent && event.detail === 0;
}

/**
 * Wraps a root's `onOpenChange` to record whether each open came from the
 * keyboard. Shared with ContextMenu and Menubar, which pass their own test.
 */
export function useKeyboardOpenTracking(
  onOpenChange: unknown,
  isKeyboard: (details: OpenChangeDetails) => boolean = isKeyboardOpenChange,
) {
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);
  const handleOpenChange = (open: boolean, details: OpenChangeDetails) => {
    if (open) setKeyboardOpen(isKeyboard(details));
    (onOpenChange as ((open: boolean, details: OpenChangeDetails) => void) | undefined)?.(
      open,
      details,
    );
  };
  return [keyboardOpen, handleOpenChange] as const;
}

function Root<Payload>(props: BaseMenu.Root.Props<Payload>) {
  const [keyboardOpen, onOpenChange] = useKeyboardOpenTracking(props.onOpenChange);
  return (
    <KeyboardOpenContext.Provider value={keyboardOpen}>
      <BaseMenu.Root {...props} onOpenChange={onOpenChange} />
    </KeyboardOpenContext.Provider>
  );
}

function SubmenuRoot(props: React.ComponentProps<typeof BaseMenu.SubmenuRoot>) {
  const [keyboardOpen, onOpenChange] = useKeyboardOpenTracking(props.onOpenChange);
  return (
    <KeyboardOpenContext.Provider value={keyboardOpen}>
      <BaseMenu.SubmenuRoot {...props} onOpenChange={onOpenChange} />
    </KeyboardOpenContext.Provider>
  );
}

const Portal = BaseMenu.Portal;
const FilterProvider = BaseMenu.FilterProvider;
const Viewport = BaseMenu.Viewport;

/* ============================================================
 * Trigger (render a Button). Only its open state is styled.
 * ============================================================ */

/**
 * Open state of a menu trigger, shared by every Menu trigger. Keyed to
 * `data-popup-open`, which Base UI sets together with `aria-expanded="true"`,
 * so the trigger only looks pressed when the accessibility tree says it is
 * expanded.
 * - A pressed overlay as a background-image layer, so it darkens any Button
 *   variant (ghost, outline, solid) without replacing its colour.
 * - An inset ring in the trigger's own text colour: a non-colour cue that
 *   contrasts with its fill as much as the label does (WCAG 1.4.11).
 * - Forced colours drop backgrounds and box-shadows: a Highlight outline.
 */
export const menuTriggerOpenClasses = cn(
  "data-[popup-open]:bg-[linear-gradient(var(--sp-state-pressed),var(--sp-state-pressed))]",
  "data-[popup-open]:shadow-[inset_0_0_0_1.5px_currentColor]",
  "forced-colors:data-[popup-open]:outline-2 forced-colors:data-[popup-open]:-outline-offset-2 forced-colors:data-[popup-open]:outline-solid forced-colors:data-[popup-open]:outline-[Highlight]",
);

const Trigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseMenu.Trigger>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Trigger
      ref={ref}
      data-slot="menu-trigger"
      className={mergeClassName(cn(menuTriggerOpenClasses), className)}
      {...props}
    />
  ),
);
Trigger.displayName = "Menu.Trigger";

/* ============================================================
 * Backdrop
 * ============================================================ */

const Backdrop = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Backdrop>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Backdrop
      ref={ref}
      data-slot="menu-backdrop"
      className={mergeClassName(cn("fixed inset-0"), className)}
      {...props}
    />
  ),
);
Backdrop.displayName = "Menu.Backdrop";

/* ============================================================
 * Positioner
 * ============================================================ */

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMenu.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <BaseMenu.Positioner
    ref={ref}
    data-slot="menu-positioner"
    sideOffset={sideOffset}
    className={mergeClassName(cn("z-50 outline-none"), className)}
    {...props}
  />
));
Positioner.displayName = "Menu.Positioner";

/* ============================================================
 * Popup
 * ============================================================ */

export interface MenuPopupProps extends React.ComponentProps<typeof BaseMenu.Popup> {
  /** Row size. Heights follow `data-density`. Submenus inherit it. Default `md`. */
  size?: MenuSize;
  /** Highlight style. `subtle` (default) tints the row; `solid` fills it with the accent colour. */
  highlight?: MenuHighlight;
  /** Draw a line between items. Best for items with descriptions. */
  dividers?: boolean;
  /** Make the popup at least as wide as its trigger. */
  matchTriggerWidth?: boolean;
  /** Maximum height before the popup scrolls (any CSS length). Default `24rem`. */
  maxHeight?: string;
}

const Popup = React.forwardRef<HTMLDivElement, MenuPopupProps>(
  (
    {
      className,
      size,
      highlight,
      dividers,
      matchTriggerWidth,
      maxHeight,
      style,
      onKeyDownCapture,
      onPointerMoveCapture,
      ...props
    },
    ref,
  ) => {
    const parent = useMenuStyle();
    const keyboardOpen = React.useContext(KeyboardOpenContext);
    const value = React.useMemo<MenuStyleContextValue>(
      () => ({
        size: size ?? parent.size,
        highlight: highlight ?? parent.highlight,
        dividers: dividers ?? false,
      }),
      [size, highlight, dividers, parent.size, parent.highlight],
    );
    return (
      <MenuStyleContext.Provider value={value}>
        <BaseMenu.Popup
          ref={ref}
          data-slot="menu-popup"
          data-size={value.size}
          data-highlight={value.highlight}
          data-keyboard-open={keyboardOpen ? "" : undefined}
          data-input-modality={keyboardOpen ? "keyboard" : "pointer"}
          onKeyDownCapture={(event) => {
            event.currentTarget.dataset.inputModality = "keyboard";
            onKeyDownCapture?.(event);
          }}
          onPointerMoveCapture={(event) => {
            if (event.pointerType !== "touch")
              event.currentTarget.dataset.inputModality = "pointer";
            onPointerMoveCapture?.(event);
          }}
          style={
            {
              ...(maxHeight ? { "--sp-menu-max-height": maxHeight } : null),
              ...style,
            } as React.CSSProperties
          }
          className={mergeClassName(
            cn(
              "bg-surface-overlay text-fg-default border-border-default flex flex-col rounded-[var(--radius-DEFAULT)] border p-1 shadow-lg outline-none [--sp-nested-radius:6px]",
              // Width: Carbon's 160–288px guidance
              "w-max min-w-40 max-w-72",
              matchTriggerWidth && "min-w-[max(10rem,var(--anchor-width))]",
              // Height: scrolls within the space available
              "max-h-[min(var(--available-height),var(--sp-menu-max-height,24rem))] overflow-y-auto overscroll-contain",
              // Animation
              "origin-[var(--transform-origin)]",
              "transition-[transform,scale,opacity] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
              "motion-reduce:transition-none",
              // Opened from the keyboard: appear at once. Only while open, so the
              // close animation is unchanged.
              "data-[keyboard-open]:data-[open]:transition-none",
            ),
            className,
          )}
          {...props}
        />
      </MenuStyleContext.Provider>
    );
  },
);
Popup.displayName = "Menu.Popup";

/* ============================================================
 * Arrow
 * ============================================================ */

/**
 * Place it inside `Menu.Positioner`, after `Menu.Popup`. The popup scrolls
 * (`overflow-y: auto`), so an arrow inside it would be clipped.
 */
const Arrow = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Arrow>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Arrow
      ref={ref}
      data-slot="menu-arrow"
      className={mergeClassName(
        cn(
          "data-[side=bottom]:top-[-5px] data-[side=left]:right-[-5px] data-[side=right]:left-[-5px] data-[side=top]:bottom-[-5px]",
        ),
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-surface-overlay border-border-default block h-2.5 w-2.5 rotate-45 border",
          "[[data-side=bottom]>&]:border-b-0 [[data-side=bottom]>&]:border-r-0",
          "[[data-side=top]>&]:border-l-0 [[data-side=top]>&]:border-t-0",
          "[[data-side=left]>&]:border-b-0 [[data-side=left]>&]:border-l-0",
          "[[data-side=right]>&]:border-r-0 [[data-side=right]>&]:border-t-0",
        )}
      />
    </BaseMenu.Arrow>
  ),
);
Arrow.displayName = "Menu.Arrow";

/* ============================================================
 * Item
 * ============================================================ */

export interface MenuItemProps
  extends React.ComponentProps<typeof BaseMenu.Item>, MenuItemContentProps {}

const Item = React.forwardRef<HTMLElement, MenuItemProps>((props, ref) => {
  const { content, rest } = splitContentProps(props);
  const { className, children, label, onClick, closeOnClick, ...itemProps } = rest;
  const blocked = content.inactiveText != null || !!content.loading;
  const { body, ariaProps, dataProps, className: rowClasses } = useItemContent(content, children);

  return (
    <BaseMenu.Item
      ref={ref}
      data-slot="menu-item"
      label={textLabel(children, label)}
      closeOnClick={blocked ? false : closeOnClick}
      onClick={blocked ? undefined : onClick}
      {...ariaProps}
      {...dataProps}
      className={cn(rowClasses, className as string)}
      {...itemProps}
    >
      {body}
    </BaseMenu.Item>
  );
});
Item.displayName = "Menu.Item";

/* ============================================================
 * LinkItem
 * ============================================================ */

export interface MenuLinkItemProps
  extends
    React.ComponentProps<typeof BaseMenu.LinkItem>,
    Omit<MenuItemContentProps, "loading" | "inactiveText"> {}

const LinkItem = React.forwardRef<Element, MenuLinkItemProps>((props, ref) => {
  const { content, rest } = splitContentProps(props);
  const { className, children, label, target, ...itemProps } = rest;
  const newTab = target === "_blank";
  const {
    body,
    ariaProps,
    dataProps,
    className: rowClasses,
  } = useItemContent(content, children, {
    trailingIcon: newTab ? (
      <ArrowSquareOut
        aria-hidden="true"
        data-slot="menu-item-external-icon"
        className="text-fg-muted [[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)_&]:text-current"
      />
    ) : undefined,
    srSuffix: newTab ? "Opens in a new tab" : undefined,
    // Links mark the current page, not just the current item
    current: "page",
  });

  return (
    <BaseMenu.LinkItem
      ref={ref}
      data-slot="menu-link-item"
      label={textLabel(children, label)}
      target={target}
      rel={newTab ? "noopener noreferrer" : undefined}
      {...ariaProps}
      {...dataProps}
      className={cn(rowClasses, className as string)}
      {...itemProps}
    >
      {body}
    </BaseMenu.LinkItem>
  );
});
LinkItem.displayName = "Menu.LinkItem";

/* ============================================================
 * SubmenuTrigger
 * ============================================================ */

export interface MenuSubmenuTriggerProps
  extends
    React.ComponentProps<typeof BaseMenu.SubmenuTrigger>,
    Omit<MenuItemContentProps, "shortcut" | "shortcutActive" | "loading" | "inactiveText"> {
  /** Replace the default chevron. It is flipped automatically in right-to-left layouts. */
  chevron?: React.ReactNode;
}

const SubmenuTrigger = React.forwardRef<HTMLElement, MenuSubmenuTriggerProps>((props, ref) => {
  const { chevron, ...others } = props;
  const { content, rest } = splitContentProps(others);
  const { className, children, label, ...itemProps } = rest;
  const {
    body,
    ariaProps,
    dataProps,
    className: rowClasses,
  } = useItemContent(content, children, {
    trailingIcon: (
      <span
        data-slot="menu-submenu-chevron"
        aria-hidden="true"
        className={cn(
          "flex items-center rtl:-scale-x-100",
          "text-fg-muted group-data-[popup-open]/menu-item:text-current [[data-highlighted]:is(:not([data-disabled]),[data-input-modality=keyboard]_*)_&]:text-current",
        )}
      >
        {chevron ?? <CaretRight weight="bold" className="size-3.5" />}
      </span>
    ),
  });

  return (
    <BaseMenu.SubmenuTrigger
      ref={ref}
      data-slot="menu-submenu-trigger"
      label={textLabel(children, label)}
      {...ariaProps}
      {...dataProps}
      className={cn(rowClasses, className as string)}
      {...itemProps}
    >
      {body}
    </BaseMenu.SubmenuTrigger>
  );
});
SubmenuTrigger.displayName = "Menu.SubmenuTrigger";

/* ============================================================
 * CheckboxItem (indicator rendered automatically)
 * ============================================================ */

const indicatorClasses =
  "flex size-4 shrink-0 items-center justify-center data-[unchecked]:invisible";

export interface MenuCheckboxItemProps
  extends
    React.ComponentProps<typeof BaseMenu.CheckboxItem>,
    Omit<MenuItemContentProps, "loading" | "inactiveText" | "active"> {
  /** Replace the default check mark. */
  indicator?: React.ReactNode;
}

const CheckboxItem = React.forwardRef<HTMLElement, MenuCheckboxItemProps>((props, ref) => {
  const { indicator, ...others } = props;
  const { content, rest } = splitContentProps(others);
  const { className, children, label, ...itemProps } = rest;
  const {
    body,
    ariaProps,
    dataProps,
    className: rowClasses,
  } = useItemContent(content, children, {
    leading: (
      <BaseMenu.CheckboxItemIndicator
        keepMounted
        data-slot="menu-checkbox-item-indicator"
        className={indicatorClasses}
      >
        {indicator ?? <Check weight="bold" className="size-3.5" />}
      </BaseMenu.CheckboxItemIndicator>
    ),
  });

  return (
    <BaseMenu.CheckboxItem
      ref={ref}
      data-slot="menu-checkbox-item"
      label={textLabel(children, label)}
      {...ariaProps}
      {...dataProps}
      className={cn(rowClasses, className as string)}
      {...itemProps}
    >
      {body}
    </BaseMenu.CheckboxItem>
  );
});
CheckboxItem.displayName = "Menu.CheckboxItem";

/* ============================================================
 * RadioGroup, RadioItem (indicator rendered automatically)
 * ============================================================ */

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseMenu.RadioGroup
    ref={ref}
    data-slot="menu-radio-group"
    className={mergeClassName(cn(""), className)}
    {...props}
  />
));
RadioGroup.displayName = "Menu.RadioGroup";

export interface MenuRadioItemProps
  extends
    React.ComponentProps<typeof BaseMenu.RadioItem>,
    Omit<MenuItemContentProps, "loading" | "inactiveText" | "active"> {
  /** Replace the default dot. */
  indicator?: React.ReactNode;
}

const RadioItem = React.forwardRef<HTMLElement, MenuRadioItemProps>((props, ref) => {
  const { indicator, ...others } = props;
  const { content, rest } = splitContentProps(others);
  const { className, children, label, ...itemProps } = rest;
  const {
    body,
    ariaProps,
    dataProps,
    className: rowClasses,
  } = useItemContent(content, children, {
    leading: (
      <BaseMenu.RadioItemIndicator
        keepMounted
        data-slot="menu-radio-item-indicator"
        className={indicatorClasses}
      >
        {indicator ?? <Circle weight="fill" className="size-2" />}
      </BaseMenu.RadioItemIndicator>
    ),
  });

  return (
    <BaseMenu.RadioItem
      ref={ref}
      data-slot="menu-radio-item"
      label={textLabel(children, label)}
      {...ariaProps}
      {...dataProps}
      className={cn(rowClasses, className as string)}
      {...itemProps}
    >
      {body}
    </BaseMenu.RadioItem>
  );
});
RadioItem.displayName = "Menu.RadioItem";

/* ============================================================
 * Group, GroupLabel (with optional description)
 * ============================================================ */

const GroupDescriptionContext = React.createContext<((id: string | undefined) => void) | null>(
  null,
);

const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Group>>(
  ({ className, ...props }, ref) => {
    const [descriptionId, setDescriptionId] = React.useState<string>();
    return (
      <GroupDescriptionContext.Provider value={setDescriptionId}>
        <BaseMenu.Group
          ref={ref}
          data-slot="menu-group"
          aria-describedby={descriptionId}
          className={mergeClassName(cn(""), className)}
          {...props}
        />
      </GroupDescriptionContext.Provider>
    );
  },
);
Group.displayName = "Menu.Group";

export interface MenuGroupLabelProps extends React.ComponentProps<typeof BaseMenu.GroupLabel> {
  /** Extra text under the label, announced as the group's description. */
  description?: React.ReactNode;
}

const GroupLabel = React.forwardRef<HTMLDivElement, MenuGroupLabelProps>(
  ({ className, description, ...props }, ref) => {
    const register = React.useContext(GroupDescriptionContext);
    const id = React.useId();
    const hasDescription = description != null;
    React.useEffect(() => {
      if (!register) return;
      register(hasDescription ? id : undefined);
      return () => register(undefined);
    }, [register, hasDescription, id]);

    return (
      <>
        <BaseMenu.GroupLabel
          ref={ref}
          data-slot="menu-group-label"
          className={mergeClassName(
            cn("text-fg-muted px-2 pb-1 pt-2 text-xs font-semibold", hasDescription && "pb-0"),
            className,
          )}
          {...props}
        />
        {hasDescription && (
          <span
            id={id}
            data-slot="menu-group-description"
            className="text-fg-muted block px-2 pb-1 text-xs"
          >
            {description}
          </span>
        )}
      </>
    );
  },
);
GroupLabel.displayName = "Menu.GroupLabel";

/* ============================================================
 * Separator
 * ============================================================ */

export interface MenuSeparatorProps extends React.ComponentProps<typeof BaseMenu.Separator> {
  /** Line style. `dashed` (Ant) marks a softer break than `solid`. */
  variant?: "solid" | "dashed";
}

const Separator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, variant = "solid", ...props }, ref) => (
    <BaseMenu.Separator
      ref={ref}
      data-slot="menu-separator"
      data-variant={variant}
      className={mergeClassName(
        cn(
          "border-border-default -mx-1 my-1 h-0 shrink-0 border-t",
          variant === "dashed" && "border-dashed",
        ),
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = "Menu.Separator";

/* ============================================================
 * Search, List, Empty (filtering — wrap Root in Menu.FilterProvider)
 * ============================================================ */

export type MenuSearchProps = React.ComponentProps<typeof BaseMenu.Input>;

/**
 * Search field for `Menu.FilterProvider` menus. The clear button is
 * pointer-only (Base UI renders it `aria-hidden`, `tabindex="-1"`);
 * keyboard users clear the field with Escape.
 */
const Search = React.forwardRef<HTMLInputElement, MenuSearchProps>(
  ({ className, placeholder = "Search", ...props }, ref) => (
    <div data-slot="menu-search" className="relative -mx-1 -mt-1 mb-1 shrink-0">
      <MagnifyingGlass
        aria-hidden="true"
        className="text-fg-muted pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2"
      />
      <BaseMenu.Input
        ref={ref}
        data-slot="menu-search-input"
        placeholder={placeholder}
        aria-label={props["aria-label"] ?? placeholder}
        className={mergeClassName(
          cn(
            "text-fg-default placeholder:text-fg-muted border-border-default h-[var(--sp-control-height-sm)] w-full border-b bg-transparent pe-9 ps-9 text-sm outline-none",
          ),
          className,
        )}
        {...props}
      />
      <BaseMenu.Clear
        data-slot="menu-search-clear"
        className="text-fg-muted hover:text-fg-default absolute end-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-[var(--sp-nested-radius,6px)] outline-none hover:bg-[var(--sp-state-hover)]"
      >
        <X aria-hidden="true" className="size-3.5" />
      </BaseMenu.Clear>
    </div>
  ),
);
Search.displayName = "Menu.Search";

const List = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.List>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.List
      ref={ref}
      data-slot="menu-list"
      className={mergeClassName(cn("min-h-0 flex-1 overflow-y-auto overscroll-contain"), className)}
      {...props}
    />
  ),
);
List.displayName = "Menu.List";

const Empty = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseMenu.Empty>>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Empty
      ref={ref}
      data-slot="menu-empty"
      className={mergeClassName(
        cn("text-fg-muted px-2 py-4 text-center text-sm empty:hidden"),
        className,
      )}
      {...props}
    />
  ),
);
Empty.displayName = "Menu.Empty";

/* ============================================================
 * Compound export
 * ============================================================ */

export const Menu = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Positioner,
  Popup,
  Arrow,
  Viewport,
  Item,
  LinkItem,
  SubmenuRoot,
  SubmenuTrigger,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Group,
  GroupLabel,
  Separator,
  FilterProvider,
  Search,
  List,
  Empty,
  createHandle: BaseMenu.createHandle,
  useFilter: BaseMenu.useFilter,
};
