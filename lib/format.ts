/**
 * Vietnamese number formatting used across every slide.
 * Thousands use "." and decimals use "," — e.g. `12.000.000 VND`, `33,3%`.
 *
 * Implemented by hand (not Intl) so server render and browser always agree,
 * whatever ICU data the runtime ships with — no hydration mismatches.
 */

function groupThousands(integer: string): string {
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 12000000 → "12.000.000"; 295890.41 with digits=0 → "295.890" */
export function formatNumber(value: number, digits = 0): string {
  const negative = value < 0;
  const fixed = Math.abs(value).toFixed(digits);
  const [integer, fraction] = fixed.split(".");
  const body = fraction ? `${groupThousands(integer)},${fraction}` : groupThousands(integer);
  return negative ? `−${body}` : body;
}

/** 12000000 → "12.000.000 VND"; with `sign` → "+12.000.000 VND" / "−140.000 VND" */
export function formatVND(value: number, options: { sign?: boolean; unit?: boolean } = {}): string {
  const { sign = false, unit = true } = options;
  const abs = formatNumber(Math.abs(value));
  const prefix = value < 0 ? "−" : sign && value > 0 ? "+" : "";
  return `${prefix}${abs}${unit ? " VND" : ""}`;
}

/** 0.3 → "30%"; 1/3 with digits=1 → "33,3%" */
export function formatPercent(ratio: number, digits = 0): string {
  return `${formatNumber(ratio * 100, digits)}%`;
}

/** Two-digit slide index: 6 → "06" */
export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
