<script setup lang="ts">
import {
  Copy01Icon,
  Delete02Icon,
  RepeatOne02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";

import { maxLayerCount, BLEND_MODES } from "~/composables/useMeshGradient";

const { config, duplicateLayer, removeLayer, copyTextLayer } =
  useMeshGradient();
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel class="flex items-center justify-between">
      <span>Gradient Layers</span>
      <span class="text-muted-foreground text-xs">
        {{ config.layers.length }}
      </span>
    </SidebarGroupLabel>

    <SidebarGroupContent class="space-y-4">
      <ClientOnly>
        <template #placeholder>
          <div class="space-y-2">
            <div
              v-for="layer in config.layers"
              :key="layer.id"
              class="rounded-md border p-2"
            >
              <div class="bg-muted h-16 animate-pulse rounded" />
            </div>
          </div>
        </template>

        <Accordion type="multiple" class="space-y-2" collapsible>
          <AccordionItem
            v-for="(layer, index) in config.layers"
            :key="layer.id"
            :value="`layer-${index + 1}`"
            class="border last:border-b-2"
          >
            <!-- HEADER -->
            <AccordionTrigger
              class="p-2 hover:cursor-pointer hover:no-underline!"
            >
              <span class="text-sm font-medium"> Layer </span>
            </AccordionTrigger>

            <AccordionContent class="space-y-4 p-2">
              <div class="flex items-center gap-2">
                <ColorPicker v-model="layer.color" />
                <Input v-model="layer.color.hex" class="h-8 text-xs" />
              </div>

              <div class="space-y-1">
                <div class="text-muted-foreground flex justify-between text-xs">
                  <span>Position X</span>
                  <span>{{ layer.x[0] }}%</span>
                </div>

                <Slider
                  v-model="config!.layers![index]!.x"
                  :min="0"
                  :max="100"
                />
              </div>

              <div class="space-y-1">
                <div class="text-muted-foreground flex justify-between text-xs">
                  <span>Position Y</span>
                  <span>{{ layer.y[0] }}%</span>
                </div>
                <Slider
                  v-model="config!.layers![index]!.y"
                  :min="0"
                  :max="100"
                />
              </div>

              <div class="space-y-1">
                <div class="text-muted-foreground flex justify-between text-xs">
                  <span>Blur Size</span>
                  <span>{{ layer.blur[0] }}px</span>
                </div>
                <Slider
                  v-model="config!.layers![index]!.blur"
                  :min="0"
                  :max="200"
                />
              </div>

              <div class="space-y-1">
                <div class="text-muted-foreground flex justify-between text-xs">
                  <span>Opacity</span>
                  <span>{{ layer.opacity[0] }}%</span>
                </div>

                <Slider
                  v-model="config!.layers![index]!.opacity"
                  :min="0"
                  :max="100"
                />
              </div>

              <div class="space-y-1">
                <div class="text-muted-foreground text-xs">
                  <span>Blend Mode</span>
                </div>

                <Select v-model="config!.layers![index]!.blendMode">
                  <SelectTrigger class="h-8 w-full text-xs">
                    <SelectValue placeholder="Select blend mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="mode in BLEND_MODES"
                      :key="mode.value"
                      :value="mode.value"
                      class="text-xs"
                    >
                      {{ mode.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="flex w-full flex-wrap gap-1">
                <Button
                  class="flex-1"
                  aria-label="duplicate-layer-button"
                  aria-labelledby="duplicate-layer-button"
                  :class="
                    config.layers.length === maxLayerCount
                      ? 'cursor-not-allowed'
                      : 'cursor-copy'
                  "
                  variant="outline"
                  size="sm"
                  @click="duplicateLayer(index)"
                >
                  <HugeiconsIcon :icon="RepeatOne02Icon" />
                  <span class="text-xs">Duplicate</span>
                </Button>

                <Button
                  class="flex-1 cursor-pointer"
                  aria-label="copy-layer-css-button"
                  aria-labelledby="copy-layer-css-button"
                  variant="outline"
                  size="sm"
                  @click="copyTextLayer(layer)"
                >
                  <HugeiconsIcon :icon="Copy01Icon" />
                  <span class="text-xs">CSS</span>
                </Button>

                <Button
                  class="flex-1 cursor-pointer"
                  aria-label="delete-layer-button"
                  aria-labelledby="delete-layer-button"
                  variant="destructive"
                  size="sm"
                  @click="removeLayer(index)"
                >
                  <HugeiconsIcon :icon="Delete02Icon" />
                  <span class="text-xs">Delete</span>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ClientOnly>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
