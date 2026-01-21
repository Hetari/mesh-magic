<script setup lang="ts">
import { useEventListener } from "@vueuse/core";

const props = defineProps<{
  x: number;
  y: number;
  color?: string;
  label?: string;
}>();

const emit = defineEmits<{
  "update:position": [x: number, y: number];
}>();

const el = ref<HTMLElement | null>(null);
const isDragging = ref(false);

function onPointerDown(e: PointerEvent) {
  e.preventDefault();
  e.stopPropagation();

  const target = el.value as HTMLElement;
  if (!target) return;
  target.setPointerCapture(e.pointerId);
  const parent = target.offsetParent as HTMLElement;
  if (!parent) return;

  isDragging.value = true;

  const startX = e.clientX;
  const startY = e.clientY;
  const rect = parent.getBoundingClientRect();
  const startPercentX = props.x;
  const startPercentY = props.y;

  const cleanupMove = useEventListener(
    window,
    "pointermove",
    (e: PointerEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const deltaPercentX = (deltaX / rect.width) * 100;
      const deltaPercentY = (deltaY / rect.height) * 100;

      let newX = startPercentX + deltaPercentX;
      let newY = startPercentY + deltaPercentY;

      //   Optional: Clamp to 0-100?
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      emit("update:position", newX, newY);
    },
  );

  const cleanupUp = useEventListener(window, "pointerup", () => {
    isDragging.value = false;
    cleanupMove();
    cleanupUp();
  });
}
</script>

<template>
  <div
    ref="el"
    class="absolute size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full shadow-sm ring-2 ring-white transition-transform hover:scale-110 active:scale-125 active:cursor-grabbing"
    :class="{ 'z-50 scale-125 cursor-grabbing': isDragging }"
    :style="{
      left: `${x}%`,
      top: `${y}%`,
      backgroundColor: color,
    }"
    aria-label="Layer control point"
    role="slider"
    :aria-valuenow="x"
    tabindex="0"
    @pointerdown="onPointerDown"
  />
</template>
