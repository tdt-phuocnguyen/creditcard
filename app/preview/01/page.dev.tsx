"use client";

// Dev-only preview of slide 01 in isolation (routable in `next dev` only).
import slide from "@/slides/s01-opening";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
