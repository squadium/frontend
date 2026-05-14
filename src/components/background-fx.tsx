"use client";

/**
 * Atmospheric background FX for Stadium Terminal.
 *
 * Layers (bottom → top):
 *   1. Static dot grid (CSS background)
 *   2. Slow-drifting amber spotlight (radial gradient via Motion)
 *   3. Crimson glow lower-right (counter-balance)
 *   4. Subtle scan line (animated CSS gradient sweep, very slow)
 *
 * All layers are `pointer-events: none` and absolutely positioned to z = -10,
 * fixed so they cover the whole viewport during scroll.
 */
import {motion} from "motion/react";

export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{contain: "strict"}}
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.55 0.01 80) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, black 60%, transparent 100%)",
        }}
      />

      {/* drifting amber spotlight */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 size-[120vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.78 0.18 65 / 0.10) 0%, transparent 55%)",
        }}
        animate={{
          x: ["0%", "8%", "-4%", "0%"],
          y: ["0%", "-6%", "10%", "0%"],
        }}
        transition={{duration: 28, repeat: Infinity, ease: "easeInOut"}}
      />

      {/* crimson counterweight */}
      <motion.div
        className="absolute -bottom-1/3 -right-1/4 size-[100vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.62 0.22 25 / 0.08) 0%, transparent 50%)",
        }}
        animate={{
          x: ["0%", "-5%", "6%", "0%"],
          y: ["0%", "4%", "-6%", "0%"],
        }}
        transition={{duration: 34, repeat: Infinity, ease: "easeInOut"}}
      />

      {/* slow scan line — top-down sweep */}
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.78 0.18 65 / 0.35) 50%, transparent 100%)",
          boxShadow: "0 0 12px oklch(0.78 0.18 65 / 0.5)",
        }}
        animate={{top: ["-2%", "102%"]}}
        transition={{duration: 18, repeat: Infinity, ease: "linear"}}
      />

      {/* CRT vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 60%, oklch(0.09 0.005 75 / 0.7) 100%)",
        }}
      />
    </div>
  );
}
