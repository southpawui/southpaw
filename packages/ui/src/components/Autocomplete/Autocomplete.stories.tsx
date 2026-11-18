import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowSquareOut,
  BookOpen,
  Gear,
  House,
  MagnifyingGlass,
  User,
} from "@phosphor-icons/react";
import { Autocomplete, type AutocompleteRootProps } from "./Autocomplete";
import { Field } from "../Field/Field";
import { Button } from "../Button/Button";
import { Dialog } from "../Dialog/Dialog";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import { Kbd } from "../Kbd/Kbd";

const meta: Meta = {
  title: "Components/Autocomplete",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * Data
 * ============================================================ */

const tags = [
  "accessibility",
  "animation",
  "api",
  "async",
  "build",
  "components",
  "css",
  "design-tokens",
  "docs",
  "forms",
  "performance",
  "react",
  "routing",
  "security",
  "testing",
  "typescript",
];

interface Page {
  id: string;
  label: string;
  href: string;
  section: string;
  icon: React.ReactNode;
}

const pages: Page[] = [
  { id: "home", label: "Home", href: "#home", section: "Navigation", icon: <House /> },
  { id: "docs", label: "Documentation", href: "#docs", section: "Navigation", icon: <BookOpen /> },
  { id: "profile", label: "Profile", href: "#profile", section: "Account", icon: <User /> },
  { id: "settings", label: "Settings", href: "#settings", section: "Account", icon: <Gear /> },
];

const emoji = [
  { id: "smile", label: "😀", name: "grinning face" },
  { id: "joy", label: "😂", name: "tears of joy" },
  { id: "heart", label: "❤️", name: "red heart" },
  { id: "thumbs", label: "👍", name: "thumbs up" },
  { id: "fire", label: "🔥", name: "fire" },
  { id: "party", label: "🎉", name: "party popper" },
  { id: "eyes", label: "👀", name: "eyes" },
  { id: "rocket", label: "🚀", name: "rocket" },
  { id: "star", label: "⭐", name: "star" },
  { id: "check", label: "✅", name: "check mark" },
  { id: "wave", label: "👋", name: "waving hand" },
  { id: "think", label: "🤔", name: "thinking face" },
];

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

/**
 * Showcase stories can't hover a row for the screenshot, so they pass
 * `data-highlighted` to draw one row in its highlighted state.
 */
const preview = { "data-highlighted": "" } as Record<string, string>;

/** An open autocomplete for showcase stories (portals locally, no flipping). */
function OpenAutocomplete({
  label,
  minHeight = 300,
  highlightIndex,
  input,
  className,
  ...root
}: Omit<AutocompleteRootProps<string>, "children"> & {
  label: string;
  minHeight?: number;
  highlightIndex?: number;
  input?: React.ComponentProps<typeof Autocomplete.Input>;
  className?: string;
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ minHeight }} className={className}>
      {container && (
        <Autocomplete.Root defaultOpen {...root}>
          <Field.Root>
            <Field.Label>{label}</Field.Label>
            <Autocomplete.Input placeholder="Search tags" {...input} />
          </Field.Root>
          <Autocomplete.Content
            portalProps={{ container }}
            positionerProps={{
              collisionAvoidance: { side: "none", align: "none", fallbackAxisSide: "none" },
            }}
            className="[--available-height:100dvh]"
          >
            {highlightIndex !== undefined ? (
              <Autocomplete.List>
                {(item: string, index: number) => (
                  <Autocomplete.Item
                    key={item}
                    value={item}
                    {...(index === highlightIndex ? preview : {})}
                  />
                )}
              </Autocomplete.List>
            ) : undefined}
          </Autocomplete.Content>
        </Autocomplete.Root>
      )}
    </div>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-sm">
      <Autocomplete.Root items={tags}>
        <Field.Root>
          <Field.Label>Tag</Field.Label>
          <Autocomplete.Input placeholder="e.g. react" />
          <Field.Description>Free text: pick a suggestion or type your own.</Field.Description>
        </Field.Root>
        <Autocomplete.Content />
      </Autocomplete.Root>
    </div>
  ),
};

/* ============================================================
 * INLINE COMPLETION — the rest of the suggestion fills the input
 * ============================================================ */

export const InlineCompletion: Story = {
  render: () => (
    <div className="grid gap-x-8 gap-y-10 sm:max-w-3xl sm:grid-cols-2">
      <Autocomplete.Root items={tags} mode="both" autoHighlight matchFrom="start">
        <Field.Root>
          <Field.Label>List and inline</Field.Label>
          <Autocomplete.Input placeholder="Type “ty”" />
          <Field.Description>
            The highlighted suggestion completes the text (MUI, Chakra).
          </Field.Description>
        </Field.Root>
        <Autocomplete.Content />
      </Autocomplete.Root>
      <Autocomplete.Root items={tags} mode="inline">
        <Field.Root>
          <Field.Label>Inline only</Field.Label>
          <Autocomplete.Input placeholder="Type, then ↓ to cycle" />
          <Field.Description>
            No list; arrow keys cycle completions (Carbon typeahead).
          </Field.Description>
        </Field.Root>
      </Autocomplete.Root>
    </div>
  ),
};

