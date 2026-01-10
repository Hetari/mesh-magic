<script setup lang="ts">
import {
  ArrowDataTransferHorizontalIcon,
  ColorsIcon,
  Copy01Icon,
  Delete02Icon,
  LayersIcon,
  Plus,
  Recycle03Icon,
  RepeatOne02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";

type SidebarSection = {
  id: string;
  title: string;
  icon?: Component;
  type: "color" | "themes" | "layers";
  sparated?: boolean;
};

const sections: SidebarSection[] = [
  {
    id: "base",
    title: "Base Color",
    icon: ColorsIcon,
    type: "color",
    sparated: true,
  },
  {
    id: "themes",
    title: "Quick Themes",
    icon: SparklesIcon,
    type: "themes",
  },
  {
    id: "layers",
    title: "Gradient Layers",
    icon: LayersIcon,
    type: "layers",
  },
];

const {
  config,
  addLayer,
  applyTheme,
  duplicateLayer,
  randomize,
  removeLayer,
  reset,
} = useMeshGradient();
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div
                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <HugeiconsIcon
                  fetchpriority="high"
                  :icon="ColorsIcon"
                  class="size-5"
                />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Mesh Gradient</span>
                <p class="truncate text-sm">Your mesh with precision</p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <template v-for="section in sections" :key="section.title">
          <Separator v-if="section.sparated" class="my-2" />
          <SidebarGroup v-if="section.type === 'color'">
            <SidebarGroupLabel>{{ section.title }}</SidebarGroupLabel>
            <SidebarGroupContent
              v-if="section.type === 'color'"
              class="flex items-center gap-2"
            >
              <ColorPicker v-model="config.baseColor" />
              <SidebarMenuButton as-child>
                <Input v-model="config.baseColor.hex" />
              </SidebarMenuButton>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup v-else-if="section.type === 'themes'">
            <SidebarGroupLabel>{{ section.title }}</SidebarGroupLabel>
            <SidebarGroupContent class="grid grid-cols-3 gap-2">
              <SidebarMenuButton
                v-for="(theme, name) in themes"
                :key="name"
                class="justify-center"
                as-child
                @click="applyTheme(name)"
              >
                <Button class="w-full" variant="outline" size="sm">
                  {{ name }}
                </Button>
              </SidebarMenuButton>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup v-else-if="section.type === 'layers'">
            <SidebarGroupLabel class="flex items-center justify-between">
              <span>{{ section.title }}</span>
              <span class="text-muted-foreground text-xs">
                {{ config.layers.length }}
              </span>
            </SidebarGroupLabel>

            <SidebarGroupContent class="space-y-4">
              <Accordion type="multiple" class="space-y-2" collapsible default-value="layer-1">
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
                      <div
                        class="text-muted-foreground flex justify-between text-xs"
                      >
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
                      <div
                        class="text-muted-foreground flex justify-between text-xs"
                      >
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
                      <div
                        class="text-muted-foreground flex justify-between text-xs"
                      >
                        <span>Blur Size</span>
                        <span>{{ layer.blur[0] }}px</span>
                      </div>
                      <Slider
                        v-model="config!.layers![index]!.blur"
                        :min="0"
                        :max="200"
                      />
                    </div>

                    <div class="flex w-full flex-wrap gap-1">
                      <Button
                        class="flex-1 cursor-copy"
                        variant="outline"
                        size="sm"
                        @click="duplicateLayer(index)"
                      >
                        <HugeiconsIcon :icon="RepeatOne02Icon" />
                        <span class="text-xs">Duplicate</span>
                      </Button>

                      <Button
                        class="flex-1 cursor-pointer"
                        variant="outline"
                        size="sm"
                      >
                        <HugeiconsIcon :icon="Copy01Icon" />
                        <span class="text-xs">CSS</span>
                      </Button>

                      <Button
                        class="flex-1 cursor-pointer"
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
            </SidebarGroupContent>
          </SidebarGroup>
        </template>
      </SidebarContent>
      <SidebarFooter>
        <div class="space-y-2">
          <div class="flex">
            <Button
              variant="outline"
              class="flex-1 rounded-e-none border-e-0"
              @click="addLayer()"
            >
              <HugeiconsIcon :icon="Plus" size="4" />
              Add
            </Button>
            <Button
              variant="outline"
              class="flex-1 rounded-s-none"
              @click="reset()"
            >
              <HugeiconsIcon :icon="Recycle03Icon" size="4" />
              Reset
            </Button>
          </div>
          <Button class="w-full" @click="randomize()">
            <HugeiconsIcon :icon="ArrowDataTransferHorizontalIcon" size="4" />
            Randomize
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <SidebarTrigger
        class="text-sidebar-primary-foreground absolute top-4 left-4 z-10 -ml-1 shadow"
      />
      <div class="flex min-h-screen flex-1 flex-col overflow-clip">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
