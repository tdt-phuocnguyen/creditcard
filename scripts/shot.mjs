#!/usr/bin/env node
/**
 * Slide screenshot + layout audit (dev QA tool).
 *
 *   node scripts/shot.mjs <slide|all> [options]
 *
 * Renders slide N via its isolated dev preview route (/preview/NN) — or the
 * full deck with --deck — steps through every reveal step, saves a PNG per
 * step, and audits each state for:
 *   • console errors / warnings and page errors
 *   • text outside the canvas safe area (canvas px)
 *   • clipped content (overflow hidden/clip with scroll size > box)
 *   • overlapping visible text
 *   • text smaller than 16 canvas px
 *
 * Options
 *   --size=1920x1080[,1280x720]  viewport(s)                 (default 1920x1080)
 *   --wait=1700                  ms to settle after a step    (default 1700)
 *   --direct                     load each step via ?step=N instead of pressing →
 *   --static                     static render (thumbnail mode)
 *   --reduce                     emulate prefers-reduced-motion
 *   --webgl=0                    force 2D fallbacks for 3D scenes
 *   --deck                       use the main deck (/#/N/S) instead of /preview/NN
 *   --out=DIR                    output dir (default ./.shots)
 *   --base=URL                   dev server (default http://localhost:3000)
 *   --quiet                      only print the summary JSON
 *
 * Exit code 0 even when issues are found — read the report.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = await import("playwright"));
}

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  return hit.includes("=") ? hit.split("=").slice(1).join("=") : true;
};
const target = args.find((a) => !a.startsWith("--"));
if (!target) {
  console.error("usage: node scripts/shot.mjs <slide|all> [--size=WxH,...] [--direct] [--static] [--reduce] [--webgl=0] [--deck]");
  process.exit(2);
}

const base = String(opt("base", "http://localhost:3000")).replace(/\/$/, "");
const out = resolve(String(opt("out", ".shots")));
const wait = Number(opt("wait", 1700));
const sizes = String(opt("size", "1920x1080"))
  .split(",")
  .map((s) => s.split("x").map(Number));
const direct = Boolean(opt("direct", false));
const isStatic = Boolean(opt("static", false));
const reduce = Boolean(opt("reduce", false));
const webgl = opt("webgl", "1") !== "0";
const deck = Boolean(opt("deck", false));
const quiet = Boolean(opt("quiet", false));
const numbers = target === "all" ? Array.from({ length: 19 }, (_, i) => i + 1) : target.split(",").map(Number);

mkdirSync(out, { recursive: true });

const SAFE = { top: 88, right: 120, bottom: 128, left: 120 };

/** Runs in the page: audit the current slide state. */
function auditInPage(SAFE) {
  const canvas = document.querySelector("[data-canvas]");
  const root = document.querySelector("[data-slide-root][data-active='true']") ?? document.querySelector("[data-slide-root]");
  if (!canvas || !root) return { error: "no canvas/slide root found" };
  const c = canvas.getBoundingClientRect();
  const scale = c.width / 1920;
  const toCanvas = (r) => ({
    x: Math.round((r.left - c.left) / scale),
    y: Math.round((r.top - c.top) / scale),
    w: Math.round(r.width / scale),
    h: Math.round(r.height / scale),
  });
  const safe = { left: SAFE.left, top: SAFE.top, right: 1920 - SAFE.right, bottom: 1080 - SAFE.bottom };
  const visible = (el) =>
    el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true;

  const issues = { outsideSafeArea: [], clipped: [], overlaps: [], smallText: [] };
  const textBoxes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || !visible(el)) continue;
    if (el.closest(".sr-only, [data-allow-bleed], [data-scene-fallback]")) continue;
    const style = getComputedStyle(el);
    // effective opacity through ancestors
    let op = 1;
    for (let a = el; a && a !== root.parentElement; a = a.parentElement) op *= Number(getComputedStyle(a).opacity);
    if (op < 0.3) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    if (!rects.length) continue;
    const fontSize = parseFloat(style.fontSize);
    if (fontSize < 16) issues.smallText.push({ text: text.slice(0, 60), fontSize });
    for (const r of rects) {
      const b = toCanvas(r);
      textBoxes.push({ text: text.slice(0, 50), b, el });
      const outside = b.x < safe.left - 2 || b.y < safe.top - 2 || b.x + b.w > safe.right + 2 || b.y + b.h > safe.bottom + 2;
      if (outside) issues.outsideSafeArea.push({ text: text.slice(0, 60), box: b });
    }
  }
  // overlaps between text boxes from different elements
  for (let i = 0; i < textBoxes.length; i++) {
    for (let j = i + 1; j < textBoxes.length; j++) {
      const A = textBoxes[i], B = textBoxes[j];
      if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const ox = Math.min(A.b.x + A.b.w, B.b.x + B.b.w) - Math.max(A.b.x, B.b.x);
      const oy = Math.min(A.b.y + A.b.h, B.b.y + B.b.h) - Math.max(A.b.y, B.b.y);
      if (ox > 3 && oy > 3) issues.overlaps.push({ a: A.text, b: B.text, overlap: [ox, oy] });
    }
  }
  // clipped containers
  for (const el of root.querySelectorAll("*")) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    const clips = /(hidden|clip)/.test(s.overflowX + s.overflowY);
    if (!clips) continue;
    if (el.closest("[data-allow-bleed], [data-scene-host]") || el.hasAttribute("data-allow-clip")) continue;
    if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
      const txt = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (txt) issues.clipped.push({ text: txt.slice(0, 60), scroll: [el.scrollWidth, el.scrollHeight], box: [el.clientWidth, el.clientHeight] });
    }
  }
  for (const k of Object.keys(issues)) issues[k] = issues[k].slice(0, 25);
  return issues;
}

