import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import vueRouter from "unplugin-vue-router/vite";
import layout from "vite-plugin-vue-layouts";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@typed": resolve("./typed"),
      },
    },
    plugins: [
      vueRouter({
        routesFolder: resolve("src/renderer/src/pages"),
        dts: "src/typed/typed-router.d.ts",
        importMode: "sync",
        exclude: ["**/*/components/*.vue"],
      }),
      layout({
        layoutsDirs: resolve("src/renderer/src/layouts"),
        pagesDirs: resolve("src/renderer/src/pages"),
      }),
      vue(),
      tailwindcss(),
    ],
  },
});
