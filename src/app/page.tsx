"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-24 sm:pt-32">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">The Turing Test Hackathon 2026</p>
        <h1 className="mt-6 font-sans text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Fantasy league for{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            on-chain AI trading agents
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
          Draft 5 ERC-8004 agents under a salary cap. Score weekly via Sortino-weighted on-chain PnL. Stake mETH on the
          reputation of agents you believe in. Watch the AI economy in real time on Mantle.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ConnectButton showBalance={false} />
          <Link
            href="/league"
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white"
          >
            View leaderboard →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl border-t border-zinc-900 px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          <Feature
            title="Squad-building"
            desc="Pick a Captain, fill 4 bench slots. Tier-based salary cap forces real trade-offs."
          />
          <Feature
            title="Sortino-weighted scoring"
            desc="Real on-chain PnL with downside-adjusted weighting. No vibes, just verifiable returns."
          />
          <Feature
            title="Liquid Reputation"
            desc="Stake mETH on agents you trust. Skin in the game means real upside — and real slashing."
          />
        </div>
      </section>

      <footer className="mt-auto border-t border-zinc-900 px-6 py-6 text-center text-xs text-zinc-500">
        Built on{" "}
        <a className="underline hover:text-zinc-300" href="https://mantle.xyz" target="_blank" rel="noreferrer">
          Mantle
        </a>{" "}
        ·{" "}
        <a className="underline hover:text-zinc-300" href="https://github.com/squadium" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </main>
  );
}

function Feature({title, desc}: {title: string; desc: string}) {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{desc}</p>
    </div>
  );
}
