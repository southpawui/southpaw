import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";
import { Field } from "../Field/Field";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-lg">
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <Textarea placeholder="Write your message..." />
        <Field.Description>Plain text only. No formatting.</Field.Description>
      </Field.Root>

      <Field.Root>
        <Field.Label required>Feedback</Field.Label>
        <Textarea placeholder="What could we improve?" rows={5} />
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * AUTOSIZE — grows with content
 * ============================================================ */

export const Autosize: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-lg">
      <Field.Root>
        <Field.Label>Auto-growing textarea</Field.Label>
        <Textarea autosize placeholder="Start typing — I'll grow to fit your content..." />
        <Field.Description>Uses CSS field-sizing: content. No JavaScript.</Field.Description>
      </Field.Root>

      <Field.Root>
        <Field.Label>With initial content</Field.Label>
        <Textarea autosize defaultValue={"Line one\nLine two\nLine three\nLine four\nLine five"} />
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * CHARACTER COUNT — composing with Field.CharacterCount
 * ============================================================ */

function CharacterCountDemo() {
  const [value, setValue] = useState("");
  const max = 200;
  return (
    <Field.Root>
      <div className="flex items-baseline justify-between">
        <Field.Label>Bio</Field.Label>
        <Field.CharacterCount current={value.length} max={max} />
      </div>
      <Textarea
        autosize
        placeholder="Tell us about yourself..."
        maxLength={max}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Field.Description>Displayed on your public profile.</Field.Description>
    </Field.Root>
  );
}

export const CharacterCount: Story = {
  render: () => (
    <div className="sm:max-w-lg">
      <CharacterCountDemo />
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-lg">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Default</p>
        <Field.Root>
          <Field.Label>Message</Field.Label>
          <Textarea placeholder="Write something..." />
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <Field.Root>
          <Field.Label>Bio</Field.Label>
          <Textarea
            valid
            defaultValue="I'm a design engineer who builds accessible component libraries."
          />
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Label>Feedback</Field.Label>
          <Textarea defaultValue="x" />
          <Field.Error>Please provide at least 10 characters of feedback.</Field.Error>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <Field.Root disabled>
          <Field.Label>Notes</Field.Label>
          <Textarea placeholder="Cannot edit" />
          <Field.Description>Notes are locked after submission.</Field.Description>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Read-only</p>
        <Field.Root>
          <Field.Label>Terms</Field.Label>
          <Textarea
            readOnly
            defaultValue="By using this service, you agree to the terms and conditions outlined in the documentation. These terms are subject to change with notice."
          />
        </Field.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * RESIZE — control resize behavior
 * ============================================================ */

export const Resize: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-lg">
      {(["vertical", "horizontal", "both", "none"] as const).map((r) => (
        <Field.Root key={r}>
          <Field.Label>resize=&quot;{r}&quot;</Field.Label>
          <Textarea resize={r} placeholder={`Resize: ${r}`} />
        </Field.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
            {density}
          </p>
          <div className="flex flex-col gap-4 sm:max-w-lg">
            <Field.Root>
              <Field.Label>Message</Field.Label>
              <Textarea placeholder="Write something..." />
              <Field.Description>Hint text.</Field.Description>
            </Field.Root>
          </div>
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
          <div className="flex flex-col gap-6 sm:max-w-lg">
            <Field.Root>
              <Field.Label>Default</Field.Label>
              <Textarea placeholder="Write something..." />
            </Field.Root>
            <Field.Root>
              <Field.Label>Valid</Field.Label>
              <Textarea valid defaultValue="Looks good." />
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Error</Field.Label>
              <Textarea defaultValue="x" />
              <Field.Error>Too short.</Field.Error>
            </Field.Root>
            <Field.Root disabled>
              <Field.Label>Disabled</Field.Label>
              <Textarea placeholder="Cannot edit" />
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
