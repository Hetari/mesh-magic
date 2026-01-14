<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.preference === "dark");

const toggleMode = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};

const coreEl = useTemplateRef<SVGPathElement>("coreEl");
const raysEl = useTemplateRef<SVGGElement>("raysEl");
const isHover = ref(false);
let spinTween: gsap.core.Tween | null = null;

// Helper to handle the spin animation logic
const handleSpin = (shouldSpin: boolean) => {
  if (!raysEl.value) return;

  if (shouldSpin && isDark.value) {
    if (!spinTween) {
      spinTween = useGSAP().to(raysEl.value, {
        rotation: "+=360",
        duration: 5,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    } else {
      spinTween.play();
    }
  } else {
    spinTween?.pause();
    useGSAP().to(raysEl.value, {
      rotation:
        Math.round(
          (useGSAP().getProperty(raysEl.value, "rotation") as number) / 45,
        ) * 45,
      duration: 0.25,
      ease: "power4.out",
      transformOrigin: "50% 50%",
    });
  }
};

const updateIconState = (dark: boolean, duration = 0.45) => {
  if (!coreEl.value) return;

  // Morph Core
  useGSAP().to(coreEl.value, {
    morphSVG: dark ? "#sunCorePath" : "#moonPath",
    duration,
    ease: "power2.out",
  });

  // Handle Rays Visibility
  if (raysEl.value) {
    useGSAP().to(raysEl.value, {
      opacity: dark ? 1 : 0,
      scale: dark ? 1 : 0,
      duration,
      ease: "power2.out",
      onStart: () => {
        if (dark && isHover.value) handleSpin(true);
      },
    });
  }

  // Rotation of the core
  useGSAP().to(coreEl.value, {
    rotation: dark ? 0 : -20,
    transformOrigin: "50% 50%",
    duration,
    ease: "power2.out",
  });
};

onMounted(() => {
  updateIconState(isDark.value, 0);
});

// Watch Dark Mode Change
watch(isDark, (dark) => {
  // If moving to Light mode, stop the spin immediately
  if (!dark) handleSpin(false);
  updateIconState(dark);
});

// Watch Hover Change
watch(isHover, (hover) => {
  handleSpin(hover);
});
</script>

<template>
  <Button
    aria-label="mode-toggle-button"
    aria-labelledby="mode-toggle-button"
    variant="secondary"
    size="icon"
    class="cursor-pointer"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @click="toggleMode"
  >
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="overflow-visible"
    >
      <!-- Reference Paths (Hidden) -->
      <defs>
        <!-- Sun Circle Path -->
        <path
          id="sunCorePath"
          d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
        />
        <!-- Moon Crescent Path -->
        <path
          id="moonPath"
          d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z"
        />
      </defs>

      <!-- The Animated Core (Morphed between sunCorePath and moonPath) -->
      <path
        ref="coreEl"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
      />

      <!-- Sun Rays -->
      <g
        ref="raysEl"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <!-- <path
             d="M12 2C11.6227 2.33333 11.0945 3.2 12 4M12 20C12.3773 20.3333 12.9055 21.2 12 22"
           />
           <path
             d="M19.5 4.50271C18.9685 4.46982 17.9253 4.72293 18.0042 5.99847M5.49576 17.5C5.52865 18.0315 5.27555 19.0747 4 18.9958"
           />
           <path
             d="M5.00271 4.5C4.96979 5.03202 5.22315 6.0763 6.5 5.99729M18 17.5026C18.5315 17.4715 19.5747 17.7108 19.4958 18.9168"
           />
           <path
             d="M22 12C21.6667 11.6227 20.8 11.0945 20 12M4 11.5C3.66667 11.8773 2.8 12.4055 2 11.5"
           /> -->
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </g>
    </svg>
  </Button>
</template>
