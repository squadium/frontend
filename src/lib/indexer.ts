/**
 * Typed client for the Squadium indexer REST surface (squadium/indexer).
 *
 * Every fetcher transparently falls back to a labelled mock when the indexer
 * isn't reachable — the UI stays demoable pre-indexer-boot and auto-flips to
 * live data when NEXT_PUBLIC_INDEXER_URL responds.
 */

export const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL ?? "http://localhost:42069";

export type SourceTag = "live" | "mock";

// ────────────────────────────────────────────────────────────────────────────
// Shared lookups
// ────────────────────────────────────────────────────────────────────────────

export const TIER_CREDITS: Record<number, number> = {1: 35, 2: 25, 3: 18, 4: 12, 5: 8};

export function tierLabel(t: number): string {
  return (
    ({1: "T1 · Legendary", 2: "T2 · Elite", 3: "T3 · Pro", 4: "T4 · Rising", 5: "T5 · Rookie"} as Record<number, string>)[
      t
    ] ?? "T?"
  );
}

/** USDC-style 6-decimal volume → "$1.24M" */
export function fmtVolume(raw: string): string {
  const n = Number(raw) / 1_000_000;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
}

/** signed bps → 2.84 */
export function fmtSortino(raw: string): string {
  return (Number(raw) / 10_000).toFixed(2);
}

export function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// ────────────────────────────────────────────────────────────────────────────
// On-chain seed mirror — used for mock + handle resolution
// (Matches contracts/script/Seed.s.sol exactly)
// ────────────────────────────────────────────────────────────────────────────

const SEEDED: Array<{id: string; handle: string; wallet: string; tier: number; sortinoBps: string; volume30d: string; isSmartMoney: boolean}> = [
  {id: "42",  handle: "MomentumMaxi",     wallet: "0x42aa000000000000000000000000000000001ce0", tier: 1, sortinoBps: "28400", volume30d: "1240000000000", isSmartMoney: true},
  {id: "17",  handle: "AlphaScout",       wallet: "0x17bB000000000000000000000000000000004F12", tier: 2, sortinoBps: "23100", volume30d: "880000000000",  isSmartMoney: false},
  {id: "88",  handle: "VolatilityHunter", wallet: "0x88cc000000000000000000000000000000007D33", tier: 2, sortinoBps: "20500", volume30d: "540000000000",  isSmartMoney: true},
  {id: "103", handle: "MeanReverter",     wallet: "0x103D000000000000000000000000000000009aAA", tier: 3, sortinoBps: "16200", volume30d: "310000000000",  isSmartMoney: false},
  {id: "145", handle: "ArbiBot",          wallet: "0x145E00000000000000000000000000000000B1c0", tier: 4, sortinoBps: "11800", volume30d: "180000000000",  isSmartMoney: false},
  {id: "211", handle: "RookieClaw",       wallet: "0x211f000000000000000000000000000000003789", tier: 5, sortinoBps: "4100",  volume30d: "28000000000",   isSmartMoney: false},
  {id: "64",  handle: "RegimeRider",      wallet: "0x6440000000000000000000000000000000001234", tier: 3, sortinoBps: "17400", volume30d: "410000000000",  isSmartMoney: true},
  {id: "31",  handle: "ClawSniper",       wallet: "0x3170000000000000000000000000000000005678", tier: 2, sortinoBps: "21300", volume30d: "720000000000",  isSmartMoney: false},
  {id: "7",   handle: "GammaGoblin",      wallet: "0x0700000000000000000000000000000000009aBc", tier: 4, sortinoBps: "9400",  volume30d: "95000000000",   isSmartMoney: false},
  {id: "255", handle: "DeltaNeutralius",  wallet: "0xFf00000000000000000000000000000000000def", tier: 3, sortinoBps: "14800", volume30d: "220000000000",  isSmartMoney: false},
];

