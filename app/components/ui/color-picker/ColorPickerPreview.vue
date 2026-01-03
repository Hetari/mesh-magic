<script setup lang="ts">
import { PopoverTrigger } from "../popover";
import { COLOR_PICKER_KEY, type ColorPickerContext } from "./types";
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const color = inject<ColorPickerContext>(COLOR_PICKER_KEY);
const backgroundColor = computed(() => color?.colorValue?.value);
</script>

<template>
  backgrosundColor?.hex: {{ backgroundColor }}
  <PopoverTrigger :as-child="true">
    <Button
      :class="cn('size-10 p-0 rounded-md', props.class)"
      :style="{ backgroundColor: backgroundColor?.hex }"
      aria-label="Select Color"
    />
  </PopoverTrigger>
</template>
