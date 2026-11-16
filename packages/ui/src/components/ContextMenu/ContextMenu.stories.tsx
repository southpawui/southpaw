import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowClockwise,
  Copy,
  DotsThreeVertical,
  DownloadSimple,
  FileText,
  FolderSimple,
  Gear,
  Link as LinkIcon,
  PencilSimple,
  Scissors,
  ClipboardText,
  ShareNetwork,
  Star,
  Trash,
} from "@phosphor-icons/react";
import { ContextMenu } from "./ContextMenu";
import { Menu, type MenuPopupProps } from "../Menu/Menu";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/ContextMenu",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * Helpers
 * ============================================================ */

const areaClasses =
  "border-border-control text-fg-muted flex h-40 w-full items-center justify-center rounded-[var(--radius-DEFAULT)] border-2 border-dashed p-4 text-center text-sm data-[popup-open]:border-accent data-[popup-open]:text-fg-default sm:max-w-md";

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

/** The menu shared by most stories. */
const EditItems = () => (
  <>
    <ContextMenu.Item icon={<Scissors />} shortcut="Mod+X">
      Cut
    </ContextMenu.Item>
    <ContextMenu.Item icon={<Copy />} shortcut="Mod+C">
      Copy
    </ContextMenu.Item>
    <ContextMenu.Item icon={<ClipboardText />} shortcut="Mod+V">
      Paste
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item icon={<ArrowClockwise />} shortcut="Mod+R">
      Reload
    </ContextMenu.Item>
  </>
);

/**
 * An open context menu for showcase stories, anchored below its area
 * (there is no pointer position to open at). It portals into a local
 * container so it inherits `data-theme`/`data-density`, and is non-modal so
 * several can be open on one page without locking scroll. `modal` isn't in
 * ContextMenu.Root's types; Base UI passes it through to Menu.Root.
 */
