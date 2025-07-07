import { defineStore } from "pinia";

export const useViewTransitionStore = defineStore("view-transition", {
  state: () => ({
    isTransitioning: false,
    isBeforeTransition: false,
  }),
});
