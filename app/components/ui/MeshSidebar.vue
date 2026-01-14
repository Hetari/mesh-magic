<script setup lang="ts">
import {
  ArrowDataTransferHorizontalIcon,
  ColorsIcon,
  Copy01Icon,
  Delete02Icon,
  ImageDownloadIcon,
  LayersIcon,
  PaintBoardIcon,
  Plus,
  Recycle03Icon,
  RepeatOne02Icon,
  SparklesIcon,
  Svg01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import ModeToggle from "./ModeToggle.vue";

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
  copyTextLayer,
  copyMeshCSS,
  downloadMeshImage,
} = useMeshGradient();

const setNewLayerCount = (v: number) => {
  maxLayerCount.value = v;
};

const downloadImageLoading = ref(false);
const showDownloadImageSizeDialog = ref(false);
const IMAGE_PRESETS = [
  { label: "Instagram Post (1080×1080)", w: 1080, h: 1080 },
  { label: "Instagram Story (1080×1920)", w: 1080, h: 1920 },
  { label: "Twitter / X (1200×675)", w: 1200, h: 675 },
  { label: "Desktop HD (1920×1080)", w: 1920, h: 1080 },
  { label: "4K (3840×2160)", w: 3840, h: 2160 },
];
const downloadImageWidth = ref(800);
const downloadImageHeight = ref(600);
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
              <ClientOnly>
                <template #placeholder>
                  <Button
                    as="svg"
                    aria-label="mode-toggle-button-disabled"
                    aria-labelledby="mode-toggle-button-disabled"
                    variant="outline"
                    class="inline min-h-8 cursor-not-allowed opacity-50"
                  />
                </template>
                <ModeToggle />
              </ClientOnly>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <template v-for="section in sections" :key="section.title">
          <Separator v-if="section.sparated" class="my-2" />
          <SidebarGroup v-if="section.type === 'color'">
            <div class="grid grid-cols-3">
              <SidebarGroupLabel class="col-span-2">{{
                section.title
              }}</SidebarGroupLabel>
              <SidebarGroupLabel for="max-layrer-count">
                Max Layers
              </SidebarGroupLabel>
            </div>
            <SidebarGroupContent
              v-if="section.type === 'color'"
              class="flex items-center gap-2"
            >
              <ColorPicker v-model="config.baseColor" />
              <SidebarMenuButton as-child>
                <Input v-model="config.baseColor.hex" />
              </SidebarMenuButton>

              <NumberField
                id="max-layrer-count"
                :model-value="maxLayerCount"
                :default-value="maxLayerCount"
                :min="0"
                @update:model-value="setNewLayerCount"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup v-else-if="section.type === 'themes'">
            <SidebarGroupLabel>{{ section.title }}</SidebarGroupLabel>
            <SidebarGroupContent class="grid grid-cols-3 gap-2">
              <SidebarMenuButton
                v-for="(_, name) in themes"
                :key="name"
                class="justify-center"
                as-child
                @click="applyTheme(name)"
              >
                <Button
                  class="w-full"
                  variant="outline"
                  size="sm"
                  :aria-label="`apply-theme-${name}-button`"
                  :aria-labelledby="`apply-theme-${name}-button`"
                >
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
      </SidebarContent>
      <SidebarFooter>
        <div class="space-y-2">
          <ButtonGroup class="w-full">
            <Button
              aria-label="add-layer-button"
              aria-labelledby="add-layer-button"
              variant="outline"
              class="flex-1"
              @click="addLayer()"
            >
              <HugeiconsIcon :icon="Plus" size="4" />
              Add
            </Button>
            <Button
              aria-label="reset-button"
              aria-labelledby="reset-button"
              variant="outline"
              class="flex-1"
              @click="reset()"
            >
              <HugeiconsIcon :icon="Recycle03Icon" size="4" />
              Reset
            </Button>
            <Button
              aria-label="randomize-button"
              aria-labelledby="randomize-button"
              class="flex-2"
              @click="randomize()"
            >
              <HugeiconsIcon :icon="ArrowDataTransferHorizontalIcon" size="4" />
              Randomize
            </Button>
          </ButtonGroup>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
    <SidebarInset class="relative">
      <div class="relative">
        <SidebarTrigger
          class="text-sidebar-primary-foreground absolute top-4 left-4 z-10 -ml-1 size-6 shadow"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                aria-label="copy-mesh-css-button"
                aria-labelledby="copy-mesh-css-button"
                data-sidebar="trigger"
                data-slot="sidebar-trigger"
                variant="ghost"
                size="icon"
                class="text-sidebar-primary-foreground absolute top-4 left-13 z-10 -ml-1 size-6 shadow"
                @click="copyMeshCSS"
              >
                <HugeiconsIcon :icon="PaintBoardIcon" class="size-6" />
                <span class="sr-only">Toggle Sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Mesh CSS</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <HugeiconsIcon
                class="text-sidebar-primary-foreground absolute top-4 left-22 z-10 -ml-1 size-6 shadow"
                :icon="ImageDownloadIcon"
                @click="showDownloadImageSizeDialog = true"
              />
              <span class="sr-only">Download Mesh</span>
            </TooltipTrigger>
            <TooltipContent>Download Mesh</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div class="flex min-h-dvh flex-1 flex-col overflow-clip">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>

  <Dialog v-model:open="showDownloadImageSizeDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Choose image width and height</DialogTitle>
        <DialogDescription>
          Download the mesh gradient as a PNG with a preset size or custom
          dimensions.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Preset dropdown -->
        <Select
          @update:model-value="
            (v) => {
              const preset = IMAGE_PRESETS.find((p) => p.label === v);
              if (!preset) return;
              downloadImageWidth = preset.w;
              downloadImageHeight = preset.h;
            }
          "
        >
          <SelectTrigger>
            <SelectValue placeholder="Popular sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="preset in IMAGE_PRESETS"
              :key="preset.label"
              :value="preset.label"
            >
              {{ preset.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <!-- Custom inputs -->
        <div class="flex items-end gap-4">
          <NumberField
            :model-value="downloadImageWidth"
            :min="100"
            :max="5000"
            @update:model-value="(v) => (downloadImageWidth = v)"
          >
            <Label>Width</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>

          <!-- Switch value -->
          <Button
            aria-label="swap-width-height-button"
            aria-labelledby="swap-width-height-button"
            variant="outline"
            @click="
              () => {
                const temp = downloadImageWidth;
                downloadImageWidth = downloadImageHeight;
                downloadImageHeight = temp;
              }
            "
          >
            <HugeiconsIcon :icon="ArrowDataTransferHorizontalIcon" />
          </Button>

          <NumberField
            :model-value="downloadImageHeight"
            :min="100"
            :max="5000"
            @update:model-value="(v) => (downloadImageHeight = v)"
          >
            <Label>Height</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <Button
          aria-label="download-mesh-image-button"
          aria-labelledby="download-mesh-image-button"
          class="w-full"
          :disabled="downloadImageLoading"
          @click="
            downloadMeshImage(
              {
                width: downloadImageWidth,
                height: downloadImageHeight,
                to: 'png',
              },
              () => {
                showDownloadImageSizeDialog = false;
                downloadImageLoading = false;
              },
            );
            downloadImageLoading = true;
          "
        >
          <LazySpinner v-if="downloadImageLoading" />
          Download
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
