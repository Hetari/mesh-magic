# Mesh Magic

### Enjoying my project? Please show your appreciation by starring it on GitHub! ⭐

A beautiful and intuitive mesh gradient generator built with Nuxt 4. Create stunning gradients for your next project with precision and style.

🌐 **Live Demo:** [https://mesh-magic.netlify.app/](https://mesh-magic.netlify.app/)
<img src="https://mesh-magic.netlify.app/preview.png" alt="Mesh Magic Preview" />

## Features

- 🎨 **Interactive Gradient Editor** - Create beautiful mesh gradients with a user-friendly interface
- 🎯 **Precise Controls** - Adjust position, blur, size, and colors with pixel-perfect precision
- 🌈 **Quick Themes** - Apply pre-defined color themes (Cosmic, Mystic, Sunset, Ocean, Forest, Aurora)
- 🔄 **Real-time Preview** - See your changes instantly as you customize

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/)
- **UI Components:** [shadcn-vue](https://www.shadcn-vue.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Hugeicons](https://hugeicons.com/)
- **UI Primitives:** [reka-ui](https://github.com/parsadanashvili/reka-ui)
- **Animations:** [GSAP](https://greensock.com/gsap/)

## Feature Roadmap

### [x] Keyboard shortcuts for common actions

**Goal:** Enable power users to interact faster with keyboard shortcuts.

**Implementation:**
- Created `useKeyboardShortcuts` composable using VueUse's `useMagicKeys` and `onKeyStroke`
- Implemented shortcuts: `?` (help), `Ctrl+S` (save), `R` (randomize), `Ctrl+R` (reset), `A` (add layer), `Backspace/Delete` (remove layer), `D` (toggle dots)
- Added keyboard shortcuts help dialog with categorized shortcuts
- Shortcuts automatically disabled when typing in input fields
- Cross-platform support (Ctrl for Windows/Linux, Cmd for macOS)

---

### [x] Undo/Redo functionality

**Goal:** Allow users to revert and re-apply changes to the gradient configuration.

**Steps:**

1. Create a `useHistory<T>` composable with `past`, `present`, and `future` stacks.
2. Integrate it into `useMeshGradient.ts`, wrapping the `config` ref.
3. On every significant change (add/remove layer, color change, position change), push to history.
4. Expose `undo()`, `redo()`, `canUndo`, `canRedo` from the composable.
5. Wire up keyboard shortcuts (`Ctrl+Z`, `Ctrl+Shift+Z`) and UI buttons.

---

### [ ] Blend mode selection per layer

**Goal:** Allow users to choose CSS blend modes (e.g., `multiply`, `screen`, `overlay`).

**Steps:**

1. Add a `blendMode` field to the `Layer` type.
2. Create a `Select` dropdown with common blend modes in `LayersSection.vue`.
3. Apply `mix-blend-mode` CSS to each layer in the gradient renderer.

---

### [ ] Gradient animation/transition preview

**Goal:** Animate layer positions, colors, or blur over time for a preview effect.

**Steps:**

1. Add a "Preview Animation" toggle button.
2. When enabled, use `setInterval` or GSAP to animate layer properties.
3. Define preset animations (e.g., "Pulse", "Drift", "Color Cycle").
4. Show a timeline or duration control.
5. Allow exporting CSS keyframes or a GIF/video.

---

### [x] Save favorite gradients to localStorage

**Goal:** Persist user-created gradients locally for later use.

**Steps:**

1. Create a "Save" button in the sidebar.
2. Serialize `config` to JSON and store in `localStorage` with a unique ID.
3. Create a "My Gradients" section/modal listing saved items.
4. Allow loading, renaming, and deleting saved gradients.

---

### [ ] Share gradient via URL with encoded config

**Goal:** Generate a shareable URL containing the gradient configuration.

**Steps:**

1. Serialize `config` to a JSON string.
2. Compress using `LZString` or `pako` for URL-friendliness.
3. Encode to Base64 and append to the URL as a query param (e.g., `?g=...`).
4. On page load, detect the param, decode, and apply the config.
5. Add a "Copy Share Link" button.

---

### [ ] Layer templates/presets

**Goal:** Provide pre-configured layer setups users can apply instantly.

**Steps:**

1. Define template objects in a `presets.ts` file (e.g., "Sunset Glow", "Neon Burst").
2. Create a "Templates" section in the sidebar with thumbnail previews.
3. On click, replace or merge `config.layers` with the template's layers.

---

### [ ] Performance optimization for large layer counts

**Goal:** Ensure smooth rendering even with 10+ layers.

**Steps:**

1. Debounce/throttle slider updates using VueUse's `useDebounceFn`.
2. Use `v-memo` or `shallowRef` for layer arrays where deep reactivity isn't needed.
3. Consider rendering layers to an offscreen canvas for heavy blur effects.
4. Profile with Vue DevTools and Chrome Performance tab to find bottlenecks.

---

### [ ] Make sure to be able to change baseColor to white

**Goal:** Allow the base/background color to be any color, including white.

**Steps:**

1. Review `config.baseColor` initialization in `useMeshGradient.ts`.
2. Ensure the color picker and hex input accept `#FFFFFF` without resetting.
3. Test the rendering with white background to verify layer visibility.
4. If layers are invisible on white, consider adding a subtle border or shadow.

## Getting Started

### Prerequisites

- Node.js 20+ (or Bun, pnpm, yarn)
- npm, pnpm, yarn, or bun

### Installation

Install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development

Start the development server:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

Visit `http://localhost:3000` to see your application.

## Build for Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview the production build locally:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Project Structure

```text
mesh-magic/
├── app/
│   ├── components/      # Vue components
│   │   ├── ui/          # UI components (shadcn-vue)
│   │   └── Mesh/        # Mesh gradient components
│   ├── composables/     # Composables (useMeshGradient, etc.)
│   ├── layouts/         # Layout components
│   ├── pages/           # Pages/routes
│   └── assets/          # Static assets and styles
├── public/              # Public static files
└── nuxt.config.ts       # Nuxt configuration
```

## Learn More

- [Nuxt Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn-vue Documentation](https://www.shadcn-vue.com/)

## License

This project is private and proprietary.

---

Built with 💚 using Nuxt 4
