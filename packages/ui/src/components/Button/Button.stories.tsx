import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import {
  PlusIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  GearSixIcon,
} from "@phosphor-icons/react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["solid", "outline", "ghost"] },
    color: { control: "select", options: ["default", "brand", "danger", "inverse"] },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] },
    iconPosition: { control: "select", options: ["start", "end"] },
    label: { control: "text" },
    srOnly: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ---- Shared ---- */
const variants = ["solid", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;
const densities = ["compact", "default", "comfortable"] as const;

/* ============================================================
 * VARIANTS — solid / outline / ghost across sizes, icons, density
 * ============================================================ */

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      {densities.map((density) => (
        <div key={density} data-density={density}>
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">
            {density}
          </p>
          <div className="flex flex-col gap-6">
            {variants.map((variant) => (
              <div key={variant}>
                <p className="text-fg-muted mb-2 text-xs">{variant}</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size} label={size} />
                    ))}
                    <Button variant={variant} size="icon" icon={<PlusIcon />} srOnly="Add" />
                  </div>
                  <div className="flex items-center gap-3">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={variant}
                        size={size}
                        icon={<PlusIcon />}
                        label="Icon start"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={variant}
                        size={size}
                        icon={<ArrowRightIcon />}
                        iconPosition="end"
                        label="Icon end"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * COLORS — default / brand / danger / inverse, each with all variants
 * ============================================================ */

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["default", "brand", "danger"] as const).map((color) => (
        <div key={color}>
          <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">{color}</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {variants.map((variant) => (
                <Button key={variant} color={color} variant={variant} label={variant} />
              ))}
              <Button color={color} size="icon" icon={<PlusIcon />} srOnly="Add" />
            </div>
            <div className="flex items-center gap-3">
              {variants.map((variant) => (
                <Button
                  key={variant}
                  color={color}
                  variant={variant}
                  icon={<PlusIcon />}
                  label={variant}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="bg-accent rounded-lg p-6">
        <p className="text-fg-on-brand mb-2 text-xs font-medium uppercase tracking-wide">inverse</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {variants.map((variant) => (
              <Button key={variant} color="inverse" variant={variant} label={variant} />
            ))}
            <Button color="inverse" size="icon" icon={<PlusIcon />} srOnly="Add" />
          </div>
          <div className="flex items-center gap-3">
            {variants.map((variant) => (
              <Button
                key={variant}
                color="inverse"
                variant={variant}
                icon={<PlusIcon />}
                label={variant}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {variants.map((variant) => (
          <Button key={variant} disabled variant={variant} label={variant} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button disabled color="brand" label="Brand" />
        <Button disabled color="danger" label="Danger" />
        <Button disabled icon={<PlusIcon />} label="With icon" />
        <Button disabled size="icon" icon={<GearSixIcon />} srOnly="Settings" />
      </div>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">Variants</p>
        <div className="flex items-center gap-3">
          <Button loading label="Solid" />
          <Button loading variant="outline" label="Outline" />
          <Button loading variant="ghost" label="Ghost" />
        </div>
      </div>
      <div>
        <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">Colors</p>
        <div className="flex items-center gap-3">
          <Button loading color="brand" label="Brand" />
          <Button loading color="danger" label="Danger" />
        </div>
      </div>
      <div>
        <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">Sizes</p>
        <div className="flex items-center gap-3">
          <Button loading size="sm" label="Small" />
          <Button loading size="md" label="Medium" />
          <Button loading size="lg" label="Large" />
          <Button loading size="icon" srOnly="Loading" />
        </div>
      </div>
      <div>
        <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">
          Replaces icon
        </p>
        <div className="flex items-center gap-3">
          <Button icon={<PlusIcon />} label="Not loading" />
          <Button loading icon={<PlusIcon />} label="Loading" />
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Button label="Default" />
              <Button color="brand" label="Brand" />
              <Button variant="outline" label="Outline" />
              <Button variant="ghost" label="Ghost" />
              <Button color="danger" label="Danger" />
            </div>
            <div className="flex items-center gap-3">
              <Button icon={<PlusIcon />} label="Add" />
              <Button color="brand" icon={<ArrowRightIcon />} iconPosition="end" label="Next" />
              <Button variant="outline" icon={<MagnifyingGlassIcon />} label="Search" />
              <Button color="danger" variant="ghost" icon={<TrashIcon />} label="Delete" />
              <Button size="icon" icon={<GearSixIcon />} srOnly="Settings" variant="ghost" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
