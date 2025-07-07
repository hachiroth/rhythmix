import { ElectronAPI } from "@electron-toolkit/preload";
import type { TypedNeteaseCloudMusicApi } from "@typed/ncm-typed";
import type { TypedElectronStoreApi } from "@typed/store-typed";
import type { TypedWindowAction } from "@typed/window-action-typed";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: typeof TypedNeteaseCloudMusicApi &
      TypedElectronStoreApi &
      TypedWindowAction;
  }
}
