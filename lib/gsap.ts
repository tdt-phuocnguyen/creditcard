"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { useSlide } from "@/components/SlideContext";

gsap.registerPlugin(useGSAP, DrawSVGPlugin, MotionPathPlugin);

export { gsap, useGSAP, DrawSVGPlugin, MotionPathPlugin };

const MAX_CATCH_UP = 1.2;

/** Label marking the resting state of reveal step `n` on a step timeline. */
export const stepLabel = (n: number) => `step-${n}`;

/**
 * Orchestrate a slide's reveal steps with one GSAP timeline.
 *
 * `build(tl)` adds tweens and must call `tl.addLabel(stepLabel(n))` at the
 * point where step `n` is fully revealed — e.g.
 *
 *   useStepTimeline(scope, (tl) => {
 *     tl.from(".node", { autoAlpha: 0, y: 20, stagger: 0.08 }).addLabel(stepLabel(0));
 *     tl.from(".route", { drawSVG: 0 }).addLabel(stepLabel(1));
 *   });
 *
 * Whenever the step changes the playhead tweens to that label (backwards when
 * the presenter steps back). Static renders (thumbnails) and reduced motion
 * jump straight to the label. The timeline is killed on unmount (GSAP context
 * cleanup via useGSAP), so it never leaks between slides.
 */
export function useStepTimeline(
  scope: RefObject<HTMLElement | SVGElement | null>,
  build: (tl: gsap.core.Timeline) => void,
): RefObject<gsap.core.Timeline | null> {
  const { step, isStatic, reducedMotion } = useSlide();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const jump = isStatic || reducedMotion;

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });
      build(tl);
      tlRef.current = tl;
      return () => {
        tl.kill();
        tlRef.current = null;
      };
    },
    // Rebuild only if the render mode changes; steps are handled below.
    { scope, dependencies: [jump] },
  );

  useGSAP(
    () => {
      const tl = tlRef.current;
      if (!tl) return;
      const label = stepLabel(step);
      const time = tl.labels[label] ?? tl.duration();
      if (jump) {
        tl.pause().seek(time, false);
      } else {
        // Entering a slide backwards lands on its last step: compress the
        // catch-up so essential content is visible well under 1.5 s.
        const distance = Math.abs(time - tl.time());
        tl.tweenTo(time, { ease: "none", duration: Math.min(distance, MAX_CATCH_UP) });
      }
    },
    { scope, dependencies: [step, jump] },
  );

  return tlRef;
}
