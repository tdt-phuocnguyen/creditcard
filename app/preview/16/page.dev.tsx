"use client";

// Dev-only preview of slide 16 in isolation (routable in `next dev` only).
import slide from "@/slides/s16-eligibility";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
