import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  it("renders Root with data-slot", () => {
    render(
      <Tabs.Root data-testid="tabs" defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByTestId("tabs")).toHaveAttribute("data-slot", "tabs");
  });

  it("renders horizontal by default", () => {
    render(
      <Tabs.Root data-testid="tabs" defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByTestId("tabs").className).toContain("flex-col");
  });

  it("renders vertical orientation", () => {
    render(
      <Tabs.Root data-testid="tabs" defaultValue="a" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByTestId("tabs").className).toContain("flex-row");
  });

  it("renders List with data-slot", () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List data-testid="list">
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByTestId("list")).toHaveAttribute("data-slot", "tabs-list");
  });

  it("renders Tab with data-slot", () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByText("Tab A")).toHaveAttribute("data-slot", "tabs-tab");
  });

  it("renders Panel with data-slot", () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a" data-testid="panel">
          Content
        </Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByTestId("panel")).toHaveAttribute("data-slot", "tabs-panel");
  });

  it("renders disabled tab", () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b" disabled>
            B
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByText("B")).toHaveAttribute("data-disabled", "");
  });

  it("applies custom className", () => {
    render(
      <Tabs.Root data-testid="tabs" defaultValue="a" className="test-class">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(screen.getByTestId("tabs").className).toContain("test-class");
  });

  it("styles the selected tab via Base UI's data-active attribute", () => {
    render(
      <Tabs.Root defaultValue="b">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="b">Content</Tabs.Panel>
      </Tabs.Root>,
    );
    const selected = screen.getByRole("tab", { name: "B" });
    // Base UI 1.9 marks the selected tab with data-active; the styles must key off it
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(selected).toHaveAttribute("data-active");
    expect(screen.getByRole("tab", { name: "A" })).not.toHaveAttribute("data-active");
    expect(selected.className).toContain("data-[active]:text-accent");
    expect(selected.className).not.toContain("data-[selected]");
  });
});
