/**
 * SourceBadge — ASCII-flavored chip that tells judges whether data is coming
 * from the live indexer or the seeded mock fallback.
 *
 * Aesthetic: sharp corners, 1px border, DM Mono, Stadium Terminal palette.
 *   [live]  → amber/primary, pulsing dot
 *   [mock]  → muted grey, static dot
 */

import type {SourceTag} from "@/lib/indexer";

interface SourceBadgeProps {
  source: SourceTag;
  /** Optional agent / row count shown after the source label. */
  count?: number;
}

export function SourceBadge({source, count}: SourceBadgeProps) {
  const isLive = source === "live";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-none border px-2.5 py-1",
        "font-mono text-[10px] tracking-widest uppercase",
        isLive
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-transparent text-muted-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block size-1 shrink-0",
          isLive ? "bg-primary animate-pulse" : "bg-muted-foreground",
        ].join(" ")}
      />
      {isLive ? "live" : "mock"}
      {count !== undefined && (
        <span className="opacity-60"> · {count}</span>
      )}
    </span>
  );
}
