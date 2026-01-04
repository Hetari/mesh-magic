# Color Picker Component - Implementation Guide

> Organized by difficulty level: Easy → Medium → Hard

---

##  MEDIUM - Enhanced Features

Additional features for a better user experience.

### 1. Alpha/Transparency Slider (ColorPickerAlpha.vue)

- [ ] **Template**
  - Checkered background (transparency pattern)
  - Gradient overlay (transparent → solid color)
  - Circular pointer

- [ ] **Mouse Drag**
  - Calculate alpha (0-1) from X position

- [ ] **Checkered Pattern**

  ```css
  background:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  ```

- [ ] **Conditional Rendering**
  - Hide when `disableAlpha: true`

---

### 2. RGB Inputs (ColorPickerInputs.vue)

- [ ] **Mode Toggle**
  - Switch between HEX and RGB modes

- [ ] **RGB Fields**
  - Separate inputs for R, G, B (0-255)
  - Labels below each

- [ ] **Alpha Input**
  - Percentage input (0-100%)
  - Only show when alpha enabled

---

### 3. Color History (ColorPickerSwatches.vue)

- [ ] **History Array**
  - Store last 8 colors

- [ ] **Swatch Grid**
  - Clickable color squares
  - Checkered bg for alpha colors

- [ ] **Add to History**
  - Save color on popup close

- [ ] **Props**
  - `disableHistory`: Hide swatches
  - `roundHistory`: Circle vs square swatches

---

### 4. Additional Props

- [ ] **disableHistory** (boolean)
  - Hide color swatches

- [ ] **roundHistory** (boolean)
  - Round swatch buttons

---

### 5. Touch Support

- [ ] **Saturation Picker**
  - touchstart, touchmove, touchend events
  - Prevent default scroll

- [ ] **Sliders**
  - Touch drag support

---

### 6. Keyboard Navigation

- [ ] **Saturation**
  - Arrow keys move pointer
  - Shift for 10px steps

- [ ] **Sliders**
  - Left/Right arrows adjust value

- [ ] **Tab Order**
  - Logical focus flow

---

### 7. Additional Utilities (colorUtils.ts)

- [ ] **rgbToHsl(rgb)** & **hslToRgb(hsl)**
  - HSL color space conversions

- [ ] **getCheckeredBg()**
  - Return CSS for checkered pattern

---

### 8. More Props

- [ ] **debounce** (number)
  - Debounce change events

- [ ] **zIndex** (number)
  - Custom z-index for popup

- [ ] **blurClose** (boolean)
  - Close on mouse leave

- [ ] **defaultPopup** (boolean)
  - Start with popup open

---

### 9. Accessibility

- [ ] **ARIA Attributes**
  - role="slider" on pickers
  - aria-label descriptions
  - aria-valuenow, min, max

- [ ] **Focus Styles**
  - Visible focus rings

---

## 🔴 HARD - Advanced Features

Complex features requiring more implementation effort.

### 1. Gradient Editor (ColorPickerGradient.vue)

- [ ] **Gradient Bar**
  - Display current gradient
  - Click to add new stops

- [ ] **Color Stops**
  - Draggable markers
  - Visual indicators (arrows + swatches)
  - Selected stop highlight

- [ ] **Stop Interactions**
  - Drag to reposition (0-100%)
  - Double-click to remove
  - Minimum 2 stops enforced

- [ ] **Angle Control**
  - Range slider (0-360°)
  - Number input for precision

- [ ] **Sync with Picker**
  - Selected stop uses current color
  - Current color updates selected stop

---

### 2. Gradient Utilities (colorUtils.ts)

- [ ] **parseGradient(gradientString)**
  - Parse CSS linear-gradient
  - Extract angle and stops array

- [ ] **createGradient(angle, stops)**
  - Build CSS gradient string
  - Sort stops by offset

---

### 3. Mode Tabs (ColorPickerHeader.vue)

- [ ] **Tab UI**
  - "Solid" and "Gradient" buttons
  - Active state styling

