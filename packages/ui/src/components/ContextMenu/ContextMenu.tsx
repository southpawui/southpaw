import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { cn } from "../../lib/cn";
import { usePlatform } from "../Kbd/Kbd";
import { KeyboardOpenContext, Menu, useKeyboardOpenTracking } from "../Menu/Menu";

/*
 * Base UI's ContextMenu reuses the Menu parts (Popup, Item, Submenu…), so
 * those are re-exported from Menu: one set of item styles, sizes, highlight,
 * dividers, shortcuts and states for both components. Only Root, Trigger
 * and Positioner are specific to context menus.
 */

/* ============================================================
 * Root (pass-through). `disabled` brings back the browser's menu.
 * ============================================================ */

interface ContextMenuRootContextValue {
  /**
   * Set by Trigger just before it opens the menu from the keyboard, so Root
   * can tell that open apart from a right-click (both reach Base UI as a
   * `contextmenu` event).
   */
  keyboardMark: React.RefObject<boolean>;
  /** When disabled, Trigger leaves the keyboard alone so the browser's own menu works. */
  disabled: boolean;
}

const ContextMenuRootContext = React.createContext<ContextMenuRootContextValue | null>(null);

function Root(props: React.ComponentProps<typeof BaseContextMenu.Root>) {
  const keyboardMark = React.useRef(false);
  const disabled = !!props.disabled;
  const rootContext = React.useMemo(() => ({ keyboardMark, disabled }), [disabled]);
  const [keyboardOpen, onOpenChange] = useKeyboardOpenTracking(
    props.onOpenChange,
    () => keyboardMark.current,
  );
  return (
    <ContextMenuRootContext.Provider value={rootContext}>
      <KeyboardOpenContext.Provider value={keyboardOpen}>
        <BaseContextMenu.Root {...props} onOpenChange={onOpenChange} />
      </KeyboardOpenContext.Provider>
    </ContextMenuRootContext.Provider>
  );
}

/* ============================================================
 * Trigger — the area that opens the menu
 * ============================================================ */

/** Keys that open a context menu from the keyboard. */
function isContextMenuKey(event: React.KeyboardEvent, apple: boolean) {
  if (event.key === "ContextMenu") return true; // Menu key (Windows, Linux)
  if (event.key === "F10" && event.shiftKey) return true; // Shift+F10 (Windows, Linux)
  // Ctrl+Enter (macOS, React Aria convention; macOS has no Menu key)
  return apple && event.key === "Enter" && event.ctrlKey && !event.metaKey && !event.altKey;
}

/** Opens the menu at an element by dispatching a positioned `contextmenu` event. */
function openAt(element: Element) {
  const rect = element.getBoundingClientRect();
  element.dispatchEvent(
    new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left,
      clientY: rect.bottom,
      button: 2,
    }),
  );
}

export type ContextMenuTriggerProps = React.ComponentProps<typeof BaseContextMenu.Trigger>;

/**
 * The area that opens the menu on right-click and long press (500ms, Base
 * UI's fixed delay).
 *
 * It is focusable by default (`tabIndex={0}`), and Shift+F10, the Menu key
 * and Ctrl+Enter (macOS) open the menu at the focused element instead of at
 * the corner of the screen. Pass `tabIndex={-1}` when the area already
 * contains focusable rows; the keys still work from inside it.
 *
 * Context menus are hidden from many users: always offer the same actions
 * somewhere visible too (e.g. a "…" Menu button).
 *
 * While its menu is open the area is tinted (`data-popup-open`), like the
 * selected item in Finder or VS Code. For one area around many rows (see the
 * ListRows story), opt the area out of the tint, give the row whose menu is
 * open its hover background (e.g. `data-menu-open`), and mark only the item
 * the user acted on with `data-popup-open`.
 *
 * The area renders a `<div>` with no role, so screen readers name it by its
 * text. To label it with `aria-label`, also give it a role (e.g.
 * `role="region"` for a page-wide area), or the label is ignored.
 */
const Trigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ className, tabIndex = 0, onKeyDown, onContextMenuCapture, ...props }, ref) => {
    const apple = usePlatform() === "apple";
    const root = React.useContext(ContextMenuRootContext);
    /** Opens at `element`, marked as a keyboard open (no open animation). */
    const openFromKeyboard = (element: Element) => {
      if (root) root.keyboardMark.current = true;
      openAt(element);
      if (root) root.keyboardMark.current = false;
    };

    return (
      <BaseContextMenu.Trigger
        ref={ref}
        data-slot="context-menu-trigger"
        tabIndex={tabIndex}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || root?.disabled || !isContextMenuKey(event, apple)) return;
          // Stop the browser's own keyboard context menu event, which some
          // browsers report at 0,0, and open at the focused element instead.
          event.preventDefault();
          event.stopPropagation();
          openFromKeyboard(event.target as Element);
        }}
        onContextMenuCapture={(event) => {
          onContextMenuCapture?.(event);
          const native = event.nativeEvent;
          // A keyboard-generated contextmenu that slipped through (no pointer
          // position): reposition it at the focused element.
          if (!root?.disabled && native.isTrusted && native.clientX === 0 && native.clientY === 0) {
            event.preventDefault();
            event.stopPropagation();
            openFromKeyboard(event.target as Element);
          }
        }}
        className={cn(
          "focus-visible:sp-focus-ring outline-none",
          // Highlight the area whose menu is open (Finder, Gmail, VS Code),
          // with the same tint as Menu's subtle item highlight.
          "data-[popup-open]:bg-[var(--sp-state-pressed)]",
          // Backgrounds are dropped in forced colours: draw a frame instead.
          "forced-colors:data-[popup-open]:outline-solid forced-colors:data-[popup-open]:outline-2 forced-colors:data-[popup-open]:-outline-offset-2",
          className,
        )}
        {...props}
      />
    );
  },
);
Trigger.displayName = "ContextMenu.Trigger";

/* ============================================================
 * Positioner — at the pointer by default, or against `anchor`
 * ============================================================ */

const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseContextMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Positioner
    ref={ref}
    data-slot="context-menu-positioner"
    className={cn("z-50 outline-none", className)}
    {...props}
  />
));
Positioner.displayName = "ContextMenu.Positioner";

/* ============================================================
 * Compound export — shared parts come from Menu
 * ============================================================ */

export const ContextMenu = {
  Root,
  Trigger,
  Positioner,
  Portal: Menu.Portal,
  Backdrop: Menu.Backdrop,
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
  FilterProvider: Menu.FilterProvider,
  Search: Menu.Search,
  List: Menu.List,
  Empty: Menu.Empty,
};
