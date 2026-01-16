<script setup lang="ts">
import { maxLayerCount } from "~/composables/useMeshGradient";
const { config } = useMeshGradient();

const setNewLayerCount = (v: number) => {
  maxLayerCount.value = v;
};
</script>

<template>
  <SidebarGroup>
    <div class="grid grid-cols-3">
      <SidebarGroupLabel class="col-span-2" as-child>
        <Label for="base-color-input">Base Color</Label>
      </SidebarGroupLabel>
      <SidebarGroupLabel for="max-layer-count" as-child>
        <Label for="max-layer-count-input">Max Layers</Label>
      </SidebarGroupLabel>
    </div>
    <SidebarGroupContent class="flex items-center gap-2">
      <ColorPicker v-model="config.baseColor" />
      <SidebarMenuButton as-child>
        <Input v-model="config.baseColor.hex" id="base-color-input" />
      </SidebarMenuButton>

      <NumberField
        id="max-layer-count"
        :model-value="maxLayerCount"
        :default-value="maxLayerCount"
        :min="0"
        @update:model-value="setNewLayerCount"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput id="max-layer-count-input" />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
