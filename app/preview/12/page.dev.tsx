"use client";

// Dev-only preview of slide 12 in isolation (routable in `next dev` only).
import slide from "@/slides/s12-mcc";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
