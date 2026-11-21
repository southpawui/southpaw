import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Buildings,
  Code,
  FileTs,
  GlobeHemisphereWest,
  MagnifyingGlass,
  User,
} from "@phosphor-icons/react";
import { Combobox, type ComboboxRootProps } from "./Combobox";
import { Field } from "../Field/Field";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";

const meta: Meta = {
  title: "Components/Combobox",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * Data
 * ============================================================ */

const fruits = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Clementine",
  "Coconut",
  "Date",
  "Dragon fruit",
  "Fig",
  "Grape",
  "Guava",
  "Kiwi",
  "Lemon",
  "Lime",
  "Lychee",
  "Mango",
  "Melon",
  "Nectarine",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Pineapple",
  "Plum",
  "Pomegranate",
  "Raspberry",
  "Strawberry",
];

interface Person {
  id: string;
  label: string;
  email: string;
  team: string;
}

const people: Person[] = [
  { id: "ada", label: "Ada Lovelace", email: "ada@example.com", team: "Research" },
  { id: "alan", label: "Alan Turing", email: "alan@example.com", team: "Research" },
  { id: "grace", label: "Grace Hopper", email: "grace@example.com", team: "Platform" },
  { id: "katherine", label: "Katherine Johnson", email: "katherine@example.com", team: "Platform" },
  { id: "margaret", label: "Margaret Hamilton", email: "margaret@example.com", team: "Apollo" },
  { id: "dorothy", label: "Dorothy Vaughan", email: "dorothy@example.com", team: "Apollo" },
  { id: "radia", label: "Radia Perlman", email: "radia@example.com", team: "Networks" },
];

interface Country {
  value: string;
  label: string;
}

const countryGroups: { value: string; items: Country[] }[] = [
  {
    value: "Europe",
    items: [
      { value: "cy", label: "Cyprus" },
      { value: "fr", label: "France" },
      { value: "de", label: "Germany" },
      { value: "gr", label: "Greece" },
      { value: "ie", label: "Ireland" },
      { value: "pt", label: "Portugal" },
      { value: "es", label: "Spain" },
      { value: "gb", label: "United Kingdom" },
    ],
  },
  {
    value: "Americas",
    items: [
      { value: "ar", label: "Argentina" },
      { value: "br", label: "Brazil" },
      { value: "ca", label: "Canada" },
      { value: "mx", label: "México" },
      { value: "us", label: "United States" },
    ],
  },
  {
    value: "Asia",
    items: [
      { value: "in", label: "India" },
      { value: "jp", label: "Japan" },
      { value: "kr", label: "South Korea" },
      { value: "vn", label: "Việt Nam" },
    ],
  },
];

const languages = ["TypeScript", "JavaScript", "Rust", "Go", "Python", "Kotlin", "Swift", "Elixir"];

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

/**
 * An open combobox for showcase stories. The popup portals into a local
 * container so it inherits the surrounding `data-theme` and `data-density`,
 * and doesn't flip or clip in screenshots.
 */
/**
 * Showcase stories can't hover a row for the screenshot, so they pass
 * `data-highlighted` to draw one row in its highlighted state. Real lists
 * never need this: Base UI sets it on hover and keyboard navigation.
 */
const preview = { "data-highlighted": "" } as Record<string, string>;

