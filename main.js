const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut,
  MenuItem,
  ipcMain,
  nativeImage
} = require("electron");
const isDev = false;
const path = require("path");
const fs = require("fs");
const createMenu = require(path.join(__dirname, "/modules/menu.js"));
const createSystemTray = require(path.join(__dirname, "/modules/tray.js"));


let iconName;

if (process.platform == "win32") {
  iconName = "\\resources\\Favicon.png";
} else {
  iconName = "/resources/Favicon.png";
}

let iconPath = process.env.ELECTRON_START_URL
  ? path.join(__dirname, iconName)
  : __dirname.replace("app.asar", "app.asar.unpacked") + iconName;

let icon = nativeImage.createFromPath(iconPath);

function createWindow() {
  const { screen } = require("electron");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  let s_height = parseInt(height / 240 - 1) * 240;
  let s_width = (s_height * 4) / 3;

  const win = new BrowserWindow({
    icon: icon,
    show: false,
    height: s_height + 61,
    width: s_width,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  win.setMenu(null);

  win.once("ready-to-show", () => {
    if (isDev) {
      win.webContents.openDevTools();
    }
    win.show();
  });

  win.loadFile("index.html");

  return win;
}

let tray;

app.whenReady().then(() => {
  win = createWindow();
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
  
  if ((process.platform == "win32")
    || (process.platform == "linux")) {
    tray = createSystemTray(win, icon);
  }
  createMenu(win);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    try {
      if ((process.platform == "win32")
        || (process.platform == "linux")) {
        tray.destroy();
      }
    } catch (e) {
      console.log("error in tray destroy");
      console.log(e);
    }
    app.quit();
  }
});
