import type { Plugin } from "vue";
import type { Router } from "vue-router";

interface ScrollRestoreOption {
  selectors: string[];
  router: Router;
}

const scrollRestorePlugin: Plugin<ScrollRestoreOption> = {
  install: (_, opt) => {
    // const selectors = opt.selectors || [];
    const pos: Record<
      string,
      Record<string, { top: number; left: number }>
    > = {};

    const router = opt.router;
    if (!router) {
      console.warn("[scroll-restore] you must pass the router instance");
      return;
    }

    router.beforeEach((_, from, next) => {
      const selectors = (from.meta.scrollSelectors as string[]) || [];
      if (from.meta.isScrollRestore && !!selectors.length) {
        selectors.forEach((selector) => {
          const el = document.querySelector(selector);
          if (el) {
            pos[from.fullPath] = pos[from.fullPath] || {};
            pos[from.fullPath][selector] = {
              top: el.scrollTop,
              left: el.scrollLeft,
            };
          }
        });
      }
      next();
    });

    // BUG: A bug occurs when scrolling to a certain distance.
    router.afterEach((to) => {
      const selectors = (to.meta.scrollSelectors as string[]) || [];
      if (to.meta.isScrollRestore && !!selectors.length) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const saved = pos[to.fullPath];
            if (saved) {
              selectors.forEach((selector) => {
                const el = document.querySelector(selector);
                const pos = saved[selector];
                if (el && pos) {
                  el.scrollTop = pos.top;
                  el.scrollLeft = pos.left;
                }
              });
            }
          });
        });
      }
    });
  },
};

export default scrollRestorePlugin;
