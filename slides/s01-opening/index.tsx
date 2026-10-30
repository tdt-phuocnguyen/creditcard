import { defineSlide } from "../types";
import { OpeningSlide, preloadOpeningScene } from "./OpeningSlide";

/** Single state: the hero enters in one choreographed sequence (< 1.5 s). */
export default defineSlide({
  id: "opening",
  steps: 1,
  Component: OpeningSlide,
  has3D: true,
  preload: preloadOpeningScene,
});
