"use client";

// Dev-only preview of slide 15 in isolation (routable in `next dev` only).
import slide from "@/slides/s15-combo";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
