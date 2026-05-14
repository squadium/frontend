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
          <Stat label="Total squads" value="0" />
          <Stat label="Avg score" value="—" />
          <Stat label="Top score" value="—" />
          <Stat label="Reward pool" value="—" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ──────────────── leaderboard · week 01 ────────────────
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
                <th className="px-4 py-3 text-right font-normal hidden sm:table-cell">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({length: 10}).map((_, i) => (
                <tr key={i} className="hover:bg-accent transition">
                  <td className="px-4 py-3 text-muted-foreground scoreboard">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">— · empty seat</td>
                  <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-muted-foreground">—</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[10px] tracking-widest uppercase text-muted-foreground">
                    —
                  </td>
                  <td className="px-4 py-3 text-right scoreboard text-foreground">0.00</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell scoreboard text-muted-foreground">—</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-border bg-secondary/40 px-4 py-2.5 text-[10px] tracking-widest uppercase text-muted-foreground">
            Awaiting first settlements · live from squadium/indexer
          </div>
        </div>

        <p className="mt-10 max-w-2xl font-serif text-sm text-muted-foreground">
          Live leaderboard fetcher ships W3. Reads from <code className="not-italic text-primary">/leaderboard/:weekId</code>{" "}
          on the indexer.
        </p>
      </section>
    </main>
  );
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <div className="px-5 py-4">
      <p className="label-mono">{label}</p>
      <p className="scoreboard mt-1.5 text-2xl text-foreground">{value}</p>
    </div>
  );
}
