import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders Root with data-slot", () => {
    render(
      <Avatar.Root data-testid="avatar">
        <Avatar.Fallback>GY</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-slot", "avatar");
  });

  it("renders fallback text", () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback>GY</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByText("GY")).toBeInTheDocument();
  });

  it("supports size prop", () => {
    render(
      <Avatar.Root data-testid="avatar" size="lg">
        <Avatar.Fallback>L</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "lg");
  });

  it("supports shape prop", () => {
    render(
      <Avatar.Root data-testid="avatar" shape="square">
        <Avatar.Fallback>S</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-shape", "square");
  });

  it("renders Status with aria-label", () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>GY</Avatar.Fallback>
        <Avatar.Status status="online" />
      </Avatar.Root>,
    );
    expect(screen.getByLabelText("Status: online")).toHaveAttribute("data-slot", "avatar-status");
  });

  it("renders Group with data-slot", () => {
    render(
      <Avatar.Group data-testid="group">
        <Avatar.Root>
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("data-slot", "avatar-group");
  });

  it("shows overflow count when max is exceeded", () => {
    render(
      <Avatar.Group max={2}>
        <Avatar.Root>
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>C</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>D</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>,
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Avatar.Root data-testid="avatar" className="test-class">
        <Avatar.Fallback>GY</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar").className).toContain("test-class");
  });

  /* ---------------- name tooltip (GEO-941) ---------------- */

  describe("name", () => {
    it("no longer uses the native title attribute", () => {
      render(
        <Avatar.Root name="Jane Doe" data-testid="avatar">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId("avatar")).not.toHaveAttribute("title");
    });

    it("names the avatar via its tooltip (role=group, aria-labelledby)", () => {
      render(
        <Avatar.Root name="Jane Doe">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      const avatar = screen.getByRole("group", { name: "Jane Doe" });
      expect(avatar).toHaveAttribute("data-slot", "avatar");
      const popup = document.querySelector('[data-slot="tooltip-popup"]')!;
      expect(popup).toHaveTextContent("Jane Doe");
      expect(avatar).toHaveAttribute("aria-labelledby", popup.id);
    });

    it("keeps the status dot accessible inside a named avatar", () => {
      render(
        <Avatar.Root name="Jane Doe">
          <Avatar.Fallback>JD</Avatar.Fallback>
          <Avatar.Status status="online" />
        </Avatar.Root>,
      );
      expect(screen.getByRole("img", { name: "Status: online" })).toBeInTheDocument();
    });

    it("shows the tooltip on hover", async () => {
      const user = userEvent.setup();
      render(
        <Avatar.Root name="Jane Doe">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      await user.hover(screen.getByRole("group", { name: "Jane Doe" }));
      await new Promise((r) => setTimeout(r, 400));
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toHaveAttribute("data-open");
    });

    it("tooltip={false} keeps the accessible name without a tooltip", () => {
      render(
        <Avatar.Root name="Jane Doe" tooltip={false}>
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByRole("group", { name: "Jane Doe" })).toHaveAttribute(
        "aria-label",
        "Jane Doe",
      );
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toBeNull();
    });

    it("adds no role or tooltip without a name", () => {
      render(
        <Avatar.Root data-testid="avatar">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId("avatar")).not.toHaveAttribute("role");
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toBeNull();
    });

    it("renders as a link via `render`, keyboard-reachable with the tooltip as its name", async () => {
      const user = userEvent.setup();
      // Content arrives via `render` children, so the empty anchor is intentional.
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      const link = <a href="#profile" />;
      render(
        <Avatar.Root name="Jane Doe" render={link}>
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      const avatarLink = screen.getByRole("link", { name: "Jane Doe" });
      expect(avatarLink).toHaveAttribute("data-slot", "avatar");
      expect(avatarLink).not.toHaveAttribute("role");
      await user.tab();
      expect(avatarLink).toHaveFocus();
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toHaveAttribute("data-open");
    });

    it("lets a consumer aria-label win; the tooltip then describes", () => {
      render(
        <Avatar.Root name="Jane Doe" aria-label="Jane Doe, project owner">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      const avatar = screen.getByRole("group", { name: "Jane Doe, project owner" });
      expect(avatar).not.toHaveAttribute("aria-labelledby");
      expect(avatar).toHaveAccessibleDescription("Jane Doe");
    });

    it("merges a consumer aria-labelledby with the tooltip's", () => {
      render(
        <>
          <span id="role-label">Owner</span>
          <Avatar.Root name="Jane Doe" aria-labelledby="role-label">
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar.Root>
        </>,
      );
      expect(screen.getByRole("group", { name: "Owner Jane Doe" })).toBeInTheDocument();
    });

    it("forwards the ref to the avatar element", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(
        <Avatar.Root ref={ref} name="Jane Doe">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(ref.current).toHaveAttribute("data-slot", "avatar");
    });
  });

  describe("Group overflow", () => {
    it("lists the hidden names in the +N tooltip", () => {
      render(
        <Avatar.Group max={2}>
          {["Ada", "Ben", "Cy", "Di"].map((n) => (
            <Avatar.Root key={n} name={n}>
              <Avatar.Fallback>{n[0]}</Avatar.Fallback>
            </Avatar.Root>
          ))}
        </Avatar.Group>,
      );
      // Named (not just described) so browse-mode screen readers announce it.
      const overflow = screen.getByRole("img", { name: "2 more: Cy, Di" });
      expect(overflow).toHaveTextContent("+2");
      expect(overflow).toHaveAttribute("data-slot", "avatar-overflow");
      expect(
        Array.from(document.querySelectorAll('[data-slot="avatar-overflow-names"] li')).map(
          (li) => li.childNodes[0]?.textContent, // visible name, minus the sr-only comma
        ),
      ).toEqual(["Cy", "Di"]);
    });

    it("renders a plain +N when hidden avatars have no names", () => {
      render(
        <Avatar.Group max={1}>
          <Avatar.Root>
            <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root>
            <Avatar.Fallback>B</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Group>,
      );
      expect(screen.getByRole("img", { name: "1 more" })).toHaveTextContent("+1");
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toBeNull();
    });

    it("counts hidden avatars without names as 'and N more'", () => {
      render(
        <Avatar.Group max={1}>
          <Avatar.Root name="Ada">
            <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root name="Ben">
            <Avatar.Fallback>B</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root>
            <Avatar.Fallback>?</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Group>,
      );
      expect(screen.getByRole("img", { name: "2 more: Ben, and 1 more" })).toBeInTheDocument();
      expect(
        Array.from(document.querySelectorAll('[data-slot="avatar-overflow-names"] li')).map(
          (li) => li.childNodes[0]?.textContent, // visible name, minus the sr-only comma
        ),
      ).toEqual(["Ben", "and 1 more"]);
    });
  });
});
