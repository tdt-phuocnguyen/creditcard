"use client";

// Dev-only preview of slide 11 in isolation (routable in `next dev` only).
import slide from "@/slides/s11-cashback-types";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
