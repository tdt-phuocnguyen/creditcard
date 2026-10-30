"use client";

// Dev-only preview of slide 08 in isolation (routable in `next dev` only).
import slide from "@/slides/s08-minimum-payment";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
