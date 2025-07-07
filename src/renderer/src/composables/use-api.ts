import NeteaseCloudMusic from "@renderer/libs/netease-cloud-music";

const windowApi = {
  close: window.api.close,
  minimize: window.api.minimize,
  toggle: window.api.toggle,
  onMaximizeChanged: window.api.onMaximizeChanged,
};

export default function useApi() {
  return {
    ...NeteaseCloudMusic.init(),
    ...windowApi,
  };
}
