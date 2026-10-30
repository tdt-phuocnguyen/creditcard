"use client";

// Dev-only preview of slide 17 in isolation (routable in `next dev` only).
import slide from "@/slides/s17-utilization";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
