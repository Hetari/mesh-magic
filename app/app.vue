<script setup lang="ts">
import "vue-sonner/style.css";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

onBeforeMount(() => {
  useGSAP().registerPlugin(MorphSVGPlugin);
});

// Runtime config & route used to build canonical/og:url. Set NUXT_PUBLIC_SITE_URL in env/runtimeConfig for production.
const runtimeConfig = useRuntimeConfig();
const route = useRoute();

// Coerce to string before using. Fallback to a sensible default and remove trailing slash.
const rawSiteUrl = String(
  runtimeConfig?.public?.siteUrl ?? "https://mesh-magic.example",
);
const siteUrl = rawSiteUrl.replace(/\/$/, "");

const canonical = siteUrl + route.path;

const defaultTitle = "Mesh Magic";
const defaultDescription =
  "Create beautiful procedural mesh gradients — customize, preview and export gradients for your designs.";
const defaultImage = siteUrl + "/og-image.png"; // Add a real image at this path (or change the path).

useHead({
  title: defaultTitle,
  titleTemplate: (title) => (title ? `${title} - Mesh Magic` : "Mesh Magic"),
  meta: [
    // Core
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: defaultDescription },
    { name: "robots", content: "index, follow" },

    // Theme / color
    { name: "theme-color", content: "#0f172a" },

    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: defaultTitle },
    { property: "og:title", content: defaultTitle },
    { property: "og:description", content: defaultDescription },
    { property: "og:image", content: defaultImage },
    { property: "og:url", content: canonical },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: defaultTitle },
    { name: "twitter:description", content: defaultDescription },
    { name: "twitter:image", content: defaultImage },
  ],
  link: [
    { rel: "canonical", href: canonical },
    { rel: "icon", href: "/favicon.ico" },
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  ],
  script: [
    {
      type: "application/ld+json",
      // If TypeScript complains about 'children' for script entries, cast this object to `any`.
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: defaultTitle,
        url: siteUrl,
        description: defaultDescription,
      }),
    } as any,
  ],
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toaster />
</template>
