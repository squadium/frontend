"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import Link from "next/link";
import {usePathname} from "next/navigation";

const links = [
  {href: "/draft", label: "Draft"},
  {href: "/league", label: "League"},
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-7 z-30 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-6">
        <Link href="/" className="group flex items-center gap-2 text-sm font-medium">
          <span className="relative inline-block size-2 bg-primary">
            <span className="absolute inset-0 bg-primary animate-ping opacity-70" />
          </span>
          <span className="tracking-[0.18em] uppercase">Squadium</span>
        </Link>

        <nav className="flex items-center gap-1 text-xs">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 tracking-widest uppercase transition ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <ConnectButton chainStatus="icon" showBalance={false} accountStatus="address" />
        </div>
      </div>
    </header>
  );
}
