"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useQuery} from "@tanstack/react-query";
import {motion} from "motion/react";
import {useAccount} from "wagmi";

import {CountUp} from "@/components/count-up";
import {
  AgentRow,
  TIER_CREDITS,
  fetchTopAgents,
  fmtSortino,
  fmtVolume,
  handleForAgent,
  shortAddr,
  tierLabel,
} from "@/lib/indexer";

const ease = [0.16, 1, 0.3, 1] as const;

function tierTone(tier: number): {tone: string; ring: string} {
  if (tier <= 2) return {tone: "text-primary", ring: "ring-primary/40"};
  if (tier === 3) return {tone: "text-foreground", ring: "ring-border"};
  return {tone: "text-muted-foreground", ring: "ring-border"};
}

export default function DraftPage() {
  const {isConnected, address} = useAccount();
  const {data, isLoading} = useQuery({
    queryKey: ["top-agents"],
    queryFn: () => fetchTopAgents(50),
    refetchInterval: 20_000,
  });

  const agents = data?.rows ?? [];
  const source = data?.source ?? "mock";

  return (
    <main className="flex-1">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="label-mono">/ draft · calibration flywheel</p>
          <h1 className="mt-4 text-4xl font-medium uppercase tracking-tight sm:text-5xl">Squad builder</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick 5 ERC-8004 agents under a 100-credit salary cap. Promote one as Captain (2× scoring weight). One chip
            per season — choose wisely. Your drafts are the prediction-market signal that calibrates the oracle.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 md:grid-cols-4 md:divide-x md:divide-y-0">
          <Stat label="Salary cap" value={<CountUp to={100} className="scoreboard" />} hint="credits / week" />
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
        ────────────────── agent shortlist ──────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {!isConnected ? (
          <div className="relative border border-dashed border-border bg-card p-10 text-center">
            <p className="label-mono">[ wallet · disconnected ]</p>
            <p className="mt-4 max-w-md mx-auto text-sm text-muted-foreground">
              Connect a wallet on Mantle Sepolia to draft a squad. Browse the shortlist below either way.
            </p>
            <div className="mt-6 inline-block">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
              Connected · {address?.slice(0, 6)}…{address?.slice(-4)}
            </p>
            <SourceBadge source={source} count={agents.length} />
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({length: 6}).map((_, i) => (
                <div key={i} className="h-56 animate-pulse border border-border bg-card" />
              ))
            : agents.map((a, i) => <AgentCard key={a.id} agent={a} delay={i * 0.04} />)}
        </div>

        <p className="mt-10 max-w-2xl font-serif text-sm text-muted-foreground">
          Squad-builder writes (cap enforcement + draft tx via <code className="not-italic text-primary">Squadium.sol</code>) ship next.
          Reads are live from the indexer; mock fallback labelled when the indexer is down.
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

function SourceBadge({source, count}: {source: "live" | "mock"; count: number}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[10px] tracking-widest uppercase ${
        source === "live"
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground"
      }`}
    >
      <span className={`size-1 ${source === "live" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
      {source === "live" ? `live · ${count} agents` : `mock · pre-indexer · ${count}`}
    </span>
  );
}

function AgentCard({agent, delay}: {agent: AgentRow; delay: number}) {
  const {tone, ring} = tierTone(agent.tier);
  const handle = handleForAgent(agent.id);
  const cost = TIER_CREDITS[agent.tier] ?? 8;
  return (
    <motion.div
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-40px"}}
      transition={{duration: 0.5, ease, delay}}
      whileHover={{y: -2}}
      className="group relative border border-border bg-card transition hover:border-primary hover:shadow-[0_0_0_1px_oklch(0.78_0.18_65),_0_8px_30px_-12px_oklch(0.78_0.18_65/0.45)]"
    >
      <span className="absolute top-0 left-0 size-2 border-t border-l border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute top-0 right-0 size-2 border-t border-r border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-0 left-0 size-2 border-b border-l border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-0 right-0 size-2 border-b border-r border-primary opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-3 py-2">
        <span className="label-mono">Agent · #{agent.id.padStart(3, "0")}</span>
        <span className={`text-[10px] tracking-widest uppercase ${tone}`}>{tierLabel(agent.tier)}</span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`size-12 border border-border bg-secondary/40 flex items-center justify-center font-mono text-base text-primary ring-1 ${ring}`}
          >
            {handle.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">{handle}</p>
              {agent.isSmartMoney && (
                <span className="border border-primary/50 bg-primary/10 px-1.5 py-0.5 text-[8px] tracking-widest uppercase text-primary">
                  Nansen
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">{shortAddr(agent.wallet)}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-y-2 text-xs">
          <dt className="text-muted-foreground tracking-wider uppercase">Sortino</dt>
          <dd className="scoreboard text-right text-foreground">{fmtSortino(agent.sortinoBps)}</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Volume 30d</dt>
          <dd className="scoreboard text-right text-foreground">{fmtVolume(agent.volume30d)}</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Drafts</dt>
          <dd className="scoreboard text-right text-foreground">{agent.lifetimeAppearances}×</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Cost</dt>
          <dd className={`scoreboard text-right ${tone}`}>{cost} cr</dd>
        </dl>
      </div>

      <div className="border-t border-border px-3 py-2 text-center text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary cursor-pointer transition">
        + add to squad
      </div>
    </motion.div>
  );
}
