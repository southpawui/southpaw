import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./Popover";

describe("Popover", () => {
  it("renders Trigger with data-slot", () => {
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
      </Popover.Root>,
    );
    expect(screen.getByText("Open")).toHaveAttribute("data-slot", "popover-trigger");
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              <Popover.Title>Test Popover</Popover.Title>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Test Popover")).toBeInTheDocument();
  });

  it("renders Popup with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup data-testid="popup">
              <Popover.Title>Test</Popover.Title>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("popup")).toHaveAttribute("data-slot", "popover-popup");
  });

  it("renders Title with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              <Popover.Title>My Title</Popover.Title>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("My Title")).toHaveAttribute("data-slot", "popover-title");
  });

  it("renders Description with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              <Popover.Title>Title</Popover.Title>
              <Popover.Description>Desc text</Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Desc text")).toHaveAttribute("data-slot", "popover-description");
  });

  it("closes via Close button", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              <Popover.Title>Test</Popover.Title>
              <Popover.Close>Done</Popover.Close>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Test")).toBeInTheDocument();
    await user.click(screen.getByText("Done"));
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
