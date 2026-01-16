<script setup lang="ts">
import { themes } from "~/utils/themes";

const { applyTheme } = useMeshGradient();
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Quick Themes</SidebarGroupLabel>
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
</template>
