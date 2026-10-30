"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid min-w-[1.75rem] place-items-center rounded-md border border-line-strong bg-ink/[0.04] px-1.5 py-0.5 font-mono text-[11px] font-medium leading-4 text-ink">
      {children}
    </kbd>
  );
}

const rows: { keys: string[]; label: string }[] = [
  { keys: ["→", "Space"], label: "Bước tiếp theo / slide sau" },
  { keys: ["←"], label: "Quay lại" },
  { keys: ["Home", "End"], label: "Slide đầu / slide cuối" },
  { keys: ["O"], label: "Tổng quan" },
  { keys: ["F"], label: "Toàn màn hình" },
  { keys: ["B"], label: "Màn hình đen (tạm dừng)" },
  { keys: ["Esc"], label: "Đóng / thoát" },
];

/** Small, dismissible controls hint (first visit, or toggled with "?"). */
export function HelpHint({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      role="dialog"
      aria-label="Phím tắt trình chiếu"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-3 left-3 z-30 w-[min(340px,calc(100vw-1.5rem))] rounded-2xl border border-line bg-surface/90 p-4 text-ink shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md"
      data-help
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Điều khiển</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng hướng dẫn"
          className="grid size-7 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ink/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/80"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-[13px]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="flex gap-1">
              {row.keys.map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </dt>
            <dd className="text-ink-muted">{row.label}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-faint">
        Nhấp nửa phải khung hình để tiến, nửa trái để lùi. Trên màn hình cảm ứng: chạm hoặc vuốt ngang.
      </p>
    </motion.aside>
  );
}
