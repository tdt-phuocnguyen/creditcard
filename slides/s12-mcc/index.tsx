import { defineSlide } from "../types";
import { createPlaceholder } from "../_placeholder";

export default defineSlide({
  id: "mcc",
  steps: 1,
  Component: createPlaceholder(12),
});
