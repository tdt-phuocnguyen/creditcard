"use client";

// Dev-only preview of slide 02 in isolation (routable in `next dev` only).
import slide from "@/slides/s02-roadmap";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