function OpenContextMenu({
  area,
  children,
  popup,
  minHeight = 380,
}: {
  area: string;
  children: React.ReactNode;
  popup?: Omit<MenuPopupProps, "children">;
  minHeight?: number;
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const anchor = React.useRef<HTMLDivElement>(null);
  const nonModal = { modal: false } as Record<string, unknown>;
  return (
    <div ref={setContainer} style={{ minHeight }}>
      {container && (
        <ContextMenu.Root defaultOpen {...nonModal}>
          <ContextMenu.Trigger ref={anchor} className={areaClasses + " h-16"}>
            {area}
          </ContextMenu.Trigger>
          <ContextMenu.Portal container={container}>
            <ContextMenu.Positioner
              anchor={anchor}
              side="bottom"
              align="start"
              sideOffset={6}
              collisionAvoidance={{ side: "none", align: "none", fallbackAxisSide: "none" }}
            >
              <ContextMenu.Popup className="[--available-height:100dvh]" {...popup}>
                {children}
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      )}
    </div>
  );
}

/** Showcase only: draws one row highlighted (Base UI sets this on hover/focus). */
const preview = { "data-highlighted": "" } as Record<string, string>;

/* ============================================================
 * DEFAULT — right-click, long press (500ms), or keyboard
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger className={areaClasses}>
        Right-click, long-press, or focus and press Shift+F10, the Menu key or Ctrl+Enter (Mac)
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <EditItems />
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};

/* ============================================================
 * SUBMENUS AND SELECTION
 * ============================================================ */

function SubmenusAndSelectionStory() {
  const [grid, setGrid] = React.useState(true);
  const [rulers, setRulers] = React.useState(false);
  const [zoom, setZoom] = React.useState("100");
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className={areaClasses}>
        Right-click for view options
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Group>
              <ContextMenu.GroupLabel>Show</ContextMenu.GroupLabel>
              <ContextMenu.CheckboxItem checked={grid} onCheckedChange={setGrid}>
                Grid
              </ContextMenu.CheckboxItem>
              <ContextMenu.CheckboxItem checked={rulers} onCheckedChange={setRulers}>
                Rulers
              </ContextMenu.CheckboxItem>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.SubmenuRoot>
              <ContextMenu.SubmenuTrigger>Zoom</ContextMenu.SubmenuTrigger>
              <ContextMenu.Portal>
                <ContextMenu.Positioner>
                  <ContextMenu.Popup>
                    <ContextMenu.RadioGroup value={zoom} onValueChange={setZoom}>
                      <ContextMenu.RadioItem value="50">50%</ContextMenu.RadioItem>
                      <ContextMenu.RadioItem value="100">100%</ContextMenu.RadioItem>
                      <ContextMenu.RadioItem value="200">200%</ContextMenu.RadioItem>
                    </ContextMenu.RadioGroup>
                  </ContextMenu.Popup>
                </ContextMenu.Positioner>
              </ContextMenu.Portal>
            </ContextMenu.SubmenuRoot>
            <ContextMenu.SubmenuRoot>
              <ContextMenu.SubmenuTrigger icon={<ShareNetwork />}>Share</ContextMenu.SubmenuTrigger>
              <ContextMenu.Portal>
                <ContextMenu.Positioner>
                  <ContextMenu.Popup>
                    <ContextMenu.Item icon={<LinkIcon />}>Copy link</ContextMenu.Item>
                    <ContextMenu.Item>Email</ContextMenu.Item>
                  </ContextMenu.Popup>
                </ContextMenu.Positioner>
              </ContextMenu.Portal>
            </ContextMenu.SubmenuRoot>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

export const SubmenusAndSelection: Story = {
  render: () => <SubmenusAndSelectionStory />,
};

/* ============================================================
 * NESTED AREAS — the innermost area wins
 * ============================================================ */

export const Nested: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger className={areaClasses + " h-64 flex-col gap-4"} tabIndex={-1}>
        Page: right-click here for page actions
        <ContextMenu.Root>
          <ContextMenu.Trigger className={areaClasses + " h-24 w-3/4"}>
            Image: right-click here for image actions
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Positioner>
              <ContextMenu.Popup>
                <ContextMenu.Item icon={<DownloadSimple />}>Save image</ContextMenu.Item>
                <ContextMenu.Item icon={<Copy />}>Copy image</ContextMenu.Item>
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item icon={<ArrowClockwise />}>Reload page</ContextMenu.Item>
            <ContextMenu.Item icon={<Star />}>Bookmark page</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};

/* ============================================================
 * DISABLED — the browser's own menu comes back
 * ============================================================ */

export const Disabled: Story = {
  render: () => (
    <ContextMenu.Root disabled>
      <ContextMenu.Trigger className={areaClasses} tabIndex={-1}>
        Disabled: right-click shows the browser menu
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <EditItems />
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};

/* ============================================================
 * LIST ROWS — one menu for many rows, plus a visible "…" button
 * per row that opens the same items (the accessible alternative)
 * ============================================================ */

const files = ["report.pdf", "budget.xlsx", "notes.md", "logo.svg"];

/** Items shared by the context menu and the "…" Menu: one source of truth. */
const FileActions = ({ file }: { file: string }) => (
  <>
    <Menu.Group>
      <Menu.GroupLabel>{file}</Menu.GroupLabel>
      <Menu.Item icon={<PencilSimple />} shortcut="F2">
        Rename
      </Menu.Item>
      <Menu.Item icon={<DownloadSimple />}>Download</Menu.Item>
      <Menu.Item icon={<ShareNetwork />}>Share</Menu.Item>
    </Menu.Group>
    <Menu.Separator />
    <Menu.Item icon={<Trash />} variant="danger" dangerDescription="Moves it to the bin">
      Delete
    </Menu.Item>
  </>
);

/**
 * The item's hover pill, held while its menu is open (same hook as the
 * trigger area: `data-popup-open`). `--sp-state-pressed` matches the hovered
 * look (button hover on top of row hover). Only the item is marked, never
 * the whole row. Forced colours drop backgrounds, so it gets an outline.
 */
const openItemClasses =
  "data-[popup-open]:bg-[var(--sp-state-pressed)] forced-colors:data-[popup-open]:outline-2 forced-colors:data-[popup-open]:-outline-offset-2 forced-colors:data-[popup-open]:outline-solid";

function ListRowsStory() {
  const [file, setFile] = React.useState(files[0]!);
  const [contextOpen, setContextOpen] = React.useState(false);
  // Only the control that opened the menu is marked. A right-click or
  // keyboard open marks the file name; the ⋮ button marks itself through
  // Menu.Trigger's own open state (data-popup-open / aria-expanded).
  const contextRow = contextOpen ? file : null;
  // The row whose ⋮ Menu is open. Controlled so a right-click / Ctrl+click
  // on ⋮ opens ⋮'s own menu (the control the user acted on) instead of the
  // row's context menu.
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  return (
    <ContextMenu.Root onOpenChange={setContextOpen}>
      {/* One area around the list. Whichever row was right-clicked (or
          focused, for the keyboard) decides what the menu acts on. */}
      <ContextMenu.Trigger
        tabIndex={-1}
        // The item is highlighted instead of the whole list
        className="data-[popup-open]:bg-transparent sm:max-w-md forced-colors:data-[popup-open]:outline-none"
        onContextMenuCapture={(event) => {
          const row = (event.target as Element).closest<HTMLElement>("[data-file]");
          if (row?.dataset.file) setFile(row.dataset.file);
        }}
      >
        <ul
          aria-label="Files"
          className="border-border-default divide-border-default divide-y rounded-[var(--radius-DEFAULT)] border"
        >
          {files.map((name) => (
            <li
              key={name}
              data-file={name}
              // While any menu for this row is open, the row keeps its hover
              // background, set from state so it persists when the pointer
              // moves into the menu. The item acted on is marked on top.
              data-menu-open={menuFor === name || contextRow === name ? "" : undefined}
              className="text-fg-default flex items-center gap-2 px-1 py-1 text-sm hover:bg-[var(--sp-state-hover)] data-[menu-open]:bg-[var(--sp-state-hover)]"
            >
              {/* The row's own control: focus it and press Shift+F10, the
                  Menu key or Ctrl+Enter (Mac) to open its context menu. */}
              <Button
                variant="ghost"
                size="sm"
                icon={<FileText />}
                data-popup-open={contextRow === name ? "" : undefined}
                className={`flex-1 justify-start ${openItemClasses}`}
              >
                {name}
              </Button>
              <Menu.Root
                open={menuFor === name}
                onOpenChange={(open) => setMenuFor(open ? name : null)}
              >
                <Menu.Trigger
                  // Right-click / Ctrl+click on ⋮ (and Shift+F10 while it has
                  // focus) opens this menu, not the row's context menu.
                  onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setMenuFor(name);
                  }}
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      icon={<DotsThreeVertical weight="bold" />}
                      srOnly={`Actions for ${name}`}
                    />
                  }
                />
                <Menu.Portal>
                  <Menu.Positioner align="end">
                    <Menu.Popup>
                      <FileActions file={name} />
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </li>
          ))}
        </ul>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <FileActions file={file} />
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

export const ListRows: Story = {
  render: () => <ListRowsStory />,
};

/* ============================================================
 * PAGE-WIDE — one menu for a whole region (Carbon)
 * ============================================================ */

export const PageWide: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        role="region"
        aria-label="Workspace"
        className="bg-surface-sunken text-fg-default flex min-h-64 flex-col gap-3 rounded-[var(--radius-DEFAULT)] p-6"
      >
        <h2 className="text-base font-semibold">Workspace</h2>
        <p className="text-fg-muted text-sm">
          Right-click anywhere in this region. Text inside stays selectable.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<FolderSimple />}>
            New folder
          </Button>
          <Button variant="outline" size="sm" icon={<Gear />}>
            Settings
          </Button>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item icon={<FolderSimple />} shortcut="Mod+Shift+N">
              New folder
            </ContextMenu.Item>
            <ContextMenu.Item icon={<ArrowClockwise />}>Refresh</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item icon={<Gear />}>Settings</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};

