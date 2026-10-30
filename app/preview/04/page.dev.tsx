"use client";

// Dev-only preview of slide 04 in isolation (routable in `next dev` only).
import slide from "@/slides/s04-transaction-parties";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
