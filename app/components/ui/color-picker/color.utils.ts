import type {
  ColorValue,
  HexColor,
  HsvColor,
  OklchColor,
  RgbColor,
} from "./types";

/**
 * Supported color format regexes
 */
export const HEX_REGEX =
  /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{3})$/;
export const RGB_REGEX =
  /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/;
export const HSV_REGEX =
  /^hsva?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+)\s*)?\)$/;
export const OKLCH_REGEX =
  /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)\s*)?\)$/;

/**
 * Validates whether a given string is a standard CSS hexadecimal color.
 */
export const isHexColorValid = (hex: HexColor): boolean => {
  return HEX_REGEX.test(hex);
};

/**
 * Validates whether a given string matches a specific color format.
 */
export const isValidColor = (
  value: string,
  format?: "hex" | "rgb" | "hsv" | "oklch" | "named-color",
): boolean => {
  const v = value.trim().toLowerCase();
  if (!format) {
    return (
      HEX_REGEX.test(v) ||
      RGB_REGEX.test(v) ||
      HSV_REGEX.test(v) ||
      OKLCH_REGEX.test(v) ||
      colorNameToHex(v) !== null
    );
  }
  switch (format) {
    case "hex":
      return HEX_REGEX.test(v);
    case "rgb":
      return RGB_REGEX.test(v);
    case "hsv":
      return HSV_REGEX.test(v);
    case "oklch":
      return OKLCH_REGEX.test(v);
    case "named-color":
      return colorNameToHex(v) !== null;
    default:
      return false;
  }
};

// Cache for color name to hex conversions
const colorNameCache = new Map<string, HexColor>();

/**
 * Resolves a CSS color name to its hexadecimal value using the browser's engine.
 * Uses caching to avoid repeated canvas operations.
 */
const colorNameToHex = (colorName: string): HexColor | null => {
  if (typeof document === "undefined") return null;
  
  const normalizedName = colorName.toLowerCase().trim();
  if (colorNameCache.has(normalizedName)) {
    return colorNameCache.get(normalizedName)!;
  }
  
  const ctx = document.createElement("canvas");
  const context = ctx.getContext("2d");
  if (!context) return null;
  context.fillStyle = normalizedName;
  const returnedColor = context.fillStyle as HexColor;
  ctx.remove();
  
  // Only cache if it's a valid hex color
  if (returnedColor && returnedColor.startsWith("#")) {
    colorNameCache.set(normalizedName, returnedColor);
  }
  
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

// --- Converters ---

export const hexToRgb = (hex: HexColor): RgbColor | null => {
  if (!isHexColorValid(hex)) {
    const colorHex = colorNameToHex(hex);
    if (colorHex && isHexColorValid(colorHex)) {
      return hexToRgb(colorHex);
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
};

export const hsvToRgb = (hsv: HsvColor): RgbColor => {
  let { h } = hsv;
  const { s, v, a } = hsv;
  h = h % 360;
  if (h < 0) h += 360;

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
};

export const oklchToRgb = (oklch: OklchColor): RgbColor => {
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
};

export const rgbToHex = (rgb: RgbColor): HexColor => {
  const { r, g, b, a } = rgb;
  const redHex = r.toString(16).padStart(2, "0");
  const greenHex = g.toString(16).padStart(2, "0");
  const blueHex = b.toString(16).padStart(2, "0");
  const alphaHex =
    a < 1
      ? Math.round(a * 255)
          .toString(16)
          .padStart(2, "0")
      : "";
  return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
};

export const rgbToHsv = (rgb: RgbColor): HsvColor => {
  const { r, g, b, a } = rgb;
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
};

export const rgbToOklch = (rgb: RgbColor): OklchColor => {
  const r = sRgbToLinear(rgb.r);
  const g = sRgbToLinear(rgb.g);
  const b = sRgbToLinear(rgb.b);

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

  return { l: L, c: C, h, a: rgb.a };
};

export const parseToRgb = (
  color: HexColor | RgbColor | HsvColor | OklchColor | ColorValue,
): RgbColor | null => {
  if (!color) return null;
  if (typeof color === "string") {
    const trimmed = color.trim().toLowerCase();

    // Try hex
    const hexResult = hexToRgb(trimmed);
    if (hexResult) return hexResult;

    // Try RGB(A) functional notation
    const rgbMatch = trimmed.match(RGB_REGEX);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]!, 10),
        g: parseInt(rgbMatch[2]!, 10),
        b: parseInt(rgbMatch[3]!, 10),
        a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
      };
    }

    // Try HSV(A) functional notation
    const hsvMatch = trimmed.match(HSV_REGEX);
    if (hsvMatch) {
      return hsvToRgb({
        h: parseFloat(hsvMatch[1]!),
        s: parseFloat(hsvMatch[2]!) / 100,
        v: parseFloat(hsvMatch[3]!) / 100,
        a: hsvMatch[4] ? parseFloat(hsvMatch[4]) : 1,
      });
    }

    // Try OKLCH notation
    const oklchMatch = trimmed.match(OKLCH_REGEX);
    if (oklchMatch) {
      return oklchToRgb({
        l: parseFloat(oklchMatch[1]!),
        c: parseFloat(oklchMatch[2]!),
        h: parseFloat(oklchMatch[3]!),
        a: oklchMatch[4] ? parseFloat(oklchMatch[4]) : 1,
      });
    }

    // If not a valid hex or notation, try resolving named color
    const colorToHex = colorNameToHex(trimmed);
    if (!colorToHex) return null;
    return hexToRgb(colorToHex);
  }

  if ("rgb" in color) {
    return color.rgb;
  }

  if ("r" in color && "g" in color && "b" in color) {
    return color as RgbColor;
  }
  if ("h" in color && "s" in color && "v" in color) {
    return hsvToRgb(color as HsvColor);
  }
  if ("l" in color && "c" in color && "h" in color) {
    return oklchToRgb(color as OklchColor);
  }

  return null;
};

