import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DescriptionList, SummaryCard } from "./DescriptionList";
import { Badge } from "../Badge/Badge";
import { Link } from "../Link/Link";
import { Skeleton } from "../Skeleton/Skeleton";
import { cn } from "../../lib/cn";

const DL = DescriptionList;

const meta: Meta<typeof DL.Root> = {
  title: "Components/DescriptionList",
  component: DL.Root,
  parameters: {
    docs: {
      description: {
        component:
          "Key–value content on a real `dl`. Add an actions column and it becomes GOV.UK’s Summary list; wrap it in `SummaryCard` for a titled card. Terms, values and actions line up across rows (a grid with subgrid rows). It stacks below `sm` by default. Missing values say “Not provided”, never a blank. Actions get the term as hidden context, so “Change” reads “Change name”. Keep borders on lists with actions: they help zoom users link a row to its action (GOV.UK).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DL.Root>;

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide", className)}>
    {children}
  </p>
);

const Frame = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full sm:max-w-2xl", className)}>{children}</div>
);

function PersonalDetails(props: React.ComponentProps<typeof DL.Root>) {
  return (
    <DL.Root {...props}>
      <DL.Item>
        <DL.Term>Name</DL.Term>
        <DL.Details>Sarah Philips</DL.Details>
        <DL.Actions>
          <DL.Action href="#name">Change</DL.Action>
        </DL.Actions>
      </DL.Item>
      <DL.Item>
        <DL.Term>Date of birth</DL.Term>
        <DL.Details>5 January 1978</DL.Details>
        <DL.Actions>
          <DL.Action href="#dob">Change</DL.Action>
        </DL.Actions>
      </DL.Item>
      <DL.Item>
        <DL.Term>Address</DL.Term>
        <DL.Details>
          <p>72 Guild Street</p>
          <p>London</p>
          <p>SE23 6FH</p>
        </DL.Details>
        <DL.Actions>
          <DL.Action href="#address">Change</DL.Action>
        </DL.Actions>
      </DL.Item>
      <DL.Item>
        <DL.Term>Contact details</DL.Term>
        <DL.Details>
          <p>07700 900457</p>
          <p>sarah.phillips@example.com</p>
        </DL.Details>
        <DL.Actions>
          <DL.Action href="#phone" context="number">
            Change phone
          </DL.Action>
          <DL.Action href="#email" context="address">
            Change email
          </DL.Action>
        </DL.Actions>
      </DL.Item>
    </DL.Root>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Frame>
      <DL.Root>
        <DL.Item>
          <DL.Term>Status</DL.Term>
          <DL.Details>
            <Badge variant="success">Active</Badge>
          </DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Plan</DL.Term>
          <DL.Details>Team, billed yearly</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Seats</DL.Term>
          <DL.Details value={12} />
        </DL.Item>
        <DL.Item>
          <DL.Term>Renews</DL.Term>
          <DL.Details value={new Date(2027, 2, 14)} />
        </DL.Item>
      </DL.Root>
    </Frame>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

/**
 * A display component has no valid, error or disabled state of its own. Shown
 * instead: a value, a missing value (with the “Enter X” link alternative), a
 * value marked valid or in error by its content, a value that can’t be changed
 * (no action), a copyable value, and a term with help.
 */
export const States: Story = {
  render: () => (
    <Frame>
      <DL.Root>
        <DL.Item>
          <DL.Term>Default</DL.Term>
          <DL.Details>Sarah Philips</DL.Details>
          <DL.Actions>
            <DL.Action href="#a">Change</DL.Action>
          </DL.Actions>
        </DL.Item>
        <DL.Item>
          <DL.Term>Empty</DL.Term>
          <DL.Details />
          <DL.Actions>
            <DL.Action href="#b">Change</DL.Action>
          </DL.Actions>
        </DL.Item>
        <DL.Item>
          <DL.Term>Empty, with a link</DL.Term>
          <DL.Details>
            <Link href="#c">Enter national insurance number</Link>
          </DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Valid</DL.Term>
          <DL.Details>
            <Badge variant="success">Verified</Badge>
          </DL.Details>
          <DL.Actions>
            <DL.Action href="#d">Change</DL.Action>
          </DL.Actions>
        </DL.Item>
        <DL.Item>
          <DL.Term>Error</DL.Term>
          <DL.Details>
            <Badge variant="danger">Payment failed</Badge>
          </DL.Details>
          <DL.Actions>
            <DL.Action href="#e">Update card</DL.Action>
          </DL.Actions>
        </DL.Item>
        <DL.Item>
          <DL.Term>Disabled (can’t change)</DL.Term>
          <DL.Details>GB12 3456</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term info="We send receipts here.">Copyable, with info</DL.Term>
          <DL.Details copyable>sarah.phillips@example.com</DL.Details>
        </DL.Item>
      </DL.Root>
    </Frame>
  ),
};

/* ============================================================
 * SUMMARY LIST (actions)
 * ============================================================ */

/** GOV.UK’s Summary list. Every “Change” has hidden context; two actions become a list. */
export const SummaryList: Story = {
  render: () => (
    <Frame>
      <PersonalDetails labelStyle="strong" />
    </Frame>
  ),
};

/** Rows without actions keep the column empty, so values and actions line up. */
export const MixedActions: Story = {
  render: () => (
    <Frame>
      <DL.Root>
        <DL.Item>
          <DL.Term>Name</DL.Term>
          <DL.Details>Sarah Philips</DL.Details>
          <DL.Actions>
            <DL.Action href="#n">Change</DL.Action>
          </DL.Actions>
        </DL.Item>
        <DL.Item>
          <DL.Term>Reference</DL.Term>
          <DL.Details>HDJ2123F</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Email</DL.Term>
          <DL.Details>sarah.phillips@example.com</DL.Details>
          <DL.Actions>
            <DL.Action href="#e">Change</DL.Action>
          </DL.Actions>
        </DL.Item>
      </DL.Root>
    </Frame>
  ),
};

/**
 * Empty values show “Not provided” by default. `hideEmpty` (on the Root, or per
 * Item) leaves those rows out instead: use it for optional details, not on a
 * check-answers page, where people need to see what they skipped (GOV.UK).
 */
export const HideEmpty: Story = {
  render: () => {
    const profile = [
      { term: "Name", details: "Sarah Philips" },
      { term: "Nickname" },
      { term: "Pronouns", value: "" },
      { term: "Email", details: "sarah.phillips@example.com" },
    ];
    return (
      <Frame className="flex flex-col gap-8">
        <div>
          <Label>Default: “Not provided”</Label>
          <DL.Root items={profile} />
        </div>
        <div>
          <Label>hideEmpty</Label>
          <DL.Root items={profile} hideEmpty />
        </div>
      </Frame>
    );
  },
};

/* ============================================================
 * SUMMARY CARD
 * ============================================================ */

export const Card: Story = {
  name: "SummaryCard",
  render: () => (
    <Frame className="flex flex-col gap-6">
      <SummaryCard
        title="University of Gloucestershire"
        actions={
          <>
            <DL.Action href="#delete">Delete choice</DL.Action>
            <DL.Action href="#withdraw">Withdraw</DL.Action>
          </>
        }
      >
        <DL.Root>
          <DL.Item>
            <DL.Term>Course</DL.Term>
            <DL.Details>
              <p>English (3DMD)</p>
              <p>PGCE with QTS full time</p>
            </DL.Details>
            <DL.Actions>
              <DL.Action href="#course">Change</DL.Action>
            </DL.Actions>
          </DL.Item>
          <DL.Item>
            <DL.Term>Location</DL.Term>
            <DL.Details>
              <p>School name</p>
              <p>Road, City, SW1 1AA</p>
            </DL.Details>
            <DL.Actions>
              <DL.Action href="#location">Change</DL.Action>
            </DL.Actions>
          </DL.Item>
        </DL.Root>
      </SummaryCard>
      <SummaryCard title="Your references" headingLevel={3}>
        <DL.Root variant="plain">
          <DL.Item>
            <DL.Term>First referee</DL.Term>
            <DL.Details>Jo Bloggs</DL.Details>
          </DL.Item>
          <DL.Item>
            <DL.Term>Second referee</DL.Term>
            <DL.Details />
          </DL.Item>
        </DL.Root>
      </SummaryCard>
    </Frame>
  ),
};

/* ============================================================
 * HEADER
 * ============================================================ */

export const WithHeader: Story = {
  render: () => (
    <Frame>
      <DL.Root>
        <DL.Header actions={<DL.Action href="#edit">Edit</DL.Action>}>Billing</DL.Header>
        <DL.Item>
          <DL.Term>Card</DL.Term>
          <DL.Details>Visa ending 4242</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Billing email</DL.Term>
          <DL.Details>accounts@example.com</DL.Details>
        </DL.Item>
      </DL.Root>
    </Frame>
  ),
};

/* ============================================================
 * VARIANTS
 * ============================================================ */

const VARIANTS = ["divided", "plain", "bordered", "striped"] as const;

export const Variants: Story = {
  render: () => (
    <Frame className="flex flex-col gap-8">
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <Label>{variant}</Label>
          <PersonalDetails variant={variant} />
        </div>
      ))}
    </Frame>
  ),
};

/** Terms are `muted` by default, so values stand out; `strong` is GOV.UK’s bold key. */
export const LabelStyles: Story = {
  render: () => (
    <Frame className="flex flex-col gap-8">
      {(["muted", "strong"] as const).map((labelStyle) => (
        <div key={labelStyle}>
          <Label>{labelStyle}</Label>
          <PersonalDetails labelStyle={labelStyle} />
        </div>
      ))}
    </Frame>
  ),
};

/* ============================================================
 * LAYOUT
 * ============================================================ */

export const Orientation: Story = {
  render: () => (
    <Frame className="flex flex-col gap-8">
      {(["responsive", "horizontal", "vertical"] as const).map((orientation) => (
        <div key={orientation}>
          <Label>{orientation}</Label>
          <PersonalDetails orientation={orientation} />
        </div>
      ))}
    </Frame>
  ),
};

/** Ant-style columns per breakpoint. `span` covers columns; `full` takes the row. */
export const Columns: Story = {
  render: () => (
    <div className="w-full">
      <DL.Root columns={{ base: 1, sm: 2, lg: 3 }} orientation="vertical">
        <DL.Item>
          <DL.Term>Order</DL.Term>
          <DL.Details>#10294</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Placed</DL.Term>
          <DL.Details value={new Date(2026, 10, 2)} />
        </DL.Item>
        <DL.Item>
          <DL.Term>Total</DL.Term>
          <DL.Details value={84.2} format={{ style: "currency", currency: "GBP" }} />
        </DL.Item>
        <DL.Item span={2}>
          <DL.Term>Delivery address</DL.Term>
          <DL.Details>72 Guild Street, London SE23 6FH</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Carrier</DL.Term>
          <DL.Details>Royal Mail</DL.Details>
        </DL.Item>
        <DL.Item span="full">
          <DL.Term>Notes</DL.Term>
          <DL.Details>Leave with the neighbour at number 74 if nobody answers.</DL.Details>
        </DL.Item>
      </DL.Root>
    </div>
  ),
};

/** `labelWidth` sets the term column; `labelAlign="end"` is logical, so it flips in RTL. */
export const LabelWidthAndAlign: Story = {
  render: () => (
    <Frame className="flex flex-col gap-8">
      <div>
        <Label>labelWidth 10rem</Label>
        <PersonalDetails orientation="horizontal" labelWidth="10rem" />
      </div>
      <div>
        <Label>labelAlign end</Label>
        <PersonalDetails orientation="horizontal" labelAlign="end" />
      </div>
    </Frame>
  ),
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" lang="ar" className="w-full sm:max-w-2xl">
      <DL.Root labels={{ empty: "غير متوفر" }}>
        <DL.Item>
          <DL.Term>الاسم</DL.Term>
          <DL.Details>سارة فيليبس</DL.Details>
          <DL.Actions>
            <DL.Action href="#n" context="الاسم">
              تغيير
            </DL.Action>
          </DL.Actions>
        </DL.Item>
        <DL.Item>
          <DL.Term>الهاتف</DL.Term>
          <DL.Details />
          <DL.Actions>
            <DL.Action href="#p" context="الهاتف">
              تغيير
            </DL.Action>
          </DL.Actions>
        </DL.Item>
      </DL.Root>
    </div>
  ),
};

