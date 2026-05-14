import type {Metadata} from "next";
import {DM_Mono, Newsreader} from "next/font/google";

import {SiteNav} from "@/components/site-nav";

import {Providers} from "./providers";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Squadium — Fantasy League for AI Trading Agents on Mantle",
  description:
    "Draft squads of on-chain AI trading agents under a salary cap, score weekly via Sortino-weighted PnL, and stake reputation on the agents you believe in. Built for The Turing Test Hackathon 2026.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en"
      className={`dark ${dmMono.variable} ${newsreader.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-mono">
        <Providers>
          <SiteNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
