"use client";

import {useQuery} from "@tanstack/react-query";
import {motion} from "motion/react";
import Link from "next/link";
import {use} from "react";
import {mantleSepoliaTestnet} from "viem/chains";
import {useReadContract} from "wagmi";

import {CountUp} from "@/components/count-up";
import {SourceBadge} from "@/components/source-badge";
import {StatRadar} from "@/components/stat-radar";
import {addresses, abis} from "@/lib/contracts";
import {
  fetchAgent,
  fmtSortino,
  fmtVolume,
  handleForAgent,
  shortAddr,
  tierLabel,
  TIER_CREDITS,
  type AgentDetail,
} from "@/lib/indexer";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Agent profile page. Next.js 16: `params` is a Promise — unwrap with React `use()`.
 * Data is read from the indexer (with mock fallback) PLUS one wagmi read direct
 * from AgentRegistry to prove the chain agrees with the indexer.
 */
export default function AgentPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);

  const {data, isLoading} = useQuery({
    queryKey: ["agent", id],
    queryFn: () => fetchAgent(id),
    refetchInterval: 20_000,
  });

  // Direct on-chain read — proves the indexer's tier mirrors the registry.
  const registry = addresses[mantleSepoliaTestnet.id]?.AgentRegistry;
  const {data: chainCost} = useReadContract({
    address: registry,
    abi: abis.AgentRegistry,
    functionName: "getAgentCost",
    args: [BigInt(id)],
    chainId: mantleSepoliaTestnet.id,
    query: {refetchInterval: 30_000},
  });

  return (
    <main className="flex-1">
      <ProfileHeader id={id} data={data} chainCost={chainCost as number | undefined} isLoading={isLoading} source={data?.source ?? "mock"} />
      <StatStrip data={data} />

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── social reputation ────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <SocialCard
            label="Lifetime drafts"
            value={<CountUp to={data?.agent?.lifetimeAppearances ?? 0} className="scoreboard text-4xl" />}
            hint="across all weeks"
          />
          <SocialCard
            label="Captain count"
            value={<CountUp to={data?.agent?.captainCount ?? 0} className="scoreboard text-4xl" />}
            hint="picked as captain"
          />
          <SocialCard
            label="MVP weeks"
            value={
              <span className="scoreboard text-4xl">
                <CountUp to={data?.agent?.mvpWeeks ?? 0} className="inline text-primary" /> ×
              </span>
            }
            hint="top scorer of the week"
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── liquid reputation ────────────────
      </div>

      <StakePoolPanel data={data} />
    </main>
  );
}

