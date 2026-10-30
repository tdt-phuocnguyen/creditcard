"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { slides } from "@/slides/registry";
import { Backdrop } from "./Backdrop";
import { HelpHint } from "./HelpHint";
import { MobileReader } from "./MobileReader";
import { OverviewGrid } from "./OverviewGrid";
import { SlideFrame } from "./SlideFrame";
import { SlideHost } from "./SlideHost";
import { ControlBar, DECK_TITLE, FrameFooter } from "./SlideNavigation";
import { slideVariants, slideVariantsReduced } from "@/lib/animationPresets";
import { getRuntimeFlags } from "@/lib/flags";
import { pad2 } from "@/lib/format";
import { safeStorage, useMounted, usePrefersReducedMotion, useViewport } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────────── */
/* Navigation state                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

type Nav = { index: number; step: number; direction: 1 | -1 };
type NavAction = { type: "next" } | { type: "prev" } | { type: "goto"; index: number; step?: number | "last" };

const LAST = slides.length - 1;

function navReducer(state: Nav, action: NavAction): Nav {
  const steps = slides[state.index].steps;
  switch (action.type) {
    case "next":
      // Never skip a reveal: finish this slide's steps before advancing.
      if (state.step < steps - 1) return { ...state, step: state.step + 1, direction: 1 };
      if (state.index < LAST) return { index: state.index + 1, step: 0, direction: 1 };
      return state;
    case "prev":
      if (state.step > 0) return { ...state, step: state.step - 1, direction: -1 };
      // Going back into a slide shows it fully built (Keynote behaviour).
      if (state.index > 0) return { index: state.index - 1, step: slides[state.index - 1].steps - 1, direction: -1 };
      return state;
    case "goto": {
      const index = Math.max(0, Math.min(LAST, action.index));
      const max = slides[index].steps - 1;
      const step = action.step === "last" ? max : Math.max(0, Math.min(max, action.step ?? 0));
      if (index === state.index && step === state.step) return state;
      const direction = index > state.index || (index === state.index && step > state.step) ? 1 : -1;
      return { index, step, direction };
    }
  }
}

function parseHash(hash: string): { index: number; step: number } | null {
  const match = /^#\/?(\d{1,2})(?:\/(\d{1,2}))?$/.exec(hash);
  if (!match) return null;
  const index = Number(match[1]) - 1;
  if (index < 0 || index > LAST) return null;
  return { index, step: match[2] ? Number(match[2]) : 0 };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Fullscreen helpers (standard + WebKit)                                       */
/* ────────────────────────────────────────────────────────────────────────── */

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

const fullscreenElement = () => {
  const d = document as FsDocument;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
};

