"use client";

// Dev-only preview of slide 14 in isolation (routable in `next dev` only).
import slide from "@/slides/s14-spending";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
