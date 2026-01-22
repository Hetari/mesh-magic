import { toast } from "vue-sonner";
import { onKeyStroke } from "@vueuse/core";

/**
 * Sets up all keyboard shortcuts for the Mesh Magic application.
 * This composable should be called once in the app layout or main component.
 */
export function useAppKeyboardShortcuts() {
  const { registerKeyStroke, toggleHelpDialog } = useKeyboardShortcuts();
  const { config, addLayer, removeLayer, randomize, reset, showDots, undo, redo, canUndo, canRedo } = useMeshGradient();
  const { saveGradient, loadFromStorage } = useSavedGradients();

  // Load saved gradients on initialization
  loadFromStorage();

  /**
   * Registers all application keyboard shortcuts.
   */
  const setupShortcuts = () => {
    /**
     * Checks if the user is currently typing in an input field.
     */
    const isTypingInInput = (): boolean => {
      const activeElement = document.activeElement;
      if (!activeElement) return false;
      
      const tagName = activeElement.tagName.toLowerCase();
      return (
        tagName === "input" ||
        tagName === "textarea" ||
        activeElement.getAttribute("contenteditable") === "true"
      );
    };

    // Show keyboard shortcuts help (?)
    registerKeyStroke("?", () => {
      toggleHelpDialog();
    });

    // Undo (Ctrl+Z / Cmd+Z) and Redo (Ctrl+Shift+Z / Cmd+Shift+Z)
    onKeyStroke("z", (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Don't interfere with native undo/redo in inputs
        if (isTypingInInput()) return;
        
        e.preventDefault();
        
        // Check for Shift key for redo
        if (e.shiftKey) {
          if (canRedo.value) {
            redo();
          }
        } else {
          if (canUndo.value) {
            undo();
          }
        }
      }
    });

    // Redo (Ctrl+Y / Cmd+Y)
    onKeyStroke("y", (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Don't interfere with native redo in inputs
        if (isTypingInInput()) return;
        
        e.preventDefault();
        
        if (canRedo.value) {
          redo();
        }
      }
    });

    // Save gradient (Ctrl+S / Cmd+S)
    onKeyStroke("s", (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        if (isTypingInInput()) return;
        
        saveGradient(config.value);
      }
    });

    // Randomize gradient (R) / Reset (Ctrl+R / Cmd+R)
    onKeyStroke("r", (e: KeyboardEvent) => {
      if (isTypingInInput()) return;
      
      // Check if Ctrl/Cmd is pressed for reset
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        reset();
        toast.success("Gradient reset", {
          description: "Gradient has been reset to default",
        });
      } else {
        randomize();
        toast.success("Gradient randomized", {
          description: "A new random gradient has been generated",
        });
      }
    });

    // Add new layer (A)
    registerKeyStroke("a", () => {
      if (isTypingInInput()) return;
      
      if (config.value.layers.length >= 8) {
        toast.error("Maximum layers reached", {
          description: "You can have up to 8 layers",
        });
        return;
      }
      addLayer();
      toast.success("Layer added", {
        description: "A new layer has been added",
      });
    });

    // Delete last layer (Backspace / Delete)
    registerKeyStroke("Backspace", () => {
      if (isTypingInInput()) return;
      
      if (config.value.layers.length <= 1) {
        toast.error("Cannot delete layer", {
          description: "At least one layer is required",
        });
        return;
      }
      const lastIndex = config.value.layers.length - 1;
      removeLayer(lastIndex);
      toast.success("Layer deleted", {
        description: "The last layer has been removed",
      });
    });

    registerKeyStroke("Delete", () => {
      if (isTypingInInput()) return;
      
      if (config.value.layers.length <= 1) {
        toast.error("Cannot delete layer", {
          description: "At least one layer is required",
        });
        return;
      }
      const lastIndex = config.value.layers.length - 1;
      removeLayer(lastIndex);
      toast.success("Layer deleted", {
        description: "The last layer has been removed",
      });
    });

    // Toggle dots visibility (D)
    registerKeyStroke("d", () => {
      showDots.value = !showDots.value;
      toast.success(showDots.value ? "Dots shown" : "Dots hidden", {
        description: `Control points are now ${showDots.value ? "visible" : "hidden"}`,
      });
    });

    // Close dialogs (Escape) - handled by dialog components themselves
  };

  return {
    setupShortcuts,
  };
}
