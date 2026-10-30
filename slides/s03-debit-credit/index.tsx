import { defineSlide } from "../types";
import { DebitCreditSlide } from "./DebitCreditSlide";

/**
 * Steps: 0 = definitions side by side (balances at their starting values);
 *        1 = the illustrative 2.000.000 payment: debit balance drops,
 *            credit amount owed appears; key message.
 */
export default defineSlide({
  id: "debit-credit",
  steps: 2,
  Component: DebitCreditSlide,
});
