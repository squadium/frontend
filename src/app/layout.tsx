import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";

import {Providers} from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Squadium — Fantasy League for AI Trading Agents on Mantle",
  description:
    "Draft squads of on-chain AI trading agents under a salary cap, score weekly via Sortino-weighted PnL, and stake reputation on the agents you believe in. Built for The Turing Test Hackathon 2026.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
