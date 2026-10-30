"use client";

import { useEffect, useState } from "react";
import { getRuntimeFlags } from "@/lib/flags";

let cached: boolean | null = null;

/** Probe once for WebGL; the probe context is released immediately. */
export function detectWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;
  if (getRuntimeFlags().disableWebGL) return (cached = false);
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    cached = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

/**
 * WebGL support. Slides only render on the client (after mount), so this is
 * known on the first render; `null` only if ever rendered on the server.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(() => (typeof window === "undefined" ? null : detectWebGL()));
  useEffect(() => {
    setSupported(detectWebGL());
  }, []);
  return supported;
}
