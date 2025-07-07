<route lang="yaml">
meta:
  isDetail: true
</route>
<script setup lang="ts">

  import TrackItem from '@renderer/components/track-item';
  import { formatDuration } from '@renderer/libs/toolkit';
  import { useDataStore } from '@renderer/stores/use-data-store';
  import { ref } from 'vue';
  import { RecycleScroller } from 'vue-virtual-scroller';

  const dataStore = useDataStore();
  const likedTracks = ref(dataStore.data);

</script>

<template>
  <div class="flex flex-col size-full overflow-hidden">
    <span class="transition-name-my-like-text text-lg font-bold mx-auto pb-2">我喜欢的音乐</span>
    <RecycleScroller class="grow scroll-area pr-2" :items="likedTracks" :item-size="72"
      v-slot="{ item, index }: { item: any, index: number; }">
      <TrackItem hovered>
        <TrackItem.Id :index="index + 1" />
        <TrackItem.Cover :src="item.al.picUrl" :alt="item.name" />
        <div class="flex flex-col flex-1">
          <TrackItem.Name :name="item.name" :is-vip="item.isVip ?? false"
            :transition-name="`preview-track-name-${item.id}`" />
          <TrackItem.Artists :artists="item.ar" />
        </div>
        <TrackItem.Album :name="item.al.name" class="flex-1" />
        <TrackItem.Duration :duration="formatDuration(item.duration)" class="group-hover:opacity-0" />
        <TrackItem.Action class="absolute right-2 hidden group-hover:flex gap-2">
          <button type="button" class="btn btn-circle btn-soft">
            <span class="icon-[mingcute--heart-line]"></span>
          </button>
          <button type="button" class="btn btn-circle btn-primary btn-soft">
            <span class="icon-[mingcute--play-fill]"></span>
          </button>
        </TrackItem.Action>
      </TrackItem>
    </RecycleScroller>
  </div>
</template>

<style scoped></style>