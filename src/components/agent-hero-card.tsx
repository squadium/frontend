"use client";

import {motion} from "motion/react";

/**
 * AgentHeroCard — hand-crafted pixel-art collectible card.
 *
 * The agent is a string-grid pixel map rendered as SVG <rect>s (no raster
 * asset, ~no bytes). Card chrome, scanlines, holo-shimmer and idle float are
 * pure CSS/Motion. Matches the Stadium Terminal palette exactly.
 */

// Palette (Stadium Terminal)
const C: Record<string, string> = {
  K: "#15120d", // dark outline
  M: "#6b6253", // mid metal
  L: "#938873", // light metal
  A: "#e8a838", // amber
  R: "#c0492a", // clay red
  W: "#f2efe8", // bone white
};

// 16 wide. Each row a string; '.' = transparent.
const ROBOT: string[] = [
  ".....A..A.......",
  ".....A..A.......",
  ".....KAAK.......",
  "...KKKKKKKK.....",
  "..KMMMMMMMMK....",
  "..KMLLLLLLMK....",
  "..KMAAAAAAMK....",
  "..KMAAAAAAMK....",
  "..KMMMMMMMMK....",
  "..KMK.KK.KMK....",
  "...KKKKKKKK.....",
  ".KKKKKKKKKKKK...",
  "KMMMMMMMMMMMMK..",
  "KMLMMMMMMMMLMK..",
  "KMMMKAAAKMMMMK..",
  "KMMMKARAKMMMMK..",
  "KMMMKAAAKMMMMK..",
  "KMMMMMMMMMMMMK..",
  ".KMMMMMMMMMMK...",
  "..KKMMMMMMKK....",
  "...KMK..KMK.....",
  "...KMK..KMK.....",
  "...KKK..KKK.....",
];

const PX = 9; // pixel size
const GRID_W = 16;
const GRID_H = ROBOT.length;

export function AgentHeroCard() {
  return (
    <motion.div
      initial={{opacity: 0, y: 24, rotateX: 8}}
      animate={{opacity: 1, y: 0, rotateX: 0}}
      transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15}}
      whileHover={{rotateZ: -1, y: -4}}
      className="group relative w-[280px] select-none"
      style={{perspective: 1000}}
    >
      {/* amber bloom behind card */}
      <div
        className="absolute -inset-6 -z-10 blur-2xl"
        style={{background: "radial-gradient(circle at 50% 40%, rgba(232,168,56,0.22), transparent 70%)"}}
      />

      <div className="relative border border-border bg-card">
        {/* corner brackets */}
        <span className="absolute -top-px -left-px size-3 border-t-2 border-l-2 border-primary" />
        <span className="absolute -top-px -right-px size-3 border-t-2 border-r-2 border-primary" />
        <span className="absolute -bottom-px -left-px size-3 border-b-2 border-l-2 border-primary" />
        <span className="absolute -bottom-px -right-px size-3 border-b-2 border-r-2 border-primary" />

        {/* header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-3 py-2">
          <span className="scoreboard text-xs text-muted-foreground">#042</span>
          <span className="bg-primary px-2 py-0.5 text-[9px] font-medium tracking-[0.2em] uppercase text-primary-foreground">
            T1 · Legendary
          </span>
        </div>

        {/* art window */}
        <div className="relative overflow-hidden border-b border-border bg-[#100d09]">
          {/* idle-float pixel robot */}
          <motion.svg
            viewBox={`0 0 ${GRID_W * PX} ${GRID_H * PX}`}
            className="mx-auto block py-6"
            width={GRID_W * PX}
            height={GRID_H * PX}
            animate={{y: [0, -5, 0]}}
            transition={{duration: 3.4, repeat: Infinity, ease: "easeInOut"}}
            shapeRendering="crispEdges"
          >
            {ROBOT.flatMap((row, y) =>
              row.split("").map((ch, x) =>
                ch === "." ? null : (
                  <rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={C[ch]} />
                ),
              ),
            )}
            {/* eye glow flicker */}
            <motion.rect
              x={4 * PX}
              y={6 * PX}
              width={6 * PX}
              height={2 * PX}
              fill="#ffd27a"
              animate={{opacity: [0.25, 0.9, 0.4, 0.85, 0.25]}}
              transition={{duration: 2.2, repeat: Infinity, ease: "easeInOut"}}
            />
          </motion.svg>

          {/* scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.5) 2px 3px)",
            }}
          />
          {/* sweeping scan glow */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-10"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(232,168,56,0.16), transparent)",
            }}
            animate={{top: ["-15%", "115%"]}}
            transition={{duration: 4.5, repeat: Infinity, ease: "linear"}}
          />
          {/* holo shimmer on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(232,168,56,0.14) 45%, rgba(242,239,232,0.10) 50%, rgba(192,73,42,0.12) 55%, transparent 70%)",
            }}
          />
        </div>

        {/* name plate */}
        <div className="border-b border-border px-3 py-2.5">
          <p className="text-sm font-medium tracking-wide text-foreground">MomentumMaxi</p>
          <p className="font-mono text-[10px] text-muted-foreground">0x42aa…1ce0 · erc-8004</p>
        </div>

        {/* stat strip */}
        <dl className="grid grid-cols-3 divide-x divide-border text-center">
          <Stat k="Sortino" v="2.84" hot />
          <Stat k="Vol 30d" v="$1.24M" />
          <Stat k="Win" v="68%" />
        </dl>

        {/* footer */}
        <div className="border-t border-border bg-secondary/50 px-3 py-1.5 text-center text-[9px] tracking-[0.25em] uppercase text-muted-foreground">
          Squadium · season 01
        </div>
      </div>
    </motion.div>
  );
}

function Stat({k, v, hot}: {k: string; v: string; hot?: boolean}) {
  return (
    <div className="px-2 py-3">
      <p className="text-[9px] tracking-widest uppercase text-muted-foreground">{k}</p>
      <p className={`scoreboard mt-1 text-sm ${hot ? "text-primary" : "text-foreground"}`}>{v}</p>
    </div>
  );
}
