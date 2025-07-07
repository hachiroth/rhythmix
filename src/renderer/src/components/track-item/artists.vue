<route lang="yaml">
meta:
  isDetail: true
</route>
<script setup lang="ts">

  const props = defineProps<{
    artists: { id: number; name: string; }[];
  }>();
</script>

<template>
  <div v-if="!!props.artists.length" class="track-artists line-clamp-1">
    <span v-for="artist, index in props.artists" :key="artist.id" class="text-sm text-base-content/80 cursor-pointer">
      <router-link :to="{ path: `/artist/${artist.id}`, query: { name: artist.name } }"
        class="hover:text-base-content transition-all duration-200">
        {{ artist.name }}
      </router-link>
      <span v-if="index < props.artists.length - 1" class="mx-1">/</span>
    </span>
  </div>
</template>

<style scoped></style>w