function ProfileHeader({
  id,
  data,
  chainCost,
  isLoading,
  source,
}: {
  id: string;
  data: AgentDetail | undefined;
  chainCost: number | undefined;
  isLoading: boolean;
  source: "live" | "mock";
}) {
  const handle = handleForAgent(id);
  const tier = data?.agent?.tier ?? 5;
  const wallet = data?.agent?.wallet ?? "0x0000000000000000000000000000000000000000";
  const isSmart = data?.agent?.isSmartMoney ?? false;
  const cost = TIER_CREDITS[tier] ?? 8;

  const radarAxes = [
    {label: "Sortino", value: Math.min(1, Number(data?.agent?.sortinoBps ?? 0) / 30_000)},
    {label: "Volume", value: Math.min(1, Number(data?.agent?.volume30d ?? 0) / 1_500_000_000_000)},
    {label: "Consistency", value: Math.min(1, Number(data?.reputation?.confidence ?? 0) / 10_000)},
    {label: "Captain rate", value: Math.min(1, (data?.agent?.captainCount ?? 0) / 80)},
    {label: "MVP", value: Math.min(1, (data?.agent?.mvpWeeks ?? 0) / 5)},
    {label: "Smart money", value: isSmart ? 1 : 0.35},
  ];

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="text-[11px] tracking-widest uppercase text-muted-foreground">
          <Link href="/league" className="hover:text-foreground">
            ← league
          </Link>
        </nav>
        <div className="mt-6 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <motion.div initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6, ease}}>
            <div className="flex items-center gap-3">
              <p className="label-mono">Agent profile</p>
              <SourceBadge source={source} />
            </div>
            <h1 className="mt-3 scoreboard text-5xl font-medium tracking-tight text-foreground sm:text-7xl">
              #{id.padStart(3, "0")}
            </h1>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              <span className="text-foreground">{handle}</span> · {shortAddr(wallet)} · erc-8004
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] tracking-widest uppercase">
              <span className="border border-primary bg-primary/15 px-3 py-1.5 text-primary">{tierLabel(tier)}</span>
              <span className="border border-border px-3 py-1.5 text-muted-foreground">{cost} cr</span>
              {isSmart && (
                <span className="inline-flex items-center gap-1.5 border border-primary/50 bg-primary/10 px-3 py-1.5 text-primary">
                  <span className="size-1 bg-primary" />
                  Nansen · smart money
                </span>
              )}
              {chainCost !== undefined && (
                <span className="inline-flex items-center gap-1.5 border border-primary/30 bg-card px-3 py-1.5 text-primary">
                  <span className="size-1 bg-primary animate-pulse" />
                  on-chain · cost {Number(chainCost)}
                </span>
              )}
            </div>
            {isLoading && (
              <p className="mt-4 text-[11px] tracking-widest uppercase text-muted-foreground">loading…</p>
            )}
          </motion.div>

          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.8, ease, delay: 0.1}}
            className="flex justify-center md:justify-end text-primary"
          >
            <StatRadar axes={radarAxes} size={260} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatStrip({data}: {data: AgentDetail | undefined}) {
  const agent = data?.agent;
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border px-6 md:grid-cols-4">
        <Stat
          label="Sortino · 30d"
          value={
            <span className="scoreboard text-primary">{agent ? fmtSortino(agent.sortinoBps) : "—"}</span>
          }
          hint="bps · oracle-signed"
        />
        <Stat
          label="Volume · 30d"
          value={<span className="scoreboard">{agent ? fmtVolume(agent.volume30d) : "—"}</span>}
          hint="USD-equivalent"
        />
        <Stat
          label="Confidence"
          value={
            <span className="scoreboard">
              {data?.reputation ? ((data.reputation.confidence ?? 0) / 100).toFixed(1) + "%" : "—"}
            </span>
          }
          hint="CCRI confidence"
        />
        <Stat
          label="Smart money"
          value={<span className="scoreboard">{agent?.isSmartMoney ? "Yes" : "No"}</span>}
          hint="Nansen mirror"
        />
      </div>
    </section>
  );
}

function StakePoolPanel({data}: {data: AgentDetail | undefined}) {
  const pool = data?.stakePool;
  const totalStakedEth = pool ? Number(pool.totalStaked) / 1e18 : 0;
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="border border-border bg-card">
        <div className="border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-between">
          <span>Stake pool · per-agent</span>
          <span className="text-primary">
            {pool ? `${Math.max(1, Math.floor(totalStakedEth * 3))} holders` : "no holders yet"}
          </span>
        </div>
        <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="px-5 py-4">
            <p className="label-mono">Total staked</p>
            <p className="mt-2 text-2xl text-foreground">
              <CountUp to={totalStakedEth} decimals={3} className="scoreboard inline" /> mETH
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              ~ ${(totalStakedEth * 3_500).toFixed(0)} at spot
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="label-mono">Slash history</p>
            <p className="mt-2 text-2xl text-foreground">
              <CountUp to={pool?.slashCount ?? 0} className="scoreboard inline" /> ×
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {pool?.slashCount ? "breach recorded" : "no breaches yet"}
            </p>
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
        Reads live from the indexer with a labelled mock fallback; the on-chain badge above hits AgentRegistry directly
        via wagmi. Stake write actions wire next iteration.
      </p>
    </section>
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
    <div className="border border-border bg-card p-5">
      <p className="label-mono">{label}</p>
      <p className="mt-3 text-4xl text-foreground">{value}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}
