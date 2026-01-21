import { toast } from "vue-sonner";
import { onKeyStroke } from "@vueuse/core";

/**
 * Sets up all keyboard shortcuts for the Mesh Magic application.
 * This composable should be called once in the app layout or main component.
 */
export function useAppKeyboardShortcuts() {
  const { registerKeyStroke, toggleHelpDialog } = useKeyboardShortcuts();
  const { config, addLayer, removeLayer, randomize, reset, showDots } = useMeshGradient();
  const { saveGradient, loadFromStorage } = useSavedGradients();

  // Load saved gradients on initialization
  loadFromStorage();

  /**
   * Registers all application keyboard shortcuts.
   */
  const setupShortcuts = () => {
    // Show keyboard shortcuts help (?)
    registerKeyStroke("?", () => {
      toggleHelpDialog();
    });

    // Save gradient (Ctrl+S / Cmd+S)
    onKeyStroke("s", (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        // Don't trigger when typing
        const activeElement = document.activeElement;
        if (activeElement && (
          activeElement.tagName.toLowerCase() === "input" ||
          activeElement.tagName.toLowerCase() === "textarea"
        )) {
          return;
        }
        
        saveGradient(config.value);
      }
    });

    // Randomize gradient (R) / Reset (Ctrl+R / Cmd+R)
    onKeyStroke("r", (e: KeyboardEvent) => {
      // Don't trigger when typing
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName.toLowerCase() === "input" ||
        activeElement.tagName.toLowerCase() === "textarea"
      )) {
        return;
      }
      
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
