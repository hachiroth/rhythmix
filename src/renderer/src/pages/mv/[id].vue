<route lang="yaml">
meta:
  isDetail: true
  isIdConsistent: true
  useMainToScroll: true
  rootClasses: ["mv-detail"]
</route>
<script setup lang="ts">
  import { computed, onMounted, useTemplateRef } from 'vue';
  import { useRoute } from 'vue-router';
  import Plyr from "plyr";
  import 'plyr/dist/plyr.css';
  import useApi from '@renderer/composables/use-api';
  import { ref } from 'vue';
  import { useViewTransitionStore } from '@renderer/stores/use-view-transition-store';

  const api = useApi();
  const route = useRoute();
  const viewTransition = useViewTransitionStore();

  const id = computed(() => (route.params as any).id);
  const imgSrc = computed(() => {
    if (viewTransition.isTransitioning) {
      return "";
    }
    return route.query.imgSrc as string;
  });
  const player = useTemplateRef<HTMLElement>("player");
  const url = ref(null);

  async function getPlayUrl() {
    const res = await api.getPlayUrl("mv", id.value);
    url.value = res.url;
  }

  onMounted(() => {
    const plyr = new Plyr(player.value!, {
    });
    plyr.fullscreen;
    getPlayUrl();
  });
</script>

<template>
  <div>
    <video ref="player" controls playsinline class="max-w-3xl xl:max-w-5xl w-full mx-auto aspect-video"
      :poster="imgSrc">
      <source v-if="url" :src="url" type="video/mp4" />
    </video>
  </div>
</template>

<style scoped></style>