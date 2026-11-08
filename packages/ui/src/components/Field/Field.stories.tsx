import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./Field";
import { Input } from "../Input/Input";

const meta: Meta = {
  title: "Components/Field",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * STATES — all in one view
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Field.Root>
        <Field.Label>Default</Field.Label>
        <Input type="text" placeholder="Enter text..." />
        <Field.Description>Hint text goes here.</Field.Description>
      </Field.Root>

      <Field.Root>
        <Field.Label required>Required</Field.Label>
        <Input type="text" placeholder="This field is required" required />
        <Field.Description>As it appears on your ID.</Field.Description>
      </Field.Root>

      <Field.Root invalid>
        <Field.Label>Single error</Field.Label>
        <Input type="email" defaultValue="not-an-email" />
        <Field.Error>Please enter a valid email address.</Field.Error>
      </Field.Root>

      <Field.Root invalid>
        <Field.Label>Multiple errors</Field.Label>
        <Input type="password" defaultValue="ab" />
        <Field.Error
          errors={[
            "Must be at least 8 characters",
            "Must contain a number",
            "Must contain an uppercase letter",
          ]}
        />
      </Field.Root>

      <Field.Root disabled>
        <Field.Label>Disabled</Field.Label>
        <Input type="text" placeholder="Cannot edit" />
        <Field.Description>This field is managed by your organisation.</Field.Description>
      </Field.Root>

      <Field.Root>
        <Field.Label>Read-only</Field.Label>
        <Input type="text" defaultValue="usr_a1b2c3d4" readOnly />
        <Field.Description>Your account ID cannot be changed.</Field.Description>
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * PURPOSE — semantic field sizing
 * ============================================================ */

export const Purpose: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="text-fg-muted text-xs">
        Each field auto-sizes based on expected input length. Full-width on mobile, constrained on
        desktop.
      </p>

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
            <Input purpose="phone" />
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
        <div className="flex flex-wrap gap-4">
          <Field.Root>
            <Field.Label>Card number</Field.Label>
            <Input purpose="card-number" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Expiry</Field.Label>
            <Input purpose="card-expiry" />
          </Field.Root>
          <Field.Root>
            <Field.Label>CVV</Field.Label>
            <Input purpose="cvv" />
          </Field.Root>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">Auth</p>
        <div className="flex flex-wrap gap-4">
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input purpose="password" />
          </Field.Root>
          <Field.Root>
            <Field.Label>OTP</Field.Label>
            <Input purpose="otp" />
          </Field.Root>
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * ORIENTATION
 * ============================================================ */

export const Orientation: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Vertical (default)
        </p>
        <Field.Root>
          <Field.Label required>Email address</Field.Label>
          <Input type="email" placeholder="you@example.com" />
          <Field.Description>We will never share your email.</Field.Description>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Horizontal (responsive — stacks on mobile, side-by-side on sm+)
        </p>
        <p className="text-fg-muted mb-4 text-xs">Resize the viewport to see it switch.</p>
        <div className="flex flex-col gap-6">
          <Field.Root orientation="horizontal">
            <Field.Label required>Email</Field.Label>
            <Field.Content>
              <Input type="email" placeholder="you@example.com" />
              <Field.Description>We will never share your email.</Field.Description>
            </Field.Content>
          </Field.Root>

          <Field.Root orientation="horizontal">
            <Field.Label>Full name</Field.Label>
            <Field.Content>
              <Input type="text" placeholder="Jane Smith" />
            </Field.Content>
          </Field.Root>

          <Field.Root orientation="horizontal" invalid>
            <Field.Label>Password</Field.Label>
            <Field.Content>
              <Input type="password" defaultValue="ab" />
              <Field.Error errors={["Must be at least 8 characters", "Must contain a number"]} />
            </Field.Content>
          </Field.Root>
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * SEPARATOR
 * ============================================================ */

export const WithSeparator: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field.Root>
        <Field.Label required>First name</Field.Label>
        <Input type="text" placeholder="Jane" />
      </Field.Root>

      <Field.Root>
        <Field.Label required>Last name</Field.Label>
        <Input type="text" placeholder="Smith" />
      </Field.Root>

      <Field.Separator label="Contact details" />

      <Field.Root>
        <Field.Label required>Email</Field.Label>
        <Input type="email" placeholder="you@example.com" />
      </Field.Root>

      <Field.Root>
        <Field.Label>Phone</Field.Label>
        <Input type="tel" placeholder="+44 7700 000000" />
        <Field.Description>Optional.</Field.Description>
      </Field.Root>
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
          <div className="flex flex-col gap-4">
            <Field.Root>
              <Field.Label required>Email address</Field.Label>
              <Input type="email" placeholder="you@example.com" />
              <Field.Description>We will never share your email.</Field.Description>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>With error</Field.Label>
              <Input type="text" defaultValue="Bad" />
              <Field.Error>Something went wrong.</Field.Error>
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * OPTIONAL — marking the minority
 * ============================================================ */

export const OptionalFields: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <p className="text-fg-muted text-xs">
        GOV.UK pattern: when most fields are required, mark the optional ones instead of starring
        every required field. Use <code>optional</code> on Field.Label.
      </p>
      <Field.Root>
        <Field.Label>Full name</Field.Label>
        <Input purpose="name" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input purpose="email" />
      </Field.Root>
      <Field.Root>
        <Field.Label optional>Phone</Field.Label>
        <Input.Phone />
        <Field.Description>
          We will only call if there is a problem with your order.
        </Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label optional>Notes</Field.Label>
        <Input placeholder="Anything else we should know?" />
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * CHARACTER COUNT — for constrained inputs
 * ============================================================ */

function CharacterCountDemo() {
  const [value, setValue] = useState("");
  const max = 140;
  return (
    <Field.Root>
      <div className="flex items-baseline justify-between">
        <Field.Label>Bio</Field.Label>
        <Field.CharacterCount current={value.length} max={max} />
      </div>
      <Input
        placeholder="Tell us about yourself..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Field.Description>A short description for your profile.</Field.Description>
    </Field.Root>
  );
}

export const CharacterCount: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <CharacterCountDemo />
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Over limit</p>
        <Field.Root>
          <div className="flex items-baseline justify-between">
            <Field.Label>Username</Field.Label>
            <Field.CharacterCount current={25} max={20} />
          </div>
          <Input defaultValue="georgegeorgegeorge123" />
        </Field.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * GROUP — consistent field stacking
 * ============================================================ */

export const FieldGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-10 sm:max-w-md">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Default spacing
        </p>
        <Field.Group>
          <Field.Root>
            <Field.Label>First name</Field.Label>
            <Input purpose="given-name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Last name</Field.Label>
            <Input purpose="family-name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input purpose="email" />
          </Field.Root>
        </Field.Group>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Tight spacing
        </p>
        <Field.Group spacing="tight">
          <Field.Root>
            <Field.Label>Card number</Field.Label>
            <Input.Card />
          </Field.Root>
          <div className="flex gap-4">
            <Field.Root>
              <Field.Label>Expiry</Field.Label>
              <Input.Card field="expiry" />
            </Field.Root>
            <Field.Root>
              <Field.Label>CVV</Field.Label>
              <Input.Card field="cvv" />
            </Field.Root>
          </div>
        </Field.Group>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Loose spacing
        </p>
        <Field.Group spacing="loose">
          <Field.Root>
            <Field.Label>Full name</Field.Label>
            <Input purpose="name" />
          </Field.Root>
          <Field.Separator label="Address" />
          <Field.Root>
            <Field.Label>Street address</Field.Label>
            <Input purpose="address" />
          </Field.Root>
          <Field.Root>
            <Field.Label>City</Field.Label>
            <Input purpose="city" />
          </Field.Root>
        </Field.Group>
      </div>
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
          <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="flex flex-col gap-4">
            <Field.Root>
              <Field.Label required>Email</Field.Label>
              <Input type="email" placeholder="you@example.com" />
              <Field.Description>Hint text.</Field.Description>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Error state</Field.Label>
              <Input type="email" defaultValue="bad" />
              <Field.Error>Invalid email.</Field.Error>
            </Field.Root>
            <Field.Root disabled>
              <Field.Label>Disabled</Field.Label>
              <Input type="text" placeholder="Cannot edit" />
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
