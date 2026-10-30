/**
 * Runtime overrides read from the URL query string (client only). Useful for
 * QA and rehearsal:
 *   ?motion=reduce   force reduced motion
 *   ?webgl=0         force the 2D fallbacks instead of WebGL scenes
 *   ?help=0          never show the controls hint
 *   ?view=reader     open the text reader; ?view=deck forces slides
 */
export type RuntimeFlags = {
  reduceMotion: boolean;
  disableWebGL: boolean;
  hideHelp: boolean;
  view: "deck" | "reader" | null;
};

let cached: RuntimeFlags | null = null;

export function getRuntimeFlags(): RuntimeFlags {
  if (cached) return cached;
  if (typeof window === "undefined") {
    return { reduceMotion: false, disableWebGL: false, hideHelp: false, view: null };
  }
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  cached = {
    reduceMotion: params.get("motion") === "reduce",
    disableWebGL: params.get("webgl") === "0",
    hideHelp: params.get("help") === "0",
    view: view === "deck" || view === "reader" ? view : null,
  };
  return cached;
}
