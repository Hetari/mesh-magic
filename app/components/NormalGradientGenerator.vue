<script setup lang="ts">
import { parseColor } from "~/components/ui/color-picker/color.utils";
import {
  SidebarRoot,
  SidebarHeader,
  SidebarTitle,
  SidebarDescription,
  SidebarContent,
} from "~/components/sidebar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ColorPicker } from "~/components/ui/color-picker";
import ExportActions from "~/components/ExportActions.vue";

const config = reactive({
  type: "linear" as "linear" | "radial",
  angle: 45,
  stops: [
    { color: parseColor("#3b82f6"), position: 0 },
    { color: parseColor("#ec4899"), position: 100 },
  ],
});

const gradientStyle = computed(() => {
  const stopsStr = config.stops
    .map((s) => `${s.color.hex} ${s.position}%`)
    .join(", ");
  if (config.type === "linear") {
    return `linear-gradient(${config.angle}deg, ${stopsStr})`;
  } else {
    return `radial-gradient(circle, ${stopsStr})`;
  }
});

const onDownloadImage = () => {
  alert("Download Image to be implemented");
};
</script>

<template>
  <div class="bg-background flex min-h-dvh flex-col lg:flex-row">
    <!-- Preview -->
    <div
      class="relative order-2 flex flex-1 items-center justify-center overflow-hidden lg:order-1"
    >
      <div
        class="flex h-full w-full items-center justify-center"
        :style="{ background: gradientStyle }"
      >
        <span class="text-4xl font-bold text-white mix-blend-overlay"
          >PREVIEW</span
        >
      </div>
    </div>

    <!-- Sidebar -->
    <SidebarRoot>
      <SidebarHeader>
        <SidebarTitle>Normal Gradient</SidebarTitle>
        <SidebarDescription
          >Create linear and radial gradients</SidebarDescription
        >
      </SidebarHeader>

      <SidebarContent class="space-y-6">
        <!-- Type Selection -->
        <div class="flex gap-2">
          <Button
            aria-label="linear-gradient-button"
            aria-labelledby="linear-gradient-button"
            :variant="config.type === 'linear' ? 'default' : 'outline'"
            @click="config.type = 'linear'"
            >Linear</Button
          >
          <Button
            aria-label="radial-gradient-button"
            aria-labelledby="radial-gradient-button"
            :variant="config.type === 'radial' ? 'default' : 'outline'"
            @click="config.type = 'radial'"
            >Radial</Button
          >
        </div>

        <!-- Angle (Linear only) -->
        <div v-if="config.type === 'linear'" class="space-y-2">
          <span class="text-sm font-medium">Angle: {{ config.angle }}deg</span>
          <Input v-model="config.angle" type="range" min="0" max="360" />
        </div>

        <!-- Stops Configuration (Simplified) -->
        <div class="space-y-2">
          <span class="text-sm font-medium">Colors</span>
          <div
            v-for="(stop, index) in config.stops"
            :key="index"
            class="flex items-center gap-2"
          >
            <ColorPicker v-model="stop.color" />
            <Input
              v-model="stop.position"
              type="number"
              min="0"
              max="100"
              class="w-20"
            />
            <span>%</span>
          </div>
        </div>

        <ExportActions
          :css="`background: ${gradientStyle}`"
          @download-image="onDownloadImage"
        />
      </SidebarContent>
    </SidebarRoot>
  </div>
</template>
