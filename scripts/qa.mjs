#!/usr/bin/env node
/**
 * Whole-deck QA runner (run against `npm run dev` or the static export via `npm start`).
 *
 *   node scripts/qa.mjs [--base=http://localhost:3000] [--out=.shots/qa] [--shots] [--quick]
 *
 * Checks
 *   1. Forward traversal (→) visits every slide 1–19 and every reveal step in order, nothing skipped.
 *   2. Backward traversal (←) visits the same states in reverse; entering a slide backwards lands on its last step.
 *   3. Console errors/warnings, page errors and hydration warnings (headless GPU chatter is ignored).
 *   4. Layout audit for every state: text outside the safe area, clipped containers, overlapping text, text < 16 px.
 *   5. Overview mode: 19 thumbnails with number + title; selecting one navigates; Esc closes.
 *   6. Keyboard: Home/End, Space, F (fullscreen or graceful fallback), B (blackout), ? (help).
 *   7. Interactive slide 9: flip cards toggle with Enter/Space/click and do not advance the slide.
 *   8. Reduced motion and no-WebGL passes (errors only), 3D fallbacks visible without WebGL.
 *   9. Viewports: phone → text reader with 19 slides; tablet/desktop → deck; no page scroll in the deck.
 *
 * Prints a summary and writes the full JSON report to <out>/qa-report.json. Exit code 1 if any check fails.
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
const base = String(opt("base", "http://localhost:3000")).replace(/\/$/, "");
const out = resolve(String(opt("out", ".shots/qa")));
const takeShots = Boolean(opt("shots", false));
const quick = Boolean(opt("quick", false));
mkdirSync(out, { recursive: true });

const SAFE = { top: 88, right: 120, bottom: 128, left: 120 };
// Headless GPU chatter, plus Motion's dev-only notice that the (emulated) device prefers reduced motion.
const NOISE = /GL Driver Message|GPU stall due to ReadPixels|\[\.WebGL-|You have Reduced Motion enabled on your device/;
const failures = [];
const report = {};
const fail = (check, detail) => failures.push({ check, detail });

/** Same audit as scripts/shot.mjs (kept in sync by hand). */
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
  const visible = (el) => (el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true);
  const issues = { outsideSafeArea: [], clipped: [], overlaps: [], smallText: [] };
  const textBoxes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || !visible(el)) continue;
    if (el.closest(".sr-only, [data-allow-bleed], [data-scene-fallback]")) continue;
    let op = 1;
    for (let a = el; a && a !== root.parentElement; a = a.parentElement) op *= Number(getComputedStyle(a).opacity);
    if (op < 0.3) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    if (!rects.length) continue;
    const fontSize = parseFloat(getComputedStyle(el).fontSize);
    if (fontSize < 16) issues.smallText.push({ text: text.slice(0, 60), fontSize });
    for (const r of rects) {
      const b = toCanvas(r);
      textBoxes.push({ text: text.slice(0, 50), b, el });
      if (b.x < safe.left - 2 || b.y < safe.top - 2 || b.x + b.w > safe.right + 2 || b.y + b.h > safe.bottom + 2)
        issues.outsideSafeArea.push({ text: text.slice(0, 60), box: b });
    }
  }
  for (let i = 0; i < textBoxes.length; i++) {
    for (let j = i + 1; j < textBoxes.length; j++) {
      const A = textBoxes[i], B = textBoxes[j];
      if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const ox = Math.min(A.b.x + A.b.w, B.b.x + B.b.w) - Math.max(A.b.x, B.b.x);
      const oy = Math.min(A.b.y + A.b.h, B.b.y + B.b.h) - Math.max(A.b.y, B.b.y);
      if (ox > 3 && oy > 3) issues.overlaps.push({ a: A.text, b: B.text, overlap: [ox, oy] });
    }
  }
  for (const el of root.querySelectorAll("*")) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    if (!/(hidden|clip)/.test(s.overflowX + s.overflowY)) continue;
    if (el.closest("[data-allow-bleed], [data-scene-host], .sr-only") || el.hasAttribute("data-allow-clip")) continue;
    if (el.clientWidth <= 1 && el.clientHeight <= 1) continue;
    if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
      const txt = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (txt) issues.clipped.push({ text: txt.slice(0, 60), scroll: [el.scrollWidth, el.scrollHeight], box: [el.clientWidth, el.clientHeight] });
    }
  }
  for (const k of Object.keys(issues)) issues[k] = issues[k].slice(0, 12);
  return issues;
}

