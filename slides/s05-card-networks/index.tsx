import { defineSlide } from "../types";
import { createPlaceholder } from "../_placeholder";

export default defineSlide({
  id: "card-networks",
  steps: 1,
  Component: createPlaceholder(5),
});
