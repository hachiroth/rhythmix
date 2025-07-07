import { computed, ref } from "vue";

const api = window.api;

const PROFILE = "profile";
const COOKIE = "cookie";

const profile = ref<any>(null);
const cookie = ref<string | null>(null);
const isLogin = computed(() => !!profile.value && !!cookie.value);

async function restore(cb?: (...args) => Promise<any>) {
  const savedProfile = await api.get(PROFILE, null);
  profile.value = savedProfile ? JSON.parse(savedProfile) : null;
  cookie.value = await api.get(COOKIE, null);
  cb?.();
}

async function save(data: { profile: any; cookie: string }) {
  if (!data) return;
  profile.value = data.profile;
  cookie.value = data.cookie;
  await api.set(PROFILE, JSON.stringify(data.profile));
  await api.set(COOKIE, data.cookie);
}

async function clear() {
  await api.remove(PROFILE);
  await api.remove(COOKIE);
  profile.value = null;
  cookie.value = null;
}

export const useAuthStore = () => ({
  isLogin,
  profile,
  cookie,
  restore,
  save,
  clear,
});