const browser = await chromium.launch();
const report = [];

for (const [w, h] of sizes) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  // Never show the first-visit help card in screenshots.
  await context.addInitScript(() => {
    try {
      localStorage.setItem("the-tin-dung:help-dismissed", "1");
    } catch {}
  });
  const page = await context.newPage();
  const logs = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") logs.push(`[${m.type()}] ${m.text().slice(0, 400)}`);
  });
  page.on("pageerror", (e) => logs.push(`[pageerror] ${String(e).slice(0, 400)}`));

  for (const n of numbers) {
    const nn = String(n).padStart(2, "0");
    const qs = new URLSearchParams();
    if (isStatic) qs.set("static", "1");
    if (!webgl) qs.set("webgl", "0");
    qs.set("help", "0");
    const urlFor = (step) => {
      if (deck) return `${base}/?${qs}#/${n}${step ? `/${step}` : ""}`;
      const q = new URLSearchParams(qs);
      if (step) q.set("step", String(step));
      return `${base}/preview/${nn}?${q}`;
    };
    logs.length = 0;
    await page.goto(urlFor(0), { waitUntil: "networkidle" });
    await page.waitForSelector("[data-slide-root]", { timeout: 30000 });
    await page.evaluate(() => document.fonts?.ready);
    const steps = Number(await page.getAttribute("[data-slide-root]", "data-steps"));
    const results = [];
    const stepList = isStatic ? [steps - 1] : Array.from({ length: steps }, (_, i) => i);
    for (const s of stepList) {
      if (s > 0 && !isStatic) {
        if (direct) await page.goto(urlFor(s), { waitUntil: "networkidle" });
        else {
          await page.mouse.move(5, 5);
          await page.keyboard.press("ArrowRight");
        }
      }
      await page.waitForTimeout(wait);
      const file = `${out}/s${nn}-step${s}-${w}x${h}${reduce ? "-reduce" : ""}${isStatic ? "-static" : ""}${webgl ? "" : "-nogl"}${deck ? "-deck" : ""}.png`;
      await page.screenshot({ path: file });
      const audit = await page.evaluate(auditInPage, SAFE);
      results.push({ step: s, file, audit });
    }
    report.push({ slide: n, viewport: `${w}x${h}`, steps, console: [...new Set(logs)].slice(0, 20), results });
  }
  await context.close();
}
await browser.close();

const summary = report.map((r) => ({
  slide: r.slide,
  viewport: r.viewport,
  steps: r.steps,
  consoleIssues: r.console.length,
  states: r.results.map((x) => ({
    step: x.step,
    file: x.file,
    outsideSafeArea: x.audit.outsideSafeArea?.length ?? x.audit.error,
    clipped: x.audit.clipped?.length ?? 0,
    overlaps: x.audit.overlaps?.length ?? 0,
    smallText: x.audit.smallText?.length ?? 0,
  })),
}));
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
if (!quiet) {
  for (const r of report) {
    if (r.console.length) console.log(`slide ${r.slide} @${r.viewport} console:\n  ${r.console.join("\n  ")}`);
    for (const x of r.results) {
      const a = x.audit;
      const lines = [];
      if (a.error) lines.push(`  error: ${a.error}`);
      for (const k of ["outsideSafeArea", "clipped", "overlaps", "smallText"]) {
        if (a[k]?.length) lines.push(`  ${k}: ${JSON.stringify(a[k].slice(0, 6))}`);
      }
      if (lines.length) console.log(`slide ${r.slide} step ${x.step} @${r.viewport}:\n${lines.join("\n")}`);
    }
  }
}
console.log(JSON.stringify(summary, null, 1));
console.log(`Full report: ${out}/report.json`);
