"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { Backdrop } from "@/components/Backdrop";
import { SlideFrame } from "@/components/SlideFrame";
import { SlideHost } from "@/components/SlideHost";
import { FrameFooter } from "@/components/SlideNavigation";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";
import type { SlideDefinition } from "@/slides/types";

/**
 * Dev-only harness that renders ONE slide in isolation (so a broken slide
 * elsewhere in the deck can't affect it). Query params:
 *   ?step=N      start at reveal step N
 *   ?static=1    static render (thumbnail mode: final state, 2D fallbacks)
 *   ?chrome=0    hide the footer
 *   ?motion=reduce  reduced motion; ?webgl=0 force 3D fallbacks
 * Keys: → / Space next step, ← previous step, R replay entry.
 */
export function PreviewHost({ slide }: { slide: SlideDefinition }) {
  const mounted = useMounted();
  const reducedMotion = usePrefersReducedMotion();
  // Read once from the URL. Safe: nothing is rendered until mounted, so the
  // hydration render never depends on these values.
  const [params] = useState(() => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search));
  const [step, setStep] = useState(() => {
    const requested = Number(params.get("step") ?? 0);
    return Number.isFinite(requested) ? Math.max(0, Math.min(slide.steps - 1, requested)) : 0;
  });
  const isStatic = params.get("static") === "1";
  const chrome = params.get("chrome") !== "0";
  const [replay, setReplay] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as Element | null;
      const onButton = Boolean(target?.closest('button, a[href], [role="button"], [data-interactive]'));
      if (event.key === "ArrowRight" || ((event.key === " " || event.key === "Enter") && !onButton)) {
        event.preventDefault();
        setDirection(1);
        setStep((s) => Math.min(slide.steps - 1, s + 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setDirection(-1);
        setStep((s) => Math.max(0, s - 1));
      } else if (event.key === "r" || event.key === "R") {
        setReplay((r) => r + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slide.steps]);

  useEffect(() => {
    document.title = `Preview ${slide.number} · step ${step}/${slide.steps - 1}`;
  }, [slide.number, slide.steps, step]);

  if (!mounted) return null;

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <div className="fixed inset-0 bg-letterbox" data-preview-ready="true" data-preview-step={step} data-preview-steps={slide.steps}>
        <SlideFrame label={`Preview slide ${slide.number}`}>
          <Backdrop chapter={slide.chapter} />
          <SlideHost key={replay} def={slide} step={step} direction={direction} isStatic={isStatic} reducedMotion={reducedMotion} />
          {chrome ? <FrameFooter index={slide.number - 1} total={19} step={step} steps={slide.steps} /> : null}
        </SlideFrame>
      </div>
    </MotionConfig>
  );
}
