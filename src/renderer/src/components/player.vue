<script setup lang="ts">
  import { formatDuration } from '@renderer/libs/toolkit';
  import { computed } from 'vue';
  import VueSlider from 'vue-slider-component';
  import TrackItem from './track-item';
  import { useAudioStore } from '@renderer/stores/use-audio-store';
  import { storeToRefs } from 'pinia';
  import useAudioPlayer from '@renderer/composables/use-audio-player';

  const emit = defineEmits<{
    (e: "openPlaylist"): void;
  }>();

  const audioStore = useAudioStore();
  const { isPlaying, currentTrack, currentTime, isLoading } = storeToRefs(audioStore);
  const { play, pause, next, prev, seek } = useAudioPlayer();

  const playActions = computed(() => ([
    { icon: "icon-[mingcute--skip-previous-fill]", cb: prev },
    {
      icon: isLoading.value ? "loading" : isPlaying.value ? "icon-[mingcute--pause-fill]" : "icon-[mingcute--play-fill]", cb: () => {
        if (isPlaying.value) {
          pause();
        } else {
          play();
        }
      }
    },
    { icon: "icon-[mingcute--skip-forward-fill]", cb: next },
  ]));
  const artists = computed(() => currentTrack.value?.ar || currentTrack.value?.artists);
  const imgSrc = computed(() => currentTrack.value?.picUrl || currentTrack.value?.al?.picUrl);
</script>

<template>
  <div v-if="currentTrack" class="size-full flex gap-4 p-4 items-center">
    <div class="player flex gap-4 items-center flex-1 overflow-hidden">
      <TrackItem>
        <TrackItem.Cover :src="imgSrc" :alt="currentTrack.name"></TrackItem.Cover>
        <div class="flex flex-col flex-1">
          <TrackItem.Name :name="currentTrack.name" :is-vip="currentTrack.isVip ?? false" />
          <TrackItem.Artists :artists="artists" />
        </div>
      </TrackItem>
    </div>
    <div class="flex flex-col flex-[1.5] items-center">
      <div class="actions flex gap-2">
        <button type="button" v-for="action in playActions" :key="action.icon"
          class="btn btn-circle first:btn-text last:btn-text btn-soft" @click="action.cb">
          <span :class="action.icon"></span>
        </button>
      </div>
      <div class="progress-area grow w-full flex items-center gap-4 justify-center">
        <span class="text-xs font-bold text-base-content/80 cursor-default">
          {{ formatDuration(currentTime) }}
        </span>
        <VueSlider v-model="currentTime" :min="0" :max="currentTrack.duration" :tooltip="'none'"
          :railStyle="{ backGroundColor: 'red' }" @change="(time) => seek(time)" class="grow max-w-96">
          <template #dot="{ disabled }">
            <div class="custom-dot size-3 mt-[1px] rounded-full bg-secondary" :class="{ 'opacity-0': disabled }">
            </div>
          </template>
          <template #process="{ style }">
            <div class="vue-slider-process bg-base-100!" :style="[style]">
            </div>
          </template>
        </VueSlider>
        <span class="text-xs font-bold text-base-content/80 cursor-default">
          {{ formatDuration(currentTrack.duration) }}
        </span>
      </div>
      <Transition name="slide">
        <div v-if="currentTrack.isVip" class="absolute bottom-1 text-xs text-secondary font-bold space-x-2">
          <span>试听中</span>
        </div>
      </Transition>
    </div>
    <div class="extra flex gap-2 flex-1 justify-end">
      <button type="button" class="btn btn-circle btn-text">
        <span class="icon-[mingcute--heart-line]"></span>
      </button>
      <button type="button" class="btn btn-circle btn-text">
        <span class="icon-[mingcute--volume-fill]"></span>
      </button>
      <button type="button" class="btn btn-circle btn-text" @click="emit('openPlaylist')">
        <span class="icon-[mingcute--playlist-fill]"></span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>