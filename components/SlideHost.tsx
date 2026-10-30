"use client";

import { useIsPresent } from "motion/react";
import { Component, useMemo, type ReactNode } from "react";
import { SlideContext, type SlideState } from "./SlideContext";
import type { SlideDefinition } from "@/slides/types";

class SlideErrorBoundary extends Component<{ number: number; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error(`[slide ${this.props.number}] render error:`, error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="absolute inset-0 grid place-items-center">
        <p className="t-body text-ink-muted">Không thể hiển thị slide {this.props.number}.</p>
      </div>
    );
  }
}

/**
 * Provides a slide with its presentation state. Inside <AnimatePresence>,
 * an exiting slide becomes inactive immediately (so its 3D scene unmounts and
 * loops stop) while it animates out.
 */
export function SlideHost({
  def,
  step,
  direction = 1,
  isStatic = false,
  reducedMotion = false,
}: {
  def: SlideDefinition;
  step: number;
  direction?: 1 | -1;
  isStatic?: boolean;
  reducedMotion?: boolean;
}) {
  const isPresent = useIsPresent();
  const clampedStep = Math.max(0, Math.min(def.steps - 1, step));
  const value = useMemo<SlideState>(
    () => ({
      step: clampedStep,
      steps: def.steps,
      isActive: isPresent && !isStatic,
      isStatic,
      reducedMotion,
      direction,
      number: def.number,
    }),
    [clampedStep, def.steps, def.number, isPresent, isStatic, reducedMotion, direction],
  );

  return (
    <SlideContext.Provider value={value}>
      <div
        className="absolute inset-0"
        data-slide-root
        data-slide={def.number}
        data-step={clampedStep}
        data-steps={def.steps}
        data-active={value.isActive ? "true" : "false"}
      >
        <SlideErrorBoundary number={def.number}>
          <def.Component />
        </SlideErrorBoundary>
      </div>
    </SlideContext.Provider>
  );
}
