import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import NeteaseCloudMusicApi from "NeteaseCloudMusicApi";
import type Store from "electron-store";
import type { TypedElectronStoreApi } from "@typed/store-typed";

function checkVersions() {
  console.log("Electron version: ", process.versions.electron);
  console.log("Chrome version: ", process.versions.chrome);
}

let store: Store;
async function createWindow() {
  checkVersions();
  const { default: Store } = await import("electron-store");
  store = new Store();
  console.log("Loading file: ", join(__dirname, "../renderer/index.html"));
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 640,
    frame: false,
    show: false,
    minWidth: 1024,
    minHeight: 640,
    autoHideMenuBar: true,
    title: "Rhythmix",
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  ipcMain.on("window:close", () => {
    mainWindow?.close();
  });

  ipcMain.on("window:minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.on("window:toggle", () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  mainWindow.on("maximize", () => {
    mainWindow?.webContents.send("window:maximized-changed", true);
  });

  mainWindow.on("unmaximize", () => {
    mainWindow?.webContents.send("window:maximized-changed", false);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const storeMap: Record<keyof TypedElectronStoreApi, Function> = {
  set: (key, value) => store.set(key, value),
  get: (key) => store.get(key),
  remove: (key) => store.delete(key),
  clear: () => store.clear(),
};

ipcMain.handle("api", async (_, method, ...args) => {
  let fn = storeMap[method] ?? NeteaseCloudMusicApi[method];
  try {
    const response = await fn(...args);
    if (response?.status !== 200 && response?.status !== undefined)
      throw new Error("NeteaseCloudMusicApi error: ", response);
    return response;
  } catch (error) {
    console.error("Main process error on handle 'api' method. ", error);
  }
});
