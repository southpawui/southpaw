import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/Select",
};

export default meta;
type Story = StoryObj;

/* ---- Shared helper to reduce boilerplate ---- */
function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Select.Item value={value}>
      <Select.ItemIndicator />
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}

function FruitSelect(props?: Record<string, unknown>) {
  return (
    <Select.Root {...props}>
      <Select.Trigger>
        <Select.Value placeholder="Select a fruit..." />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="cherry">Cherry</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
              <SelectItem value="mango">Mango</SelectItem>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <Field.Root>
        <Field.Label>Favourite fruit</Field.Label>
        <FruitSelect />
      </Field.Root>

      <Field.Root>
        <Field.Label>With description</Field.Label>
        <FruitSelect />
        <Field.Description>Choose your preferred fruit for the weekly box.</Field.Description>
      </Field.Root>

      <Field.Root>
        <Field.Label>Item-aligned (native feel)</Field.Label>
        <Select.Root defaultValue="cherry">
          <Select.Trigger>
            <Select.Value placeholder="Select a fruit..." />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner alignItemWithTrigger>
              <Select.Popup>
                <Select.List>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="cherry">Cherry</SelectItem>
                  <SelectItem value="grape">Grape</SelectItem>
                  <SelectItem value="mango">Mango</SelectItem>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Field.Description>
          Popup overlays the trigger with the selected item aligned.
        </Field.Description>
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * GROUPED
 * ============================================================ */

export const Grouped: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Field.Root>
        <Field.Label>Food preference</Field.Label>
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Select a food..." />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List>
                  <Select.Group>
                    <Select.GroupLabel>Fruits</Select.GroupLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="cherry">Cherry</SelectItem>
                  </Select.Group>
                  <Select.Separator />
                  <Select.Group>
                    <Select.GroupLabel>Vegetables</Select.GroupLabel>
                    <SelectItem value="carrot">Carrot</SelectItem>
                    <SelectItem value="broccoli">Broccoli</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                  </Select.Group>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * CLEARABLE
 * ============================================================ */

function ClearableDemo() {
  const [value, setValue] = useState<string | null>("cherry");
  return (
    <Field.Root>
      <Field.Label>Favourite fruit</Field.Label>
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger onClear={value ? () => setValue(null) : undefined}>
          <Select.Value placeholder="Select a fruit..." />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="mango">Mango</SelectItem>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <Field.Description>Click the X to clear your selection.</Field.Description>
    </Field.Root>
  );
}

export const Clearable: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <ClearableDemo />
    </div>
  ),
};

/* ============================================================
 * READ-ONLY
 * ============================================================ */

export const ReadOnly: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Field.Root>
        <Field.Label>Assigned region</Field.Label>
        <Select.Root defaultValue="europe" readOnly>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="americas">Americas</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Field.Description>
          Your region is set by your organisation. Contact support to change it.
        </Field.Description>
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * LONG LIST — virtual scrolling
 * ============================================================ */

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export const LongList: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Select a country..." />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List virtualized>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country.toLowerCase().replace(/\s/g, "-")}>
                      {country}
                    </SelectItem>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Field.Description>
          {COUNTRIES.length} countries with CSS content-visibility optimisation.
        </Field.Description>
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Default</p>
        <Field.Root>
          <Field.Label>Fruit</Field.Label>
          <FruitSelect />
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">With value</p>
        <Field.Root>
          <Field.Label>Fruit</Field.Label>
          <FruitSelect defaultValue="cherry" />
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <Field.Root>
          <Field.Label>Fruit</Field.Label>
          <Select.Root defaultValue="mango">
            <Select.Trigger valid>
              <Select.Value placeholder="Select a fruit..." />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  <Select.List>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="mango">Mango</SelectItem>
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Label>Country</Field.Label>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Select a country..." />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  <Select.List>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
          <Field.Error>Please select a country.</Field.Error>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <Field.Root disabled>
          <Field.Label>Region</Field.Label>
          <FruitSelect disabled />
          <Field.Description>Contact support to change your region.</Field.Description>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Read-only</p>
        <Field.Root>
          <Field.Label>Region</Field.Label>
          <Select.Root defaultValue="europe" readOnly>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  <Select.List>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="americas">Americas</SelectItem>
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
          <Field.Description>Set by your organisation.</Field.Description>
        </Field.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
            {density}
          </p>
          <div className="sm:max-w-md">
            <Field.Root>
              <Field.Label>Fruit</Field.Label>
              <FruitSelect />
              <Field.Description>Hint text.</Field.Description>
            </Field.Root>
          </div>
        </div>
      ))}
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
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="flex flex-col gap-6 sm:max-w-md">
            <Field.Root>
              <Field.Label>Default</Field.Label>
              <FruitSelect />
            </Field.Root>
            <Field.Root>
              <Field.Label>With value</Field.Label>
              <FruitSelect defaultValue="banana" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Valid</Field.Label>
              <Select.Root defaultValue="mango">
                <Select.Trigger valid>
                  <Select.Value placeholder="Select..." />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner>
                    <Select.Popup>
                      <Select.List>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="mango">Mango</SelectItem>
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Error</Field.Label>
              <Select.Root>
                <Select.Trigger>
                  <Select.Value placeholder="Select..." />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner>
                    <Select.Popup>
                      <Select.List>
                        <SelectItem value="a">Option A</SelectItem>
                        <SelectItem value="b">Option B</SelectItem>
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
              <Field.Error>Required.</Field.Error>
            </Field.Root>
            <Field.Root disabled>
              <Field.Label>Disabled</Field.Label>
              <FruitSelect disabled />
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