export function handleForAgent(id: string): string {
  return SEEDED.find((a) => a.id === id)?.handle ?? `Agent#${id}`;
}

export function walletForAgent(id: string): string {
  return SEEDED.find((a) => a.id === id)?.wallet ?? "0x0000…0000";
}

// ────────────────────────────────────────────────────────────────────────────
// Reputation feed (used by /oracle)
// ────────────────────────────────────────────────────────────────────────────

export interface ReputationRow {
  id: string;
  score: number;
  confidence: number;
  tier: number;
  asOf: string;
  horizon: string;
  nonce: string;
  updatedAt: string;
}

export interface OracleFeed {
  count: number;
  asOf: number;
  rows: ReputationRow[];
  source: SourceTag;
}

function mockOracleFeed(): OracleFeed {
  const now = Math.floor(Date.now() / 1000);
  const rows: ReputationRow[] = SEEDED.map((a, i) => {
    const score = Math.max(400, 9600 - i * 980 - (i % 2) * 140);
    const confidence = Math.max(2500, 9200 - i * 540);
    return {
      id: a.id,
      score,
      confidence,
      tier: a.tier,
      asOf: String(now - i * 1800),
      horizon: "604800",
      nonce: String(i + 1),
      updatedAt: String(now - i * 1800),
    };
  });
  return {count: rows.length, asOf: Date.now(), rows, source: "mock"};
}

