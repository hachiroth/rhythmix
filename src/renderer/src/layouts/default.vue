<script setup lang="ts">
  import Logo from '@renderer/components/logo.vue';
  import Player from '@renderer/components/player.vue';
  import { onMounted, ref } from 'vue';
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@renderer/stores/use-auth-store';
  import useApi from '@renderer/composables/use-api';

  const api = useApi();
  const authStore = useAuthStore();
  const route = useRoute();
  const router = useRouter();

  const isStoreInit = ref(false);
  const windowButtons = computed(() => [
    { icon: "icon-[mingcute--minimize-line]", cb: api.minimize },
    {
      icon: isMaximized.value
        ? "icon-[mingcute--restore-line]"
        : "icon-[mingcute--square-line]",
      cb: api.toggle
    },
    { icon: "icon-[mingcute--close-line]", cb: api.close }
  ]);
  const isMaximized = ref(false);

  const menus = [
    { label: "Home", icon: "icon-[mingcute--home-4-fill]", path: "/" },
    {
      label: "Profile",
      icon: "icon-[mingcute--user-4-fill]",
      path: "/profile"
    }
  ];

  const isUseMainToScroll = computed(() => route.meta.useMainToScroll as boolean);
  const isDetailPage = computed(() => route.meta.isDetail);

  function back() {
    if (!isDetailPage) return;
    router.back();
  }
  onMounted(async () => {
    isStoreInit.value = false;
    await authStore.restore();
    api.setCookie(authStore.cookie.value);
    const status = await api.login.status();
    if (!status.isLogin) {
      authStore.clear();
    } else {
      authStore.save({ profile: { ...authStore.profile.value, ...status.account, ...status.profile }, cookie: authStore.cookie.value! });
    }
    isStoreInit.value = true;

    api.onMaximizeChanged((maximized) => {
      isMaximized.value = maximized;
    });

  });

</script>

<template>
  <header class="w-full h-16 min-h-16 bg-base-100 p-4 drag transition-name-header">
    <nav class="h-10 navbar p-0 bg-transparent">
      <div class="navbar-start no-drag w-fit items-center ml-4">
        <div id="logo-box"
          class="flex items-center transition-all duration-300 translate-x-8 *:[svg]:scale-90 cursor-pointer"
          :class="{ 'translate-x-0! *:[svg]:scale-100! cursor-default!': !isDetailPage }" @click="back">
          <span class="icon-[mingcute--left-small-line] size-6 opacity-100" :class="{ 'opacity-0!': !isDetailPage }">
          </span>
          <Logo />
        </div>
      </div>
      <div class="navbar-center"></div>
      <ul class="navbar-end no-drag ml-auto w-fit">
        <li v-for="action in windowButtons" :key="action.icon"
          class="w-10 text-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200"
          @click="action.cb">
          <span :class="[action.icon]"></span>
        </li>
      </ul>
    </nav>
  </header>
  <div class="grow overflow-hidden flex bg-gradient-aside-and-main">
    <aside class="w-10 min-w-10 box-content p-4 h-full pt-0">
      <ul class="no-drag space-y-2">
        <li v-for="menu in menus" :key="menu.path" class="relative group">
          <router-link :to="menu.path" activeClass="active" class="focus-visible:outline-0">
            <template #default="{ isExactActive }">
              <span
                :class="[menu.icon, 'opacity-50 size-5 group-hover:opacity-100 group-hover:bg-white transition-all duration-200', isExactActive ? 'opacity-100 bg-white' : '']"></span>
              <span
                :class="['menu-line absolute right-2 top-1 bottom-2.5 w-0.5 bg-white transition-opacity duration-200', isExactActive ? 'opacity-100' : 'opacity-0']"></span>
            </template>
          </router-link>
        </li>
      </ul>
    </aside>
    <main v-if="isStoreInit" class="grow scroll-area" :class="{ 'pr-2 mr-2': isUseMainToScroll }">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.path" />
        </keep-alive>
      </router-view>
    </main>
  </div>
  <footer class="w-full h-24 min-h-24 p-4 bg-gradient-footer transition-name-footer">
    <Player />
  </footer>
</template>

<style scoped></style>
