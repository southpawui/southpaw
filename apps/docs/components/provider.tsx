"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { PreferencesProvider } from "@/components/preferences/provider";
import SearchDialog from "@/components/search";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      {/* next-themes is off: Southpaw's three themes are handled by PreferencesProvider. */}
      <RootProvider theme={{ enabled: false }} search={{ SearchDialog }}>
        {children}
      </RootProvider>
    </PreferencesProvider>
  );
}
