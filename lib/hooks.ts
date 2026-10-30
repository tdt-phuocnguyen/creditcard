"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { getRuntimeFlags } from "./flags";

/** False during server render and hydration, true after mount. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

/** Media query match; `false` on the server (no hydration mismatch). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(() => subscribeMedia(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** OS "reduce motion" preference, or `?motion=reduce`. */
export function usePrefersReducedMotion(): boolean {
  const os = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [flag, setFlag] = useState(false);
  useEffect(() => setFlag(getRuntimeFlags().reduceMotion), []);
  return os || flag;
}

export type ViewportInfo = { width: number; height: number; coarse: boolean };

/** Viewport size + pointer type; null until mounted. */
export function useViewport(): ViewportInfo | null {
  const [info, setInfo] = useState<ViewportInfo | null>(null);
  useEffect(() => {
    const update = () =>
      setInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        coarse: window.matchMedia("(pointer: coarse)").matches,
      });
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return info;
}

/** localStorage access that never throws (private mode, blocked storage). */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable — fine, it's only a convenience */
    }
  },
};
