"use client";

import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useQuery} from "@tanstack/react-query";
import {motion} from "motion/react";
import {useEffect, useState} from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {BaseError, ContractFunctionRevertedError} from "viem";
import {mantleSepoliaTestnet} from "viem/chains";

import {CountUp} from "@/components/count-up";
import {
  AgentRow,
  TIER_CREDITS,
  fetchTopAgents,
  fmtSortino,
  fmtVolume,
  handleForAgent,
  shortAddr,
  tierLabel,
} from "@/lib/indexer";
import {addresses, abis} from "@/lib/contracts";

// ─── Constants ────────────────────────────────────────────────────────────────

const SEPOLIA_ID = mantleSepoliaTestnet.id; // 5003
const SALARY_CAP = 100;
const ease = [0.16, 1, 0.3, 1] as const;

/** Matches Squadium.sol enum Chip { None=0, Wildcard=1, TripleCaptain=2, BenchBoost=3, FreeHit=4 } */
const Chip = {
  None: 0,
  Wildcard: 1,
  TripleCaptain: 2,
  BenchBoost: 3,
  FreeHit: 4,
} as const;
type ChipValue = (typeof Chip)[keyof typeof Chip];

const CHIP_LABELS: Record<ChipValue, string> = {
  0: "None",
  1: "Wildcard",
  2: "3×Capt",
  3: "BenchBoost",
  4: "FreeHit",
};

// ─── Tiny inline toast ────────────────────────────────────────────────────────

type ToastEntry = {id: number; kind: "ok" | "err"; msg: string; href?: string};

function useToast() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  let counter = 0;
  function push(kind: "ok" | "err", msg: string, href?: string) {
    const id = ++counter;
    setToasts((prev) => [...prev, {id, kind, msg, href}]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 8000);
  }
  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }
  return {toasts, push, dismiss};
}

function ToastStack({toasts, dismiss}: {toasts: ToastEntry[]; dismiss: (id: number) => void}) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`border px-4 py-3 text-xs font-mono flex items-start justify-between gap-3 ${
            t.kind === "ok"
              ? "border-primary/60 bg-card text-primary"
              : "border-destructive/60 bg-card text-destructive"
          }`}
        >
          <span className="flex-1 leading-relaxed">
            {t.kind === "ok" ? "> " : "! "}
            {t.msg}
            {t.href && (
              <>
                {" "}
                <a
                  href={t.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  [view tx &rarr;]
                </a>
              </>
            )}
          </span>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition"
          >
            [x]
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Tier display helpers ─────────────────────────────────────────────────────

function tierTone(tier: number): {tone: string; ring: string} {
  if (tier <= 2) return {tone: "text-primary", ring: "ring-primary/40"};
  if (tier === 3) return {tone: "text-foreground", ring: "ring-border"};
  return {tone: "text-muted-foreground", ring: "ring-border"};
}

// ─── Chip selector ────────────────────────────────────────────────────────────

function ChipSelector({
  value,
  onChange,
  address,
}: {
  value: ChipValue;
  onChange: (c: ChipValue) => void;
  address: `0x${string}` | undefined;
}) {
  const contractAddr = addresses[SEPOLIA_ID]?.Squadium;
  const abi = abis.Squadium;

  const {data: usedWildcard} = useReadContract({
    address: contractAddr,
    abi,
    functionName: "chipsUsed",
    args: address ? [address, Chip.Wildcard] : undefined,
    query: {enabled: !!address && !!contractAddr},
  });
  const {data: usedTripleCaptain} = useReadContract({
    address: contractAddr,
    abi,
    functionName: "chipsUsed",
    args: address ? [address, Chip.TripleCaptain] : undefined,
    query: {enabled: !!address && !!contractAddr},
  });
  const {data: usedBenchBoost} = useReadContract({
    address: contractAddr,
    abi,
    functionName: "chipsUsed",
    args: address ? [address, Chip.BenchBoost] : undefined,
    query: {enabled: !!address && !!contractAddr},
  });
  const {data: usedFreeHit} = useReadContract({
    address: contractAddr,
    abi,
    functionName: "chipsUsed",
    args: address ? [address, Chip.FreeHit] : undefined,
    query: {enabled: !!address && !!contractAddr},
  });

  const usedMap: Record<ChipValue, boolean | undefined> = {
    0: false,
    1: usedWildcard,
    2: usedTripleCaptain,
    3: usedBenchBoost,
    4: usedFreeHit,
  };

  const chips: ChipValue[] = [Chip.None, Chip.Wildcard, Chip.TripleCaptain, Chip.BenchBoost, Chip.FreeHit];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => {
        const used = usedMap[c] === true;
        const active = value === c;
        return (
          <button
            key={c}
            disabled={used}
            onClick={() => onChange(c)}
            className={`border px-3 py-1.5 text-[10px] tracking-widest uppercase transition
              ${used ? "border-border text-muted-foreground line-through cursor-not-allowed" : ""}
              ${active && !used ? "border-primary bg-primary/10 text-primary" : ""}
              ${!active && !used ? "border-border text-muted-foreground hover:border-primary/50 hover:text-primary" : ""}
            `}
          >
            {used ? `${CHIP_LABELS[c]} · used` : CHIP_LABELS[c]}
          </button>
        );
      })}
    </div>
  );
}

