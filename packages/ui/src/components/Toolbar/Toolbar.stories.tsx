import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  ChatCircleIcon,
  CodeIcon,
  ImageIcon,
  LinkSimpleIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  QuotesIcon,
  ShareNetworkIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextHIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Toolbar } from "./Toolbar";
import { Menu } from "../Menu/Menu";
import { ToggleGroup } from "../ToggleGroup/ToggleGroup";
import { Textarea } from "../Textarea/Textarea";
import { Kbd } from "../Kbd/Kbd";
import { cn } from "../../lib/cn";

const meta: Meta<typeof Toolbar.Root> = {
  title: "Components/Toolbar",
  component: Toolbar.Root,
  parameters: {
    docs: {
      description: {
        component:
          "A `role=\"toolbar\"` row of controls with one Tab stop: arrow keys move between items and Home/End jump to the ends (APG). Use it for three or more controls; for two, or for buttons that should each be a Tab stop, use ButtonGroup. Icon-only items get a tooltip that is also their name. Items that don't fit move into a “More” menu. Disabled items stay focusable so people can find them and read their tooltip. Put a text field last, and use at most one: it keeps the arrow keys while its caret isn't at an end.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar.Root>;

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide", className)}>
    {children}
  </p>
);

const Frame = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full sm:max-w-2xl", className)}>{children}</div>
);

/**
 * A text editor's toolbar, used across the stories. Called as a function, not rendered as
 * `<EditorItems />`: the More menu reads the Root's direct children (fragments are fine).
 */
function editorItems(prefix = "") {
  return (
    <>
      <Toolbar.Group aria-label="History">
        <Toolbar.Button
          iconOnly
          icon={<ArrowCounterClockwiseIcon />}
          label="Undo"
          shortcut="Mod+Z"
        />
        <Toolbar.Button
          iconOnly
          icon={<ArrowClockwiseIcon />}
          label="Redo"
          shortcut="Mod+Shift+Z"
          disabled
        />
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Toggle iconOnly icon={<TextBIcon />} label="Bold" shortcut="Mod+B" defaultPressed />
      <Toolbar.Toggle iconOnly icon={<TextItalicIcon />} label="Italic" shortcut="Mod+I" />
      <Toolbar.Toggle iconOnly icon={<TextUnderlineIcon />} label="Underline" shortcut="Mod+U" />
      <Toolbar.Toggle iconOnly icon={<TextStrikethroughIcon />} label="Strikethrough" />
      <Toolbar.Separator />
      <ToggleGroup.Root
        aria-label="Alignment"
        defaultValue={["left"]}
        attached={false}
        key={`${prefix}align`}
      >
        <Toolbar.Toggle value="left" iconOnly icon={<TextAlignLeftIcon />} label="Align left" />
        <Toolbar.Toggle
          value="center"
          iconOnly
          icon={<TextAlignCenterIcon />}
          label="Align centre"
        />
        <Toolbar.Toggle value="right" iconOnly icon={<TextAlignRightIcon />} label="Align right" />
      </ToggleGroup.Root>
      <Toolbar.Separator />
      <Toolbar.Button iconOnly icon={<ListBulletsIcon />} label="Bulleted list" />
      <Toolbar.Button iconOnly icon={<ListNumbersIcon />} label="Numbered list" />
      <Toolbar.Button iconOnly icon={<QuotesIcon />} label="Quote" />
      <Toolbar.Button iconOnly icon={<CodeIcon />} label="Code" />
      <Toolbar.Button iconOnly icon={<LinkSimpleIcon />} label="Insert link" shortcut="Mod+K" />
      <Toolbar.Button iconOnly icon={<ImageIcon />} label="Insert image" />
    </>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Frame>
      <Toolbar.Root aria-label="Text formatting">{editorItems()}</Toolbar.Root>
    </Frame>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

// Static pictures of interaction states (inert, not tabbable)
const hoverLook = "bg-[var(--sp-state-hover)]";
const focusLook = "sp-focus-ring";

/**
 * Rest, hover, focus, pressed and disabled, for buttons and toggles. Hover and focus are
 * static previews. A toolbar has no valid or error state of its own: its controls carry
 * those (a ToggleGroup `invalid`, an Input in a Field).
 */
export const States: Story = {
  render: () => (
    <Frame className="flex flex-col gap-6">
      <div>
        <Label>Rest · hover · focus · pressed · disabled</Label>
        <Toolbar.Root aria-label="States" overflow="wrap">
          <Toolbar.Button iconOnly icon={<TextHIcon />} label="Rest" />
          <Toolbar.Button iconOnly icon={<TextHIcon />} label="Hover" className={hoverLook} />
          <Toolbar.Button iconOnly icon={<TextHIcon />} label="Focus" className={focusLook} />
          <Toolbar.Toggle iconOnly icon={<TextBIcon />} label="Pressed" defaultPressed />
          <Toolbar.Button iconOnly icon={<TextHIcon />} label="Disabled" disabled />
          <Toolbar.Toggle
            iconOnly
            icon={<TextBIcon />}
            label="Disabled and pressed"
            disabled
            defaultPressed
          />
          <Toolbar.Separator />
          <Toolbar.Button>Text</Toolbar.Button>
          <Toolbar.Button className={hoverLook}>Hover</Toolbar.Button>
          <Toolbar.Button disabled>Disabled</Toolbar.Button>
          <Toolbar.Link href="#help">Link</Toolbar.Link>
        </Toolbar.Root>
      </div>
      <div>
        <Label>Disabled toolbar (every item, still focusable)</Label>
        <Toolbar.Root aria-label="Disabled toolbar" disabled>
          <Toolbar.Button iconOnly icon={<ArrowCounterClockwiseIcon />} label="Undo" />
          <Toolbar.Toggle iconOnly icon={<TextBIcon />} label="Bold" defaultPressed />
          <Toolbar.Button>Publish</Toolbar.Button>
        </Toolbar.Root>
      </div>
    </Frame>
  ),
};

/* ============================================================
 * OVERFLOW
 * ============================================================ */

/**
 * `overflow="menu"` (default) measures the items and moves the ones that don't fit into a
 * “More” menu, in order. Toggles become checkbox items, a single-select ToggleGroup a radio
 * group, and groups move as a unit. Drag the corner of each box to resize it.
 */
export const Overflow: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      {[
        { label: "Full width", width: "w-full" },
        { label: "360px", width: "w-[360px]" },
        { label: "240px", width: "w-[240px]" },
      ].map(({ label, width }) => (
        <div key={label}>
          <Label>{label}</Label>
          <div className={cn("max-w-full resize-x overflow-hidden pb-2", width)}>
            <Toolbar.Root aria-label={`Text formatting, ${label}`}>
              {editorItems(label)}
            </Toolbar.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};

/** `overflow="wrap"` wraps onto more lines (a separator that would start or end a line is hidden); `overflow={false}` on an item keeps it visible. */
export const OverflowModes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div className="w-[260px] max-w-full">
        <Label>wrap</Label>
        <Toolbar.Root aria-label="Wrapping" overflow="wrap" size="sm">
          {editorItems("wrap")}
        </Toolbar.Root>
      </div>
      <div className="w-[300px] max-w-full">
        <Label>menu, with Share kept visible</Label>
        <Toolbar.Root aria-label="Kept visible">
          {editorItems("keep")}
          <Toolbar.Separator />
          <Toolbar.Button icon={<ShareNetworkIcon />} overflow={false}>
            Share
          </Toolbar.Button>
        </Toolbar.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * LABELS
 * ============================================================ */

/**
 * `hideLabelsBelow="md"`: below 768px the labels are hidden and shown in tooltips instead,
 * and the items become squares (Spectrum `buttonLabelBehavior`). Narrow the canvas to see it.
 */
export const HideLabels: Story = {
  render: () => (
    <Frame>
      <Toolbar.Root aria-label="Document" hideLabelsBelow="md">
        <Toolbar.Button icon={<PencilSimpleIcon />}>Edit</Toolbar.Button>
        <Toolbar.Button icon={<ChatCircleIcon />}>Comment</Toolbar.Button>
        <Toolbar.Toggle icon={<MagnifyingGlassIcon />} label="Find" />
        <Toolbar.Button icon={<ShareNetworkIcon />}>Share</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button icon={<TrashIcon />} color="danger">
          Delete
        </Toolbar.Button>
      </Toolbar.Root>
    </Frame>
  ),
};

/* ============================================================
 * APPEARANCE
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <Frame className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <Label>{size}</Label>
          <Toolbar.Root aria-label={`Size ${size}`} size={size}>
            {editorItems(size)}
          </Toolbar.Root>
        </div>
      ))}
    </Frame>
  ),
};

/** `bordered` (default) or `flush`, with the `default` or `condensed` gap. */
export const Variants: Story = {
  render: () => (
    <Frame className="flex flex-col gap-6">
      {(["bordered", "flush"] as const).flatMap((variant) =>
        (["default", "condensed"] as const).map((gap) => (
          <div key={`${variant}-${gap}`}>
            <Label>
              {variant} · {gap}
            </Label>
            <Toolbar.Root aria-label={`${variant} ${gap}`} variant={variant} gap={gap}>
              {editorItems(`${variant}${gap}`)}
            </Toolbar.Root>
          </div>
        )),
      )}
    </Frame>
  ),
};

/** `Toolbar.Group attached` joins items into one control (outline items, shared borders). */
export const Groups: Story = {
  render: () => (
    <Frame>
      <Toolbar.Root aria-label="Groups" overflow="wrap">
        <Toolbar.Group attached aria-label="Text style">
          <Toolbar.Toggle iconOnly icon={<TextBIcon />} label="Bold" defaultPressed />
          <Toolbar.Toggle iconOnly icon={<TextItalicIcon />} label="Italic" />
          <Toolbar.Toggle iconOnly icon={<TextUnderlineIcon />} label="Underline" />
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group attached aria-label="Lists">
          <Toolbar.Button iconOnly icon={<ListBulletsIcon />} label="Bulleted list" />
          <Toolbar.Button iconOnly icon={<ListNumbersIcon />} label="Numbered list" />
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group aria-label="Insert">
          <Toolbar.Button iconOnly icon={<LinkSimpleIcon />} label="Insert link" />
          <Toolbar.Button iconOnly icon={<ImageIcon />} label="Insert image" />
        </Toolbar.Group>
      </Toolbar.Root>
    </Frame>
  ),
};

/** Up/Down move between items; tooltips open to the side. */
export const Vertical: Story = {
  render: () => (
    <Toolbar.Root aria-label="Drawing tools" orientation="vertical">
      <Toolbar.Toggle iconOnly icon={<PencilSimpleIcon />} label="Pen" defaultPressed />
      <Toolbar.Toggle iconOnly icon={<TextHIcon />} label="Text" />
      <Toolbar.Toggle iconOnly icon={<ImageIcon />} label="Image" />
      <Toolbar.Separator />
      <Toolbar.Button iconOnly icon={<ArrowCounterClockwiseIcon />} label="Undo" />
      <Toolbar.Button iconOnly icon={<TrashIcon />} label="Clear" color="danger" />
    </Toolbar.Root>
  ),
};

/** `sticky` keeps the toolbar at the top of the scrolling area; `stickyOffset` clears a header. */
export const Sticky: Story = {
  render: () => (
    <div className="border-border-default h-72 w-full overflow-auto rounded-lg border sm:max-w-2xl">
      <Toolbar.Root
        aria-label="Sticky formatting"
        sticky
        variant="flush"
        className="border-border-default border-b px-2 py-1"
      >
        {editorItems("sticky")}
      </Toolbar.Root>
      <div className="text-fg-default flex flex-col gap-4 p-4 text-sm">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>
            Paragraph {i + 1}. Scroll this box: the toolbar stays at the top so the formatting
            controls are always in reach.
          </p>
        ))}
      </div>
    </div>
  ),
};

/* ============================================================
 * COMPOSITION
 * ============================================================ */

/**
 * Menus, links and a search field. A menu trigger is a Toolbar.Button rendered by Menu.Trigger.
 * The text field goes last (APG): it keeps the arrow keys while the caret isn't at an end.
 */
export const Composition: Story = {
  render: () => (
    <Frame>
      <Toolbar.Root aria-label="Document" overflow="wrap">
        <Menu.Root>
          <Menu.Trigger render={<Toolbar.Button icon={<TextHIcon />}>Heading</Toolbar.Button>} />
          <Menu.Portal>
            <Menu.Positioner align="start">
              <Menu.Popup>
                <Menu.Item>Heading 1</Menu.Item>
                <Menu.Item>Heading 2</Menu.Item>
                <Menu.Item>Paragraph</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <Toolbar.Separator />
        <Toolbar.Link href="#guide">Style guide</Toolbar.Link>
        <Toolbar.Link href="https://example.com" target="_blank">
          Help
        </Toolbar.Link>
        <Toolbar.Separator />
        <Toolbar.Input aria-label="Find in document" placeholder="Find…" className="w-40" />
      </Toolbar.Root>
    </Frame>
  ),
};

/**
 * A shortcut that jumps into the toolbar (APG). Editors use Alt+F10 (TinyMCE, CKEditor):
 * press it in the text box, and Escape to go back.
 */
export const KeyboardShortcut: Story = {
  render: function KeyboardShortcutStory() {
    const toolbarRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<HTMLTextAreaElement>(null);
    return (
      <Frame className="flex flex-col gap-2">
        <Toolbar.Root
          ref={toolbarRef}
          aria-label="Text formatting"
          aria-keyshortcuts="Alt+F10"
          onKeyDown={(event) => {
            if (event.key === "Escape") editorRef.current?.focus();
          }}
        >
          {editorItems("kbd")}
        </Toolbar.Root>
        <Textarea
          ref={editorRef}
          aria-label="Document"
          defaultValue="Press Alt+F10 here to move to the toolbar."
          onKeyDown={(event) => {
            if (event.altKey && event.key === "F10") {
              event.preventDefault();
              // The toolbar's current Tab stop
              toolbarRef.current?.querySelector<HTMLElement>("[tabindex='0']")?.focus();
            }
          }}
        />
        <p className="text-fg-muted text-sm">
          <Kbd keys="Alt+F10" /> moves to the toolbar; <Kbd keys="Escape" /> comes back.
        </p>
      </Frame>
    );
  },
};

/**
 * Right to left: arrow keys follow the reading direction (Base UI), Home/End still go to the
 * first and last item, and the More menu opens from the end. `labels` translates its name.
 */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" lang="ar" className="w-[260px] max-w-full">
      <Toolbar.Root aria-label="تنسيق النص" labels={{ more: "المزيد" }}>
        <Toolbar.Toggle iconOnly icon={<TextBIcon />} label="عريض" defaultPressed />
        <Toolbar.Toggle iconOnly icon={<TextItalicIcon />} label="مائل" />
        <Toolbar.Toggle iconOnly icon={<TextUnderlineIcon />} label="تسطير" />
        <Toolbar.Separator />
        <Toolbar.Button iconOnly icon={<ListBulletsIcon />} label="قائمة نقطية" />
        <Toolbar.Button iconOnly icon={<ListNumbersIcon />} label="قائمة مرقمة" />
        <Toolbar.Button iconOnly icon={<LinkSimpleIcon />} label="إدراج رابط" />
        <Toolbar.Button iconOnly icon={<ImageIcon />} label="إدراج صورة" />
      </Toolbar.Root>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <Frame className="flex flex-col gap-6">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <Label>{density}</Label>
          <Toolbar.Root aria-label={`Formatting, ${density}`} size="md">
            {editorItems(density)}
          </Toolbar.Root>
        </div>
      ))}
    </Frame>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

