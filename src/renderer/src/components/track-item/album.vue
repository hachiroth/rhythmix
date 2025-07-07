<script setup lang="ts">

  const props = defineProps<{
    name: string;
  }>();
</script>

<template>
  <div class="track-album">
    <span
      class="text-sm text-base-content/80 line-clamp-1 font-bold cursor-pointer hover:text-base-content transition-opacity duration-200">
      {{ props.name }}
    </span>
  </div>
</template>

<style scoped></style>