import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Anatomy } from "@/components/docs/anatomy";
import { APITable } from "@/components/docs/api-table";
import { ComponentPreview, ComponentSource } from "@/components/docs/component-preview";
import { Alternatives, ContentRule, Guidance } from "@/components/docs/guidance";
import { InstallTabs } from "@/components/docs/install-tabs";
import { KeyboardTable } from "@/components/docs/keyboard-table";
import { ScreenReaderTable } from "@/components/docs/screen-readers";
import { StateTable } from "@/components/docs/state-table";

/** Every MDX page gets the BRIEF §8 template blocks without importing them. */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ComponentPreview,
    ComponentSource,
    InstallTabs,
    Guidance,
    Alternatives,
    ContentRule,
    Anatomy,
    StateTable,
    KeyboardTable,
    ScreenReaderTable,
    APITable,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
