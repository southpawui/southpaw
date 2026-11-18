import * as React from "react";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";
import { cn } from "../../lib/cn";
import {
  KeyboardOpenContext,
  Menu,
  isKeyboardOpenChange,
  menuTriggerOpenClasses,
  useKeyboardOpenTracking,
} from "../Menu/Menu";

/*
 * Base UI's Menubar is only the bar (role="menubar", roving focus, Left/Right,
 * Home/End, hover-to-switch once a menu is open). Each menu in it is a normal
 * Menu, so items, shortcuts, submenus, selection, states, sizes and the
 * keyboard-open behaviour come from Menu. Only the bar and its triggers are
 * styled here.
 */

/* ============================================================
 * Typeahead across top-level triggers (Mantine, Ark)
 * ============================================================ */

const TRIGGER = "[data-slot=menubar-trigger]";

/**
 * Typing a character on a top-level trigger moves focus to the next trigger
 * whose label starts with it, wrapping around (APG menubar, optional).
 */
function handleTypeahead(event: React.KeyboardEvent<HTMLDivElement>) {
  const { key, ctrlKey, metaKey, altKey } = event;
  if (key.length !== 1 || ctrlKey || metaKey || altKey || key === " ") return;
  const bar = event.currentTarget;
  const current = (event.target as Element).closest<HTMLElement>(TRIGGER);
  // Only from a trigger in this bar, not from items in its (portalled) menus
  if (!current || !bar.contains(current)) return;
  const triggers = Array.from(bar.querySelectorAll<HTMLElement>(TRIGGER)).filter(
    (t) => !t.hasAttribute("data-disabled"),
  );
  const start = triggers.indexOf(current);
  const char = key.toLocaleLowerCase();
  for (let i = 1; i <= triggers.length; i++) {
    const candidate = triggers[(start + i) % triggers.length]!;
    if (candidate.textContent?.trim().toLocaleLowerCase().startsWith(char)) {
      event.preventDefault();
      candidate.focus();
      return;
    }
  }
}

/* ============================================================
 * Left/Right between open menus (APG: open the adjacent menu and move
 * focus to its first item)
 * ============================================================ */

/**
 * Base UI switches menus by focusing the neighbouring trigger, which opens
 * its menu from a focus event: the popup gets focus but no item is
 * highlighted, and the open isn't treated as a keyboard open. The bar marks
 * the switch before Base UI handles the key (capture phase), so Menubar.Menu
 * counts it as a keyboard open (no animation), then highlights the first
 * enabled item with Base UI's own ArrowDown.
 */
const KeyboardSwitchContext = React.createContext<React.RefObject<boolean> | null>(null);

function handleMenuSwitch(
  event: React.KeyboardEvent<HTMLDivElement>,
  switchMark: React.RefObject<boolean>,
) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const bar = event.currentTarget;
  if (bar.getAttribute("aria-orientation") === "vertical") return;
  // Only from inside an open menu of this bar (React events bubble through portals)
  const target = event.target as Element;
  if (bar.contains(target) || !target.closest("[role=menu]")) return;
  // Leave text fields (custom content in a menu) their own caret movement
  if (target.closest("input, textarea, [contenteditable=''], [contenteditable=true]")) return;
  switchMark.current = true;
  const doc = bar.ownerDocument;
  let tries = 0;
  const settle = () => {
    // The newly opened menu: its trigger is expanded, its popup has aria-controls' id
    const trigger = bar.querySelector<HTMLElement>(`${TRIGGER}[aria-expanded="true"]`);
    const popupId = trigger?.getAttribute("aria-controls");
    const popup = popupId ? doc.getElementById(popupId) : null;
    if (!popup && ++tries < 10) {
      requestAnimationFrame(settle);
      return;
    }
    switchMark.current = false;
    const active = doc.activeElement;
    const onEnabledItem =
      active?.getAttribute("role")?.startsWith("menuitem") &&
      active.hasAttribute("data-highlighted") &&
      !active.hasAttribute("data-disabled") &&
      !bar.contains(active);
    // Already on an enabled item (e.g. a submenu opened or closed): leave it
    if (!popup || onEnabledItem) return;
    // First enabled item (skips disabled ones, e.g. Undo with nothing to undo)
    popup
      .querySelector<HTMLElement>(
        '[role^="menuitem"]:not([data-disabled]):not([aria-disabled="true"])',
      )
      ?.focus();
  };
  requestAnimationFrame(() => requestAnimationFrame(settle));
}

/* ============================================================
 * Root
 * ============================================================ */

export interface MenubarProps extends React.ComponentProps<typeof BaseMenubar> {
  /**
   * The bar needs an accessible name, e.g. `aria-label="Application"`.
   * Use a menubar for application commands (File, Edit, View), never for
   * site navigation: use links in `<nav>` (NavigationMenu) for that.
   */
  "aria-label"?: string;
}

