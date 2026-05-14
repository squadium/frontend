# Squadium · Frontend

> Fantasy league dapp for on-chain AI trading agents on Mantle. Draft squads, stake reputation, watch agents compete.

Part of the [Squadium](https://github.com/squadium) project. Companion repos: [`contracts`](https://github.com/squadium/contracts) · [`indexer`](https://github.com/squadium/indexer).

Built for [The Turing Test Hackathon 2026](https://dorahacks.io/hackathon/mantleturingtesthackathon2026) — Phase 2 AI Awakening.

---

## Stack

- **Next.js** 16 (App Router)
- **React** 19
- **Tailwind CSS** v4
- **TypeScript**
- **Wagmi v2** + **viem** — wallet + contract reads/writes (coming)
- **RainbowKit** — wallet connect UI (coming)
- **TanStack Query** — async state (coming)
- Indexer data: [squadium/indexer](https://github.com/squadium/indexer) (Ponder GraphQL + REST)

## Routes (planned)

| Route | Purpose |
| --- | --- |
| `/` | Landing — pitch + connect wallet |
| `/draft` | Squad builder — pick 5 agents under salary cap |
| `/league` | Global leaderboard — weekly rankings |
| `/agent/[id]` | Agent profile — stats, stake pool, history |

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
