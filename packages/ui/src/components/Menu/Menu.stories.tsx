import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Archive,
  CaretDown,
  ClipboardText,
  Copy,
  DotsThreeVertical,
  DownloadSimple,
  Eye,
  FolderSimple,
  Gear,
  GitMerge,
  PencilSimple,
  Scissors,
  ShareNetwork,
  SignOut,
  Star,
  Trash,
  User,
} from "@phosphor-icons/react";
import { Menu, type MenuPopupProps } from "./Menu";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Menu",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * Helpers
 * ============================================================ */

/**
 * An open menu for showcase stories. The popup portals into a local
 * container so it inherits the surrounding `data-theme` and `data-density`,
 * and `modal={false}` lets several menus be open on one page.
 */
function OpenMenu({
  trigger,
  children,
  popup,
  minHeight = 260,
  dir,
}: {
  trigger: string;
  children: React.ReactNode;
  popup?: Omit<MenuPopupProps, "children">;
  minHeight?: number;
  dir?: "ltr" | "rtl";
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} dir={dir} style={{ minHeight }}>
      {container && (
        <Menu.Root defaultOpen modal={false}>
          <Menu.Trigger render={<Button variant="outline" size="sm" />}>{trigger}</Menu.Trigger>
          <Menu.Portal container={container}>
            {/* Showcase only: stay below the trigger and ignore viewport height,
                so stacked rows don't flip or clip in screenshots. */}
            <Menu.Positioner
              align="start"
              collisionAvoidance={{ side: "none", align: "none", fallbackAxisSide: "none" }}
            >
              <Menu.Popup className="[--available-height:100dvh]" {...popup}>
                {children}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      )}
    </div>
  );
}

/**
 * Showcase stories can't hover a row for the screenshot, so they pass
 * `data-highlighted` to draw one row in its highlighted state. Real menus
 * never need this: Base UI sets it on hover and keyboard focus.
 */
const preview = { "data-highlighted": "" } as Record<string, string>;

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

const EditItems = ({ highlightIndex }: { highlightIndex?: number }) => (
  <>
    <Menu.Item icon={<Scissors />} shortcut="Mod+X" {...(highlightIndex === 0 ? preview : {})}>
      Cut
    </Menu.Item>
    <Menu.Item icon={<Copy />} shortcut="Mod+C" {...(highlightIndex === 1 ? preview : {})}>
      Copy
    </Menu.Item>
    <Menu.Item icon={<ClipboardText />} shortcut="Mod+V" {...(highlightIndex === 2 ? preview : {})}>
      Paste
    </Menu.Item>
  </>
);

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="outline" />}>Edit</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="start">
          <Menu.Popup>
            <EditItems />
            <Menu.Separator />
            <Menu.Item icon={<PencilSimple />} shortcut="F2">
              Rename
            </Menu.Item>
            <Menu.Item icon={<Trash />} variant="danger" dangerDescription="Can't be undone">
              Delete
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

/* ============================================================
 * ITEMS — icon, shortcut, description, trailing, inset
 * ============================================================ */

export const Items: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Icon and shortcut</Label>
        <OpenMenu trigger="Edit">
          <EditItems />
          <Menu.Item inset shortcut="Mod+A">
            Select all (inset)
          </Menu.Item>
        </OpenMenu>
      </div>
      <div>
        <Label>Description (block and inline)</Label>
        <OpenMenu trigger="Share">
          <Menu.Item icon={<ShareNetwork />} description="Anyone with the link can view">
            Copy public link
          </Menu.Item>
          <Menu.Item icon={<User />} description="Only people you invite">
            Invite people
          </Menu.Item>
          <Menu.Item icon={<DownloadSimple />} description=".pdf" descriptionLayout="inline">
            Download
          </Menu.Item>
        </OpenMenu>
      </div>
      <div>
        <Label>Trailing content</Label>
        <OpenMenu trigger="Inbox">
          <Menu.Item icon={<FolderSimple />} trailing="24">
            All mail
          </Menu.Item>
          <Menu.Item
            icon={<Star />}
            trailing={
              <Badge size="sm" variant="info">
                New
              </Badge>
            }
          >
            Starred
          </Menu.Item>
          <Menu.Item icon={<Archive />} trailing="3" shortcut="Mod+E">
            Archive
          </Menu.Item>
        </OpenMenu>
      </div>
      <div>
        <Label>Shortcut sequence and active shortcut</Label>
        <OpenMenu trigger="Go to">
          <Menu.Item shortcut="g i">Inbox</Menu.Item>
          <Menu.Item shortcut="g d">Drafts</Menu.Item>
          <Menu.Item shortcut="Mod+K" shortcutActive>
            Command palette
          </Menu.Item>
        </OpenMenu>
      </div>
    </div>
  ),
};

