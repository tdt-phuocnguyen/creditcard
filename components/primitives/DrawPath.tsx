"use client";

import { motion, type SVGMotionProps } from "motion/react";
import { useSlide } from "@/components/SlideContext";
import { duration as D, ease } from "@/lib/animationPresets";

type DrawPathProps = Omit<SVGMotionProps<SVGPathElement>, "initial" | "animate" | "transition"> & {
  d: string;
  /** Reveal step at which the path draws in. */
  at?: number;
  delay?: number;
  duration?: number;
};

/**
 * An SVG connector that draws itself progressively when its step is reached
 * (and erases when the presenter steps back). Static renders show it drawn.
 */
export function DrawPath({ d, at = 0, delay = 0, duration = D.draw, ...rest }: DrawPathProps) {
  const { step, isStatic, reducedMotion } = useSlide();
  const visible = step >= at;
  const hidden = reducedMotion ? { pathLength: 1, opacity: 0 } : { pathLength: 0, opacity: 0 };
  const shown = { pathLength: 1, opacity: 1 };

  return (
    <motion.path
      d={d}
      initial={isStatic ? false : hidden}
      animate={visible ? shown : hidden}
      transition={
        isStatic
          ? { duration: 0 }
          : reducedMotion
            ? { duration: D.reduced }
            : {
                pathLength: { duration: visible ? duration : D.reduced, delay: visible ? delay : 0, ease: ease.inOut },
                opacity: { duration: 0.2, delay: visible ? delay : 0 },
              }
      }
      {...rest}
    />
  );
}
