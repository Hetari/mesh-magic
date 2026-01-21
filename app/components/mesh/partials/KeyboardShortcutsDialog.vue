<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const { isMac } = useKeyboardShortcuts();

type ShortcutItem = {
  name: string;
  keys: string;
  macKeys?: string;
};

type ShortcutCategory = {
  title: string;
  shortcuts: ShortcutItem[];
};

const categories: ShortcutCategory[] = [
  {
    title: "General",
    shortcuts: [
      { name: "Show keyboard shortcuts", keys: "?", macKeys: "?" },
      { name: "Save gradient", keys: "Ctrl+S", macKeys: "Cmd+S" },
      { name: "Randomize gradient", keys: "R", macKeys: "R" },
      { name: "Reset gradient", keys: "Ctrl+R", macKeys: "Cmd+R" },
      { name: "Toggle dots", keys: "D", macKeys: "D" },
    ],
  },
  {
    title: "Layers",
    shortcuts: [
      { name: "Add new layer", keys: "A", macKeys: "A" },
      { name: "Delete last layer", keys: "Backspace", macKeys: "Delete" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { name: "Close dialog", keys: "Escape", macKeys: "Escape" },
    ],
  },
];

const formatKeys = (keys: string, macKeys?: string): string => {
  const actualKeys = isMac && macKeys ? macKeys : keys;
  return actualKeys
    .split("+")
    .map((key) => {
      // Replace common key names with symbols for better readability
      const keyMap: Record<string, string> = {
        Ctrl: "Ctrl",
        Cmd: "⌘",
        Shift: "⇧",
        Alt: "⌥",
        Backspace: "⌫",
        Delete: "⌦",
        Escape: "Esc",
      };
      return keyMap[key] || key.toUpperCase();
    })
    .join(" + ");
};

</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogDescription>
          Use these keyboard shortcuts to navigate and interact faster
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 mt-4">
        <div
          v-for="category in categories"
          :key="category.title"
          class="space-y-3"
        >
          <h3 class="text-sm font-semibold text-foreground">
            {{ category.title }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="shortcut in category.shortcuts"
              :key="shortcut.name"
              class="flex items-center justify-between py-2"
            >
              <span class="text-sm text-muted-foreground">
                {{ shortcut.name }}
              </span>
              <kbd
                class="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded"
              >
                {{ formatKeys(shortcut.keys, shortcut.macKeys) }}
              </kbd>
            </div>
          </div>
          <Separator v-if="category !== categories[categories.length - 1]" />
        </div>
      </div>

      <div class="mt-6 p-3 bg-muted/50 rounded-lg">
        <p class="text-xs text-muted-foreground">
          <span class="font-semibold">Tip:</span> Shortcuts are disabled when
          typing in input fields
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
