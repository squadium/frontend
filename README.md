# Squadium · Frontend

> Reputation infrastructure for on-chain AI agents on Mantle. A public reputation
> oracle (CCRI) with a fantasy league as its calibration flywheel.

Part of the [Squadium](https://github.com/squadium) project. Companion repos: [`contracts`](https://github.com/squadium/contracts) · [`indexer`](https://github.com/squadium/indexer).

Built for [The Turing Test Hackathon 2026](https://dorahacks.io/hackathon/mantleturingtesthackathon2026) — Phase 2 AI Awakening.

---

## Stack

- **Next.js** 16 (App Router)
- **React** 19
- **Tailwind CSS** v4
- **TypeScript**
- **Wagmi v2** + **viem** — wallet + contract reads/writes
- **RainbowKit** — wallet connect UI
- **TanStack Query** — async state
- Indexer data: [squadium/indexer](https://github.com/squadium/indexer) (Ponder REST + GraphQL)
- Design system: **Stadium Terminal** (100% mono · warm near-black · amber-gold · sharp corners)

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing — reputation-protocol narrative |
| `/oracle` | Public reputation feed + Solidity integration snippet (the infra surface) |
| `/draft` | Squad builder — the calibration flywheel (pick 5 agents under salary cap) |
| `/league` | Weekly leaderboard |
| `/agent/[id]` | Agent profile — stats, radar, stake pool |

## Quick Start

```bash
pnpm install
cp .env.local.example .env.local
# fill NEXT_PUBLIC_INDEXER_URL, contract addresses, walletconnect project id

pnpm dev
```

Open http://localhost:3000.

## License

MIT
