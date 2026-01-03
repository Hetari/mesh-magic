import type {
  ColorValue,
  HexColor,
  HsvColor,
  OklchColor,
  RgbColor,
} from "./types";

/**
 * Validates whether a given string is a standard CSS hexadecimal color.
 */
export const isHexColorValid = (hex: HexColor): boolean => {
  const hexRegex =
    /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
};

/**
 * Resolves a CSS color name to its hexadecimal value using the browser's engine.
 */
const colorNameToHex = (colorName: string): HexColor | null => {
  if (typeof document === "undefined") return null;
  const ctx = document.createElement("canvas");
  const context = ctx.getContext("2d");
  if (!context) return null;
  context.fillStyle = colorName;
  const returnedColor = context.fillStyle;
  ctx.remove();
  return returnedColor;
};

/**
 * Helper: Converts sRGB (0-255) to Linear sRGB (0-1).
 */
const sRgbToLinear = (c: number): number => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

/**
 * Helper: Converts Linear sRGB (0-1) back to gamma-corrected sRGB (0-255).
 */
const linearToSRgb = (c: number): number => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
};

/**
 * The Solid Color Converter Class.
 * Handles all color formats (Hex, RGB, HSV, OKLCH) through a single interface.
 */
export class Color {
  private _rgb: RgbColor;

  constructor(color: HexColor | RgbColor | HsvColor | OklchColor) {
    const parsed = this.parseInput(color);
    if (!parsed) {
      throw new Error("Invalid color");
    }
    this._rgb = parsed;
  }

  /**
   * Static factory method to create a Color instance.
   */
  static from(color: HexColor | RgbColor | HsvColor | OklchColor): Color {
    return new Color(color);
  }

  private parseInput(
    color: HexColor | RgbColor | HsvColor | OklchColor,
  ): RgbColor | null {
    if (typeof color === "string") {
      return this.hexToRgb(color);
    }
    if ("r" in color && "g" in color && "b" in color) {
      return color as RgbColor;
    }
    if ("h" in color && "s" in color && "v" in color) {
      return this.hsvToRgb(color as HsvColor);
    }
    if ("l" in color && "c" in color && "h" in color) {
      return this.oklchToRgb(color as OklchColor);
    }
    return null;
  }

  // --- Getters ---
  get rgb(): RgbColor {
    return { ...this._rgb };
  }
  get hex(): HexColor {
    const { r, g, b, a } = this._rgb;
    if (a === 0) return "#00000000";
    const redHex = r.toString(16).padStart(2, "0");
    const greenHex = g.toString(16).padStart(2, "0");
    const blueHex = b.toString(16).padStart(2, "0");
    return `#${redHex}${greenHex}${blueHex}`;
  }
  get hsv(): HsvColor {
    const { r, g, b, a } = this._rgb;
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === rNorm) {
        h = ((gNorm - bNorm) / delta) % 6;
      } else if (max === gNorm) {
        h = (bNorm - rNorm) / delta + 2;
      } else {
        h = (rNorm - gNorm) / delta + 4;
      }
      h *= 60;
      if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return { h, s, v, a };
  }
  get oklch(): OklchColor {
    const r = sRgbToLinear(this._rgb.r);
    const g = sRgbToLinear(this._rgb.g);
    const b = sRgbToLinear(this._rgb.b);

    const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const l_cube = Math.cbrt(l_);
    const m_cube = Math.cbrt(m_);
    const s_cube = Math.cbrt(s_);

    const L =
      0.2104542553 * l_cube + 0.793617785 * m_cube - 0.0040720401 * s_cube;
    const a =
      1.9779984951 * l_cube - 2.428592205 * m_cube + 0.4505937099 * s_cube;
    const b_ =
      0.0259040371 * l_cube + 0.7827717662 * m_cube - 0.808675766 * s_cube;

    const C = Math.sqrt(a * a + b_ * b_);
    let h = Math.atan2(b_, a) * (180 / Math.PI);
    if (h < 0) h += 360;

    return { l: L, c: C, h, a: this._rgb.a };
  }

  // --- Internal Converters ---

  private hexToRgb(hex: HexColor): RgbColor | null {
    if (!isHexColorValid(hex)) {
      const colorHex = colorNameToHex(hex);
      if (colorHex && isHexColorValid(colorHex)) {
        return this.hexToRgb(colorHex);
      }
      return null;
    }

    const rgb: RgbColor = { r: 0, g: 0, b: 0, a: 1 };

    if (hex[0] === "#") {
      if (hex.length === 4 || hex.length === 5) {
        const r = hex[1]!;
        const g = hex[2]!;
        const b = hex[3]!;
        const a = hex[4];
        rgb.r = parseInt(r + r, 16);
        rgb.g = parseInt(g + g, 16);
        rgb.b = parseInt(b + b, 16);
        if (a) rgb.a = parseInt(a + a, 16) / 255;
        return rgb;
      }

      if (hex.length === 7 || hex.length === 9) {
        rgb.r = parseInt(hex.substring(1, 3), 16);
        rgb.g = parseInt(hex.substring(3, 5), 16);
        rgb.b = parseInt(hex.substring(5, 7), 16);
        if (hex.length === 9) rgb.a = parseInt(hex.substring(7, 9), 16) / 255;
        return rgb;
      }
    }

    return null;
  }

  private hsvToRgb(hsv: HsvColor): RgbColor {
    const { h, s, v, a } = hsv;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let rP = 0,
      gP = 0,
      bP = 0;
    if (h >= 0 && h < 60) [rP, gP, bP] = [c, x, 0];
    else if (h >= 60 && h < 120) [rP, gP, bP] = [x, c, 0];
    else if (h >= 120 && h < 180) [rP, gP, bP] = [0, c, x];
    else if (h >= 180 && h < 240) [rP, gP, bP] = [0, x, c];
    else if (h >= 240 && h < 300) [rP, gP, bP] = [x, 0, c];
    else if (h >= 300 && h < 360) [rP, gP, bP] = [c, 0, x];

    return {
      r: Math.round((rP + m) * 255),
      g: Math.round((gP + m) * 255),
      b: Math.round((bP + m) * 255),
      a,
    };
  }

  private oklchToRgb(oklch: OklchColor): RgbColor {
    const { l: L, c: C, h: H, a } = oklch;
    const hRad = H * (Math.PI / 180);
    const a_ = Math.cos(hRad) * C;
    const b_ = Math.sin(hRad) * C;

    const l_cube = L + 0.3963377774 * a_ + 0.2158037573 * b_;
    const m_cube = L - 0.1055613458 * a_ - 0.0638541728 * b_;
    const s_cube = L - 0.0894841775 * a_ - 1.291485548 * b_;

    const l_ = l_cube * l_cube * l_cube;
    const m_ = m_cube * m_cube * m_cube;
    const s_ = s_cube * s_cube * s_cube;

    const r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
    const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
    const b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

    return {
      r: linearToSRgb(r),
      g: linearToSRgb(g),
      b: linearToSRgb(b),
      a,
    };
  }
}

/**
 * Legacy support / Convenient short-hands
 */
export const parseColor = (
  color: HexColor | HsvColor | RgbColor | OklchColor,
): ColorValue | null => {
  try {
    const c = new Color(color);
    return {
      hex: c.hex,
      rgb: c.rgb,
      hsv: c.hsv,
      oklch: c.oklch,
    };
  } catch {
    return null;
  }
};
