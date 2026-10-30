import { defineSlide } from "../types";
import { createPlaceholder } from "../_placeholder";

export default defineSlide({
  id: "combo",
  steps: 1,
  Component: createPlaceholder(15),
});
