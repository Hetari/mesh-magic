<script setup lang="ts">
import { cn } from "~/lib/utils";
import { Input } from "../input";
import type { HTMLAttributes } from "vue";
import { COLOR_PICKER_KEY, type ColorPickerContext } from "./types";
import { isHexColorValid } from "./colorUtils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const color = inject<ColorPickerContext>(COLOR_PICKER_KEY);

const colorValue = defineModel<string>({
  required: true,
  set(value) {
    if (color) if (isHexColorValid(value)) color.colorValue.value.hex = value;
    console.log("ColorPickerInput set to:", isHexColorValid(value), value);
  },
});
</script>

<template>
  <Input v-model="colorValue" :class="cn(props.class)" />
</template>
