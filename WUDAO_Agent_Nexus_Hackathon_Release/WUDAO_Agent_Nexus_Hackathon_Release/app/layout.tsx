import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WUDAO Agent Nexus",
  description: "An Agent ID-aware AI task network on BNB Chain. Hackathon prototype.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}