/* ============================================================
 * Tabs: server-safe entry (GEO-972)
 *
 * The parts live in ./Tabs.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Tabs.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab } from "./Tabs.parts";

export type * from "./Tabs.parts";

export const Tabs: {
  Root: typeof TabsRoot;
  List: typeof TabsList;
  Tab: typeof TabsTab;
  Panel: typeof TabsPanel;
  Indicator: typeof TabsIndicator;
} = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
};
