"use client";

import { Info, MonitorPlay, PencilRuler, TriangleAlert } from "lucide-react";
import { readerSlides, type ReaderSection } from "@/lib/readerContent";
import { chapters, slideIndex, ILLUSTRATIVE_LABEL } from "@/lib/slideContent";
import { pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";
import { DECK_TITLE } from "./SlideNavigation";

function SectionBlock({ section }: { section: ReaderSection }) {
  const { tone = "default", title, text, items, ordered, rows } = section;

  if (tone === "key") {
    return (
      <div className="flex gap-3.5 py-1">
        <span aria-hidden className="w-1 shrink-0 rounded-full bg-gradient-to-b from-blue to-cyan" />
        <p className="text-[17px] font-medium leading-relaxed text-ink">{text}</p>
      </div>
    );
  }

  const List = ordered ? "ol" : "ul";
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5",
        tone === "example" && "rounded-2xl border border-dashed border-ink-faint/50 p-4",
        tone === "warning" && "rounded-2xl border border-risk/30 bg-risk/[0.05] p-4",
      )}
    >
      {tone === "example" ? (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          <PencilRuler aria-hidden className="size-3.5 text-cyan" />
          {title && title !== ILLUSTRATIVE_LABEL ? `${ILLUSTRATIVE_LABEL} · ${title}` : ILLUSTRATIVE_LABEL}
        </span>
      ) : title ? (
        <h4
          className={cn(
            "flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em]",
            tone === "caveat" ? "text-ink-faint" : tone === "warning" ? "text-risk" : "text-ink-muted",
          )}
        >
          {tone === "caveat" ? <Info aria-hidden className="size-3.5" /> : null}
          {tone === "warning" ? <TriangleAlert aria-hidden className="size-3.5" /> : null}
          {title}
        </h4>
      ) : null}

      {rows ? (
        <dl className="flex flex-col divide-y divide-line">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 py-2 first:pt-0 last:pb-0">
              <dt className="text-[15px] text-ink-muted">{row.label}</dt>
              <dd className="t-num text-right text-[15px] font-medium text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {items ? (
        <List className={cn("flex flex-col gap-1.5", ordered && "list-decimal pl-5 marker:text-ink-faint")}>
          {items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "text-[16px] leading-relaxed",
                tone === "caveat" ? "text-ink-muted" : "text-ink/90",
                !ordered && "relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-ink-faint",
              )}
            >
              {item}
            </li>
          ))}
        </List>
      ) : null}

      {text ? <p className={cn("text-[16px] leading-relaxed", tone === "caveat" ? "text-ink-muted" : "text-ink/90")}>{text}</p> : null}
    </div>
  );
}

/**
 * Mobile fallback: the full deck as a readable, scrollable document built from
 * the same structured content. Phones open here by default; tablets and
 * desktops get the slides.
 */
export function MobileReader({ onOpenDeck }: { onOpenDeck: () => void }) {
  return (
    <div className="fixed inset-0 overflow-y-auto overscroll-contain bg-canvas text-ink" data-view="reader">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">Bài trình bày · {readerSlides.length} slide</p>
            <h1 className="truncate text-[17px] font-semibold tracking-[-0.01em]">{DECK_TITLE}</h1>
          </div>
          <button
            type="button"
            onClick={onOpenDeck}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-cyan/80"
          >
            <MonitorPlay aria-hidden className="size-4 text-cyan" />
            Trình chiếu
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col px-5 pb-24">
        <p className="mt-5 rounded-xl border border-line bg-surface/60 px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
          Bạn đang xem chế độ đọc dành cho màn hình nhỏ. Xoay ngang thiết bị hoặc mở trên máy tính để xem dạng trình chiếu.
        </p>

        {readerSlides.map((slide) => {
          const entry = slideIndex[slide.number - 1];
          const chapter = chapters[entry.chapter];
          const chapterLabel = chapter.number ? `Chương ${chapter.number} · ${chapter.title}` : chapter.title;
          return (
            <article
              key={slide.number}
              id={`slide-${slide.number}`}
              className="flex scroll-mt-20 flex-col gap-5 border-b border-line py-10 last:border-b-0"
            >
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
                <span className="t-num text-ink-muted">{pad2(slide.number)}</span>
                <span aria-hidden className="h-px w-6 bg-gradient-to-r from-blue to-cyan" />
                {chapterLabel}
              </p>
              <h2 className="text-[26px] font-semibold leading-[1.22] tracking-[-0.02em] text-balance">{slide.headline}</h2>
              {slide.subheadline ? <p className="-mt-2 text-[17px] leading-relaxed text-ink-muted">{slide.subheadline}</p> : null}
              {slide.sections.map((section, i) => (
                <SectionBlock key={i} section={section} />
              ))}
            </article>
          );
        })}
      </main>
    </div>
  );
}
