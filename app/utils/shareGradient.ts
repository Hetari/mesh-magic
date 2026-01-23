import LZString from "lz-string";
import type { MeshConfig, BlendMode } from "~/composables/useMeshGradient";
import { parseColor } from "../components/ui/color-picker/color.utils";

/**
 * Simplified layer structure for encoding (only essential data).
 */
type EncodedLayer = {
  id: number;
  color: string;
  x: number[];
  y: number[];
  blur: number[];
  opacity: number[];
  size: number;
  borderRadius: string;
  blendMode: BlendMode;
};

/**
 * Simplified config structure for encoding.
 */
type EncodedConfig = {
  baseColor: string;
  layers: EncodedLayer[];
};

/**
 * Encodes a gradient configuration into a URL-safe string.
 * @param config - The mesh gradient configuration to encode.
 * @returns A compressed, Base64-encoded string suitable for URL parameters.
 */
export function encodeGradientConfig(config: MeshConfig): string {
  const simplified: EncodedConfig = {
    baseColor: config.baseColor.hex,
    layers: config.layers.map((layer) => ({
      id: layer.id,
      color: layer.color.hex,
      x: layer.x,
      y: layer.y,
      blur: layer.blur,
      opacity: layer.opacity,
      size: layer.size,
      borderRadius: layer.borderRadius,
      blendMode: layer.blendMode,
    })),
  };

  const json = JSON.stringify(simplified);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

/**
 * Decodes a URL-safe string back into a gradient configuration.
 * @param encoded - The compressed, Base64-encoded string from URL.
 * @returns The decoded mesh gradient configuration, or null if decoding fails.
 */
export function decodeGradientConfig(encoded: string): MeshConfig | null {
  try {
    if (!encoded || typeof encoded !== "string") {
      console.error("Invalid encoded string: must be a non-empty string");
      return null;
    }

    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) {
      console.error("Failed to decompress gradient configuration");
      return null;
    }

    const simplified = JSON.parse(decompressed) as EncodedConfig;

    // Validate the decoded structure
    if (!simplified.baseColor || !Array.isArray(simplified.layers)) {
      console.error("Invalid decoded structure: missing baseColor or layers");
      return null;
    }

    // Validate each layer has required properties
    for (const layer of simplified.layers) {
      if (
        !layer ||
        typeof layer.id !== "number" ||
        typeof layer.color !== "string" ||
        !Array.isArray(layer.x) ||
        !Array.isArray(layer.y) ||
        !Array.isArray(layer.blur) ||
        !Array.isArray(layer.opacity) ||
        typeof layer.size !== "number" ||
        typeof layer.borderRadius !== "string"
      ) {
        console.error("Invalid layer structure in decoded config");
        return null;
      }
    }

    // Convert back to full structure with ColorValue objects
    const config: MeshConfig = {
      baseColor: parseColor(simplified.baseColor),
      layers: simplified.layers.map((layer) => ({
        id: layer.id,
        color: parseColor(layer.color),
        x: layer.x,
        y: layer.y,
        blur: layer.blur,
        opacity: layer.opacity,
        size: layer.size,
        borderRadius: layer.borderRadius,
        blendMode: layer.blendMode,
      })),
    };

    return config;
  } catch (error) {
    console.error("Failed to decode gradient config:", error);
    return null;
  }
}
