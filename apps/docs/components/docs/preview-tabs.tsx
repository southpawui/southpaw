"use client";

import { Tabs } from "@southpawui/ui/Tabs";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Preview / Code tabs for a registry example (shadcn component-preview-tabs, on Southpaw Tabs). */
export function PreviewTabs({
  label,
  preview,
  code,
  align = "center",
  className,
}: {
  label: string;
  preview: ReactNode;
  code: ReactNode;
  align?: "center" | "start" | "end";
  className?: string;
}) {
  return (
    <Tabs.Root
      data-slot="docs-preview"
      defaultValue="preview"
      className={cn("not-prose my-6", className)}
    >
      {/* Short lists never scroll; visible overflow keeps the focus ring unclipped. */}
      <Tabs.List
        aria-label={`${label}: preview or code`}
        className="[[data-orientation=horizontal]_&]:overflow-visible"
      >
        <Tabs.Tab value="preview">Preview</Tabs.Tab>
        <Tabs.Tab value="code">Code</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel
        value="preview"
        aria-label={`${label} preview`}
        className="border-border-default bg-surface-base rounded-[var(--radius-lg)] border"
      >
        <div
          data-align={align}
          className="flex min-h-56 w-full justify-center p-6 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center sm:p-10"
        >
          {preview}
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="code" className="[&_figure]:my-0 [&_pre]:max-h-[28rem]">
        {code}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
