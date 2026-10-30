/**
 * Motion design system. Deliberate, premium, restrained:
 * opacity + subtle translation + controlled scale. No bounce, no elastic,
 * no spinning. Essential content on any slide must be visible < 1.5 s after entry.
 */

/** Cubic-bezier curves (Framer Motion arrays; GSAP equivalents below). */
export const ease = {
  /** Default for reveals and slide entries. */
  premium: [0.22, 1, 0.36, 1] as const,
  /** Fast settle for small UI elements. */
  outExpo: [0.16, 1, 0.3, 1] as const,
  /** Exits and symmetric moves. */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Exit acceleration. */
  in: [0.4, 0, 1, 1] as const,
};

/** Same curves for GSAP (`ease: gsapEase.premium`). */
export const gsapEase = {
  premium: "expo.out",
  outExpo: "expo.out",
  inOut: "power2.inOut",
  soft: "power3.out",
  in: "power2.in",
};

/** Durations in seconds. */
export const duration = {
  /** Slide-to-slide transition (450–750 ms). */
  slideEnter: 0.65,
  slideExit: 0.45,
  /** Headlines: 500–700 ms. */
  headline: 0.7,
  /** Supporting lines / cards. */
  reveal: 0.55,
  /** Micro-interactions (hover, press, tooltip). */
  micro: 0.18,
  /** SVG connectors drawing in. */
  draw: 0.9,
  /** Bars / donut segments growing from zero. */
  chart: 1.0,
  /** Count-up for key numbers. */
  count: 1.1,
  /** Reduced-motion crossfade. */
  reduced: 0.2,
};

/** Stagger between sibling items: 60–100 ms. */
export const stagger = {
  tight: 0.06,
  base: 0.08,
  loose: 0.1,
};

/** Default translation distances (canvas px). */
export const distance = {
  reveal: 24,
  headline: 28,
  slide: 56,
};

/** Slide-level transition variants. `custom` = navigation direction (1 forward, -1 back). */
export const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * distance.slide, y: dir * 10, scale: 0.985 }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: duration.slideEnter, ease: ease.premium },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -distance.slide,
    y: dir * -10,
    scale: 0.985,
    transition: { duration: duration.slideExit, ease: ease.inOut },
  }),
};

/** Reduced motion: opacity only. */
export const slideVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: duration.reduced } },
  exit: { opacity: 0, transition: { duration: duration.reduced } },
};
