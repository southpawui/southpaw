import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("renders Trigger with data-slot", () => {
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
      </Drawer.Root>,
    );
    expect(screen.getByText("Open")).toHaveAttribute("data-slot", "drawer-trigger");
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Popup>
            <Drawer.Title>Test Drawer</Drawer.Title>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Test Drawer")).toBeInTheDocument();
  });

  it("renders Popup with data-slot and size", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Popup data-testid="popup" size="lg">
            <Drawer.Title>Large</Drawer.Title>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("popup")).toHaveAttribute("data-slot", "drawer-popup");
    expect(screen.getByTestId("popup")).toHaveAttribute("data-size", "lg");
  });

  it("renders Header with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Popup>
            <Drawer.Header data-testid="header">
              <Drawer.Title>Title</Drawer.Title>
            </Drawer.Header>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "drawer-header");
  });

  it("renders Body with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Popup>
            <Drawer.Body data-testid="body">Content</Drawer.Body>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("body")).toHaveAttribute("data-slot", "drawer-body");
  });

  it("renders Footer with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Popup>
            <Drawer.Footer data-testid="footer">Actions</Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "drawer-footer");
  });

  it("renders CloseButton with aria-label", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Popup>
            <Drawer.CloseButton />
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByLabelText("Close")).toHaveAttribute("data-slot", "drawer-close-button");
  });

  it("defaults to md size", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Popup data-testid="popup">
            <Drawer.Title>Default</Drawer.Title>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("popup")).toHaveAttribute("data-size", "md");
  });
});