/* ============================================================
 * CURSOR AND SELECTION — opt-in classes, not defaults
 * ============================================================ */

export const CursorAndSelection: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <Label>Default</Label>
        <ContextMenu.Root>
          <ContextMenu.Trigger className={areaClasses}>
            Normal cursor, text selectable
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Positioner>
              <ContextMenu.Popup>
                <EditItems />
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>
      <div>
        <Label>cursor-context-menu select-none</Label>
        <ContextMenu.Root>
          <ContextMenu.Trigger className={areaClasses + " cursor-context-menu select-none"}>
            Context-menu cursor (MUI), no text selection (Mantine)
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Positioner>
              <ContextMenu.Popup>
                <EditItems />
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * SEARCH — filter long menus (Mantine)
 * ============================================================ */

const commands = [
  "Align left",
  "Align centre",
  "Align right",
  "Bring forward",
  "Send backward",
  "Group",
  "Ungroup",
  "Lock",
  "Flip horizontal",
  "Flip vertical",
];

export const Search: Story = {
  render: () => (
    <ContextMenu.FilterProvider>
      <ContextMenu.Root>
        <ContextMenu.Trigger className={areaClasses}>
          Right-click to search actions
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup maxHeight="18rem">
              <ContextMenu.Search placeholder="Search actions" />
              <ContextMenu.List>
                {commands.map((c) => (
                  <ContextMenu.Item key={c}>{c}</ContextMenu.Item>
                ))}
              </ContextMenu.List>
              <ContextMenu.Empty>No actions match</ContextMenu.Empty>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </ContextMenu.FilterProvider>
  ),
};

