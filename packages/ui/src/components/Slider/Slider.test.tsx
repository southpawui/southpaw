import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Slider } from "./Slider";
import { Field } from "../Field/Field";

const sliders = () => screen.getAllByRole("slider") as HTMLInputElement[];
const root = () => document.querySelector<HTMLElement>('[data-slot="slider"]')!;
const indicators = () => document.querySelectorAll<HTMLElement>('[data-slot="slider-indicator"]');

function mockTrackRect() {
  const track = document.querySelector<HTMLElement>('[data-slot="slider-track"]')!;
  track.getBoundingClientRect = () =>
    ({ left: 0, right: 100, top: 0, bottom: 10, width: 100, height: 10, x: 0, y: 0 }) as DOMRect;
  return track;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Slider", () => {
  describe("basics", () => {
    it("auto-renders one thumb per value", () => {
      const { unmount } = render(<Slider.Root defaultValue={40} aria-label="Volume" />);
      expect(sliders()).toHaveLength(1);
      unmount();
      render(<Slider.Root defaultValue={[10, 50, 90]} />);
      expect(sliders()).toHaveLength(3);
    });

    it("names range thumbs Minimum / Maximum", () => {
      render(<Slider.Root defaultValue={[20, 80]} />);
      expect(sliders()[0]).toHaveAccessibleName("Minimum");
      expect(sliders()[1]).toHaveAccessibleName("Maximum");
    });

    it("names 3+ thumbs by position and accepts getAriaLabel", () => {
      const { unmount } = render(<Slider.Root defaultValue={[10, 50, 90]} />);
      expect(sliders()[1]).toHaveAccessibleName("Handle 2 of 3");
      unmount();
      render(<Slider.Root defaultValue={[10, 90]} getAriaLabel={(i) => (i ? "To" : "From")} />);
      expect(sliders()[0]).toHaveAccessibleName("From");
    });

    it("changes with the keyboard and calls onValueChange", () => {
      const onValueChange = vi.fn();
      render(<Slider.Root defaultValue={40} onValueChange={onValueChange} />);
      fireEvent.keyDown(sliders()[0]!, { key: "ArrowRight" });
      expect(onValueChange).toHaveBeenCalledWith(41, expect.anything());
      expect(sliders()[0]).toHaveAttribute("aria-valuenow", "41");
    });

    it("keeps array values as arrays", () => {
      const onValueChange = vi.fn();
      render(<Slider.Root defaultValue={[20, 80]} onValueChange={onValueChange} />);
      fireEvent.keyDown(sliders()[1]!, { key: "ArrowLeft" });
      expect(onValueChange).toHaveBeenCalledWith([20, 79], expect.anything());
    });

    it("supports controlled value", () => {
      const { rerender } = render(<Slider.Root value={10} />);
      expect(sliders()[0]).toHaveAttribute("aria-valuenow", "10");
      rerender(<Slider.Root value={70} />);
      expect(sliders()[0]).toHaveAttribute("aria-valuenow", "70");
    });

    it("renders Label and a formatted Value", () => {
      render(
        <Slider.Root defaultValue={[20, 80]} format={{ style: "currency", currency: "GBP" }}>
          <Slider.Header>
            <Slider.Label>Price</Slider.Label>
            <Slider.Value />
          </Slider.Header>
        </Slider.Root>,
      );
      expect(screen.getByText("Price")).toHaveAttribute("data-slot", "slider-label");
      expect(document.querySelector('[data-slot="slider-value"]')).toHaveTextContent(
        "£20.00 – £80.00",
      );
    });
  });

  describe("states", () => {
    it("valid, size and orientation are exposed as data attributes", () => {
      render(<Slider.Root defaultValue={10} valid size="lg" orientation="vertical" />);
      expect(root()).toHaveAttribute("data-valid");
      expect(root()).toHaveAttribute("data-size", "lg");
      expect(root()).toHaveAttribute("data-orientation", "vertical");
    });

    it("picks up invalid from Field", () => {
      render(
        <Field.Root invalid>
          <Slider.Root defaultValue={10} />
        </Field.Root>,
      );
      expect(root()).toHaveAttribute("data-invalid");
    });

    it("read-only is focusable but never changes", () => {
      const onValueChange = vi.fn();
      render(<Slider.Root defaultValue={40} readOnly onValueChange={onValueChange} />);
      const input = sliders()[0]!;
      expect(input).toHaveAttribute("aria-readonly", "true");
      expect(input).not.toBeDisabled();
      fireEvent.keyDown(input, { key: "ArrowRight" });
      expect(onValueChange).not.toHaveBeenCalled();
      expect(input).toHaveAttribute("aria-valuenow", "40");
    });

    it("disabled disables every thumb", () => {
      render(<Slider.Root defaultValue={[10, 20]} disabled />);
      sliders().forEach((s) => expect(s).toBeDisabled());
    });
  });

  describe("marks", () => {
    it("marks={true} draws one tick per step", () => {
      render(<Slider.Root defaultValue={40} step={10} marks />);
      expect(document.querySelectorAll('[data-slot="slider-mark"]')).toHaveLength(11);
    });

    it("draws labels and skips hidden marks", () => {
      render(
        <Slider.Root
          defaultValue={20}
          marks={[
            { value: 0, label: "Low" },
            { value: 50, hidden: true },
            { value: 100, label: "High" },
          ]}
        />,
      );
      expect(document.querySelectorAll('[data-slot="slider-mark"]')).toHaveLength(2);
      expect(screen.getByText("Low")).toBeInTheDocument();
      expect(screen.getByText("High")).toBeInTheDocument();
      expect(document.querySelector('[data-slot="slider-mark-labels"]')).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("marks inside the fill are flagged filled", () => {
      render(<Slider.Root defaultValue={50} marks={[25, 75]} />);
      const [a, b] = document.querySelectorAll('[data-slot="slider-mark"]');
      expect(a).toHaveAttribute("data-filled");
      expect(b).not.toHaveAttribute("data-filled");
    });

    it("restrictToMarks: arrows move mark to mark, Home/End jump to the ends", () => {
      render(<Slider.Root defaultValue={20} marks={[0, 20, 37, 100]} restrictToMarks />);
      const input = sliders()[0]!;
      fireEvent.keyDown(input, { key: "ArrowRight" });
      expect(input).toHaveAttribute("aria-valuenow", "37");
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      expect(input).toHaveAttribute("aria-valuenow", "20");
      fireEvent.keyDown(input, { key: "End" });
      expect(input).toHaveAttribute("aria-valuenow", "100");
      fireEvent.keyDown(input, { key: "Home" });
      expect(input).toHaveAttribute("aria-valuenow", "0");
    });

    it("restrictToMarks snaps hidden marks too", () => {
      render(
        <Slider.Root
          defaultValue={0}
          marks={[0, { value: 60, hidden: true }, 100]}
          restrictToMarks
        />,
      );
      fireEvent.keyDown(sliders()[0]!, { key: "ArrowRight" });
      expect(sliders()[0]).toHaveAttribute("aria-valuenow", "60");
    });
  });

  describe("format, scale, value label", () => {
    it("scale + formatValue drive aria-valuetext and Value", () => {
      render(
        <Slider.Root
          defaultValue={3}
          min={0}
          max={10}
          scale={(v) => 2 ** v}
          formatValue={(v) => `${v} GB`}
        >
          <Slider.Value />
        </Slider.Root>,
      );
      expect(sliders()[0]).toHaveAttribute("aria-valuetext", "8 GB");
      expect(document.querySelector('[data-slot="slider-value"]')).toHaveTextContent("8 GB");
    });

    it("valueLabel=always shows the formatted value on each thumb", () => {
      render(
        <Slider.Root defaultValue={[20, 80]} valueLabel="always" formatValue={(v) => `${v}%`} />,
      );
      expect(screen.getByText("20%")).toBeInTheDocument();
      expect(screen.getByText("80%")).toBeInTheDocument();
    });

    it("valueLabel=auto shows on hover and hides on leave", async () => {
      render(<Slider.Root defaultValue={30} />);
      const thumb = document.querySelector<HTMLElement>('[data-slot="slider-thumb"]')!;
      expect(screen.queryByText("30")).toBeNull();
      fireEvent.pointerEnter(thumb);
      expect(await screen.findByText("30")).toBeInTheDocument();
      fireEvent.pointerLeave(thumb);
      await waitFor(() => expect(screen.queryByText("30")).toBeNull());
    });

    it("valueLabel=off never renders a label", () => {
      render(<Slider.Root defaultValue={30} valueLabel="off" />);
      fireEvent.pointerEnter(document.querySelector('[data-slot="slider-thumb"]')!);
      expect(screen.queryByText("30")).toBeNull();
    });

    it("the value label is hidden from assistive tech", () => {
      render(<Slider.Root defaultValue={30} valueLabel="always" />);
      expect(screen.getByText("30").closest('[data-slot="slider-value-label"]')).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  describe("fill (indicator)", () => {
    const seg = (el: HTMLElement) => [el.style.insetInlineStart, el.style.width];

    it("fills from the start by default", () => {
      render(<Slider.Root defaultValue={40} />);
      expect(seg(indicators()[0]!)).toEqual(["0%", "40%"]);
    });

    it("origin=center fills from the middle", () => {
      render(<Slider.Root defaultValue={-20} min={-50} max={50} origin="center" />);
      expect(seg(indicators()[0]!)).toEqual(["30%", "20%"]);
    });

    it("origin=<number> fills from that value", () => {
      render(<Slider.Root defaultValue={80} origin={60} />);
      expect(seg(indicators()[0]!)).toEqual(["60%", "20%"]);
    });

    it("range fills between the thumbs", () => {
      render(<Slider.Root defaultValue={[20, 70]} />);
      expect(seg(indicators()[0]!)).toEqual(["20%", "50%"]);
    });

    it("track=inverted fills outside the range; none draws nothing", () => {
      const { unmount } = render(<Slider.Root defaultValue={[20, 70]} track="inverted" />);
      expect(indicators()).toHaveLength(2);
      expect(seg(indicators()[0]!)).toEqual(["0%", "20%"]);
      expect(seg(indicators()[1]!)).toEqual(["70%", "30%"]);
      unmount();
      render(<Slider.Root defaultValue={[20, 70]} track="none" />);
      expect(indicators()).toHaveLength(0);
    });

    it("vertical uses bottom / height", () => {
      render(<Slider.Root defaultValue={40} orientation="vertical" />);
      expect(indicators()[0]!.style.bottom).toBe("0%");
      expect(indicators()[0]!.style.height).toBe("40%");
    });
  });

  describe("draggable range", () => {
    it("dragging the fill moves both thumbs and keeps the span", () => {
      const onValueChange = vi.fn();
      render(<Slider.Root defaultValue={[30, 60]} draggableTrack onValueChange={onValueChange} />);
      mockTrackRect();
      const fill = indicators()[0]!;
      expect(fill).toHaveAttribute("data-draggable");
      fireEvent.pointerDown(fill, { button: 0, clientX: 40, clientY: 5 });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 50, clientY: 5 }));
      });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointerup", { clientX: 50, clientY: 5 }));
      });
      expect(onValueChange).toHaveBeenLastCalledWith([40, 70], undefined);
    });

    it("can't push the range past the ends", () => {
      const onValueChange = vi.fn();
      render(<Slider.Root defaultValue={[70, 90]} draggableTrack onValueChange={onValueChange} />);
      mockTrackRect();
      fireEvent.pointerDown(indicators()[0]!, { button: 0, clientX: 80, clientY: 5 });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 100, clientY: 5 }));
      });
      expect(onValueChange).toHaveBeenLastCalledWith([80, 100], undefined);
    });
  });

  describe("editable handles", () => {
    function Editable(props: { minCount?: number; maxCount?: number; defaultValue?: number[] }) {
      return (
        <Slider.Root
          defaultValue={props.defaultValue ?? [20, 50, 80]}
          editable={{ minCount: props.minCount ?? 1, maxCount: props.maxCount ?? 5 }}
        >
          <Slider.AddHandle />
          <Slider.RemoveHandle />
        </Slider.Root>
      );
    }
    const status = () => document.querySelector('[data-slot="slider-announcer"]')!;

    it("Delete on a focused handle removes it and announces it", () => {
      render(<Editable />);
      const middle = sliders()[1]!;
      expect(middle).toHaveAttribute("aria-keyshortcuts", "Delete Backspace");
      fireEvent.keyDown(middle, { key: "Delete" });
      expect(sliders()).toHaveLength(2);
      expect(status()).toHaveAttribute("role", "status");
      expect(status()).toHaveTextContent("Handle at 50 removed. 2 handles.");
    });

    it("Backspace also removes; minCount is respected", () => {
      render(<Editable minCount={2} defaultValue={[20, 80]} />);
      fireEvent.keyDown(sliders()[0]!, { key: "Backspace" });
      expect(sliders()).toHaveLength(2);
      expect(screen.getByRole("button", { name: "Remove handle" })).toBeDisabled();
    });

    it("Add handle adds in the widest gap and announces it", () => {
      render(<Editable defaultValue={[10, 20]} />);
      fireEvent.click(screen.getByRole("button", { name: "Add handle" }));
      expect(sliders()).toHaveLength(3);
      expect(sliders()[2]).toHaveAttribute("aria-valuenow", "60");
      expect(status()).toHaveTextContent("Handle added at 60. 3 handles.");
    });

    it("maxCount disables Add handle", () => {
      render(<Editable maxCount={3} />);
      expect(screen.getByRole("button", { name: "Add handle" })).toBeDisabled();
    });

    it("Remove handle removes the last focused handle", () => {
      render(<Editable />);
      act(() => {
        sliders()[2]!.focus();
      });
      fireEvent.click(screen.getByRole("button", { name: "Remove handle" }));
      expect(sliders().map((s) => s.getAttribute("aria-valuenow"))).toEqual(["20", "50"]);
    });

    it("pressing the bare track adds a handle there", () => {
      render(<Editable defaultValue={[20, 80]} />);
      const track = mockTrackRect();
      fireEvent.pointerDown(track, { button: 0, clientX: 45, clientY: 5 });
      expect(sliders().map((s) => s.getAttribute("aria-valuenow"))).toEqual(["20", "45", "80"]);
    });

    it("dragging a handle off the track removes it on release (Ant)", async () => {
      // jsdom has no pointer capture; Base UI calls it when a drag starts.
      HTMLElement.prototype.setPointerCapture ??= vi.fn();
      HTMLElement.prototype.releasePointerCapture ??= vi.fn();
      HTMLElement.prototype.hasPointerCapture ??= vi.fn(() => false);
      render(<Editable defaultValue={[20, 50, 80]} />);
      mockTrackRect();
      const thumb = document.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]')[0]!;
      fireEvent.pointerDown(thumb, { button: 0, clientX: 20, clientY: 5, pointerId: 1 });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 20, clientY: 120 }));
      });
      expect(thumb).toHaveAttribute("data-removing");
      act(() => {
        window.dispatchEvent(new MouseEvent("pointerup", { clientX: 20, clientY: 120 }));
      });
      await waitFor(() => expect(sliders()).toHaveLength(2));
      expect(sliders().map((s) => s.getAttribute("aria-valuenow"))).toEqual(["50", "80"]);
    });

    it("is off unless `editable` is set", () => {
      render(<Slider.Root defaultValue={[20, 50, 80]} />);
      fireEvent.keyDown(sliders()[1]!, { key: "Delete" });
      expect(sliders()).toHaveLength(3);
      expect(document.querySelector('[data-slot="slider-announcer"]')).toBeNull();
    });
  });

  describe("min / max", () => {
    it("showMinMax renders formatted ends", () => {
      render(
        <Slider.Root
          defaultValue={50}
          min={0}
          max={1000}
          showMinMax
          format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
        />,
      );
      const mm = document.querySelector('[data-slot="slider-min-max"]')!;
      expect(mm).toHaveTextContent("£0");
      expect(mm).toHaveTextContent("£1,000");
    });
  });

  describe("/improve regressions (sign-off 2026-11-16)", () => {
    it("aria-label on Root names a single thumb", () => {
      render(<Slider.Root defaultValue={40} aria-label="Volume" />);
      expect(sliders()[0]).toHaveAccessibleName("Volume");
    });

    it("aria-label on Root prefixes range thumb names", () => {
      render(<Slider.Root defaultValue={[20, 80]} aria-label="Price" />);
      expect(sliders()[0]).toHaveAccessibleName("Price, minimum");
      expect(sliders()[1]).toHaveAccessibleName("Price, maximum");
    });

    it("keyboard use shows the value label even after a pointer focus", async () => {
      // Simulate a pointer focus: the input is focused but not :focus-visible.
      const original = Element.prototype.matches;
      const spy = vi.spyOn(Element.prototype, "matches").mockImplementation(function (
        this: Element,
        selector: string,
      ) {
        return selector === ":focus-visible" ? false : original.call(this, selector);
      });
      render(<Slider.Root defaultValue={30} />);
      const input = sliders()[0]!;
      act(() => {
        input.focus();
      });
      expect(screen.queryByText("30")).toBeNull();
      fireEvent.keyDown(input, { key: "ArrowRight" });
      expect(await screen.findByText("31")).toBeInTheDocument();
      spy.mockRestore();
    });

    it("restrictToMarks also snaps track drags and added handles", () => {
      const onValueChange = vi.fn();
      render(
        <Slider.Root
          defaultValue={[0, 50]}
          marks={[0, 25, 50, 75, 100]}
          restrictToMarks
          draggableTrack
          onValueChange={onValueChange}
        />,
      );
      mockTrackRect();
      fireEvent.pointerDown(indicators()[0]!, { button: 0, clientX: 20, clientY: 5 });
      act(() => {
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 33, clientY: 5 }));
      });
      // +13 would land on 13 / 63; both snap to the nearest marks.
      expect(onValueChange).toHaveBeenLastCalledWith([25, 75], undefined);
      act(() => {
        window.dispatchEvent(new MouseEvent("pointerup", { clientX: 33, clientY: 5 }));
      });
    });

    it("end mark labels align inward so they never overflow", () => {
      render(
        <Slider.Root
          defaultValue={50}
          marks={[
            { value: 0, label: "Min" },
            { value: 50, label: "Mid" },
            { value: 100, label: "Max" },
          ]}
        />,
      );
      expect(screen.getByText("Min")).toHaveAttribute("data-edge", "start");
      expect(screen.getByText("Max")).toHaveAttribute("data-edge", "end");
      expect(screen.getByText("Mid")).not.toHaveAttribute("data-edge");
    });
  });

  it("doesn't auto-render a second control when Body or Control is composed", () => {
    const { unmount } = render(
      <Slider.Root defaultValue={[20, 80]}>
        <Slider.Body>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumbs />
            </Slider.Track>
          </Slider.Control>
        </Slider.Body>
      </Slider.Root>,
    );
    expect(document.querySelectorAll('[data-slot="slider-track"]')).toHaveLength(1);
    expect(sliders()).toHaveLength(2);
    unmount();
    render(
      <Slider.Root defaultValue={50}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumbs />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    expect(document.querySelectorAll('[data-slot="slider-track"]')).toHaveLength(1);
  });

  it("renders data-slots for every part", () => {
    render(
      <Slider.Root defaultValue={[20, 80]} marks={[{ value: 50, label: "Mid" }]} showMinMax>
        <Slider.Header>
          <Slider.Label>L</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>,
    );
    for (const slot of [
      "slider",
      "slider-header",
      "slider-label",
      "slider-value",
      "slider-body",
      "slider-control",
      "slider-track",
      "slider-indicator",
      "slider-marks",
      "slider-mark",
      "slider-mark-labels",
      "slider-min-max",
      "slider-thumb",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`), slot).not.toBeNull();
    }
  });
});
