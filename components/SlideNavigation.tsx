"use client";

import { motion } from "motion/react";
import { BookOpen, ChevronLeft, ChevronRight, Keyboard, LayoutGrid, Maximize, Minimize } from "lucide-react";
import type { ReactNode } from "react";
import { SAFE_AREA } from "@/lib/canvas";
import { pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";

export const DECK_TITLE = "Thẻ tín dụng: Hiểu luật chơi";

/* ────────────────────────────────────────────────────────────────────────── */
/* In-canvas footer: slide index, reveal-step dots, progress bar               */
/* ────────────────────────────────────────────────────────────────────────── */

export function FrameFooter({ index, total, step, steps }: { index: number; total: number; step: number; steps: number }) {
  const progress = (index + 1) / total;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[128px]" data-chrome>
      <div className="absolute bottom-[44px] flex items-center gap-5" style={{ left: SAFE_AREA.left }}>
        <span className="t-num text-[20px] font-medium tracking-[0.06em] text-ink-muted">
          {pad2(index + 1)}
          <span className="text-ink-faint"> / {pad2(total)}</span>
        </span>
        {steps > 1 ? <StepDots step={step} steps={steps} /> : null}
        <span className="h-4 w-px bg-line-strong" />
        <span className="text-[17px] tracking-[0.02em] text-ink-faint">{DECK_TITLE}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/[0.06]">
        <div
          className="h-full origin-left bg-gradient-to-r from-blue via-cyan to-violet transition-transform duration-700 ease-[var(--ease-premium)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}

/** Reveal-step indicator: tells the presenter how many builds remain. */
function StepDots({ step, steps }: { step: number; steps: number }) {
  return (
    <span className="flex items-center gap-[7px]">
      {Array.from({ length: steps }, (_, i) => (
        <span key={i} className="relative grid size-[9px] place-items-center">
          <span className={cn("size-[7px] rounded-full", i <= step ? "bg-ink-muted" : "border border-ink-faint/70")} />
          {i === step ? (
            <motion.span
              layoutId="current-step-ring"
              className="absolute -inset-[3px] rounded-full border border-cyan/80"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : null}
        </span>
      ))}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Floating control bar (viewport-level, auto-hides while idle)                */
/* ────────────────────────────────────────────────────────────────────────── */

function IconButton({
  label,
  shortcut,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={shortcut ? `${label} (${shortcut})` : label}
      aria-pressed={pressed}
      className={cn(
        "group/btn relative grid size-10 place-items-center rounded-full text-ink-muted outline-none",
        "transition-[background-color,color,transform] duration-150 ease-out",
        "hover:bg-ink/[0.08] hover:text-ink active:scale-[0.94] focus-visible:bg-ink/[0.08] focus-visible:text-ink",
        "focus-visible:ring-2 focus-visible:ring-cyan/80 disabled:pointer-events-none disabled:opacity-35",
        pressed && "bg-ink/[0.1] text-ink",
      )}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full right-1/2 mb-2.5 translate-x-1/2 whitespace-nowrap rounded-md border border-line",
          "bg-surface-raised px-2.5 py-1.5 text-[12px] font-medium text-ink shadow-lg",
          "scale-95 opacity-0 transition-[opacity,transform] duration-150 ease-out",
          "group-hover/btn:scale-100 group-hover/btn:opacity-100 group-focus-visible/btn:scale-100 group-focus-visible/btn:opacity-100",
        )}
      >
        {label}
        {shortcut ? <kbd className="ml-2 font-mono text-[11px] text-ink-faint">{shortcut}</kbd> : null}
      </span>
    </button>
  );
}

export function ControlBar({
  hidden,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onOverview,
  overviewOpen,
  onFullscreen,
  isFullscreen,
  onHelp,
  helpOpen,
  onReader,
}: {
  hidden: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOverview: () => void;
  overviewOpen: boolean;
  onFullscreen: () => void;
  isFullscreen: boolean;
  onHelp: () => void;
  helpOpen: boolean;
  /** Offered on small screens: switch to the text reader. */
  onReader?: () => void;
}) {
  return (
    <nav
      aria-label="Điều khiển trình chiếu"
      className={cn(
        "fixed bottom-3 right-3 z-30 flex items-center gap-0.5 rounded-full border border-line bg-surface/75 p-1 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-md",
        "transition-opacity duration-300 ease-out focus-within:pointer-events-auto focus-within:opacity-100",
        hidden ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      data-controls
    >
      <IconButton label="Quay lại" shortcut="←" onClick={onPrev} disabled={!canPrev}>
        <ChevronLeft className="size-5" strokeWidth={1.75} />
      </IconButton>
      <IconButton label="Tiếp theo" shortcut="→" onClick={onNext} disabled={!canNext}>
        <ChevronRight className="size-5" strokeWidth={1.75} />
      </IconButton>
      <span aria-hidden className="mx-1 h-5 w-px bg-line-strong" />
      <IconButton label="Tổng quan" shortcut="O" onClick={onOverview} pressed={overviewOpen}>
        <LayoutGrid className="size-[18px]" strokeWidth={1.75} />
      </IconButton>
      <IconButton label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"} shortcut="F" onClick={onFullscreen}>
        {isFullscreen ? <Minimize className="size-[18px]" strokeWidth={1.75} /> : <Maximize className="size-[18px]" strokeWidth={1.75} />}
      </IconButton>
      <IconButton label="Phím tắt" shortcut="?" onClick={onHelp} pressed={helpOpen}>
        <Keyboard className="size-[18px]" strokeWidth={1.75} />
      </IconButton>
      {onReader ? (
        <IconButton label="Chế độ đọc" onClick={onReader}>
          <BookOpen className="size-[18px]" strokeWidth={1.75} />
        </IconButton>
      ) : null}
    </nav>
  );
}
