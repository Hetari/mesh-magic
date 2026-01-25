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

### [x] Share gradient via URL with encoded config

**Goal:** Generate a shareable URL containing the gradient configuration.

**Steps:**

1. Serialize `config` to a JSON string.
2. Compress using `LZString` or `pako` for URL-friendliness.
3. Encode to Base64 and append to the URL as a query param (e.g., `?g=...`).
4. On page load, detect the param, decode, and apply the config.
5. Add a "Copy Share Link" button.

---

### [ ] Performance optimization for large layer counts

**Goal:** Ensure smooth rendering even with 10+ layers, with a max count of 15 layers at max count.

**Steps:**

1. Debounce/throttle slider updates using VueUse's `useDebounceFn`.
2. Use `v-memo` or `shallowRef` for layer arrays where deep reactivity isn't needed.
3. Consider rendering layers to an offscreen canvas for heavy blur effects.
4. Profile with Vue DevTools and Chrome Performance tab to find bottlenecks.

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
