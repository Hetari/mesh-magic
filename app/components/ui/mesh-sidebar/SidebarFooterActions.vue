<script setup lang="ts">
import {
  ArrowDataTransferHorizontalIcon,
  Plus,
  Recycle03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { cn } from "~/lib/utils";

const { addLayer, reset, randomize } = useMeshGradient();
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
      <Button
        aria-label="randomize-button"
        aria-labelledby="randomize-button"
        class="flex-2 transition-colors"
        variant="ghost"
        :class="
          cn(
            'bg-white text-black hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800',
          )
        "
        @click="randomize()"
      >
        <HugeiconsIcon :icon="ArrowDataTransferHorizontalIcon" size="4" />
        Randomize
      </Button>
    </ButtonGroup>
  </div>
</template>
