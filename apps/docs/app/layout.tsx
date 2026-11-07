import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Literata, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--sp-font-sans",
  display: "swap",
});

const serif = Literata({
  subsets: ["latin"],
  variable: "--sp-font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--sp-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Southpaw UI",
  description: "Accessible, considered React components on Base UI and Tailwind v4.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
