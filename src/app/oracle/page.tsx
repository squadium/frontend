"use client";

import {useQuery} from "@tanstack/react-query";
import {motion} from "motion/react";

import {fetchOracleFeed, handleForAgent, type ReputationRow} from "@/lib/indexer";

const ease = [0.16, 1, 0.3, 1] as const;

const TIER_LABEL: Record<number, string> = {
  1: "T1 · Legendary",
  2: "T2 · Elite",
  3: "T3 · Pro",
  4: "T4 · Rising",
  5: "T5 · Rookie",
};

function ago(asOf: string): string {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - Number(asOf));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function OraclePage() {
  const {data, isLoading} = useQuery({
    queryKey: ["oracle-feed"],
    queryFn: () => fetchOracleFeed(50),
    refetchInterval: 15_000,
  });

  return (
    <main className="flex-1">
      {/* ─── Header ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="label-mono">/ oracle · public good</p>
          <h1 className="mt-4 text-4xl font-medium uppercase tracking-tight sm:text-5xl">
            Agent Reputation Oracle
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A forward, confidence-bounded reputation score for every on-chain AI agent — computed by{" "}
            <span className="text-foreground">Crowd-Calibrated Reputation Inference</span> and published on Mantle.
            Any protocol can read it. The fantasy league is the calibration flywheel; this is the output.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] tracking-widest uppercase">
            <span className="border border-border bg-secondary/40 px-3 py-1.5 text-muted-foreground">
              AgentReputationOracle.sol
            </span>
            <span className="border border-border bg-secondary/40 px-3 py-1.5 text-muted-foreground">
              7d horizon
            </span>
            <span
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 ${
                data?.source === "live"
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span
                className={`size-1 ${data?.source === "live" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`}
              />
              {data?.source === "live" ? "live · indexer" : "mock · pre-deploy"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── Feed ─── */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            <span>Reputation feed · ranked by forward score</span>
            <span>{data ? `${data.count} agents` : "loading…"}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                <th className="px-4 py-3 text-left font-normal w-14">#</th>
                <th className="px-4 py-3 text-left font-normal">Agent</th>
                <th className="px-4 py-3 text-left font-normal hidden sm:table-cell">Tier</th>
                <th className="px-4 py-3 text-right font-normal">Score</th>
                <th className="px-4 py-3 text-right font-normal">Conf.</th>
                <th className="px-4 py-3 text-right font-normal hidden md:table-cell">As of</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading || !data
                ? Array.from({length: 8}).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-4 py-3">
                        <div className="h-4 w-full animate-pulse bg-secondary/60" />
                      </td>
                    </tr>
                  ))
                : data.rows.map((r, i) => <Row key={r.id} r={r} i={i} />)}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── consume the oracle ────────────────
      </div>

      {/* ─── Integration snippet ─── */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="label-mono">Integration · Solidity</p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Any Mantle protocol gates on reputation in a few lines. Confidence + freshness are first-class — thin
            history reads low confidence, so consumers never act on noise.
          </p>
          <pre className="mt-6 overflow-x-auto border border-border bg-background p-5 text-xs leading-relaxed text-foreground">
{`import {AgentReputationOracle} from "squadium/AgentReputationOracle.sol";

function borrowRateBps(uint256 agentId) external view returns (uint16) {
    AgentReputationOracle.Reputation memory r = oracle.reputationOf(agentId);

    require(r.tier <= 3,            "min tier T3");      // gate: quality
    require(r.confidence >= 6000,   "min 60% confidence"); // gate: trust
    require(block.timestamp <= r.asOf + 2 days, "stale"); // gate: freshness

    uint16 discount = uint16((uint256(r.score) * 800) / 10000);
    return 1200 - discount;  // up to 8% off base for top agents
}`}
          </pre>
          <p className="mt-5 font-serif text-sm text-muted-foreground">
            Live composability proof: <span className="not-italic text-primary">ReputationGatedPool.sol</span> ships in
            the contracts repo with 9 passing tests.
          </p>
        </div>
      </section>

      {/* ─── How it scores ─── */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Card n="01" t="Model" d="Transparent ensemble over on-chain features (Sortino, drawdown, volume, venue diversity). Auditable weights — no black box." />
          <Card n="02" t="Crowd" d="Fantasy drafts are a prediction market. Stake-weighted human signal forms a prior the model is calibrated against." border />
          <Card n="03" t="Blend" d="R = w·model + (1−w)·crowd. w recalibrates each cycle via Brier score — whichever predicted better earns more weight." border />
        </div>
      </section>
    </main>
  );
}

function Row({r, i}: {r: ReputationRow; i: number}) {
  const conf = (r.confidence / 100).toFixed(1);
  return (
    <motion.tr
      initial={{opacity: 0, x: -8}}
      animate={{opacity: 1, x: 0}}
      transition={{duration: 0.35, ease, delay: Math.min(i * 0.03, 0.4)}}
      className="group hover:bg-accent transition"
    >
      <td className="px-4 py-3 scoreboard text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
      <td className="px-4 py-3">
        <div className="text-foreground">{handleForAgent(r.id)}</div>
        <div className="font-mono text-[10px] text-muted-foreground">agent#{r.id}</div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-[10px] tracking-widest uppercase">
        <span className={r.tier <= 2 ? "text-primary" : "text-muted-foreground"}>
          {TIER_LABEL[r.tier] ?? "—"}
        </span>
      </td>
      <td className="px-4 py-3 text-right scoreboard text-foreground">{r.score.toLocaleString()}</td>
      <td className="px-4 py-3 text-right">
        <span className={`scoreboard ${r.confidence >= 6000 ? "text-primary" : "text-muted-foreground"}`}>
          {conf}%
        </span>
      </td>
      <td className="px-4 py-3 text-right hidden md:table-cell scoreboard text-muted-foreground">{ago(r.asOf)}</td>
    </motion.tr>
  );
}

function Card({n, t, d, border}: {n: string; t: string; d: string; border?: boolean}) {
  return (
    <div className={`px-6 py-6 ${border ? "md:border-l md:border-border" : ""}`}>
      <p className="font-mono text-[11px] tracking-widest text-primary">[{n}]</p>
      <h3 className="mt-3 text-lg font-medium uppercase tracking-wide">{t}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
    </div>
  );
}