function OpenCombobox<V = string, M extends boolean | undefined = false>({
  label,
  minHeight = 300,
  content,
  input,
  dir,
  highlightIndex,
  disabledIndex,
  className,
  ...root
}: Omit<ComboboxRootProps<V, M>, "children"> & {
  className?: string;
  /** Draw this row highlighted (screenshots). */
  highlightIndex?: number;
  /** Render this row disabled (to review that hovering it shows nothing). */
  disabledIndex?: number;
  label: string;
  minHeight?: number;
  content?: Omit<React.ComponentProps<typeof Combobox.Content>, "children"> & {
    children?: React.ReactNode;
  };
  input?: React.ComponentProps<typeof Combobox.Input>;
  dir?: "ltr" | "rtl";
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} dir={dir} style={{ minHeight }} className={className}>
      {container && (
        <Combobox.Root defaultOpen {...(root as ComboboxRootProps<V, M>)}>
          <Field.Root>
            <Field.Label>{label}</Field.Label>
            <Combobox.Input placeholder="Search…" {...input} />
          </Field.Root>
          <Combobox.Content
            {...content}
            portalProps={{ container }}
            positionerProps={{
              collisionAvoidance: { side: "none", align: "none", fallbackAxisSide: "none" },
            }}
            className={"[--available-height:100dvh] " + (content?.className ?? "")}
          >
            {content?.children ??
              (highlightIndex !== undefined ? (
                <Combobox.List>
                  {(item: V, index: number) => (
                    <Combobox.Item
                      key={index}
                      value={item}
                      disabled={index === disabledIndex}
                      {...(index === highlightIndex ? preview : {})}
                    />
                  )}
                </Combobox.List>
              ) : undefined)}
          </Combobox.Content>
        </Combobox.Root>
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
      <Combobox.Root items={fruits}>
        <Field.Root>
          <Field.Label>Favourite fruit</Field.Label>
          <Combobox.Input placeholder="e.g. Mango" />
          <Field.Description>Start typing to filter the list.</Field.Description>
        </Field.Root>
        <Combobox.Content />
      </Combobox.Root>
    </div>
  ),
};

/* ============================================================
 * ITEMS — icon, description, trailing, indicator position, match highlighting
 * ============================================================ */

export const Items: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Icon, description, trailing</Label>
        <OpenCombobox
          label="Assignee"
          items={people}
          defaultValue={people[1]}
          defaultInputValue="Alan Turing"
          minHeight={440}
          content={{
            children: (
              <Combobox.List>
                {(person: Person) => (
                  <Combobox.Item
                    key={person.id}
                    value={person}
                    icon={<User />}
                    description={person.email}
                    trailing={<Badge size="sm">{person.team}</Badge>}
                  >
                    {person.label}
                  </Combobox.Item>
                )}
              </Combobox.List>
            ),
          }}
        />
      </div>
      <div>
        <Label>Match highlighting, check at the end</Label>
        <OpenCombobox
          label="Fruit"
          items={fruits}
          highlightMatches
          indicatorPosition="end"
          defaultInputValue="be"
          minHeight={360}
        />
      </div>
    </div>
  ),
};

/* ============================================================
 * GROUPS — group labels, sticky labels, accent-insensitive filtering
 * ============================================================ */

export const Groups: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Grouped</Label>
        <OpenCombobox<Country>
          label="Country"
          items={countryGroups as never}
          minHeight={380}
          content={{ maxHeight: "18rem" }}
        />
      </div>
      <div>
        <Label>Sticky labels, “mexico” finds México</Label>
        <OpenCombobox<Country>
          label="Country"
          items={countryGroups as never}
          minHeight={380}
          content={{ maxHeight: "12rem", stickyGroupLabels: true }}
        />
      </div>
    </div>
  ),
};

/* ============================================================
 * MULTIPLE — chips, select all, limits, fixed, reorder
 * ============================================================ */

function MultipleDemo(
  props: Partial<ComboboxRootProps<string, true>> & { label: string; description?: string },
) {
  const { label, description, ...root } = props;
  return (
    <Combobox.Root multiple items={languages} {...root}>
      <Field.Root>
        <Field.Label>{label}</Field.Label>
        <Combobox.Input placeholder="Add a language" />
        {description && <Field.Description>{description}</Field.Description>}
      </Field.Root>
      <Combobox.Content />
    </Combobox.Root>
  );
}

export const Multiple: Story = {
  render: () => (
    <div className="grid gap-x-8 gap-y-10 sm:max-w-3xl sm:grid-cols-2">
      <MultipleDemo
        label="Chips"
        defaultValue={["TypeScript", "Rust"]}
        description="Backspace removes the last chip."
      />
      <MultipleDemo
        label="Select all"
        selectAll
        defaultValue={["Go"]}
        description="Selects every visible result."
      />
      <MultipleDemo
        label="Max 3, hide picked"
        maxSelected={3}
        hidePicked
        defaultValue={["TypeScript", "Go"]}
        description="Other options are disabled at the limit."
      />
      <MultipleDemo
        label="Fixed and reorderable"
        reorderable
        isItemFixed={(item) => item === "TypeScript"}
        defaultValue={["TypeScript", "Rust", "Go"]}
        description="TypeScript can't be removed. Alt+Shift+←/→ or drag to reorder."
      />
      <MultipleDemo
        label="Collapse after 2"
        maxVisibleChips={2}
        defaultValue={["TypeScript", "Rust", "Go", "Python", "Swift"]}
        description="All chips show while you edit."
      />
      <MultipleDemo
        label="Collapse to fit"
        maxVisibleChips="responsive"
        defaultValue={["TypeScript", "JavaScript", "Rust", "Go", "Python", "Kotlin"]}
        description="Fits as many as one line allows."
      />
      <MultipleDemo
        label="Count"
        selectionDisplay="count"
        defaultValue={["TypeScript", "Rust", "Go"]}
        description="One tag; its × clears everything."
      />
      <MultipleDemo
        label="Selected first"
        selectedFirst
        defaultValue={["Swift", "Elixir"]}
        description="Selected items move to the top when the list opens."
      />
    </div>
  ),
};

