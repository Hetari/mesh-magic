import { ref, nextTick } from "vue";
import { toast } from "vue-sonner";
import { watchPausable } from "@vueuse/core";
import { parseColor } from "~/components/ui/color-picker/color.utils";
import type { ColorValue } from "~/components/ui/color-picker/types";
import { themes } from "~/utils/themes";
import { copyTextClient } from "~/utils/copy";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { useHistory } from "./useHistory";
import { deepClone } from "~/utils/clone";

const BASE_COLOR = "#020617";
const DEFAULT_LAYER_COUNT = 4;

/**
 * The maximum number of layers allowed in the mesh gradient.
 */
export const maxLayerCount = ref(8);

/**
 * Represents a single layer in the mesh gradient.
 */
export type Layer = {
  /** Unique identifier for the layer. */
  id: number;
  /** Color value of the layer. */
  color: ColorValue;
  /** X-coordinate position (percentage). */
  x: number[];
  /** Y-coordinate position (percentage). */
  y: number[];
  /** Blur amount (pixels). */
  blur: number[];
  /** Opacity value (percentage). */
  opacity: number[];
  /** Size of the layer (pixels). */
  size: number;
  /** CSS border-radius value. */
  borderRadius: string;
};

/**
 * Configuration for the entire mesh gradient.
 */
export type MeshConfig = {
  /** The base background color. */
  baseColor: ColorValue;
  /** Collection of layers. */
  layers: Layer[];
};

/**
 * Generates a random hexadecimal color string.
 * @returns A random hex color string (e.g., "#3a7f21").
 */
export const randomHex = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

/**
 * Generates a random integer between min and max (inclusive).
 * @param min - Minimum value.
 * @param max - Maximum value.
 * @returns A random integer.
 */
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates an organic-looking CSS border-radius string.
 * @returns A string representing a complex border-radius.
 */
const generateOrganicRadius = () => {
  const r = () => Math.floor(Math.random() * 50 + 30) + "%";
  return `${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}`;
};

/**
 * Generates a unique layer ID using a timestamp and random component.
 * @returns A unique numeric ID.
 */
const generateLayerId = () =>
  Date.now() * 1000 + Math.floor(Math.random() * 1000);

/**
 * Creates a new Layer object with default or specified properties.
 * @param color - Optional initial color.
 * @param baseX - Optional base X position.
 * @param baseY - Optional base Y position.
 * @returns A new Layer instance.
 */
const makeLayer = (
  color?: ColorValue,
  baseX?: number,
  baseY?: number,
): Layer => {
  const x =
    baseX !== undefined
      ? Math.max(0, Math.min(100, baseX + randomNumber(-5, 5)))
      : Math.floor(Math.random() * 80);
  const y =
    baseY !== undefined
      ? Math.max(0, Math.min(100, baseY + randomNumber(-5, 5)))
      : Math.floor(Math.random() * 80);

  return {
    id: generateLayerId(),
    color: color ?? parseColor(randomHex()),
    x: [x],
    y: [y],
    opacity: [randomNumber(50, 100)],
    size: randomNumber(50, 90),
    blur: [randomNumber(80, 180)],
    borderRadius: generateOrganicRadius(),
  };
};

/**
 * Generates the initial collection of layers based on a theme.
 * @returns An array of Layer objects.
 */
const generateInitialLayers = (): Layer[] => {
  const baseColors = themes.cosmic ?? [];
  const layers: Layer[] = [];

  const baseX = Math.floor(Math.random() * 80);
  const baseY = Math.floor(Math.random() * 80);

  for (let i = 0; i < DEFAULT_LAYER_COUNT; i++) {
    const color = baseColors[i] ?? parseColor(randomHex());
    layers.push(makeLayer(color, baseX, baseY));
  }

  return layers;
};

/**
 * Composable that manages the state and operations for the mesh gradient.
 */
