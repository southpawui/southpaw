"use client";

import { Field } from "@southpawui/ui/Field";
import { Select } from "@southpawui/ui/Select";
import { cn } from "@/lib/cn";
import { DENSITIES, THEMES, type Density, type ThemePreference } from "./script";
import { usePreferences } from "./provider";

const themeLabels: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
  "high-contrast": "High contrast",
};

const densityLabels: Record<Density, string> = {
  compact: "Compact",
  default: "Default",
  comfortable: "Comfortable",
};

function PreferenceSelect<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <Field.Root className="flex-row items-center justify-between gap-3">
      <Field.Label className="shrink-0 text-xs">{label}</Field.Label>
      <Select.Root
        items={options.map((o) => ({ value: o, label: labels[o] }))}
        value={value}
        onValueChange={(v) => v && onChange(v as T)}
      >
        <Select.Trigger className="w-36 text-xs" />
        <Select.Portal>
          <Select.Positioner side="top">
            <Select.Popup>
              <Select.List>
                {options.map((o) => (
                  <Select.Item key={o} value={o}>
                    <Select.ItemIndicator />
                    <Select.ItemText>{labels[o]}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
}

/** Theme + density controls. Replaces Fumadocs' light/dark switch (Southpaw has three themes). */
export function PreferencesControls({ className }: { className?: string }) {
  const { theme, density, setTheme, setDensity } = usePreferences();
  return (
    <div data-slot="docs-preferences" className={cn("flex w-full flex-col gap-2", className)}>
      <PreferenceSelect
        label="Theme"
        value={theme}
        options={THEMES}
        labels={themeLabels}
        onChange={setTheme}
      />
      <PreferenceSelect
        label="Density"
        value={density}
        options={DENSITIES}
        labels={densityLabels}
        onChange={setDensity}
      />
    </div>
  );
}