/* ============================================================
 * SELECTION — checkbox and radio items
 * ============================================================ */

function SelectionMenu() {
  const [toolbar, setToolbar] = React.useState(true);
  const [statusBar, setStatusBar] = React.useState(false);
  const [sort, setSort] = React.useState("name");
  return (
    <OpenMenu trigger="View" minHeight={320}>
      <Menu.Group>
        <Menu.GroupLabel>Show</Menu.GroupLabel>
        <Menu.CheckboxItem checked={toolbar} onCheckedChange={setToolbar} shortcut="Mod+Shift+T">
          Toolbar
        </Menu.CheckboxItem>
        <Menu.CheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
          Status bar
        </Menu.CheckboxItem>
        <Menu.CheckboxItem disabled>Minimap</Menu.CheckboxItem>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Group>
        <Menu.GroupLabel>Sort by</Menu.GroupLabel>
        <Menu.RadioGroup value={sort} onValueChange={setSort}>
          <Menu.RadioItem value="name">Name</Menu.RadioItem>
          <Menu.RadioItem value="date" description="Newest first">
            Date modified
          </Menu.RadioItem>
          <Menu.RadioItem value="size">Size</Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Group>
    </OpenMenu>
  );
}

export const Selection: Story = {
  render: () => <SelectionMenu />,
};

/* ============================================================
 * GROUPS AND SEPARATORS
 * ============================================================ */

export const Groups: Story = {
  render: () => (
    <OpenMenu trigger="Account" minHeight={340}>
      <Menu.Group>
        <Menu.GroupLabel description="Signed in as sam@example.com">Account</Menu.GroupLabel>
        <Menu.Item icon={<User />}>Profile</Menu.Item>
        <Menu.Item icon={<Gear />}>Settings</Menu.Item>
      </Menu.Group>
      <Menu.Separator variant="dashed" />
      <Menu.Group>
        <Menu.GroupLabel>Help</Menu.GroupLabel>
        <Menu.Item inset>Documentation</Menu.Item>
        <Menu.Item inset>Keyboard shortcuts</Menu.Item>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Item icon={<SignOut />}>Sign out</Menu.Item>
    </OpenMenu>
  ),
};

/* ============================================================
 * SUBMENUS
 * ============================================================ */

export const Submenus: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="outline" />}>File</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="start">
          <Menu.Popup>
            <Menu.Item shortcut="Mod+N">New file</Menu.Item>
            <Menu.Item shortcut="Mod+O">Open…</Menu.Item>
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger>Open recent</Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup>
                    <Menu.Item>report.pdf</Menu.Item>
                    <Menu.Item>budget.xlsx</Menu.Item>
                    <Menu.SubmenuRoot>
                      <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
                      <Menu.Portal>
                        <Menu.Positioner>
                          <Menu.Popup>
                            <Menu.Item>notes.txt</Menu.Item>
                            <Menu.Item>draft.md</Menu.Item>
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.SubmenuRoot>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger icon={<ShareNetwork />} delay={300}>
                Share (slower hover)
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup>
                    <Menu.Item>Email</Menu.Item>
                    <Menu.Item>Copy link</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
            <Menu.Separator />
            <Menu.Item shortcut="Mod+W">Close</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

/* ============================================================
 * RIGHT TO LEFT — chevron and layout mirror
 * ============================================================ */

export const RightToLeft: Story = {
  render: () => (
    <OpenMenu trigger="ملف" dir="rtl">
      <Menu.Item icon={<Copy />} shortcut="Mod+C">
        نسخ
      </Menu.Item>
      <Menu.SubmenuRoot>
        <Menu.SubmenuTrigger icon={<ShareNetwork />}>مشاركة</Menu.SubmenuTrigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>بريد إلكتروني</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.SubmenuRoot>
      <Menu.Item icon={<Trash />} variant="danger">
        حذف
      </Menu.Item>
    </OpenMenu>
  ),
};

