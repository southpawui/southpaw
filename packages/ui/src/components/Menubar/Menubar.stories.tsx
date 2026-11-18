import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ClipboardText,
  Copy,
  FilePlus,
  FloppyDisk,
  FolderOpen,
  List,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Printer,
  Question,
  Scissors,
  Trash,
} from "@phosphor-icons/react";
import { Menubar } from "./Menubar";
import { type MenuPopupProps } from "../Menu/Menu";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Menubar",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * Shared menu contents
 * ============================================================ */

const FileItems = () => (
  <>
    <Menubar.Item icon={<FilePlus />} shortcut="Mod+N">
      New file
    </Menubar.Item>
    <Menubar.Item icon={<FolderOpen />} shortcut="Mod+O">
      Open…
    </Menubar.Item>
    <Menubar.SubmenuRoot>
      <Menubar.SubmenuTrigger inset>Open recent</Menubar.SubmenuTrigger>
      <Menubar.Portal>
        <Menubar.Positioner>
          <Menubar.Popup>
            <Menubar.Item>report.pdf</Menubar.Item>
            <Menubar.Item>budget.xlsx</Menubar.Item>
            <Menubar.Item>notes.md</Menubar.Item>
          </Menubar.Popup>
        </Menubar.Positioner>
      </Menubar.Portal>
    </Menubar.SubmenuRoot>
    <Menubar.Separator />
    <Menubar.Item icon={<FloppyDisk />} shortcut="Mod+S">
      Save
    </Menubar.Item>
    <Menubar.Item icon={<Printer />} shortcut="Mod+P">
      Print…
    </Menubar.Item>
    <Menubar.Separator />
    <Menubar.Item icon={<Trash />} variant="danger" dangerDescription="Can't be undone">
      Delete file
    </Menubar.Item>
  </>
);

const EditItems = () => (
  <>
    {/* Nothing to undo yet: the first item is disabled, so keyboard entry
        lands on Redo, the first enabled item. */}
    <Menubar.Item icon={<ArrowCounterClockwise />} shortcut="Mod+Z" disabled>
      Undo
    </Menubar.Item>
    <Menubar.Item icon={<ArrowClockwise />} shortcut="Mod+Shift+Z">
      Redo
    </Menubar.Item>
    <Menubar.Separator />
    <Menubar.Item icon={<Scissors />} shortcut="Mod+X">
      Cut
    </Menubar.Item>
    <Menubar.Item icon={<Copy />} shortcut="Mod+C">
      Copy
    </Menubar.Item>
    <Menubar.Item icon={<ClipboardText />} shortcut="Mod+V">
      Paste
    </Menubar.Item>
  </>
);

function ViewItems() {
  const [toolbar, setToolbar] = React.useState(true);
  const [statusBar, setStatusBar] = React.useState(false);
  const [layout, setLayout] = React.useState("comfortable");
  return (
    <>
      <Menubar.CheckboxItem checked={toolbar} onCheckedChange={setToolbar}>
        Toolbar
      </Menubar.CheckboxItem>
      <Menubar.CheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
        Status bar
      </Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Group>
        <Menubar.GroupLabel>Layout</Menubar.GroupLabel>
        <Menubar.RadioGroup value={layout} onValueChange={setLayout}>
          <Menubar.RadioItem value="compact">Compact</Menubar.RadioItem>
          <Menubar.RadioItem value="comfortable">Comfortable</Menubar.RadioItem>
        </Menubar.RadioGroup>
      </Menubar.Group>
      <Menubar.Separator />
      <Menubar.Item icon={<MagnifyingGlassPlus />} shortcut="Mod++">
        Zoom in
      </Menubar.Item>
      <Menubar.Item icon={<MagnifyingGlassMinus />} shortcut="Mod+-">
        Zoom out
      </Menubar.Item>
    </>
  );
}

const HelpItems = () => (
  <>
    <Menubar.LinkItem href="#docs" icon={<Question />}>
      Documentation
    </Menubar.LinkItem>
    <Menubar.LinkItem href="https://github.com" target="_blank">
      Report an issue
    </Menubar.LinkItem>
  </>
);

const menus = [
  { label: "File", Items: FileItems },
  { label: "Edit", Items: EditItems },
  { label: "View", Items: ViewItems },
  { label: "Help", Items: HelpItems },
] as const;

