"use client";

import { Info, PencilRuler } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./Reveal";
import { ILLUSTRATIVE_LABEL } from "@/lib/slideContent";
import { cn } from "@/lib/cn";

type Tone = "default" | "positive" | "risk" | "violet";

const toneBar: Record<Tone, string> = {
  default: "from-blue to-cyan",
  positive: "from-positive to-cyan",
  risk: "from-risk to-caution",
  violet: "from-violet to-blue",
};

/**
 * The slide's key message — one consistent, quietly emphatic treatment across
 * the deck (accent bar + statement). `tone` follows meaning: risk for warnings,
 * positive for good financial outcomes, default otherwise.
 */
export function KeyMessage({
  children,
  at = 0,
  delay = 0.35,
  tone = "default",
  className,
  size = "md",
}: {
  children: ReactNode;
  at?: number;
  delay?: number;
  tone?: Tone;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <Reveal at={at} delay={delay} y={16} className={cn("flex items-stretch gap-6", className)}>
      <span aria-hidden className={cn("w-[5px] shrink-0 rounded-full bg-gradient-to-b", toneBar[tone])} />
      <p
        className={cn(
          "text-pretty-vi font-medium tracking-[-0.012em] text-ink",
          size === "lg" ? "text-[36px] leading-[1.3]" : "text-[29px] leading-[1.35]",
        )}
      >
        {children}
      </p>
    </Reveal>
  );
}

/** "Ví dụ minh họa" — attach to every illustrative number or scenario. */
export function IllustrativeBadge({ label = ILLUSTRATIVE_LABEL, className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-dashed border-ink-faint/60 px-3.5 py-1.5",
        "text-[16px] font-medium uppercase leading-none tracking-[0.12em] text-ink-muted",
        className,
      )}
    >
      <PencilRuler aria-hidden className="size-4 text-cyan" strokeWidth={1.75} />
      {label}
    </span>
  );
}

/** Caveats / qualifications. Muted but readable (≥ 20 px). Never omit them. */
export function NoteList({
  items,
  title = "Lưu ý",
  className,
  itemClassName,
  icon = true,
}: {
  items: readonly ReactNode[];
  title?: ReactNode | null;
  className?: string;
  itemClassName?: string;
  icon?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title ? (
        <div className="flex items-center gap-2.5 text-ink-muted">
          {icon ? <Info aria-hidden className="size-[18px] text-ink-faint" strokeWidth={1.75} /> : null}
          <span className="t-eyebrow text-[16px]">{title}</span>
        </div>
      ) : null}
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className={cn("t-small flex gap-3 text-ink-muted", itemClassName)}>
            <span aria-hidden className="mt-[0.7em] size-[5px] shrink-0 rounded-full bg-ink-faint" />
            <span className="text-pretty-vi">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small rounded label. */
export function Chip({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-[19px] leading-none text-ink-muted",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

/** Elevated panel with a fine border and soft top highlight. */
export function Surface({
  children,
  className,
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={cn("surface-panel rounded-[28px]", className)} style={style}>
      {children}
    </Tag>
  );
}
