<route lang="yaml">
  meta:
    isDetail: true
    isScrollRestore: true
    scrollSelectors: ["#profile-playlist-scroll-area"]
  </route>
<script setup lang="ts">

  import AutoDenseGrid from '@renderer/components/auto-dense-grid.vue';
  import { useDataStore } from '@renderer/stores/use-data-store';
  import { ref } from 'vue';

  const dataStore = useDataStore();

  const subscribedPlaylists = ref<any[]>(dataStore.data);
</script>

<template>
  <div class="flex flex-col size-full">
    <span class="text-lg font-bold mx-auto transition-name-subscribed-playlist-text pb-2">
      我的歌单
    </span>
    <div id="profile-playlist-scroll-area" class="grow scroll-area flex pr-2">
      <AutoDenseGrid :list="subscribedPlaylists" :item-width="128" v-slot="{ item }"
        class="transition-name-subscribed-playlist grow">
        <router-link :to="{ path: `/playlist/${item.id}`, query: { imgSrc: item.coverImgUrl } }" class="size-full block"
          :class="{ 'col-span-2 row-span-2': item.daily }">
          <img :id="`cover-${item.id}`" :src="item.coverImgUrl" :alt="item.name" class="rounded" />
        </router-link>
      </AutoDenseGrid>
    </div>
  </div>
</template>

<style scoped></style>