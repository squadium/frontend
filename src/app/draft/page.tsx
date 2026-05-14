"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount} from "wagmi";

export default function DraftPage() {
  const {isConnected, address} = useAccount();

  return (
    <main className="flex-1">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="label-mono">/ draft</p>
          <h1 className="mt-4 text-4xl font-medium uppercase tracking-tight sm:text-5xl">Squad builder</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick 5 ERC-8004 agents under a 100-credit salary cap. Promote one as Captain (2× scoring weight).
            One chip per season — choose wisely.
          </p>
        </div>
      </section>

      {/* ─── Salary cap meter ─── */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 md:grid-cols-4 md:divide-x md:divide-y-0">
          <Stat label="Salary cap" value="100" hint="credits / week" />
          <Stat label="Spent" value="0" hint="of 100" />
          <Stat label="Squad size" value="0 / 5" hint="captain locked in #1 slot" />
          <Stat label="Chip" value="—" hint="wildcard / 3×capt / boost / freehit" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ────────────────── agent shortlist ──────────────────
      </div>

      {/* ─── Body ─── */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {!isConnected ? (
          <div className="border border-dashed border-border bg-card p-10 text-center">
            <p className="label-mono">[ wallet · disconnected ]</p>
            <p className="mt-4 max-w-md mx-auto text-sm text-muted-foreground">
              Connect a wallet on Mantle Sepolia to load the agent registry and start drafting.
            </p>
            <div className="mt-6 inline-block">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({length: 6}).map((_, i) => (
              <AgentCardSkeleton key={i} idx={i} address={address ?? "0x…"} />
            ))}
          </div>
        )}

        <p className="mt-10 max-w-2xl font-serif text-sm text-muted-foreground">
          Squad builder ships W2 (May 22–28). For now the skeleton confirms the wagmi connection works and the
          agent feed renders.
        </p>
      </section>
    </main>
  );
}

function Stat({label, value, hint}: {label: string; value: string; hint: string}) {
  return (
    <div className="px-5 py-5">
      <p className="label-mono">{label}</p>
      <p className="scoreboard mt-2 text-3xl text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function AgentCardSkeleton({idx, address}: {idx: number; address: string}) {
  return (
    <div className="border border-border bg-card transition hover:border-primary">
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-3 py-2">
        <span className="label-mono">Agent · #{String(idx + 1).padStart(3, "0")}</span>
        <span className="text-[10px] tracking-widest uppercase text-primary">T5 · Rookie</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-12 border border-border bg-secondary/40 flex items-center justify-center font-mono text-xs text-muted-foreground">
            ?
          </div>
          <div className="font-mono text-xs text-muted-foreground truncate">
            {address.slice(0, 6)}…{address.slice(-4)}
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-y-2 text-xs">
          <dt className="text-muted-foreground tracking-wider uppercase">Sortino</dt>
          <dd className="scoreboard text-right">—</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Volume 30d</dt>
          <dd className="scoreboard text-right">—</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Cost</dt>
          <dd className="scoreboard text-right text-primary">8 cr</dd>
        </dl>
      </div>
      <div className="border-t border-border px-3 py-2 text-center text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary cursor-pointer transition">
        + add to squad
      </div>
    </div>
  );
}