/* ============================================================
 * ITEMS and HIGHLIGHTING
 * ============================================================ */

export const Items: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Match highlighting</Label>
        <OpenAutocomplete label="Tag" items={tags} highlightMatches defaultValue="re" />
      </div>
      <div>
        <Label>Limit 4, starts with</Label>
        <OpenAutocomplete label="Tag" items={tags} limit={4} matchFrom="start" defaultValue="a" />
      </div>
    </div>
  ),
};

/* ============================================================
 * ASYNC SEARCH — loading, error, retry
 * ============================================================ */

function AsyncSearch() {
  const [value, setValue] = React.useState("");
  const [items, setItems] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const timer = React.useRef(0);
  const run = (q: string) => {
    window.clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    // Debounce 300ms, then a simulated 600ms request. "error" fails.
    timer.current = window.setTimeout(() => {
      timer.current = window.setTimeout(() => {
        setLoading(false);
        if (q.toLowerCase().includes("error")) setError(true);
        else setItems(tags.filter((t) => t.includes(q.toLowerCase())));
      }, 600);
    }, 300);
  };
  return (
    <Autocomplete.Root
      items={items}
      filter={null}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        run(v);
      }}
      loading={loading}
      error={error}
      onRetry={() => run(value)}
      minLength={2}
    >
      <Field.Root>
        <Field.Label>Search tags</Field.Label>
        <Autocomplete.Input placeholder="Try “re” or “error”" startIcon={<MagnifyingGlass />} />
        <Field.Description>Debounced 300 ms. Two characters minimum.</Field.Description>
      </Field.Root>
      <Autocomplete.Content />
    </Autocomplete.Root>
  );
}

export const Async: Story = {
  render: () => (
    <div className="sm:max-w-sm">
      <AsyncSearch />
    </div>
  ),
};

/* ============================================================
 * SEARCH FORM — submit on Enter
 * ============================================================ */

function SearchForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  return (
    <form
      className="flex flex-col gap-3 sm:max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get("q")));
      }}
    >
      <Autocomplete.Root items={tags} submitOnEnter name="q" autoHighlight>
        <Field.Root>
          <Field.Label>Search</Field.Label>
          <Autocomplete.Input
            placeholder="Search and press Enter"
            startIcon={<MagnifyingGlass />}
          />
          <Field.Description>Enter submits, even with a suggestion highlighted.</Field.Description>
        </Field.Root>
        <Autocomplete.Content />
      </Autocomplete.Root>
      <p className="text-fg-muted text-sm" role="status">
        {submitted === null ? "Nothing submitted yet." : `Submitted: “${submitted}”`}
      </p>
    </form>
  );
}

export const SubmitOnEnter: Story = {
  render: () => <SearchForm />,
};

/* ============================================================
 * COMMAND PALETTE — inline list inside a dialog, links
 * ============================================================ */

