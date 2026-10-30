# Thẻ tín dụng: Hiểu luật chơi

A cinematic, slide-based web presentation in Vietnamese: 19 slides for a 30-minute talk on how credit
cards work, their costs and risks, cashback and MCC, card-combo optimisation, and safe usage.

It's built with Next.js (App Router, static export), React, TypeScript, Tailwind CSS, Motion
(Framer Motion), GSAP, three.js with React Three Fiber and Drei, and Lucide icons.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production / offline (for the venue — no server or internet needed):

```bash
npm run build        # static export → out/
npm start            # serves out/ at http://localhost:4173
```

`out/` can be hosted on any static host or copied to a USB stick and served locally.

## Presenting

| Key | Action |
|---|---|
| `→` · `Space` · `PageDown` | next reveal step, then next slide |
| `←` · `PageUp` | previous step / previous slide (lands on its final state) |
| `Home` / `End` | first / last slide |
| `O` | overview grid of all 19 slides (arrows + `Enter` to jump) |
| `F` | fullscreen (with a fallback message where the browser refuses) |
| `B` | black screen; any key resumes |
| `?` | shortcuts hint |
| `Esc` | close overview / hint, exit fullscreen |

Click the right side of the slide to advance, the left side to go back (interactive elements such as the
fee flip cards are never hijacked). On touch screens, tap or swipe. The URL hash tracks position
(`#/6` or `#/6/2` for slide 6, reveal step 2), so a reload resumes where you were.

Phones open a text reader with the full content of every slide; tablets and desktops get the slides.
`prefers-reduced-motion` is honoured (crossfades, no idle motion). Without WebGL, every 3D scene
falls back to a designed 2D rendition.

Query flags for rehearsal and QA: `?motion=reduce`, `?webgl=0`, `?help=0`, `?view=reader|deck`.

## Content

All copy and numbers live in [`lib/slideContent.ts`](lib/slideContent.ts), transcribed from the brief in
[`docs/master-prompt.md`](docs/master-prompt.md). Every example is illustrative and labelled as such;
caveats are part of the slides, not footnotes. No bank-specific, regulatory or numerical claims beyond the
brief are made.

## Project structure

```
app/                     layout, page, dev-only per-slide previews (app/preview/NN, `next dev` only)
components/              presentation shell, slide frame, navigation, overview, mobile reader
components/primitives/   reveal / stagger / headline / count-up / draw-path / layout / callouts
components/Scene3D/      lazy WebGL scenes, SceneHost (fallback + active-only), SceneCanvas, lighting
lib/                     slide content, reader content, formatting, motion presets, GSAP setup, hooks
slides/                  one folder per slide + registry (exactly 19, in order)
scripts/                 shot.mjs (per-slide screenshots + layout audit), qa.mjs (whole-deck QA), serve.mjs
docs/                    the brief and the slide authoring guide
```

Authoring a slide: see [`docs/SLIDE_AUTHORING.md`](docs/SLIDE_AUTHORING.md).

## Quality checks

```bash
npm run typecheck
npm run lint
node scripts/qa.mjs            # with the dev server (or `npm start` + --base=http://localhost:4173)
node scripts/shot.mjs 6 --size=1920x1080,1280x720
```
