<script setup lang="ts">
const { config } = useMeshGradient();

defineEmits<{
  removeLayer: [index: number];
}>();
</script>
<template>
  <div
    id="mesh-gradient"
    class="relative size-full"
    :style="{ backgroundColor: config.baseColor.hex }"
  >
    <ClientOnly>
      <template #placeholder>
        <div class="size-full" />
      </template>
      <div
        v-for="layer in config.layers"
        :id="`layer-${layer.id}`"
        :key="layer.id"
        class="pointer-events-none absolute mix-blend-screen transition-all duration-700 ease-out"
        :class="`w-[${layer.size}%] h-[${layer.size}%] left-[${layer.x[0]}%] top-[${layer.y[0]}%] blur-[${layer.blur[0]}px] rounded-[${layer.borderRadius}] opacity-80 bg-[${layer.color.hex}]`"
      />
    </ClientOnly>

    <!-- Grain Texture Overlay -->
    <div
      class="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay"
    />
  </div>
</template>
