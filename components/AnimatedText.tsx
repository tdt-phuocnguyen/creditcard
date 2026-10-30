"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useSlide } from "@/components/SlideContext";
import { distance, duration as D, ease, stagger as S } from "@/lib/animationPresets";
import { cn } from "@/lib/cn";

type HeadlineProps = {
  children: ReactNode;
  /** Reveal step (default 0 = on entry). */
  at?: number;
  delay?: number;
  /** Heading level; slides use h1 for their main headline. */
  level?: 1 | 2 | 3;
  className?: string;
  style?: CSSProperties;
};

/**
 * Slide headline: opacity + vertical reveal (500–700 ms). No masks — clipping
 * would cut Vietnamese diacritics above the cap height.
 */
export function Headline({ children, at = 0, delay = 0, level = 1, className, style }: HeadlineProps) {
  const { step, isStatic, reducedMotion } = useSlide();
  const visible = step >= at;
  const Tag = level === 1 ? motion.h1 : level === 2 ? motion.h2 : motion.h3;
  const hidden = reducedMotion ? { opacity: 0 } : { opacity: 0, y: distance.headline };

  return (
    <Tag
      className={cn(level === 1 ? "t-h1" : level === 2 ? "t-h2" : "t-h3", "text-ink", className)}
      style={style}
      initial={isStatic ? false : hidden}
      animate={visible ? { opacity: 1, y: 0 } : hidden}
      transition={isStatic ? { duration: 0 } : { duration: reducedMotion ? D.reduced : D.headline, delay, ease: ease.premium }}
    >
      {children}
    </Tag>
  );
}

type AnimatedLinesProps = {
  lines: readonly ReactNode[];
  at?: number;
  delay?: number;
  gap?: number;
  className?: string;
  lineClassName?: string;
  as?: "p" | "div";
};

/** Supporting lines revealed with a 60–100 ms stagger (never word by word). */
export function AnimatedLines({ lines, at = 0, delay = 0.15, gap = S.base, className, lineClassName, as = "div" }: AnimatedLinesProps) {
  const { step, isStatic, reducedMotion } = useSlide();
  const visible = step >= at;
  const Line = as === "p" ? motion.p : motion.div;

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <Line
          key={i}
          className={lineClassName}
          initial={isStatic ? false : reducedMotion ? { opacity: 0 } : { opacity: 0, y: distance.reveal * 0.75 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : distance.reveal * 0.75 }}
          transition={
            isStatic
              ? { duration: 0 }
              : { duration: reducedMotion ? D.reduced : D.reveal, delay: visible ? delay + i * gap : 0, ease: ease.premium }
          }
        >
          {line}
        </Line>
      ))}
    </div>
  );
}