/**
 * Both variants, every item state, and the item colours: default (accent when pressed),
 * danger for destructive actions, and brand only for the one call to action.
 */
export const Themes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={theme}
          className="bg-surface-base text-fg-default flex flex-col gap-4 rounded-lg p-6"
        >
          <Label>{theme}</Label>
          {(["bordered", "flush"] as const).map((variant) => (
            <div key={variant}>
              <Label>{variant}</Label>
              <Toolbar.Root aria-label={`${theme} ${variant}`} variant={variant} overflow="wrap">
                <Toolbar.Button iconOnly icon={<ArrowCounterClockwiseIcon />} label="Undo" />
                <Toolbar.Button iconOnly icon={<TextHIcon />} label="Hover" className={hoverLook} />
                <Toolbar.Button iconOnly icon={<TextHIcon />} label="Focus" className={focusLook} />
                <Toolbar.Button iconOnly icon={<ArrowClockwiseIcon />} label="Redo" disabled />
                <Toolbar.Separator />
                <Toolbar.Toggle iconOnly icon={<TextBIcon />} label="Bold" defaultPressed />
                <Toolbar.Toggle iconOnly icon={<TextItalicIcon />} label="Italic" />
                <Toolbar.Toggle
                  iconOnly
                  icon={<TextUnderlineIcon />}
                  label="Underline"
                  disabled
                  defaultPressed
                />
                <Toolbar.Separator />
                <Toolbar.Group attached aria-label={`${theme} ${variant} lists`}>
                  <Toolbar.Button iconOnly icon={<ListBulletsIcon />} label="Bulleted list" />
                  <Toolbar.Button iconOnly icon={<ListNumbersIcon />} label="Numbered list" />
                </Toolbar.Group>
                <Toolbar.Separator />
                <Toolbar.Link href={`#${theme}-${variant}`}>Guide</Toolbar.Link>
                <Toolbar.Button icon={<TrashIcon />} color="danger">
                  Delete
                </Toolbar.Button>
                <Toolbar.Button variant="solid" color="brand">
                  Publish
                </Toolbar.Button>
                <Toolbar.Input
                  aria-label={`Find, ${theme} ${variant}`}
                  placeholder="Find…"
                  className="w-28"
                />
              </Toolbar.Root>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
};
