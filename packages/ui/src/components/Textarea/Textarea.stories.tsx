import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./index";
import { Field } from "../Field";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <Field.Root className="w-96">
      <Field.Label>Message</Field.Label>
      <Textarea placeholder="Write your message..." />
    </Field.Root>
  ),
};

export const WithCharacterCount: Story = {
  render: () => (
    <Field.Root className="w-96">
      <Field.Label>Bio</Field.Label>
      <Textarea
        placeholder="Tell us about yourself..."
        maxLength={200}
        defaultValue="I'm a design engineer who loves building accessible components."
      />
      <Field.Description>Maximum 200 characters.</Field.Description>
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root className="w-96" invalid>
      <Field.Label>Feedback</Field.Label>
      <Textarea defaultValue="x" />
      <Field.Error>Please provide at least 10 characters of feedback.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root className="w-96" disabled>
      <Field.Label>Notes</Field.Label>
      <Textarea placeholder="Cannot edit" />
      <Field.Description>Notes are locked after submission.</Field.Description>
    </Field.Root>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Field.Root className="w-96">
      <Field.Label>Terms</Field.Label>
      <Textarea
        readOnly
        defaultValue="By using this service, you agree to the terms and conditions outlined in the documentation. These terms are subject to change with notice."
      />
    </Field.Root>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-theme="light" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">Light</p>
        <Field.Root className="w-96">
          <Field.Label>Message</Field.Label>
          <Textarea placeholder="Write something..." maxLength={100} />
        </Field.Root>
      </div>
      <div data-theme="dark" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">Dark</p>
        <Field.Root className="w-96">
          <Field.Label>Message</Field.Label>
          <Textarea placeholder="Write something..." maxLength={100} />
        </Field.Root>
      </div>
    </div>
  ),
};
