import { parseColor } from "~/components/ui/color-picker/color.utils";
import type { ColorValue } from "~/components/ui/color-picker/types";
import { themes } from "~/utils/themes";

const BASE_COLOR = "#020617";
const DEFAULT_LAYER_COUNT = 4;

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

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateOrganicRadius = () => {
  const r = () => Math.floor(Math.random() * 50 + 30) + "%";
  return `${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}`;
};

// Generate unique layer IDs using timestamp + random for uniqueness
const generateLayerId = () =>
  Date.now() * 1000 + Math.floor(Math.random() * 1000);

const makeLayer = (color?: ColorValue, baseX?: number, baseY?: number): Layer => {
  // Simple random positioning like the old demo (0-80 range)
  // If baseX/baseY provided, use them with slight variation (±5)
  const x = baseX !== undefined 
    ? Math.max(0, Math.min(100, baseX + rand(-5, 5)))
    : Math.floor(Math.random() * 80);
  const y = baseY !== undefined
    ? Math.max(0, Math.min(100, baseY + rand(-5, 5)))
    : Math.floor(Math.random() * 80);

  return {
    id: generateLayerId(),
    color: color ?? parseColor(randomHex()),
    x: [x],
    y: [y],
    size: rand(50, 90), // Like old demo: Math.floor(Math.random() * 40 + 50)
    blur: [rand(80, 180)], // Like old demo: Math.floor(Math.random() * 100 + 80)
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
    config.value.layers.push(makeLayer(color));
  };

  const removeLayer = (index: number) => {
    config.value.layers.splice(index, 1);
  };

  const duplicateLayer = (index: number) => {
    const source = config.value.layers[index];
    if (!source) return;
    const dup = { ...source, id: generateLayerId() };
    config.value.layers.splice(index + 1, 0, dup);
  };

  const updateLayer = (index: number, layer: Layer) => {
    config.value.layers.splice(index, 1, layer);
  };

  const randomize = (minLayers = 3, maxLayers = 8, newBaseColor?: string) => {
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

  return {
    config,
    addLayer,
    removeLayer,
    duplicateLayer,
    updateLayer,
    randomize,
    applyTheme,
    reset,
  };
}
