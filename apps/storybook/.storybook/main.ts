import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    const tailwindcss = await import("@tailwindcss/vite");
    config.plugins = [...(config.plugins || []), tailwindcss.default()];
    config.esbuild = { jsx: "automatic" };
    return config;
  },
};

export default config;
