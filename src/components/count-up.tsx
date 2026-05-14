"use client";

import {animate, useMotionValue, useTransform, motion} from "motion/react";
import {useEffect} from "react";

/**
 * Animated counter used in scoreboard tiles.
 *
 * Eases from 0 → target on mount. `format` controls how the running value is
 * rendered (decimals, currency suffix, etc.). Pass `decimals` for simple
 * fixed-point formatting; pass `format` for custom strings.
 */
type Props = {
  to: number;
  duration?: number;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
};

export function CountUp({to, duration = 1.6, decimals = 0, format, className}: Props) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) =>
    format ? format(latest) : latest.toFixed(decimals),
  );

  useEffect(() => {
    const controls = animate(mv, to, {duration, ease: [0.16, 1, 0.3, 1]});
    return () => controls.stop();
  }, [mv, to, duration]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
