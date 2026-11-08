import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { Field } from "../Field/Field";
import { Button } from "../Button/Button";
import {
  XIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  CheckIcon,
  CopyIcon,
  CommandIcon,
  CaretDownIcon,
  PaperPlaneRightIcon,
  LinkIcon,
  AtIcon,
} from "@phosphor-icons/react";
import { Spinner } from "../Spinner/Spinner";
import { Badge } from "../Badge/Badge";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

/* ---- Shared set of inputs for consistent demos ---- */
function InputSet(props?: Record<string, unknown>) {
  return (
    <div className="flex flex-col gap-3">
      <Input placeholder="Default" aria-label="Default" {...props} />
      <Input.Phone aria-label="Phone number" {...props} />
      <Input.Card aria-label="Card number" {...props} />
      <Input.Password aria-label="Password" {...props} />
      <Input purpose="currency" prepend="£" aria-label="Price" {...props} />
    </div>
  );
}

/* ============================================================
 * PURPOSE — simple semantic types
 * ============================================================ */

export const Purpose: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Identity</p>
        <div className="flex flex-wrap gap-4">
          <Field.Root>
            <Field.Label>Full name</Field.Label>
            <Input purpose="name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>First name</Field.Label>
            <Input purpose="given-name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Last name</Field.Label>
            <Input purpose="family-name" />
          </Field.Root>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Contact</p>
        <div className="flex flex-wrap gap-4">
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input purpose="email" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Phone</Field.Label>
            <Input.Phone />
          </Field.Root>
          <Field.Root>
            <Field.Label>Website</Field.Label>
            <Input purpose="url" />
          </Field.Root>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Address</p>
        <Field.Root>
          <Field.Label>Street address</Field.Label>
          <Input purpose="address" />
        </Field.Root>
        <div className="flex flex-wrap gap-4">
          <Field.Root>
            <Field.Label>City</Field.Label>
            <Input purpose="city" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Postcode</Field.Label>
            <Input purpose="postcode" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Country</Field.Label>
            <Input purpose="country" />
          </Field.Root>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Payment</p>
        <Field.Root>
          <Field.Label>Card number</Field.Label>
          <Input.Card />
        </Field.Root>
        <div className="flex flex-wrap gap-4">
          <Field.Root>
            <Field.Label>Expiry</Field.Label>
            <Input.Card field="expiry" />
          </Field.Root>
          <Field.Root>
            <Field.Label>CVV</Field.Label>
            <Input.Card field="cvv" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Price</Field.Label>
            <Input purpose="currency" prepend="£" />
          </Field.Root>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Auth</p>
        <div className="flex flex-wrap gap-4">
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input.Password />
          </Field.Root>
          <Field.Root>
            <Field.Label>Search</Field.Label>
            <Input
              purpose="search"
              append={
                <Button
                  size="icon"
                  variant="ghost"
                  icon={<XIcon />}
                  srOnly="Clear"
                  className="h-[calc(var(--sp-control-height)-8px)] w-[calc(var(--sp-control-height)-8px)] rounded-[calc(var(--radius-DEFAULT)-4px)]"
                />
              }
            />
          </Field.Root>
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * RESTRICTIONS
 * ============================================================ */

export const Restrictions: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Field.Root>
        <Field.Label>Phone (UK only)</Field.Label>
        <Input.Phone allowedCountries={["GB"]} />
      </Field.Root>
      <Field.Root>
        <Field.Label>Phone (UK, US, FR)</Field.Label>
        <Input.Phone allowedCountries={["GB", "US", "FR"]} />
      </Field.Root>
      <Field.Root>
        <Field.Label>Card (Visa + Mastercard only)</Field.Label>
        <Input.Card allowedBrands={["visa", "mastercard"]} />
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Default</p>
        <InputSet />
      </div>
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <InputSet disabled />
      </div>
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <div className="flex flex-col gap-3">
          <Input purpose="email" defaultValue="george@example.com" valid aria-label="Email" />
          <Input purpose="url" defaultValue="southpawui.com" valid aria-label="Website" />
          <Input.Password defaultValue="Str0ngP@ss!" valid aria-label="Password" />
        </div>
      </div>
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Label>Email</Field.Label>
          <Input purpose="email" defaultValue="not-an-email" />
          <Field.Error>Please enter a valid email address.</Field.Error>
        </Field.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
            {density}
          </p>
          <InputSet />
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
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-fg-muted mb-2 text-xs">Default</p>
              <InputSet />
            </div>
            <div>
              <p className="text-fg-muted mb-2 text-xs">Disabled</p>
              <InputSet disabled />
            </div>
            <div>
              <p className="text-fg-muted mb-2 text-xs">Valid</p>
              <div className="flex flex-col gap-3">
                <Input
                  purpose="email"
                  defaultValue="george@example.com"
                  valid
                  aria-label="Valid email"
                />
                <Input.Password defaultValue="Str0ngP@ss!" valid aria-label="Valid password" />
              </div>
            </div>
            <div>
              <p className="text-fg-muted mb-2 text-xs">Error</p>
              <Field.Root invalid>
                <Field.Label>Email</Field.Label>
                <Input purpose="email" defaultValue="bad" />
                <Field.Error>Invalid email address.</Field.Error>
              </Field.Root>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * CUSTOM — showcasing composability (shadcn InputGroup parity)
 * ============================================================ */

