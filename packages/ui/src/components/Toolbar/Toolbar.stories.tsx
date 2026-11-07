import type { Meta, StoryObj } from "@storybook/react";
import { Toolbar } from "./index";

const meta: Meta = {
  title: "Components/Toolbar",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Toolbar.Root aria-label="Text formatting">
      <Toolbar.Group>
        <Toolbar.Button aria-label="Bold">B</Toolbar.Button>
        <Toolbar.Button aria-label="Italic">I</Toolbar.Button>
        <Toolbar.Button aria-label="Underline">U</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Toolbar.Button aria-label="Align left">&equiv;</Toolbar.Button>
        <Toolbar.Button aria-label="Align center">&equiv;</Toolbar.Button>
        <Toolbar.Button aria-label="Align right">&equiv;</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Link href="https://example.com" target="_blank">
        Help
      </Toolbar.Link>
    </Toolbar.Root>
  ),
};

export const WithInput: StoryObj = {
  render: () => (
    <Toolbar.Root aria-label="Search toolbar">
      <Toolbar.Button aria-label="Home">H</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Input placeholder="Search..." className="w-40" />
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Settings">S</Toolbar.Button>
    </Toolbar.Root>
  ),
};
