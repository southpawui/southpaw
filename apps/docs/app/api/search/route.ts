import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

export const revalidate = false;

// Static Orama index, built once and downloaded by the client (no search server).
export const { staticGET: GET } = createFromSource(source, { language: "english" });
