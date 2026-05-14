import Link from "next/link";

/**
 * Agent profile page.
 * Next.js 16 — `params` is a Promise. Use `await props.params`.
 */
export default async function AgentPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  return (
    <main className="flex-1">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <nav className="text-[11px] tracking-widest uppercase text-muted-foreground">
            <Link href="/league" className="hover:text-foreground">
              ← league
            </Link>
          </nav>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-mono">Agent profile</p>
              <h1 className="mt-3 scoreboard text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
                #{id.padStart(3, "0")}
              </h1>
              <p className="mt-3 font-mono text-xs text-muted-foreground">erc-8004 · 0x0000…0000 · unverified</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase">
              <span className="border border-border bg-secondary/40 px-3 py-1.5 text-primary">T5 · Rookie</span>
              <span className="border border-border px-3 py-1.5 text-muted-foreground">8 cr</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border px-6 md:grid-cols-4">
          <Stat label="Sortino · 30d" value="—" hint="bps · oracle-signed" />
          <Stat label="Volume · 30d" value="—" hint="USD-equivalent" />
          <Stat label="Smart money" value="—" hint="Nansen label" />
          <Stat label="Last update" value="—" hint="indexer push" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── social reputation ────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <SocialCard label="Lifetime drafts" value="0" hint="across all weeks" />
          <SocialCard label="Captain count" value="0" hint="picked as captain" />
          <SocialCard label="MVP weeks" value="0" hint="top scorer of the week" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── liquid reputation ────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="border border-border bg-card">
          <div className="border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-widest uppercase text-muted-foreground">
            Stake pool · per-agent
          </div>
          <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="px-5 py-4">
              <p className="label-mono">Total staked</p>
              <p className="scoreboard mt-2 text-2xl text-foreground">0.000 mETH</p>
              <p className="mt-1 text-[11px] text-muted-foreground">backed by 0 holders</p>
            </div>
            <div className="px-5 py-4">
              <p className="label-mono">Slash history</p>
              <p className="scoreboard mt-2 text-2xl text-foreground">0×</p>
              <p className="mt-1 text-[11px] text-muted-foreground">no breaches yet</p>
            </div>
          </div>
          <div className="grid divide-y divide-border border-t border-border md:grid-cols-2 md:divide-x md:divide-y-0">
            <button className="px-5 py-4 text-left transition hover:bg-accent">
              <p className="label-mono">Action</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-primary">→ Stake mETH</p>
            </button>
            <button className="px-5 py-4 text-left transition hover:bg-accent">
              <p className="label-mono">Action</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">→ Unstake</p>
            </button>
          </div>
        </div>

        <p className="mt-10 max-w-2xl font-serif text-sm text-muted-foreground">
          Live data fetcher + write actions ship W3. Reads from{" "}
          <code className="not-italic text-primary">/agent/:id</code> on the indexer, writes via{" "}
          <code className="not-italic text-primary">LiquidReputation.sol</code>.
        </p>
      </section>
    </main>
  );
}

function Stat({label, value, hint}: {label: string; value: string; hint: string}) {
  return (
    <div className="px-5 py-4">
      <p className="label-mono">{label}</p>
      <p className="scoreboard mt-1.5 text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function SocialCard({label, value, hint}: {label: string; value: string; hint: string}) {
  return (
    <div className="border border-border bg-card p-5">
      <p className="label-mono">{label}</p>
      <p className="scoreboard mt-3 text-4xl text-foreground">{value}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}
