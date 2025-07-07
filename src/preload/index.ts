import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import NeteaseCloudMusicApi from "NeteaseCloudMusicApi";
import type { TypedElectronStoreApi } from "@typed/store-typed";
import type { TypedWindowAction } from "@typed/window-action-typed";

const StoreApi: TypedElectronStoreApi = {
  set: (key, value) => ipcRenderer.invoke("api", "set", key, value),
  get: (key, defaultValue) =>
    ipcRenderer.invoke("api", "get", key, defaultValue),
  remove: (key) => ipcRenderer.invoke("api", "remove", key),
  clear: () => ipcRenderer.invoke("api", "clear"),
};

const WindowApi: TypedWindowAction = {
  close: () => ipcRenderer.send("window:close"),
  minimize: () => ipcRenderer.send("window:minimize"),
  toggle: () => ipcRenderer.send("window:toggle"),
  onMaximizeChanged: (callback) => {
    ipcRenderer.on("window:maximized-changed", (_, maximized: boolean) => {
      callback(maximized);
    });
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld(
      "api",
      Object.keys(NeteaseCloudMusicApi).reduce(
        (acc, cur) => {
          if (typeof acc[cur] === "function") {
            acc[cur] = (...args) => ipcRenderer.invoke("api", cur, ...args);
          }
          return acc;
        },
        { ...NeteaseCloudMusicApi, ...StoreApi, ...WindowApi }
      )
    );
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
