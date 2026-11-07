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
        items: ["light", "dark"],
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
      document.documentElement.setAttribute("data-density", density);
      return Story();
    },
  ],
};

export default preview;
