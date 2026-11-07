import type { Meta, StoryObj } from "@storybook/react";
import { Form } from "./index";
import { Input } from "../Input";
import { Button } from "../Button";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        alert("Form submitted!");
      }}
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  ),
};
