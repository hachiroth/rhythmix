<route lang="yaml">
meta:
  isScrollRestore: true
  scrollSelectors: ["main"]
  useMainToScroll: true
</route>
<script setup lang="ts">
  import { computed, onActivated, onDeactivated, onMounted, ref, watch } from 'vue';
  import { RouterLinkProps, useRouter } from 'vue-router';
  import PhoneLoginBox from './components/phone-login-box.vue';
  import QrLoginBox from './components/qr-login-box.vue';
  import useApi from '@renderer/composables/use-api';
  import { useAuthStore } from '@renderer/stores/use-auth-store';
  import AutoDenseGrid from '@renderer/components/auto-dense-grid.vue';
  import { useDataStore } from '@renderer/stores/use-data-store';
  import useAudioPlayer from '@renderer/composables/use-audio-player';

  const { play } = useAudioPlayer();
  const dataStore = useDataStore();
  const authStore = useAuthStore();
  const api = useApi();
  const router = useRouter();

  const qrUrl = ref();
  const qrKey = ref<any>(null);
  const isExpired = ref(false);
  let timer;
  const isScanning = ref(false);
  const scannedInfo = ref<any>(null);
  const isActivated = ref(false);
  const isLogin = computed(() => authStore.isLogin.value);
  const profile = ref(authStore.profile.value);
  const likedTracks = ref<any[]>([]);
  const followedArtists = ref<any[]>([]);
  const followedArtistCount = ref(0);
  const subscribedPlaylists = ref<any[]>([]);

  async function generateQRCode() {
    const res = await api.login.qr.generateKey();
    qrUrl.value = res.qrurl;
    console.log(res);
    qrKey.value = res.key;
    isExpired.value = false;
    console.log("QRCode generated.");
  }

  function onExpired() {
    console.log("QRCode expired.");
    clearTimeout(timer);
    timer = null;
    isExpired.value = true;
  }

  function onScanning(res) {
    isScanning.value = true;
    isExpired.value = false;
    scannedInfo.value = res;
  }

  function onScanSuccess(res) {
    clearTimeout(timer);
    timer = null;

    const cookie = res.cookie;
    if (!cookie) throw new Error("No cookie returned.");

    const info = scannedInfo.value;
    if (!info) throw new Error("No user info returned.");

    delete info.cookie;

    api.setCookie(cookie);

    authStore.save({ profile: info, cookie });

    profile.value = info;

    resetAllState();
  }

  function resetAllState() {
    qrKey.value = null;
    qrUrl.value = null;
    scannedInfo.value = null;
    timer = null;
    isScanning.value = false;
    isExpired.value = false;
  }

  function startCheck() {
    const key = qrKey.value;
    if (!key) return;

    const loop = async () => {
      const res = await api.login.qr.check(key);
      switch (res.code) {
        case 800:
          onExpired();
          return;
        case 801:
          console.log("Waiting scanning.");
          break;
        case 802:
          onScanning(res);
          break;
        case 803:
          onScanSuccess(res);
          return;
        default:
          console.warn("Unknown code:", res);
          break;
      }
      timer = setTimeout(loop, 2000);
    };

    loop();
  }


  let qrBox: HTMLElement;
  let phoneBox: HTMLElement;
  onMounted(async () => {
    qrBox = document.getElementById("qr-login-box") as HTMLElement;
    phoneBox = document.getElementById("phone-login-box") as HTMLElement;
  });

  onActivated(() => {
    isActivated.value = true;
    resume();
    getMyLikedTracks();
    getMyFollowArtists();
    getMyPlaylists();
  });

  onDeactivated(() => {
    isActivated.value = false;
    pause();
    clearTimeout(timer);
    timer = null;
  });

  const { pause, resume } = watch([isActivated, qrUrl, isExpired, isLogin], ([activated, url, expired, login]) => {
    if (!activated || login) return;

    isScanning.value = false;
    scannedInfo.value = null;

    if (!url) {
      generateQRCode();
    } else if (!expired) {
      startCheck();
    }
  });

  async function onLoginMethodSwitch(_to: string) {
    document.startViewTransition(() => {
      qrBox!.classList.toggle("hidden");
      phoneBox!.classList.toggle("hidden");
    });
  }
  async function logout() {
    return;
    await authStore.clear();
  }
  async function getMyLikedTracks() {
    likedTracks.value = await api.track.liked(profile.value.id);
  }
  async function getMyFollowArtists() {
    const res = await api.artist.followed();
    followedArtists.value = res.data;
    followedArtistCount.value = res.count;
  }
  async function getMyPlaylists() {
    subscribedPlaylists.value = await api.playlist.subscribed(profile.value.id);
  }
  function go(to: RouterLinkProps["to"]) {
    if (to === "/profile/like") {
      dataStore.data = likedTracks.value;
    } else {
      dataStore.data = subscribedPlaylists.value;
    }
    router.push(to);
  }
