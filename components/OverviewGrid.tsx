"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Backdrop } from "./Backdrop";
import { SlideHost } from "./SlideHost";
import { ThumbnailFrame } from "./SlideFrame";
import { chapters } from "@/lib/slideContent";
import { pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { SlideDefinition } from "@/slides/types";

/** Renders a static, final-state thumbnail once it scrolls into view. */
function LazyThumbnail({ def, root }: { def: SlideDefinition; root: HTMLElement | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root, rootMargin: "240px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root, visible]);

  return (
    <div ref={ref} aria-hidden inert className="pointer-events-none">
      <ThumbnailFrame>
        <Backdrop chapter={def.chapter} />
        {visible ? <SlideHost def={def} step={def.steps - 1} isStatic reducedMotion /> : null}
      </ThumbnailFrame>
    </div>
  );
}

/**
 * Overview Mode: every slide as a live thumbnail (final reveal state, no
 * animation, 2D fallbacks instead of WebGL). Arrow keys move between
 * thumbnails, Enter opens one, Esc closes.
 */
export function OverviewGrid({
  slides,
  currentIndex,
  onSelect,
  onClose,
}: {
  slides: readonly SlideDefinition[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
    const current = buttonsRef.current[currentIndex];
    current?.focus({ preventScroll: true });
    current?.scrollIntoView({ block: "center" });
    // Only on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusAt = (index: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    const button = buttonsRef.current[clamped];
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: "nearest" });
  };

  const columns = () => {
    const buttons = buttonsRef.current.filter(Boolean) as HTMLButtonElement[];
    if (buttons.length < 2) return 1;
    const top = buttons[0].getBoundingClientRect().top;
    const perRow = buttons.findIndex((b) => Math.abs(b.getBoundingClientRect().top - top) > 4);
    return perRow === -1 ? buttons.length : perRow;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const active = document.activeElement as HTMLElement | null;
    const index = buttonsRef.current.findIndex((b) => b === active);

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key === "Tab") {
      // Keep focus inside the dialog.
      const focusables = [closeRef.current, ...buttonsRef.current].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (index === -1) return;
    const cols = columns();
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index + cols,
      ArrowUp: index - cols,
      Home: 0,
      End: slides.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      event.stopPropagation();
      focusAt(moves[event.key]);
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Tổng quan các slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 bg-letterbox/[0.97] backdrop-blur-xl"
      onKeyDown={onKeyDown}
      data-overview
    >
      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[1760px] px-5 pb-16 pt-6 sm:px-8 lg:px-12">
          <header className="sticky top-0 z-10 -mx-5 mb-6 flex items-center justify-between gap-4 bg-letterbox/80 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            <div className="flex items-baseline gap-3">
              <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">Tổng quan</h2>
              <span className="t-num text-[14px] text-ink-faint">{slides.length} slide</span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Đóng tổng quan (Esc)"
              className="grid size-10 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:bg-ink/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/80"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </header>

          <motion.ol
            className="grid gap-x-5 gap-y-7 [grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr))]"
            initial="hidden"
            animate="shown"
            variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.025 } } }}
          >
            {slides.map((def, i) => {
              const chapter = chapters[def.chapter];
              const isCurrent = i === currentIndex;
              return (
                <motion.li
                  key={def.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  <button
                    ref={(el) => {
                      buttonsRef.current[i] = el;
                    }}
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isCurrent ? "true" : undefined}
                    aria-label={`Slide ${def.number}: ${def.title}`}
                    className="group block w-full rounded-2xl text-left outline-none"
                    data-thumb={def.number}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-xl border bg-canvas transition-[transform,border-color,box-shadow] duration-200 ease-out",
                        "group-hover:-translate-y-0.5 group-hover:border-line-strong group-hover:shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)]",
                        "group-focus-visible:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-cyan/80",
                        isCurrent ? "border-blue/70" : "border-line",
                      )}
                    >
                      <LazyThumbnail def={def} root={scrollRoot} />
                      {isCurrent ? (
                        <motion.span
                          layoutId="overview-current"
                          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-inset ring-blue/80"
                        />
                      ) : null}
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-2.5 px-0.5">
                      <span className={cn("t-num text-[13px] font-medium", isCurrent ? "text-blue" : "text-ink-faint")}>
                        {pad2(def.number)}
                      </span>
                      <span className="text-[15px] font-medium leading-snug text-ink">{def.title}</span>
                    </div>
                    <p className="mt-0.5 px-0.5 pl-[2.1rem] text-[12px] text-ink-faint">
                      {chapter.number ? `Chương ${chapter.number} · ${chapter.title}` : chapter.title}
                    </p>
                  </button>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </motion.div>
  );
}
