import { onKeyStroke, useMagicKeys, whenever } from "@vueuse/core";
import { computed } from "vue";

/**
 * Represents a keyboard shortcut configuration.
 */
export type KeyboardShortcut = {
  /** Unique identifier for the shortcut. */
  id: string;
  /** Display name of the shortcut. */
  name: string;
  /** Description of what the shortcut does. */
  description: string;
  /** Key combination (e.g., "Ctrl+S", "R", "?"). */
  keys: string;
  /** macOS-specific key combination (e.g., "Cmd+S"). */
  macKeys?: string;
  /** Category for grouping shortcuts. */
  category: "general" | "layers" | "navigation";
  /** The action to execute when the shortcut is triggered. */
  action: () => void;
};

/**
 * Checks if the user is currently typing in an input element.
 * @returns True if focus is on an input, textarea, or contenteditable element.
 */
const isTyping = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();
  const isContentEditable = activeElement.getAttribute("contenteditable") === "true";

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    isContentEditable
  );
};

/**
 * Detects if the user is on macOS.
 * @returns True if the platform is macOS.
 */
const isMac = (): boolean => {
  return typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
};

/**
 * Composable for managing keyboard shortcuts throughout the application.
 */
export function useKeyboardShortcuts() {
  const showHelpDialog = useState<boolean>("keyboard-shortcuts-help", () => false);
  const keys = useMagicKeys();

  /**
   * Registers a keyboard shortcut.
   * @param shortcut - The shortcut configuration.
   */
  const registerShortcut = (shortcut: KeyboardShortcut) => {
    const { keys: keyCombo, macKeys, action } = shortcut;
    const actualKeys = isMac() && macKeys ? macKeys : keyCombo;

    // Parse the key combination
    const parts = actualKeys.toLowerCase().split("+");
    const hasCtrl = parts.includes("ctrl") || parts.includes("cmd");
    const hasShift = parts.includes("shift");
    const hasAlt = parts.includes("alt");
    const mainKey = parts[parts.length - 1];

    // Create a computed that checks if the combination is pressed
    const isPressed = computed(() => {
      if (!mainKey) return false;

      const keyPressed = keys[mainKey]?.value ?? false;
      const ctrlPressed = keys.ctrl?.value || keys.meta?.value || false;
      const shiftPressed = keys.shift?.value || false;
      const altPressed = keys.alt?.value || false;

      // Check if modifiers match
      if (hasCtrl && !ctrlPressed) return false;
      if (!hasCtrl && ctrlPressed) return false;
      if (hasShift && !shiftPressed) return false;
      if (!hasShift && shiftPressed) return false;
      if (hasAlt && !altPressed) return false;
      if (!hasAlt && altPressed) return false;

      return keyPressed;
    });

    // Execute action when the combination is pressed
    whenever(isPressed, () => {
      // Don't trigger shortcuts when typing
      if (isTyping()) return;

      action();
    });
  };

  /**
   * Registers a simple key stroke without modifiers.
   * @param key - The key to listen for.
   * @param action - The action to execute.
   * @param options - Additional options.
   */
  const registerKeyStroke = (
    key: string,
    action: () => void,
    options?: { preventDefault?: boolean },
  ) => {
    onKeyStroke(key, (e) => {
      // Don't trigger shortcuts when typing
      if (isTyping()) return;

      if (options?.preventDefault) {
        e.preventDefault();
      }

      action();
    });
  };

  /**
   * Opens the keyboard shortcuts help dialog.
   */
  const openHelpDialog = () => {
    showHelpDialog.value = true;
  };

  /**
   * Closes the keyboard shortcuts help dialog.
   */
  const closeHelpDialog = () => {
    showHelpDialog.value = false;
  };

  /**
   * Toggles the keyboard shortcuts help dialog.
   */
  const toggleHelpDialog = () => {
    showHelpDialog.value = !showHelpDialog.value;
  };

  return {
    showHelpDialog,
    registerShortcut,
    registerKeyStroke,
    openHelpDialog,
    closeHelpDialog,
    toggleHelpDialog,
    isMac: isMac(),
  };
}
