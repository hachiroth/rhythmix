<script setup lang="ts">

  const props = defineProps<{ name: string; isVip: boolean; transitionName?: string; }>();
</script>

<template>
  <div class="track-name cursor-default line-clamp-1 flex items-center gap-1">
    <span v-if="isVip" class="icon-[mingcute--vip-3-fill] size-3 bg-error/50 align-middle"></span>
    <span class="line-clamp-1" :style="{ viewTransitionName: props.transitionName }">{{ props.name }}</span>
  </div>
</template>

<style scoped></style>