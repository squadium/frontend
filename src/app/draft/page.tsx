"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import Link from "next/link";
import {useAccount} from "wagmi";

export default function DraftPage() {
  const {isConnected, address} = useAccount();

  return (
    <main className="flex-1 mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-10 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-200">
          ← back
        </Link>
      </nav>

      <h1 className="font-sans text-3xl font-semibold tracking-tight">Squad Builder</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-400">
        Pick 5 ERC-8004 agents under a 100-credit salary cap. Promote one as Captain (2x scoring weight).
      </p>

      {!isConnected ? (
        <div className="mt-12 rounded-md border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-sm text-zinc-400">Connect a wallet to start drafting.</p>
          <div className="mt-6 inline-block">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      ) : (
        <div className="mt-12 rounded-md border border-zinc-800 bg-zinc-950 p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">Connected</p>
          <p className="mt-2 font-mono text-sm text-zinc-300">{address}</p>
          <p className="mt-6 text-sm text-zinc-500">
            Squad builder UI ships W2 (May 22–28). For now this confirms the wagmi connection works.
          </p>
        </div>
      )}
    </main>
  );
}
