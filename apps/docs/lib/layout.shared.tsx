import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { PreferencesControls } from "@/components/preferences/controls";
import { appName, githubUrl } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <span className="font-semibold">{appName}</span>,
    },
    githubUrl,
    // Southpaw's theme + density controls take the theme switch's place.
    slots: { themeSwitch: PreferencesControls },
  };
}
