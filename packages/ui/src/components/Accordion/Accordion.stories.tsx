import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CreditCard, MapPin, Minus, PencilSimple, Plus, Truck } from "@phosphor-icons/react";
import { Accordion, type AccordionSize, type AccordionVariant } from "./Accordion";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Accordion",
};

export default meta;
type Story = StoryObj;

const caption = "text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide";
const variants: AccordionVariant[] = ["default", "bordered", "separated", "filled", "ghost"];
const sizes: AccordionSize[] = ["sm", "md", "lg"];

const faq = [
  {
    value: "what",
    title: "What is Southpaw UI?",
    body: "An open-source React component library built on Base UI and styled with Tailwind CSS v4.",
  },
  {
    value: "install",
    title: "How do I install it?",
    body: "Install it with your package manager of choice: pnpm add @southpawui/ui.",
  },
  {
    value: "a11y",
    title: "Is it accessible?",
    body: "Yes. Every component follows the WAI-ARIA patterns and is tested with axe and a keyboard.",
  },
];

function FAQ({
  disabledItem,
  ...props
}: React.ComponentProps<typeof Accordion.Root> & { disabledItem?: string }) {
  return (
    <Accordion.Root {...props}>
      {faq.map((item) => (
        <Accordion.Item key={item.value} value={item.value} disabled={item.value === disabledItem}>
          <Accordion.Header>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{item.body}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <FAQ defaultValue={["what"]} />
    </div>
  ),
};

/* ============================================================
 * STATES — valid / error don't apply to a disclosure
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <p className={caption}>Closed</p>
        <FAQ variant="bordered" />
      </div>
      <div>
        <p className={caption}>Open</p>
        <FAQ variant="bordered" defaultValue={["what"]} />
      </div>
      <div>
        <p className={caption}>Disabled item</p>
        <FAQ variant="bordered" disabledItem="install" />
      </div>
      <div>
        <p className={caption}>Disabled (whole accordion, one open)</p>
        <FAQ variant="bordered" disabled defaultValue={["what"]} />
      </div>
      <div>
        <p className={caption}>Keep one open (collapsible=false)</p>
        <FAQ variant="bordered" collapsible={false} defaultValue={["what"]} />
      </div>
    </div>
  ),
};

/* ============================================================
 * VARIANTS
 * ============================================================ */

export const Variants: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-md">
      {variants.map((variant) => (
        <div key={variant}>
          <p className={caption}>{variant}</p>
          <FAQ variant={variant} defaultValue={["what"]} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-md">
      {sizes.map((size) => (
        <div key={size}>
          <p className={caption}>{size}</p>
          <FAQ variant="bordered" size={size} defaultValue={["what"]} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * ICONS — position, custom, stateful, hidden, leading
 * ============================================================ */

export const Icons: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-md">
      <div>
        <p className={caption}>Chevron at the start (tree-like content)</p>
        <FAQ variant="bordered" iconPosition="start" defaultValue={["what"]} />
      </div>
      <div>
        <p className={caption}>Plus / minus (function icon, no rotation)</p>
        <Accordion.Root variant="bordered" defaultValue={["a"]}>
          {["a", "b"].map((value) => (
            <Accordion.Item key={value} value={value}>
              <Accordion.Header>
                <Accordion.Trigger
                  icon={(open) =>
                    open ? <Minus className="size-4" /> : <Plus className="size-4" />
                  }
                >
                  Section {value.toUpperCase()}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>Content for section {value.toUpperCase()}.</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
      <div>
        <p className={caption}>Hidden indicator</p>
        <Accordion.Root variant="bordered">
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger icon={null}>No chevron</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>The heading alone signals the section.</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </div>
      <div>
        <p className={caption}>Leading icons</p>
        <Accordion.Root variant="separated" defaultValue={["shipping"]}>
          <Accordion.Item value="shipping">
            <Accordion.Header>
              <Accordion.Trigger leadingIcon={<Truck className="size-5" />}>
                Shipping
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Ships from London in 2 working days.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="payment">
            <Accordion.Header>
              <Accordion.Trigger leadingIcon={<CreditCard className="size-5" />}>
                Payment
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Visa ending 4242.</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * SUMMARY + STATE TEXT — GOV.UK pattern
 * ============================================================ */

const sections = [
  {
    value: "before",
    title: "Before you apply",
    summary: "Check you're eligible and what you'll need",
    body: "You need a valid passport and proof of address dated within the last 3 months.",
  },
  {
    value: "apply",
    title: "How to apply",
    summary: "Online, by post or in person",
    body: "Applying online is the fastest way. Most applications are processed within 3 weeks.",
  },
  {
    value: "after",
    title: "After you apply",
    summary: "What happens next and how long it takes",
    body: "We'll email you a reference number. Keep it to track your application.",
  },
];

function GovSections(props: React.ComponentProps<typeof Accordion.Root>) {
  return (
    <Accordion.Root multiple stateText headingLevel={2} {...props}>
      {sections.map((s) => (
        <Accordion.Item key={s.value} value={s.value}>
          <Accordion.Header>
            <Accordion.Trigger summary={s.summary}>{s.title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{s.body}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export const SummaryAndStateText: Story = {
  render: () => (
    <div className="sm:max-w-lg">
      <GovSections defaultValue={["before"]} />
    </div>
  ),
};

/* ============================================================
 * EXPAND ALL — localisable labels
 * ============================================================ */

export const ExpandAll: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-lg">
      <div>
        <p className={caption}>Default labels</p>
        <GovSections expandAll />
      </div>
      <div>
        <p className={caption}>Localised (Welsh)</p>
        <GovSections
          expandAll={{ expandLabel: "Dangos pob adran", collapseLabel: "Cuddio pob adran" }}
          stateText={{ closed: "Dangos", open: "Cuddio" }}
          variant="bordered"
        />
      </div>
    </div>
  ),
};

/* ============================================================
 * HEADER ACTIONS
 * ============================================================ */

export const HeaderActions: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Accordion.Root variant="bordered" defaultValue={["address"]}>
        {[
          {
            value: "address",
            title: "Delivery address",
            body: "221B Baker Street, London NW1 6XE",
            icon: <MapPin className="size-5" />,
          },
          {
            value: "payment",
            title: "Payment method",
            body: "Visa ending 4242, expires 08/28",
            icon: <CreditCard className="size-5" />,
          },
        ].map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Header
              actions={
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Edit ${item.title.toLowerCase()}`}
                  icon={<PencilSimple className="size-4" />}
                />
              }
            >
              <Accordion.Trigger leadingIcon={item.icon}>{item.title}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>{item.body}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};

/* ============================================================
 * ORDERED — <ol> semantics (Carbon)
 * ============================================================ */

export const Ordered: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Accordion.Root ordered variant="bordered" multiple defaultValue={["account"]}>
        {[
          ["account", "Create an account", "Choose a username and password."],
          ["verify", "Verify your email", "Click the link we sent you."],
          ["profile", "Complete your profile", "Add a photo and a short bio."],
        ].map(([value, title, body]) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Header>
              <Accordion.Trigger>{title}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>{body}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};

/* ============================================================
 * KEYBOARD — opt-in arrow / Home / End navigation
 * ============================================================ */

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <FAQ variant="bordered" keyboardNavigation disabledItem="install" />
      <p className="text-fg-muted text-xs">
        With <code>keyboardNavigation</code>, ↑/↓ move between headers (looping) and Home/End jump
        to the first or last one, skipping disabled items. Tab still works. It&apos;s off by default
        because the APG pattern removed these keys in 2026.
      </p>
    </div>
  ),
};

/* ============================================================
 * REMEMBER — sessionStorage (GOV.UK)
 * ============================================================ */

export const RememberOpenSections: Story = {
  render: () => (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <FAQ variant="bordered" multiple rememberKey="storybook-faq" />
      <p className="text-fg-muted text-xs">
        Open a section, then reload the page: it stays open for this browser session.
      </p>
    </div>
  ),
};

/* ============================================================
 * HEADINGS + REGIONS
 * ============================================================ */

export const HeadingsAndRegions: Story = {
  render: () => (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <FAQ variant="bordered" headingLevel={2} regions defaultValue={["what"]} />
      <p className="text-fg-muted text-xs">
        Triggers sit in <code>h2</code>s and panels are labelled <code>region</code> landmarks. Both
        are opt-in: the default is <code>h3</code> with no region role, as APG advises when many
        panels can be open.
      </p>
    </div>
  ),
};

/* ============================================================
 * SKELETON
 * ============================================================ */

export const Skeleton: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-md">
      {(["default", "bordered", "separated"] as const).map((variant) => (
        <div key={variant}>
          <p className={caption}>{variant}</p>
          <Accordion.Skeleton variant={variant} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * MOTION
 * ============================================================ */

export const Motion: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <p className={caption}>animateOpacity</p>
        <FAQ variant="bordered" animateOpacity />
      </div>
      <div>
        <p className={caption}>transitionDuration=600 · ease-in-out</p>
        <FAQ
          variant="bordered"
          transitionDuration={600}
          transitionEasing="var(--sp-easing-in-out)"
        />
      </div>
      <p className="text-fg-muted text-xs">All motion is removed under prefers-reduced-motion.</p>
    </div>
  ),
};

/* ============================================================
 * FIND IN PAGE
 * ============================================================ */

export const FindInPage: Story = {
  render: () => (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <Accordion.Root variant="bordered">
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Warranty</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            The warranty covers manufacturing defects for <strong>pineapple</strong> years.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>Returns</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Return unused items within 30 days.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <p className="text-fg-muted text-xs">
        Press ⌘F / Ctrl+F and search for “pineapple”: the panel opens to reveal the match (Chromium;
        other browsers keep it closed).
      </p>
    </div>
  ),
};

/* ============================================================
 * CONTROLLED
 * ============================================================ */

function ControlledDemo() {
  const [value, setValue] = React.useState<unknown[]>(["install"]);
  return (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <div className="flex flex-wrap gap-2">
        {faq.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant="outline"
            aria-pressed={value.includes(item.value)}
            onClick={() => setValue([item.value])}
          >
            Open “{item.value}”
          </Button>
        ))}
      </div>
      <FAQ variant="bordered" value={value} onValueChange={setValue} />
      <p className="text-fg-muted text-xs">value: {JSON.stringify(value)}</p>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

/* ============================================================
 * RTL
 * ============================================================ */

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="flex flex-col gap-6 sm:max-w-md">
      {(["end", "start"] as const).map((iconPosition) => (
        <Accordion.Root
          key={iconPosition}
          variant="bordered"
          iconPosition={iconPosition}
          stateText={{ closed: "إظهار", open: "إخفاء" }}
          defaultValue={["a"]}
        >
          <Accordion.Item value="a">
            <Accordion.Header>
              <Accordion.Trigger summary="يشحن خلال يومي عمل">تفاصيل الطلب</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>رقم الطلب ١٠٤٢٣ · ٣ منتجات.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="b">
            <Accordion.Header>
              <Accordion.Trigger>طريقة الدفع</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>فيزا تنتهي بـ ٤٢٤٢.</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density} className="sm:max-w-md">
          <p className={caption}>{density}</p>
          <FAQ variant="bordered" defaultValue={["what"]} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES — every variant, size and state per theme
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <div key={variant}>
                <p className={caption}>{variant}</p>
                <FAQ variant={variant} defaultValue={["what"]} disabledItem="a11y" />
              </div>
            ))}
            <div>
              <p className={caption}>sizes</p>
              <div className="flex flex-col gap-2">
                {sizes.map((size) => (
                  <Accordion.Root key={size} variant="bordered" size={size}>
                    <Accordion.Item>
                      <Accordion.Header>
                        <Accordion.Trigger>Size {size}</Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Panel>Content</Accordion.Panel>
                    </Accordion.Item>
                  </Accordion.Root>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className={caption}>summary · state text · expand all</p>
              <GovSections expandAll variant="bordered" defaultValue={["before"]} />
            </div>
            <div>
              <p className={caption}>skeleton</p>
              <Accordion.Skeleton variant="bordered" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