- [ ] **Mode Switching**
  - Toggle between pure/gradient pickers
  - Emit activeKey change events

---

### 4. useType Prop

- [ ] **"pure"** - Only solid color picker
- [ ] **"gradient"** - Only gradient picker
- [ ] **"both"** - Tabs to switch modes

---

### 5. Gradient Props & Events

- [ ] **gradientColor** (string)
  - Linear-gradient CSS value
  - Two-way binding

- [ ] **update:gradientColor** event
- [ ] **gradientColorChange** event
- [ ] **update:activeKey** event
- [ ] **activeKeyChange** event

---

### 6. Widget Mode

- [ ] **isWidget** prop (boolean)
  - Render inline without popover
  - Full picker always visible

- [ ] **ColorPickerRoot.vue**
  - Conditional rendering
  - Different wrapper for widget mode

---

### 7. Theme Support

- [ ] **theme** prop (`"white" | "black"`)

- [ ] **Light Theme**
  - Default shadcn styling

- [ ] **Dark Theme**
  - Dark backgrounds (zinc-900)
  - Light text (zinc-100)
  - Dark borders (zinc-800)
  - Override input styles

- [ ] **Files to Update**
  - ColorPickerRoot.vue
  - ColorPickerBody.vue
  - Pass theme through context

---

### 8. Picker Styles

- [ ] **pickerType** prop (`"fk" | "chrome"`)

- [ ] **FK Style** (default)
  - Vertical layout
  - Saturation box on top

- [ ] **Chrome Style**
  - Chrome DevTools layout
  - Compact horizontal design
  - Preview on left side

---

### 9. Internationalization

- [ ] **lang** prop (`"ZH-cn" | "En"`)

- [ ] **Translations**
  - Button labels
  - ARIA labels
  - Help text

---

### 10. Custom Mount Target

- [ ] **pickerContainer** prop
  - Teleport target selector
  - Default: "body"
  - Pass to PopoverPortal

---

### 11. Extra Slot

- [ ] **`#extra` slot**
  - Custom footer content
  - Reset button, presets, etc.

```vue
<ColorPicker>
  <template #extra>
    <button @click="reset">Reset</button>
  </template>
</ColorPicker>
```

---

### 12. All Format Outputs

- [ ] **format** prop full support
  - `"hex"`, `"hex3"`, `"hex4"`, `"hex6"`, `"hex8"`
  - `"rgb"`, `"prgb"` (percentage)
  - `"hsl"`, `"hsv"`
  - `"name"` (color names)

---

## Implementation Order

### Phase 2: Medium (Enhanced)

1. ColorPickerAlpha.vue
2. ColorPickerInputs.vue (full version)
3. ColorPickerSwatches.vue
4. Touch & keyboard support
5. Additional props (debounce, etc.)
6. Accessibility improvements

### Phase 3: Hard (Advanced)

1. ColorPickerGradient.vue
2. ColorPickerHeader.vue (mode tabs)
3. Gradient utilities
4. Theme support
5. Widget mode
6. Picker styles (chrome)
7. i18n support
8. Extra slot

---

## File Structure

```
app/components/ui/color-picker/
├── index.ts                    # Exports
├── types.ts                    # Type definitions
├── colorUtils.ts               # Color utilities
├── ColorPicker.vue             # Main component
├── ColorPickerRoot.vue         # Root wrapper
├── ColorPickerBody.vue         # Popover body
├── ColorPickerPreview.vue      # Trigger button
├── ColorPickerSaturation.vue   # 2D picker
├── ColorPickerHue.vue          # Hue slider
├── ColorPickerInput.vue        # Smart input
├── ColorPickerAlpha.vue        # Alpha slider [PENDING]
├── ColorPickerInputs.vue       # RGB inputs [PENDING]
├── ColorPickerSwatches.vue     # History [PENDING]
├── ColorPickerHeader.vue       # Mode tabs [PENDING]
├── ColorPickerGradient.vue     # Gradient editor [PENDING]
└── todo.md                     # This file
```
