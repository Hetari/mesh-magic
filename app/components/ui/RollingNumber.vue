<script setup lang="ts">
interface Props {
  startValue?: number;
  duration?: number; // Total duration for the WHOLE sequence
  delay?: number;
  targetValue: number;
}

const props = withDefaults(defineProps<Props>(), {
  startValue: 0,
  duration: 1,
  delay: 0.5,
});

const digits = Array.from({ length: 10 }, (_, i) => i);
const stackRef = useTemplateRef("stack");

const target = computed(() => props.targetValue);

const animate = () => {
  const targetVal = target.value;
  const offsetEm = targetVal * 1.2;

  useGSAP().to(stackRef.value, {
    y: `${-offsetEm}em`,
    ease: "power4.out",
    duration: props.duration,
    delay: props.delay,
  });
};
watch(props, () => {
  animate();
});
onMounted(animate);
</script>

<template>
  <span class="inline-block h-[1.2em] overflow-clip">
    <div
      ref="stack"
      class="flex flex-col"
      :style="`transform: translateY(-${startValue * 1.2}em)`"
    >
      <span
        v-for="digit in digits"
        :key="digit"
        class="h-[1.2em] text-center leading-[1.2em]"
      >
        {{ digit }}
      </span>
    </div>
  </span>
</template>
