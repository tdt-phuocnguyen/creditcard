"use client";

// Dev-only preview of slide 10 in isolation (routable in `next dev` only).
import slide from "@/slides/s10-cic";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
