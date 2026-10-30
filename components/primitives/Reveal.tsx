"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useSlide } from "@/components/SlideContext";
import { distance, duration as D, ease, stagger as S } from "@/lib/animationPresets";

type RevealTag = "div" | "span" | "section" | "article" | "p" | "ul" | "ol" | "li" | "header" | "footer" | "figure";

type RevealProps = {
  /** Reveal step at which this content appears (default 0 = on slide entry). */
  at?: number;
  /** Optional step from which the content hides again (swap states). */
  until?: number;
  /** Seconds to wait after the step is reached (entry choreography). */
  delay?: number;
  /** Start offset in canvas px (ignored under reduced motion). */
  y?: number;
  x?: number;
  /** Start scale, e.g. 0.96 (ignored under reduced motion). */
  scale?: number;
  duration?: number;
  as?: RevealTag;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Shows its children once the presenter reaches step `at`.
 * Hidden content keeps its layout box (no layout shift), is aria-hidden and inert.
 * Static renders show the final state instantly; reduced motion fades only.
 */
export function Reveal({
  at = 0,
  until,
  delay = 0,
  y = distance.reveal,
  x = 0,
  scale = 1,
  duration,
  as = "div",
  className,
  style,
  children,
}: RevealProps) {
  const { step, isStatic, reducedMotion } = useSlide();
  const visible = step >= at && (until === undefined || step < until);
  const Component = motion[as];
  const hidden = reducedMotion ? { opacity: 0 } : { opacity: 0, x, y, scale };
  const shown = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <Component
      className={className}
      style={{ ...style, pointerEvents: visible ? undefined : "none" }}
      initial={isStatic ? false : hidden}
      animate={visible ? shown : hidden}
      transition={
        isStatic
          ? { duration: 0 }
          : {
              duration: reducedMotion ? D.reduced : visible ? (duration ?? D.reveal) : D.reduced,
              delay: visible && !reducedMotion ? delay : 0,
              ease: ease.premium,
            }
      }
      aria-hidden={visible ? undefined : true}
      inert={visible ? undefined : true}
    >
      {children}
    </Component>
  );
}

type StaggerProps = {
  at?: number;
  delay?: number;
  /** Seconds between children (60–100 ms). */
  gap?: number;
  as?: RevealTag;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** Reveals `StaggerItem` children one after another once step `at` is reached. */
export function Stagger({ at = 0, delay = 0, gap = S.base, as = "div", className, style, children }: StaggerProps) {
  const { step, isStatic, reducedMotion } = useSlide();
  const visible = step >= at;
  const Component = motion[as];
  const instant = isStatic || reducedMotion;

  return (
    <Component
      className={className}
      style={{ ...style, pointerEvents: visible ? undefined : "none" }}
      initial={isStatic ? false : "hidden"}
      animate={visible ? "shown" : "hidden"}
      variants={{
        hidden: { transition: { staggerChildren: 0 } },
        shown: { transition: { staggerChildren: instant ? 0 : gap, delayChildren: instant ? 0 : delay } },
      }}
      aria-hidden={visible ? undefined : true}
      inert={visible ? undefined : true}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  as?: RevealTag;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function StaggerItem({
  y = distance.reveal,
  x = 0,
  scale = 1,
  duration,
  as = "div",
  className,
  style,
  children,
}: StaggerItemProps) {
  const { isStatic, reducedMotion } = useSlide();
  const Component = motion[as];

  return (
    <Component
      className={className}
      style={style}
      variants={{
        hidden: reducedMotion
          ? { opacity: 0, transition: { duration: D.reduced } }
          : { opacity: 0, x, y, scale, transition: { duration: D.reduced } },
        shown: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: isStatic
            ? { duration: 0 }
            : { duration: reducedMotion ? D.reduced : (duration ?? D.reveal), ease: ease.premium },
        },
      }}
    >
      {children}
    </Component>
  );
}
