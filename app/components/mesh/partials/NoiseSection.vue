<script setup lang="ts">
const { showNoise, noiseOpacity } = useMeshGradient();
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Noise Effect</SidebarGroupLabel>
    <SidebarGroupContent class="space-y-4">
      
      <div class="flex items-center gap-2">
        <Checkbox v-model="showNoise" id="show-noise" />
        <Label for="show-noise">Enable Noise</Label>
      </div>

      <div v-if="showNoise" class="space-y-2">
        <div class="flex items-center justify-between">
          <Label for="noise-opacity">Opacity</Label>
          <span class="text-xs text-muted-foreground">{{ noiseOpacity[0] }}%</span>
        </div>
        <Slider
          v-model="noiseOpacity"
          id="noise-opacity"
          :min="0"
          :max="100"
          :step="1"
        />
      </div>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