</script>

<template>
  <div v-if="isLogin" class="space-y-4">
    <div class="w-full flex gap-4">
      <div class="flex-1">
        <div class="flex gap-4 items-center">
          <img :src="profile?.avatarUrl" :alt="profile?.nickname" class="size-14 rounded-full object-cover"
            style="view-transition-name: my-avatar;">
          <div class="font-bold text-xl">
            <span style="view-transition-name: my-nickname;">{{ profile?.nickname }}</span>
            <span>的音乐库</span>
          </div>
          <button type="button" class="btn btn-sm btn-error btn-soft ml-auto mr-1" @click="logout">退出登录</button>
        </div>
        <div class="stats shadow-none">
        </div>
      </div>
      <div class="flex-1 bg-base-200/30 h-48 flex flex-col p-6 rounded">
        <div class="preview flex gap-1 flex-wrap">
          <span v-for="track in likedTracks.slice(0, 10)" :key="track.id"
            class="italic font-bold text-sm text-base-content/80"
            :style="{ viewTransitionName: `preview-track-name-${track.id}` }">
            {{ track.name }}
          </span>
        </div>
        <div class="mt-auto flex justify-between items-end group">
          <div>
            <div class="text-lg font-bold flex items-center cursor-pointer" @click="go('/profile/like')">
              <span class="transition-name-my-like-text">我喜欢的音乐</span>
              <span class="icon-[mingcute--right-small-line] size-6 align-middle"></span>
            </div>
            <span class="text-sm font-bold text-base-content/80">{{ likedTracks.length }}首</span>
          </div>
          <div>
            <button type="button" class="btn btn-circle btn-primary btn-lg" @click="() => play(likedTracks, 0)">
              <span class="icon-[mingcute--play-fill]"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="rounded space-y-2" style="view-transition-name: profile-playlist;">
      <div class="text-lg font-bold flex justify-between items-center">
        <div @click="go('/profile/playlist')" class="flex items-center">
          <span class="cursor-pointer transition-name-subscribed-playlist-text">
            歌单({{ subscribedPlaylists.length }})
          </span>
          <span class="icon-[mingcute--right-small-line] size-6 align-middle"></span>
        </div>
      </div>
      <AutoDenseGrid :list="subscribedPlaylists" :item-width="128" v-slot="{ item }"
        class="transition-name-subscribed-playlist">
        <router-link :to="{ path: `/playlist/${item.id}`, query: { imgSrc: item.coverImgUrl } }" class="size-full block"
          :class="{ 'col-span-2 row-span-2': item.daily }">
          <img :id="`cover-${item.id}`" :src="item.coverImgUrl" :alt="item.name" class="rounded" />
        </router-link>
      </AutoDenseGrid>
    </div>
  </div>
  <div v-else class="size-full relative login-page">
    <div class="abs-c flex">
      <PhoneLoginBox ref="phone-login-ref" @switch="onLoginMethodSwitch" />
      <QrLoginBox ref="qr-login-ref" class="hidden" :is-scanning="isScanning" :scanned-info="scannedInfo"
        :qr-url="qrUrl" @switch="onLoginMethodSwitch" />
    </div>
  </div>
</template>

<style scoped></style>