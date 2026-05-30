[![CI](https://github.com/squadium/frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/squadium/frontend/actions/workflows/ci.yml)

# Squadium · Frontend

Fantasy draft for on-chain AI trading agents — draft volume and captain picks feed a crowd-prior that blends with model signals into a signed reputation score, pushed to an oracle on Mantle.

---

## what this is

Squadium is the consumer surface of CCRI (Crowd-Calibrated Reputation Inference). Managers draft 5-agent squads under a 100-credit salary cap on Mantle Sepolia (chainId 5003). Draft activity — volume, captain selections, stake — forms a crowd prior. The indexer blends that prior with model signals (Sortino ratio + Pyth market-regime data) into a final score `R = w·R_model + (1−w)·R_crowd`, signs it, and writes it to `AgentReputationOracle` on-chain.

Downstream, `ReputationGatedPool` reads that oracle to set borrow rates. The crowd's collective picks directly control capital access for every agent on-chain.

This repo is the Next.js frontend. Sister repos: [`squadium/contracts`](https://github.com/squadium/contracts) (Foundry, 55/55 tests, deployed) · [`squadium/indexer`](https://github.com/squadium/indexer) (Ponder 0.16 + CCRI service).

---

## the money shot

Both agents below are Tier-3. The only difference is whether the crowd drafted them.

```
agent #42  (MomentumMaxi)  — drafted, captain rate 38%
  → ReputationGatedPool.borrow()  →  6.36% APR  ✓

agent #31  (ClawSniper)    — not drafted this week
  → ReputationGatedPool.borrow()  →  revert ConfidenceTooLow  ✗
```

Same tier. Same model score. Crowd calibration is the variable.

---

## run locally

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Required env vars** (all prefixed `NEXT_PUBLIC_`):

| var | default | notes |
|---|---|---|
| `NEXT_PUBLIC_INDEXER_URL` | `http://localhost:42069` | if unset or unreachable, UI falls back to labelled mock data automatically |
| `NEXT_PUBLIC_DEFAULT_CHAIN_ID` | `5003` | Mantle Sepolia |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | — | free at [cloud.reown.com](https://cloud.reown.com) |

Contract addresses are pre-baked in `src/lib/contracts.ts` as `SEPOLIA_DEFAULTS` — the dapp works on Mantle Sepolia without setting any address vars. Deployed 2026-05-19:

| contract | address |
|---|---|
| AgentRegistry | `0x5C8061694C8c1b4A2aB39762754D9a0DC549fBB1` |
| AgentReputationOracle | `0x6a9aff1F4352648b39De2771A1Ed3f0F85E9D764` |
| Squadium | `0x4299b716F33Be7F43D0Ebf0c1F4863D3fC4b37ec` |
| LiquidReputation | `0xE633d2bBb9D610A3dA777a651C1497257a159557` |
| RewardDistributor | `0x2E4567125B73eEdA6b6B276a7ea7a9a4bd44aC22` |
| ReputationGatedPool | `0x30A9F0d212227d47fBb1D6dF1431E7802376Ea33` |

---

## routes

| route | purpose |
|---|---|
| `/` | landing — reputation-protocol narrative |
| `/oracle` | public reputation feed + Solidity integration snippet |
| `/draft` | squad builder — pick 5 agents under salary cap |
| `/league` | weekly leaderboard |
| `/agent/[id]` | agent profile — stats, radar, stake pool |

---

## stack

- Next.js 16 · App Router · Turbopack
- Tailwind CSS v4
- wagmi v2 + viem 2.49 + RainbowKit
- shadcn/ui · Stadium Terminal theme (DM Mono, Newsreader italic, amber-gold, sharp corners)
- TanStack Query v5

---

## deploy

The frontend is Vercel-ready. `pnpm build` passes CI. Set these vars in your Vercel project settings:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_INDEXER_URL` (point to your hosted indexer)
- `NEXT_PUBLIC_MANTLE_SEPOLIA_RPC` (optional, falls back to `https://rpc.sepolia.mantle.xyz`)

Contract addresses are hardcoded fallbacks — no address vars required unless overriding a redeployment.

---

## sister repos

- **Contracts** — [github.com/squadium/contracts](https://github.com/squadium/contracts)
- **Indexer** — [github.com/squadium/indexer](https://github.com/squadium/indexer)
- **Org** — [github.com/squadium](https://github.com/squadium)

---

## license

MIT — see [LICENSE](./LICENSE).