/* ============================================================
 * VALUES
 * ============================================================ */

/** Several `Details` per term are alternatives (HTML spec); paragraphs get spacing; long values wrap. */
export const MultipleValues: Story = {
  render: () => (
    <Frame>
      <DL.Root>
        <DL.Item>
          <DL.Term>Phone numbers</DL.Term>
          <DL.Details>01234 567890 (home)</DL.Details>
          <DL.Details>07700 900457 (mobile)</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Address</DL.Term>
          <DL.Details>
            <p>72 Guild Street</p>
            <p>London</p>
            <p>SE23 6FH</p>
          </DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Website</DL.Term>
          <DL.Details>
            https://www.example.com/a/very/long/path/that/would/overflow/its/column/without/wrapping
          </DL.Details>
        </DL.Item>
      </DL.Root>
    </Frame>
  ),
};

/** Intl formatting from `value` + `format` (Spectrum LabeledValue), in the Root’s `locale`. */
export const Formatting: Story = {
  render: () => (
    <Frame>
      <DL.Root locale="en-GB">
        <DL.Item>
          <DL.Term>Price</DL.Term>
          <DL.Details value={1234.5} format={{ style: "currency", currency: "GBP" }} />
        </DL.Item>
        <DL.Item>
          <DL.Term>Completion</DL.Term>
          <DL.Details value={0.82} format={{ style: "percent" }} />
        </DL.Item>
        <DL.Item>
          <DL.Term>Storage</DL.Term>
          <DL.Details value={512} format={{ style: "unit", unit: "gigabyte" }} />
        </DL.Item>
        <DL.Item>
          <DL.Term>Created</DL.Term>
          <DL.Details
            value={new Date(2026, 10, 23, 14, 30)}
            format={{ dateStyle: "long", timeStyle: "short" }}
          />
        </DL.Item>
        <DL.Item>
          <DL.Term>Valid</DL.Term>
          <DL.Details value={{ start: new Date(2026, 0, 1), end: new Date(2026, 11, 31) }} />
        </DL.Item>
        <DL.Item>
          <DL.Term>Budget</DL.Term>
          <DL.Details
            value={{ start: 500, end: 1500 }}
            format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
          />
        </DL.Item>
        <DL.Item>
          <DL.Term>Languages</DL.Term>
          <DL.Details value={["English", "Welsh", "Gaelic"]} />
        </DL.Item>
      </DL.Root>
    </Frame>
  ),
};

