// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require("electron");

// window and tray menu events
// https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-3-main-to-renderer
contextBridge.exposeInMainWorld("myAPI", {
  onHotkey: (listener) => { ipcRenderer.on("hotkey", (_event, message) => listener(message)); }
});
