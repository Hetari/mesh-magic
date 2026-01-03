import type { Ref, InjectionKey } from "vue";

// Color value types
export type HexColor = string;
export type RgbColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type HsvColor = {
  h: number;
  s: number;
  v: number;
  a: number;
};

export type ColorValue = {
  hex: HexColor;
  rgb: RgbColor;
  hsv: HsvColor;
};

// Props
export type ColorPickerProps = {
  pureColor: string;
  format: "hex";
  class?: string;
};

// Context
export type ColorPickerContext = {
  colorValue: Ref<ColorValue>;
  hue: Ref<number>;
  saturation: Ref<number>;
  brightness: Ref<number>;
  alpha: Ref<number>;
  setColor: (color: ColorValue) => void;
  setHue: (hue: number) => void;
  setSaturationBrightness: (saturation: number, brightness: number) => void;
  setAlpha: (alpha: number) => void;
};

// Injection key
export const COLOR_PICKER_KEY: InjectionKey<ColorPickerContext> =
  Symbol("color-picker");
