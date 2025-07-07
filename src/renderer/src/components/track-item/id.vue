<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{ index: number; }>();
  const displayIndex = computed(() => props.index > 9 ? props.index : `0${props.index}`);
</script>

<template>
  <div class="track-index text-base-content/80 font-bold italic w-8 min-w-8 text-right cursor-default">
    {{ displayIndex }}
  </div>
</template>
