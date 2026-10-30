"use client";

import type { CSSProperties, ReactNode } from "react";
import { useSlide } from "@/components/SlideContext";
import { Headline } from "@/components/AnimatedText";
import { Reveal } from "./Reveal";
import { SAFE_AREA } from "@/lib/canvas";
import { chapters, slideIndex } from "@/lib/slideContent";
import { cn } from "@/lib/cn";

/**
 * Full-canvas slide container that applies the safe area (content stays clear
 * of the edges and of the footer band). Use `bleed` children for decorative
 * full-canvas layers.
 */
export function SlideLayout({
  children,
  className,
  style,
  bleed,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Decorative layer rendered behind the safe area, edge to edge. */
  bleed?: ReactNode;
}) {
  return (
    <div className="absolute inset-0">
      {bleed ? (
        <div aria-hidden className="pointer-events-none absolute inset-0" data-allow-bleed>
          {bleed}
        </div>
      ) : null}
      <div
        className={cn("absolute flex flex-col", className)}
        style={{ top: SAFE_AREA.top, right: SAFE_AREA.right, bottom: SAFE_AREA.bottom, left: SAFE_AREA.left, ...style }}
        data-safe-area
      >
        {children}
      </div>
    </div>
  );
}

/** Chapter label for the current slide, e.g. "Chương 2 · Chi phí và rủi ro". */
export function Eyebrow({ className, children, at = 0 }: { className?: string; children?: ReactNode; at?: number }) {
  const { number } = useSlide();
  const entry = slideIndex[number - 1];
  const chapter = entry ? chapters[entry.chapter] : null;
  const label = children ?? (chapter ? (chapter.number ? `Chương ${chapter.number} · ${chapter.title}` : chapter.title) : null);
  if (!label) return null;

  return (
    <Reveal at={at} y={12} className={cn("flex items-center gap-4", className)}>
      <span aria-hidden className="h-[2px] w-8 rounded-full bg-gradient-to-r from-blue to-cyan" />
      <span className="t-eyebrow text-ink-muted">{label}</span>
    </Reveal>
  );
}

/** Eyebrow + headline (+ optional lead) — the standard slide header. */
export function SlideHeader({
  title,
  lead,
  eyebrow,
  className,
  titleClassName,
  maxWidth = 1360,
}: {
  title: ReactNode;
  lead?: ReactNode;
  /** Override the automatic chapter label; pass `false` to hide it. */
  eyebrow?: ReactNode | false;
  className?: string;
  titleClassName?: string;
  maxWidth?: number;
}) {
  return (
    <header className={cn("flex flex-col gap-6", className)} style={{ maxWidth }}>
      {eyebrow === false ? null : <Eyebrow>{eyebrow}</Eyebrow>}
      <Headline delay={0.05} className={titleClassName}>
        {title}
      </Headline>
      {lead ? (
        <Reveal delay={0.18} className="t-lead max-w-[1100px] text-ink-muted">
          {lead}
        </Reveal>
      ) : null}
    </header>
  );
}
