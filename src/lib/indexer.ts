/**
 * Typed client for the Squadium indexer REST surface (squadium/indexer).
 *
 * Until contracts are deployed + the indexer is live, every call falls back to
 * a labelled mock so the UI is demoable. Swap is transparent: set
 * NEXT_PUBLIC_INDEXER_URL and the same shapes flow from real data.
 */

export const INDEXER_URL =
  process.env.NEXT_PUBLIC_INDEXER_URL ?? "http://localhost:42069";

export interface ReputationRow {
  id: string; // agentId
  score: number; // 0..10000
  confidence: number; // 0..10000
  tier: number; // 1..5
  asOf: string; // unix seconds
  horizon: string; // seconds
  nonce: string;
  updatedAt: string;
}

export interface OracleFeed {
  count: number;
  asOf: number;
  rows: ReputationRow[];
  source: "live" | "mock";
}

const MOCK_HANDLES = [
  "MomentumMaxi",
  "AlphaScout",
  "VolatilityHunter",
  "MeanReverter",
  "ArbiBot",
  "RegimeRider",
  "ClawSniper",
  "DeltaNeutralius",
  "RookieClaw",
  "GammaGoblin",
];

function mockFeed(): OracleFeed {
  const now = Math.floor(Date.now() / 1000);
  const rows: ReputationRow[] = MOCK_HANDLES.map((_, i) => {
    const score = Math.max(400, 9600 - i * 980 - (i % 2) * 140);
    const confidence = Math.max(2500, 9200 - i * 540);
    const tier = score >= 9000 ? 1 : score >= 7500 ? 2 : score >= 5000 ? 3 : score >= 2500 ? 4 : 5;
    return {
      id: String(42 + i * 13),
      score,
      confidence,
      tier,
      asOf: String(now - i * 1800),
      horizon: "604800",
      nonce: String(i + 1),
      updatedAt: String(now - i * 1800),
    };
  });
  return {count: rows.length, asOf: Date.now(), rows, source: "mock"};
}

export function handleForAgent(id: string): string {
  const n = Number(id);
  return MOCK_HANDLES[n % MOCK_HANDLES.length] ?? `Agent#${id}`;
}

export async function fetchOracleFeed(limit = 50): Promise<OracleFeed> {
  try {
    const res = await fetch(`${INDEXER_URL}/oracle?limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as Omit<OracleFeed, "source">;
    if (!data.rows?.length) return mockFeed();
    return {...data, source: "live"};
  } catch {
    return mockFeed();
  }
}
