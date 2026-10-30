"use client";

import { createContext, useContext } from "react";

/**
 * Everything a slide needs to know about its presentation state.
 * Slides read it with `useSlide()` — they take no props.
 */
export type SlideState = {
  /** Current reveal step, 0 … steps-1. 0 is the state right after entry. */
  step: number;
  /** Total reveal steps declared by the slide (≥ 1). */
  steps: number;
  /** True while this slide is the one being presented (false while exiting). */
  isActive: boolean;
  /**
   * Static render (overview thumbnails, previews): show the final state
   * immediately, no animation, no WebGL — use the 2D fallback instead.
   */
  isStatic: boolean;
  /** User prefers reduced motion: use opacity-only or instant state changes. */
  reducedMotion: boolean;
  /** Navigation direction that brought us here: 1 forward, -1 backward. */
  direction: 1 | -1;
  /** 1-based slide number. */
  number: number;
};

const defaultState: SlideState = {
  step: 0,
  steps: 1,
  isActive: false,
  isStatic: true,
  reducedMotion: false,
  direction: 1,
  number: 1,
};

export const SlideContext = createContext<SlideState>(defaultState);

export function useSlide(): SlideState {
  return useContext(SlideContext);
}

/** True once the presenter has reached reveal step `at`. */
export function useStepReached(at: number): boolean {
  return useContext(SlideContext).step >= at;
}

/** Whether motion should play at all (false for thumbnails and reduced motion). */
export function useShouldAnimate(): boolean {
  const { isStatic, reducedMotion } = useContext(SlideContext);
  return !isStatic && !reducedMotion;
}