async function newPage(browser, contextOptions = {}) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, ...contextOptions });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("the-tin-dung:help-dismissed", "1");
    } catch {}
  });
  const page = await context.newPage();
  const logs = [];
  page.on("console", (m) => {
    const text = m.text();
    if (NOISE.test(text)) return;
    if (m.type() === "error" || m.type() === "warning" || /hydrat/i.test(text)) logs.push(`[${m.type()}] ${text.slice(0, 300)}`);
  });
  page.on("pageerror", (e) => logs.push(`[pageerror] ${String(e).slice(0, 300)}`));
  return { context, page, logs };
}

const state = (page) =>
  page.evaluate(() => {
    const r = document.querySelector("[data-slide-root][data-active='true']");
    return r ? { slide: Number(r.dataset.slide), step: Number(r.dataset.step), steps: Number(r.dataset.steps) } : null;
  });

const browser = await chromium.launch();

/* 1–4. Forward + backward traversal with audits ─────────────────────────── */
{
  const { context, page, logs } = await newPage(browser);
  await page.goto(`${base}/?help=0#/1`, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-slide-root][data-active='true']");
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1600);

  const forward = [];
  const audits = [];
  let current = await state(page);
  forward.push(current);
  for (let guard = 0; guard < 200; guard++) {
    if (!quick) {
      const audit = await page.evaluate(auditInPage, SAFE);
      const counts = Object.fromEntries(Object.entries(audit).map(([k, v]) => [k, Array.isArray(v) ? v.length : v]));
      if (Object.values(counts).some((n) => n)) audits.push({ ...current, ...counts, details: audit });
      if (takeShots) await page.screenshot({ path: `${out}/deck-s${String(current.slide).padStart(2, "0")}-step${current.step}.png` });
    }
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(quick ? 450 : 1500);
    const next = await state(page);
    if (next.slide === current.slide && next.step === current.step) break; // end of deck
    const ok =
      (next.slide === current.slide && next.step === current.step + 1) ||
      (next.slide === current.slide + 1 && next.step === 0 && current.step === current.steps - 1);
    if (!ok) fail("forward-order", { from: current, to: next });
    forward.push(next);
    current = next;
  }
  const slidesSeen = [...new Set(forward.map((s) => s.slide))];
  if (slidesSeen.length !== 19 || slidesSeen.some((n, i) => n !== i + 1)) fail("slide-count/order", slidesSeen);

  // backward
  const backward = [current];
  for (let guard = 0; guard < 200; guard++) {
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(quick ? 350 : 700);
    const prev = await state(page);
    if (prev.slide === current.slide && prev.step === current.step) break;
    const ok =
      (prev.slide === current.slide && prev.step === current.step - 1) ||
      (prev.slide === current.slide - 1 && prev.step === prev.steps - 1 && current.step === 0);
    if (!ok) fail("backward-order", { from: current, to: prev });
    backward.push(prev);
    current = prev;
  }
  if (backward.length !== forward.length) fail("backward-length", { forward: forward.length, backward: backward.length });

  report.traversal = {
    states: forward.length,
    stepsPerSlide: Object.fromEntries(slidesSeen.map((n) => [n, forward.find((s) => s.slide === n)?.steps])),
    auditIssues: audits,
  };
  if (audits.length) fail("layout-audit", `${audits.length} states with layout findings (see report.traversal.auditIssues)`);

  /* 5. Overview */
  await page.keyboard.press("o");
  await page.waitForTimeout(900);
  const thumbs = await page.$$eval("[data-thumb]", (els) => els.map((e) => ({ n: Number(e.getAttribute("data-thumb")), label: e.getAttribute("aria-label") })));
  if (thumbs.length !== 19) fail("overview-count", thumbs.length);
  if (thumbs.some((t) => !t.label || !/Slide \d+: .+/.test(t.label))) fail("overview-labels", thumbs);
  await page.click("[data-thumb='10']");
  await page.waitForTimeout(900);
  const afterSelect = await state(page);
  if (afterSelect?.slide !== 10 || afterSelect?.step !== 0) fail("overview-select", afterSelect);
  if (await page.isVisible("[data-overview]")) fail("overview-close-on-select", "still open");
  await page.keyboard.press("o");
  await page.waitForTimeout(600);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  if (await page.isVisible("[data-overview]")) fail("overview-esc", "Esc did not close");
  report.overview = { thumbs: thumbs.length };

  /* 6. Keyboard extras */
  await page.keyboard.press("End");
  await page.waitForTimeout(700);
  if ((await state(page))?.slide !== 19) fail("key-end", await state(page));
  await page.keyboard.press("Home");
  await page.waitForTimeout(700);
  if ((await state(page))?.slide !== 1) fail("key-home", await state(page));
  await page.keyboard.press(" ");
  await page.waitForTimeout(700);
  const afterSpace = await state(page);
  if (!(afterSpace.slide === 2 || (afterSpace.slide === 1 && afterSpace.step === 1))) fail("key-space", afterSpace);
  await page.keyboard.press("b");
  await page.waitForTimeout(400);
  const blackout = await page.locator("button[aria-label='Tiếp tục trình chiếu']").count();
  await page.keyboard.press("x");
  await page.waitForTimeout(500);
  const blackoutAfter = await page.locator("button[aria-label='Tiếp tục trình chiếu']").count();
  if (blackout !== 1 || blackoutAfter !== 0) fail("key-blackout", { blackout, blackoutAfter });
  await page.keyboard.press("?");
  await page.waitForTimeout(400);
  if (!(await page.isVisible("[data-help]"))) fail("key-help", "help did not open");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  await page.keyboard.press("f");
  await page.waitForTimeout(600);
  const fs = await page.evaluate(() => Boolean(document.fullscreenElement));
  const toast = await page.locator("[role=status]").count();
  if (!fs && !toast) fail("key-fullscreen", "neither fullscreen nor fallback message");
  if (fs) await page.evaluate(() => document.exitFullscreen());
  const scroll = await page.evaluate(() => ({ doc: document.documentElement.scrollHeight, win: innerHeight }));
  if (scroll.doc > scroll.win + 1) fail("page-scroll", scroll);

  /* 7. Flip cards on slide 9 */
  await page.goto(`${base}/?help=0#/9`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const flip = await page.$$("[data-slide-root][data-active='true'] button[aria-pressed]");
  if (flip.length >= 1) {
    const before = await state(page);
    await flip[0].focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(700);
    const pressedEnter = await flip[0].getAttribute("aria-pressed");
    await page.keyboard.press(" ");
    await page.waitForTimeout(700);
    const pressedSpace = await flip[0].getAttribute("aria-pressed");
    await flip[0].click();
    await page.waitForTimeout(700);
    const pressedClick = await flip[0].getAttribute("aria-pressed");
    const after = await state(page);
    report.flipCards = { count: flip.length, pressedEnter, pressedSpace, pressedClick };
    if (pressedEnter !== "true" || pressedSpace !== "false" || pressedClick !== "true") fail("flip-toggle", report.flipCards);
    if (after.slide !== before.slide || after.step !== before.step) fail("flip-advanced-slide", { before, after });
  } else {
    report.flipCards = { count: 0 };
    fail("flip-cards-missing", "no button[aria-pressed] on slide 9 step 0");
  }

  report.console = { main: [...new Set(logs)] };
  if (logs.length) fail("console-main", [...new Set(logs)].slice(0, 10));
  await context.close();
}

