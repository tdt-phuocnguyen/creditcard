"use client";

import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/canvas";
import { cn } from "@/lib/cn";

/** Current CSS scale of the enclosing 1920×1080 canvas (used e.g. to size WebGL buffers). */
export const FrameScaleContext = createContext(1);
export const useFrameScale = () => useContext(FrameScaleContext);

/**
 * Fixed 16:9 canvas (1920×1080 canvas px) scaled to fit its container while
 * preserving the aspect ratio. Renders nothing visible until measured, so
 * there is no flash of an unscaled canvas.
 */
export function SlideFrame({
  children,
  className,
  canvasClassName,
  label,
}: {
  children: ReactNode;
  className?: string;
  canvasClassName?: string;
  /** Accessible label for the canvas region. */
  label?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setScale(Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className={cn("relative grid h-full w-full place-items-center overflow-hidden", className)}>
      <div
        className="relative"
        style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale, visibility: scale ? "visible" : "hidden" }}
      >
        <div
          role={label ? "region" : undefined}
          aria-label={label}
          className={cn("absolute left-0 top-0 overflow-hidden bg-canvas", canvasClassName)}
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${scale || 1})`, transformOrigin: "0 0" }}
          data-canvas
        >
          <FrameScaleContext.Provider value={scale || 1}>{children}</FrameScaleContext.Provider>
        </div>
      </div>
    </div>
  );
}

/** Thumbnail variant: canvas scaled to the container width (container sets aspect-ratio 16/9). */
export function ThumbnailFrame({ children, className }: { children: ReactNode; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const measure = () => {
      const { width } = el.getBoundingClientRect();
      if (width > 0) setScale(width / CANVAS_WIDTH);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className={cn("relative aspect-video w-full overflow-hidden", className)}>
      {scale ? (
        <div
          className="absolute left-0 top-0 overflow-hidden bg-canvas"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${scale})`, transformOrigin: "0 0" }}
          data-canvas
        >
          <FrameScaleContext.Provider value={scale}>{children}</FrameScaleContext.Provider>
        </div>
      ) : null}
    </div>
  );
}
