import type { ComponentType } from "react";
import { slideIndex, type ChapterId } from "@/lib/slideContent";

export type SlideDefinition = {
  id: string;
  number: number;
  title: string;
  chapter: ChapterId;
  /**
   * Number of reveal states (≥ 1). Step indices run 0 … steps-1.
   * Step 0 is what the audience sees right after the slide enters.
   * Navigating forward from the last step advances to the next slide;
   * navigating back into a slide lands on its last step.
   */
  steps: number;
  /** The slide. Reads its state via `useSlide()`; takes no props. */
  Component: ComponentType;
  /** True if the slide hosts a lazily loaded WebGL scene. */
  has3D?: boolean;
  /**
   * Warm up lazily loaded code (e.g. `() => import("./Scene")`). Called while
   * the previous slide is on screen so the scene is ready on arrival.
   */
  preload?: () => Promise<unknown>;
};

/** Declare a slide; number, title and chapter come from `slideIndex`. */
export function defineSlide(def: {
  id: string;
  steps: number;
  Component: ComponentType;
  has3D?: boolean;
  preload?: () => Promise<unknown>;
}): SlideDefinition {
  const entry = slideIndex.find((s) => s.id === def.id);
  if (!entry) throw new Error(`Unknown slide id "${def.id}" — add it to slideIndex in lib/slideContent.ts`);
  if (!Number.isInteger(def.steps) || def.steps < 1) throw new Error(`Slide "${def.id}" must declare steps ≥ 1`);
  return { ...def, number: entry.number, title: entry.title, chapter: entry.chapter };
}