/* 8. Reduced motion + no-WebGL passes ───────────────────────────────────── */
for (const variant of [
  { name: "reduced-motion", query: "?help=0&motion=reduce", options: { reducedMotion: "reduce" } },
  { name: "no-webgl", query: "?help=0&webgl=0", options: {} },
]) {
  const { context, page, logs } = await newPage(browser, variant.options);
  await page.goto(`${base}/${variant.query}#/1`, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-slide-root][data-active='true']");
  const fallbackHidden = [];
  let current = await state(page);
  for (let guard = 0; guard < 200; guard++) {
    if (variant.name === "no-webgl") {
      const hosts = await page.$$eval("[data-slide-root][data-active='true'] [data-scene-host]", (els) =>
        els.map((h) => ({
          canvas: Boolean(h.querySelector("canvas")),
          fallbackOpacity: Number(getComputedStyle(h.querySelector("[data-scene-fallback]")).opacity),
        })),
      );
      for (const h of hosts) if (h.canvas || h.fallbackOpacity < 0.99) fallbackHidden.push({ ...current, ...h });
    }
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(450);
    const next = await state(page);
    if (next.slide === current.slide && next.step === current.step) break;
    current = next;
  }
  report[variant.name] = { console: [...new Set(logs)], fallbackProblems: fallbackHidden };
  if (logs.length) fail(`console-${variant.name}`, [...new Set(logs)].slice(0, 10));
  if (fallbackHidden.length) fail("no-webgl-fallback", fallbackHidden.slice(0, 6));
  await context.close();
}

