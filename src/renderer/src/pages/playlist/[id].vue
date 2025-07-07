<route lang="yaml">
meta:
  isDetail: true
  isIdConsistent: true
</route>
<script setup lang="ts">
  import useApi from '@renderer/composables/use-api';
  import { ref } from 'vue';
  import { computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import millify from "millify";
  import { useViewTransitionStore } from '@renderer/stores/use-view-transition-store';
  import TrackItem from '@renderer/components/track-item';
  import { formatDuration, formatTimestamp, updatedWithinOneYear } from '@renderer/libs/toolkit';
  import useAudioPlayer from '@renderer/composables/use-audio-player';

  const { play } = useAudioPlayer();
  const viewTransitionStore = useViewTransitionStore();
  const route = useRoute();
  const api = useApi();

  const id = computed(() => (route.params as any).id as number);
  const imgSrc = computed(() => route.query.imgSrc as string);
  const tracks = ref<any[]>([]);
  const detail = ref<any>(null);
  const isTransitioning = computed(() => viewTransitionStore.isTransitioning);

  async function getDetail() {
    detail.value = await api.playlist.detail(id.value);
  }
  async function getAllTracks() {
    const res = await api.playlist.tracks(id.value);
    tracks.value = res;
  }

  onMounted(() => {
    getDetail();
    getAllTracks();
  });
</script>

<template>
  <div class="flex overflow-hidden size-full gap-4">
    <div class="w-64 min-w-64">
      <div class="sticky top-0 space-y-2">
        <div
          class="relative w-fit after:absolute after:content-[''] after:inset-0 after:bg-gradient-to-tr after:from-transparent after:to-black/20"
          :class="{ 'after:opacity-0': isTransitioning }">
          <img :src="imgSrc" alt="" class="size-64 object-cover rounded transition-name-cover">
          <span v-if="detail && !isTransitioning"
            class="absolute top-2 right-2 text-white text-xs font-bold z-[1] flex items-center gap-0.5">
            <span class="icon-[mingcute--headphone-fill]"></span>
            <span>{{ millify(detail?.playCount || 0) }}</span>
          </span>
          <div v-if="!isTransitioning" class="absolute bottom-2 right-2 z-[1] flex flex-col gap-2">
            <button type="button" class="btn btn-circle btn-soft">
              <span class="icon-[mingcute--playlist-fill] size-5"></span>
            </button>
            <button type="button" class="btn btn-circle btn-soft" @click="() => play(tracks, 0)">
              <span class="icon-[mingcute--play-fill] size-5"></span>
            </button>
          </div>
        </div>
        <div v-if="detail && !isTransitioning" class="space-y-1 mt-4 transition-opacity duration-200">
          <h1 class="font-bold text-lg">{{ detail.name }}</h1>
          <p class="text-xs text-base-content/80 line-clamp-3">
            {{ detail.description }}
          </p>
          <div class="space-y-2 mt-4">
            <div class="flex items-center gap-2 text-sm cursor-pointer w-fit group">
              <img :src="detail.creator.avatarUrl" :alt="detail.creator.nickname" class="size-8 rounded-full">
              <p>{{ detail.creator.nickname }}</p>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2 text-sm font-bold text-base-content/80">
            <span>{{ formatTimestamp(detail.updateTime) }}</span>
            <div class="status status-sm animate-pulse"
              :class="[`${updatedWithinOneYear(detail.updateTime) ? 'status-success' : 'status-warning'}`]">
            </div>
            <span>更新</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tracks && !isTransitioning" class="grow flex flex-col">
      <RecycleScroller class="grow scroll-area pr-2" :items="tracks" :item-size="72" key-field="id"
        v-slot="{ item, index }">
        <TrackItem hovered :active="index === 2">
          <TrackItem.Id :index="index + 1" />
          <TrackItem.Cover :src="item.al.picUrl" :alt="item.name" />
          <div class="flex flex-col flex-1">
            <TrackItem.Name :name="item.name" :is-vip="item.isVip ?? false" />
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
  </div>
</template>

<style scoped></style>