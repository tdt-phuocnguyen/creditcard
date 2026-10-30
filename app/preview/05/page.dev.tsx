"use client";

// Dev-only preview of slide 05 in isolation (routable in `next dev` only).
import slide from "@/slides/s05-card-networks";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
