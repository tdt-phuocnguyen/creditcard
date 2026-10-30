import { defineSlide } from "../types";
import { createPlaceholder } from "../_placeholder";

export default defineSlide({
  id: "opening",
  steps: 1,
  Component: createPlaceholder(1),
});
