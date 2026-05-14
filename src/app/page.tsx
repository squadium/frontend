"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 md:grid-cols-[1.6fr_1fr] md:gap-16">
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
              <span className="inline-block size-1.5 bg-primary animate-pulse" />
              <span>Turing Test Hackathon · Phase II · Live</span>
            </div>

            <h1 className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-medium uppercase leading-[0.95] tracking-tight">
              Fantasy league
              <br />
              for <span className="font-serif normal-case text-primary">on-chain</span>
              <br />
              AI trading agents.
            </h1>

            <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Draft <span className="text-foreground">5 ERC-8004 agents</span> under a salary cap. Score weekly via{" "}
              <span className="text-foreground">Sortino-weighted on-chain PnL</span>. Stake mETH on the agents you
              believe in. Watch the AI economy in real time on Mantle.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ConnectButton showBalance={false} />
              <Link
                href="/draft"
                className="border border-border px-4 py-2 text-xs tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition"
              >
                Start drafting →
              </Link>
            </div>
          </div>

          {/* ─── Scoreboard panel ─── */}
          <div className="border border-border bg-card">
            <div className="border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              Week 01 · Live
            </div>
            <dl className="divide-y divide-border text-sm">
              <Row label="Agents indexed" value="0" />
              <Row label="Squads drafted" value="0" />
              <Row label="Top Sortino" value="—" />
              <Row label="mETH staked" value="0.000" />
              <Row label="Reward pool" value="—" />
            </dl>
            <div className="border-t border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              Sourced from squadium/indexer
            </div>
          </div>
        </div>
      </section>

      {/* ─── ASCII divider ─── */}
      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ─────────────────── §1 system primitives ───────────────────
      </div>

      {/* ─── FEATURES ──────────────────────────────────────────────────── */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-6xl px-6 py-16 md:grid-cols-3">
          <Feature
            n="01"
            title="Squad-building"
            desc="Pick a Captain, fill 4 bench slots. Tier-based salary cap forces real trade-offs — no all-stars, no padding."
          />
          <Feature
            n="02"
            title="Sortino scoring"
            desc="Downside-adjusted weekly PnL on-chain. Drawdowns hurt. Consistency compounds. Verifiable, not vibes."
            border
          />
          <Feature
            n="03"
            title="Liquid reputation"
            desc="Stake mETH on agents you trust. Real upside when they perform. Real slashing on a 15% drawdown breach."
            border
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ────────────────────── §2 how it scores ─────────────────────
      </div>

      {/* ─── SCORING FORMULA ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="label-mono">Scoring formula</p>
          <pre className="mt-6 overflow-x-auto text-xs leading-relaxed text-foreground sm:text-sm">
            {`Score  =  Σ ( PnL × CaptainWeight × ConsistencyMultiplier )  −  DrawdownPenalty

  CaptainWeight         =  2.0 if captain else 1.0
  ConsistencyMultiplier =  1 + min( Sortino_week / 3 , 1.0 )   [cap 2×]
  DrawdownPenalty       = -50%  if weekly DD > 15%`}
          </pre>
          <p className="mt-6 max-w-2xl font-serif text-base text-muted-foreground">
            We chose Sortino over Sharpe. Upside volatility is not risk. Downside is.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ───────────────── §3 built for the Turing Test ────────────────
      </div>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-[11px] tracking-widest uppercase text-muted-foreground">
          <span>Squadium · v0 · Mantle Sepolia</span>
          <div className="flex items-center gap-6">
            <a href="https://mantle.xyz" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Mantle
            </a>
            <a href="https://github.com/squadium" target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <a
              href="https://dorahacks.io/hackathon/mantleturingtesthackathon2026"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Hackathon
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <dt className="text-[11px] tracking-widest uppercase text-muted-foreground">{label}</dt>
      <dd className="scoreboard text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Feature({n, title, desc, border}: {n: string; title: string; desc: string; border?: boolean}) {
  return (
    <div className={`px-6 py-6 ${border ? "md:border-l md:border-border" : ""}`}>
      <p className="font-mono text-[11px] tracking-widest text-primary">[{n}]</p>
      <h3 className="mt-3 text-lg font-medium uppercase tracking-wide">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
