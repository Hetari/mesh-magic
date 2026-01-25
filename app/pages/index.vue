<script setup lang="ts">
import MeshGradientPreview from "~/components/mesh/MeshGradientPreview.vue";

const { loadFromUrl } = useMeshGradient();
const route = useRoute();

// Load gradient from URL on mount
onMounted(() => {
  const queryParam = route.query.g;
  
  // Normalize query parameter to a single string
  let encoded: string | undefined;
  
  if (typeof queryParam === "string") {
    encoded = queryParam;
  } else if (Array.isArray(queryParam) && queryParam.length > 0) {
    // If array, use the first element (handle null case)
    const firstElement = queryParam[0];
    encoded = typeof firstElement === "string" ? firstElement : undefined;
  }
  
  if (encoded) {
    loadFromUrl(encoded);
  }
});
</script>
<template>
  <MeshGradientPreview />
</template>
