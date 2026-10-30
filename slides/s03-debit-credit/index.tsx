import { defineSlide } from "../types";
import { createPlaceholder } from "../_placeholder";

export default defineSlide({
  id: "debit-credit",
  steps: 1,
  Component: createPlaceholder(3),
});