/* ============================================================
 * CREATABLE and TAGS
 * ============================================================ */

function CreatableDemo() {
  const [items, setItems] = React.useState(["Bug", "Feature", "Docs"]);
  return (
    <Combobox.Root
      items={items}
      creatable
      onCreate={(query) => {
        setItems((prev) => [...prev, query]);
        return query;
      }}
    >
      <Field.Root>
        <Field.Label>Label</Field.Label>
        <Combobox.Input placeholder="Pick or create" />
        <Field.Description>Type a new name to create it.</Field.Description>
      </Field.Root>
      <Combobox.Content />
    </Combobox.Root>
  );
}

function TagsDemo() {
  const [items, setItems] = React.useState(["react", "base-ui", "tailwind"]);
  return (
    <Combobox.Root
      multiple
      items={items}
      creatable
      delimiters={[",", ";"]}
      defaultValue={["react"]}
      onCreate={(query) => {
        setItems((prev) => (prev.includes(query) ? prev : [...prev, query]));
        return query;
      }}
    >
      <Field.Root>
        <Field.Label>Tags</Field.Label>
        <Combobox.Input placeholder="Add tags" />
        <Field.Description>
          Press Enter or comma to add. Paste “a, b, c” to add several.
        </Field.Description>
      </Field.Root>
      <Combobox.Content />
    </Combobox.Root>
  );
}

export const Creatable: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-3xl sm:grid-cols-2">
      <CreatableDemo />
      <TagsDemo />
    </div>
  ),
};

/* ============================================================
 * ASYNC — loading, error + retry, load more
 * ============================================================ */

const allCities = Array.from({ length: 120 }, (_, i) => `City ${String(i + 1).padStart(3, "0")}`);

function AsyncDemo() {
  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const failNext = React.useRef(false);
  const timer = React.useRef<number>(0);

  const load = React.useCallback((q: string, nextPage: number) => {
    window.clearTimeout(timer.current);
    setLoading(true);
    setError(false);
    timer.current = window.setTimeout(() => {
      if (failNext.current) {
        failNext.current = false;
        setLoading(false);
        setError(true);
        return;
      }
      const matches = allCities.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
      setItems(matches.slice(0, nextPage * 20));
      setPage(nextPage);
      setLoading(false);
    }, 700);
  }, []);

  const total = allCities.filter((c) => c.toLowerCase().includes(query.toLowerCase())).length;

  return (
    <div className="flex flex-col gap-3 sm:max-w-sm">
      <Combobox.Root
        items={items}
        filter={null}
        loading={loading}
        error={error}
        onRetry={() => load(query, page)}
        hasMore={items.length < total}
        onLoadMore={() => load(query, page + 1)}
        inputValue={query}
        onInputValueChange={(value) => {
          setQuery(value);
          load(value, 1);
        }}
        onOpenChange={(open) => {
          if (open && items.length === 0) load(query, 1);
        }}
      >
        <Field.Root>
          <Field.Label>City</Field.Label>
          <Combobox.Input placeholder="Search cities" startIcon={<MagnifyingGlass />} />
          <Field.Description>Scroll to the end to load 20 more.</Field.Description>
        </Field.Root>
        <Combobox.Content />
      </Combobox.Root>
      <div>
        <Button size="sm" variant="outline" onClick={() => (failNext.current = true)}>
          Make the next request fail
        </Button>
      </div>
    </div>
  );
}

export const Async: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <AsyncDemo />
      <div className="flex flex-col gap-8">
        <div>
          <Label>Loading</Label>
          <OpenCombobox label="City" items={[] as string[]} loading minHeight={160} />
        </div>
        <div>
          <Label>Error</Label>
          <OpenCombobox label="City" items={allCities} error minHeight={160} />
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * VIRTUALIZED — 10,000 items
 * ============================================================ */

const manyItems = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

export const Virtualized: Story = {
  render: () => (
    <div className="sm:max-w-sm">
      <Combobox.Root items={manyItems} virtualized>
        <Field.Root>
          <Field.Label>Search 10,000 items</Field.Label>
          <Combobox.Input placeholder="e.g. 4242" />
        </Field.Root>
        <Combobox.Content>
          <Combobox.VirtualList />
        </Combobox.Content>
      </Combobox.Root>
    </div>
  ),
};

/* ============================================================
 * FILTERING — starts with, limit, minimum characters
 * ============================================================ */

