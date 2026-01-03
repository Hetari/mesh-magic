import { describe, it, expect } from "vitest";
import {
  Color,
  isHexColorValid,
} from "../../app/components/ui/color-picker/color.utils";

describe("Color Utilities", () => {
  describe("isHexColorValid", () => {
    it("should validate 6-digit hex colors", () => {
      expect(isHexColorValid("#ffffff")).toBe(true);
      expect(isHexColorValid("#FF0000")).toBe(true);
      expect(isHexColorValid("#123456")).toBe(true);
    });

    it("should validate 3-digit hex colors", () => {
      expect(isHexColorValid("#123")).toBe(true);
      expect(isHexColorValid("#fff")).toBe(true);
      expect(isHexColorValid("#f00")).toBe(true);
    });

    it("should validate 4-digit hex colors", () => {
      expect(isHexColorValid("#1234")).toBe(true);
      expect(isHexColorValid("#aaad")).toBe(true);
    });

    it("should reject invalid hex colors", () => {
      expect(isHexColorValid("ffffff")).toBe(false); // missing #
      expect(isHexColorValid("#gggggg")).toBe(false); // invalid chars
      expect(isHexColorValid("#12345")).toBe(false); // wrong length
      expect(isHexColorValid("#1234567")).toBe(false); // wrong length
      expect(isHexColorValid("Valid color")).toBe(false);
      expect(isHexColorValid("#Valid color")).toBe(false);
      expect(isHexColorValid("#1")).toBe(false);
      expect(isHexColorValid("#12")).toBe(false);
      expect(isHexColorValid("#12345")).toBe(false);
      expect(isHexColorValid("#1234567")).toBe(false);
    });
  });

  describe("Color Class", () => {
    it("should initialize from hex", () => {
      const color = new Color("#ff0000");
      expect(color.rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(color.hex).toBe("#ff0000");
    });

    it("should initialize from RGB", () => {
      const rgb = { r: 0, g: 255, b: 0, a: 1 };
      const color = new Color(rgb);
      expect(color.hex).toBe("#00ff00");
      expect(color.rgb).toEqual(rgb);
    });

    it("should initialize from HSV", () => {
      const hsv = { h: 240, s: 1, v: 1, a: 1 };
      const color = new Color(hsv);
      expect(color.hex).toBe("#0000ff");
      expect(color.hsv).toEqual(hsv);
    });

    it("should handle transparency in hex", () => {
      const color = new Color("#ffffff00");
      expect(color.rgb.a).toBe(0);
      expect(color.hex).toBe("#00000000");
    });

    it("should handle 3-digit hex", () => {
      const color = new Color("#fff");
      expect(color.rgb).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    });

    it("should initialize from OKLCH", () => {
      const oklch = { l: 1, c: 0, h: 0, a: 1 }; // White
      const color = new Color(oklch);
      expect(color.rgb).toEqual({ r: 255, g: 255, b: 255, a: 1 });
      expect(color.oklch.l).toBeCloseTo(1, 4);
    });

    it("should be reversible (RGB -> HSV -> RGB)", () => {
      const originalRgb = { r: 100, g: 150, b: 200, a: 1 };
      const color = new Color(originalRgb);
      const hsv = color.hsv;
      const secondColor = new Color(hsv);
      expect(secondColor.rgb).toEqual(originalRgb);
    });

    it("should be reversible (RGB -> OKLCH -> RGB)", () => {
      const originalRgb = { r: 200, g: 50, b: 100, a: 1 };
      const color = new Color(originalRgb);
      const oklch = color.oklch;
      const secondColor = new Color(oklch);
      expect(secondColor.rgb.r).toBeCloseTo(originalRgb.r, 0);
      expect(secondColor.rgb.g).toBeCloseTo(originalRgb.g, 0);
      expect(secondColor.rgb.b).toBeCloseTo(originalRgb.b, 0);
    });

    it("should handle simultaneous formats", () => {
      const color = new Color("#ffffff");
      expect(color.rgb).toBeDefined();
      expect(color.hsv).toBeDefined();
      expect(color.oklch).toBeDefined();
      expect(color.hex).toBe("#ffffff");
    });

    it("should return fallback for invalid color instead of throwing", () => {
      // @ts-expect-error - testing invalid input
      expect(() => new Color({ x: 1 })).toThrow();
    });

    it("should support static from method", () => {
      const color = Color.from("#000");
      expect(color.hex).toBe("#000000");
    });
  });
});
