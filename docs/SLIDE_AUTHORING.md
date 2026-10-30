# Slide authoring guide

How slides are built in this deck. Read this before touching `slides/`.
The authoritative brief is [`master-prompt.md`](./master-prompt.md) (§3 art direction,
§5 interaction, §6 motion, §7 3D, §8 slide content, §9 accuracy).

## 1. Architecture

```
app/page.tsx                    → <Presentation/> (client-only after mount)
components/Presentation.tsx     navigation state machine, keyboard/click/swipe, fullscreen, overview, blackout
components/SlideFrame.tsx       fixed 1920×1080 canvas scaled to fit (16:9 preserved)
components/SlideHost.tsx        provides SlideContext to one slide (+ error boundary)
components/SlideNavigation.tsx  in-canvas footer (index, step dots, progress) + floating control bar
components/OverviewGrid.tsx     thumbnail grid (static renders of every slide)
components/MobileReader.tsx     phone fallback: full text of every slide (from lib/readerContent.ts)
components/primitives/          Reveal, Stagger, Headline, CountUp, DrawPath, SlideLayout, KeyMessage, …
components/Scene3D/             SceneHost (lazy + fallback), SceneCanvas (R3F defaults), StudioEnvironment, scenes
lib/slideContent.ts             AUTHORITATIVE copy and numbers for all 19 slides
lib/format.ts                   formatVND / formatPercent / formatNumber (Vietnamese formatting)
lib/animationPresets.ts         easing, durations, stagger
lib/gsap.ts                     GSAP + plugins registered once; useStepTimeline()
slides/sNN-*/index.tsx          defineSlide({ id, steps, Component, has3D?, preload? })
slides/registry.ts              the 19 slides in order
app/preview/NN/page.dev.tsx     dev-only isolated preview of slide NN (routable in `next dev` only)
scripts/shot.mjs                screenshots + layout audit per reveal step
```

Reference implementations: **`slides/s03-debit-credit`** (2D split-screen with a reveal step,
count-up, meters, illustrative labels) and **`slides/s01-opening`** + `components/Scene3D/OpeningCardScene.tsx`
(3D hero via SceneHost, CSS fallback, entry choreography).

## 2. The slide contract

```tsx
// slides/s06-billing-cycle/index.tsx
export default defineSlide({ id: "billing-cycle", steps: 4, Component: BillingCycleSlide, has3D: true, preload });
```

- A slide component takes **no props**; it reads `useSlide()` → `{ step, steps, isActive, isStatic, reducedMotion, direction, number }`.
- `steps` = number of reveal states. Step 0 is what the audience sees right after the slide enters.
  → / Space advance one step; after the last step they go to the next slide. ← goes back a step;
  entering a slide backwards lands on its **last** step. Overview/Home/End/hash jumps land on step 0.
- Every element must be correct in **three render modes**:
  1. live (animate in when its step is reached, animate out when the presenter steps back),
  2. `isStatic` (overview thumbnails: final step, no animation, no WebGL — show the 2D fallback),
  3. `reducedMotion` (opacity-only or instant changes; no movement, no idle loops).
  The primitives below handle all three for you. Hand-rolled animation must handle them too.
- Hidden-until-revealed content keeps its layout box (no layout shift). The primitives make hidden
  content `aria-hidden` and `inert`.

## 3. Canvas, layout, typography

- Author in **canvas px on a 1920×1080 canvas**. Never use `vw/vh`.
- **Safe area**: top 88, right 120, bottom 128, left 120 (content box 1680×864). `<SlideLayout>` applies it.
  The bottom band holds the footer (index/progress) and the floating controls — keep content out of it.
  Full-bleed decoration goes in `<SlideLayout bleed={…}>` (aria-hidden, pointer-events none).
- Type scale utilities (globals.css): `t-display` 156, `t-h1` 66 (slide headlines), `t-h2` 44, `t-h3` 32,
  `t-lead` 30, `t-body` 24, `t-small` 20, `t-eyebrow` 17 caps. `t-num` = tabular numerals — use it for
  every money/date/percent/metric.
- **Minimum sizes**: body ≥ 24, caveats/fine print ≥ 20, small labels ≥ 16 (absolute floor). Never shrink
  everything to fit: re-layout, use reveal steps, or move secondary text into smaller grouped blocks.
- **Vietnamese diacritics**: keep multi-line line-height ≥ 1.1; never put `overflow:hidden`/masks tight
  around text (cuts marks above caps like Ể, Ỗ); `background-clip:text` needs `py-[0.14em]` padding.
- One dominant message per slide; diagrams over paragraphs; vary composition (hero, split, timeline,
  flow, chart, comparison, interactive cards). Don't build yet another uniform card grid.

## 4. Color (semantic — don't decorate with accents)

| token | use |
|---|---|
| `canvas` `#070B14`, `surface` `#0D1424`, `surface-raised` | backgrounds / panels (`surface-panel` utility) |
| `ink` `#F4F7FB`, `ink-muted` `#A6B2C5`, `ink-faint` `#7C889C` | primary / secondary / tertiary text |
| `blue` `#4EA1FF`, `cyan` `#55D6E8` | primary accents, data emphasis |
| `violet` `#8B7CFF` | restrained secondary accent |
| `positive` `#3DD6A5` | **only** positive financial outcomes |
| `risk` `#FF6B6B`, `caution` `#FFB45E` | **only** risk / warnings |
| `line`, `line-strong` | hairlines and borders |

