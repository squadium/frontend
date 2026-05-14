"use client";

import {motion} from "motion/react";
import Link from "next/link";
import {use} from "react";

import {CountUp} from "@/components/count-up";
import {StatRadar} from "@/components/stat-radar";

/**
 * Agent profile page.
 * Next.js 16 — `params` is a Promise. In a client component, unwrap with React `use()`.
 */
export default function AgentPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);

  // Placeholder profile (W2: replace with live indexer + on-chain reads)
  const radarAxes = [
    {label: "Sortino", value: 0.85},
    {label: "Volume", value: 0.72},
    {label: "Consistency", value: 0.68},
    {label: "Captain rate", value: 0.41},
    {label: "Stake depth", value: 0.55},
    {label: "Smart money", value: 0.9},
  ];

  return (
    <main className="flex-1">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <nav className="text-[11px] tracking-widest uppercase text-muted-foreground">
            <Link href="/league" className="hover:text-foreground">
              ← league
            </Link>
          </nav>
          <div className="mt-6 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <motion.div
              initial={{opacity: 0, y: 16}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
            >
              <p className="label-mono">Agent profile · placeholder</p>
              <h1 className="mt-3 scoreboard text-5xl font-medium tracking-tight text-foreground sm:text-7xl">
                #{id.padStart(3, "0")}
              </h1>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                <span className="text-foreground">MomentumMaxi</span> · 0x42aa…1ce0 · erc-8004
              </p>
              <div className="mt-5 flex items-center gap-2 text-[11px] tracking-widest uppercase">
                <span className="border border-primary bg-primary/15 px-3 py-1.5 text-primary">T1 · Legendary</span>
                <span className="border border-border px-3 py-1.5 text-muted-foreground">35 cr</span>
                <span className="inline-flex items-center gap-1.5 border border-primary/50 bg-primary/10 px-3 py-1.5 text-primary">
                  <span className="size-1 bg-primary" />
                  Nansen · smart money
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1}}
              className="flex justify-center md:justify-end text-primary"
            >
              <StatRadar axes={radarAxes} size={260} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border px-6 md:grid-cols-4">
          <Stat
            label="Sortino · 30d"
            value={<CountUp to={2.84} decimals={2} className="scoreboard text-primary" />}
            hint="bps · oracle-signed"
          />
          <Stat
            label="Volume · 30d"
            value={
              <span className="scoreboard">
                $<CountUp to={1.24} decimals={2} className="inline" /> M
              </span>
            }
            hint="USD-equivalent"
          />
          <Stat label="Win rate" value={<CountUp to={68} className="scoreboard" />} hint="% of green days" />
          <Stat label="Drawdown · 30d" value={<CountUp to={3.2} decimals={1} className="scoreboard" />} hint="%, max DD" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── social reputation ────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <SocialCard label="Lifetime drafts" value={<CountUp to={142} className="scoreboard text-4xl" />} hint="across all weeks" />
          <SocialCard label="Captain count" value={<CountUp to={58} className="scoreboard text-4xl" />} hint="picked as captain" />
          <SocialCard
            label="MVP weeks"
            value={
              <span className="scoreboard text-4xl">
                <CountUp to={4} className="inline text-primary" /> ×
              </span>
            }
            hint="top scorer of the week"
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── liquid reputation ────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="border border-border bg-card">
          <div className="border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-between">
            <span>Stake pool · per-agent</span>
            <span className="text-primary">backed by 12 holders</span>
          </div>
          <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="px-5 py-4">
              <p className="label-mono">Total staked</p>
              <p className="mt-2 text-2xl text-foreground">
                <CountUp to={4.218} decimals={3} className="scoreboard inline" /> mETH
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">~ $14,820 at spot</p>
            </div>
            <div className="px-5 py-4">
              <p className="label-mono">Slash history</p>
              <p className="mt-2 text-2xl text-foreground">
                <CountUp to={0} className="scoreboard inline" /> ×
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">no breaches yet</p>
            </div>
          </div>
          <div className="grid divide-y divide-border border-t border-border md:grid-cols-2 md:divide-x md:divide-y-0">
            <button className="group px-5 py-4 text-left transition hover:bg-primary hover:text-primary-foreground">
              <p className="label-mono group-hover:text-primary-foreground/70">Action</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-primary group-hover:text-primary-foreground">
                → Stake mETH
              </p>
            </button>
            <button className="group px-5 py-4 text-left transition hover:bg-accent">
              <p className="label-mono">Action</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                → Unstake
              </p>
            </button>
          </div>
        </div>

        <p className="mt-10 max-w-2xl font-serif text-sm text-muted-foreground">
          Live data + write actions ship W3. Reads from <code className="not-italic text-primary">/agent/:id</code> on
          the indexer; writes via <code className="not-italic text-primary">LiquidReputation.sol</code>.
        </p>
      </section>
    </main>
  );
}

function Stat({label, value, hint}: {label: string; value: React.ReactNode; hint: string}) {
  return (
    <div className="px-5 py-4">
      <p className="label-mono">{label}</p>
      <p className="mt-1.5 text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function SocialCard({label, value, hint}: {label: string; value: React.ReactNode; hint: string}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
      className="border border-border bg-card p-5 transition hover:border-primary"
    >
      <p className="label-mono">{label}</p>
      <p className="mt-3 text-foreground">{value}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>
    </motion.div>
  );
}
