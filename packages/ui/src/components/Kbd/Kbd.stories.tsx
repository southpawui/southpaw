import type { Meta, StoryObj } from "@storybook/react";
import { ArrowFatUpIcon, CommandIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Kbd } from "./Kbd";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

const meta: Meta = {
  title: "Components/Kbd",
};

export default meta;
type Story = StoryObj;

const variants = ["outline", "raised", "subtle", "plain"] as const;
const sizes = ["sm", "md", "lg"] as const;
const platforms = ["apple", "windows", "other"] as const;

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">{children}</p>
);

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <section className="flex flex-col gap-6 sm:max-w-md">
      <div className="flex flex-wrap items-center gap-3">
        <Kbd>Esc</Kbd>
        <Kbd>Tab</Kbd>
        <Kbd>K</Kbd>
        <Kbd keys="Mod+K" />
        <Kbd keys="Mod+Shift+P" />
      </div>
      <p className="text-fg-default text-sm">
        Press <Kbd keys="Mod+K" /> to open the command palette, or <Kbd>?</Kbd> to see every
        shortcut.
      </p>
    </section>
  ),
};

/* ============================================================
 * VARIANTS + SIZES
 * ============================================================ */

export const Variants: Story = {
  render: () => (
    <section className="flex flex-col gap-4">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-4">
          <span className="text-fg-muted w-16 text-xs">{variant}</span>
          {sizes.map((size) => (
            <Kbd.Group key={size} variant={variant} size={size}>
              <Kbd>Shift</Kbd>
              <Kbd>Enter</Kbd>
            </Kbd.Group>
          ))}
          <Kbd variant={variant} keys="Mod+K" platform="apple" />
        </div>
      ))}
    </section>
  ),
};

/* ============================================================
 * KEYS — platform-aware
 * ============================================================ */