/** Copy buttons get a tooltip (“Copy” → “Copied”), the term as hidden context, and a status message. */
export const Copyable: Story = {
  render: () => (
    <Frame>
      <DL.Root>
        <DL.Item>
          <DL.Term>Account ID</DL.Term>
          <DL.Details copyable>acct_1Nf3kL2eZvKYlo2C</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term info="Shown once. Copying gives you the full key.">API key</DL.Term>
          <DL.Details copyable="sk_live_51Nf3kL2eZvKYlo2C8x">sk_live_••••••••2C8x</DL.Details>
        </DL.Item>
      </DL.Root>
    </Frame>
  ),
};

/** The `items` shorthand renders the same markup as composition. */
export const ItemsShorthand: Story = {
  render: () => (
    <Frame>
      <DL.Root
        items={[
          { term: "Name", details: "Sarah Philips", actions: [{ href: "#n", children: "Change" }] },
          { term: "Email", details: "sarah@example.com", copyable: true },
          { term: "Phones", details: ["01234 567890", "07700 900457"] },
          { term: "Nickname" },
        ]}
      />
    </Frame>
  ),
};

/**
 * `Item loading` keeps the term and turns the value and actions into skeletons.
 * Wrap the list in `Skeleton.Group` for `aria-busy` and one “Loading” announcement.
 */
