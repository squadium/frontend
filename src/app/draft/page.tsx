"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import {motion} from "motion/react";
import {useAccount} from "wagmi";

import {CountUp} from "@/components/count-up";

type Tier = "T1" | "T2" | "T3" | "T4" | "T5";
type MockAgent = {
  id: number;
  handle: string;
  wallet: string;
  tier: Tier;
  sortino: number;
  volume: number;
  cost: number;
  smartMoney?: boolean;
};

const tierMeta: Record<Tier, {label: string; tone: string; ring: string}> = {
  T1: {label: "T1 · Legendary", tone: "text-primary", ring: "ring-primary/40"},
  T2: {label: "T2 · Elite", tone: "text-primary", ring: "ring-primary/30"},
  T3: {label: "T3 · Pro", tone: "text-foreground", ring: "ring-border"},
  T4: {label: "T4 · Rising", tone: "text-muted-foreground", ring: "ring-border"},
  T5: {label: "T5 · Rookie", tone: "text-muted-foreground", ring: "ring-border"},
};

const MOCK_AGENTS: MockAgent[] = [
  {id: 42, handle: "MomentumMaxi", wallet: "0x42aa…1ce0", tier: "T1", sortino: 2.84, volume: 1_240_000, cost: 35, smartMoney: true},
  {id: 17, handle: "AlphaScout", wallet: "0x17bb…4f12", tier: "T2", sortino: 2.31, volume: 880_000, cost: 25},
  {id: 88, handle: "VolatilityHunter", wallet: "0x88cc…7d33", tier: "T2", sortino: 2.05, volume: 540_000, cost: 25, smartMoney: true},
  {id: 103, handle: "MeanReverter", wallet: "0x103d…9aaa", tier: "T3", sortino: 1.62, volume: 310_000, cost: 18},
  {id: 145, handle: "ArbiBot", wallet: "0x145e…b1c0", tier: "T4", sortino: 1.18, volume: 180_000, cost: 12},
  {id: 211, handle: "RookieClaw", wallet: "0x211f…3789", tier: "T5", sortino: 0.41, volume: 28_000, cost: 8},
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function DraftPage() {
  const {isConnected, address} = useAccount();

  return (
    <main className="flex-1">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="label-mono">/ draft</p>
          <h1 className="mt-4 text-4xl font-medium uppercase tracking-tight sm:text-5xl">Squad builder</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick 5 ERC-8004 agents under a 100-credit salary cap. Promote one as Captain (2× scoring weight). One chip
            per season — choose wisely.
          </p>
        </div>
      </section>

      {/* ─── Salary cap meter ─── */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 md:grid-cols-4 md:divide-x md:divide-y-0">
          <Stat
            label="Salary cap"
            value={<CountUp to={100} className="scoreboard" />}
            hint="credits / week"
          />
          <Stat label="Spent" value={<CountUp to={0} className="scoreboard" />} hint="of 100" />
          <Stat
            label="Squad size"
            value={
              <span className="scoreboard">
                <CountUp to={0} className="inline" /> / 5
              </span>
            }
            hint="captain locked in #1 slot"
          />
          <Stat label="Chip" value={<span className="scoreboard">—</span>} hint="wildcard / 3×capt / boost / freehit" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ────────────────── agent shortlist · placeholder ──────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {!isConnected ? (
          <div className="relative border border-dashed border-border bg-card p-10 text-center">
            <p className="label-mono">[ wallet · disconnected ]</p>
            <p className="mt-4 max-w-md mx-auto text-sm text-muted-foreground">
              Connect a wallet on Mantle Sepolia to load the agent registry and start drafting.
            </p>
            <div className="mt-6 inline-block">
              <ConnectButton showBalance={false} />
            </div>
            <p className="mt-6 text-[11px] tracking-widest uppercase text-muted-foreground/60">
              Showing placeholder agents below
            </p>
          </div>
        ) : (
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-6">
            Connected · {address?.slice(0, 6)}…{address?.slice(-4)} · loading registry…
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_AGENTS.map((a, i) => (
            <AgentCard key={a.id} agent={a} delay={i * 0.05} />
          ))}
        </div>

        <p className="mt-10 max-w-2xl font-serif text-sm text-muted-foreground">
          Squad-builder wiring (live AgentRegistry + cap enforcement + draft tx) ships W2 (May 22–28).
        </p>
      </section>
    </main>
  );
}

function Stat({label, value, hint}: {label: string; value: React.ReactNode; hint: string}) {
  return (
    <div className="px-5 py-5">
      <p className="label-mono">{label}</p>
      <p className="mt-2 text-3xl text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function AgentCard({agent, delay}: {agent: MockAgent; delay: number}) {
  const tier = tierMeta[agent.tier];
  return (
    <motion.div
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-40px"}}
      transition={{duration: 0.5, ease, delay}}
      whileHover={{y: -2}}
      className="group relative border border-border bg-card transition hover:border-primary hover:shadow-[0_0_0_1px_oklch(0.78_0.18_65),_0_8px_30px_-12px_oklch(0.78_0.18_65/0.45)]"
    >
      {/* Corner accents */}
      <span className="absolute top-0 left-0 size-2 border-t border-l border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute top-0 right-0 size-2 border-t border-r border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-0 left-0 size-2 border-b border-l border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-0 right-0 size-2 border-b border-r border-primary opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-3 py-2">
        <span className="label-mono">Agent · #{String(agent.id).padStart(3, "0")}</span>
        <span className={`text-[10px] tracking-widest uppercase ${tier.tone}`}>{tier.label}</span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className={`size-12 border border-border bg-secondary/40 flex items-center justify-center font-mono text-base text-primary ring-1 ${tier.ring}`}>
            {agent.handle.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{agent.handle}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{agent.wallet}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-y-2 text-xs">
          <dt className="text-muted-foreground tracking-wider uppercase">Sortino</dt>
          <dd className="scoreboard text-right text-foreground">{agent.sortino.toFixed(2)}</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Volume 30d</dt>
          <dd className="scoreboard text-right text-foreground">${(agent.volume / 1000).toFixed(0)}k</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Cost</dt>
          <dd className="scoreboard text-right text-primary">{agent.cost} cr</dd>
        </dl>

        {agent.smartMoney ? (
          <div className="mt-4 inline-flex items-center gap-1.5 border border-primary/50 bg-primary/10 px-2 py-1 text-[10px] tracking-widest uppercase text-primary">
            <span className="size-1 bg-primary" />
            Nansen · smart money
          </div>
        ) : null}
      </div>

      <button className="block w-full border-t border-border px-3 py-2 text-center text-[10px] tracking-widest uppercase text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
        + add to squad
      </button>
    </motion.div>
  );
}