export const Keys: Story = {
  render: () => (
    <section className="flex flex-col gap-6">
      {platforms.map((platform) => (
        <div key={platform} className="flex flex-col gap-2">
          <Label>{platform}</Label>
          <div className="flex flex-wrap items-center gap-4">
            <Kbd keys="Mod+K" platform={platform} />
            <Kbd keys="Mod+Shift+P" platform={platform} />
            <Kbd keys="Alt+Enter" platform={platform} />
            <Kbd keys="Mod+Backspace" platform={platform} />
            <Kbd keys="Meta" platform={platform} />
            <Kbd keys="g i" platform={platform} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Kbd keys="Mod+Shift+P" platform={platform} format="full" />
            <Kbd keys="g i" platform={platform} format="full" />
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Label>Detected (auto)</Label>
        <div className="flex flex-wrap items-center gap-4">
          <Kbd keys="Mod+K" />
          <Kbd keys="Mod+Shift+P" format="full" />
        </div>
      </div>
    </section>
  ),
};

/* ============================================================
 * GROUP — manual composition
 * ============================================================ */

export const Group: Story = {
  render: () => (
    <section className="flex flex-col gap-4">
      <Kbd.Group>
        <Kbd>Ctrl</Kbd>
        <Kbd>B</Kbd>
      </Kbd.Group>
      <Kbd.Group separator="+">
        <Kbd>Ctrl</Kbd>
        <Kbd>Alt</Kbd>
        <Kbd>Del</Kbd>
      </Kbd.Group>
      {/* Icon keys: icons carry no spoken name, so add hidden text (or use `keys`) */}
      <Kbd.Group variant="subtle">
        <Kbd>
          <CommandIcon aria-hidden />
          <span className="sr-only">command</span>
        </Kbd>
        <Kbd>
          <ArrowFatUpIcon aria-hidden />
          <span className="sr-only">shift</span>
        </Kbd>
        <Kbd>P</Kbd>
      </Kbd.Group>
    </section>
  ),
};

/* ============================================================
 * IN CONTEXT
 * ============================================================ */

export const InContext: Story = {
  render: () => (
    <section className="flex flex-col gap-6 sm:max-w-md">
      <div className="flex flex-col gap-2">
        <Label>Button</Label>
        <div className="flex flex-wrap gap-3">
          <Button label="Save" icon={<Kbd keys="Mod+S" platform="apple" />} iconPosition="end" />
          <Button
            variant="outline"
            label="Accept"
            icon={<Kbd keys="Enter" platform="apple" />}
            iconPosition="end"
          />
          <Button variant="ghost" label="Cancel" icon={<Kbd>Esc</Kbd>} iconPosition="end" />
          <Button
            color="brand"
            label="Publish"
            icon={<Kbd variant="subtle" keys="Mod+Enter" platform="apple" />}
            iconPosition="end"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Input</Label>
        <Input
          prepend={<MagnifyingGlassIcon />}
          append={<Kbd variant="subtle" keys="Mod+K" />}
          placeholder="Search..."
          aria-label="Search"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Inverted surface (tooltip)</Label>
        <aside className="bg-fg-default text-surface-base inline-flex w-fit items-center gap-2 rounded-md px-2.5 py-1.5 text-xs">
          Save <Kbd size="sm" keys="Mod+S" platform="apple" />
        </aside>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Prose</Label>
        <p className="text-fg-default text-sm">
          To leave quickly, press <Kbd keys="Shift" format="full" /> three times. To jump to issues,
          press <Kbd keys="g i" format="full" />.
        </p>
      </div>
    </section>
  ),
};

/* ============================================================
 * STATES
 * Kbd is display-only: valid / error / disabled do not apply.
 * It takes its colours from its surroundings, so these are the
 * states it is shown in.
 * ============================================================ */

export const States: Story = {
  render: () => (
    <section className="flex flex-col gap-6 sm:max-w-md">
      <div className="flex flex-col gap-2">
        <Label>Default</Label>
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Kbd key={v} variant={v} keys="Mod+K" platform="apple" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Muted text</Label>
        <div className="text-fg-muted flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Kbd key={v} variant={v} keys="Mod+K" platform="apple" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Inside disabled button</Label>
        <div className="flex flex-wrap gap-3">
          <Button
            disabled
            label="Save"
            icon={<Kbd keys="Mod+S" platform="apple" />}
            iconPosition="end"
          />
          <Button
            disabled
            variant="outline"
            label="Save"
            icon={<Kbd keys="Mod+S" platform="apple" />}
            iconPosition="end"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Success / danger context (inherits colour)</Label>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-success flex items-center gap-2 text-sm">
            Undo <Kbd keys="Mod+Z" platform="apple" />
          </p>
          <p className="text-danger flex items-center gap-2 text-sm">
            Delete <Kbd keys="Mod+Backspace" platform="apple" />
          </p>
          <Button
            color="danger"
            label="Delete"
            icon={<Kbd variant="subtle" keys="Mod+Backspace" platform="apple" />}
            iconPosition="end"
          />
        </div>
      </div>
    </section>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <section className="flex flex-col gap-6">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density} className="flex flex-col gap-2">
          <Label>{density}</Label>
          <div className="flex flex-wrap items-center gap-4">
            {sizes.map((size) => (
              <Kbd key={size} size={size} keys="Mod+Shift+P" platform="apple" />
            ))}
            <Kbd.Group size="md">
              <Kbd>Ctrl</Kbd>
              <Kbd>B</Kbd>
            </Kbd.Group>
            <Button label="Save" icon={<Kbd keys="Mod+S" platform="apple" />} iconPosition="end" />
          </div>
        </div>
      ))}
    </section>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <section className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="bg-surface-base text-fg-default flex flex-col gap-4 rounded-lg p-6"
        >
          <Label>{theme}</Label>
          {variants.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-4">
              <span className="text-fg-muted w-16 text-xs">{variant}</span>
              {sizes.map((size) => (
                <Kbd key={size} variant={variant} size={size} keys="Mod+K" platform="apple" />
              ))}
              <Kbd variant={variant} keys="Mod+Shift+P" platform="windows" format="full" />
            </div>
          ))}
          <div className="text-fg-muted flex flex-wrap items-center gap-4 text-sm">
            Muted <Kbd keys="Mod+K" platform="apple" />
            <span className="text-success flex items-center gap-2">
              Success <Kbd keys="Mod+Z" platform="apple" />
            </span>
            <span className="text-danger flex items-center gap-2">
              Danger <Kbd keys="Mod+Backspace" platform="apple" />
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button label="Save" icon={<Kbd keys="Mod+S" platform="apple" />} iconPosition="end" />
            <Button
              color="brand"
              label="Publish"
              icon={<Kbd variant="subtle" keys="Mod+Enter" platform="apple" />}
              iconPosition="end"
            />
            <Button
              disabled
              label="Save"
              icon={<Kbd keys="Mod+S" platform="apple" />}
              iconPosition="end"
            />
            <aside className="bg-fg-default text-surface-base inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs">
              Tooltip <Kbd size="sm" keys="Mod+S" platform="apple" />
            </aside>
          </div>
        </div>
      ))}
    </section>
  ),
};