export const Custom: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Icon addons</p>
        <div className="flex flex-col gap-3">
          <Input prepend={<MagnifyingGlassIcon />} placeholder="Search..." aria-label="Search" />
          <Input prepend={<LinkIcon />} placeholder="Enter URL" aria-label="URL" />
          <Input append={<CheckIcon />} placeholder="Validated input" aria-label="Validated" />
          <Input
            prepend={<CreditCardIcon />}
            append={<CheckIcon />}
            placeholder="Both sides"
            aria-label="Both"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Text addons</p>
        <div className="flex flex-col gap-3">
          <Input prepend="$" placeholder="0.00" aria-label="Price USD" />
          <Input append=".com" placeholder="yoursite" aria-label="Domain" />
          <Input prepend="@" placeholder="username" aria-label="Username" />
          <Input prepend="https://" append=".com" placeholder="domain" aria-label="Full domain" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Button addons</p>
        <div className="flex flex-col gap-3">
          <Input
            prepend={<MagnifyingGlassIcon />}
            append={
              <Button
                label="Search"
                className="h-[calc(var(--sp-control-height)-8px)] rounded-[calc(var(--radius-DEFAULT)-4px)]"
              />
            }
            placeholder="Search..."
            aria-label="Search with button"
          />
          <Input
            append={
              <Button
                label="Send"
                icon={<PaperPlaneRightIcon />}
                className="h-[calc(var(--sp-control-height)-8px)] rounded-[calc(var(--radius-DEFAULT)-4px)]"
              />
            }
            placeholder="Type a message..."
            aria-label="Message"
          />
          <Input
            prepend={
              <Button
                label="Filter"
                icon={<CaretDownIcon />}
                iconPosition="end"
                variant="ghost"
                className="h-[calc(var(--sp-control-height)-8px)] rounded-[calc(var(--radius-DEFAULT)-4px)]"
              />
            }
            placeholder="Search in category..."
            aria-label="Filtered search"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Command palette</p>
        <Input
          prepend={<MagnifyingGlassIcon />}
          append={
            <kbd className="text-fg-muted bg-surface-sunken pointer-events-none inline-flex h-5 items-center rounded px-1.5 font-mono text-xs">
              <CommandIcon className="mr-0.5 h-3 w-3" />K
            </kbd>
          }
          placeholder="Search..."
          aria-label="Command palette"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Saving state</p>
        <Input
          append={
            <span className="text-fg-muted flex items-center gap-1.5 text-xs">
              <Spinner /> Saving...
            </span>
          }
          defaultValue="george@example.com"
          aria-label="Saving"
          readOnly
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">With badge</p>
        <Input
          prepend={<AtIcon />}
          append={<Badge variant="info">Required</Badge>}
          placeholder="email@company.com"
          aria-label="Email with badge"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">
          Copy to clipboard
        </p>
        <Input
          defaultValue="npm install @southpawui/ui"
          readOnly
          append={
            <Button
              size="icon"
              variant="ghost"
              icon={<CopyIcon />}
              srOnly="Copy to clipboard"
              className="h-[calc(var(--sp-control-height)-8px)] w-[calc(var(--sp-control-height)-8px)] rounded-[calc(var(--radius-DEFAULT)-4px)]"
            />
          }
          aria-label="Install command"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Invite by email</p>
        <Input
          purpose="email"
          append={
            <Button
              label="Invite"
              className="h-[calc(var(--sp-control-height)-8px)] rounded-[calc(var(--radius-DEFAULT)-4px)]"
            />
          }
        />
      </div>
    </div>
  ),
};
