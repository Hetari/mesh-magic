<script setup lang="ts">
import {
  ArrowDataTransferHorizontalIcon,
  Plus,
  Recycle03Icon,
  Bookmark01Icon,
  FolderLibraryIcon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { useSavedGradients } from "~/composables/useSavedGradients";
import SavedGradientsDialog from "./SavedGradientsDialog.vue";

const { config, addLayer, reset, randomize, copyShareUrl } = useMeshGradient();
const { saveGradient } = useSavedGradients();

const showSavedGradientsDialog = ref(false);

const handleSave = () => {
  saveGradient(config.value);
};
</script>

<template>
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
    </ButtonGroup>
    <ButtonGroup class="w-full">
      <Button
        aria-label="save-gradient-button"
        aria-labelledby="save-gradient-button"
        variant="outline"
        class="flex-1"
        @click="handleSave"
      >
        <HugeiconsIcon :icon="Bookmark01Icon" size="4" />
        Save
      </Button>
      <Button
        aria-label="my-gradients-button"
        aria-labelledby="my-gradients-button"
        variant="outline"
        class="flex-1"
        @click="showSavedGradientsDialog = true"
      >
        <HugeiconsIcon :icon="FolderLibraryIcon" size="4" />
        My Gradients
      </Button>
    </ButtonGroup>
    <ClientOnly>
      <Button
        aria-label="share-gradient-button"
        aria-labelledby="share-gradient-button"
        variant="outline"
        class="w-full"
        @click="copyShareUrl"
      >
        <HugeiconsIcon :icon="Share08Icon" size="4" />
        Copy Share Link
      </Button>
      <template #fallback>
        <Button variant="outline" class="w-full" disabled>
          <Skeleton class="h-4 bg-white/30 w-4 rounded-full" />
          <Skeleton class="h-4 bg-white/30 w-28" />
        </Button>
      </template>
    </ClientOnly>
    <Button
      aria-label="randomize-button"
      aria-labelledby="randomize-button"
      class="w-full flex-2"
      @click="randomize()"
    >
      <HugeiconsIcon :icon="ArrowDataTransferHorizontalIcon" size="4" />
      Randomize
    </Button>
  </div>

  <SavedGradientsDialog v-model:open="showSavedGradientsDialog" />
</template>
