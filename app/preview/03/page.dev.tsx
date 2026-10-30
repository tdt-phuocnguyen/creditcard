"use client";

// Dev-only preview of slide 03 in isolation (routable in `next dev` only).
import slide from "@/slides/s03-debit-credit";
import { PreviewHost } from "@/components/dev/PreviewHost";

export default function Page() {
  return <PreviewHost slide={slide} />;
}
