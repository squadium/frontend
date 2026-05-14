"use client";

/**
 * TickerBar — Bloomberg-style rolling stat strip above the SiteNav.
 *
 * For W1 the data is placeholder (— for everything). When the indexer is
 * wired we'll fetch real values; the rolling animation stays the same.
 */
import {motion} from "motion/react";

type Tick = {label: string; value: string; trend?: "up" | "down" | "flat"};

const ticks: Tick[] = [
  {label: "Agents", value: "0", trend: "flat"},
  {label: "Squads · W1", value: "0", trend: "flat"},
  {label: "Top Sortino", value: "—", trend: "flat"},
  {label: "mETH staked", value: "0.000", trend: "flat"},
  {label: "Reward pool", value: "—", trend: "flat"},
  {label: "Slashes · 7d", value: "0", trend: "flat"},
  {label: "Chain", value: "Mantle Sepolia · 5003", trend: "flat"},
  {label: "Indexer", value: "syncing", trend: "flat"},
];

export function TickerBar() {
  const loop = [...ticks, ...ticks];

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="relative flex h-7 items-center overflow-hidden">
        <span className="z-10 flex items-center gap-2 border-r border-border bg-primary px-3 h-full text-[10px] tracking-[0.25em] uppercase text-primary-foreground font-medium">
          <span className="inline-block size-1.5 bg-primary-foreground animate-pulse" />
          Live
        </span>
        <motion.div
          className="flex shrink-0 items-center gap-8 whitespace-nowrap pl-8 will-change-transform"
          animate={{x: ["0%", "-50%"]}}
          transition={{duration: 60, repeat: Infinity, ease: "linear"}}
        >
          {loop.map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-[11px] tracking-wider">
              <span className="uppercase text-muted-foreground">{t.label}</span>
              <span className={`scoreboard ${t.trend === "up" ? "text-primary" : "text-foreground"}`}>{t.value}</span>
              <span className="text-muted-foreground/40">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
