"use client";

// Dev-only preview of slide 19 in isolation (routable in `next dev` only).
import slide from "@/slides/s19-closing";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
