import type { Preview } from "@storybook/react";
import "../styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark", "high-contrast"],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Density",
      toolbar: {
        title: "Density",
        icon: "component",
        items: ["compact", "default", "comfortable"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    density: "default",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const density = context.globals.density || "default";
      document.documentElement.setAttribute("data-theme", theme);
      // Skip global density when the story manages its own (e.g. Density comparison stories)
      if (context.parameters.density?.disable) {
        document.documentElement.removeAttribute("data-density");
      } else {
        document.documentElement.setAttribute("data-density", density);
      }
      // Sync canvas background with theme
      document.body.style.backgroundColor = `var(--sp-surface-base)`;
      document.body.style.color = `var(--sp-fg-default)`;
      return Story();
    },
  ],
};

export default preview;
