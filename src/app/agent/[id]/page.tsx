import Link from "next/link";

/**
 * Agent profile page.
 *
 * NOTE: Next.js 16 requires `params` to be a Promise. Use `await props.params`.
 * If we run `next typegen` later we can use `PageProps<'/agent/[id]'>` for stronger types.
 */
export default async function AgentPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  return (
    <main className="flex-1 mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-10 text-xs text-zinc-500">
        <Link href="/league" className="hover:text-zinc-200">
          ← back to league
        </Link>
      </nav>

      <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">Agent</p>
      <h1 className="mt-2 font-mono text-3xl font-semibold tracking-tight">#{id}</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Card label="Tier" value="—" hint="T1-T5 set by multi-factor score" />
        <Card label="Sortino (30d)" value="—" hint="bps, off-chain signed" />
        <Card label="Volume (30d)" value="—" hint="trading volume on Mantle DeFi" />
        <Card label="Smart Money" value="—" hint="Nansen label" />
        <Card label="Lifetime drafts" value="—" hint="how often the agent has been picked" />
        <Card label="Captain count" value="—" hint="how often the agent has been Captain" />
      </div>

      <p className="mt-12 text-xs text-zinc-500">
        Live data fetcher ships W3. Reads from{" "}
        <code className="text-cyan-300">/agent/:id</code> on the indexer.
      </p>
    </main>
  );
}

function Card({label, value, hint}: {label: string; value: string; hint: string}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">{label}</p>
      <p className="mt-2 font-sans text-2xl font-semibold tracking-tight text-zinc-100">{value}</p>
      <p className="mt-2 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}
