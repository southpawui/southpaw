import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("renders Trigger with data-slot", () => {
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
      </Dialog.Root>,
    );
    expect(screen.getByText("Open")).toHaveAttribute("data-slot", "dialog-trigger");
  });

  it("opens dialog on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
  });

  it("renders Popup with data-slot and size", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup data-testid="popup" size="lg">
            <Dialog.Title>Large</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("popup")).toHaveAttribute("data-slot", "dialog-popup");
    expect(screen.getByTestId("popup")).toHaveAttribute("data-size", "lg");
  });

  it("renders Header with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Header data-testid="header">
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Header>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "dialog-header");
  });

  it("renders Body with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Body data-testid="body">Content</Dialog.Body>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("body")).toHaveAttribute("data-slot", "dialog-body");
  });

  it("renders Footer with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Footer data-testid="footer">Actions</Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "dialog-footer");
  });

  it("renders CloseButton with aria-label", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.CloseButton />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByLabelText("Close")).toHaveAttribute("data-slot", "dialog-close-button");
  });

  it("closes dialog via CloseButton", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Title>Test</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Test")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  it("renders default size (md)", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup data-testid="popup">
            <Dialog.Title>Default</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("popup")).toHaveAttribute("data-size", "md");
  });

  it.each(["sm", "md", "lg"] as const)(
    "size=%s keeps the phone inset alongside its max-width (GEO-970 regression)",
    async (size) => {
      const user = userEvent.setup();
      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup data-testid="popup" size={size}>
              <Dialog.Title>Sized</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>,
      );
      await user.click(screen.getByText("Open"));
      const cls = screen.getByTestId("popup").className;
      // tailwind-merge used to drop a max-w-[calc(100vw-2rem)] in favour of max-w-{size}.
      expect(cls).toContain("w-[calc(100%-2rem)]");
      expect(cls).toContain(`max-w-${size}`);
    },
  );

  it("size=full is edge to edge (no inset)", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup data-testid="popup" size="full">
            <Dialog.Title>Full</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    const cls = screen.getByTestId("popup").className;
    expect(cls).toContain("w-screen");
    expect(cls).not.toContain("w-[calc(100%-2rem)]");
  });
});
