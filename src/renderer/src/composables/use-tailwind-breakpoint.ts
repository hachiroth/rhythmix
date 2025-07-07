import { ref, onMounted, onBeforeUnmount } from "vue";

export default function useTailwindBreakpoint(selector?: string) {
  const currentBreakpoint = ref<string>("base");

  const breakpoints = [
    { name: "2xl", min: 1536 },
    { name: "xl", min: 1280 },
    { name: "lg", min: 1024 },
    { name: "md", min: 768 },
    { name: "sm", min: 640 },
    { name: "base", min: 0 },
  ];

  let resizeObserver: ResizeObserver | null = null;

  const updateBreakpoint = (width: number) => {
    for (const bp of breakpoints) {
      if (width >= bp.min) {
        currentBreakpoint.value = bp.name;
        break;
      }
    }
  };

  onMounted(() => {
    if (selector) {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            updateBreakpoint(entry.contentRect.width);
          }
        });
        resizeObserver.observe(el);
      }
    } else {
      // 默认监听 window 尺寸
      const resizeHandler = () => {
        updateBreakpoint(window.innerWidth);
      };
      window.addEventListener("resize", resizeHandler);
      // 初始化
      resizeHandler();

      onBeforeUnmount(() => {
        window.removeEventListener("resize", resizeHandler);
      });
    }
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  return { currentBreakpoint };
}
