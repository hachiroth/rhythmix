<route lang="yaml">
meta:
  isScrollRestore: true
  scrollSelectors: ["main"]
  useMainToScroll: true
</route>
<script setup lang="ts">
  import AutoDenseGrid from '@renderer/components/auto-dense-grid.vue';
  import useApi from '@renderer/composables/use-api';
  import { computed, onMounted, ref } from 'vue';

  const api = useApi();

  const dailyPlaylist = ref<any[]>([]);
  const recPlaylist = ref<any[]>([]);
  const playlists = computed(() => {
    // return mock.playlist;

    const merged = [
      ...dailyPlaylist.value.map(item => ({
        ...item,
        daily: true,
      })),
      ...recPlaylist.value
    ];

    const map = new Map();
    for (const item of merged) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }

    const deduped = Array.from(map.values());

    const shuffled = shuffle(deduped);
    return shuffled;
  });

  function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  onMounted(async () => {
    await api.playlist.recommend().then(res => recPlaylist.value = res);
    await api.playlist.daily().then(res => dailyPlaylist.value = res);
  })


</script>

<template>
  <AutoDenseGrid :list="playlists" :item-width="128" v-slot="{ item }">
    <router-link :to="{ name: '/playlist/[id]', params: { id: item.id }, query: { imgSrc: item.picUrl } }"
      class="size-full block" :class="{ 'col-span-2 row-span-2': item.daily }">
      <img :id="`cover-${item.id}`" :src="item.picUrl" :alt="item.name" class="rounded" />
    </router-link>
  </AutoDenseGrid>
</template>

<style scoped></style>