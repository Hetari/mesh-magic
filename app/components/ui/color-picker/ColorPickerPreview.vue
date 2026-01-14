<script setup lang="ts">
import { PopoverTrigger } from "../popover";
import { COLOR_PICKER_KEY, type ColorPickerContext } from "./types";
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const context = inject<ColorPickerContext>(COLOR_PICKER_KEY);
if (!context)
  throw new Error("ColorPickerPreview must be used within ColorPickerRoot");

const { color, disabled, open } = context;

const hex = computed(() => {
  return color.value.hex || "#000000";
});
</script>

<template>
  <PopoverTrigger as-child :disabled="disabled">
    <Button
      aria-label="Select Color"
      aria-labelledby="Select Color"
      aria-haspopup="dialog"
      :aria-expanded="open"
      variant="outline"
      :disabled="disabled"
      :class="
        cn(
          'ring-offset-background focus-visible:ring-ring size-9 overflow-hidden rounded-md border p-0 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          props.class,
        )
      "
    >
      <div class="h-full w-full" :style="{ backgroundColor: hex }" />
    </Button>
  </PopoverTrigger>
</template>
