import { onMounted, watch } from "vue";
import { useAudioStore } from "@renderer/stores/use-audio-store";
import useApi from "./use-api";

let audio: HTMLAudioElement;

export default function useAudioPlayer() {
  if (!audio) {
    audio = new Audio();
  }
  const store = useAudioStore();
  const api = useApi();

  audio.volume = store.volume;
  audio.currentTime = store.currentTime || 0;

  audio.ontimeupdate = () => {
    store.currentTime = audio.currentTime;
  };
  audio.onplay = () => (store.isPlaying = true);
  audio.onpause = () => (store.isPlaying = false);
  audio.onloadedmetadata = () => (store.duration = audio.duration);
  audio.onended = () => {
    store.isPlaying = false;
    next();
  };

  watch(
    () => store.currentIndex,
    async (index, oldIndex) => {
      if (index === -1) return;
      if (index === oldIndex) return;
      if (oldIndex === undefined) return;
      audio.currentTime = 0;

      _play();
    },
    { immediate: true }
  );

  async function loadUrl(id: number) {
    const data = await api.getPlayUrl("track", id);
    return data?.find((item) => item.id === id)?.url ?? "";
  }

  async function _play() {
    try {
      store.isLoading = true;
      const track = store.playlist[store.currentIndex];
      if (!track) return;

      audio.src = track.src || (await loadUrl(track.id));
      audio.currentTime = store.currentTime;
      await audio.play();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn("play() was aborted due to a new load, safe to ignore");
      } else {
        console.error("_play error: ", error);
      }
    } finally {
      store.isLoading = false;
    }
  }

  function play(): void;
  function play(index: number): void;
  function play(track: object): void;
  function play(list: any[], index?: number): void;

  function play(data?: number | object | any[], extra?: number) {
    if (data === undefined) {
      console.log("Play current");
      // 播放当前
      if (store.playlist.length === 0) return;
      _play();
      return;
    }

    if (typeof data === "number") {
      console.log("Play index");
      // 播放指定索引
      if (data >= 0 && data < store.playlist.length) {
        store.currentIndex = data;
      }
      return;
    }

    if (Array.isArray(data)) {
      console.log("Play list");
      // 播放新列表
      store.playlist = data;
      store.currentIndex = extra ?? 0;
      store.currentTime = 0;
      return;
    }

    if (typeof data === "object") {
      console.log("Play track");
      // 播放单曲
      store.playlist = [data];
      store.currentIndex = 0;
      store.currentTime = 0;
      return;
    }
  }

  function next() {
    if (store.playlist.length === 0) return;
    store.currentIndex = (store.currentIndex + 1) % store.playlist.length;
    store.currentTime = 0;
    console.log("Next");
  }

  function prev() {
    if (store.playlist.length === 0) return;
    store.currentIndex =
      (store.currentIndex - 1 + store.playlist.length) % store.playlist.length;
    store.currentTime = 0;
  }

  function pause() {
    audio.pause();
  }

  function seek(time: number) {
    audio.currentTime = time;
    store.currentTime = time;
  }

  function setVolume(v: number) {
    audio.volume = v;
    store.volume = v;
  }

  onMounted(() => {
    store.isPlaying = false;
  });

  return {
    audio,
    play,
    pause,
    next,
    prev,
    seek,
    setVolume,
  };
}
