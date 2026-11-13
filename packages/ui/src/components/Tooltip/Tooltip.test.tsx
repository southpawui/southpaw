import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";

function Basic(props: {
  type?: "label" | "description";
  touch?: boolean;
  variant?: "neutral" | "info" | "success" | "danger";
  showIcon?: boolean;
  arrow?: boolean;
  text?: string;
}) {
  return (
    <Tooltip.Root type={props.type} touch={props.touch}>
      <Tooltip.Trigger>Save</Tooltip.Trigger>
      <Tooltip.Content variant={props.variant} showIcon={props.showIcon} arrow={props.arrow}>
        {props.text ?? "Save your changes"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

const popup = () => document.querySelector<HTMLElement>('[data-slot="tooltip-popup"]')!;

afterEach(() => {
  vi.useRealTimers();
});

describe("Tooltip", () => {
  it("renders Trigger with data-slot", () => {
    render(<Basic />);
    expect(screen.getByText("Save")).toHaveAttribute("data-slot", "tooltip-trigger");
  });

  it("keeps the popup mounted (hidden) with role=tooltip so ARIA references resolve", () => {
    render(<Basic />);
    const el = popup();
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("role", "tooltip");
    expect(el).not.toBeVisible();
  });

  it("links trigger to popup with aria-describedby by default", () => {
    render(<Basic />);
    const trigger = screen.getByText("Save");
    expect(trigger).toHaveAttribute("aria-describedby", popup().id);
    expect(trigger).toHaveAccessibleDescription("Save your changes");
  });

  it("uses aria-labelledby when type='label'", () => {
    render(
      <Tooltip.Root type="label">
        <Tooltip.Trigger>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content>Settings</Tooltip.Content>
      </Tooltip.Root>,
    );
    const trigger = document.querySelector('[data-slot="tooltip-trigger"]')!;
    expect(trigger).toHaveAttribute("aria-labelledby", popup().id);
    expect(trigger).not.toHaveAttribute("aria-describedby");
    expect(screen.getByRole("button", { name: "Settings" })).toBe(trigger);
  });

  it("generates unique popup ids per tooltip", () => {
    render(
      <>
        <Basic text="One" />
        <Basic text="Two" />
      </>,
    );
    const ids = Array.from(document.querySelectorAll('[data-slot="tooltip-popup"]')).map(
      (el) => el.id,
    );
    expect(new Set(ids).size).toBe(2);
  });

  it("opens instantly on keyboard focus and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    expect(popup()).toHaveAttribute("data-open");
    expect(popup()).toBeVisible();
    await user.keyboard("{Escape}");
    expect(popup()).not.toHaveAttribute("data-open");
  });

  it("applies the neutral variant by default", () => {
    render(<Basic />);
    expect(popup()).toHaveAttribute("data-variant", "neutral");
    expect(popup().className).toContain("[--sp-tooltip-bg:var(--sp-fg-default)]");
  });

  it.each(["info", "success", "danger"] as const)("applies the %s variant", (variant) => {
    render(<Basic variant={variant} />);
    expect(popup()).toHaveAttribute("data-variant", variant);
    expect(popup().className).toContain(`[--sp-tooltip-bg:var(--sp-${variant})]`);
  });

  it("renders the intent icon with showIcon (not for neutral)", () => {
    const { unmount } = render(<Basic variant="danger" showIcon />);
    expect(document.querySelector('[data-slot="tooltip-icon"]')).toBeInTheDocument();
    unmount();
    render(<Basic showIcon />);
    expect(document.querySelector('[data-slot="tooltip-icon"]')).toBeNull();
  });

  it("renders an arrow by default and hides it with arrow={false}", () => {
    const { unmount } = render(<Basic />);
    expect(document.querySelector('[data-slot="tooltip-arrow"]')).toBeInTheDocument();
    unmount();
    render(<Basic arrow={false} />);
    expect(document.querySelector('[data-slot="tooltip-arrow"]')).toBeNull();
  });

  it("renders a keyboard shortcut hint", () => {
    render(
      <Tooltip.Root>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content>
          Save <Tooltip.Shortcut>⌘S</Tooltip.Shortcut>
        </Tooltip.Content>
      </Tooltip.Root>,
    );
    const kbd = screen.getByText("⌘S");
    expect(kbd.tagName).toBe("KBD");
    expect(kbd).toHaveAttribute("data-slot", "tooltip-shortcut");
  });

  it("forwards the trigger's density to the portalled popup", () => {
    render(
      <div data-density="compact">
        <Basic />
      </div>,
    );
    expect(popup()).toHaveAttribute("data-density", "compact");
  });

  it("opens on touch long-press and closes after touchCloseDelay", () => {
    vi.useFakeTimers();
    render(<Basic />);
    const trigger = screen.getByText("Save");
    fireEvent.touchStart(trigger, { touches: [{ clientX: 0, clientY: 0 }] });
    act(() => vi.advanceTimersByTime(699));
    expect(popup()).not.toHaveAttribute("data-open");
    act(() => vi.advanceTimersByTime(1));
    expect(popup()).toHaveAttribute("data-open");
    fireEvent.touchEnd(trigger);
    act(() => vi.advanceTimersByTime(1500));
    expect(popup()).not.toHaveAttribute("data-open");
  });

  it("cancels the long-press when the finger moves (scroll)", () => {
    vi.useFakeTimers();
    render(<Basic />);
    const trigger = screen.getByText("Save");
    fireEvent.touchStart(trigger, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(trigger, { touches: [{ clientX: 0, clientY: 40 }] });
    act(() => vi.advanceTimersByTime(1000));
    expect(popup()).not.toHaveAttribute("data-open");
  });

  it("does not open on long-press when touch={false}", () => {
    vi.useFakeTimers();
    render(<Basic touch={false} />);
    fireEvent.touchStart(screen.getByText("Save"), { touches: [{ clientX: 0, clientY: 0 }] });
    act(() => vi.advanceTimersByTime(1000));
    expect(popup()).not.toHaveAttribute("data-open");
  });

  it("works with the raw parts API", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Raw</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>
                Raw tooltip
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await user.tab();
    expect(screen.getByText("Raw tooltip")).toBeVisible();
    expect(screen.getByText("Raw")).toHaveAccessibleDescription("Raw tooltip");
  });
});
