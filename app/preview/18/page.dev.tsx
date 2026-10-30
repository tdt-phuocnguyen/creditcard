"use client";

// Dev-only preview of slide 18 in isolation (routable in `next dev` only).
import slide from "@/slides/s18-security";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
