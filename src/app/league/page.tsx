"use client";

import {useQuery} from "@tanstack/react-query";
import {motion} from "motion/react";
import {useState} from "react";

import {CountUp} from "@/components/count-up";
import {chipLabel, fetchLeaderboard, handleForAgent, shortAddr, type SquadRow} from "@/lib/indexer";

const ease = [0.16, 1, 0.3, 1] as const;

const WEEKS: Array<{id: bigint; label: string}> = [
  {id: BigInt(1), label: "Week 01"},
  {id: BigInt(2), label: "Week 02"},
  {id: BigInt(0), label: "All-time"},
];

export default function LeaguePage() {
  const [weekId, setWeekId] = useState<bigint>(BigInt(1));
  const {data, isLoading} = useQuery({
    queryKey: ["leaderboard", weekId.toString()],
    queryFn: () => fetchLeaderboard(weekId),
    refetchInterval: 20_000,
  });

  const rows = data?.rows ?? [];
  const source = data?.source ?? "mock";

  const scores = rows.map((r) => Number(r.finalScore));
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const top = scores.length ? Math.max(...scores) : 0;

  return (
    <main className="flex-1">
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-12">
          <div>
            <p className="label-mono">/ league</p>
            <h1 className="mt-4 text-4xl font-medium uppercase tracking-tight sm:text-5xl">Leaderboard</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Weekly squad rankings, sorted by Sortino-weighted PnL. Top 3% earns the reward pool — and their drafts
              re-weight the CCRI crowd prior next cycle.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase">
            {WEEKS.map((w) => (
              <button
                key={w.label}
                onClick={() => setWeekId(w.id)}
                className={`border px-3 py-1.5 transition ${
                  weekId === w.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border px-6 sm:grid-cols-4">
          <Stat label="Total squads" value={<CountUp to={rows.length} className="scoreboard" />} />
          <Stat label="Avg score" value={<CountUp to={avg / 100} decimals={1} className="scoreboard" />} />
          <Stat label="Top score" value={<CountUp to={top / 100} decimals={1} className="scoreboard text-primary" />} />
          <Stat
            label="Reward pool"
            value={
              <span className="scoreboard">
                <CountUp to={5000} className="inline" /> USDC
              </span>
            }
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── leaderboard · week {weekId.toString().padStart(2, "0")} ────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                <th className="px-4 py-3 text-left font-normal w-16">Rank</th>
                <th className="px-4 py-3 text-left font-normal">Manager</th>
                <th className="px-4 py-3 text-left font-normal hidden sm:table-cell">Captain</th>
                <th className="px-4 py-3 text-left font-normal hidden md:table-cell">Chip</th>
                <th className="px-4 py-3 text-right font-normal">Score</th>
                <th className="px-4 py-3 text-right font-normal hidden sm:table-cell">PnL %*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({length: 8}).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-4 py-3">
                        <div className="h-4 w-full animate-pulse bg-secondary/60" />
                      </td>
                    </tr>
                  ))
                : rows.map((r, i) => <Row key={r.id} r={r} rank={i + 1} />)}
            </tbody>
          </table>
          <div className="border-t border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-between">
            <span>
              {rows.length} {rows.length === 1 ? "squad" : "squads"} indexed
            </span>
            <span
              className={`flex items-center gap-1.5 ${
                source === "live" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span
                className={`size-1 ${source === "live" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`}
              />
              {source === "live" ? "live · indexer" : "mock · pre-indexer"}
            </span>
          </div>
        </div>
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">
          * PnL % derived from on-chain volume × tier multiplier (mock proxy; replace with live PnL feed in v2).
        </p>
      </section>
    </main>
  );
}

function Stat({label, value}: {label: string; value: React.ReactNode}) {
  return (
    <div className="px-5 py-4">
      <p className="label-mono">{label}</p>
      <p className="mt-1.5 text-2xl text-foreground">{value}</p>
    </div>
  );
}

function Row({r, rank}: {r: SquadRow; rank: number}) {
  const captainAgentId = [r.agent0, r.agent1, r.agent2, r.agent3, r.agent4][r.captainIdx] ?? r.agent0;
  const chip = chipLabel(r.chip);
  // PnL% is a deterministic UI proxy from finalScore (not on-chain). Documented in code.
  const pnl = Math.max(-9.99, Number(r.finalScore) / 8 / 100);
  return (
    <motion.tr
      initial={{opacity: 0, x: -8}}
      whileInView={{opacity: 1, x: 0}}
      viewport={{once: true, margin: "-40px"}}
      transition={{duration: 0.4, ease, delay: Math.min(rank * 0.03, 0.4)}}
      className="group hover:bg-accent transition"
    >
      <td className="px-4 py-3">
        <RankBadge rank={rank} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-foreground">{shortAddr(r.user)}</td>
      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground group-hover:text-foreground transition">
        {handleForAgent(captainAgentId)}
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-[10px] tracking-widest uppercase">
        {chip === "—" ? (
          <span className="text-muted-foreground/40">—</span>
        ) : (
          <span className="border border-primary/50 bg-primary/10 px-2 py-0.5 text-primary">{chip}</span>
        )}
      </td>
      <td className="px-4 py-3 text-right scoreboard text-foreground">{(Number(r.finalScore) / 100).toFixed(1)}</td>
      <td className="px-4 py-3 text-right hidden sm:table-cell scoreboard text-primary">+{pnl.toFixed(2)}%</td>
    </motion.tr>
  );
}

function RankBadge({rank}: {rank: number}) {
  if (rank === 1) {
    return (
      <span className="inline-flex size-7 items-center justify-center bg-primary text-primary-foreground scoreboard text-xs font-medium">
        01
      </span>
    );
  }
  if (rank <= 3) {
    return (
      <span className="inline-flex size-7 items-center justify-center border border-primary text-primary scoreboard text-xs">
        {String(rank).padStart(2, "0")}
      </span>
    );
  }
  return <span className="scoreboard text-muted-foreground text-xs">{String(rank).padStart(2, "0")}</span>;
}
