"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useMemo } from "react";
import { useFrameScale } from "@/components/SlideFrame";

type SceneCanvasProps = Omit<CanvasProps, "dpr" | "resize"> & {
  onReady?: () => void;
  onLost?: () => void;
  /** Reduced motion → render on demand only (no idle animation loop). */
  reducedMotion?: boolean;
};

/**
 * R3F <Canvas> with the deck's defaults:
 * - `resize.offsetSize` because the canvas lives inside a CSS-scaled frame
 *   (getBoundingClientRect would report the scaled size and double-scale it);
 * - device-pixel-ratio matched to the frame scale so buffers aren't oversized;
 * - transparent background so the slide backdrop shows through;
 * - "demand" frameloop under reduced motion; pass frameloop="demand" yourself
 *   for scenes that only move during transitions (call `invalidate()`).
 */
export function SceneCanvas({ children, onReady, onLost, reducedMotion, frameloop, gl, camera, onCreated, ...rest }: SceneCanvasProps) {
  const scale = useFrameScale();
  const dpr = useMemo(() => {
    const device = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    return Math.min(2, Math.max(0.75, device * scale));
  }, [scale]);

  return (
    <Canvas
      dpr={dpr}
      resize={{ offsetSize: true }}
      frameloop={reducedMotion ? "demand" : (frameloop ?? "always")}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", ...(typeof gl === "object" ? gl : {}) }}
      camera={camera ?? { position: [0, 0, 8], fov: 35 }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={(state) => {
        state.gl.setClearColor(0x000000, 0);
        state.gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onLost?.();
          },
          { once: true },
        );
        onCreated?.(state);
        // Reveal once the first frame has actually been drawn.
        requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
      }}
      {...rest}
    >
      {children}
    </Canvas>
  );
}