/* 9. Viewports ───────────────────────────────────────────────────────────── */
{
  const phone = await newPage(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await phone.page.goto(`${base}/`, { waitUntil: "networkidle" });
  await phone.page.waitForTimeout(800);
  const view = await phone.page.evaluate(() => document.querySelector("[data-view]")?.getAttribute("data-view"));
  const articles = await phone.page.$$eval("[data-view='reader'] article", (els) => els.length);
  if (view !== "reader" || articles !== 19) fail("phone-reader", { view, articles });
  if (takeShots) await phone.page.screenshot({ path: `${out}/phone.png`, fullPage: false });
  report.phone = { view, articles, console: [...new Set(phone.logs)] };
  if (phone.logs.length) fail("console-phone", phone.logs.slice(0, 6));
  await phone.context.close();

  for (const size of [
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
  ]) {
    const t = await newPage(browser, { viewport: size, hasTouch: size.width === 1024 });
    await t.page.goto(`${base}/?help=0#/6`, { waitUntil: "networkidle" });
    await t.page.waitForTimeout(1200);
    const v = await t.page.evaluate(() => document.querySelector("[data-view]")?.getAttribute("data-view"));
    const canvas = await t.page.$eval("[data-canvas]", (el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    if (v !== "deck") fail(`viewport-${size.width}`, v);
    if (Math.abs(canvas.w / canvas.h - 16 / 9) > 0.01) fail(`aspect-${size.width}`, canvas);
    if (takeShots) await t.page.screenshot({ path: `${out}/viewport-${size.width}x${size.height}.png` });
    report[`viewport-${size.width}x${size.height}`] = { view: v, canvas };
    await t.context.close();
  }
}

await browser.close();
report.failures = failures;
writeFileSync(`${out}/qa-report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ states: report.traversal?.states, stepsPerSlide: report.traversal?.stepsPerSlide, failures }, null, 1));
console.log(`Full report: ${out}/qa-report.json`);
process.exit(failures.length ? 1 : 0);