/* ============================================================
 * LINKS
 * ============================================================ */

export const Links: Story = {
  render: () => (
    <OpenMenu trigger="Help">
      <Menu.LinkItem href="#docs" active>
        Documentation
      </Menu.LinkItem>
      <Menu.LinkItem href="#changelog">Changelog</Menu.LinkItem>
      <Menu.LinkItem href="https://github.com" target="_blank">
        GitHub
      </Menu.LinkItem>
    </OpenMenu>
  ),
};

/* ============================================================
 * SEARCH — filter, empty state
 * ============================================================ */

const labels = [
  "bug",
  "documentation",
  "duplicate",
  "enhancement",
  "good first issue",
  "help wanted",
  "invalid",
  "question",
  "wontfix",
];

export const Search: Story = {
  render: () => {
    function SearchMenu() {
      const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
      return (
        <div ref={setContainer} style={{ minHeight: 360 }}>
          {container && (
            <Menu.FilterProvider>
              <Menu.Root defaultOpen modal={false}>
                <Menu.Trigger render={<Button variant="outline" size="sm" />}>Labels</Menu.Trigger>
                <Menu.Portal container={container}>
                  <Menu.Positioner align="start">
                    <Menu.Popup maxHeight="18rem">
                      <Menu.Search placeholder="Filter labels" />
                      <Menu.List>
                        {labels.map((l) => (
                          <Menu.CheckboxItem key={l}>{l}</Menu.CheckboxItem>
                        ))}
                      </Menu.List>
                      <Menu.Empty>No labels match</Menu.Empty>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </Menu.FilterProvider>
          )}
        </div>
      );
    }
    return <SearchMenu />;
  },
};

/* ============================================================
 * TRIGGERS — icon-only, hover, shared, split button
 * ============================================================ */

const shared = Menu.createHandle<string>();

export const Triggers: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div>
        <Label>Icon only</Label>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button
                variant="ghost"
                size="icon"
                icon={<DotsThreeVertical weight="bold" />}
                srOnly="More actions for report.pdf"
              />
            }
          />
          <Menu.Portal>
            <Menu.Positioner align="end">
              <Menu.Popup>
                <Menu.Item icon={<PencilSimple />}>Rename</Menu.Item>
                <Menu.Item icon={<DownloadSimple />}>Download</Menu.Item>
                <Menu.Item icon={<Trash />} variant="danger">
                  Delete
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>

      <div>
        <Label>Open on hover</Label>
        <Menu.Root>
          <Menu.Trigger openOnHover delay={100} render={<Button variant="outline" />}>
            Hover me
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="start">
              <Menu.Popup>
                <Menu.Item>Also opens on click</Menu.Item>
                <Menu.Item>And from the keyboard</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>

      <div>
        <Label>Shared menu</Label>
        <div className="flex gap-2">
          {["report.pdf", "budget.xlsx"].map((file) => (
            <Menu.Trigger
              key={file}
              handle={shared}
              payload={file}
              render={<Button variant="outline" size="sm" />}
            >
              {file}
            </Menu.Trigger>
          ))}
        </div>
        <Menu.Root handle={shared}>
          {({ payload }) => (
            <Menu.Portal>
              <Menu.Positioner align="start">
                <Menu.Popup>
                  <Menu.Group>
                    <Menu.GroupLabel>{payload}</Menu.GroupLabel>
                    <Menu.Item>Open</Menu.Item>
                    <Menu.Item>Duplicate</Menu.Item>
                  </Menu.Group>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          )}
        </Menu.Root>
      </div>

      <div>
        <Label>Split button</Label>
        <div role="group" aria-label="Merge" className="flex">
          <Button className="rounded-e-none" icon={<GitMerge />}>
            Merge
          </Button>
          <Menu.Root>
            <Menu.Trigger
              render={
                <Button
                  size="icon"
                  className="border-s-surface-base/30 rounded-s-none border-s"
                  icon={<CaretDown weight="bold" />}
                  srOnly="More merge options"
                />
              }
            />
            <Menu.Portal>
              <Menu.Positioner align="end">
                <Menu.Popup dividers>
                  <Menu.Item description="All commits are added to the base branch">
                    Create a merge commit
                  </Menu.Item>
                  <Menu.Item description="Commits are combined into one">
                    Squash and merge
                  </Menu.Item>
                  <Menu.Item description="Commits are rebased onto the base branch">
                    Rebase and merge
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * HIGHLIGHT — subtle and solid
 * ============================================================ */

