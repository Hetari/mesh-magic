import { ref, nextTick } from "vue";
import { toast } from "vue-sonner";
import { parseColor } from "~/components/ui/color-picker/color.utils";
import type { ColorValue } from "~/components/ui/color-picker/types";
import { themes } from "~/utils/themes";
import { copyTextClient } from "~/utils/copy";
import { toPng, toJpeg, toSvg } from "html-to-image";

const BASE_COLOR = "#020617";
const DEFAULT_LAYER_COUNT = 4;
export const maxLayerCount = ref(8);

/* Types */
export type Layer = {
  id: number;
  color: ColorValue;
  x: number[];
  y: number[];
  blur: number[];
  size: number;
  borderRadius: string;
};

export type MeshConfig = {
  baseColor: ColorValue;
  layers: Layer[];
};

/* Helpers */
export const randomHex = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateOrganicRadius = () => {
  const r = () => Math.floor(Math.random() * 50 + 30) + "%";
  return `${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}`;
};

// Generate unique layer IDs using timestamp + random for uniqueness
const generateLayerId = () =>
  Date.now() * 1000 + Math.floor(Math.random() * 1000);

const makeLayer = (
  color?: ColorValue,
  baseX?: number,
  baseY?: number,
): Layer => {
  // Simple random positioning like the old demo (0-80 range)
  // If baseX/baseY provided, use them with slight variation (±5)
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
    size: randomNumber(50, 90), // Like old demo: Math.floor(Math.random() * 40 + 50)
    blur: [randomNumber(80, 180)], // Like old demo: Math.floor(Math.random() * 100 + 80)
    borderRadius: generateOrganicRadius(),
  };
};

// Generate 4 random layers for initial state
// All layers positioned in the same area (same base position with slight variations)
const generateInitialLayers = (): Layer[] => {
  const baseColors = themes.cosmic ?? [];
  const layers: Layer[] = [];

  // Choose one random base position for all layers (like the old demo: 0-80 range)
  const baseX = Math.floor(Math.random() * 80);
  const baseY = Math.floor(Math.random() * 80);

  for (let i = 0; i < DEFAULT_LAYER_COUNT; i++) {
    const color = baseColors[i] ?? parseColor(randomHex());
    layers.push(makeLayer(color, baseX, baseY));
  }

  return layers;
};

export function useMeshGradient() {
  // Use useState for SSR-safe state - ensures same state on server and client
  // The initializer runs only once (on server or first client render)
  const config = useState<MeshConfig>("mesh-gradient-config", () => ({
    baseColor: parseColor(BASE_COLOR),
    layers: generateInitialLayers(),
  }));

  const addLayer = (color?: ColorValue) => {
    if (config.value.layers.length === maxLayerCount.value) return;
    config.value.layers.push(makeLayer(color));
  };

  const removeLayer = (index: number) => {
    config.value.layers.splice(index, 1);
  };

  const duplicateLayer = (index: number) => {
    if (config.value.layers.length === maxLayerCount.value) return;

    const source = config.value.layers[index];
    if (!source) return;
    const dup = { ...source, id: generateLayerId() };
    config.value.layers.splice(index + 1, 0, dup);
  };

  const updateLayer = (index: number, layer: Layer) => {
    config.value.layers.splice(index, 1, layer);
  };

  const randomize = (
    minLayers = 1,
    maxLayers = maxLayerCount.value,
    newBaseColor?: string,
  ) => {
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
  };

  const applyTheme = (name: keyof typeof themes) => {
    const t = themes[name];
    if (!t) return;
    config.value.layers = t.map((c) => makeLayer(c));
  };

  const reset = (defaultBase = BASE_COLOR) => {
    config.value.baseColor = parseColor(defaultBase);
    config.value.layers = generateInitialLayers();
  };

  const copyTextLayer = async (layer: Layer) => {
    const x = layer.x?.[0] ?? 0;
    const y = layer.y?.[0] ?? 0;
    const size = layer.size ?? 64;
    const colorHex = (layer.color?.hex ?? "#000000").toLowerCase();
    // Tailwind arbitrary brackets can't contain spaces in the class name, so replace spaces w/ underscores
    const brRaw = layer.borderRadius ?? "50%";
    const brForClass = brRaw.replace(/\s+/g, "_");

    // Build classes
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

  const copyMeshCSS = async () => {
    const element = document.getElementById("mesh-gradient");
    if (!element) return;

    // Get the current origin/base URL for the noise.svg
    const baseUrl = window.location.origin;
    const noiseSvgUrl = `${baseUrl}/noise.svg`;

    // Get the HTML directly from the element
    element.classList.remove("size-full");
    element.classList.add("w-screen");
    element.classList.add("h-screen");
    element.classList.add("overflow-clip");
    let html = element.outerHTML;

    // Replace the relative noise.svg path with the full URL
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

    // Wait for next tick to ensure element is fully rendered
    await nextTick();

    // Get the element's actual displayed dimensions
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    let height = rect.height;

    // Adjust dimensions based on aspect ratio
    switch (aspectRatio) {
      case "landscape": // 16:9
        height = width * (9 / 16);
        break;
      case "portrait": // 9:16
        height = width * (16 / 9);
        break;
      case "phone": // 9:19.5 (iPhone style)
        height = width * (19.5 / 9);
        break;
      case "square": // 1:1
        height = width;
        break;
      case "current":
      default:
        // Keep current dimensions
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

  return {
    config,
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
  };
}