function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger render={<Button variant="outline" icon={<MagnifyingGlass />} />}>
        Search pages <Kbd keys="Mod+K" size="sm" className="ms-2" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup size="md" aria-label="Search pages" className="p-0">
          <Autocomplete.Root items={pages} inline open itemToStringValue={(p: Page) => p.label}>
            <div className="border-border-default border-b p-3">
              <Autocomplete.Input
                aria-label="Search pages"
                placeholder="Search pages…"
                startIcon={<MagnifyingGlass />}
                showClear={false}
              />
            </div>
            <ScrollArea.Root maxHeight="18rem" aria-label="Pages" className="p-1">
              <Autocomplete.List>
                {(page: Page) => (
                  <Autocomplete.Item
                    key={page.id}
                    value={page}
                    icon={page.icon}
                    trailing={<ArrowSquareOut aria-hidden="true" />}
                    description={page.section}
                    render={(props) => (
                      <a {...props} href={page.href}>
                        {props.children}
                      </a>
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {page.label}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </ScrollArea.Root>
            <Autocomplete.Empty className="text-fg-muted px-3 py-6 text-center text-sm empty:hidden">
              No pages found
            </Autocomplete.Empty>
          </Autocomplete.Root>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const CommandPaletteStory: Story = {
  name: "Command palette",
  render: () => <CommandPalette />,
};

/* ============================================================
 * GRID — emoji picker (Base UI grid navigation)
 * ============================================================ */

function chunk<T>(items: T[], size: number) {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function EmojiRows() {
  const items = Autocomplete.useFilteredItems<(typeof emoji)[number]>();
  return (
    <Autocomplete.List className="flex flex-col gap-1 p-1">
      {chunk(items, 6).map((row, r) => (
        <Autocomplete.Row key={r} className="grid grid-cols-6 gap-1">
          {row.map((e) => (
            <Autocomplete.Item
              key={e.id}
              value={e}
              aria-label={e.name}
              className="justify-center px-1 text-xl [&_[data-slot=autocomplete-item-content]]:items-center"
            >
              {e.label}
            </Autocomplete.Item>
          ))}
        </Autocomplete.Row>
      ))}
    </Autocomplete.List>
  );
}

export const Grid: Story = {
  render: () => (
    <div className="sm:max-w-xs">
      <Autocomplete.Root
        items={emoji}
        grid
        itemToStringValue={(e: (typeof emoji)[number]) => e.name}
        openOnInputClick
      >
        <Field.Root>
          <Field.Label>Emoji</Field.Label>
          <Autocomplete.Input placeholder="Search emoji" />
          <Field.Description>Arrow keys move in two dimensions.</Field.Description>
        </Field.Root>
        <Autocomplete.Content>
          <EmojiRows />
        </Autocomplete.Content>
      </Autocomplete.Root>
    </div>
  ),
};

/* ============================================================
 * VIRTUALIZED
 * ============================================================ */

const words = Array.from({ length: 5000 }, (_, i) => `word-${String(i + 1).padStart(4, "0")}`);

export const Virtualized: Story = {
  render: () => (
    <div className="sm:max-w-sm">
      <Autocomplete.Root items={words} virtualized>
        <Field.Root>
          <Field.Label>Search 5,000 words</Field.Label>
          <Autocomplete.Input placeholder="e.g. word-42" />
        </Field.Root>
        <Autocomplete.Content>
          <Autocomplete.VirtualList />
        </Autocomplete.Content>
      </Autocomplete.Root>
    </div>
  ),
};

/* ============================================================
 * BEHAVIOUR — commit on blur, full screen on mobile
 * ============================================================ */

export const Behaviour: Story = {
  render: () => (
    <div className="grid gap-x-8 gap-y-10 sm:max-w-3xl sm:grid-cols-2">
      <Autocomplete.Root items={tags} autoHighlight autoSelectOnBlur>
        <Field.Root>
          <Field.Label>Commit on blur</Field.Label>
          <Autocomplete.Input placeholder="Type, then Tab away" />
          <Field.Description>
            The highlighted suggestion fills the field (GOV.UK).
          </Field.Description>
        </Field.Root>
        <Autocomplete.Content />
      </Autocomplete.Root>
      <Autocomplete.Root items={tags} fullScreenOnMobile fullScreenTitle="Tag">
        <Field.Root>
          <Field.Label>Full screen on mobile</Field.Label>
          <Autocomplete.Input placeholder="Search tags" />
          <Field.Description>Below 640px the list opens full screen.</Field.Description>
        </Field.Root>
        <Autocomplete.Content />
      </Autocomplete.Root>
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
          <OpenAutocomplete label="Tag" size={size} items={tags.slice(0, 5)} highlightIndex={1} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

function StateField({
  label,
  description,
  error,
  invalid,
  ...root
}: Partial<AutocompleteRootProps<string>> & {
  label: string;
  description?: string;
  error?: string;
  invalid?: boolean;
}) {
  return (
    <Autocomplete.Root items={tags} {...root}>
      <Field.Root invalid={invalid} disabled={root.disabled}>
        <Field.Label>{label}</Field.Label>
        <Autocomplete.Input placeholder="Search tags" />
        {description && <Field.Description>{description}</Field.Description>}
        {error && <Field.Error match>{error}</Field.Error>}
      </Field.Root>
      <Autocomplete.Content />
    </Autocomplete.Root>
  );
}

const StatesGrid = () => (
  <div className="grid gap-8 sm:grid-cols-2">
    <StateField label="Default" />
    <StateField label="Filled" defaultValue="react" />
    <StateField label="Valid" valid defaultValue="react" description="Looks good." />
    <StateField
      label="Warning"
      warning
      defaultValue="reactt"
      description="Did you mean “react”? (Amber arrives with --sp-warning at the restack.)"
    />
    <StateField label="Error" invalid error="Enter a tag." />
    <StateField label="Disabled" disabled defaultValue="react" />
    <StateField label="Read-only" readOnly defaultValue="react" />
    <StateField label="Loading" loading defaultValue="re" />
  </div>
);

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-10 sm:max-w-3xl">
      <StatesGrid />
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <Label>Open, subtle</Label>
          <OpenAutocomplete label="Tag" items={tags.slice(0, 6)} highlightIndex={2} />
        </div>
        <div>
          <Label>Open, solid</Label>
          <OpenAutocomplete
            label="Tag"
            items={tags.slice(0, 6)}
            highlight="solid"
            highlightIndex={2}
          />
        </div>
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
          <OpenAutocomplete label="Tag" items={tags.slice(0, 5)} highlightIndex={1} />
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
          <div className="flex flex-col gap-8">
            <StatesGrid />
            <div className="grid gap-8 md:grid-cols-2">
              <OpenAutocomplete
                label="Subtle"
                items={tags.slice(0, 6)}
                highlightIndex={2}
                highlightMatches
                defaultValue="a"
              />
              <OpenAutocomplete
                label="Solid"
                items={tags.slice(0, 6)}
                highlight="solid"
                highlightIndex={2}
              />
              <OpenAutocomplete
                label="Load error"
                items={tags}
                error
                onRetry={() => {}}
                minHeight={200}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
