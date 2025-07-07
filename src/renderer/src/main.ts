import "./css/index.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";
import router from "./router";
import "./router/guard";
import scrollRestorePlugin from "./plugins/scroll-restore";

const pinia = createPinia();
pinia.use(piniaPersistedState);

const app = createApp(App);

app.use(router);
app.use(scrollRestorePlugin, {
  selectors: ["main"],
  router: router,
});
app.use(pinia);
app.mount("#app");
