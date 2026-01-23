import { describe, it, expect } from "vitest";
import {
  encodeGradientConfig,
  decodeGradientConfig,
} from "../../app/utils/shareGradient";
import { parseColor } from "../../app/components/ui/color-picker/color.utils";
import type { MeshConfig } from "../../app/composables/useMeshGradient";

describe("shareGradient", () => {
  const mockConfig: MeshConfig = {
    baseColor: parseColor("#020617"),
    layers: [
      {
        id: 1,
        color: parseColor("#ff0000"),
        x: [50],
        y: [50],
        blur: [100],
        opacity: [80],
        size: 70,
        borderRadius: "50%",
        blendMode: "normal",
      },
    ],
  };

  it("should encode gradient config to a string", () => {
    const encoded = encodeGradientConfig(mockConfig);
    expect(encoded).toBeTypeOf("string");
    expect(encoded.length).toBeGreaterThan(0);
  });

  it("should decode gradient config from encoded string", () => {
    const encoded = encodeGradientConfig(mockConfig);
    const decoded = decodeGradientConfig(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.baseColor).toBeDefined();
    expect(decoded?.layers).toHaveLength(1);
    expect(decoded?.layers[0]?.id).toBe(1);
  });

  it("should handle round-trip encoding and decoding", () => {
    const encoded = encodeGradientConfig(mockConfig);
    const decoded = decodeGradientConfig(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.baseColor.hex).toBe("#020617");
    expect(decoded?.layers[0]?.x[0]).toBe(50);
    expect(decoded?.layers[0]?.y[0]).toBe(50);
    expect(decoded?.layers[0]?.size).toBe(70);
    expect(decoded?.layers[0]?.color.hex).toBe("#ff0000");
    expect(decoded?.layers[0]?.blendMode).toBe("normal");
  });

  it("should return null for invalid encoded string", () => {
    const decoded = decodeGradientConfig("invalid-string");
    expect(decoded).toBeNull();
  });

  it("should return null for empty string", () => {
    const decoded = decodeGradientConfig("");
    expect(decoded).toBeNull();
  });
});