export function useMeshGradient() {
  const config = useState<MeshConfig>("mesh-gradient-config", () => ({
    baseColor: parseColor(BASE_COLOR),
    layers: generateInitialLayers(),
  }));
  const showDots = useState("show-dots", () => true);

  // Initialize history tracking
  const history = useHistory(config.value, { limit: 30, deep: true });

  // Debounce timer for history recording
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Cancels any pending debounced history recording.
   */
  const cancelDebouncedHistory = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  };

  /**
   * Records the current state to history (debounced for slider changes).
   */
  const debouncedRecordHistory = () => {
    cancelDebouncedHistory();
    debounceTimer = setTimeout(() => {
      history.push(config.value);
      debounceTimer = null;
    }, 300);
  };

  /**
   * Immediate history recording (for actions like add/remove layer).
   */
  const recordHistory = () => {
    // Cancel any pending debounced recording
    cancelDebouncedHistory();
    
    // Pause watcher temporarily to avoid double recording
    pauseHistory();
    
    // Push immediately for discrete actions
    history.push(config.value);
    
    // Resume watcher on next tick
    nextTick(() => {
      resumeHistory();
    });
  };

  // Watch for config changes and record to history (for slider/color picker changes)
  // Using watchPausable so we can pause during undo/redo operations
  const { pause: pauseHistory, resume: resumeHistory } = watchPausable(
    config,
    () => {
      debouncedRecordHistory();
    },
    { deep: true, flush: 'sync' }
  );

  /**
   * Adds a new layer to the gradient.
   * @param color - Optional initial color for the new layer.
   */
  const addLayer = (color?: ColorValue) => {
    if (config.value.layers.length === maxLayerCount.value) return;
    config.value.layers.push(makeLayer(color));
    recordHistory();
  };

  /**
   * Removes a layer at the specified index.
   * @param index - The index of the layer to remove.
   */
  const removeLayer = (index: number) => {
    config.value.layers.splice(index, 1);
    recordHistory();
  };

  /**
   * Duplicates an existing layer.
   * @param index - The index of the layer to duplicate.
   */
  const duplicateLayer = (index: number) => {
    if (config.value.layers.length === maxLayerCount.value) return;

    const source = config.value.layers[index];
    if (!source) return;
    
    // Deep clone to avoid shared references for nested arrays
    const dup = { ...deepClone(source), id: generateLayerId() };
    config.value.layers.splice(index + 1, 0, dup);
    recordHistory();
  };

  /**
   * Updates an existing layer.
   * @param index - The index of the layer to update.
   * @param layer - The new layer data.
   */
  const updateLayer = (index: number, layer: Layer) => {
    config.value.layers.splice(index, 1, layer);
    recordHistory();
  };

  /**
   * Randomizes the gradient configuration.
   * @param minLayers - Minimum number of layers to generate.
   * @param maxLayers - Maximum number of layers to generate.
   * @param newBaseColor - Optional new background color.
   */
  const randomize = (
    minLayers = 1,
    maxLayers = maxLayerCount.value,
    newBaseColor?: string,
  ) => {
    // Pause watcher to avoid double recording
    pauseHistory();
    
    if (newBaseColor) {
      config.value.baseColor = parseColor(newBaseColor);
    }

    const count = Math.floor(
      Math.random() * (maxLayers - minLayers + 1) + minLayers,
    );

    const newLayers: Layer[] = [];
    for (let i = 0; i < count; i++) {
      newLayers.push(makeLayer());
    }
    config.value.layers = newLayers;
    
    // Record and resume
    history.push(config.value);
    nextTick(() => {
      resumeHistory();
    });
  };

  /**
   * Applies a predefined theme to the gradient.
   * @param name - The name of the theme to apply.
   */
  const applyTheme = (name: keyof typeof themes) => {
    const t = themes[name];
    if (!t) return;
    
    // Pause watcher to avoid double recording
    pauseHistory();
    
    config.value.layers = t.map((c) => makeLayer(c));
    
    // Record and resume
    history.push(config.value);
    
    nextTick(() => {
      resumeHistory();
    });
  };

  /**
   * Resets the gradient to its default state.
   */
  const reset = () => {
    // Pause watcher to avoid double recording
    pauseHistory();
    
    config.value.baseColor = parseColor(BASE_COLOR);
    config.value.layers = generateInitialLayers();
    
    // Record and resume
    history.push(config.value);
    nextTick(() => {
      resumeHistory();
    });
  };

  /**
   * Copies the HTML snippet of a single layer to the clipboard.
   * @param layer - The layer to copy.
   */
  const copyTextLayer = async (layer: Layer) => {
    const x = layer.x?.[0] ?? 0;
    const y = layer.y?.[0] ?? 0;
    const size = layer.size ?? 64;
    const colorHex = (layer.color?.hex ?? "#000000").toLowerCase();
    const brRaw = layer.borderRadius ?? "50%";
    const brForClass = brRaw.replace(/\s+/g, "_");

    const classes = [
      "absolute",
      `left-[${x}%]`,
      `top-[${y}%]`,
      `w-[${size}px]`,
      `h-[${size}px]`,
      `bg-[${colorHex}]`,
      `rounded-[${brForClass}]`,
    ];

    const classString = classes.join(" ");
    const htmlSnippet = `<div class="${classString}"></div>`;

    await copyTextClient(htmlSnippet);
    toast("Copied", {
      description: "Layer HTML copied to clipboard",
      richColors: true,
    });
  };

  /**
   * Copies the full mesh gradient HTML and CSS to the clipboard.
   */
  const copyMeshCSS = async () => {
    const element = document.getElementById("mesh-gradient");
    if (!element) return;

    const baseUrl = window.location.origin;
    const noiseSvgUrl = `${baseUrl}/noise.svg`;

    element.classList.remove("size-full");
    element.classList.add("w-screen");
    element.classList.add("h-screen");
    element.classList.add("overflow-clip");
    let html = element.outerHTML;

    html = html.replace(
      /url\(['"]?\/noise\.svg['"]?\)/g,
      `url('${noiseSvgUrl}')`,
    );

    await copyTextClient(html);
    toast("Copied", {
      description: "Mesh CSS copied to clipboard",
      richColors: true,
    });
  };

  /**
   * Downloads the mesh gradient as an image file.
   * @param options - Configuration for the download (scale, aspect ratio, format).
   * @param onFinish - Optional callback when the download is complete.
   */
  const downloadMeshImage = async (
    {
      scale = 1,
      aspectRatio = "current",
      to,
    }: {
      scale?: number;
      aspectRatio?: "current" | "landscape" | "portrait" | "phone" | "square";
      to: "png" | "jpeg" | "svg";
    },
    onFinish?: VoidFunction,
  ) => {
    const element = document.getElementById("mesh-gradient");
    if (!element) return;

    await nextTick();

    const rect = element.getBoundingClientRect();
    const width = rect.width;
    let height = rect.height;

    switch (aspectRatio) {
      case "landscape":
        height = width * (9 / 16);
        break;
      case "portrait":
        height = width * (16 / 9);
        break;
      case "phone":
        height = width * (19.5 / 9);
        break;
      case "square":
        height = width;
        break;
      case "current":
      default:
        break;
    }

    const baseOptions = {
      width,
      height,
      pixelRatio: scale,
      cacheBust: true,
      useCORS: true,
      allowTaint: true,
    };

    const rasterOptions = {
      ...baseOptions,
      canvasWidth: width * scale,
      canvasHeight: height * scale,
    };

    let dataUrl: string;

    switch (to) {
      case "png":
        dataUrl = await toPng(element, rasterOptions);
        break;
      case "jpeg":
        dataUrl = await toJpeg(element, { ...rasterOptions, quality: 0.95 });
        break;
      case "svg":
        dataUrl = await toSvg(element, baseOptions);
        break;
      default:
        return;
    }

    const link = document.createElement("a");
    link.download = `mesh-gradient.${to}`;
    link.href = dataUrl;
    link.click();

    onFinish?.();

    toast("Downloaded", {
      description: `Mesh gradient downloaded as ${to.toUpperCase()} at ${scale}x resolution`,
      richColors: true,
    });
  };

  /**
   * Undoes the last change.
   */
  const undo = () => {
    if (!history.canUndo.value) return;
    
    // Cancel any pending debounced recording
    cancelDebouncedHistory();
    
    // Pause history recording
    pauseHistory();
    
    // Perform undo
    history.undo();
    config.value = history.present.value;
    
    // Resume history recording after a short delay
    nextTick(() => {
      resumeHistory();
    });
    
    toast.success("Undo", {
      description: "Reverted to previous state",
    });
  };

  /**
   * Redoes the last undone change.
   */
  const redo = () => {
    if (!history.canRedo.value) return;
    
    // Cancel any pending debounced recording
    cancelDebouncedHistory();
    
    // Pause history recording
    pauseHistory();
    
    // Perform redo
    history.redo();
    config.value = history.present.value;
    
    // Resume history recording after a short delay
    nextTick(() => {
      resumeHistory();
    });
    
    toast.success("Redo", {
      description: "Restored next state",
    });
  };

  return {
    config,
    showDots,
    addLayer,
    removeLayer,
    duplicateLayer,
    updateLayer,
    randomize,
    applyTheme,
    reset,
    copyTextLayer,
    copyMeshCSS,
    downloadMeshImage,
    undo,
    redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}
