<script setup lang="ts">

  const { hovered = false, active = false } = defineProps<{ hovered?: boolean; active?: boolean; }>();
</script>

<template>
  <div class="track px-3 py-2 flex items-center gap-4 rounded transition-colors duration-200 group relative"
    :class="{ 'hover:bg-neutral/20': hovered }">
    <slot :isActive="active"></slot>
  </div>
</template>

<style scoped></style>