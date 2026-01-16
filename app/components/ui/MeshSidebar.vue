<script setup lang="ts">
import {
  ColorsIcon,
  ImageDownloadIcon,
  PaintBoardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import ModeToggle from "./ModeToggle.vue";
import BaseColorSection from "./mesh-sidebar/BaseColorSection.vue";
import ThemesSection from "./mesh-sidebar/ThemesSection.vue";
import LayersSection from "./mesh-sidebar/LayersSection.vue";
import SidebarFooterActions from "./mesh-sidebar/SidebarFooterActions.vue";
import DownloadDialog from "./mesh-sidebar/DownloadDialog.vue";

const { copyMeshCSS } = useMeshGradient();

const showDownloadImageSizeDialog = ref(false);
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
                  class="size-4.5"
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
        <BaseColorSection />
        <Separator class="my-2" />
        <ThemesSection />
        <LayersSection />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterActions />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
    <SidebarInset class="relative">
      <div class="relative">
        <SidebarTrigger
          class="text-sidebar-primary-foreground absolute top-4 left-4 z-10 -ml-1 size-4.5 shadow"
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
                class="text-sidebar-primary-foreground absolute top-4 left-11 z-10 -ml-1 size-4.5 shadow"
                @click="copyMeshCSS"
              >
                <HugeiconsIcon :icon="PaintBoardIcon" class="size-4.5" />
                <span class="sr-only">Toggle Sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Mesh CSS</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                aria-label="download-mesh-button"
                aria-labelledby="download-mesh-button"
                data-sidebar="trigger"
                data-slot="sidebar-trigger"
                variant="ghost"
                size="icon"
                class="text-sidebar-primary-foreground absolute top-4 left-18 z-10 -ml-1 size-4.5 shadow"
                @click="showDownloadImageSizeDialog = true"
              >
                <HugeiconsIcon :icon="ImageDownloadIcon" class="size-4.5" />
                <span class="sr-only">Toggle Sidebar</span>
              </Button>

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
    <DownloadDialog v-model:open="showDownloadImageSizeDialog" />
  </SidebarProvider>
</template>