const MenubarRoot = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, onKeyDown, onKeyDownCapture, ...props }, ref) => {
    const switchMark = React.useRef(false);
    return (
      <KeyboardSwitchContext.Provider value={switchMark}>
        <BaseMenubar
          ref={ref}
          data-slot="menubar"
          onKeyDownCapture={(event) => {
            onKeyDownCapture?.(event);
            handleMenuSwitch(event, switchMark);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) handleTypeahead(event);
          }}
          className={cn(
            "bg-surface-raised border-border-default flex w-fit items-center gap-1 rounded-[var(--radius-DEFAULT)] border p-1 [--sp-nested-radius:6px]",
            "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
            className,
          )}
          {...props}
        />
      </KeyboardSwitchContext.Provider>
    );
  },
);
MenubarRoot.displayName = "Menubar";

/* ============================================================
 * Menu — one menu in the bar (Menu.Root plus switch tracking)
 * ============================================================ */

/**
 * One menu in the bar: Menu.Root, plus counting a Left/Right switch from an
 * open neighbour as a keyboard open. Controlled with `open` / `onOpenChange`.
 */
function MenubarMenu<Payload>(props: React.ComponentProps<typeof Menu.Root<Payload>>) {
  const switchMark = React.useContext(KeyboardSwitchContext);
  const [keyboardOpen, onOpenChange] = useKeyboardOpenTracking(
    props.onOpenChange,
    (details) => isKeyboardOpenChange(details) || !!switchMark?.current,
  );
  return (
    <Menu.Root {...props} onOpenChange={onOpenChange}>
      {/* Override Menu.Root's own tracking with the switch-aware value */}
      <KeyboardOpenContext.Provider value={keyboardOpen}>
        {props.children as React.ReactNode}
      </KeyboardOpenContext.Provider>
    </Menu.Root>
  );
}

/* ============================================================
 * Trigger — a top-level menu button
 * ============================================================ */

/**
 * ArrowUp on a trigger in a horizontal bar opens its menu at the last item
 * (APG, optional; Mantine). Base UI opens on ArrowDown only, so this uses its
 * own keyboard behaviour: ArrowDown to open, then End inside the menu.
 */
function openAtLastItem(trigger: HTMLElement) {
  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  // Wait for the menu to open and take focus, then jump to its last item.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      // Only inside the menu this trigger opened: never press End on
      // whatever else has focus by now (End on the bar jumps to the last menu).
      const doc = trigger.ownerDocument;
      const popupId = trigger.getAttribute("aria-controls");
      const popup = trigger.isConnected && popupId ? doc.getElementById(popupId) : null;
      const active = doc.activeElement;
      if (popup && active && popup.contains(active)) {
        active.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
      }
    }),
  );
}

/**
 * Opens one menu in the bar. Its open state is Menu's shared trigger style
 * (pressed fill, inset ring, forced-colours outline), keyed to
 * `data-popup-open` / `aria-expanded`.
 */
const Trigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Menu.Trigger>>(
  ({ className, onKeyDown, ...props }, ref) => (
    <Menu.Trigger
      ref={ref}
      data-slot="menubar-trigger"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== "ArrowUp") return;
        const bar = event.currentTarget.closest("[role=menubar]");
        if (bar?.getAttribute("aria-orientation") === "vertical") return;
        if (event.currentTarget.getAttribute("aria-expanded") === "true") return;
        event.preventDefault();
        openAtLastItem(event.currentTarget);
      }}
      className={cn(
        "text-fg-default inline-flex h-[var(--sp-control-height-sm)] shrink-0 cursor-default select-none items-center gap-2 rounded-[var(--sp-nested-radius,6px)] px-3 text-sm font-medium outline-none",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        "focus-visible:sp-focus-ring hover:bg-[var(--sp-state-hover)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
        "[[data-orientation=vertical]>&]:justify-start",
        menuTriggerOpenClasses,
        className,
      )}
      {...props}
    />
  ),
);
Trigger.displayName = "Menubar.Trigger";

/* ============================================================
 * Compound export — menus are Menu's parts
 * ============================================================ */

export const Menubar = Object.assign(MenubarRoot, {
  Menu: MenubarMenu,
  Trigger,
  Portal: Menu.Portal,
  Backdrop: Menu.Backdrop,
  Positioner: Menu.Positioner,
  Popup: Menu.Popup,
  Arrow: Menu.Arrow,
  Item: Menu.Item,
  LinkItem: Menu.LinkItem,
  SubmenuRoot: Menu.SubmenuRoot,
  SubmenuTrigger: Menu.SubmenuTrigger,
  CheckboxItem: Menu.CheckboxItem,
  RadioGroup: Menu.RadioGroup,
  RadioItem: Menu.RadioItem,
  Group: Menu.Group,
  GroupLabel: Menu.GroupLabel,
  Separator: Menu.Separator,
});