// ─── Selected squad pills ─────────────────────────────────────────────────────

function SquadPills({
  selectedIds,
  captainIdx,
  agents,
  onRemove,
  onPromoteCaptain,
}: {
  selectedIds: string[];
  captainIdx: number;
  agents: AgentRow[];
  onRemove: (id: string) => void;
  onPromoteCaptain: (idx: number) => void;
}) {
  if (!selectedIds.length) {
    return (
      <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
        [ no agents selected ]
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {selectedIds.map((id, idx) => {
        const agent = agents.find((a) => a.id === id);
        const handle = agent ? handleForAgent(id) : `#${id}`;
        const isCaptain = idx === captainIdx;
        return (
          <div
            key={id}
            className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] tracking-wider uppercase
              ${isCaptain ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}
            `}
          >
            <button
              onClick={() => onPromoteCaptain(idx)}
              title="set as captain"
              className={`font-mono transition hover:text-primary ${isCaptain ? "text-primary" : "text-muted-foreground"}`}
            >
              {isCaptain ? "[C]" : "[c]"}
            </button>
            <span className="font-serif italic">{handle}</span>
            <button
              onClick={() => onRemove(id)}
              className="text-muted-foreground hover:text-destructive transition"
              title="remove"
            >
              [x]
            </button>
          </div>
        );
      })}
      {Array.from({length: 5 - selectedIds.length}).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="inline-flex items-center border border-dashed border-border px-3 py-1.5 text-[10px] text-muted-foreground tracking-widest uppercase"
        >
          [ slot {selectedIds.length + i + 1} ]
        </div>
      ))}
    </div>
  );
}

// ─── Agent card ───────────────────────────────────────────────────────────────

function AgentCard({
  agent,
  delay,
  isSelected,
  isCaptain,
  onAdd,
  onRemove,
}: {
  agent: AgentRow;
  delay: number;
  isSelected: boolean;
  isCaptain: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const {tone, ring} = tierTone(agent.tier);
  const handle = handleForAgent(agent.id);
  const cost = TIER_CREDITS[agent.tier] ?? 8;

  return (
    <motion.div
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-40px"}}
      transition={{duration: 0.5, ease, delay}}
      whileHover={{y: -2}}
      className={`group relative border bg-card transition
        ${isSelected
          ? "border-primary shadow-[0_0_0_1px_oklch(0.78_0.18_65)]"
          : "border-border hover:border-primary hover:shadow-[0_0_0_1px_oklch(0.78_0.18_65),_0_8px_30px_-12px_oklch(0.78_0.18_65/0.45)]"
        }
      `}
    >
      <span className="absolute top-0 left-0 size-2 border-t border-l border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute top-0 right-0 size-2 border-t border-r border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-0 left-0 size-2 border-b border-l border-primary opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-0 right-0 size-2 border-b border-r border-primary opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-3 py-2">
        <span className="label-mono">Agent · #{agent.id.padStart(3, "0")}</span>
        <div className="flex items-center gap-2">
          {isCaptain && (
            <span className="font-serif italic text-[10px] text-primary">[C]</span>
          )}
          <span className={`text-[10px] tracking-widest uppercase ${tone}`}>{tierLabel(agent.tier)}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`size-12 border border-border bg-secondary/40 flex items-center justify-center font-mono text-base text-primary ring-1 ${ring}`}
          >
            {handle.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">{handle}</p>
              {agent.isSmartMoney && (
                <span className="border border-primary/50 bg-primary/10 px-1.5 py-0.5 text-[8px] tracking-widest uppercase text-primary">
                  Nansen
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">{shortAddr(agent.wallet)}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-y-2 text-xs">
          <dt className="text-muted-foreground tracking-wider uppercase">Sortino</dt>
          <dd className="scoreboard text-right text-foreground">{fmtSortino(agent.sortinoBps)}</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Volume 30d</dt>
          <dd className="scoreboard text-right text-foreground">{fmtVolume(agent.volume30d)}</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Drafts</dt>
          <dd className="scoreboard text-right text-foreground">{agent.lifetimeAppearances}×</dd>
          <dt className="text-muted-foreground tracking-wider uppercase">Cost</dt>
          <dd className={`scoreboard text-right ${tone}`}>{cost} cr</dd>
        </dl>
      </div>

      <div
        onClick={isSelected ? onRemove : onAdd}
        className={`border-t border-border px-3 py-2 text-center text-[10px] tracking-widest uppercase transition cursor-pointer
          ${isSelected
            ? "text-destructive hover:text-destructive/70"
            : "text-muted-foreground hover:text-primary"
          }
        `}
      >
        {isSelected ? "[x] remove from squad" : "[+] add to squad"}
      </div>
    </motion.div>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

function Stat({label, value, hint}: {label: string; value: React.ReactNode; hint: string}) {
  return (
    <div className="px-5 py-5">
      <p className="label-mono">{label}</p>
      <p className="mt-2 text-3xl text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function SourceBadge({source, count}: {source: "live" | "mock"; count: number}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[10px] tracking-widest uppercase ${
        source === "live"
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground"
      }`}
    >
      <span className={`size-1 ${source === "live" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
      {source === "live" ? `live · ${count} agents` : `mock · pre-indexer · ${count}`}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DraftPage() {
  const {isConnected, address} = useAccount();
  const chainId = useChainId();
  const {switchChain} = useSwitchChain();

  const {data, isLoading} = useQuery({
    queryKey: ["top-agents"],
    queryFn: () => fetchTopAgents(50),
    refetchInterval: 20_000,
  });

  const agents = data?.rows ?? [];
  const source = data?.source ?? "mock";

  // Squad builder state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [captainIdx, setCaptainIdx] = useState<number>(0);
  const [chip, setChip] = useState<ChipValue>(Chip.None);

  // Toast
  const {toasts, push, dismiss} = useToast();

  // Read currentWeekId
  const contractAddr = addresses[SEPOLIA_ID]?.Squadium;
  const {data: weekIdData} = useReadContract({
    address: contractAddr,
    abi: abis.Squadium,
    functionName: "currentWeekId",
    query: {enabled: !!contractAddr},
  });
  const currentWeekId = weekIdData !== undefined ? weekIdData.toString() : "—";

  // Write + wait
  const {writeContract, data: txHash, isPending: isSigning, reset: resetWrite} = useWriteContract();
  const {isLoading: isConfirming, isSuccess: isMined} = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // After tx mines: toast success + reset
  useEffect(() => {
    if (isMined && txHash) {
      push(
        "ok",
        "Squad drafted.",
        `https://sepolia.mantlescan.xyz/tx/${txHash}`,
      );
      setSelectedIds([]);
      setCaptainIdx(0);
      setChip(Chip.None);
      resetWrite();
    }
  }, [isMined, txHash]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived
  const creditsSpent = selectedIds.reduce((sum, id) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return sum;
    return sum + (TIER_CREDITS[agent.tier] ?? 8);
  }, 0);

  const isWildcard = chip === Chip.Wildcard;
  const overCap = creditsSpent > SALARY_CAP && !isWildcard;
  const wrongNetwork = chainId !== SEPOLIA_ID;

  const canSubmit =
    isConnected &&
    !wrongNetwork &&
    selectedIds.length === 5 &&
    captainIdx >= 0 &&
    captainIdx <= 4 &&
    !overCap &&
    !isSigning &&
    !isConfirming;

  function handleAdd(id: string) {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 5) return;
    setSelectedIds((prev) => [...prev, id]);
  }

  function handleRemove(id: string) {
    setSelectedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      // Clamp captainIdx if needed
      if (captainIdx >= next.length && next.length > 0) {
        setCaptainIdx(next.length - 1);
      }
      return next;
    });
  }

  function handleSubmit() {
    if (!canSubmit || !contractAddr) return;

    const ids = selectedIds.map((id) => BigInt(id)) as [bigint, bigint, bigint, bigint, bigint];

    writeContract(
      {
        address: contractAddr,
        abi: abis.Squadium,
        functionName: "draftSquad",
        args: [ids, captainIdx, chip],
      },
      {
        onError(err) {
          let reason = "Transaction reverted.";
          if (err instanceof BaseError) {
            const revert = err.walk((e) => e instanceof ContractFunctionRevertedError);
            if (revert instanceof ContractFunctionRevertedError && revert.reason) {
              reason = revert.reason;
            } else if (err.shortMessage) {
              reason = err.shortMessage;
            }
          }
          push("err", reason);
        },
      },
    );
  }

  const submitLabel = isSigning
    ? "signing..."
    : isConfirming
      ? "confirming..."
      : isMined
        ? "drafted [v]"
        : "sign + submit draft";

  return (
    <main className="flex-1">
      <ToastStack toasts={toasts} dismiss={dismiss} />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="label-mono">/ draft · calibration flywheel</p>
          <h1 className="mt-4 text-4xl font-medium uppercase tracking-tight sm:text-5xl">Squad builder</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick 5 ERC-8004 agents under a 100-credit salary cap. Promote one as Captain (2× scoring weight). One chip
            per season — choose wisely. Your drafts are the prediction-market signal that calibrates the oracle.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 md:grid-cols-4 md:divide-x md:divide-y-0">
          <Stat label="Salary cap" value={<CountUp to={100} className="scoreboard" />} hint="credits / week" />
          <Stat
            label="Spent"
            value={
              <span className={`scoreboard ${overCap ? "text-destructive" : "text-primary"}`}>
                <CountUp to={creditsSpent} className="inline" />
              </span>
            }
            hint={overCap ? "over cap — use Wildcard or remove agents" : "of 100"}
          />
          <Stat
            label="Squad size"
            value={
              <span className="scoreboard">
                <CountUp to={selectedIds.length} className="inline" /> / 5
              </span>
            }
            hint="captain locked in #1 slot"
          />
          <Stat
            label="Chip"
            value={<span className="scoreboard">{chip === Chip.None ? "—" : CHIP_LABELS[chip]}</span>}
            hint={`Week ${currentWeekId} · wildcard / 3×capt / boost / freehit`}
          />
        </div>
      </section>

      {/* Wrong network banner */}
      {isConnected && wrongNetwork && (
        <div className="border-b border-destructive/40 bg-destructive/10 px-6 py-3">
          <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] tracking-widest uppercase text-destructive">
              ! wrong network — connect to Mantle Sepolia (chainId 5003)
            </p>
            <button
              onClick={() => switchChain({chainId: SEPOLIA_ID})}
              className="border border-destructive/60 px-3 py-1 text-[10px] tracking-widest uppercase text-destructive hover:bg-destructive/10 transition"
            >
              switch network
            </button>
          </div>
        </div>
      )}

      {/* Selected squad + controls */}
      {isConnected && (
        <section className="border-b border-border bg-card/20">
          <div className="mx-auto max-w-6xl px-6 py-6 space-y-6">
            {/* Selected pills */}
            <div>
              <p className="label-mono mb-3">Selected squad</p>
              <SquadPills
                selectedIds={selectedIds}
                captainIdx={captainIdx}
                agents={agents}
                onRemove={handleRemove}
                onPromoteCaptain={setCaptainIdx}
              />
            </div>

            {/* Chip selector */}
            <div>
              <p className="label-mono mb-3">Chip selection</p>
              <ChipSelector value={chip} onChange={setChip} address={address} />
              {isWildcard && (
                <p className="mt-2 text-[10px] font-mono text-primary tracking-wider">
                  &gt; Wildcard active — salary cap bypassed this week.
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`border px-6 py-2.5 text-[11px] tracking-widest uppercase transition font-mono
                  ${canSubmit
                    ? "border-primary text-primary hover:bg-primary/10 cursor-pointer"
                    : "border-border text-muted-foreground cursor-not-allowed"
                  }
                `}
              >
                {submitLabel}
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedIds([]);
                    setCaptainIdx(0);
                  }}
                  className="border border-border px-4 py-2.5 text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition"
                >
                  clear squad
                </button>
              )}

              {!isConnected && (
                <p className="text-[11px] text-muted-foreground font-mono tracking-wider">
                  connect wallet to submit
                </p>
              )}
              {overCap && !isWildcard && (
                <p className="text-[11px] text-destructive font-mono tracking-wider">
                  ! over cap by {creditsSpent - SALARY_CAP} cr
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-6 py-1 text-center text-muted-foreground select-none">
        ────────────────── agent shortlist ──────────────────
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {!isConnected ? (
          <div className="relative border border-dashed border-border bg-card p-10 text-center">
            <p className="label-mono">[ wallet · disconnected ]</p>
            <p className="mt-4 max-w-md mx-auto text-sm text-muted-foreground">
              Connect a wallet on Mantle Sepolia to draft a squad. Browse the shortlist below either way.
            </p>
            <div className="mt-6 inline-block">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
              Connected · {address?.slice(0, 6)}…{address?.slice(-4)}
            </p>
            <SourceBadge source={source} count={agents.length} />
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({length: 6}).map((_, i) => (
                <div key={i} className="h-56 animate-pulse border border-border bg-card" />
              ))
            : agents.map((a, i) => (
                <AgentCard
                  key={a.id}
                  agent={a}
                  delay={i * 0.04}
                  isSelected={selectedIds.includes(a.id)}
                  isCaptain={selectedIds[captainIdx] === a.id}
                  onAdd={() => handleAdd(a.id)}
                  onRemove={() => handleRemove(a.id)}
                />
              ))}
        </div>
      </section>
    </main>
  );
}
