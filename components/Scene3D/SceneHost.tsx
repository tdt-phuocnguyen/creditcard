"use client";

import { Component, useCallback, useEffect, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { useSlide } from "@/components/SlideContext";
import { useWebGLSupport } from "./webgl";
import { cn } from "@/lib/cn";

/** Props every 3D scene component receives from `SceneHost`. */
export type SceneProps = {
  /** Current reveal step of the slide. */
  step: number;
  /** Reduced motion: render statically (frameloop "demand", no idle motion). */
  reducedMotion: boolean;
  /** Call after the first frame has rendered so the 2D fallback can fade out. */
  onReady: () => void;
  /** Call if the WebGL context is lost; the host falls back to 2D. */
  onLost: () => void;
};

class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[Scene3D] scene failed, using 2D fallback:", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Hosts one lazily loaded WebGL scene with a static 2D fallback.
 *
 * - The scene mounts only while its slide is the active one (never in overview
 *   thumbnails, never while the slide is exiting), so at most one scene renders.
 * - The fallback (SVG/CSS) is always rendered underneath and is what users see
 *   without WebGL, while the scene chunk loads, and in thumbnails.
 * - Pass a component created with `next/dynamic(() => import("./MyScene"), { ssr: false })`
 *   so three.js code is split out and loaded on demand.
 * - Keep essential text (labels, dates, numbers) in normal DOM *outside* the
 *   host: the scene is decorative/explanatory imagery (role="img").
 */
export function SceneHost({
  scene: Scene,
  fallback,
  label,
  className,
  style,
  fallbackWhileLoading = true,
}: {
  scene: ComponentType<SceneProps>;
  fallback: ReactNode;
  /** Accessible description of the visual. */
  label: string;
  className?: string;
  style?: CSSProperties;
  /**
   * Show the 2D fallback while the WebGL scene loads (default). Set false when
   * the scene has its own entrance that should start from an empty stage —
   * the fallback then appears only for thumbnails, no-WebGL or failures.
   */
  fallbackWhileLoading?: boolean;
}) {
  const { isActive, isStatic, reducedMotion, step } = useSlide();
  const webgl = useWebGLSupport();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const enabled = isActive && !isStatic && webgl === true && !failed;

  useEffect(() => {
    if (!enabled) setReady(false);
  }, [enabled]);

  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setFailed(true), []);

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(/\b(absolute|fixed|sticky)\b/.test(className ?? "") ? undefined : "relative", className)}
      style={style}
      data-scene-host
    >
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{ opacity: enabled && (ready || !fallbackWhileLoading) ? 0 : 1 }}
        data-scene-fallback
      >
        {fallback}
      </div>
      {enabled ? (
        <SceneErrorBoundary onError={onLost}>
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{ opacity: ready ? 1 : 0 }}
            data-scene-canvas
          >
            <Scene step={step} reducedMotion={reducedMotion} onReady={onReady} onLost={onLost} />
          </div>
        </SceneErrorBoundary>
      ) : null}
    </div>
  );
}
