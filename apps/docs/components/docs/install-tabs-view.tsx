"use client";

import { Tabs } from "@southpawui/ui/Tabs";
import type { ReactNode } from "react";
import { MANAGERS, type Manager } from "@/lib/install";

export type { Manager };

/** Package-manager tabs around one command per manager. */
export function ManagerTabs({
  label,
  blocks,
}: {
  label: string;
  blocks: Record<Manager, ReactNode>;
}) {
  return (
    <Tabs.Root defaultValue="pnpm" className="[&_figure]:my-0">
      <Tabs.List aria-label={label} className="[[data-orientation=horizontal]_&]:overflow-visible">
        {MANAGERS.map((m) => (
          <Tabs.Tab key={m} value={m} className="px-3 py-1.5 font-mono text-xs">
            {m}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      {MANAGERS.map((m) => (
        <Tabs.Panel key={m} value={m} className="mt-2">
          {blocks[m]}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}

/** southpawui / Manual installation tabs. Opens on Manual until southpawui is published. */
export function InstallTabsView({
  cli,
  manual,
  defaultTab,
}: {
  cli: ReactNode;
  manual: ReactNode;
  defaultTab: "cli" | "manual";
}) {
  return (
    <Tabs.Root data-slot="docs-install" defaultValue={defaultTab} className="not-prose my-6">
      <Tabs.List
        aria-label="Installation method"
        className="[[data-orientation=horizontal]_&]:overflow-visible"
      >
        <Tabs.Tab value="cli" className="font-mono">
          southpawui
        </Tabs.Tab>
        <Tabs.Tab value="manual">Manual</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="cli">{cli}</Tabs.Panel>
      <Tabs.Panel value="manual">{manual}</Tabs.Panel>
    </Tabs.Root>
  );
}
