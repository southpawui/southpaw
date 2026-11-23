"use client";

import * as React from "react";
import {
  DENSITIES,
  DENSITY_KEY,
  THEMES,
  THEME_KEY,
  type Density,
  type ResolvedTheme,
  type ThemePreference,
} from "./script";

interface PreferencesValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  density: Density;
  setTheme: (theme: ThemePreference) => void;
  setDensity: (density: Density) => void;
}

const PreferencesContext = React.createContext<PreferencesValue | null>(null);

function read<const T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v as T) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the choice lasts for this page view */
  }
}

function systemTheme(): ResolvedTheme {
  if (matchMedia("(prefers-contrast: more)").matches) return "high-contrast";
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme: ResolvedTheme, density: Density) {
  const d = document.documentElement;
  d.setAttribute("data-theme", theme);
  d.setAttribute("data-density", density);
  d.classList.toggle("dark", theme === "dark");
  d.style.colorScheme = theme === "dark" ? "dark" : "light";
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // The blocking script already set the attributes; state starts from the same source.
  const [theme, setThemeState] = React.useState<ThemePreference>("system");
  const [density, setDensityState] = React.useState<Density>("default");
  const [system, setSystem] = React.useState<ResolvedTheme>("light");

  React.useEffect(() => {
    setThemeState(read<ThemePreference>(THEME_KEY, THEMES, "system"));
    setDensityState(read<Density>(DENSITY_KEY, DENSITIES, "default"));
    setSystem(systemTheme());
    const queries = [
      matchMedia("(prefers-contrast: more)"),
      matchMedia("(prefers-color-scheme: dark)"),
    ];
    const onChange = () => setSystem(systemTheme());
    queries.forEach((q) => q.addEventListener("change", onChange));
    return () => queries.forEach((q) => q.removeEventListener("change", onChange));
  }, []);

  const resolvedTheme = theme === "system" ? system : theme;

  React.useEffect(() => {
    apply(resolvedTheme, density);
  }, [resolvedTheme, density]);

  const value = React.useMemo<PreferencesValue>(
    () => ({
      theme,
      resolvedTheme,
      density,
      setTheme: (t) => {
        write(THEME_KEY, t);
        setThemeState(t);
      },
      setDensity: (d) => {
        write(DENSITY_KEY, d);
        setDensityState(d);
      },
    }),
    [theme, resolvedTheme, density],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = React.useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}
