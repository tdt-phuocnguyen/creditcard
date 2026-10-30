"use client";

// Dev-only preview of slide 06 in isolation (routable in `next dev` only).
import slide from "@/slides/s06-billing-cycle";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
