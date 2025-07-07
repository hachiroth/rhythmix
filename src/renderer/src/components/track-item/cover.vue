<script setup lang="ts">
  const props = defineProps<{
    src: string;
    alt: string;
  }>();
</script>

<template>
  <div class="track-cover">
    <img :src="props.src" :alt="props.alt" class="size-14 min-w-14 rounded object" />
  </div>
</template>