/* ============================================================
 * STATES (open showcase). Menus have no valid/error state; their
 * states are default, highlighted, danger, disabled, inactive,
 * loading, checked.
 * ============================================================ */

const StateItems = () => (
  <>
    <ContextMenu.Item icon={<Copy />} shortcut="Mod+C">
      Default
    </ContextMenu.Item>
    <ContextMenu.Item icon={<PencilSimple />} {...preview}>
      Highlighted
    </ContextMenu.Item>
    <ContextMenu.CheckboxItem defaultChecked>Checked</ContextMenu.CheckboxItem>
    <ContextMenu.Item icon={<DownloadSimple />} disabled>
      Disabled
    </ContextMenu.Item>
    <ContextMenu.Item icon={<Star />} inactiveText="Starring is off for shared files">
      Inactive
    </ContextMenu.Item>
    <ContextMenu.Item icon={<ShareNetwork />} loading>
      Loading
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item icon={<Trash />} variant="danger" dangerDescription="Can't be undone">
      Danger
    </ContextMenu.Item>
  </>
);

export const States: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Subtle</Label>
        <OpenContextMenu area="Open (subtle)">
          <StateItems />
        </OpenContextMenu>
      </div>
      <div>
        <Label>Solid, with dividers</Label>
        <OpenContextMenu area="Open (solid)" popup={{ highlight: "solid", dividers: true }}>
          <StateItems />
        </OpenContextMenu>
      </div>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <Label>{density}</Label>
          <OpenContextMenu area={density} minHeight={300}>
            <EditItems />
          </OpenContextMenu>
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
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            <OpenContextMenu area="Subtle">
              <StateItems />
            </OpenContextMenu>
            <OpenContextMenu area="Solid" popup={{ highlight: "solid" }}>
              <StateItems />
            </OpenContextMenu>
            <OpenContextMenu
              area="Dividers, solid danger"
              popup={{ highlight: "solid", dividers: true }}
            >
              <ContextMenu.Item description="Keeps every commit">Merge</ContextMenu.Item>
              <ContextMenu.Item description="Combines commits into one" {...preview}>
                Squash
              </ContextMenu.Item>
              <ContextMenu.Item description="Replays commits on the base">Rebase</ContextMenu.Item>
              <ContextMenu.Separator variant="dashed" />
              <ContextMenu.Item icon={<Trash />} variant="danger" {...preview}>
                Delete branch
              </ContextMenu.Item>
            </OpenContextMenu>
          </div>
        </div>
      ))}
    </div>
  ),
};
