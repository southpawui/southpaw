import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();
  });

  it("has data-slot attributes on wrapper and textarea", () => {
    const { container } = render(<Textarea aria-label="Test" />);
    expect(container.querySelector("[data-slot='textarea-group']")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='textarea']")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Textarea placeholder="Write something..." aria-label="Message" />);
    expect(screen.getByPlaceholderText("Write something...")).toBeInTheDocument();
  });

  it("fires onChange handler", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} aria-label="Message" />);
    await user.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("defaults to 3 rows when not autosize", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "3");
  });

  it("defaults to 1 row when autosize", () => {
    render(<Textarea autosize aria-label="Message" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "1");
  });

  it("respects explicit rows prop", () => {
    render(<Textarea rows={5} aria-label="Message" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
  });

  it("applies field-sizing:content class when autosize", () => {
    render(<Textarea autosize aria-label="Message" />);
    expect(screen.getByRole("textbox").className).toContain("[field-sizing:content]");
  });

  it("applies resize-none class when autosize", () => {
    render(<Textarea autosize aria-label="Message" />);
    expect(screen.getByRole("textbox").className).toContain("resize-none");
  });

  it("applies resize-vertical by default", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox").className).toContain("resize-vertical");
  });

  it("applies custom resize prop", () => {
    render(<Textarea resize="none" aria-label="Message" />);
    expect(screen.getByRole("textbox").className).toContain("resize-none");
  });

  it("shows checkmark when valid prop is true", () => {
    const { container } = render(<Textarea valid aria-label="Valid" />);
    expect(container.querySelector("[data-slot='textarea-valid']")).toBeInTheDocument();
  });

  it("does not show checkmark when valid is not set", () => {
    const { container } = render(<Textarea aria-label="Normal" />);
    expect(container.querySelector("[data-slot='textarea-valid']")).not.toBeInTheDocument();
  });

  it("applies success border when valid", () => {
    const { container } = render(<Textarea valid aria-label="Valid" />);
    expect(container.querySelector("[data-slot='textarea-group']")!.className).toContain(
      "border-success",
    );
  });

  it("is disabled when disabled prop is set", () => {
    render(<Textarea disabled aria-label="Disabled" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("is read-only when readOnly prop is set", () => {
    render(<Textarea readOnly aria-label="ReadOnly" defaultValue="fixed" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("forwards ref to the textarea element", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} aria-label="Ref" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  it("passes maxLength to the native textarea", () => {
    render(<Textarea maxLength={200} aria-label="Limited" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "200");
  });
});
