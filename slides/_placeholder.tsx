"use client";

import { readerSlides } from "@/lib/readerContent";
import { KeyMessage, NoteList, Reveal, SlideHeader, SlideLayout } from "@/components/primitives";

/**
 * Temporary text-only rendition of a slide (from the reader content) used
 * until the designed slide component exists. Keeps the deck fully navigable.
 */
export function createPlaceholder(number: number) {
  function PlaceholderSlide() {
    const slide = readerSlides[number - 1];
    const keySection = slide.sections.find((s) => s.tone === "key");
    const body = slide.sections.filter((s) => s.tone !== "key");
    return (
      <SlideLayout>
        <SlideHeader title={slide.headline} lead={slide.subheadline} />
        <Reveal delay={0.25} className="mt-10 columns-2 gap-12">
          {body.map((section, i) => (
            <div key={i} className="mb-6 break-inside-avoid">
              <NoteList
                title={section.title ?? null}
                icon={false}
                items={[
                  ...(section.items ?? []),
                  ...(section.rows ?? []).map((r) => `${r.label}: ${r.value}`),
                  ...(section.text ? [section.text] : []),
                ]}
              />
            </div>
          ))}
        </Reveal>
        {keySection?.text ? <KeyMessage className="mt-auto">{keySection.text}</KeyMessage> : null}
      </SlideLayout>
    );
  }
  PlaceholderSlide.displayName = `PlaceholderSlide${number}`;
  return PlaceholderSlide;
}
