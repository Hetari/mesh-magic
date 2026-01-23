<script setup lang="ts">
import LayerControlPoint from "./LayerControlPoint.vue";

const { config, showDots } = useMeshGradient();

function updateLayerPosition(index: number, x: number, y: number) {
  if (!config.value || !config.value.layers[index]) return;
  config.value.layers[index].x[0] = x;
  config.value.layers[index].y[0] = y;
}
</script>

<template>
  <div id="mesh-gradient" class="relative size-full overflow-hidden">
    <!-- Gradient Layers -->
    <div
      class="absolute inset-0"
      :style="{ backgroundColor: config?.baseColor?.hex }"
    />
    <div
      v-for="layer in config.layers"
      :id="`layer-${layer.id}`"
      :key="layer.id"
      class="pointer-events-none absolute transition-all duration-500 ease-out"
      :style="{
        width: layer.size + '%',
        height: layer.size + '%',
        left: layer.x[0] + '%',
        top: layer.y[0] + '%',
        backgroundColor: layer.color.hex,
        filter: `blur(${layer.blur[0]}px)`,
        borderRadius: layer.borderRadius,
        opacity: (layer.opacity[0] ?? 100) / 100,
        mixBlendMode: layer.blendMode,
      }"
    />

    <!-- Grain Texture Overlay -->
    <div
      class="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-[0.5] mix-blend-overlay"
    />

    <!-- Control Points -->
    <template v-if="config && showDots">
      <LayerControlPoint
        v-for="(layer, index) in config.layers"
        :key="`control-${layer.id}`"
        :x="layer.x[0] ?? 0"
        :y="layer.y[0] ?? 0"
        :color="layer.color?.hex"
        @update:position="(x, y) => updateLayerPosition(index, x, y)"
      />
    </template>
  </div>
</template>
