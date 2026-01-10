# Mesh Magic

A beautiful and intuitive mesh gradient generator built with Nuxt 4. Create stunning gradients for your next project with precision and style.

🌐 **Live Demo:** [https://mesh-magic.netlify.app/](https://mesh-magic.netlify.app/)

## Features

- 🎨 **Interactive Gradient Editor** - Create beautiful mesh gradients with a user-friendly interface
- 🎯 **Precise Controls** - Adjust position, blur, size, and colors with pixel-perfect precision
- 🌈 **Quick Themes** - Apply pre-defined color themes (Cosmic, Mystic, Sunset, Ocean, Forest, Aurora)
- 🔄 **Real-time Preview** - See your changes instantly as you customize
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode** - Beautiful dark theme optimized for your eyes
- ⚡ **SSR Optimized** - Fast initial load with server-side rendering
- 🎭 **Organic Shapes** - Generate beautiful organic border radius for natural-looking gradients

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/)
- **UI Components:** [shadcn-vue](https://www.shadcn-vue.com/) 
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Hugeicons](https://hugeicons.com/)
- **UI Primitives:** [reka-ui](https://github.com/parsadanashvili/reka-ui)
- **Animations:** [GSAP](https://greensock.com/gsap/)

## Feature Roadmap

### Mesh Gradient

- [ ] Add copy CSS functionality
- [ ] Add copy SVG functionality
- [ ] Download gradient as image (PNG/JPG) with custom width and hight.
- [ ] Add draggable dots/controls on each layer for interactive positioning
- [ ] Keyboard shortcuts for common actions
- [ ] Undo/Redo functionality
- [ ] Layer opacity control
- [ ] Blend mode selection per layer
- [ ] Gradient animation/transition preview
- [ ] Save favorite gradients to localStorage
- [ ] Share gradient via URL with encoded config
- [ ] Layer templates/presets
- [ ] Performance optimization for large layer counts

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
