/**
 * Theme and density preferences.
 *
 * Southpaw themes are `data-theme="light|dark|high-contrast"` and density is
 * `data-density="compact|default|comfortable"`, both on <html>. "system" follows the OS:
 * `prefers-contrast: more` → high-contrast, else `prefers-color-scheme`.
 * The `.dark` class is kept in sync for Fumadocs' Shiki code theme.
 */
export const THEME_KEY = "sp-theme";
export const DENSITY_KEY = "sp-density";
export const THEMES = ["system", "light", "dark", "high-contrast"] as const;
export const DENSITIES = ["compact", "default", "comfortable"] as const;
export type ThemePreference = (typeof THEMES)[number];
export type ResolvedTheme = Exclude<ThemePreference, "system">;
export type Density = (typeof DENSITIES)[number];

function preferencesScript(themeKey: string, densityKey: string) {
  const d = document.documentElement;
  let theme: string | null = null;
  let density: string | null = null;
  try {
    theme = localStorage.getItem(themeKey);
    density = localStorage.getItem(densityKey);
  } catch {
    /* storage blocked: fall back to system + default */
  }
  if (theme !== "light" && theme !== "dark" && theme !== "high-contrast") {
    theme = matchMedia("(prefers-contrast: more)").matches
      ? "high-contrast"
      : matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }
  if (density !== "compact" && density !== "comfortable") density = "default";
  d.setAttribute("data-theme", theme);
  d.setAttribute("data-density", density);
  d.classList.toggle("dark", theme === "dark");
  d.style.colorScheme = theme === "dark" ? "dark" : "light";
}

/** Runs before first paint so there's no flash of the wrong theme. */
export const preferencesScriptSource = `(${preferencesScript.toString()})(${JSON.stringify(THEME_KEY)},${JSON.stringify(DENSITY_KEY)})`;
