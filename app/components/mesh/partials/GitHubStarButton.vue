<script setup lang="ts">
import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import RollingNumber from "~/components/ui/RollingNumber.vue";

const stars = ref(0);
const { data } = await useFetch<{ stargazers_count: number }>(
  "https://api.github.com/repos/Hetari/mesh-magic",
);
stars.value = data.value?.stargazers_count || 0;
const digits = computed(() =>
  Math.abs(stars.value)
    .toString()
    .split("")
    .map((d) => Number(d)),
);
// const randomDigit = () => {
//   return Math.floor(Math.random() * 10);
// };
</script>

<template>
  <Button
    variant="outline"
    size="sm"
    as="a"
    href="https://github.com/Hetari/mesh-magic"
    target="_blank"
    class="text-sidebar-primary-foreground flex h-9 items-center gap-2 px-3 shadow"
  >
    <HugeiconsIcon :icon="GithubIcon" class="size-4" />
    <div>
      <RollingNumber
        v-for="(digit, i) in digits"
        :key="i"
        :start-value="0"
        :target-value="digit"
        class="font-mono text-xs"
      />
    </div>
  </Button>
</template>
