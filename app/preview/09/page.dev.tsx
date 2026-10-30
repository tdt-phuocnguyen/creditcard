"use client";

// Dev-only preview of slide 09 in isolation (routable in `next dev` only).
import slide from "@/slides/s09-fees";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