export async function fetchOracleFeed(limit = 50): Promise<OracleFeed> {
  try {
    const res = await fetch(`${INDEXER_URL}/oracle?limit=${limit}`, {cache: "no-store"});
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as Omit<OracleFeed, "source">;
    if (!data.rows?.length) return mockOracleFeed();
    return {...data, source: "live"};
  } catch {
    return mockOracleFeed();
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Top agents (used by /draft, /league captain lookup)
// ────────────────────────────────────────────────────────────────────────────

export interface AgentRow {
  id: string;
  wallet: string;
  erc8004TokenId: string;
  tier: number;
  sortinoBps: string;
  volume30d: string;
  isSmartMoney: boolean;
  lifetimeAppearances: number;
  captainCount: number;
  mvpWeeks: number;
  lastUpdate: string;
  createdAt: string;
}

export interface TopAgents {
  rows: AgentRow[];
  source: SourceTag;
}

function mockTopAgents(): TopAgents {
  const now = String(Math.floor(Date.now() / 1000));
  const rows: AgentRow[] = SEEDED.map((a, i) => ({
    id: a.id,
    wallet: a.wallet,
    erc8004TokenId: String(i + 1),
    tier: a.tier,
    sortinoBps: a.sortinoBps,
    volume30d: a.volume30d,
    isSmartMoney: a.isSmartMoney,
    lifetimeAppearances: Math.max(6, 160 - i * 14),
    captainCount: Math.max(0, 60 - i * 6),
    mvpWeeks: Math.max(0, 5 - Math.floor(i / 2)),
    lastUpdate: now,
    createdAt: now,
  }));
  return {rows, source: "mock"};
}

export async function fetchTopAgents(limit = 50): Promise<TopAgents> {
  try {
    const res = await fetch(`${INDEXER_URL}/agents/top?limit=${limit}`, {cache: "no-store"});
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {rows: AgentRow[]};
    if (!data.rows?.length) return mockTopAgents();
    return {rows: data.rows, source: "live"};
  } catch {
    return mockTopAgents();
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Leaderboard (used by /league)
// ────────────────────────────────────────────────────────────────────────────

export interface SquadRow {
  id: string;
  weekId: string;
  user: string;
  agent0: string;
  agent1: string;
  agent2: string;
  agent3: string;
  agent4: string;
  captainIdx: number;
  chip: number;
  locked: boolean;
  settled: boolean;
  finalScore: string;
  draftedAt: string;
}

export interface Leaderboard {
  weekId: string;
  rows: SquadRow[];
  source: SourceTag;
}

const MOCK_MANAGERS = [
  "0x42aa000000000000000000000000000000001ce0",
  "0x9b1c000000000000000000000000000000000a4f",
  "0xdee2000000000000000000000000000000005122",
  "0xa0c1000000000000000000000000000000007e22",
  "0x317f00000000000000000000000000000000cd91",
  "0x6605000000000000000000000000000000004b40",
  "0xfee0000000000000000000000000000000002010",
  "0xc41b000000000000000000000000000000003a50",
  "0x551a000000000000000000000000000000007777",
  "0xee29000000000000000000000000000000cd2200",
];

function mockLeaderboard(weekId: bigint): Leaderboard {
  // Score is bps × 100 just for mock spread; chip 0..4 rotating; captain rotates
  const rows: SquadRow[] = MOCK_MANAGERS.map((m, i) => {
    const score = Math.round(14_270 - i * 540);
    return {
      id: `${weekId}-${m}`,
      weekId: weekId.toString(),
      user: m,
      agent0: SEEDED[i % SEEDED.length]!.id,
      agent1: SEEDED[(i + 1) % SEEDED.length]!.id,
      agent2: SEEDED[(i + 2) % SEEDED.length]!.id,
      agent3: SEEDED[(i + 3) % SEEDED.length]!.id,
      agent4: SEEDED[(i + 4) % SEEDED.length]!.id,
      captainIdx: i % 5,
      chip: i % 5, // 0..4
      locked: true,
      settled: true,
      finalScore: String(score),
      draftedAt: String(Math.floor(Date.now() / 1000) - i * 3600),
    };
  });
  return {weekId: weekId.toString(), rows, source: "mock"};
}

export async function fetchLeaderboard(weekId: bigint): Promise<Leaderboard> {
  try {
    const res = await fetch(`${INDEXER_URL}/leaderboard/${weekId.toString()}`, {cache: "no-store"});
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {weekId: string; rows: SquadRow[]};
    if (!data.rows?.length) return mockLeaderboard(weekId);
    return {weekId: data.weekId, rows: data.rows, source: "live"};
  } catch {
    return mockLeaderboard(weekId);
  }
}

export function chipLabel(c: number): "—" | "Wildcard" | "3×Capt" | "Boost" | "Freehit" {
  return (["—", "Wildcard", "3×Capt", "Boost", "Freehit"] as const)[c] ?? "—";
}

// ────────────────────────────────────────────────────────────────────────────
// Agent profile (used by /agent/[id])
// ────────────────────────────────────────────────────────────────────────────

export interface StakePoolRow {
  id: string;
  totalStaked: string;
  totalShares: string;
  slashCount: number;
  lastSlashAt: string;
}

export interface AgentDetail {
  agent: AgentRow | null;
  stakePool: StakePoolRow | null;
  reputation: ReputationRow | null;
  source: SourceTag;
}

function mockAgentDetail(id: string): AgentDetail {
  const top = mockTopAgents();
  const agent = top.rows.find((r) => r.id === id) ?? top.rows[0] ?? null;
  const feed = mockOracleFeed();
  const reputation = feed.rows.find((r) => r.id === id) ?? null;
  return {
    agent,
    reputation,
    stakePool: agent
      ? {
          id: agent.id,
          totalStaked: "4218000000000000000", // 4.218 mETH (wei)
          totalShares: "4218000000000000000",
          slashCount: 0,
          lastSlashAt: "0",
        }
      : null,
    source: "mock",
  };
}

export async function fetchAgent(id: string): Promise<AgentDetail> {
  try {
    const res = await fetch(`${INDEXER_URL}/agent/${id}`, {cache: "no-store"});
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as Omit<AgentDetail, "source">;
    if (!data.agent) return mockAgentDetail(id);
    return {...data, source: "live"};
  } catch {
    return mockAgentDetail(id);
  }
}
