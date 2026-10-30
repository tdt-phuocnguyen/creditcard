"use client";

import type { ChapterId } from "@/lib/slideContent";

/**
 * Stable canvas background shared by every slide (it does not transition with
 * the slides, which gives continuity). Soft radial lights shift gently per
 * chapter; fine grain and a vignette add depth without competing with content.
 */
const lights: Record<ChapterId, { a: string; b: string }> = {
  intro: {
    a: "radial-gradient(60% 55% at 22% 18%, rgb(78 161 255 / 0.16), transparent 70%)",
    b: "radial-gradient(55% 50% at 86% 92%, rgb(139 124 255 / 0.12), transparent 70%)",
  },
  understand: {
    a: "radial-gradient(55% 50% at 14% 10%, rgb(78 161 255 / 0.14), transparent 70%)",
    b: "radial-gradient(50% 50% at 92% 80%, rgb(85 214 232 / 0.09), transparent 70%)",
  },
  costs: {
    a: "radial-gradient(55% 50% at 10% 14%, rgb(139 124 255 / 0.13), transparent 70%)",
    b: "radial-gradient(50% 45% at 90% 88%, rgb(78 161 255 / 0.10), transparent 70%)",
  },
  cashback: {
    a: "radial-gradient(55% 50% at 18% 8%, rgb(85 214 232 / 0.12), transparent 70%)",
    b: "radial-gradient(50% 50% at 88% 90%, rgb(78 161 255 / 0.11), transparent 70%)",
  },
  combo: {
    a: "radial-gradient(55% 50% at 12% 12%, rgb(78 161 255 / 0.13), transparent 70%)",
    b: "radial-gradient(50% 50% at 90% 86%, rgb(139 124 255 / 0.11), transparent 70%)",
  },
  safety: {
    a: "radial-gradient(55% 50% at 16% 10%, rgb(139 124 255 / 0.12), transparent 70%)",
    b: "radial-gradient(50% 50% at 86% 90%, rgb(85 214 232 / 0.09), transparent 70%)",
  },
  closing: {
    a: "radial-gradient(60% 55% at 50% 18%, rgb(78 161 255 / 0.15), transparent 70%)",
    b: "radial-gradient(55% 50% at 50% 100%, rgb(139 124 255 / 0.10), transparent 70%)",
  },
};

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Backdrop({ chapter }: { chapter: ChapterId }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-canvas" data-backdrop>
      {(Object.keys(lights) as ChapterId[]).map((id) => (
        <div
          key={id}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
          style={{ backgroundImage: `${lights[id].a}, ${lights[id].b}`, opacity: id === chapter ? 1 : 0 }}
        />
      ))}
      {/* precise hairline grid, faded toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(166 178 197) 1px, transparent 1px), linear-gradient(to bottom, rgb(166 178 197) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(70% 65% at 50% 45%, black, transparent 85%)",
          WebkitMaskImage: "radial-gradient(70% 65% at 50% 45%, black, transparent 85%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 95% at 50% 45%, transparent 55%, rgb(2 4 9 / 0.55) 100%)" }}
      />
    </div>
  );
}
