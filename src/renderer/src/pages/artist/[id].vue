<route lang="yaml">
meta:
  isDetail: true
  useMainToScroll: true
  isScrollRestore: true
  scrollSelectors: ["main"]
  rootClasses: ["artist"]
</route>
<script setup lang="ts">
  import TrackItem from '@renderer/components/track-item';
  import useApi from '@renderer/composables/use-api';
  import { formatDuration } from '@renderer/libs/toolkit';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const api = useApi();

  const id = computed(() => (route.params as any).id);
  const name = computed(() => route.query.name as string);
  const artist = ref();
  const hasUser = ref(false);
  const isBlackList = ref(false);
  const topTracks = ref<any[]>([]);
  const hasMoreTrack = ref(false);
  const hotAlbums = ref<any>([]);
  const mvs = ref<any>([]);

  async function getArtistDetail() {
    const res = await api.artist.detail(id.value);
    artist.value = res.artist;
    hasUser.value = !!res.user;
    isBlackList.value = res.isBlacklist;
    api.artist.top.track(id.value).then(res => {
      topTracks.value = res.topTracks;
      hasMoreTrack.value = res.more;
    });
    api.artist.mv(id.value).then(res => {
      mvs.value = res.mvs;
    });
    api.artist.album(id.value).then(res => {
      hotAlbums.value = res.hot;
    });
  }

  onMounted(() => {
    getArtistDetail();
  });

</script>

<template>
  <div class="space-y-4">
    <div class="w-full h-48 flex flex-col">
      <div class="flex flex-col mt-auto gap-2">
        <div v-for="tag in artist?.identifyTag" :key="tag">
          <span class="text-sm font-bold">{{ tag }}</span>
        </div>
        <h1 class=" text-3xl font-bold text-white">{{ name }}</h1>
        <div class="flex gap-4 text-sm font-bold text-base-content/80">
          <span>
            歌曲 {{ artist?.musicSize }}
          </span>
          <span>
            MV {{ artist?.mvSize }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex gap-4 items-center">
      <button type="button" class="btn btn-primary btn-circle btn-lg">
        <span class="icon-[mingcute--play-fill]"></span>
      </button>
      <button type="button" class="btn btn-outline btn-sm rounded-full border-2 *:font-bold">
        <span>关注</span>
      </button>
      <button type="button" class="btn btn-text btn-sm">
        <span class="icon-[mingcute--dots]"></span>
      </button>
    </div>
    <div class="space-y-8">
      <section class="flex flex-col gap-1">
        <h1 class="font-bold text-lg text-white">热门单曲</h1>
        <TrackItem hovered v-for="item, index in topTracks.slice(0, 10)" :key="item.id">
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
        <div v-if="hasMoreTrack"
          class="mr-auto cursor-pointer font-bold text-sm text-base-content/80 hover:text-white transition-colors duration-200">
          查看更多
        </div>
      </section>
      <section class="flex flex-col gap-1">
        <h1 class="font-bold text-lg text-white">MV</h1>
        <div class="grid grid-cols-4 gap-4 xl:grid-cols-5">
          <router-link :to="{ path: `/mv/${mv.id}`, query: { imgSrc: mv.imgurl16v9 } }" v-for="mv in mvs" :key="mv.id"
            class="space-y-2 cursor-pointer group">
            <div class="relative">
              <img :id="`mv-cover-${mv.id}`" :src="mv.imgurl16v9" :alt="mv.name" class="rounded">
              <div class="absolute inset-0 bg-black/30 hidden group-hover:block">
                <button type="button" class="btn btn-circle abs-c btn-primary">
                  <span class="icon-[mingcute--play-fill]"></span>
                </button>
              </div>
            </div>
            <div class="text-sm font-bold line-clamp-1">{{ mv.name }}</div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>