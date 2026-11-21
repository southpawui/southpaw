"use client";

import * as React from "react";
import { Components } from "@/registry/__components__";

export function RegistryDemo({ name }: { name: string }) {
  const Demo = Components[name];
  if (!Demo) return null;
  return (
    <React.Suspense fallback={<p className="text-fg-muted text-sm">Loading example…</p>}>
      <Demo />
    </React.Suspense>
  );
}
