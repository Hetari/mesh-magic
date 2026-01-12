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
        :style="{
          width: layer.size + '%',
          height: layer.size + '%',
          left: layer.x[0] + '%',
          top: layer.y[0] + '%',
          backgroundColor: layer.color.hex,
          filter: `blur(${layer.blur[0]}px)`,
          borderRadius: layer.borderRadius,
          opacity: 0.8,
        }"
      />
    </ClientOnly>

    <!-- Grain Texture Overlay -->
    <div
      class="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"
    />
  </div>
</template>
