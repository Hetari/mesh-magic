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
    // // seo modules
    // "@nuxtjs/sitemap",
    // "nuxt-schema-org",
    // "nuxt-seo-utils",
    // "nuxt-link-checker",
    // "nuxt-og-image",
    "@nuxtjs/robots",
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

  // site: {
  //   url: "https://mesh-magic.netlify.app/",
  //   name: "Mesh Magic",
  // },
});
