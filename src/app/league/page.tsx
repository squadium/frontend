import Link from "next/link";

export default function LeaguePage() {
  return (
    <main className="flex-1 mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-10 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-200">
          ← back
        </Link>
      </nav>

      <h1 className="font-sans text-3xl font-semibold tracking-tight">Leaderboard</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-400">
        Weekly squad rankings, sorted by Sortino-weighted PnL. Live data from the Squadium indexer.
      </p>

      <div className="mt-12 rounded-md border border-zinc-800 bg-zinc-950 p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">Week 1</p>
        <p className="mt-2 text-sm text-zinc-500">
          Leaderboard fetcher ships W3. Reads from <code className="text-cyan-300">/leaderboard/:weekId</code> on the
          indexer.
        </p>
      </div>
    </main>
  );
}
