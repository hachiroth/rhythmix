import router from ".";
import { useViewTransitionStore } from "@renderer/stores/use-view-transition-store";

const isSupportViewTransition = !!document.startViewTransition;

/** Handle view transition */
router.beforeResolve((to, from, next) => {
  if (!isSupportViewTransition) return next();

  const viewTransitionStore = useViewTransitionStore();
  viewTransitionStore.isBeforeTransition = true;
  toggleRootDetailId(to.meta);
  toggleRootClasses(from.meta, to.meta);

  // ar id -> mv id --- use mv id === to.id
  // mv id -> ar id --- use mv id === from.id
  const useToId = to.meta.isIdConsistent;
  const useFromId = from.meta.isIdConsistent;

  const id = useToId
    ? to.params["id"]
    : useFromId
    ? from.params["id"]
    : to.params["id"];

  // console.log(`${useFromId ? "From id: " : "To id: "}${id}`);

  coverTransition(id);
  mvCoverTransition(id);

  const vt = document.startViewTransition(() => {
    viewTransitionStore.isTransitioning = true;
    next();
  });

  vt.ready.then(() => {
    viewTransitionStore.isBeforeTransition = false;
  });

  vt.finished.then(() => {
    coverTransition(id);
    mvCoverTransition(id);
    viewTransitionStore.isTransitioning = false;
  });
});

const _toggleClass = (selector: string, className: string) => {
  const target = document.querySelector(selector);
  if (target) {
    target.classList.toggle(className);
  }
};

const toggleRootDetailId = (toMeta) => {
  const id = "is-in-detail-page";
  const root = document.documentElement;
  if (toMeta.isDetail) {
    root.id = id;
  } else {
    root.id = "";
  }
};

const toggleRootClasses = (fromMeta, toMeta) => {
  const removed: string[] = fromMeta["rootClasses"] || [];
  const added: string[] = toMeta["rootClasses"] || [];
  const root = document.documentElement;
  if (!!removed.length) {
    root.classList.remove(...removed);
  }
  if (!!added.length) {
    root.classList.add(...added);
  }
};

const coverTransition = (id) => {
  const coverSelector = `#cover-${id}`;
  const coverClassName = "transition-name-cover";
  _toggleClass(coverSelector, coverClassName);
};

const mvCoverTransition = (id) => {
  const selector = `#mv-cover-${id}`;
  const className = "transition-name-mv-cover";
  _toggleClass(selector, className);
};
