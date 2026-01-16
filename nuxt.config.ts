import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/hints",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/test-utils/module",
    "v-gsap-nuxt",
    // seo modules
    //! "nuxt-schema-org",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-seo-utils",
    "nuxt-link-checker",
    "nuxt-booster",
    "@nuxt/fonts",
  ],

  colorMode: {
    classSuffix: "",
    preference: "dark",
  },

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },

  site: {
    url: "https://mesh-magic.netlify.app/",
    name: "Mesh Magic",
  },

  fonts: {
    provider: "fontshare",
  },

  // nuxt booster:
  booster: {
    detection: {
      performance: true,
      browserSupport: true,
    },

    performanceMetrics: {
      device: {
        hardwareConcurrency: { min: 2, max: 48 },
        deviceMemory: { min: 2 },
      },
      timing: {
        fcp: 800,
        dcl: 1200,
      },
    },

    targetFormats: ["webp", "avif", "jpg|jpeg|png|gif"],

    componentAutoImport: false,
    componentPrefix: undefined,

    /**
     * IntersectionObserver rootMargin for Compoennts and Assets
     */
    lazyOffset: {
      component: "0%",
      asset: "0%",
    },
  },

  image: {
    screens: {
      default: 320,
      xxs: 480,
      xs: 576,
      sm: 768,
      md: 996,
      lg: 1200,
      xl: 1367,
      xxl: 1600,
      "4k": 1921,
    },

    domains: ["img.youtube.com", "i.vimeocdn.com"],

    alias: {
      youtube: "https://img.youtube.com",
      vimeo: "https://i.vimeocdn.com",
    },
  },
});