async function requestFullscreen(): Promise<boolean> {
  const d = document as FsDocument;
  const el = document.documentElement as FsElement;
  try {
    if (d.fullscreenEnabled && el.requestFullscreen) {
      await el.requestFullscreen({ navigationUI: "hide" });
      return true;
    }
    if (d.webkitFullscreenEnabled && el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen();
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function exitFullscreen() {
  const d = document as FsDocument;
  if (d.exitFullscreen) void d.exitFullscreen().catch(() => undefined);
  else void d.webkitExitFullscreen?.();
}

/* ────────────────────────────────────────────────────────────────────────── */

const HELP_KEY = "the-tin-dung:help-dismissed";
const INTERACTIVE = 'button, a[href], input, select, textarea, label, summary, [role="button"], [role="link"], [role="switch"], [role="tab"], [contenteditable="true"], [data-interactive]';
const IDLE_MS = 2600;

function isEditable(el: Element | null) {
  return Boolean(el?.closest('input, textarea, select, [contenteditable="true"]'));
}

function Splash() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-letterbox" aria-busy="true">
      <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-ink-faint">{DECK_TITLE}</p>
    </div>
  );
}

export function Presentation() {
  const mounted = useMounted();
  const viewport = useViewport();
  const reducedMotion = usePrefersReducedMotion();

  const [nav, dispatch] = useReducer(navReducer, { index: 0, step: 0, direction: 1 });
  const [hashReady, setHashReady] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [blackout, setBlackout] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [idle, setIdle] = useState(false);
  const [hoverZone, setHoverZone] = useState<"prev" | "next" | null>(null);
  const [viewPref, setViewPref] = useState<"deck" | "reader" | null>(null);

  const overviewButtonFocus = useRef<HTMLElement | null>(null);
  const lastKeyNav = useRef(0);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const suppressClick = useRef(false);

  const def = slides[nav.index];

  /* ── View mode: phones get the text reader by default ── */
  const isPhone = viewport ? Math.min(viewport.width, viewport.height) < 600 : false;
  const flagView = mounted ? getRuntimeFlags().view : null;
  const view = viewPref ?? flagView ?? (isPhone ? "reader" : "deck");

  /* ── Initial slide from the URL hash (#/6 or #/6/2), then keep it in sync ── */
  useEffect(() => {
    const initial = parseHash(window.location.hash);
    if (initial) dispatch({ type: "goto", index: initial.index, step: initial.step });
    setHashReady(true);
    const onHashChange = () => {
      const target = parseHash(window.location.hash);
      if (target) dispatch({ type: "goto", index: target.index, step: target.step });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (!hashReady) return;
    const hash = `#/${nav.index + 1}${nav.step ? `/${nav.step}` : ""}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
    document.title = `${pad2(def.number)} · ${def.title} — ${DECK_TITLE}`;
  }, [hashReady, nav.index, nav.step, def.number, def.title]);

  /* ── Help hint on first visit ── */
  useEffect(() => {
    if (!getRuntimeFlags().hideHelp && safeStorage.get(HELP_KEY) !== "1") setHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    safeStorage.set(HELP_KEY, "1");
  }, []);

  /* ── Warm up the current and next slide's lazy 3D chunks ── */
  useEffect(() => {
    void slides[nav.index]?.preload?.();
    void slides[nav.index + 1]?.preload?.();
  }, [nav.index]);

  /* ── Toast ── */
  const notify = useCallback((message: string) => setToast(message), []);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ── Fullscreen ── */
  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(fullscreenElement()));
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (fullscreenElement()) {
      exitFullscreen();
      return;
    }
    const ok = await requestFullscreen();
    if (!ok) notify("Trình duyệt không cho phép toàn màn hình ở đây. Hãy dùng F11 hoặc menu của trình duyệt.");
  }, [notify]);

  /* ── Navigation commands ── */
  const next = useCallback(() => dispatch({ type: "next" }), []);
  const prev = useCallback(() => dispatch({ type: "prev" }), []);
  const goto = useCallback((index: number, step: number | "last" = 0) => dispatch({ type: "goto", index, step }), []);

  const openOverview = useCallback(() => {
    overviewButtonFocus.current = document.activeElement as HTMLElement | null;
    setOverviewOpen(true);
  }, []);
  const closeOverview = useCallback(() => {
    setOverviewOpen(false);
    window.setTimeout(() => overviewButtonFocus.current?.focus?.({ preventScroll: true }), 0);
  }, []);
  const selectFromOverview = useCallback(
    (index: number) => {
      goto(index, 0);
      setOverviewOpen(false);
    },
    [goto],
  );

  /* ── Keyboard ── */
  const stateRef = useRef({ overviewOpen, helpOpen, blackout, view });
  stateRef.current = { overviewOpen, helpOpen, blackout, view };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { overviewOpen: overview, helpOpen: help, blackout: black, view: currentView } = stateRef.current;
      if (currentView !== "deck") return;
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as Element | null;
      if (isEditable(target)) return;

      if (black) {
        if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
        event.preventDefault();
        setBlackout(false);
        return;
      }

      const key = event.key;
      if (overview) {
        // The overview dialog handles arrows/Enter/Esc itself.
        if (key === "o" || key === "O" || key === "g" || key === "G") {
          event.preventDefault();
          closeOverview();
        } else if (key === "f" || key === "F") {
          event.preventDefault();
          void toggleFullscreen();
        }
        return;
      }

      const onInteractive = Boolean(target?.closest(INTERACTIVE));
      const navKey = (fn: () => void) => {
        event.preventDefault();
        const now = performance.now();
        if (event.repeat && now - lastKeyNav.current < 110) return;
        lastKeyNav.current = now;
        fn();
      };

      switch (key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          return navKey(next);
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          return navKey(prev);
        case " ":
        case "Spacebar":
          if (onInteractive) return; // let buttons (e.g. flip cards) handle Space
          return navKey(event.shiftKey ? prev : next);
        case "Enter":
          if (onInteractive) return;
          return navKey(next);
        case "Home":
          event.preventDefault();
          return goto(0);
        case "End":
          event.preventDefault();
          return goto(LAST);
        case "f":
        case "F":
          event.preventDefault();
          void toggleFullscreen();
          return;
        case "o":
        case "O":
        case "g":
        case "G":
          event.preventDefault();
          openOverview();
          return;
        case "?":
        case "h":
        case "H":
          event.preventDefault();
          if (help) closeHelp();
          else setHelpOpen(true);
          return;
        case "b":
        case "B":
        case ".":
          event.preventDefault();
          setBlackout(true);
          return;
        case "Escape":
          if (help) {
            event.preventDefault();
            closeHelp();
          } else if (fullscreenElement()) {
            exitFullscreen();
          }
          return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, goto, toggleFullscreen, openOverview, closeOverview, closeHelp]);

  /* ── Idle: hide cursor and controls while presenting (not on touch) ── */
  useEffect(() => {
    if (view !== "deck" || viewport?.coarse) {
      setIdle(false);
      return;
    }
    let timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    };
    window.addEventListener("pointermove", wake);
    window.addEventListener("pointerdown", wake);
    window.addEventListener("keydown", wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
    };
  }, [view, viewport?.coarse]);

  /* ── Rotate hint for portrait touch screens ── */
  const portraitTouch = Boolean(viewport?.coarse && viewport.height > viewport.width);
  useEffect(() => {
    if (view === "deck" && portraitTouch) notify("Xoay ngang thiết bị để xem slide lớn hơn.");
  }, [view, portraitTouch, notify]);

  /* ── Pointer: click zones (left = back, right = forward) and swipe ── */
  const zoneOf = (event: ReactPointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return (event.clientX - rect.left) / rect.width < 0.4 ? "prev" : "next";
  };

  const onStagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  const onStagePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      suppressClick.current = true;
      if (dx < 0) next();
      else prev();
    }
  };
  const onStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const target = event.target as Element;
    const zone = target.closest(INTERACTIVE) ? null : zoneOf(event);
    setHoverZone((current) => (current === zone ? current : zone));
  };
  const onStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (event.button !== 0) return;
    const target = event.target as Element;
    if (target.closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    if (zoneOf(event) === "prev") prev();
    else next();
  };

  /* ── Render ── */
  if (!mounted || !viewport || !hashReady) return <Splash />;

  if (view === "reader") {
    return <MobileReader onOpenDeck={() => setViewPref("deck")} />;
  }

  const atStart = nav.index === 0 && nav.step === 0;
  const atEnd = nav.index === LAST && nav.step === def.steps - 1;
  const smallCanvas = Math.min(viewport.width / 1920, viewport.height / 1080) < 0.5;

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <div className="fixed inset-0 select-none bg-letterbox" data-idle={idle && !overviewOpen ? "true" : "false"} data-view="deck">
        <main className="absolute inset-0">
          <SlideFrame label={`Slide ${def.number} trên ${slides.length}: ${def.title}`}>
            <Backdrop chapter={def.chapter} />
            <div
              className="absolute inset-0"
              onClick={onStageClick}
              onPointerDown={onStagePointerDown}
              onPointerUp={onStagePointerUp}
              onPointerMove={onStagePointerMove}
              onPointerLeave={() => setHoverZone(null)}
              data-stage
            >
              <AnimatePresence initial={false} custom={nav.direction}>
                <motion.div
                  key={def.id}
                  custom={nav.direction}
                  variants={reducedMotion ? slideVariantsReduced : slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <SlideHost def={def} step={nav.step} direction={nav.direction} reducedMotion={reducedMotion} />
                </motion.div>
              </AnimatePresence>

              {/* Edge affordances for click navigation */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-ink-faint transition-opacity duration-300",
                  hoverZone === "prev" && !idle && !atStart ? "opacity-60" : "opacity-0",
                )}
              >
                <ChevronLeft className="size-12" strokeWidth={1.25} />
              </div>
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-ink-faint transition-opacity duration-300",
                  hoverZone === "next" && !idle && !atEnd ? "opacity-60" : "opacity-0",
                )}
              >
                <ChevronRight className="size-12" strokeWidth={1.25} />
              </div>
            </div>
            <FrameFooter index={nav.index} total={slides.length} step={nav.step} steps={def.steps} />
          </SlideFrame>
        </main>

        <ControlBar
          hidden={idle && !helpOpen}
          canPrev={!atStart}
          canNext={!atEnd}
          onPrev={prev}
          onNext={next}
          onOverview={openOverview}
          overviewOpen={overviewOpen}
          onFullscreen={() => void toggleFullscreen()}
          isFullscreen={isFullscreen}
          onHelp={() => (helpOpen ? closeHelp() : setHelpOpen(true))}
          helpOpen={helpOpen}
          onReader={isPhone || smallCanvas ? () => setViewPref("reader") : undefined}
        />

        <AnimatePresence>{helpOpen && !overviewOpen ? <HelpHint key="help" onClose={closeHelp} /> : null}</AnimatePresence>

        <AnimatePresence>
          {overviewOpen ? (
            <OverviewGrid key="overview" slides={slides} currentIndex={nav.index} onSelect={selectFromOverview} onClose={closeOverview} />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {blackout ? (
            <motion.button
              key="blackout"
              type="button"
              aria-label="Tiếp tục trình chiếu"
              className="fixed inset-0 z-50 cursor-pointer bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setBlackout(false)}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {toast ? (
            <motion.div
              key={toast}
              role="status"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-4 z-50 w-max max-w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-line bg-surface-raised/95 px-4 py-2.5 text-center text-[13px] text-ink shadow-xl backdrop-blur-md"
            >
              {toast}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div aria-live="polite" className="sr-only">
          {`Slide ${def.number} trên ${slides.length}: ${def.title}`}
        </div>
      </div>
    </MotionConfig>
  );
}
