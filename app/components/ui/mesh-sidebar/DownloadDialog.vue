<script setup lang="ts">
import { useTimeoutFn } from "@vueuse/core";
import { useSidebar } from "~/components/ui/sidebar/utils";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const { downloadMeshImage } = useMeshGradient();
const sidebar = useSidebar();

const downloadImageLoading = ref(false);

const SCALE_OPTIONS = [
  { label: "1x (Standard)", value: 1 },
  { label: "2x (High)", value: 2 },
  { label: "3x (Very High)", value: 3 },
  { label: "4x (Ultra)", value: 4 },
];

const FORMAT_OPTIONS = [
  { label: "PNG", value: "png" as const },
  { label: "JPEG", value: "jpeg" as const },
  { label: "SVG", value: "svg" as const },
];

const selectedScale = ref(2);
const selectedFormat = ref<"png" | "jpeg" | "svg">("png");

const handleDownload = async () => {
  downloadImageLoading.value = true;

  // Record sidebar state
  const wasOpen = sidebar.isMobile.value
    ? sidebar.openMobile.value
    : sidebar.open.value;

  // Close sidebar
  if (sidebar.isMobile.value) {
    sidebar.setOpenMobile(false);
  } else {
    sidebar.setOpen(false);
  }

  // Wait for sidebar transition (typical shadcn/tailwind transitions are 200-300ms)
  const { start } = useTimeoutFn(async () => {
    await downloadMeshImage(
      {
        scale: selectedScale.value,
        aspectRatio: "current", // Defaulting to current as requested by previous change
        to: selectedFormat.value,
      },
      () => {
        // Restore sidebar state if it was open
        if (wasOpen) {
          if (sidebar.isMobile.value) {
            sidebar.setOpenMobile(true);
          } else {
            sidebar.setOpen(true);
          }
        }
        downloadImageLoading.value = false;
        emit("update:open", false);
      },
    );
  }, 400); // 400ms to be safe for all transitions

  start();
};
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Download Mesh Gradient</DialogTitle>
        <DialogDescription>
          Choose resolution and format for your download.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Resolution / Scale -->
        <div class="space-y-2">
          <Label>Resolution Quality</Label>
          <div class="grid grid-cols-4 gap-2">
            <Button
              v-for="option in SCALE_OPTIONS"
              :key="option.value"
              :variant="selectedScale === option.value ? 'default' : 'outline'"
              size="sm"
              class="text-xs"
              @click="selectedScale = option.value"
            >
              {{ option.label }}
            </Button>
          </div>
        </div>

        <!-- Format -->
        <div class="space-y-2">
          <Label>Format</Label>
          <div class="grid grid-cols-3 gap-2">
            <Button
              v-for="option in FORMAT_OPTIONS"
              :key="option.value"
              :variant="selectedFormat === option.value ? 'default' : 'outline'"
              size="sm"
              @click="selectedFormat = option.value"
            >
              {{ option.label }}
            </Button>
          </div>
        </div>

        <!-- Download Button -->
        <Button
          aria-label="download-mesh-image-button"
          aria-labelledby="download-mesh-image-button"
          class="w-full"
          :disabled="downloadImageLoading"
          @click="handleDownload"
        >
          <LazySpinner v-if="downloadImageLoading" />
          Download {{ selectedFormat.toUpperCase() }} at {{ selectedScale }}x
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