export const Filtering: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-3">
      <div>
        <Label>Starts with</Label>
        <OpenCombobox label="Fruit" items={fruits} matchFrom="start" defaultInputValue="p" />
      </div>
      <div>
        <Label>Limit 5</Label>
        <OpenCombobox label="Fruit" items={fruits} limit={5} />
      </div>
      <div>
        <Label>Minimum 2 characters</Label>
        <OpenCombobox<Country>
          label="Country"
          items={countryGroups as never}
          minLength={2}
          defaultInputValue="g"
          minHeight={160}
        />
      </div>
    </div>
  ),
};

/* ============================================================
 * BEHAVIOUR — auto highlight, open on click, commit on blur, blur on select
 * ============================================================ */

function BehaviourDemo({
  label,
  description,
  ...root
}: Partial<ComboboxRootProps<string>> & { label: string; description: string }) {
  return (
    <Combobox.Root items={fruits} {...root}>
      <Field.Root>
        <Field.Label>{label}</Field.Label>
        <Combobox.Input placeholder="Search…" />
        <Field.Description>{description}</Field.Description>
      </Field.Root>
      <Combobox.Content />
    </Combobox.Root>
  );
}

export const Behaviour: Story = {
  render: () => (
    <div className="grid gap-x-8 gap-y-10 sm:max-w-3xl sm:grid-cols-2">
      <BehaviourDemo
        label="Auto highlight"
        autoHighlight
        description="The first match is highlighted, so Enter picks it."
      />
      <BehaviourDemo
        label="Open on click"
        openOnInputClick
        description="Clicking the field opens the list."
      />
      <BehaviourDemo
        label="Commit on blur"
        autoHighlight
        autoSelectOnBlur
        description="Tab away to pick the highlighted option (GOV.UK confirmOnBlur)."
      />
      <BehaviourDemo
        label="Blur on touch select"
        blurOnSelect="touch"
        description="Hides the on-screen keyboard after a tap."
      />
    </div>
  ),
};

/* ============================================================
 * SELECT PANEL — input inside the popup, apply / cancel footer (Primer)
 * ============================================================ */

function SelectPanelDemo() {
  const [applied, setApplied] = React.useState<string[]>(["TypeScript"]);
  const [draft, setDraft] = React.useState<string[]>(applied);
  const [open, setOpen] = React.useState(false);
  return (
    <Combobox.Root
      multiple
      items={languages}
      value={draft}
      onValueChange={setDraft}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setDraft(applied);
      }}
    >
      <Field.Root>
        <Field.Label>Languages</Field.Label>
        <Combobox.Trigger
          render={<Button variant="outline" className="w-full justify-between sm:w-72" />}
        >
          <span className="truncate">
            {applied.length ? applied.join(", ") : "Choose languages"}
          </span>
        </Combobox.Trigger>
      </Field.Root>
      <Combobox.Content
        className="w-80"
        header={
          <Combobox.Input
            placeholder="Filter languages"
            showTrigger={false}
            aria-label="Filter languages"
          />
        }
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setApplied(draft);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </>
        }
      />
    </Combobox.Root>
  );
}

export const SelectPanel: Story = {
  render: () => <SelectPanelDemo />,
};

/* ============================================================
 * FULL SCREEN ON MOBILE
 * ============================================================ */

export const FullScreenOnMobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <div className="sm:max-w-sm">
      <Combobox.Root items={countryGroups as never} fullScreenOnMobile fullScreenTitle="Country">
        <Field.Root>
          <Field.Label>Country</Field.Label>
          <Combobox.Input placeholder="Choose a country" startIcon={<GlobeHemisphereWest />} />
          <Field.Description>Below 640px wide, the list opens full screen.</Field.Description>
        </Field.Root>
        <Combobox.Content />
      </Combobox.Root>
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
          <OpenCombobox
            label="Fruit"
            size={size}
            items={fruits.slice(0, 5)}
            defaultValue="Apricot"
            defaultInputValue="Apricot"
            minHeight={300}
          />
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
  input,
  ...root
}: Partial<ComboboxRootProps<string>> & {
  label: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  input?: React.ComponentProps<typeof Combobox.Input>;
}) {
  return (
    <Combobox.Root items={fruits} {...root}>
      <Field.Root invalid={invalid} disabled={root.disabled}>
        <Field.Label>{label}</Field.Label>
        <Combobox.Input placeholder="Choose a fruit" {...input} />
        {description && <Field.Description>{description}</Field.Description>}
        {error && <Field.Error match>{error}</Field.Error>}
      </Field.Root>
      <Combobox.Content />
    </Combobox.Root>
  );
}

