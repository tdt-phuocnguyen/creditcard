import { defineSlide } from "../types";
import { createPlaceholder } from "../_placeholder";

export default defineSlide({
  id: "minimum-payment",
  steps: 1,
  Component: createPlaceholder(8),
});