/** A menu in the bar, positioned below its trigger (beside it when vertical). */
function BarMenu({
  label,
  children,
  menu,
  trigger,
  side,
}: {
  label: string;
  children: React.ReactNode;
  menu?: Omit<React.ComponentProps<typeof Menubar.Menu>, "children">;
  trigger?: Omit<React.ComponentProps<typeof Menubar.Trigger>, "children">;
  side?: "bottom" | "inline-end";
}) {
  return (
    <Menubar.Menu {...menu}>
      <Menubar.Trigger {...trigger}>{label}</Menubar.Trigger>
      <Menubar.Portal>
        <Menubar.Positioner side={side} align="start">
          <Menubar.Popup>{children}</Menubar.Popup>
        </Menubar.Positioner>
      </Menubar.Portal>
    </Menubar.Menu>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

/* ============================================================
 * DEFAULT — Left/Right, Home/End, typeahead, Down/Enter/Space
 * open at the first item, Up opens at the last item
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Menubar aria-label="Application">
      {menus.map(({ label, Items }) => (
        <BarMenu key={label} label={label}>
          <Items />
        </BarMenu>
      ))}
    </Menubar>
  ),
};

/* ============================================================
 * VERTICAL
 * ============================================================ */

export const Vertical: Story = {
  render: () => (
    <Menubar aria-label="Application" orientation="vertical">
      {menus.map(({ label, Items }) => (
        <BarMenu key={label} label={label} side="inline-end">
          <Items />
        </BarMenu>
      ))}
    </Menubar>
  ),
};

/* ============================================================
 * DISABLED — whole bar, or one menu
 * ============================================================ */

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <Label>Whole bar</Label>
        <Menubar aria-label="Application (disabled)" disabled>
          {menus.map(({ label, Items }) => (
            <BarMenu key={label} label={label}>
              <Items />
            </BarMenu>
          ))}
        </Menubar>
      </div>
      <div>
        <Label>One menu (Edit), skipped by the arrow keys</Label>
        <Menubar aria-label="Application (Edit disabled)">
          {menus.map(({ label, Items }) => (
            <BarMenu key={label} label={label} menu={{ disabled: label === "Edit" }}>
              <Items />
            </BarMenu>
          ))}
        </Menubar>
      </div>
    </div>
  ),
};

/* ============================================================
 * BEHAVIOUR — non-modal, open on hover
 * ============================================================ */

export const NonModal: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-fg-muted max-w-md text-sm">
        With <code>modal=&#123;false&#125;</code> the page stays scrollable and clickable while a
        menu is open.
      </p>
      <Menubar aria-label="Application" modal={false}>
        {menus.map(({ label, Items }) => (
          <BarMenu key={label} label={label}>
            <Items />
          </BarMenu>
        ))}
      </Menubar>
    </div>
  ),
};

/**
 * Base UI opens a menubar menu on hover only while another menu in the bar is
 * open (MenuTrigger.js: hover is enabled when `!isInMenubar ||
 * parentMenubarHasSubmenuOpen`), so `openOnHover` does nothing from cold
 * inside a bar. Here File starts open: move the pointer across the bar and
 * the menus switch with no click.
 */
export const HoverToSwitch: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ minHeight: 360 }}>
      <p className="text-fg-muted max-w-md text-sm">
        File is open. Move the pointer across Edit, View and Help: each menu opens as you hover it.
        Once you close them all, a click or a keyboard key opens one again.
      </p>
      <Menubar aria-label="Application" modal={false}>
        {menus.map(({ label, Items }) => (
          <BarMenu key={label} label={label} menu={{ defaultOpen: label === "File" }}>
            <Items />
          </BarMenu>
        ))}
      </Menubar>
    </div>
  ),
};

/* ============================================================
 * CONTROLLED — each menu's `open` (no index API)
 * ============================================================ */

