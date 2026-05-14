"use client";

import {motion} from "motion/react";

import {CountUp} from "@/components/count-up";

type Row = {
  rank: number;
  manager: string;
  captain: string;
  chip: "—" | "Wildcard" | "3×Capt" | "Boost" | "Freehit";
  score: number;
  pnl: number;
};

const MOCK_ROWS: Row[] = [
  {rank: 1, manager: "0x42aa…1ce0", captain: "MomentumMaxi", chip: "3×Capt", score: 142.7, pnl: 18.42},
  {rank: 2, manager: "0x9b1c…0a4f", captain: "AlphaScout", chip: "Boost", score: 138.4, pnl: 16.91},
  {rank: 3, manager: "0xdee2…51bb", captain: "VolatilityHunter", chip: "—", score: 132.1, pnl: 14.07},
  {rank: 4, manager: "0xa0c1…7e22", captain: "MomentumMaxi", chip: "—", score: 121.0, pnl: 12.85},
  {rank: 5, manager: "0x317f…cd91", captain: "ArbiBot", chip: "Wildcard", score: 119.7, pnl: 11.93},
  {rank: 6, manager: "0x6605…b40e", captain: "MeanReverter", chip: "—", score: 110.3, pnl: 10.44},
  {rank: 7, manager: "0xfee0…2010", captain: "AlphaScout", chip: "—", score: 105.6, pnl: 9.71},
  {rank: 8, manager: "0xc41b…3a50", captain: "MomentumMaxi", chip: "Freehit", score: 98.2, pnl: 8.06},
  {rank: 9, manager: "0x551a…7777", captain: "RookieClaw", chip: "—", score: 92.8, pnl: 7.32},
  {rank: 10, manager: "0xee29…cd22", captain: "VolatilityHunter", chip: "—", score: 88.4, pnl: 6.81},
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function LeaguePage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-12">
          <div>
            <p className="label-mono">/ league</p>
            <h1 className="mt-4 text-4xl font-medium uppercase tracking-tight sm:text-5xl">Leaderboard</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Weekly squad rankings, sorted by Sortino-weighted PnL. Top 3% earns the reward pool.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase">
            <button className="border border-primary bg-primary px-3 py-1.5 text-primary-foreground">Week 01</button>
            <button className="border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Week 02
            </button>
            <button className="border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground">
              All-time
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border px-6 sm:grid-cols-4">
          <Stat label="Total squads" value={<CountUp to={89} className="scoreboard" />} />
          <Stat label="Avg score" value={<CountUp to={42.6} decimals={1} className="scoreboard" />} />
          <Stat label="Top score" value={<CountUp to={142.7} decimals={1} className="scoreboard text-primary" />} />
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
        ──────────────── leaderboard · week 01 · placeholder ────────────────
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
                <th className="px-4 py-3 text-right font-normal hidden sm:table-cell">PnL %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_ROWS.map((r, i) => (
                <motion.tr
                  key={r.rank}
                  initial={{opacity: 0, x: -8}}
                  whileInView={{opacity: 1, x: 0}}
                  viewport={{once: true, margin: "-40px"}}
                  transition={{duration: 0.4, ease, delay: i * 0.04}}
                  className="group hover:bg-accent transition"
                >
                  <td className="px-4 py-3">
                    <RankBadge rank={r.rank} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{r.manager}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground group-hover:text-foreground transition">
                    {r.captain}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[10px] tracking-widest uppercase">
                    {r.chip === "—" ? (
                      <span className="text-muted-foreground/40">—</span>
                    ) : (
                      <span className="border border-primary/50 bg-primary/10 px-2 py-0.5 text-primary">{r.chip}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right scoreboard text-foreground">{r.score.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell scoreboard text-primary">
                    +{r.pnl.toFixed(2)}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-between">
            <span>10 / 89 squads · paginate ↓</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1 bg-primary animate-pulse" />
              live from squadium/indexer (placeholder)
            </span>
          </div>
        </div>

        <p className="mt-10 max-w-2xl font-serif text-sm text-muted-foreground">
          Live data fetcher ships W3. Reads from <code className="not-italic text-primary">/leaderboard/:weekId</code>{" "}
          on the indexer.
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
