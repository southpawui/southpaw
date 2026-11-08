import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

function renderSelect(props?: Record<string, unknown>, triggerProps?: Record<string, unknown>) {
  return render(
    <Select.Root {...props}>
      <Select.Trigger aria-label="Fruit" {...triggerProps}>
        <Select.Value placeholder="Select..." />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              <Select.Item value="apple">
                <Select.ItemIndicator />
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Item value="banana">
                <Select.ItemIndicator />
                <Select.ItemText>Banana</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>,
  );
}

describe("Select", () => {
  it("renders the trigger with data-slot", () => {
    const { container } = renderSelect();
    expect(container.querySelector("[data-slot='select-trigger']")).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    renderSelect();
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("renders the chevron icon", () => {
    const { container } = renderSelect();
    expect(container.querySelector("[data-slot='select-icon']")).toBeInTheDocument();
  });

  it("has density-responsive height via control-height token", () => {
    const { container } = renderSelect();
    const trigger = container.querySelector("[data-slot='select-trigger']")!;
    expect(trigger.className).toContain("h-[var(--sp-control-height)]");
  });

  it("has focus ring class", () => {
    const { container } = renderSelect();
    const trigger = container.querySelector("[data-slot='select-trigger']")!;
    expect(trigger.className).toContain("sp-focus-ring");
  });

  it("has nested radius support", () => {
    const { container } = renderSelect();
    const trigger = container.querySelector("[data-slot='select-trigger']")!;
    expect(trigger.className).toContain("--sp-nested-radius");
  });

  it("applies valid border class when valid prop is set", () => {
    const { container } = renderSelect({}, { valid: true });
    const trigger = container.querySelector("[data-slot='select-trigger']")!;
    expect(trigger.className).toContain("border-success");
  });

  it("does not apply valid border when valid is not set", () => {
    const { container } = renderSelect();
    const trigger = container.querySelector("[data-slot='select-trigger']")!;
    expect(trigger.className).not.toContain("border-success");
  });

  it("has data-slot on value element", () => {
    const { container } = renderSelect();
    expect(container.querySelector("[data-slot='select-value']")).toBeInTheDocument();
  });

  it("accepts defaultValue prop without error", () => {
    const { container } = renderSelect({ defaultValue: "apple" });
    expect(container.querySelector("[data-slot='select-trigger']")).toBeInTheDocument();
  });

  it("forwards ref on trigger", () => {
    const ref = vi.fn();
    render(
      <Select.Root>
        <Select.Trigger ref={ref} aria-label="Test">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
      </Select.Root>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it("shows clear button when onClear is provided", () => {
    const onClear = vi.fn();
    render(
      <Select.Root defaultValue="apple">
        <Select.Trigger aria-label="Fruit" onClear={onClear} />
      </Select.Root>,
    );
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("does not show clear button when onClear is not provided", () => {
    renderSelect();
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("applies read-only styling via data-readonly", () => {
    const { container } = render(
      <Select.Root readOnly defaultValue="apple">
        <Select.Trigger aria-label="Fruit">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
      </Select.Root>,
    );
    const trigger = container.querySelector("[data-slot='select-trigger']")!;
    expect(trigger.className).toContain("data-[readonly]");
  });
});

describe("Select.List", () => {
  it("applies virtualized class when prop is set", () => {
    const { container } = render(
      <Select.Root defaultOpen>
        <Select.Trigger aria-label="Test">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Positioner>
          <Select.Popup>
            <Select.List virtualized>
              <Select.Item value="a">
                <Select.ItemText>A</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Root>,
    );
    expect(container.querySelector("[data-slot='select-list']")!.className).toContain(
      "content-visibility",
    );
  });
});

describe("Select.Item", () => {
  it("has data-slot attribute", () => {
    const { container } = render(
      <Select.Root defaultOpen>
        <Select.Trigger aria-label="Test">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              <Select.Item value="a">
                <Select.ItemText>Option A</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Root>,
    );
    expect(container.querySelector("[data-slot='select-item']")).toBeInTheDocument();
  });
});

describe("Select.ItemIndicator", () => {
  it("renders default check icon when no children provided", () => {
    const { container } = render(
      <Select.Root defaultOpen defaultValue="a">
        <Select.Trigger aria-label="Test">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              <Select.Item value="a">
                <Select.ItemIndicator />
                <Select.ItemText>A</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Root>,
    );
    expect(container.querySelector("[data-slot='select-item-indicator'] svg")).toBeInTheDocument();
  });
});
