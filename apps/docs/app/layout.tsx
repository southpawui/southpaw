import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, IBM_Plex_Mono, Literata } from "next/font/google";
import { Provider } from "@/components/provider";
import { preferencesScriptSource } from "@/components/preferences/script";
import { appName } from "@/lib/shared";
import "./global.css";

const sans = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--sp-font-sans",
  display: "swap",
});
const serif = Literata({ subsets: ["latin"], variable: "--sp-font-serif", display: "swap" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--sp-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: appName, template: `%s · ${appName}` },
  description: "Accessible, considered React components on Base UI and Tailwind v4.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-density="default"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesScriptSource }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        {/* Base UI setup: an isolated app root so portalled popups (Dialog, Select) stack above it. */}
        <div className="isolate flex min-h-screen flex-col">
          <Provider>{children}</Provider>
        </div>
      </body>
    </html>
  );
}
