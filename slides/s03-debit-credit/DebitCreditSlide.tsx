"use client";

import { motion } from "motion/react";
import { ArrowDownRight, Landmark, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { useSlide } from "@/components/SlideContext";
import { CountUp, IllustrativeBadge, KeyMessage, Reveal, SlideHeader, SlideLayout, Stagger, StaggerItem } from "@/components/primitives";
import { duration as D, ease } from "@/lib/animationPresets";
import { debitCredit as content } from "@/lib/slideContent";
import { formatVND } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Step 1 = the illustrative 2.000.000 payment happens on both cards. */
const PAYMENT_STEP = 1;

function Meter({ ratio, tone, at }: { ratio: number; tone: "cyan" | "violet"; at: number }) {
  const { step, isStatic, reducedMotion } = useSlide();
  const target = step >= at ? ratio : tone === "cyan" ? 1 : 0;
  return (
    <div className="relative h-[14px] w-full overflow-hidden rounded-full bg-ink/[0.07]">
      <motion.div
        className={cn(
          "absolute inset-y-0 left-0 w-full origin-left rounded-full",
          tone === "cyan" ? "bg-gradient-to-r from-blue to-cyan" : "bg-gradient-to-r from-violet to-blue",
        )}
        initial={false}
        animate={{ scaleX: target }}
        transition={isStatic || reducedMotion ? { duration: 0 } : { duration: D.chart, ease: ease.premium, delay: 0.15 }}
      />
    </div>
  );
}

function Column({
  label,
  alias,
  icon,
  points,
  accent,
  children,
}: {
  label: string;
  alias: string;
  icon: ReactNode;
  points: readonly string[];
  accent: "cyan" | "violet";
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-8">
      <Reveal delay={0.15} className="flex items-center gap-5">
        <span
          className={cn(
            "grid size-[60px] place-items-center rounded-2xl border",
            accent === "cyan" ? "border-cyan/30 bg-cyan/[0.08] text-cyan" : "border-violet/35 bg-violet/[0.1] text-violet",
          )}
        >
          {icon}
        </span>
        <div className="flex items-baseline gap-4">
          <h2 className="t-h2 text-ink">{label}</h2>
          <span className="t-lead text-ink-muted">{alias}</span>
        </div>
      </Reveal>
      <Stagger as="ul" delay={0.25} className="flex flex-col gap-4">
        {points.map((point) => (
          <StaggerItem as="li" key={point} className="t-body flex gap-4 text-ink/90">
            <span aria-hidden className={cn("mt-[0.62em] size-2 shrink-0 rounded-full", accent === "cyan" ? "bg-cyan" : "bg-violet")} />
            <span className="text-pretty-vi">{point}</span>
          </StaggerItem>
        ))}
      </Stagger>
      {children}
    </section>
  );
}

export function DebitCreditSlide() {
  const { debit, credit } = content;

  return (
    <SlideLayout>
      <SlideHeader title={content.headline} />

      <div className="mt-14 flex flex-1 gap-[72px]">
        <Column label={debit.label} alias={debit.alias} icon={<Wallet className="size-7" strokeWidth={1.6} />} points={debit.points} accent="cyan">
          <Reveal delay={0.45} className="surface-panel mt-auto flex min-h-[266px] flex-col gap-5 rounded-[24px] px-8 py-7">
            <div className="flex items-center justify-between">
              <span className="t-small text-ink-muted">Số dư tài khoản</span>
              <IllustrativeBadge />
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <span className="text-[44px] font-semibold leading-none tracking-[-0.02em] text-ink">
                <CountUp at={PAYMENT_STEP} from={debit.balanceBefore} value={debit.balanceAfter} format={(v) => formatVND(v)} />
              </span>
              <Reveal at={PAYMENT_STEP} y={8} className="t-num flex items-center gap-2 text-[22px] font-medium text-ink-muted">
                <ArrowDownRight className="size-5 text-cyan" strokeWidth={2} />
                {formatVND(-debit.payment)}
              </Reveal>
            </div>
            <Meter ratio={debit.balanceAfter / debit.balanceBefore} tone="cyan" at={PAYMENT_STEP} />
            <p className="t-small text-ink-muted">{debit.example}</p>
          </Reveal>
        </Column>

        <div aria-hidden className="relative w-px self-stretch bg-gradient-to-b from-transparent via-line-strong to-transparent">
          <span className="t-eyebrow absolute left-1/2 top-[34%] -translate-x-1/2 rounded-full border border-line bg-canvas px-3 py-2 text-[16px] text-ink-faint">
            vs
          </span>
        </div>

        <Column label={credit.label} alias={credit.alias} icon={<Landmark className="size-7" strokeWidth={1.6} />} points={credit.points} accent="violet">
          <Reveal delay={0.55} className="surface-panel mt-auto flex min-h-[266px] flex-col gap-5 rounded-[24px] px-8 py-7">
            <div className="flex items-center justify-between">
              <span className="t-small text-ink-muted">
                Dư nợ phải hoàn trả · hạn mức <span className="t-num">{formatVND(credit.limit)}</span>
              </span>
              <IllustrativeBadge />
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <span className="text-[44px] font-semibold leading-none tracking-[-0.02em] text-ink">
                <CountUp at={PAYMENT_STEP} from={0} value={credit.amountOwed} format={(v) => formatVND(v)} />
              </span>
              <Reveal at={PAYMENT_STEP} y={8} className="t-small text-ink-muted">
                theo sao kê và điều khoản thẻ
              </Reveal>
            </div>
            <Meter ratio={credit.amountOwed / credit.limit} tone="violet" at={PAYMENT_STEP} />
            <p className="t-small text-ink-muted">{credit.example}</p>
          </Reveal>
        </Column>
      </div>

      <KeyMessage at={PAYMENT_STEP} delay={0.9} className="mt-12">
        {content.keyMessage}
      </KeyMessage>
    </SlideLayout>
  );
}
