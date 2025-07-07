<script setup lang="ts" generic="T extends any">
  import { ref, onMounted, onBeforeUnmount } from "vue";


  const { list = [], itemWidth = 120, gap = 12 } = defineProps<{
    list: T[];
    itemWidth?: number;
    gap?: number;
  }>();

  const containerRef = ref<HTMLElement | null>(null);
  const containerWidth = ref(0);
  const colCount = ref(1);

  function updateColCount() {
    if (!containerRef.value) return;
    containerWidth.value = containerRef.value.clientWidth;
    // Count cols, at least one
    colCount.value = Math.max(1, Math.floor((containerWidth.value + gap) / (itemWidth + gap)));
  }

  onMounted(() => {
    updateColCount();

    if (containerRef.value) {
      const ro = new ResizeObserver(() => {
        updateColCount();
      });
      ro.observe(containerRef.value);

      onBeforeUnmount(() => {
        ro.disconnect();
      });
    }

    // Update when resize
    window.addEventListener("resize", updateColCount);
    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateColCount);
    });
  });
</script>

<template>
  <div ref="containerRef" :style="{
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gridAutoFlow: 'dense',
    gap: gap + 'px'
  }">
    <template v-for="item in list" :key="item.id">
      <slot :item="item" />
    </template>
  </div>
</template>
