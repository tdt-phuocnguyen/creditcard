import type { SlideDefinition } from "./types";
import s01 from "./s01-opening";
import s02 from "./s02-roadmap";
import s03 from "./s03-debit-credit";
import s04 from "./s04-transaction-parties";
import s05 from "./s05-card-networks";
import s06 from "./s06-billing-cycle";
import s07 from "./s07-benefits";
import s08 from "./s08-minimum-payment";
import s09 from "./s09-fees";
import s10 from "./s10-cic";
import s11 from "./s11-cashback-types";
import s12 from "./s12-mcc";
import s13 from "./s13-cashback-terms";
import s14 from "./s14-spending";
import s15 from "./s15-combo";
import s16 from "./s16-eligibility";
import s17 from "./s17-utilization";
import s18 from "./s18-security";
import s19 from "./s19-closing";

/** The deck, in presentation order. Exactly 19 slides. */
export const slides: readonly SlideDefinition[] = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19];

if (slides.length !== 19 || slides.some((s, i) => s.number !== i + 1)) {
  throw new Error("Slide registry out of order: expected slides 1–19 in sequence.");
}
