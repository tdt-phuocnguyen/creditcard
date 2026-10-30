"use client";

import dynamic from "next/dynamic";
import { AnimatedLines, Chip, Headline, KeyMessage, SlideLayout, Stagger, StaggerItem } from "@/components/primitives";
import { CardFallback } from "@/components/Scene3D/CardFallback";
import { SceneHost } from "@/components/Scene3D/SceneHost";
import { opening as content } from "@/lib/slideContent";

const OpeningCardScene = dynamic(() => import("@/components/Scene3D/OpeningCardScene"), { ssr: false, loading: () => null });

export const preloadOpeningScene = () => import("@/components/Scene3D/OpeningCardScene");

/** "THẺ TÍN DỤNG" set as a two-line lockup: "THẺ" / "TÍN DỤNG". */
const [firstWord, ...rest] = content.headline.split(" ");
const restWords = rest.join(" ");

/** "Hiểu luật chơi. Tối ưu lợi ích. Kiểm soát rủi ro." → three lines. */
const subLines = content.subheadline.split(/(?<=\.)\s+/);

export function OpeningSlide() {
  return (
    <SlideLayout
      bleed={
        <>
          {/* cinematic key light behind the card */}
          <div
            className="absolute right-[-160px] top-[90px] h-[900px] w-[1100px] rounded-full"
            style={{ background: "radial-gradient(closest-side, rgb(78 161 255 / 0.16), rgb(139 124 255 / 0.06) 55%, transparent)" }}
          />
          <SceneHost
            scene={OpeningCardScene}
            fallback={<CardFallback pose="hero" />}
            fallbackWhileLoading={false}
            label="Một chiếc thẻ tín dụng kim loại cao cấp lơ lửng trong bóng tối, viền sáng xanh lam."
            className="absolute right-0 top-0 h-full w-[1060px]"
          />
        </>
      }
    >
      <div className="flex h-full max-w-[900px] flex-col">
        <div className="my-auto flex flex-col gap-10">
          <Headline
            className="t-display -my-[0.14em] bg-gradient-to-b from-ink via-ink to-ink-muted bg-clip-text py-[0.14em] leading-[0.98] text-transparent"
            delay={0.1}
          >
            {firstWord}
            <br />
            {restWords}
          </Headline>

          <AnimatedLines
            lines={subLines}
            delay={0.32}
            className="flex flex-col gap-1"
            lineClassName="text-[46px] font-medium leading-[1.22] tracking-[-0.022em] text-ink-muted first:text-ink"
          />

          <Stagger delay={0.62} gap={0.07} className="flex max-w-[860px] flex-wrap gap-3.5">
            {content.tags.map((tag) => (
              <StaggerItem key={tag} y={12}>
                <Chip className="px-5 py-2.5 text-[20px] text-ink/85">{tag}</Chip>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <KeyMessage delay={0.95}>{content.keyMessage}</KeyMessage>
      </div>
    </SlideLayout>
  );
}
