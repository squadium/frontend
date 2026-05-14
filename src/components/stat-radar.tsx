"use client";

import {motion} from "motion/react";

/**
 * Lightweight radar chart for agent stat profile.
 * Pure SVG, no recharts dependency. Stadium Terminal aesthetic — thin amber lines, no fills.
 *
 * Each axis is 0..1. Render with at least 3 axes.
 */
type Axis = {label: string; value: number};

export function StatRadar({axes, size = 240}: {axes: Axis[]; size?: number}) {
  const radius = size / 2 - 28;
  const center = size / 2;
  const n = axes.length;

  const pointAt = (i: number, scale: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return {
      x: center + Math.cos(angle) * radius * scale,
      y: center + Math.sin(angle) * radius * scale,
    };
  };

  const dataPoints = axes.map((a, i) => pointAt(i, Math.max(0, Math.min(1, a.value))));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  const labelAt = (i: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = radius + 18;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    };
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px]">
      {/* concentric rings */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={1}
          strokeDasharray={scale === 1 ? "0" : "2 3"}
          points={Array.from({length: n})
            .map((_, i) => {
              const p = pointAt(i, scale);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
        />
      ))}
      {/* axes spokes */}
      {Array.from({length: n}).map((_, i) => {
        const p = pointAt(i, 1);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        );
      })}
      {/* data polygon */}
      <motion.path
        d={dataPath}
        fill="oklch(0.78 0.18 65 / 0.18)"
        stroke="oklch(0.78 0.18 65)"
        strokeWidth={1.5}
        initial={{pathLength: 0, opacity: 0}}
        animate={{pathLength: 1, opacity: 1}}
        transition={{duration: 1.2, ease: [0.16, 1, 0.3, 1]}}
      />
      {/* data dots */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill="oklch(0.78 0.18 65)"
          initial={{opacity: 0, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.4, delay: 0.5 + i * 0.06}}
        />
      ))}
      {/* labels */}
      {axes.map((a, i) => {
        const p = labelAt(i);
        return (
          <text
            key={a.label}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            fontFamily="var(--font-dm-mono)"
            fontSize={9}
            letterSpacing="0.12em"
            style={{textTransform: "uppercase"}}
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
