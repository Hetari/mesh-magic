<script setup lang="ts">
import ColorPickerRoot from "./ColorPickerRoot.vue";
import ColorPickerBody from "./ColorPickerBody.vue";
import ColorPickerPreview from "./ColorPickerPreview.vue";
import ColorPickerHeader from "./ColorPickerHeader.vue";
import ColorPickerInput from "./ColorPickerInput.vue";
import type { ColorValue } from "./types";

const color = ref<ColorValue>({
  hex: "#ff0000",
  rgb: { r: 255, g: 0, b: 0, a: 1 },
  hsv: { h: 0, s: 100, v: 100, a: 1 },
  oklch: {
    a: 0,
    c: 0,
    h: 0,
    l: 0,
  },
});
</script>

<template>
  <!-- <ClientOnly> -->
  color.hex:{{ color.hex }}

  <ColorPickerRoot>
    <ColorPickerPreview />
    <ColorPickerBody>
      <ColorPickerHeader>
        <ColorPickerInput v-model="color.hex" class="w-24" />
      </ColorPickerHeader>

      <!-- </ColorPickerHeader> -->
    </ColorPickerBody>
    <!-- <ColorPickerSwatches />
        <ColorPickerSaturation />



        <ColorPickerHue />
        <ColorPickerAlpha />
        <ColorPickerInputs /> -->
  </ColorPickerRoot>
  <!-- </ClientOnly> -->
</template>
