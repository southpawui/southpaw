import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "./Form";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";
import { Checkbox } from "../Checkbox/Checkbox";
import { Switch } from "../Switch/Switch";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { NumberField } from "../NumberField/NumberField";

/*
 * Decision 11 (GEO-935): does every control go back to its default on a native form reset
 * (<button type="reset">, form.reset())? Controls backed by a hidden input can miss it,
 * because React state isn't told. Each control is one test; LOG.md lists the results.
 *
 * Gaps (2026-11-23) are `it.fails`: Checkbox, Switch, RadioGroup and NumberField keep their
 * state in React (Base UI) and don't listen for the form's reset event, so the visible
 * control keeps the changed value. They're listed as shared fixes for the coordinator; when
 * one is fixed its `it.fails` starts failing, and becomes a plain `it`.
 */

function inForm(children: React.ReactNode) {
  return render(
    <Form.Root aria-label="Reset audit" errorSummary={false}>
      {children}
    </Form.Root>,
  );
}

const reset = () =>
  act(() => {
    (screen.getByRole("form") as HTMLFormElement).reset();
  });

describe("native reset restores each control's default", () => {
  it("Input", async () => {
    inForm(
      <Field.Root name="a">
        <Field.Label>A</Field.Label>
        <Input defaultValue="start" />
      </Field.Root>,
    );
    const input = screen.getByRole("textbox", { name: "A" });
    await userEvent.clear(input);
    await userEvent.type(input, "changed");
    reset();
    expect(input).toHaveValue("start");
  });

  it("Textarea", async () => {
    inForm(
      <Field.Root name="t">
        <Field.Label>T</Field.Label>
        <Textarea defaultValue="start" />
      </Field.Root>,
    );
    const box = screen.getByRole("textbox", { name: "T" });
    await userEvent.type(box, " more");
    reset();
    expect(box).toHaveValue("start");
  });

  it.fails("Checkbox (gap: keeps its changed value)", async () => {
    inForm(<Checkbox.Root aria-label="C" name="c" defaultChecked />);
    const box = screen.getByRole("checkbox", { name: "C" });
    await userEvent.click(box);
    expect(box).toHaveAttribute("aria-checked", "false");
    reset();
    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it.fails("Switch (gap: keeps its changed value)", async () => {
    inForm(<Switch.Root aria-label="S" name="s" defaultChecked />);
    const sw = screen.getByRole("switch", { name: "S" });
    await userEvent.click(sw);
    reset();
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it.fails("RadioGroup (gap: keeps its changed value)", async () => {
    inForm(
      <RadioGroup.Root aria-label="R" name="r" defaultValue="a">
        <RadioGroup.Item value="a" aria-label="A" />
        <RadioGroup.Item value="b" aria-label="B" />
      </RadioGroup.Root>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "B" }));
    reset();
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-checked", "true");
  });

  it.fails("NumberField (gap: keeps its changed value)", async () => {
    inForm(
      <NumberField.Root name="n" defaultValue={3}>
        <NumberField.Input aria-label="N" />
      </NumberField.Root>,
    );
    const input = screen.getByRole("textbox", { name: "N" });
    await userEvent.clear(input);
    await userEvent.type(input, "9");
    await userEvent.tab();
    reset();
    expect(input).toHaveValue("3");
  });
});