export const Loading: Story = {
  render: function LoadingStory() {
    const [loading, setLoading] = React.useState(true);
    return (
      <Frame className="flex flex-col gap-4">
        <Skeleton.Group loading={loading} label="Loading account" loadedLabel="Account loaded">
          <DL.Root>
            <DL.Item loading={loading}>
              <DL.Term>Name</DL.Term>
              <DL.Details>{loading ? null : "Sarah Philips"}</DL.Details>
              <DL.Actions>
                <DL.Action href="#n">Change</DL.Action>
              </DL.Actions>
            </DL.Item>
            <DL.Item loading={loading}>
              <DL.Term>Balance</DL.Term>
              <DL.Details
                value={loading ? null : 1204.5}
                format={{ style: "currency", currency: "GBP" }}
              />
            </DL.Item>
            <DL.Item>
              <DL.Term>Account number</DL.Term>
              <DL.Details>12345678</DL.Details>
            </DL.Item>
          </DL.Root>
        </Skeleton.Group>
        <Link
          href="#toggle"
          standalone
          onClick={(e) => {
            e.preventDefault();
            setLoading((l) => !l);
          }}
        >
          {loading ? "Finish loading" : "Load again"}
        </Link>
      </Frame>
    );
  },
};

/* ============================================================
 * SIZES & DENSITY
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <Frame className="flex flex-col gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <Label>{size}</Label>
          <PersonalDetails size={size} />
        </div>
      ))}
    </Frame>
  ),
};

/** Row padding follows the density’s control gap. */
export const Density: Story = {
  render: () => (
    <Frame className="flex flex-col gap-8">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <Label>{density}</Label>
          <PersonalDetails />
        </div>
      ))}
    </Frame>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={theme}
          className="bg-surface-base text-fg-default flex flex-col gap-6 rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <div className="grid gap-6 lg:grid-cols-2">
            {VARIANTS.map((variant, i) => (
              <div key={variant}>
                <Label>
                  {variant} · {i % 2 ? "strong" : "muted"}
                </Label>
                <DL.Root variant={variant} labelStyle={i % 2 ? "strong" : "muted"}>
                  <DL.Item>
                    <DL.Term info="Your legal name">Name</DL.Term>
                    <DL.Details>Sarah Philips</DL.Details>
                    <DL.Actions>
                      <DL.Action href={`#${theme}-${variant}-n`}>Change</DL.Action>
                    </DL.Actions>
                  </DL.Item>
                  <DL.Item>
                    <DL.Term>Email</DL.Term>
                    <DL.Details copyable>sarah@example.com</DL.Details>
                  </DL.Item>
                  <DL.Item>
                    <DL.Term>Phone</DL.Term>
                    <DL.Details />
                    <DL.Actions>
                      <DL.Action href={`#${theme}-${variant}-p`}>Add</DL.Action>
                    </DL.Actions>
                  </DL.Item>
                  <DL.Item>
                    <DL.Term>Status</DL.Term>
                    <DL.Details>
                      <Badge variant="success">Verified</Badge>{" "}
                      <Badge variant="danger">Overdue</Badge>
                    </DL.Details>
                  </DL.Item>
                </DL.Root>
              </div>
            ))}
          </div>
          <SummaryCard
            title={`Card (${theme})`}
            actions={<DL.Action href={`#${theme}-delete`}>Delete</DL.Action>}
          >
            <DL.Root size="sm">
              <DL.Item>
                <DL.Term>Course</DL.Term>
                <DL.Details>English (3DMD)</DL.Details>
                <DL.Actions>
                  <DL.Action href={`#${theme}-course`}>Change</DL.Action>
                </DL.Actions>
              </DL.Item>
            </DL.Root>
          </SummaryCard>
        </section>
      ))}
    </div>
  ),
};
