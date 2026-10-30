"use client";

import { useSyncExternalStore } from "react";
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

const noopSubscribe = () => () => {};

/** WebGL support: `null` during server render / hydration, then true/false (probed once). */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore<boolean | null>(noopSubscribe, detectWebGL, () => null);
}
