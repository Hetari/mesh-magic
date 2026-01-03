import type { ColorValue, HexColor, HsvColor, RgbColor } from "./types";

/**
 * Validates whether a given string is a standard CSS hexadecimal color.
 * We need this validation to avoid processing invalid strings in conversion
 * functions that expect specific formatting.
 *
 * @param hex - The string to validate (e.g., "#FFF", "#FFFFFF").
 * @returns True if the string matches 3 or 6-digit hex format.
 */
export const isHexColorValid = (hex: HexColor) => {
  // Regex ensures we only accept valid hexadecimal digits and the '#' prefix
  // supporting both short (3-char) and standard (6-char) formats.
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
};

/**
 * Converts a hexadecimal color string into an RGBA object.
 * This is the entry point for color parsing when a user types a color
 * or when loading saved colors from a configuration.
 *
 * @param hex - The hex string or CSS color name to convert.
 * @returns An RgbColor object or null if the input is unrecognizable.
 */
export const hexToRgb = (hex: HexColor): RgbColor | null => {
  // Guard against invalid inputs to prevent parseInt from returning NaN
  if (!isHexColorValid(hex)) {
    // If it's not a hex, try resolving it as a named color (e.g., 'red')
    const colorHex = colorNameToHex(hex);
    if (colorHex && isHexColorValid(colorHex)) {
      return hexToRgb(colorHex);
    }
    return null;
  }

  // Initialize with opaque black by default
  const rgb: RgbColor = { r: 0, g: 0, b: 0, a: 1 };

  if (hex[0] === "#") {
    // Handle short format: #RGB -> #RRGGBB
    // We double the characters because short hex values are shorthand for repeated nibbles
    if (hex.length === 4) {
      const red = hex[1];
      const green = hex[2];
      const blue = hex[3];
      if (!red || !green || !blue) throw new Error("Invalid hex color");

      // Repeating the digit (e.g., 'f' -> 'ff') converts the 4-bit value to an 8-bit equivalent
      rgb.r = parseInt(red + red, 16);
      rgb.g = parseInt(green + green, 16);
      rgb.b = parseInt(blue + blue, 16);
      return rgb;
    }

    // Handle standard format: #RRGGBB
    // Standard 6-digit hex parsing extracting 2-character pairs for each channel
    if (hex.length === 7) {
      const red = hex.substring(1, 3);
      const green = hex.substring(3, 5);
      const blue = hex.substring(5, 7);

      // parse each component as a base-16 number
      rgb.r = parseInt(red, 16);
      rgb.g = parseInt(green, 16);
      rgb.b = parseInt(blue, 16);
      return rgb;
    }
  }

  return null;
};

/**
 * Converts an RGB color object into a hexadecimal string representation.
 * Necessary for storing colors in a standard format that CSS and APIs understand.
 *
 * @param rgb - The RGB object containing channel values (0-255).
 * @returns A 7-character hex string (e.g., "#00ff00").
 */
export const rgbToHex = (rgb: RgbColor): HexColor => {
  const { r, g, b, a } = rgb;

  // If alpha is 0, we treat it as fully transparent, often represented by transparent black
  if (a === 0) return "#00000000";

  // Use toString(16) to get hex and padStart to ensure 2 digits
  // padStart is critical because toString(16) returns 'f' for 15, but hex expects '0f'
  const redHex = r.toString(16).padStart(2, "0");
  const greenHex = g.toString(16).padStart(2, "0");
  const blueHex = b.toString(16).padStart(2, "0");

  return `#${redHex}${greenHex}${blueHex}`;
};

/**
 * Transforms an RGB color to the HSV (Hue, Saturation, Value) model.
 * HSV is required for the visual UI of the color picker (Hue slider and Saturation/Value map)
 * because it aligns more closely with how humans perceive and manipulate color.
 *
 * @param rgb - The source RGB color.
 * @returns The converted HSV color object.
 */
export const rgbToHsv = (rgb: RgbColor): HsvColor => {
  const { r, g, b, a } = rgb;

  // Normalize RGB values to [0, 1] range for the standard conversion algorithm
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  // Calculate Hue based on which channel is dominant (sector logic)
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h *= 60; // Convert to degrees [0, 360]
    if (h < 0) h += 360; // Normalize negative angles
  }

  // Saturation is the ratio of color intensity relative to brightness (max channel)
  const s = max === 0 ? 0 : delta / max;

  // Value represents the maximum component (brightness)
  const v = max;

  // Returning HSV in standard ranges, though alpha is preserved from RGB
  return { h, s, v, a };
};

export const hsvToRgb = (hsv: HsvColor): RgbColor => {
  const { h, s, v, a } = hsv;

  const c = v * s; // Chroma
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c;
    gPrime = x;
    bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x;
    gPrime = c;
    bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0;
    gPrime = c;
    bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0;
    gPrime = x;
    bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x;
    gPrime = 0;
    bPrime = c;
  } else if (h >= 300 && h < 360) {
    rPrime = c;
    gPrime = 0;
    bPrime = x;
  }

  const r = Math.round((rPrime + m) * 255);
  const g = Math.round((gPrime + m) * 255);
  const b = Math.round((bPrime + m) * 255);

  return { r, g, b, a };
};

export const hsvToHex = (hsv: HsvColor): HexColor => {
  const rgb = hsvToRgb(hsv);
  return rgbToHex(rgb);
};

export const parseColor = (
  color: HexColor | HsvColor | RgbColor,
): ColorValue | null => {
  const isHex = typeof color === "string";
  if (isHex) {
    const rgb = hexToRgb(color as HexColor);
    if (!rgb) return null;
    const hsv = rgbToHsv(rgb);
    return { hex: color as HexColor, rgb, hsv };
  } else if ("r" in color && "g" in color && "b" in color && "a" in color) {
    const rgb = color as RgbColor;
    const hex = rgbToHex(rgb);
    const hsv = rgbToHsv(rgb);
    return { hex, rgb, hsv };
  } else if ("h" in color && "s" in color && "v" in color && "a" in color) {
    const hsv = color as HsvColor;
    const rgb = hsvToRgb(hsv);
    const hex = rgbToHex(rgb);
    return { hex, rgb, hsv };
  }
  return null;
};

/**
 * Resolves a CSS color name to its hexadecimal value using the browser's engine.
 * This allows us to support names like 'dodgerblue' without a heavy library or manual mapping.
 *
 * @param colorName - Common CSS color name string.
 * @returns The resolved hex color string or null if unresolvable.
 */
const colorNameToHex = (colorName: string): HexColor | null => {
  // Use a temporary canvas to let the browser resolve the CSS color string
  // This is the most robust way to handle any valid CSS color name or format
  const ctx = document.createElement("canvas");
  const context = ctx.getContext("2d");
  if (!context) return null;

  // Setting fillStyle allows the internal CSS engine to parse the string
  context.fillStyle = colorName;
  const returndeColor = context.fillStyle;

  // Cleanup to prevent memory leaks, though canvas is not in DOM yet
  ctx.remove();

  // Return the resolved fillStyle which the browser converts to hex or rgb
  return returndeColor;
};
