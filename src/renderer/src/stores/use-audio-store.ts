import { defineStore } from "pinia";

export const useAudioStore = defineStore("audio", {
  state: () => ({
    playlist: [] as any[],
    currentIndex: -1,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isPlaying: false,
    isLoading: false,
  }),
  getters: {
    currentTrack(state) {
      const index = state.currentIndex;
      if (!state.playlist.length) return null;
      if (index < 0 || index >= state.playlist.length) return null;
      return state.playlist[index];
    },
  },
  persist: {
    key: "audio-store",
    pick: ["playlist", "currentIndex", "currentTime", "volume", "isPlaying"],
  },
});
