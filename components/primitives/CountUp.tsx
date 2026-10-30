"use client";

import { animate } from "motion/react";
import { useEffect, useRef } from "react";
import { useSlide } from "@/components/SlideContext";
import { duration as D, ease } from "@/lib/animationPresets";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

type CountUpProps = {
  value: number;
  from?: number;
  /** Reveal step at which counting starts. */
  at?: number;
  delay?: number;
  duration?: number;
  /** Formatter for both the animated and final value (default `12.000.000`). */
  format?: (value: number) => string;
  className?: string;
};

/**
 * Counts up to a key number when its step is reached. Width is reserved for the
 * final value so nothing shifts while counting. Screen readers get the final
 * value only. Static renders and reduced motion show the final value at once.
 */
export function CountUp({ value, from = 0, at = 0, delay = 0, duration = D.count, format = formatNumber, className }: CountUpProps) {
  const { step, isStatic, reducedMotion } = useSlide();
  const visible = step >= at;
  const instant = isStatic || reducedMotion;
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!visible) {
      node.textContent = format(from);
      return;
    }
    if (instant) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(from, value, {
      duration,
      delay,
      ease: ease.outExpo,
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [visible, instant, value, from, delay, duration, format]);

  const finalText = format(value);
  return (
    <span className={cn("t-num relative inline-block whitespace-nowrap", className)}>
      <span aria-hidden className="invisible">
        {finalText}
      </span>
      <span ref={ref} aria-hidden className="absolute inset-y-0 right-0">
        {instant && visible ? finalText : format(from)}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