export const Highlight: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Subtle (default)</Label>
        <OpenMenu trigger="Edit">
          <EditItems highlightIndex={1} />
          <Menu.Separator />
          <Menu.Item icon={<Trash />} variant="danger">
            Delete
          </Menu.Item>
        </OpenMenu>
      </div>
      <div>
        <Label>Solid</Label>
        <OpenMenu trigger="Edit" popup={{ highlight: "solid" }}>
          <EditItems highlightIndex={1} />
          <Menu.Separator />
          <Menu.Item icon={<Trash />} variant="danger" {...preview}>
            Delete
          </Menu.Item>
        </OpenMenu>
      </div>
    </div>
  ),
};

/* ============================================================
 * DIVIDERS — lines hide next to the highlighted item
 * ============================================================ */

const MergeItems = ({ highlight }: { highlight?: number }) => (
  <>
    {[
      ["Create a merge commit", "All commits are added to the base branch"],
      ["Squash and merge", "Commits are combined into one"],
      ["Rebase and merge", "Commits are rebased onto the base branch"],
      ["Merge when ready", "Merges once checks pass"],
    ].map(([title, description], i) => (
      <Menu.Item key={title} description={description} {...(highlight === i ? preview : {})}>
        {title}
      </Menu.Item>
    ))}
  </>
);

export const Dividers: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-3">
      <div>
        <Label>First highlighted</Label>
        <OpenMenu trigger="Merge" popup={{ dividers: true }} minHeight={320}>
          <MergeItems highlight={0} />
        </OpenMenu>
      </div>
      <div>
        <Label>Middle highlighted</Label>
        <OpenMenu trigger="Merge" popup={{ dividers: true }} minHeight={320}>
          <MergeItems highlight={1} />
        </OpenMenu>
      </div>
      <div>
        <Label>Last highlighted</Label>
        <OpenMenu trigger="Merge" popup={{ dividers: true }} minHeight={320}>
          <MergeItems highlight={3} />
        </OpenMenu>
      </div>
    </div>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <Label>{size}</Label>
          <OpenMenu trigger="Edit" popup={{ size }}>
            <EditItems highlightIndex={0} />
            <Menu.Item icon={<Eye />} description="Show hidden files">
              Reveal
            </Menu.Item>
          </OpenMenu>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * SCROLLING — long menus scroll within maxHeight
 * ============================================================ */

export const Scrolling: Story = {
  render: () => (
    <OpenMenu trigger="Timezone" popup={{ maxHeight: "14rem" }} minHeight={300}>
      {Array.from({ length: 24 }, (_, i) => (
        <Menu.Item key={i}>UTC{i - 11 >= 0 ? `+${i - 11}` : i - 11}:00</Menu.Item>
      ))}
    </OpenMenu>
  ),
};

/* ============================================================
 * ARROW AND PLACEMENT
 * ============================================================ */

export const Arrow: Story = {
  render: () => {
    function ArrowMenu() {
      const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
      return (
        <div ref={setContainer} className="pt-12" style={{ minHeight: 200 }}>
          {container && (
            <Menu.Root defaultOpen modal={false}>
              <Menu.Trigger render={<Button variant="outline" size="sm" />}>Options</Menu.Trigger>
              <Menu.Portal container={container}>
                <Menu.Positioner side="right" sideOffset={10}>
                  <Menu.Popup>
                    <Menu.Item>Pin</Menu.Item>
                    <Menu.Item>Mute</Menu.Item>
                  </Menu.Popup>
                  {/* After the popup, in the positioner: the popup scrolls, so an
                      arrow inside it would be clipped. */}
                  <Menu.Arrow />
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          )}
        </div>
      );
    }
    return <ArrowMenu />;
  },
};

/* ============================================================
 * STATES
 * Menus have no valid/error state. Their states are: default,
 * highlighted, danger, disabled, inactive, loading, active, checked.
 * ============================================================ */

