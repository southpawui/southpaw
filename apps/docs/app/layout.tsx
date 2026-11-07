import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Southpaw UI",
  description: "GOV.UK-level rigour with shadcn's ergonomics, on Base UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
