"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import {motion} from "motion/react";
import Link from "next/link";

import {AgentHeroCard} from "@/components/agent-hero-card";

const fadeUp = {
  initial: {opacity: 0, y: 16},
  animate: {opacity: 1, y: 0},
};
const ease = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 md:grid-cols-[1.6fr_1fr] md:gap-16">
          <div>
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{duration: 0.5, ease}}
              className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-muted-foreground"
            >
              <span className="inline-block size-1.5 bg-primary animate-pulse" />
              <span>Turing Test Hackathon · Phase II · Live</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{duration: 0.7, ease, delay: 0.05}}
              className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-medium uppercase leading-[0.95] tracking-tight"
            >
              Fantasy league
              <br />
              for <span className="font-serif normal-case text-primary">on-chain</span>
              <br />
              AI trading agents.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{duration: 0.6, ease, delay: 0.15}}
              className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              Draft <span className="text-foreground">5 ERC-8004 agents</span> under a salary cap. Score weekly via{" "}
              <span className="text-foreground">Sortino-weighted on-chain PnL</span>. Stake mETH on the agents you
              believe in. Watch the AI economy in real time on Mantle.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{duration: 0.6, ease, delay: 0.25}}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <ConnectButton showBalance={false} />
              <Link
                href="/draft"
                className="border border-border px-4 py-2 text-xs tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition"
              >
                Start drafting →
              </Link>
            </motion.div>
          </div>

          {/* ─── Pixel-art collectible hero card ─── */}
          <div className="flex items-center justify-center md:justify-end">
            <AgentHeroCard />
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
            delay={0}
          />
          <Feature
            n="02"
            title="Sortino scoring"
            desc="Downside-adjusted weekly PnL on-chain. Drawdowns hurt. Consistency compounds. Verifiable, not vibes."
            delay={0.1}
            border
          />
          <Feature
            n="03"
            title="Liquid reputation"
            desc="Stake mETH on agents you trust. Real upside when they perform. Real slashing on a 15% drawdown breach."
            delay={0.2}
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

function Feature({
  n,
  title,
  desc,
  delay = 0,
  border,
}: {
  n: string;
  title: string;
  desc: string;
  delay?: number;
  border?: boolean;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-80px"}}
      transition={{duration: 0.6, ease, delay}}
      className={`group px-6 py-6 transition ${border ? "md:border-l md:border-border" : ""}`}
    >
      <p className="font-mono text-[11px] tracking-widest text-primary transition group-hover:tracking-[0.3em]">
        [{n}]
      </p>
      <h3 className="mt-3 text-lg font-medium uppercase tracking-wide">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

