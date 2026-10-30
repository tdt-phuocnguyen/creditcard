import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Static export: the presentation is a single client-side page, so it can be
 * hosted anywhere (or served offline from `out/` during a live talk).
 *
 * `*.dev.tsx` route files (per-slide preview pages under `app/preview/`) are
 * only routable in `next dev`; production builds ignore them.
 */
export default function config(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    output: "export",
    images: { unoptimized: true },
    reactStrictMode: true,
    devIndicators: false,
    pageExtensions: isDev ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"],
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };
}
