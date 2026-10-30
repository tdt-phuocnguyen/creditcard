/**
 * Slides are authored on a fixed 1920×1080 canvas that is scaled to fit the
 * viewport (letterboxed, 16:9 preserved). All slide measurements are canvas px.
 */
export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

/**
 * Safe area. Content must stay inside it; the bottom band is reserved for the
 * footer (progress bar, slide index) and the floating controls.
 */
export const SAFE_AREA = { top: 88, right: 120, bottom: 128, left: 120 } as const;

export const SAFE_WIDTH = CANVAS_WIDTH - SAFE_AREA.left - SAFE_AREA.right; // 1680
export const SAFE_HEIGHT = CANVAS_HEIGHT - SAFE_AREA.top - SAFE_AREA.bottom; // 864