## 5. Primitives (`@/components/primitives`)

| primitive | what it does |
|---|---|
| `<SlideLayout bleed>` | safe-area container + optional full-bleed layer |
| `<SlideHeader title lead eyebrow>` | chapter eyebrow + `t-h1` headline (+ lead) with entry choreography |
| `<Headline at delay level>` | headline reveal (opacity + rise, no masks) |
| `<AnimatedLines lines at>` | supporting lines, 80 ms stagger |
| `<Reveal at until delay y x scale as>` | show content from step `at` (optionally hide again at `until`) |
| `<Stagger at gap as>` + `<StaggerItem>` | staggered group (60–100 ms) |
| `<CountUp value from at format>` | count-up for **key** numbers only; width reserved, SR gets final value |
| `<DrawPath d at>` | SVG connector drawing progressively |
| `<KeyMessage at tone>` | the key message treatment (accent bar). `tone`: default / positive / risk / violet |
| `<IllustrativeBadge/>` | "Ví dụ minh họa" — required next to every illustrative example/number |
| `<NoteList items title>` | caveats ("Lưu ý"), ≥ 20 px, never omitted |
| `<Chip>`, `<Surface>` | small label; elevated panel |

GSAP: `import { gsap, useGSAP, useStepTimeline, stepLabel } from "@/lib/gsap"`.
`useStepTimeline(scopeRef, tl => { …; tl.addLabel(stepLabel(n)) })` tweens the playhead to the
current step's label (backwards when stepping back; jumps in static/reduced mode; killed on unmount).
Always scope GSAP selectors to a ref and let `useGSAP` clean up.

## 6. Motion rules (§6)

- Slide transitions are handled by the shell. Inside slides: headlines 500–700 ms, supporting lines
  staggered 60–100 ms, opacity + subtle translation + controlled scale.
- **All essential content visible < 1.5 s after the slide/step starts.** Keep delays short.
- No bounce/elastic/spin, no per-word animation, no continuous chart animation, no infinite loops
  except restrained idle motion inside an active 3D scene.
- Charts: bars grow from zero, donuts draw clockwise, connectors draw progressively, nodes in causal order.
- Count-up only for key data points where it isn't misleading.
- Interactive elements: real `<button>`s with visible focus, hover + pressed states, keyboard + touch.
  The shell ignores Space/Enter on buttons and ignores click-navigation on `button, a, [role=button],
  [data-interactive]`, so interactive cards don't advance the slide.

## 7. 3D scenes (§7)

```tsx
const MyScene = dynamic(() => import("@/components/Scene3D/MyScene"), { ssr: false, loading: () => null });
<SceneHost scene={MyScene} fallback={<My2DFallback/>} label="mô tả hình ảnh" className="absolute …" />
// index.tsx: has3D: true, preload: () => import("@/components/Scene3D/MyScene")
```

- Scene default export receives `SceneProps` `{ step, reducedMotion, onReady, onLost }` and renders
  `<SceneCanvas reducedMotion onReady onLost …>` (transparent, offsetSize resize, DPR matched to frame scale).
- SceneHost mounts the scene only while the slide is active (never in thumbnails or while exiting), shows
  the 2D fallback underneath (thumbnails, no WebGL, loading, context loss). Make the fallback good.
- Lighting: `<StudioEnvironment/>` (Lightformers; **no HDR/texture downloads**). Procedural geometry and
  CanvasTextures only; keep polycounts modest; dispose geometries/textures you create.
- Idle motion: slow, low amplitude. Under `reducedMotion` render a static pose (frameloop is "demand").
  If a scene only moves on step changes, use `frameloop="demand"` and `invalidate()` while animating.
- Keep essential text (labels, dates, %) in normal DOM layered over the canvas, not as 3D text.

## 8. Content & accuracy (§9) — non-negotiable

- Import copy and numbers from `lib/slideContent.ts`. Don't retype them. You may shorten *visible* copy
  for layout but never drop a caveat or qualification, and never change a number.
- Label every example as illustrative (`<IllustrativeBadge/>`).
- Don't invent bank names, products, fees, rates, MCC codes, CIC thresholds/groups, approval scores.
- Money: `formatVND(12000000)` → `12.000.000 VND`; percent: `formatPercent(0.04)` → `4%`.
- Slides 15–18 copy in the spec is partly English; `slideContent.ts` holds the Vietnamese wording.

## 9. Verify every slide you touch

```bash
npx tsc --noEmit 2>&1 | grep -E "slides/sNN|Scene3D/MyScene"   # your files only
node scripts/shot.mjs NN --size=1920x1080,1280x720              # PNG per step + audit
node scripts/shot.mjs NN --static                                # overview thumbnail state
node scripts/shot.mjs NN --reduce                                # reduced motion
node scripts/shot.mjs NN --webgl=0                               # 3D fallback (3D slides)
```

Open the PNGs and look at them. The audit reports console errors, text outside the safe area,
clipped containers, overlapping text and text < 16 px — get them all to zero (or explain why one
is intentional). Then check the slide in the real deck: `http://localhost:3000/#/NN`.
