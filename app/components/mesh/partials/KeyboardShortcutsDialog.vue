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
    shortcuts: [{ name: "Close dialog", keys: "Escape", macKeys: "Escape" }],
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
  <Dialog
    class="hidden sm:block"
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <DialogContent class="max-h-[80vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogDescription>
          Use these keyboard shortcuts to navigate and interact faster
        </DialogDescription>
      </DialogHeader>

      <div class="mt-4 space-y-6">
        <div
          v-for="category in categories"
          :key="category.title"
          class="space-y-3"
        >
          <h3 class="text-foreground text-sm font-semibold">
            {{ category.title }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="shortcut in category.shortcuts"
              :key="shortcut.name"
              class="flex items-center justify-between py-2"
            >
              <span class="text-muted-foreground text-sm">
                {{ shortcut.name }}
              </span>
              <kbd
                class="text-foreground bg-muted border-border rounded border px-2 py-1 text-xs font-semibold"
              >
                {{ formatKeys(shortcut.keys, shortcut.macKeys) }}
              </kbd>
            </div>
          </div>
          <Separator v-if="category !== categories[categories.length - 1]" />
        </div>
      </div>

      <div class="bg-muted/50 mt-6 rounded-lg p-3">
        <p class="text-muted-foreground text-xs">
          <span class="font-semibold">Tip:</span> Shortcuts are disabled when
          typing in input fields
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