const StatesGrid = () => (
  <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
    <StateField label="Default" />
    <StateField label="Filled" defaultValue="Mango" defaultInputValue="Mango" />
    <StateField
      label="Valid"
      valid
      defaultValue="Mango"
      defaultInputValue="Mango"
      description="Looks good."
    />
    <StateField
      label="Warning"
      warning
      defaultValue="Durian"
      defaultInputValue="Durian"
      description="Out of season."
    />
    <StateField label="Error" invalid error="Choose a fruit from the list." />
    <StateField label="Disabled" disabled defaultValue="Mango" defaultInputValue="Mango" />
    <StateField label="Read-only" readOnly defaultValue="Mango" defaultInputValue="Mango" />
    <StateField label="Loading" loading />
    <StateField label="Required" required input={{ required: true }} />
    <MultiStateField label="Multiple, valid" valid description="Looks good." />
    <MultiStateField label="Multiple, warning" warning description="Rust is new to the team." />
    <MultiStateField label="Multiple, error" invalid error="Choose at most one language." />
    <MultiStateField label="Multiple, read-only" readOnly />
    <MultiStateField label="Multiple, disabled" disabled />
  </div>
);

function MultiStateField({
  label,
  description,
  error,
  invalid,
  ...root
}: Partial<ComboboxRootProps<string, true>> & {
  label: string;
  description?: string;
  error?: string;
  invalid?: boolean;
}) {
  return (
    <Combobox.Root
      multiple
      items={languages}
      defaultValue={["TypeScript", "Rust"]}
      {...(root as ComboboxRootProps<string, true>)}
    >
      <Field.Root invalid={invalid} disabled={root.disabled}>
        <Field.Label>{label}</Field.Label>
        <Combobox.Input />
        {description && <Field.Description>{description}</Field.Description>}
        {error && <Field.Error match>{error}</Field.Error>}
      </Field.Root>
      <Combobox.Content />
    </Combobox.Root>
  );
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-10 sm:max-w-3xl">
      <StatesGrid />
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <Label>Open, subtle highlight (Banana disabled)</Label>
          <OpenCombobox
            label="Fruit"
            items={fruits.slice(0, 6)}
            defaultValue="Apricot"
            highlightIndex={2}
            disabledIndex={3}
          />
        </div>
        <div>
          <Label>Open, solid highlight (Banana disabled)</Label>
          <OpenCombobox
            label="Fruit"
            items={fruits.slice(0, 6)}
            defaultValue="Apricot"
            highlight="solid"
            highlightIndex={2}
            disabledIndex={3}
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
          <OpenCombobox
            label="Languages"
            multiple
            items={languages.slice(0, 5)}
            defaultValue={["TypeScript"]}
            highlightIndex={1}
            minHeight={320}
          />
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
    <OpenCombobox
      className="sm:max-w-sm"
      dir="rtl"
      label="لغات"
      multiple
      items={languages}
      defaultValue={["TypeScript", "Rust"]}
      indicatorPosition="end"
      input={{ placeholder: "ابحث…" }}
    />
  ),
};

/* ============================================================
 * THEMES — every state and highlight style in each theme
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
            <div className="grid gap-8 md:grid-cols-3">
              <OpenCombobox
                label="Subtle"
                items={people}
                defaultValue={people[0]}
                minHeight={380}
                content={{
                  children: (
                    <Combobox.List>
                      {(p: Person, i: number) => (
                        <Combobox.Item
                          key={p.id}
                          value={p}
                          icon={<User />}
                          description={p.email}
                          {...(i === 2 ? preview : {})}
                        >
                          {p.label}
                        </Combobox.Item>
                      )}
                    </Combobox.List>
                  ),
                }}
              />
              <OpenCombobox
                label="Solid"
                highlight="solid"
                items={people}
                defaultValue={people[0]}
                minHeight={380}
                content={{
                  children: (
                    <Combobox.List>
                      {(p: Person, i: number) => (
                        <Combobox.Item
                          key={p.id}
                          value={p}
                          icon={<User />}
                          description={p.email}
                          {...(i === 2 ? preview : {})}
                        >
                          {p.label}
                        </Combobox.Item>
                      )}
                    </Combobox.List>
                  ),
                }}
              />
              <OpenCombobox
                label="Multiple, select all"
                multiple
                selectAll
                items={languages.slice(0, 6)}
                defaultValue={["TypeScript", "Rust"]}
                highlightIndex={2}
                minHeight={380}
              />
              <OpenCombobox
                label="Load error"
                items={fruits}
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

// Keep imports used in some stories only
void Buildings;
void Code;
void FileTs;
