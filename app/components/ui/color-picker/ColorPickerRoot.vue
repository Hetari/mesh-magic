<script setup lang="ts">
import { Popover } from "../popover";

import {
  COLOR_PICKER_KEY,
  type ColorPickerContext,
  type ColorValue,
} from "./types";

const color = ref<ColorValue>({
  hex: "#ff0000",
  hex8: "#ff0000ff",
  rgb: { r: 255, g: 0, b: 0, a: 1 },
  hsl: { h: 0, s: 100, l: 50, a: 1 },
  hsv: { h: 0, s: 100, v: 100, a: 1 },
});
provide<ColorPickerContext>(COLOR_PICKER_KEY, {
  colorValue: color,
});
</script>

<template>
  <section class="p-4 flex flex-col gap-4">
    <Popover as-child>
      <slot />
    </Popover>
  </section>
</template>