const StateItems = ({ highlightIndex }: { highlightIndex?: number }) => (
  <>
    <Menu.Item icon={<Copy />} shortcut="Mod+C">
      Default
    </Menu.Item>
    <Menu.Item icon={<PencilSimple />} {...(highlightIndex === 1 ? preview : {})}>
      Highlighted
    </Menu.Item>
    <Menu.LinkItem href="#current" icon={<FolderSimple />} active>
      Active (current page)
    </Menu.LinkItem>
    <Menu.CheckboxItem defaultChecked>Checked</Menu.CheckboxItem>
    <Menu.Item icon={<DownloadSimple />} disabled>
      Disabled
    </Menu.Item>
    <Menu.Item icon={<Archive />} inactiveText="Archiving is turned off for this project">
      Inactive
    </Menu.Item>
    <Menu.Item icon={<ShareNetwork />} loading>
      Loading
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item icon={<Trash />} variant="danger" dangerDescription="Can't be undone">
      Danger
    </Menu.Item>
  </>
);

export const States: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Subtle</Label>
        <OpenMenu trigger="States" minHeight={420}>
          <StateItems highlightIndex={1} />
        </OpenMenu>
      </div>
      <div>
        <Label>Solid, with dividers</Label>
        <OpenMenu trigger="States" popup={{ highlight: "solid", dividers: true }} minHeight={420}>
          <StateItems highlightIndex={1} />
        </OpenMenu>
      </div>
    </div>
  ),
};

/* ============================================================
 * DISABLED ITEMS — every item type. Pointer hover shows no tint,
 * bar or outline. The arrow keys still reach them (Base UI keeps
 * disabled items focusable so screen readers announce them); the
 * keyboard highlight shows at the faded disabled opacity.
 * (Base UI LinkItem has no disabled state.)
 * ============================================================ */

export const DisabledItems: Story = {
  render: () => (
    <OpenMenu trigger="Disabled items" minHeight={380}>
      <Menu.Item icon={<Copy />}>Enabled</Menu.Item>
      <Menu.Item icon={<PencilSimple />} shortcut="F2" disabled>
        Plain (disabled)
      </Menu.Item>
      <Menu.CheckboxItem disabled defaultChecked>
        Checkbox (disabled)
      </Menu.CheckboxItem>
      <Menu.RadioGroup defaultValue="a">
        <Menu.RadioItem value="a">Radio</Menu.RadioItem>
        <Menu.RadioItem value="b" disabled>
          Radio (disabled)
        </Menu.RadioItem>
      </Menu.RadioGroup>
      <Menu.SubmenuRoot disabled>
        <Menu.SubmenuTrigger icon={<ShareNetwork />}>Submenu (disabled)</Menu.SubmenuTrigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>Never shown</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.SubmenuRoot>
      <Menu.Separator />
      <Menu.Item icon={<Trash />} variant="danger" disabled>
        Danger (disabled)
      </Menu.Item>
    </OpenMenu>
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
          <OpenMenu trigger="Edit" minHeight={300}>
            <EditItems highlightIndex={0} />
            <Menu.Separator />
            <Menu.Item icon={<Eye />} description="Show hidden files">
              Reveal
            </Menu.Item>
          </OpenMenu>
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
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            <OpenMenu trigger="Subtle" minHeight={420}>
              <StateItems highlightIndex={1} />
            </OpenMenu>
            <OpenMenu trigger="Solid" popup={{ highlight: "solid" }} minHeight={420}>
              <StateItems highlightIndex={1} />
            </OpenMenu>
            <OpenMenu trigger="Dividers" popup={{ dividers: true }} minHeight={420}>
              <MergeItems highlight={1} />
              <Menu.Separator variant="dashed" />
              <Menu.Item icon={<Trash />} variant="danger" {...preview}>
                Danger highlighted
              </Menu.Item>
            </OpenMenu>
            <OpenMenu trigger="Solid danger" popup={{ highlight: "solid" }} minHeight={420}>
              <EditItems />
              <Menu.Separator />
              <Menu.Item icon={<Trash />} variant="danger" {...preview}>
                Danger highlighted
              </Menu.Item>
            </OpenMenu>
          </div>
        </div>
      ))}
    </div>
  ),
};