// Cache for parsed colors (key is hex string)
const parsedColorCache = new Map<string, ColorValue>();

/**
 * Convenient short-hands
 * Uses caching to avoid recomputing color conversions
 */
export const parseColor = (
  color: HexColor | HsvColor | RgbColor | OklchColor | ColorValue,
): ColorValue => {
  // If already a ColorValue, return as-is
  if (typeof color === "object" && "hex" in color && "rgb" in color) {
    return color;
  }

  // Try to get cached value
  let cacheKey: string | null = null;
  if (typeof color === "string") {
    cacheKey = color.toLowerCase().trim();
    if (parsedColorCache.has(cacheKey)) {
      return parsedColorCache.get(cacheKey)!;
    }
  } else if ("r" in color && "g" in color && "b" in color) {
    // RGB object - use hex as cache key
    cacheKey = rgbToHex(color as RgbColor);
    if (parsedColorCache.has(cacheKey)) {
      return parsedColorCache.get(cacheKey)!;
    }
  }

  const rgb = parseToRgb(color) ?? { r: 0, g: 0, b: 0, a: 1 };
  const hex = rgbToHex(rgb);
  const result: ColorValue = {
    hex,
    rgb: { ...rgb },
    hsv: rgbToHsv(rgb),
    oklch: rgbToOklch(rgb),
  };

  // Cache the result using hex as key
  if (cacheKey) {
    parsedColorCache.set(cacheKey, result);
  }
  parsedColorCache.set(hex, result);

  return result;
};

/**
 * Formats a ColorValue into a string based on the requested format.
 */
export const formatColor = (
  color: ColorValue,
  format: "hex" | "rgb" | "hsv" | "oklch",
): string => {
  if (format === "rgb") {
    const { r, g, b, a } = color.rgb;
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
  }
  if (format === "hsv") {
    const { h, s, v, a } = color.hsv;
    const h_ = Math.round(h);
    const s_ = Math.round(s * 100);
    const v_ = Math.round(v * 100);
    return a < 1
      ? `hsva(${h_}, ${s_}%, ${v_}%, ${a})`
      : `hsv(${h_}, ${s_}%, ${v_}%)`;
  }
  if (format === "oklch") {
    const { l, c, h, a } = color.oklch;
    const l_ = l.toFixed(3);
    const c_ = c.toFixed(3);
    const h_ = Math.round(h);
    return a < 1
      ? `oklch(${l_} ${c_} ${h_} / ${a})`
      : `oklch(${l_} ${c_} ${h_})`;
  }
  return color.hex;
};
