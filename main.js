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
const createMenu = require(path.join(__dirname, '/modules/menu.js'));
const createSystemTray = require(path.join(__dirname, '/modules/tray.js'));

let pluginName;
let iconName;
switch (process.platform) {
  case "win32":
    iconName = "\\resources\\Favicon.png";
    if (process.arch == "ia32") {
      // Pepper Flash Player 32-bit 32_0_0_371
      pluginName = "\\resources\\pepflashplayer_32.dll";
    } else {
      // Pepper Flash Player 64-bit 32_0_0_371
      pluginName = "\\resources\\pepflashplayer_64.dll";
    }
    break;
  case "darwin":
    // Plugin not updated
    iconName = "/resources/Favicon.png";
    pluginName = "/resources/PepperFlashPlayer.plugin";
    break;
  case "linux":
    iconName = "/resources/Favicon.png";
    if (process.arch == "ia32") {
      // Plugin not updated
      pluginName = "/resources/libpepflashplayer_32.so";
    } else if (process.arch == "armv7l") {
      // Plugin not updated
      pluginName = "/resources/libpepflashplayer_armv7l.so";
    } else {
      // Plugin not updated
      pluginName = "/resources/libpepflashplayer_64.so";
    }
    break;
}

let pluginPath = process.env.ELECTRON_START_URL
  ? path.join(__dirname, pluginName)
  : __dirname.replace("app.asar", "app.asar.unpacked") + pluginName;

let iconPath = process.env.ELECTRON_START_URL
  ? path.join(__dirname, iconName)
  : __dirname.replace("app.asar", "app.asar.unpacked") + iconName;

let icon = nativeImage.createFromPath(iconPath);

function returnPath() {
  return pluginPath;
}

ipcMain.on("asynchronous-message", (event, arg) => {
  event.sender.send("asynchronous-reply", returnPath());
});

app.commandLine.appendSwitch("ppapi-flash-path", pluginPath);

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
//      preload: path.join(__dirname, 'index.js'),
      nodeIntegration: true,
      contextIsolation: false,
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
  
  app.on('activate', () => {
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
