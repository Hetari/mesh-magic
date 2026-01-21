<script setup lang="ts">
import { ColorsIcon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import ModeToggle from "../ui/ModeToggle.vue";
import BaseColorSection from "./partials/BaseColorSection.vue";
import ThemesSection from "./partials/ThemesSection.vue";
import LayersSection from "./partials/LayersSection.vue";
import SidebarFooterActions from "./partials/SidebarFooterActions.vue";
import DownloadDialog from "./partials/DownloadDialog.vue";
import CopyMeshCssButton from "./partials/CopyMeshCssButton.vue";
import DownloadMeshButton from "./partials/DownloadMeshButton.vue";
import KeyboardShortcutsDialog from "./partials/KeyboardShortcutsDialog.vue";

const showDownloadImageSizeDialog = ref(false);

const { showDots } = useMeshGradient();
const { showHelpDialog, openHelpDialog } = useKeyboardShortcuts();

// Setup keyboard shortcuts
const { setupShortcuts } = useAppKeyboardShortcuts();
onMounted(() => {
  setupShortcuts();
});
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
        <SidebarGroup>
          <div class="flex items-center gap-2">
            <Checkbox v-model="showDots" id="show-dots" />
            <Label for="show-dots">Show Controls</Label>
          </div>
        </SidebarGroup>

        <ThemesSection />

        <LayersSection />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterActions />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
    <SidebarInset class="relative">
      <div class="absolute top-4 left-4 z-10 flex items-center gap-2">
        <SidebarTrigger class="text-sidebar-primary-foreground shadow" />

        <CopyMeshCssButton />
        <DownloadMeshButton @click="showDownloadImageSizeDialog = true" />
        <Button
          variant="outline"
          size="icon"
          class="text-sidebar-primary-foreground shadow"
          @click="openHelpDialog"
        >
          <HugeiconsIcon :icon="HelpCircleIcon" class="size-4" />
        </Button>
      </div>
      <div class="flex min-h-dvh flex-1 flex-col overflow-clip">
        <slot />
      </div>
    </SidebarInset>
    <DownloadDialog v-model:open="showDownloadImageSizeDialog" />
    <KeyboardShortcutsDialog v-model:open="showHelpDialog" />
  </SidebarProvider>
</template>
