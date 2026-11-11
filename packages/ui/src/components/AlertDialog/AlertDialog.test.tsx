import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertDialog } from "./AlertDialog";

describe("AlertDialog", () => {
  it("renders Trigger with data-slot", () => {
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Open</AlertDialog.Trigger>
      </AlertDialog.Root>,
    );
    expect(screen.getByText("Open")).toHaveAttribute("data-slot", "alert-dialog-trigger");
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Open</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Popup>
            <AlertDialog.Title>Confirm</AlertDialog.Title>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("renders Popup with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Open</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Popup data-testid="popup">
            <AlertDialog.Title>Test</AlertDialog.Title>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("popup")).toHaveAttribute("data-slot", "alert-dialog-popup");
  });

  it("renders Header with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Open</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Popup>
            <AlertDialog.Header data-testid="header">
              <AlertDialog.Title>Test</AlertDialog.Title>
            </AlertDialog.Header>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "alert-dialog-header");
  });

  it("renders Footer with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Open</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Popup>
            <AlertDialog.Footer data-testid="footer">Actions</AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "alert-dialog-footer");
  });

  it("closes via Close button", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Open</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Popup>
            <AlertDialog.Title>Test</AlertDialog.Title>
            <AlertDialog.Close>Confirm</AlertDialog.Close>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Test")).toBeInTheDocument();
    await user.click(screen.getByText("Confirm"));
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  it("renders Description with data-slot", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Open</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Popup>
            <AlertDialog.Title>Test</AlertDialog.Title>
            <AlertDialog.Description>Warning text</AlertDialog.Description>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Warning text")).toHaveAttribute(
      "data-slot",
      "alert-dialog-description",
    );
  });
});