function ControlledStory() {
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {menus.map(({ label }) => (
          <Button key={label} variant="outline" size="sm" onClick={() => setOpen(label)}>
            Open {label}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setOpen(null)}>
          Close
        </Button>
      </div>
      <p className="text-fg-muted text-sm" aria-live="polite">
        Open menu: {open ?? "none"}
      </p>
      <Menubar aria-label="Application" modal={false}>
        {menus.map(({ label, Items }) => (
          <BarMenu
            key={label}
            label={label}
            menu={{
              open: open === label,
              onOpenChange: (next) =>
                setOpen((current) => (next ? label : current === label ? null : current)),
            }}
          >
            <Items />
          </BarMenu>
        ))}
      </Menubar>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledStory />,
};

/* ============================================================
 * NARROW SCREENS — the bar collapses into one "Menu" button
 * ============================================================ */

export const NarrowScreens: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {[
        { width: "w-full max-w-xl", label: "Wide container" },
        { width: "w-64", label: "Narrow container" },
      ].map(({ width, label }) => (
        <div key={label}>
          <Label>{label}</Label>
          <div
            className={`@container border-border-default rounded-[var(--radius-DEFAULT)] border border-dashed p-2 ${width}`}
          >
            <Menubar aria-label="Application" className="@md:flex hidden">
              {menus.map(({ label: menu, Items }) => (
                <BarMenu key={menu} label={menu}>
                  <Items />
                </BarMenu>
              ))}
            </Menubar>
            {/* Below the container breakpoint: one menu with a submenu per bar menu */}
            <Menubar aria-label="Application" className="@md:hidden">
              <Menubar.Menu>
                <Menubar.Trigger>
                  <List weight="bold" aria-hidden="true" />
                  Menu
                </Menubar.Trigger>
                <Menubar.Portal>
                  <Menubar.Positioner align="start">
                    <Menubar.Popup>
                      {menus.map(({ label: menu, Items }) => (
                        <Menubar.SubmenuRoot key={menu}>
                          <Menubar.SubmenuTrigger>{menu}</Menubar.SubmenuTrigger>
                          <Menubar.Portal>
                            <Menubar.Positioner>
                              <Menubar.Popup>
                                <Items />
                              </Menubar.Popup>
                            </Menubar.Positioner>
                          </Menubar.Portal>
                        </Menubar.SubmenuRoot>
                      ))}
                    </Menubar.Popup>
                  </Menubar.Positioner>
                </Menubar.Portal>
              </Menubar.Menu>
            </Menubar>
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * RIGHT TO LEFT
 * ============================================================ */

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Menubar aria-label="التطبيق">
        <BarMenu label="ملف">
          <Menubar.Item icon={<FilePlus />} shortcut="Mod+N">
            جديد
          </Menubar.Item>
          <Menubar.SubmenuRoot>
            <Menubar.SubmenuTrigger>الأخيرة</Menubar.SubmenuTrigger>
            <Menubar.Portal>
              <Menubar.Positioner>
                <Menubar.Popup>
                  <Menubar.Item>تقرير</Menubar.Item>
                </Menubar.Popup>
              </Menubar.Positioner>
            </Menubar.Portal>
          </Menubar.SubmenuRoot>
        </BarMenu>
        <BarMenu label="تحرير">
          <Menubar.Item icon={<Copy />} shortcut="Mod+C">
            نسخ
          </Menubar.Item>
        </BarMenu>
      </Menubar>
    </div>
  ),
};

/* ============================================================
 * Open showcases (States, Density, Themes)
 * ============================================================ */

/**
 * A bar with one menu open, for screenshots. The popup portals into a local
 * container so it inherits `data-theme` / `data-density`; non-modal so
 * several can be open on one page.
 */
function OpenBar({
  open = "Edit",
  popup,
  minHeight = 330,
  disabledMenu,
}: {
  open?: string;
  popup?: Omit<MenuPopupProps, "children">;
  minHeight?: number;
  disabledMenu?: string;
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ minHeight }}>
      {container && (
        <Menubar aria-label={`Application, ${open} open`} modal={false}>
          {menus.map(({ label, Items }) => (
            <Menubar.Menu
              key={label}
              defaultOpen={label === open}
              disabled={label === disabledMenu}
            >
              <Menubar.Trigger>{label}</Menubar.Trigger>
              <Menubar.Portal container={container}>
                <Menubar.Positioner
                  align="start"
                  collisionAvoidance={{ side: "none", align: "none", fallbackAxisSide: "none" }}
                >
                  <Menubar.Popup className="[--available-height:100dvh]" {...popup}>
                    <Items />
                  </Menubar.Popup>
                </Menubar.Positioner>
              </Menubar.Portal>
            </Menubar.Menu>
          ))}
        </Menubar>
      )}
    </div>
  );
}

/* ============================================================
 * STATES. Menubars have no valid/error state; the bar's states are
 * default, open menu, disabled menu, disabled bar.
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Label>Edit open, View disabled</Label>
        <OpenBar open="Edit" disabledMenu="View" />
      </div>
      <div>
        <Label>File open, solid highlight</Label>
        <OpenBar open="File" popup={{ highlight: "solid" }} minHeight={380} />
      </div>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <Label>{density}</Label>
          <OpenBar open="Edit" minHeight={360} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="bg-surface-base text-fg-default rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <div className="grid gap-8 lg:grid-cols-2">
            <OpenBar open="Edit" disabledMenu="Help" />
            <OpenBar open="File" popup={{ highlight: "solid" }} minHeight={380} />
          </div>
        </div>
      ))}
    </div>
  ),
};
