<script setup lang="ts">

  const props = defineProps<{ duration: number | string; }>();
</script>

<template>
  <div class="track-duration ml-auto cursor-default">
    <span class="text-sm text-base-content/80 font-bold">
      {{ props.duration }}
    </span>
  </div>
</template>

<style scoped></style>