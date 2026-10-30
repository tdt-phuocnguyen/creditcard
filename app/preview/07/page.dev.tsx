"use client";

// Dev-only preview of slide 07 in isolation (routable in `next dev` only).
import slide from "@/slides/s07-benefits";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
